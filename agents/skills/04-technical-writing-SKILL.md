---
name: technical-writing
version: 3.1.0
description: >
  Write, structure, and edit production-grade technical documentation for Oscar's
  portfolio and projects. Use when: writing README files, architecture decision
  records (ADRs), runbooks, RFCs, engineering blog posts, onboarding guides,
  API documentation, postmortems, or case study narratives.
  Portfolio context: scardubu.dev CONVICTION ENGINE — TaxBridge, SabiScore,
  Hashablanca project write-ups, open source docs (pg-tenant, audit-chain,
  node-debug-llm), Lagos fintech storytelling for Stripe/Cloudflare/Vercel.
  Triggers: "write a README", "create an ADR", "document this", "write a runbook",
  "postmortem template", "case study for TaxBridge", "RFC for", "blog post about".
  Do NOT use for: casual conversation, code generation (use specific skill),
  animation design (use 06-animation-SKILL.md), or SEO metadata (use 07-seo-SKILL.md).
portfolio: scardubu.dev (TaxBridge · SabiScore · Hashablanca · pg-tenant · audit-chain)
---

Technical writing is precision engineering. Ambiguity in documentation causes the
same class of bugs as ambiguity in code — but compounds across every reader, forever.
For a portfolio targeting Stripe and Cloudflare, a vague README is a missed first
impression. A clear, well-structured case study can be the decisive signal that
turns a recruiter's skim into a senior engineer's deep read.

---

## PHASE 1 — DOCUMENT CLASSIFICATION (Diátaxis Framework)

Every technical document belongs to exactly one archetype. Mixing them fails at both.

| Type             | Question it answers            | Reader mindset             | Example                                          |
| ---------------- | ------------------------------ | -------------------------- | ------------------------------------------------ |
| **Tutorial**     | "How do I learn this?"         | Learning by doing          | "Build your first TaxBridge filing with the API" |
| **How-to Guide** | "How do I accomplish X?"       | Solving a specific problem | "Configure PostgreSQL RLS for multi-tenancy"     |
| **Reference**    | "What does this do exactly?"   | Consulting during work     | API reference, CLI flags, env var table          |
| **Explanation**  | "Why is it designed this way?" | Building understanding     | ADR, architecture overview, case study           |

**Rule:** State the archetype at the top of every doc. If a doc contains tutorial
content AND explanation content, split it into two linked docs.

### 1.1 Document Type → Archetype Mapping

| Request                | Archetype                        | Secondary                        |
| ---------------------- | -------------------------------- | -------------------------------- |
| README                 | How-to + Reference               | Brief Explanation                |
| ADR / RFC              | Explanation                      | —                                |
| Runbook                | How-to                           | Reference (thresholds, commands) |
| Engineering blog post  | Explanation                      | Tutorial (if demo)               |
| Onboarding guide       | Tutorial                         | How-to                           |
| Postmortem             | Explanation                      | How-to (remediation)             |
| Case study (portfolio) | Explanation                      | Evidence (metrics)               |
| API docs               | Reference                        | How-to (examples)                |
| Open source README     | How-to → Reference → Explanation | —                                |

---

## PHASE 2 — DOCUMENT STRUCTURES

### 2.1 README (Production Open-Source — pg-tenant, audit-chain, node-debug-llm)

```markdown
# package-name
[One sentence: what it does, not what it is. Start with the problem it solves.]

## Why

[The pain this eliminates. 2–4 sentences. Reader nods in recognition.
For pg-tenant: "Every multi-tenant app eventually rebuilds the same PostgreSQL
Row-Level Security patterns. pg-tenant ships that infrastructure pre-tested."]

## Quick Start

[Zero to working in < 5 minutes. No explanation — just working commands.]

```bash
pnpm add pg-tenant
```

```typescript
import { createTenantMiddleware } from 'pg-tenant';
// ... minimal working example with realistic values
```

## Installation

[Full setup: requirements, peer deps, version constraints, env vars needed]

## Usage

[2–4 complete, runnable examples. Each covers a distinct scenario.
Each example runs without modification. Realistic data. Output shown.]

## API Reference

[Every exported function/type. Parameters: name, type, default, description.
All return types. Error conditions documented.]

## Configuration

| Option     | Type     | Default | Description                     |
| ---------- | -------- | ------- | ------------------------------- |
| `poolSize` | `number` | `10`    | PostgreSQL connection pool size |

## Contributing

[Dev setup, test commands, PR process. Be specific — not "fork and PR".]

## License
```

