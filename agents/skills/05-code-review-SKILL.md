---
name: code-review
version: 3.1.0
description: >
  Perform thorough, expert-level code reviews across any language or framework.
  Use when: reviewing code for correctness, security, performance, or production
  readiness; spotting bugs; conducting security audits; evaluating refactoring;
  checking whether code matches the portfolio's TypeScript strict conventions.
  Portfolio context: Next.js 15 App Router (RSC vs client), Fastify 5 backend,
  PostgreSQL 15 + RLS, BullMQ job processing, Framer Motion animations,
  Playwright E2E tests, Zod validation, pnpm workspaces.
  Triggers: "review this", "what's wrong with", "is this production ready",
  "security audit", "spot the bug", "check my implementation", "refactor this",
  "feedback on my code", "code smell".
  Do NOT use for: generating new code from scratch, writing tests from scratch
  without existing code to review, or explaining code without evaluation.
stack: Next.js 15 · TypeScript strict · Fastify 5 · PostgreSQL 15 · Framer Motion 11
portfolio: scardubu.dev (TaxBridge · SabiScore · Hashablanca)
---

A great code review separates critical failures from style preferences, explains
the WHY behind every finding, and leaves the codebase AND the engineer better.
In a fintech context (TaxBridge), a missed SQL injection is a regulatory incident.
A missing idempotency check is a double-charge. Every severity judgment carries weight.

---

## PHASE 0 — TRIAGE & CONTEXT

Before commenting on a single line:

1. **Identify the language, runtime, and framework** (Next.js RSC? Fastify? React Native?)
2. **Identify production vs. prototype** (Different severity standards apply)
3. **Read the entire code once before writing a single finding** — prevents:
   - Flagging something fixed three lines later
   - Missing architectural issues while bikeshedding style
   - Redundant comments across related patterns
4. **Tag mentally on first pass:**
   - 🔴 Critical — blocks shipping, causes harm, security vulnerability
   - 🟠 Major — significant quality/safety risk, should fix before merge
   - 🟡 Minor — worth fixing, not blocking
   - 🔵 Suggestion — better approach exists, author's call
   - ⚪ Nit — style/format — mention once, never repeat

---

## PHASE 1 — CORRECTNESS (🔴 if broken)

### Logic Errors

```typescript
// 🔴 Off-by-one — skips last item
for (let i = 0; i < items.length - 1; i++) { ... }
// ✅ for (let i = 0; i < items.length; i++)

// 🔴 Inverted condition — rejects valid filings
if (filing.status !== 'pending') {
  await submitFiling(filing); // Only submits non-pending — backwards
}

// 🔴 Missing await — returns Promise not resolved value
const filing = client.filings.create(payload); // No await — filing is a Promise
```

### Edge Cases

Always check: null/undefined/empty input, empty collections, maximum values,
concurrent invocations, out-of-range amounts (zero, negative, overflow).

```typescript
// 🔴 No null guard — crashes on missing taxpayer
function formatTIN(taxpayer: Taxpayer) {
  return taxpayer.tin.toUpperCase(); // taxpayer?.tin could be null
}

// 🔴 Division by zero risk
const avgProcessingTime = totalTime / completedJobs; // completedJobs could be 0
// ✅ const avgProcessingTime = completedJobs > 0 ? totalTime / completedJobs : null;
```

### Race Conditions

```typescript
// 🔴 TOCTOU — check then act without atomicity
const existing = await db.query('SELECT id FROM filings WHERE taxpayer_id=$1 AND period=$2', [...]);
if (!existing.rows.length) {
  await db.query('INSERT INTO filings ...'); // Another request may insert between these two
}
// ✅ INSERT ... ON CONFLICT DO NOTHING RETURNING id

// 🔴 Non-atomic counter increment
const count = await cache.get('filing_count');
await cache.set('filing_count', count + 1); // Lost update under concurrent requests
// ✅ await cache.incr('filing_count'); (Redis atomic)
```

### Type Coercion Traps

