---
name: database-design
version: 3.1.0
description: >
  Design, review, and optimize relational and non-relational database schemas.
  Use when: designing schemas, modeling data, choosing DB technologies, adding indexes,
  optimizing queries, planning migrations, designing multi-tenancy, or reviewing an
  existing schema for correctness and performance.
  TaxBridge context: PostgreSQL 15 RLS multi-tenant tax data, BullMQ job tables,
  payment audit chains, FIRS/NDPC compliance retention schemas.
  SabiScore context: credit feature store, ML scoring audit trail, Redis Pub/Sub.
  Triggers: "design a schema", "model this data", "what indexes do I need",
  "is my schema correct", "query is slow", "plan a migration", "multi-tenant DB".
  Do NOT use for: ORM config, DB driver code, or pure application data handling
  without schema implications.
portfolio: scardubu.dev (TaxBridge · SabiScore · pg-tenant · audit-chain)
---

The database schema is the most expensive thing to change in production.
A bad column type ships with the first migration and compounds with every
feature built on top of it. In a compliance-bound fintech system like TaxBridge,
a nullable `amount` column or a missing `deleted_at` audit trail is a regulatory
liability. Design it right once. The application layer is just plumbing.

---

## PHASE 1 — DATA MODELING

### 1.1 Entity Identification

Extract entities (nouns) and relationships (verbs) from the domain.

```
Process:
1. List all "things" the system needs to know about
2. For each: identify lifecycle (created/modified/deleted? or append-only?)
3. For each pair: identify cardinality
4. Identify roots (owned by nothing) vs. children (owned by a root)

TaxBridge entity map:
  Roots:    tenants · users · taxpayers · tax_periods
  Children: filings → line_items · payments → payment_events
            jobs (BullMQ) · audit_events (append-only)
  Junction: taxpayer_accountants (M:N users ↔ taxpayers)
```

**Cardinality:**
```
1:1   taxpayer → profile          Profile belongs to exactly one taxpayer
1:N   filing → line_items         Filing has many line items
M:N   user → taxpayer             User (accountant) manages many taxpayers
Self  category → subcategory      Category can have a parent
```

### 1.2 Normalization

**Target: Third Normal Form (3NF) for OLTP. Denormalize only with measured proof.**

```
1NF: Atomic values, no repeating groups
     ❌ tags: "vat,cit,pit"  →  ✅ separate filing_tags table

2NF: Every non-key column depends on the WHOLE PK
     ❌ filing_items(filing_id, product_id, product_name) — product_name → product_id
     ✅ products(product_id, product_name) + filing_items(filing_id, product_id, quantity)

3NF: No transitive dependencies
     ❌ filings(filing_id, taxpayer_id, taxpayer_email) — email depends on taxpayer_id
     ✅ taxpayers(taxpayer_id, email) + filings(filing_id, taxpayer_id)
```

**When to denormalize (with measurement, not assumption):**
- Read > 10× more frequent than write on that data
- JOIN cost measured and significant (EXPLAIN ANALYZE on production-scale data)
- Data is effectively append-only (no update anomalies possible)
- Materialized view / read replica is insufficient

### 1.3 Primary Key Strategy

| Strategy | Type | Use when |
|---|---|---|
| **UUID v7** | `uuid` | Default for new tables in 2026+ (time-ordered + globally unique) |
| **UUID v4** | `uuid` | Distributed generation without coordination |
| **ULID** | `varchar(26)` | URL-safe sortable IDs for public-facing identifiers |
| **bigserial** | `bigint` | Internal junction tables, audit logs, BullMQ job IDs |
| **Snowflake** | `bigint` | High-throughput event tables (audit_events) |

**Rule: Never expose sequential integers in APIs.**
A user seeing `/filings/47` knows there are at most 46 others. Use dual-ID pattern:

