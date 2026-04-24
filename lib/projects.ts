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
    tagline: 'Nigerian SME tax filing from 4 hours to 15 minutes — NRS-integrated, audit-ready.',
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
    tagline: 'Production ML prediction and self-monitoring platform for live decision windows.',
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
    githubUrl: 'https://github.com/Scardubu/sabiscore',
    caseStudy: '/work/sabiscore',
  },
  {
    slug: 'hashablanca',
    title: 'Hashablanca',
    type: 'Privacy Infrastructure · Blockchain',
    status: 'wip',
    tagline: 'Multi-chain encrypted data transfer with ZK-proof regulatory compliance.',
    description:
      'Backend for secure, verifiable transfer of sensitive data across Ethereum, Polygon, BSC, and StarkNet simultaneously. Multi-GB AES-256 payloads with automatic retry and full transaction audit records. ZK-SNARK proof pipelines for GDPR-compliant regulatory reporting. 90% integration test coverage. Zero data-loss record throughout.',
    chosen: 'ZK-SNARKs for regulatory proof generation',
    over: 'Centralised compliance oracle with full data exposure',
    because:
      'GDPR mandates minimum data disclosure — ZK proofs validate compliance without revealing payload contents to the verifier',
    constraint:
      'Proof generation must complete before blockchain settlement window closes (~12s on Ethereum mainnet).',
    outcomes: [
      'zero data-loss record',
      '90% integration test coverage',
      '4-chain simultaneous sync',
      'GDPR-proof trails',
    ],
    stack: ['Solidity', 'ZK-SNARKs', 'IPFS', 'Ethereum', 'Polygon', 'BSC', 'StarkNet', 'Node.js'],
    githubUrl: 'https://github.com/Scardubu/hashablanca',
    caseStudy: '/work/hashablanca',
  },
];

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}
