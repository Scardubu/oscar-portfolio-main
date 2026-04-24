---
name: api-design
version: 3.1.0
description: >
  Design, review, and implement production-grade REST, GraphQL, and RPC APIs.
  Use when: designing API contracts, writing OpenAPI/AsyncAPI specs, reviewing
  endpoint structure, versioning APIs, designing error schemas, modeling resources,
  planning pagination, handling auth flows, or thinking through rate limiting and
  idempotency. Also: "how should I structure this endpoint", "what's the right way
  to model this resource", "review my API", "design a webhook system".
  TaxBridge context: Paystack/Remita/Flutterwave payment APIs, BullMQ job endpoints,
  VAT/CIT/PIT tax filing endpoints, USSD callback handlers.
  Do NOT use for: pure frontend work, DB schema only (no API surface), or
  infrastructure provisioning with no API design component.
portfolio: scardubu.dev (TaxBridge · SabiScore · Hashablanca)
---

Production APIs are permanent contracts. A bad name, a wrong status code, or a
missing idempotency key ships to clients and lives forever. In a fintech context
(TaxBridge, SabiScore), a flawed API contract can mean duplicate payments, missed
compliance events, or regulatory audit failures. Every API decision here is treated
as an architecture decision — because in production, it is.

---

## PHASE 1 — CONTRACT-FIRST THINKING

Before writing a single route, resolve the contract. Code is an implementation
detail. The contract is the product.

### 1.1 Identify the API Style

Choose ONE primary style per service boundary.

| Style | Best for | Avoid when |
|---|---|---|
| **REST** | CRUD resources, public APIs, payment integrations | Complex queries needing deep relationship traversal |
| **GraphQL** | Complex relational data, mobile BFF, bandwidth efficiency | Simple CRUD, public APIs needing CDN cache, teams new to GQL |
| **gRPC/Protobuf** | Internal service-to-service, BullMQ job RPC, streaming | Public APIs, browsers (without grpc-web) |
| **AsyncAPI/Events** | Webhooks (Paystack, Remita callbacks), pub/sub (Redis) | Synchronous request-response flows |
| **JSON-RPC** | Tooling APIs, USSD gateway bridges | Resource-oriented data models |

**TaxBridge default:** REST for external (Paystack/Remita/client), AsyncAPI for
webhook receivers, gRPC for internal Fastify → BullMQ service calls.

### 1.2 Resource Modeling (REST)

**Nouns, not verbs. Resources, not actions.**

```
✅ POST   /v1/filings              (create tax filing)
✅ GET    /v1/filings/{id}         (read)
✅ PATCH  /v1/filings/{id}         (partial update)
✅ DELETE /v1/filings/{id}         (soft delete)
✅ POST   /v1/filings/{id}/submit  (action — documented exception)
✅ POST   /v1/payments/{id}/refund (action with side effects)

❌ POST   /createFiling
❌ GET    /getFilingById
❌ POST   /filingActions
```

**Naming rules:**
- Plural nouns for collections: `/filings`, `/taxpayers`, `/line-items`
- kebab-case for multi-word: `/payment-methods`, `/tax-periods`
- Consistent case: never `/users/{userId}/Filings`
- Sub-resources for ownership: `/taxpayers/{id}/filings`
- Maximum depth 3: `/a/{id}/b/{id}/c/{id}` → flatten

**Action endpoints (documented exceptions):**
```
POST /v1/accounts/{id}/activate      state transition
POST /v1/invoices/{id}/void          irreversible — requires 2FA confirmation
POST /v1/payments/{id}/refund        side effects — idempotency key required
POST /v1/reports/generate            async trigger → returns job_id
POST /v1/tin-verifications           FIRS/Youverify proxy, cached 24h
```

### 1.3 Versioning Strategy

**Recommended for TaxBridge:** URL path versioning (`/v1/`, `/v2/`).
Most explicit, easiest to route, simplest for Paystack/Remita SDK consumers.

**Version lifecycle rules:**
- Never modify a field's type in a live version
- Never remove a field without a deprecation cycle (minimum 6 months)
- Never rename a field — add new name, keep old, deprecate with date
- Use `Sunset` header: `Sunset: Sat, 31 Dec 2026 23:59:59 GMT`
- Log all deprecated endpoint hits (Sentry + structured log)