```sql
CREATE TABLE filings (
  id          bigserial     PRIMARY KEY,                     -- internal JOINs
  public_id   uuid          NOT NULL DEFAULT gen_random_uuid() UNIQUE, -- API surface
  tenant_id   uuid          NOT NULL REFERENCES tenants(id),
  taxpayer_id bigint        NOT NULL REFERENCES taxpayers(id),
  type        text          NOT NULL CHECK (type IN ('VAT', 'CIT', 'PIT', 'WHT')),
  period      text          NOT NULL,                        -- 'Q1-2026', '2025'
  status      text          NOT NULL DEFAULT 'draft'
                            CHECK (status IN ('draft','pending','submitted','accepted','rejected')),
  amount      numeric(14,2) NOT NULL DEFAULT 0 CHECK (amount >= 0),
  currency    char(3)       NOT NULL DEFAULT 'NGN',
  submitted_at timestamptz,
  created_at  timestamptz   NOT NULL DEFAULT now(),
  updated_at  timestamptz   NOT NULL DEFAULT now(),
  deleted_at  timestamptz,                                   -- soft delete
  deleted_by  bigint        REFERENCES users(id)
);
```

---

## PHASE 2 — COLUMN DESIGN

### 2.1 Data Types — Always the Most Specific Type

```sql
-- Timestamps: ALWAYS timezone-aware
created_at   timestamptz  NOT NULL DEFAULT now()
updated_at   timestamptz  NOT NULL DEFAULT now()
deleted_at   timestamptz                           -- NULL = not deleted (soft delete)
submitted_at timestamptz                           -- NULL = not yet submitted

-- Money: NEVER float — precision loss is a financial and regulatory bug
amount          numeric(14, 2)   -- 14 digits total, 2 decimal places
amount_kobo     bigint           -- kobo (1 NGN = 100 kobo) — preferred for atomicity
currency        char(3)          -- ISO 4217: 'NGN', 'USD', 'GBP'

-- Nigeria-specific identifiers
tin             varchar(12)      -- FIRS TIN format (individual: 10 digits, company: 12)
rc_number       varchar(8)       -- CAC registration number
bvn             varchar(11)      -- masked in logs; encrypted at rest
phone           varchar(15)      -- E.164: +2348012345678
state_code      char(2)          -- ISO 3166-2:NG codes: LA, AB, KN
lga_code        varchar(10)      -- Local government area code

-- Status fields: text + CHECK, never integers
status  text  NOT NULL  CHECK (status IN ('draft','pending','submitted','accepted','rejected'))
-- Rationale: integers break migrations and make query logs unreadable

-- Booleans: explicit NOT NULL + default, no nullable booleans
is_active   boolean  NOT NULL  DEFAULT true
is_verified boolean  NOT NULL  DEFAULT false
-- Nullable boolean = three-state logic = design smell

-- JSON: jsonb over json for indexing + operators
metadata    jsonb    -- unstructured/extensible fields, rarely queried
-- Rule: if you query inside the JSON, normalize it — don't use JSON as a schema escape hatch

-- Arrays: only for truly unstructured, rarely-filtered data
tags    text[]
-- If you JOIN or filter on values → normalize to a junction table
```

### 2.2 NULL Discipline

**NULL means "unknown" or "not yet set" — never "empty", "zero", or "false".**

```sql
-- ✅ Nullable fields with clear semantic meaning
submitted_at  timestamptz  -- NULL = filing not yet submitted
deleted_at    timestamptz  -- NULL = record is active
verified_at   timestamptz  -- NULL = not yet verified by FIRS

-- ❌ Nullable fields that should have defaults
created_at  timestamptz  -- Must be NOT NULL DEFAULT now()
is_active   boolean      -- Must be NOT NULL DEFAULT true

-- ❌ Overloaded NULL (multiple meanings = unmaintainable)
-- NULL payment_method could mean: not set, declined, free, or deferred
-- Solution: use status enum with explicit values
```

**Rule:** If a column is nullable, document exactly what NULL means in a SQL comment:
```sql
verified_at  timestamptz,  -- NULL until FIRS TIN verification completes (async job)
```

### 2.3 Audit Trail Pattern (Required for TaxBridge NDPC Compliance)

