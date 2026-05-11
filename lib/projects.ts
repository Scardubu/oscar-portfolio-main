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
    slug: 'swarmxq',
    title: 'SwarmXQ',
    type: 'AI Agent Platform · Orchestration',
    status: 'live',
    featured: true,
    tagline: 'Multi-agent operator platform that improves itself between runs — autonomous evolution, live fleet dashboard.',
    description:
      'Multi-agent orchestration platform where agents autonomously improve their own task strategies between runs. The evolution layer scores outcomes, replaces low-performing configurations, and produces measurable quality gains without manual tuning. Live dashboard surfaces real-time fleet visibility — task queue depth, agent health, completion rates. Built for reliability under resource constraints; checkpoint-based replay means failed sub-tasks restart from the last consistent state, not from scratch.',
    chosen: 'Autonomous evolution layer with LLM-guided strategy mutation',
    over: 'Static agent configurations with manual tuning cycles',
    because:
      'Manual tuning cannot adapt to novel inputs at scale — autonomous evolution scores strategies against real outcomes and rewrites low performers between runs',
    constraint:
      'Agents must hold correctness under Lagos network conditions — unreliable connectivity, variable latency, and intermittent API availability.',
    outcomes: [
      'self-improving agent fleet',
      'live orchestration dashboard',
      'checkpoint-based fault recovery',
      'zero manual tuning cycles',
    ],
    stack: [
      'FastAPI',
      'Python',
      'BullMQ',
      'Redis',
      'PostgreSQL',
      'Next.js',
      'WebSocket',
      'Docker',
    ],
    githubUrl: 'https://github.com/Scardubu/SwarmXQ',
    caseStudy: '/work/swarmxq',
  },
];

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}
