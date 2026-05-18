// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
// Major Reset • Lagos → Global • Production Conviction Architecture

export interface Project {
  readonly slug: string;
  readonly title: string;
  readonly tagline: string;
  readonly status: 'live' | 'wip' | 'case-study';
  readonly type: string;
  readonly description: string;
  readonly constraint: string;
  readonly stack: readonly string[];
  readonly outcomes: readonly string[];
  readonly chosen: string;
  readonly over: string;
  readonly because: string;
  readonly featured?: boolean;
  readonly demoUrl?: string;
  readonly githubUrl?: string;
  readonly caseStudy?: string;
}

export const PROJECTS: readonly Project[] = [
  {
    slug: 'taxbridge',
    title: 'TaxBridge',
    type: 'Compliance Platform · Fintech',
    status: 'case-study',
    featured: true,
    tagline: '4 hours of Nigerian SME tax filing compressed to 15 minutes — NRS-integrated, audit-ready, zero data-loss.',
    description:
      'Full tax compliance workflow automation for Nigerian small businesses — VAT, withholding tax, and annual returns. PostgreSQL RLS isolates each tenant at the database level. Real-time calculations under <150ms at load. Idempotent BullMQ job queue ensures no submission is ever double-processed — even through mid-request server failure. Hash-chained immutable audit trail. 95% test coverage.',
    chosen: 'PostgreSQL Row-Level Security for multi-tenancy',
    over: 'Application-layer tenant filtering',
    because:
      'NRS audit scrutiny demands proof that tenant data cannot cross-contaminate — RLS enforces this at the database engine level, not the application layer',
    constraint:
      'NRS API rate limits: 30 req/min per TIN. BullMQ queue must manage burst filing windows without client-visible failure.',
    outcomes: [
      '4hrs → 15min filing',
      'sub-150ms under load',
      '95% test coverage',
      'zero data-loss record',
    ],
    stack: [
      'Fastify 5',
      'Java 17',
      'Spring Boot 3',
      'PostgreSQL 15 RLS',
      'Redis 7',
      'BullMQ',
      'React Native',
      'Turborepo',
      'GraphQL',
      'Prisma',
      'TypeScript',
    ],
    caseStudy: '/work/taxbridge',
  },
  {
    slug: 'sabiscore',
    title: 'SabiScore',
    type: 'ML Platform · Observability',
    status: 'live',
    featured: true,
    tagline: '99.9%+ uptime. 45% MTTD improvement. Ensemble ML that alerts before users notice.',
    description:
      'Ensemble credit and prediction scoring (XGBoost, LightGBM, CatBoost) with real-time output quality monitoring. Alerts engineers the moment a model begins degrading — before any user is affected. 99.9%+ uptime (Prometheus · 90-day window). ~30% inference latency reduction via query optimisation and Redis caching. 45% MTTD improvement over reactive alerting baseline.',
    chosen: 'FastAPI + Redis Pub/Sub for inference serving',
    over: 'Synchronous REST with database polling',
    because:
      'Sub-50ms event fan-out at sustained load with dead-letter recovery — impossible with polling under concurrent sessions',
    constraint:
      'Ensemble inference must complete in <120ms p99 at peak load with no model warmup on cold start.',
    outcomes: [
      '30% inference latency reduction',
      '99.9%+ uptime',
      '45% MTTD improvement',
      'Prometheus 90-day proof',
    ],
    stack: [
      'FastAPI',
      'XGBoost',
      'LightGBM',
      'CatBoost',
      'Redis Pub/Sub',
      'Prometheus',
      'Grafana',
      'PostgreSQL',
    ],
    demoUrl: 'https://sabiscore.scardubu.dev',
    githubUrl: 'https://github.com/Scardubu/Sabiscore',
    caseStudy: '/work/sabiscore',
  },
  {
    // v27 P2-B: description now names the triadic LLM stack explicitly.
    // Stack: Ollama added (the local inference runtime); React Native added
    // (the dashboard has a mobile companion view); PostgreSQL removed from
    // primary slot — Redis 7 is the queue store. WebSocket retained for
    // real-time fleet telemetry.
    slug: 'swarmxq',
    title: 'SwarmXQ',
    type: 'AI Agent Platform · Orchestration',
    status: 'live',
    featured: true,
    tagline: 'Self-improving multi-agent operator platform — autonomous evolution layer, live fleet dashboard, production-grade reliability under resource constraints.',
    description:
      'Multi-agent orchestration platform where agents autonomously improve their own task strategies between runs. Local LLM inference via Ollama — Phi-4-mini handles task routing, DeepSeek-R1 handles multi-step reasoning, Qwen2.5-Coder handles code generation — with triadic model selection per task type, zero cloud egress, and fallback chains that degrade gracefully under memory pressure. The evolution layer scores outcomes against quality benchmarks, replaces low-performing configurations via LLM-guided mutation, and produces measurable gains without engineering intervention. Live Next.js 15 dashboard surfaces real-time fleet visibility — task queue depth, agent health, completion rates, evolution cycle status. Checkpoint-based replay means failed sub-tasks restart from the last consistent state, not from scratch.',
    chosen: 'Autonomous evolution layer with LLM-guided strategy mutation',
    over: 'Static agent configurations with manual tuning cycles',
    because:
      'Manual tuning cannot adapt to novel inputs at scale — autonomous evolution scores strategies against real outcomes and rewrites low performers between runs, compounding quality without engineering intervention',
    constraint:
      'Agents must hold correctness under Lagos network conditions — unreliable connectivity, variable latency, and intermittent API availability. Local inference must run under 8GB RAM without model offloading.',
    outcomes: [
      'self-improving agent fleet',
      'live orchestration dashboard',
      'checkpoint-based fault recovery',
      'zero manual tuning cycles',
    ],
    stack: [
      'Python',
      'FastAPI',
      'Ollama',
      'Next.js 15',
      'React Native',
      'BullMQ',
      'Redis 7',
      'WebSocket',
    ],
    githubUrl: 'https://github.com/Scardubu/SwarmXQ',
    caseStudy: '/work/swarmxq',
  },
  {
    slug: 'hashablanca',
    title: 'Hashablanca',
    type: 'Blockchain · ZK Privacy',
    status: 'case-study',
    featured: false,
    tagline:
      'ZK proofs for document integrity verification — confidentiality and verifiability as simultaneous properties, not a tradeoff.',
    description:
      'Privacy-preserving blockchain infrastructure using Circom 2 circuits and Groth16 proofs. Any verifier can confirm a document existed and was unmodified at a given timestamp without seeing the document. Multi-chain token distribution across Ethereum, Polygon, BSC, and StarkNet via per-chain adapters. CBOR streaming handles 4GB+ file archives. 90%+ test coverage. GDPR-compliant PII detection and anonymisation.',
    chosen: 'Groth16 ZK proofs with off-chain proving',
    over: 'Database timestamp signatures',
    because:
      'Database timestamps are mutable — ZK proofs provide cryptographic verifiability of document existence and integrity without exposing content',
    constraint:
      'Proof generation must complete off-chain and fit within on-chain verifier gas limits across four EVM-compatible networks.',
    outcomes: [
      'ZK proof integrity layer',
      '4 chain networks',
      '4GB+ file processing',
      '90%+ test coverage',
    ],
    stack: [
      'Circom 2',
      'snarkjs (Groth16)',
      'Solidity',
      'FastAPI',
      'Web3.py',
      'PostgreSQL',
      'Docker',
    ],
    githubUrl: 'https://github.com/Scardubu/hashablanca',
    caseStudy: '/work/hashablanca',
  },
  {
    // v27 P2-B: description now states "40 million students" (UBEC's published
    // beneficiary count under the Universal Basic Education Fund, verifiable from
    // UBEC's annual reports and CBN education financing documents). Tagline now
    // includes "Abuja HQ" — consistent with About section copy and the location rule.
    slug: 'ubec',
    title: 'UBEC Data Pipeline',
    type: 'Federal Infrastructure · Data Engineering',
    status: 'case-study',
    featured: false,
    tagline: 'Abuja HQ · Federal-scale education data for 40 million Nigerian students across 36 states — probabilistic deduplication, per-state retry semantics, ministry-grade reporting.',
    description:
      'Batch ingestion pipeline for the Universal Basic Education Commission (Abuja HQ) — the federal agency responsible for funding and tracking basic education for 40 million Nigerian students. Processes multi-ministry reporting data from all 36 Nigerian states with heterogeneous column schemas. Probabilistic deduplication (dedupe.io + PostgreSQL) achieves <2% false-positive rate — exact-match alone misses 15–20% of true duplicates. Per-state DAG tasks mean one late state submission does not block reporting for the other 35. Great Expectations validation gate flags anomalies before they enter ministry reports.',
    chosen: 'Blocking + probabilistic record linkage (dedupe.io)',
    over: 'Exact-match deduplication on school_name',
    because:
      'State submissions use inconsistent school name spellings across ministries — exact match misses 15–20% of true duplicates in validation runs',
    constraint:
      'Partial state submissions are the rule, not the exception. The pipeline must produce accurate reporting for submitted states without waiting for all 36.',
    outcomes: [
      '36 state sources ingested',
      '<2% dedup false-positive rate',
      'per-state retry semantics',
      'ministry-grade audit trail',
    ],
    stack: [
      'Python 3.11',
      'Apache Airflow',
      'pandas',
      'PostgreSQL',
      'Great Expectations',
      'dedupe.io',
      'Docker',
    ],
    caseStudy: '/work/ubec',
  },
];

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}