```typescript
// 🔴 JavaScript loose equality (always 🔴 in TypeScript strict codebase)
if (filing.status == 'pending') { ... }    // Use ===
if (amount == null) { ... }               // Catches undefined too — may be intentional, comment it

// 🔴 Float precision (money context — financial bug)
const total = 0.1 + 0.2; // 0.30000000000000004 — never use float for money
// ✅ Use kobo/cents (bigint) or Decimal library

// 🔴 Implicit string→number coercion
const amount = req.body.amount * 100; // If amount is "1500.50" this works but is fragile
// ✅ const amount = parseInt(String(req.body.amount), 10);
// ✅ Better: Zod validation with .coerce.number()
```

---

## PHASE 2 — SECURITY (Always 🔴 — Never "minor")

### SQL Injection (Most Critical in TaxBridge Context)

```typescript
// 🔴 CRITICAL — SQL injection in tax filing query
const filings = await db.query(
  `SELECT * FROM filings WHERE taxpayer_id = '${taxpayerId}'` // String interpolation
);

// ✅ Parameterized query — always
const filings = await db.query(
  'SELECT * FROM filings WHERE taxpayer_id = $1',
  [taxpayerId]
);

// 🔴 ORM-level injection (Prisma raw query)
await prisma.$queryRawUnsafe(`SELECT * FROM users WHERE id = ${userId}`);
// ✅
await prisma.$queryRaw`SELECT * FROM users WHERE id = ${userId}`;
```

### Authentication & Authorization

```typescript
// 🔴 Missing authentication — endpoint operates without auth check
export async function GET(req: Request) {
  const filings = await db.query('SELECT * FROM filings');
  return Response.json(filings);
  // No Bearer token validation — any request gets all filings
}

// 🔴 Missing authorization — authenticated but no ownership check
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const filing = await db.query('SELECT * FROM filings WHERE id = $1', [params.id]);
  return Response.json(filing); // Returns ANY filing to ANY authenticated user
  // Missing: WHERE tenant_id = current_tenant
}

// 🔴 JWT not verified — trusting unvalidated claim
const userId = jwt.decode(token)?.sub; // decode ≠ verify — signature not checked
// ✅ const { sub: userId } = jwt.verify(token, process.env.JWT_SECRET);
```

### Secrets & Sensitive Data

```typescript
// 🔴 Hardcoded secret — will be in git history forever
const PAYSTACK_SECRET = 'sk_live_3kJ9mNpQ...';

// 🔴 Secret in error response
throw new Error(`Payment failed: ${JSON.stringify({ apiKey, payload })}`);

// 🔴 PII in URL (appears in access logs, Sentry breadcrumbs)
GET /v1/taxpayers?bvn=12345678901

// 🔴 Password stored plain or MD5/SHA1
const hash = crypto.createHash('sha1').update(password).digest('hex');
// ✅ const hash = await argon2.hash(password);
```

### Webhook & Input Validation

```typescript
// 🔴 Paystack webhook without signature validation
export async function POST(req: Request) {
  const body = await req.json(); // Processes unauthenticated POST from anyone
  await processPayment(body.data);
}

// 🔴 No input validation on public API
export async function POST(req: Request) {
  const body = await req.json(); // body could be anything
  await db.query('INSERT INTO filings ...', [body.amount, body.taxpayer_id]);
}
// ✅ Always Zod-validate before use:
const FilingSchema = z.object({
  amount: z.string().regex(/^\d+\.\d{2}$/),
  taxpayer_id: z.string().startsWith('tp_'),
});
const validated = FilingSchema.parse(await req.json());
```

### OWASP Top 10 Checklist

```
□ Injection: user input reaches SQL/shell/template without parameterization
□ Broken auth: JWT unverified, token in logs, missing auth on endpoint
□ Sensitive data: secrets hardcoded, PII in URLs/logs, passwords unhashed
□ SSRF: user-controlled URL fetched by server without allowlist
□ Broken access: authn but no authz, missing tenant_id in WHERE clause
□ Security misconfiguration: CORS *, debug mode in production, X-Powered-By
□ Vulnerable deps: known CVEs in package.json
□ Insufficient logging: no audit trail on financial operations
□ Replay attacks: webhook timestamp not validated (5-minute window required)
□ Mass assignment: req.body spread directly into DB insert
```