---

## PHASE 2 — REQUEST/RESPONSE DESIGN

### 2.1 HTTP Method Semantics

| Method | Semantics | Idempotent | Safe | Notes |
|---|---|---|---|---|
| GET | Read | ✅ | ✅ | Never use for mutations (USSD callbacks excepted) |
| POST | Create / action | ❌ | ❌ | Add idempotency key for payment/filing endpoints |
| PUT | Full replace | ✅ | ❌ | Rare — use PATCH for partial updates |
| PATCH | Partial update | ✅* | ❌ | JSON Merge Patch preferred |
| DELETE | Remove | ✅ | ❌ | Soft delete in TaxBridge (audit trail required) |
| HEAD | Metadata only | ✅ | ✅ | Webhook health checks |

### 2.2 Request Design

```typescript
// Body principles:
// - Content-Type: application/json always (multipart for file uploads)
// - Dates: ISO 8601 always — "2026-04-24T14:30:00+01:00" (WAT offset)
// - Money: string + currency, never float — EVER
// - Enums: strings, never integers

// ❌ Never
{ "amount": 1500.50, "date": 1714000800, "status": 2 }

// ✅ Always
{
  "amount": "1500.00",
  "currency": "NGN",
  "date": "2026-04-24T14:30:00+01:00",
  "status": "pending"
}
```

**Query parameters for GET:**
```
Filtering:    GET /v1/filings?status=pending&taxpayer_id=tp_3kJ9
Sorting:      GET /v1/filings?sort=created_at&order=desc
Pagination:   GET /v1/filings?cursor=eyJ...&limit=20
Search:       GET /v1/filings?q=acme+ltd
Sparse:       GET /v1/filings?fields=id,amount,status,period
Tax period:   GET /v1/filings?tax_year=2025&period=Q1&type=VAT
```

### 2.3 Response Envelope (Consistent Across ALL Endpoints)

```typescript
// Success (single resource)
{
  "data": { /* resource */ },
  "meta": { "request_id": "req_7f3a9b2c" },
  "errors": null
}

// Success (collection)
{
  "data": [ /* resources */ ],
  "meta": {
    "total": 1240,
    "limit": 20,
    "next_cursor": "eyJpZCI6MTIzfQ==",
    "has_more": true,
    "request_id": "req_7f3a9b2c"
  },
  "errors": null
}

// Error
{
  "data": null,
  "errors": [
    {
      "code": "VALIDATION_ERROR",
      "message": "TIN must be 8 digits for individual taxpayers",
      "field": "tin",
      "docs": "https://api.taxbridge.app/errors/VALIDATION_ERROR",
      "trace_id": "req_7f3a9b2c"
    }
  ],
  "meta": { "request_id": "req_7f3a9b2c" }
}
```

### 2.4 Pagination: Cursor-Based by Default

```
Cursor = base64(JSON({ id: last_seen_id, created_at: last_ts }))
GET /v1/filings?cursor=eyJpZCI6MTIzfQ==&limit=20

Rules:
- Cursor is OPAQUE to clients — never document internal format
- Cursor TTL: 24 hours
- limit: max 100, default 20
- Return has_more: true even when total is unknown (avoids COUNT(*) on large tables)
```

**When to use offset:** Admin UIs, datasets < 10k rows, "jump to page" UX only.

### 2.5 HTTP Status Codes

**2xx:**
- `200 OK` — read, update (body returned)
- `201 Created` — resource created → include `Location: /v1/filings/{id}`
- `202 Accepted` — async job started → include `{ "job_id": "job_abc", "poll_url": "..." }`
- `204 No Content` — delete, update (no body)

**4xx:**
- `400 Bad Request` — malformed JSON, validation failure
- `401 Unauthorized` — missing/invalid auth token
- `403 Forbidden` — authenticated but no permission for THIS resource
- `404 Not Found` — resource missing (or hidden for auth: prevents enumeration)
- `409 Conflict` — duplicate idempotency key body mismatch
- `410 Gone` — resource permanently deleted (use for voided invoices)
- `422 Unprocessable` — syntactically valid but semantically invalid (TIN format error)
- `429 Too Many Requests` — include `Retry-After` header