### 2.2 Architecture Decision Record (ADR)

```markdown
# ADR-{NNN}: {Precise decision title}

**Status:** Proposed | Accepted | Deprecated | Superseded by ADR-{N}
**Date:** YYYY-MM-DD
**Deciders:** {names or roles}
**Ticket:** {Jira/Linear link}

## Context

[What problem or opportunity motivated this decision?
What forces are at play: technical, organizational, regulatory (NDPC/CBN/FIRS)?
Write as if explaining to someone who wasn't in the room.
Include constraints that eliminated options before evaluation.]

## Decision

[Stated clearly and specifically. "We will use X" — not "we decided to consider X".
Include the Choose/Over/Because triad:]

We chose **[X]** over [Y] and [Z] because [specific, verifiable reason].

## Options Considered

### Option A: {Name}
**Summary:** ...
**Pros:** ...
**Cons:** ...
**Rejected because:** ...

### Option B: {Name} — **Selected**
**Summary:** ...
**Pros:** ...
**Cons:** ...
**Selected because:** ...

## Consequences

**Positive:**
- [What improves]

**Negative / Trade-offs:**
- [What we give up, what becomes harder]

**Risks:**
- [What could go wrong, detection signal, mitigation]

## Implementation Notes

[Technical guidance for the implementing engineer.
Links to relevant PRs, tickets, design docs, external references.]

## Review Date

[When to revisit. What signals would prompt earlier reconsideration?]
```

### 2.3 Runbook (TaxBridge Production Operations)

```markdown
# Runbook: {Service} — {Scenario}

**Severity:** P1 | P2 | P3
**Owner team:** {team}
**Escalation:** {who to page if unresolved after 30 min}
**Last updated:** YYYY-MM-DD | **Last tested:** YYYY-MM-DD

---

## Symptoms

[Exact alert name, log pattern, dashboard state the engineer sees]

```
Alert: "TaxBridge BullMQ queue depth > 500 jobs"
Dashboard: https://grafana.internal/d/taxbridge-jobs
Log: ERROR PaymentProcessor failed to process payment paymentId=pay_3k...
```

## Impact

[Who is affected? How many users? What action fails? Revenue impact?]

## Diagnosis Steps

### Step 1: Verify the alert is real

```powershell
# Check current queue depth
Invoke-RestMethod "https://api.taxbridge.app/internal/queue/stats"
# If < 50, this may be a spike — monitor for 5 min before proceeding
```

### Step 2: Identify failure mode

[Decision tree to narrow root cause]

**Decision tree:**
- Queue depth stable but high: see "Processing slowdown" section
- Queue growing rapidly: see "Worker crash" section
- Queue normal but error rate high: see "Upstream API failure" section

## Resolution Steps

### Scenario: Worker crash

```powershell
# Restart BullMQ worker pod
railway service restart taxbridge-worker

# Monitor recovery
railway logs taxbridge-worker --tail
```

## Rollback

[Exact commands to undo any change made during resolution]

```powershell
# Rollback environment variable change
railway variables set PAYMENT_PROVIDER=paystack
```

## Post-Resolution

- [ ] Update status page: https://status.taxbridge.app
- [ ] File incident ticket: [link to template]
- [ ] Schedule postmortem if P1 or recurring P2
- [ ] Update this runbook if any step was inaccurate

---
**Did this runbook resolve the issue?** If not, note what was different and update immediately.
```