---

## PHASE 3 — RELIABILITY & ERROR HANDLING (🟠 if missing)

```typescript
// 🟠 Silent error swallowing — the most dangerous pattern
async function submitFiling(id: string) {
  try {
    await firsApi.submit(filing);
  } catch (e) {
    return null; // Caller sees null — thinks filing submitted, it didn't
  }
}
// ✅ Propagate explicitly:
async function submitFiling(id: string) {
  try {
    return await firsApi.submit(filing);
  } catch (e) {
    throw new FilingError(`FIRS submission failed for ${id}`, { cause: e });
  }
}

// 🟠 No timeout on external call — can hang indefinitely
const response = await fetch('https://api.firs.gov.ng/validate', { body });
// ✅
const response = await fetch('https://api.firs.gov.ng/validate', {
  body,
  signal: AbortSignal.timeout(10_000), // 10s timeout
});

// 🟠 Infinite retry — will hammer a failing downstream under load
while (!success) {
  success = await trySubmit(filing);
}
// ✅ Bounded retry with exponential backoff (BullMQ handles this — use it)
```

### Error Context Requirements (TaxBridge Debugging)

Every error thrown must include enough context to debug without reproduction:

```typescript
// 🟠 Error without context
throw new Error('Payment failed');

// ✅ Error with full context
throw new PaymentError('Paystack charge failed', {
  code: 'PAYSTACK_CHARGE_FAILED',
  cause: originalError,
  context: {
    payment_id: payment.id,
    taxpayer_id: filing.taxpayer_id,
    amount_kobo: payment.amount_kobo,
    provider: 'paystack',
    paystack_reference: payment.reference,
  },
});
```

---

## PHASE 4 — PERFORMANCE (🟡 unless hot path, 🟠 for critical path)

### N+1 Queries (Always Flag)

```typescript
// 🟠 N+1 — fetches 1 query for filings + N queries for taxpayers
const filings = await db.query('SELECT * FROM filings WHERE tenant_id = $1', [tenantId]);
for (const filing of filings.rows) {
  filing.taxpayer = await db.query(
    'SELECT * FROM taxpayers WHERE id = $1', [filing.taxpayer_id]
  );
}
// ✅ Single JOIN or batch fetch
const filings = await db.query(`
  SELECT f.*, t.business_name, t.tin
  FROM filings f
  JOIN taxpayers t ON t.id = f.taxpayer_id
  WHERE f.tenant_id = $1
  ORDER BY f.created_at DESC
`, [tenantId]);
```

### Next.js-Specific Performance

```typescript
// 🟠 Large server component waterfall (sequential awaits)
export default async function FilingPage({ params }: Props) {
  const filing = await getFilingById(params.id);    // 200ms
  const taxpayer = await getTaxpayer(filing.taxpayer_id); // 150ms — sequential
  // Total: 350ms
}
// ✅ Parallel data fetching
const [filing, taxpayer] = await Promise.all([
  getFilingById(params.id),
  getTaxpayer(taxpayerId), // If you have the ID from params
]);

// 🟡 Framer Motion full bundle import
import { motion } from 'framer-motion'; // ~27kB gzipped on its own
// ✅ LazyMotion + domAnimation subset (~6kB gzipped)
import { LazyMotion, domAnimation, m } from 'framer-motion';
```

---

## PHASE 5 — NEXT.JS & TYPESCRIPT-SPECIFIC GOTCHAS

### App Router Patterns