**5xx:**
- `500 Internal Server Error` — never leak stack traces (Sentry captures, user gets trace_id)
- `502 Bad Gateway` — upstream (Paystack/FIRS/Youverify) failed
- `503 Service Unavailable` — maintenance → include `Retry-After`
- `504 Gateway Timeout` — upstream timeout (BullMQ job queue or FIRS API)

**Hard rule: Never `200 OK` with an error body. Never.**

---

## PHASE 3 — ERROR SCHEMA

### 3.1 Error Code Taxonomy

```
Format: DOMAIN_SPECIFIC_ERROR (SCREAMING_SNAKE_CASE, stable, never rename)

System:       INTERNAL_ERROR · SERVICE_UNAVAILABLE · TIMEOUT · RATE_LIMIT_EXCEEDED
Auth:         UNAUTHENTICATED · FORBIDDEN · TOKEN_EXPIRED · TOKEN_INVALID · MFA_REQUIRED
Validation:   VALIDATION_ERROR · REQUIRED_FIELD · INVALID_FORMAT · OUT_OF_RANGE
Resource:     NOT_FOUND · ALREADY_EXISTS · CONFLICT · GONE · LOCKED
Payments:     PAYMENT_FAILED · INSUFFICIENT_FUNDS · CARD_DECLINED · WEBHOOK_DUPLICATE
Tax:          INVALID_TIN · PERIOD_ALREADY_FILED · FIRS_UNAVAILABLE · TIN_UNVERIFIED
Account:      ACCOUNT_SUSPENDED · SUBSCRIPTION_EXPIRED · QUOTA_EXCEEDED
Compliance:   NRS_VALIDATION_FAILED · CBN_RULE_VIOLATION · NDPC_CONSENT_REQUIRED
```

### 3.2 Validation Error Pattern (Return ALL Errors at Once)

```typescript
// ✅ Return all field errors simultaneously — never one at a time
{
  "data": null,
  "errors": [
    { "code": "REQUIRED_FIELD", "field": "tin", "message": "TIN is required" },
    { "code": "INVALID_FORMAT", "field": "tax_year", "message": "tax_year must be 4-digit integer" },
    { "code": "OUT_OF_RANGE",   "field": "amount", "message": "amount must be positive" }
  ]
}
```

---

## PHASE 4 — SECURITY DESIGN

### 4.1 Authentication Patterns

| Pattern | Use case |
|---|---|
| **Bearer JWT** | Client-facing sessions (mobile app, web dashboard) |
| **API Keys** | Server-to-server (Paystack webhooks, Remita callbacks, external integrations) |
| **OAuth 2.0 + PKCE** | Third-party app integrations, accountant portal delegated access |
| **mTLS** | Internal Fastify microservices in VPC (zero-trust) |

**API Key format:** `tbk_live_3kJ9mNpQ...` / `tbk_test_...`
Store only SHA-256 hash. Scoped permissions: `["filings:read", "payments:write"]`.

### 4.2 Authorization Model (TaxBridge RBAC)

```
Roles:  owner · accountant · viewer · api_client
owner:       full access to their tenant's data
accountant:  read/write filings, read payments (not refund)
viewer:      read-only across all resources
api_client:  scoped to declared permissions on API key
```

Return `403` when authenticated but unauthorized.
Return `404` when resource should be hidden entirely (prevents enumeration).

### 4.3 Rate Limiting (Headers on Every Response)

```
X-RateLimit-Limit:     1000
X-RateLimit-Remaining: 347
X-RateLimit-Reset:     1714000800
Retry-After:           60   (on 429 only)
```

**Tiers:** Unauthenticated: 100/hour by IP. Authenticated: 1000/minute per API key.
FIRS proxy endpoints: 50/minute (upstream constraint).

### 4.4 Webhook Security (Paystack / Remita Receivers)

```typescript
// Validate BOTH signature AND timestamp (5-minute window)
const sig = req.headers['x-paystack-signature'];
const ts  = req.headers['x-webhook-timestamp'];
const body = req.rawBody; // raw bytes, not parsed

if (Date.now() / 1000 - Number(ts) > 300) throw new Error('Replay attack');
const expected = crypto
  .createHmac('sha256', process.env.PAYSTACK_WEBHOOK_SECRET)
  .update(`${ts}.${body}`)
  .digest('hex');
if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected)))
  throw new Error('Invalid signature');
```