### 2.4 Portfolio Case Study (Recruiter-Facing — MLNARRATOR Mode)

Structure for TaxBridge / SabiScore / Hashablanca project pages:

```markdown
# {Project Name}: {One-line conviction statement}
*{Technology badges — stack at a glance}*

---

## The Problem

[Recruiter-stopping opening. Make them feel the pain before the solution.
Specific, vivid, real. No "I built a platform that..."]

Example: "Nigerian SMEs spend an average of 4 hours per quarter manually
reconciling FIRS returns across three portals — each with different formats,
none connected to each other. Accountants charge ₦15,000–₦50,000 per filing
for what is largely a copy-paste operation."

## What I Built

[1–2 paragraphs. System overview at the right altitude for the reader.
Technical leads: enough architecture. Non-technical: enough story.]

## Technical Architecture

[Choose/Over/Because for 2–3 key decisions]

**Chose Fastify 5 over Express** because its native plugin system allowed
[specific reason with verifiable impact].

**Chose PostgreSQL RLS over application-level tenancy** because [reason]
→ [outcome: "zero cross-tenant data incidents across 2,000+ business accounts"].

## Engineering Challenges

[2–3 hard problems. Show depth.]

### Challenge: BullMQ job deduplication under Paystack retry storms
[Problem → investigation → solution → result in 4 tight paragraphs]

## Results (Verified — Never Inflated)

| Metric          | Before     | After             |
| --------------- | ---------- | ----------------- |
| Tax filing time | ~4 hours   | ~15 minutes       |
| Manual errors   | [baseline] | [reduction]       |
| SMEs served     | 0          | [verified number] |

## What I Learned

[Generalizable insights. Signals engineering maturity.]

## Open Source Extraction

[If any tools extracted: link + 1-sentence description]
[`pg-tenant` — the multi-tenant RLS pattern, extracted from TaxBridge]
```

### 2.5 Engineering Blog Post

```
Hook (1 paragraph):
  Problem first. Not "Hi I'm Oscar". Not "Today I'll show you".
  The reader must feel the pain before you offer the cure.
  "At 2am on a Tuesday, a bug in our BullMQ consumer silently dropped
  143 tax filing jobs. We found out 6 hours later when a Lagos SME's
  accountant called. Here's what we built to make sure it never happens again."

Context (1–2 paragraphs):
  System and constraints. Enough for someone unfamiliar with TaxBridge.

The Problem (2–3 paragraphs + code/output):
  Vivid and specific. Numbers, not adjectives.
  "p99 job pickup latency was 4.2 seconds. 23% of Paystack webhook events
  were hitting the duplicate idempotency check due to retry storms."

What We Tried (optional — shows reasoning depth):
  Dead ends. Readers appreciate honesty. Prevents comment suggestions of
  things you already tried.

The Solution (3–5 paragraphs + code):
  The actual change. The insight that unlocked it.
  What you understood differently after.

Results:
  Before/after. Same metrics as the problem statement.
  "p99 pickup latency: 4.2s → 340ms. Webhook duplicate rate: 23% → 0.4%."

What We Learned / Takeaways:
  Generalizable principles. "This is the pattern for any BullMQ shop
  dealing with Paystack's at-least-once delivery guarantee."

Closing:
  One sentence on what's next. No "I hope this was useful".
```

---

## PHASE 3 — WRITING CRAFT

### 3.1 Sentence-Level Standards

**Active voice. Lead with the important thing. No weasel words.**

```
❌ "In the case where the API key is missing, a 401 response will be returned."
✅ "A missing API key returns 401."

❌ "The queue generally processes jobs within a few seconds."
✅ "The queue processes jobs within 340ms at p99 under normal load."

❌ "It should be noted that BVN storage requires encryption."
✅ "Store BVN encrypted at rest. Hash for lookup."

❌ "We decided to use PostgreSQL because of its reliability."
✅ "We chose PostgreSQL over MongoDB because its ACID guarantees prevent
   the partial-write scenarios that Nigerian bank APIs trigger
   during network partitions."
```

