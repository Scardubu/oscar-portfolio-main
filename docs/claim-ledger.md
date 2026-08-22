# PortfolioX claim ledger

Verified on 2026-08-22 before the Reliability Ledger copy pass. Repository evidence is treated as authored evidence unless a public source or measurement window is named. The homepage must not imply third-party verification where only an internal project record exists.

| Claim | Current location | Evidence source | Confidence | Action |
| --- | --- | --- | --- | --- |
| `4 hours → 15 minutes` | Hero/project proof, TaxBridge case study, About, resume | The timing is accountant-reported in the private project record; no public benchmark artifact is linked | Low-medium | `REMOVE` — remove the number from public surfaces; identify the private timing observation without publishing it as proof |
| `99.9%+ uptime` | SabiScore cards, case study, About, resume | The case study names a Prometheus window, but the underlying measurement artifact is not public | Medium | `REMOVE` — retain the fallback architecture and public source path; do not publish the score without the report |
| `45% MTTD improvement` | SabiScore cards, case study, Skills, resume | The authored record names a reactive-alerting baseline, but the comparison artifact is not public | Low-medium | `REMOVE` — describe the detection-path change without the percentage |
| `sub-150ms under load` | TaxBridge and SabiScore records | The authored records identify p99 and Redis-backed paths, but no public benchmark artifact is linked | Low-medium | `REMOVE` — keep the cache/invalidation decision; withhold the latency number |
| `95% test coverage` | TaxBridge cards and case study | A private project-suite report is named; no inspectable coverage artifact is linked | Low-medium | `REMOVE` — say the coverage report is private without publishing the percentage |
| `zero data loss` / `Zero-Drop` | Hero recap, TaxBridge cards, resume | Architecture describes durable offline queues and idempotent replay; no observation window is recorded | Low-medium | `REWRITE_AS_ARCHITECTURAL_INTENT` — describe replay/idempotency design, not an unbounded outcome |
| `40 million students` | UBEC card, About, recap | Current official UBEC material says approximately 46 million children are in school; that agency-wide population is not evidence that this pipeline directly served every child | Low | `REMOVE` — retain the evidenced scope of 36 state sources and federal reporting context |
| `15+ upstream PRs` | About, resume | Current resume records 15+ merged contributions; no repository-linked contribution index exists in the site | Medium | `QUALIFY` — retain only in the authored profile record until linked evidence is assembled |
| `5+ years in production` | About, resume | Current resume records 5+ years in backend/platform product work and 10+ years in federal data systems | Medium-high | `KEEP_WITH_EVIDENCE` — phrase by domain so the timelines are not conflated |
| Resume-listed certifications | About, downloadable resume | Dates and credential names exist in the authored resume; no public verification URLs are linked | Medium | `QUALIFY` — label them as resume-listed and make verification available on request; do not imply the site independently verified them |
| NRS integration | TaxBridge copy, contact cards, resume | TaxBridge case study says NRS DigiTax integration is in progress | Medium | `QUALIFY` — say “integration in progress” where status matters; do not label the product regulator-approved |
| NDPC compliance | Contact trust badges, recap, consulting copy | Architecture uses privacy controls; no NDPC registration, audit return, trust mark, or certificate is linked | Low | `REMOVE` — describe privacy-by-design controls without claiming certified compliance |
| `independently verifiable` | Production record section | Some repositories are public; TaxBridge and UBEC evidence is not public and several metrics rely on authored records | Low | `REMOVE` — use “evidence path named” and distinguish public source from private case-study evidence |
| Production deployment | Project status badges and summaries | Public GitHub/demo links exist for SabiScore and SwarmXQ; TaxBridge is explicitly an active build | Mixed | `QUALIFY` — use per-project statuses, never “three live platforms” globally |
| Availability / `Updated June 2026` | Hero and About | Date is hard-coded and stale | Low | `REMOVE` — keep a direct contact path without fabricated recency |
| Lagos / Abuja / UTC+1 / global operation | Hero, identity card, About, footer, work records | Profile location is Lagos; UBEC engagement is Abuja HQ; UTC+1 is the relevant time zone; “running globally” is not tied to a deployment inventory | Mixed | `QUALIFY` — use Lagos as profile location, Abuja only for UBEC context, UTC+1 only where scheduling helps, and avoid unsupported global-operation claims |
| 24-hour response | Contact success, button, section and footer | No sustainable service-level commitment is evidenced | Low | `REMOVE` — confirm receipt and describe the next step without a deadline promise |

## Evidence policy

- Public source links, measurement windows, and case-study evidence paths are shown where they exist.
- Private or authored evidence is labelled rather than presented as independently verified.
- Compliance architecture is not described as regulator certification.
- Absolute reliability claims are converted to bounded measurements or architectural intent.
- All three public resume artifacts use the canonical role and the same evidence-bounded copy.