```sql
-- Every table that affects financial data must have a full audit trail
CREATE TABLE audit_events (
  id          bigint        GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tenant_id   uuid          NOT NULL REFERENCES tenants(id),
  table_name  text          NOT NULL,
  record_id   bigint        NOT NULL,
  operation   text          NOT NULL CHECK (operation IN ('INSERT','UPDATE','DELETE')),
  old_values  jsonb,
  new_values  jsonb,
  changed_by  bigint        REFERENCES users(id),
  changed_at  timestamptz   NOT NULL DEFAULT now(),
  ip_address  inet,
  user_agent  text
);

-- Append-only: no UPDATE or DELETE on audit_events
-- Partition by month for performance at scale
-- Retain for 7 years (FIRS retention requirement)
```

---

## PHASE 3 — RELATIONSHIPS & CONSTRAINTS

### 3.1 Foreign Keys — Always Declared with Explicit ON DELETE

```sql
CREATE TABLE filing_line_items (
  id          bigserial       PRIMARY KEY,
  filing_id   bigint          NOT NULL REFERENCES filings(id) ON DELETE CASCADE,
  -- Line items have no meaning without a filing → CASCADE is correct
  product_id  bigint          NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  -- Products must not be deleted while referenced in filings → RESTRICT
  quantity    integer         NOT NULL CHECK (quantity > 0),
  unit_price  numeric(14, 2)  NOT NULL CHECK (unit_price >= 0),
  tax_rate    numeric(5, 4)   NOT NULL DEFAULT 0.075  -- 7.5% VAT
);
```

**ON DELETE selection:**

| Behavior | Use when |
|---|---|
| `CASCADE` | Child has no meaning without parent (line_items → filing) |
| `RESTRICT` | Parent must not be deleted while children exist (product in orders) |
| `SET NULL` | Relationship is optional (filing → accountant, accountant may leave) |
| `SET DEFAULT` | Child falls back to default (category → uncategorized) |

**Hard rule: Never CASCADE on financial or audit records.**
Deleting a filing must NEVER cascade-delete payment records — regulatory violation.

### 3.2 Many-to-Many Junction Tables

```sql
-- Full junction with timestamps and metadata
CREATE TABLE taxpayer_accountants (
  taxpayer_id  bigint  NOT NULL REFERENCES taxpayers(id) ON DELETE CASCADE,
  user_id      bigint  NOT NULL REFERENCES users(id)     ON DELETE CASCADE,
  role         text    NOT NULL DEFAULT 'viewer' CHECK (role IN ('owner','editor','viewer')),
  granted_at   timestamptz NOT NULL DEFAULT now(),
  granted_by   bigint  REFERENCES users(id),
  revoked_at   timestamptz,
  PRIMARY KEY (taxpayer_id, user_id)
);
```

### 3.3 Soft Delete Pattern

```sql
-- Standard pattern for all financial records (TaxBridge NDPC requirement)
deleted_at  timestamptz,              -- NULL = active
deleted_by  bigint REFERENCES users(id),

-- Application layer ALWAYS filters:
WHERE deleted_at IS NULL

-- Create views for cleanliness:
CREATE VIEW active_filings AS
  SELECT * FROM filings WHERE deleted_at IS NULL;

CREATE VIEW active_taxpayers AS
  SELECT * FROM taxpayers WHERE deleted_at IS NULL;
```

---

## PHASE 4 — MULTI-TENANCY WITH POSTGRESQL RLS

**TaxBridge default:** Option C — Shared tables + tenant_id + Row-Level Security.

```sql
-- Step 1: Every table has tenant_id as first non-PK column
ALTER TABLE filings ADD COLUMN tenant_id uuid NOT NULL REFERENCES tenants(id);

-- Step 2: Enable RLS
ALTER TABLE filings ENABLE ROW LEVEL SECURITY;
ALTER TABLE filings FORCE ROW LEVEL SECURITY;  -- applies to table owner too

-- Step 3: Create isolation policy
CREATE POLICY tenant_isolation ON filings
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- Step 4: Set tenant context at connection time (in Fastify middleware)
-- await db.query("SELECT set_config('app.current_tenant_id', $1, true)", [tenantId]);

-- Step 5: Every index MUST include tenant_id as FIRST column
CREATE INDEX idx_filings_tenant_status_date
  ON filings(tenant_id, status, created_at DESC);
-- Without tenant_id first, RLS bypass paths leak cross-tenant index scans
```