```typescript
// 🔴 Using browser API in Server Component
export default function Page() {
  const width = window.innerWidth; // ReferenceError: window is not defined
}
// ✅ Move to client component or use useEffect

// 🟠 Missing error.tsx / loading.tsx for data-fetching routes
// Every route segment with async data needs both files

// 🟡 No cache() wrapper on repeated data fetches
async function getUserById(id: string) {
  return await db.query('SELECT * FROM users WHERE id = $1', [id]);
  // Called multiple times in same request → multiple DB round-trips
}
// ✅
import { cache } from 'react';
const getUserById = cache(async (id: string) => {
  return await db.query('SELECT * FROM users WHERE id = $1', [id]);
});

// 🟡 Missing generateMetadata for page SEO
// Every page.tsx needs export async function generateMetadata()
```

### TypeScript Strict Mode Violations

```typescript
// 🔴 `any` type (guardrail G01)
function processWebhook(data: any) { ... }
// ✅ Type the payload explicitly

// 🔴 Non-null assertion without safety proof (guardrail G02)
const filing = await getFilingById(id)!; // What if it returns undefined?
// ✅ const filing = await getFilingById(id); if (!filing) return notFound();

// 🟠 Missing return type on exported functions
export async function submitFiling(id: string) { ... }
// ✅ export async function submitFiling(id: string): Promise<Filing> { ... }

// 🟡 Unused imports (noise, confuses readers)
import { useCallback, useMemo, useState } from 'react'; // Only useState used

// 🔴 JSON.parse without Zod validation
const data = JSON.parse(req.body); // No schema validation → any shape at runtime
// ✅ const data = FilingSchema.parse(JSON.parse(req.body));
```

---

## PHASE 6 — TESTS & OBSERVABILITY (🟡 for new features)

```typescript
// 🟡 Test names that describe implementation, not behavior
it('calls submitFiling', () => { ... })
// ✅ it('returns 422 when TIN is invalid for a CIT filing', async () => { ... })

// 🟡 Missing test for the error path
it('creates a filing', async () => {
  const result = await createFiling(validPayload);
  expect(result.status).toBe('draft');
  // Missing: what happens with invalid TIN? with duplicate period?
})

// 🟡 Testing implementation not behavior
expect(prisma.filings.create).toHaveBeenCalledWith({ ... }) // Implementation detail
// ✅ expect(response.status).toBe(201) // Behavior

// 🟡 No error context in logs
console.log('Filing submission failed'); // useless in production
// ✅ logger.error({ filing_id, taxpayer_id, error_code, trace_id }, 'Filing submission failed');
```

---

## PHASE 7 — DELIVERY FORMAT

### Response Structure

```
## Code Review: {filename or feature}

### Summary
[2–3 sentences: overall quality, primary concern, production readiness signal]

### 🔴 Critical Findings
[Must fix — blocks shipping]

### 🟠 Major Findings
[Should fix before merge]

### 🟡 Minor Findings
[Worth fixing, not blocking]

### 🔵 Suggestions
[Better approach exists — author's call]

### ✅ What's Working Well
[Always include — specific, not generic praise]
```

### Finding Format (Every Finding Must Have All Four)

```
🔴 SQL Injection — getUserByEmail() (line 34)

Problem:  User-supplied email is string-interpolated directly into the SQL query.
Impact:   Any caller can exfiltrate the entire users table or drop the database.
          In a multi-tenant system with RLS, this bypasses Row-Level Security.

Vulnerable:
  db.query(`SELECT * FROM users WHERE email = '${email}'`)

Fix:
  db.query('SELECT * FROM users WHERE email = $1 AND tenant_id = $2', [email, tenantId])
```

### Tone Rules

- **Describe the code, not the person.** "This function" not "you wrote"
- **Explain the why.** The rule without the reason doesn't teach
- **One comment per pattern** — note it once, cite all occurrences
- **Severity must be consistent** — security is NEVER a nit
- **Always end with what's working** — skipping this makes reviews feel like attacks

---

*A review is a conversation, not a verdict.*
*The goal is production-safe code AND a better engineer.*
*In a fintech system, missed security findings have regulatory consequences.*
*Hold the bar — but hold it consistently and with explanation.*