---

## PHASE 5 — IDEMPOTENCY & RELIABILITY

### 5.1 Idempotency Keys (Required for ALL Payment/Filing Endpoints)

```
POST /v1/payments
Idempotency-Key: a4b8c2d1-3e5f-4a7b-9c0d-2e4f6a8b0c1d

Server behavior:
- First request:  process + store result keyed to idempotency key (PostgreSQL)
- Duplicate:      return stored result — do NOT reprocess (critical for Paystack retries)
- Key TTL:        24 hours minimum
- Different body + same key: 422 IDEMPOTENCY_KEY_CONFLICT
- Store: keyed on (user_id, idempotency_key) with UNIQUE constraint
```

### 5.2 Webhook Delivery (Outbound — to Client Apps)

```typescript
const webhookPayload = {
  id:          "evt_3kJ9mNpQ",        // unique, stable
  type:        "filing.submitted",     // NEVER rename a shipped event type
  created:     "2026-04-24T14:30:00Z",
  api_version: "2026-01-01",
  data: {
    object: { /* full resource snapshot at event time */ }
  }
};

// Retry schedule: 1m → 5m → 30m → 2h → 8h → 24h (exponential)
// Disable endpoint after 5 consecutive failures, email owner
// Store delivery log for 30 days (NDPC audit trail requirement)
```

---

## PHASE 6 — OPENAPI 3.1 DOCUMENTATION STANDARD

**Minimum requirements per endpoint:**

```yaml
/v1/filings/{id}:
  get:
    summary: Retrieve a tax filing
    description: |
      Returns the filing identified by `id`.
      Returns 404 if the filing does not exist or belongs to another tenant.
      Filings in SUBMITTED or ACCEPTED status are read-only.
    tags: [filings]
    parameters:
      - name: id
        in: path
        required: true
        schema: { type: string, pattern: '^fil_[a-z0-9]{16}$' }
        example: fil_7fKpLmNqRs4x
    responses:
      '200':
        description: Filing retrieved
        content:
          application/json:
            schema: { $ref: '#/components/schemas/FilingResponse' }
            examples:
              pending_vat:
                summary: A pending VAT filing
                value:
                  data:
                    id: fil_7fKpLmNqRs4x
                    type: VAT
                    period: Q1-2026
                    status: pending
                    amount: "450000.00"
                    currency: NGN
      '401': { $ref: '#/components/responses/Unauthenticated' }
      '403': { $ref: '#/components/responses/Forbidden' }
      '404': { $ref: '#/components/responses/NotFound' }
    security: [{ bearerAuth: [] }]
    x-rate-limit: 1000/min
    x-idempotent: true
```

**Checklist per endpoint:**
```
□ Summary (one sentence, present tense)
□ Full description with edge cases and state machine rules
□ All parameters: type + example + constraints
□ All response codes including error codes
□ At least one realistic example per response (no "string", no "foo")
□ Error responses use shared $ref schemas
□ Auth requirement explicit
□ Rate limit x-extension documented
□ Deprecation notice if applicable (with Sunset date)
```

---

## PHASE 7 — ANTI-PATTERNS (AUTO-FLAG, BLOCK DELIVERY)

```
❌ GET /v1/users?action=delete          Mutation via GET — CDN will cache this
❌ POST /api/v1/getAllActiveFilings      Verb in resource name
❌ { "success": false, "data": {} }     Inconsistent envelope
❌ { "error": "something went wrong" }  Opaque error — useless for debugging
❌ { "amount": 1500.50 }               Float money — precision loss = financial bug
❌ { "created_at": 1714000800 }        Unix timestamp — use ISO 8601
❌ HTTP 200 { "error": true }           Lying status code
❌ { "user_id": 47 }                   Sequential integer IDs — enumerable
❌ Passwords in query strings           Appear in access logs, nginx logs, browser history
❌ Returning different shapes for the same endpoint by query param
❌ Silently ignoring unknown request fields (version mismatch becomes invisible)
❌ Not validating Paystack/Remita webhook signatures (replay attack surface)
```

---

*An API is a user interface for developers. In fintech, it is also a compliance*
*surface and an audit trail. Every field name, status code, and error message is*
*a permanent decision. Design it like one.*