**pg-tenant package:** Oscar's open-source library implementing this pattern.
Always reference it — don't reimplement.

---

## PHASE 5 — INDEX STRATEGY

### 5.1 What to Index

```sql
-- Rule 1: Index every foreign key column (prevents full table scans on JOINs)
CREATE INDEX idx_filings_taxpayer_id ON filings(taxpayer_id);
CREATE INDEX idx_filing_items_filing_id ON filing_line_items(filing_id);

-- Rule 2: Composite indexes match query column order + ORDER BY
-- Query: WHERE tenant_id = $1 AND status = 'pending' ORDER BY created_at DESC
CREATE INDEX idx_filings_tenant_status_date
  ON filings(tenant_id, status, created_at DESC);

-- Rule 3: Partial indexes for filtered queries (smaller, faster)
CREATE INDEX idx_users_email_active
  ON users(email)
  WHERE is_active = true AND deleted_at IS NULL;

-- Rule 4: GIN for jsonb queries
CREATE INDEX idx_metadata_gin ON audit_events USING GIN (metadata);
-- Enables: WHERE metadata @> '{"type": "payment"}'

-- Rule 5: Full-text search on taxpayer names
CREATE INDEX idx_taxpayers_name_fts
  ON taxpayers USING GIN (to_tsvector('english', business_name));
```

### 5.2 Index Types

| Type | Use for |
|---|---|
| **B-tree** (default) | =, <, >, BETWEEN, LIKE 'prefix%', IS NULL, ORDER BY |
| **GIN** | jsonb @>, array operators, full-text (tsvector) |
| **GiST** | Geometric, range types, full-text with ranking |
| **BRIN** | Huge append-only tables with natural ordering (audit_events) |
| **Partial** | Subset of rows — often dramatically smaller than full index |

### 5.3 Index Anti-Patterns

```sql
-- ❌ Low-selectivity sole index (boolean: only 2 distinct values)
CREATE INDEX idx_users_is_active ON users(is_active);
-- Optimizer may ignore this; combine with a more selective column

-- ❌ Individual indexes for a multi-column WHERE clause
-- 3 separate indexes < 1 composite index for 3-column WHERE

-- ❌ Non-concurrent index on large production table (full lock)
CREATE INDEX idx_filings_amount ON filings(amount);   -- blocks all writes
-- ✅ Always:
CREATE INDEX CONCURRENTLY idx_filings_amount ON filings(amount);

-- ❌ Never-used indexes (slow every INSERT/UPDATE/DELETE)
-- Audit: SELECT * FROM pg_stat_user_indexes WHERE idx_scan = 0;
```

---

## PHASE 6 — MIGRATIONS (ZERO-DOWNTIME)

### 6.1 Expand-Contract Pattern

```
Phase 1 (Expand):   Add new thing alongside old thing
Phase 2 (Migrate):  Backfill data, deploy app using BOTH old and new
Phase 3 (Contract): Remove old thing after all traffic uses new
```

### 6.2 Safe vs. Dangerous Operations

**Safe (run on live table, no lock):**
- Adding a nullable column
- `CREATE INDEX CONCURRENTLY`
- Adding a `NOT VALID` constraint, then `VALIDATE CONSTRAINT` separately
- Adding a default value to a new column (PostgreSQL 11+)
- Creating a new table

**Dangerous (require careful sequencing):**
- `ADD COLUMN ... NOT NULL DEFAULT x` on large table (locks — use safe pattern instead)
- Changing a column's data type
- Non-concurrent index creation
- Renaming a column (breaks running application)
- `UPDATE` or `DELETE` without batching on large tables