**Weasel words (never use in technical docs):**
`generally` · `usually` · `typically` · `often` · `should` · `might` · `could`

If you can't be specific, investigate until you can be, or omit.

### 3.2 Code Examples — Non-Negotiable Rules

1. **Every example runs as-is** — imports, env vars, setup code included
2. **Realistic data** — not `foo`, `bar`, `test`, `string`, `123`
3. **Show expected output** — what does the reader see when they run this?
4. **Handle errors** — happy path only examples train readers to ignore errors
5. **Annotate the non-obvious** — inline comments for surprising decisions

```typescript
// ❌ Incomplete, useless example
const result = client.process(data);

// ✅ Complete, realistic, runnable example
import { TaxBridgeClient, TaxBridgeError } from '@taxbridge/sdk';

const client = new TaxBridgeClient({
  apiKey: process.env.TAXBRIDGE_API_KEY,  // from dashboard: Settings → API Keys
  environment: 'sandbox',                 // 'sandbox' | 'production'
});

try {
  const filing = await client.filings.create({
    taxpayer_id: 'tp_3kJ9mNpQxZ8r4b',
    tax_year: 2025,
    type: 'VAT',
    period: 'Q4',
    line_items: [
      { description: 'Consulting services', amount: '450000.00', tax_rate: '0.075' },
    ],
  });

  console.log(filing.id);       // → "fil_7fKpLmNqRs4x"
  console.log(filing.status);   // → "pending"
  console.log(filing.due_at);   // → "2026-01-31T23:59:59+01:00"
} catch (error) {
  if (error instanceof TaxBridgeError) {
    console.error(error.code);    // → "INVALID_TIN"
    console.error(error.field);   // → "taxpayer_id"
    console.error(error.trace_id); // → "req_7f3a9b2c" — include in support reports
  }
  throw error;
}
```

### 3.3 Numbers and Metrics

In portfolio docs and case studies, numbers do three jobs:
1. Build credibility (I measured this)
2. Create specificity (not vague claims)
3. Allow comparison (before/after)

**Rules:**
- Always include the measurement method: "measured via Lighthouse CI on mobile 4G throttling"
- Always include the baseline: "before: ~4h, after: ~15min, method: user timing study with 12 Lagos SME accountants"
- Never round to a suspiciously clean number: "99.9% uptime" with three-nines specificity
- Never inflate: if you don't have the number, say "we didn't measure this" — that's more credible than fabricating

---

## PHASE 4 — QUALITY GATE

```
Accuracy:
□ Every code example runs without modification
□ Every API endpoint/command/config exists and works as described
□ Every metric is verified and sourced
□ All links present (even as placeholders with explicit TODO)

Completeness:
□ Prerequisites listed (what must be true before following this doc)
□ All parameters/options documented (not just common ones)
□ Error conditions documented (what can go wrong, how to recover)
□ "What's next" is explicit at the end

Clarity:
□ Document belongs to exactly ONE Diátaxis archetype
□ First sentence states what this document is for
□ No undefined acronyms (spelled out on first use: BullMQ, FIRS, RLS)
□ No weasel words (generally, usually, often, should)
□ Active voice throughout imperative sections
□ Heading hierarchy h1 → h2 → h3 (no skips)

Findability:
□ Title is searchable (what would someone Google to find this?)
□ Key terms match how users describe the problem
□ Headings are informative: "Configure PostgreSQL RLS" not "Getting set up"

Portfolio-Specific:
□ Metrics are verified (never inflated)
□ Lagos/Nigeria context is specific, not tokenistic
□ Technical depth appropriate for target employer (Stripe/Cloudflare engineering bar)
□ Choose/Over/Because triad used for key architectural decisions
□ Evidence-First Positioning pattern used for skill descriptions
```

---

*Technical writing is the final mile of engineering.*
*A system no one can understand, operate, or build on is only half-built.*
*Documentation is not the afterthought — it is the artifact.*