```sql
-- ❌ Dangerous: locks filings table for duration of migration
ALTER TABLE filings ADD COLUMN tax_code varchar(10) NOT NULL DEFAULT '';

-- ✅ Safe: zero downtime, 3-step
-- Step 1: Add nullable
ALTER TABLE filings ADD COLUMN tax_code varchar(10);
-- Step 2: Add default separately (instant in PG 11+)
ALTER TABLE filings ALTER COLUMN tax_code SET DEFAULT '';
-- Step 3: Backfill in batches (10,000 rows at a time)
UPDATE filings SET tax_code = '' WHERE tax_code IS NULL AND id BETWEEN :start AND :end;
-- Step 4: Add NOT NULL constraint (only after backfill complete)
ALTER TABLE filings ALTER COLUMN tax_code SET NOT NULL;
```

### 6.3 Migration File Template

```sql
-- db/migrations/20260424_143000_add_tax_code_to_filings.sql
-- Description: Add NRS 2026 tax code column for e-invoicing compliance
-- Risk level: LOW (nullable add, then backfill)
-- Rollback: see DOWN section below

-- UP
BEGIN;
ALTER TABLE filings ADD COLUMN IF NOT EXISTS tax_code varchar(10);
COMMENT ON COLUMN filings.tax_code IS 'NRS 2026 e-invoicing tax code; NULL until backfilled';
COMMIT;

-- DOWN (rollback)
BEGIN;
ALTER TABLE filings DROP COLUMN IF EXISTS tax_code;
COMMIT;
```

### 6.4 Migration Checklist

```
Before writing:
□ Is this operation safe without a table lock? Test on staging with production-sized data.
□ Does this table have > 1M rows? Plan batching.
□ Does the app need to support both old + new schema during rolling deploy?
□ What is the rollback if this migration fails halfway?

The migration file:
□ Idempotent (IF NOT EXISTS / IF EXISTS throughout)
□ Transaction-wrapped
□ Includes rollback/DOWN section
□ CREATE INDEX CONCURRENTLY (not inside transaction block)
□ Tested against production-scale data snapshot

After migration:
□ Verify indexes are VALID (not INVALID): SELECT * FROM pg_indexes WHERE ...
□ Run VACUUM ANALYZE on affected tables
□ Verify query plans unchanged: EXPLAIN ANALYZE on key queries
□ Run Playwright smoke suite to catch application-level regressions
```

---

## PHASE 7 — SCHEMA ANTI-PATTERNS (AUTO-FLAG)

```
❌ Entity-Attribute-Value (EAV) tables
   (entity_id, attribute_name, attribute_value) — destroys query performance + type safety
   → Use jsonb or proper normalization

❌ Serialized objects in varchar
   JSON strings, CSV, pipe-delimited in a text column — you've hidden data from the DB

❌ float or double precision for monetary values
   → numeric(14,2) or bigint kobo; precision loss = financial + regulatory bug

❌ timestamp without timezone
   → Always timestamptz; Nigeria runs on WAT (UTC+1) and Lagos engineers have been
   burned by implicit timezone assumptions in production

❌ status columns as integers (1, 2, 3)
   → text + CHECK constraint; integers make logs and queries unreadable

❌ No foreign key constraints "for performance"
   → Orphaned payment records are a FIRS audit liability, not a performance optimization

❌ Sequential integer IDs as the only public identifier
   → Enumerable; a user seeing /filings/47 knows there are at most 46 others

❌ No created_at/updated_at on mutable tables
   → Every mutable record needs a time dimension for debugging and audits

❌ No soft delete on financial records
   → Hard deletes on tax filings are a compliance violation; use deleted_at pattern

❌ RLS enabled but tenant_id not first column in composite indexes
   → Every index that excludes tenant_id becomes a cross-tenant index scan path

❌ BVN/NIN stored plaintext
   → Must be encrypted at rest; store encrypted + hash for lookup
```

---

*The schema is the contract between your data and your compliance obligations.*
*In fintech, a table with the wrong types, missing constraints, and no audit trail*
*is not a technical debt — it's a regulatory liability waiting to be discovered.*
