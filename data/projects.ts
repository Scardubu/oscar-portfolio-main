// CONVICTION ENGINE v23.0 — Projects Data (canonical for ProjectCard component)
// Interface aligned with components/ProjectCard.tsx field contract.
// Order: TaxBridge (featured) → SabiScore (live ML) → SwarmXQ (AI platform)

export type ProjectStatus = 'live' | 'wip' | 'archived';

export interface DecisionRecord {
  readonly chosen: string;
  readonly rejected: string;
  readonly reason: string;
}

export interface Project {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly tagline: string;
  readonly status: ProjectStatus;
  readonly featured?: boolean;
  readonly type: string;
  readonly description: string;
  readonly context?: string;
  readonly tags: readonly string[];
  readonly outcomes: readonly string[];
  readonly decisions?: readonly DecisionRecord[];
  readonly demoUrl?: string;
  readonly repoUrl?: string;
  readonly caseStudy?: string;
}

export const PROJECTS: readonly Project[] = [
  {
    id: 'taxbridge',
    slug: 'taxbridge',
    title: 'TaxBridge',
    type: 'Compliance Platform · Fintech',
    status: 'live',
    featured: true,
    tagline:
      'Nigerian SME tax filing from 4 hours to 15 minutes — NRS-integrated, audit-ready.',
    description:
      'Full tax compliance workflow automation for Nigerian small businesses — VAT, withholding tax, and annual returns. PostgreSQL RLS isolates each tenant at the database level. Real-time calculations under <150ms at load. Idempotent BullMQ job queue ensures no submission is ever double-processed — even through mid-request server failure. Hash-chained immutable audit trail. 95% test coverage.',
    context:
      'NRS API rate limits: 30 req/min per TIN. BullMQ queue must manage burst filing windows without client-visible failure.',
    decisions: [
      {
        chosen: 'PostgreSQL Row-Level Security for multi-tenancy',
        rejected: 'Application-layer tenant filtering',
        reason:
          'NRS audit scrutiny demands proof that tenant data cannot cross-contaminate — RLS enforces this at the database engine level, not the application layer',
      },
    ],
    outcomes: [
      '4hrs → 15min filing',
      'sub-150ms under load',
      '95% test coverage',
      'zero data-loss record',
    ],
    tags: [
      'Fastify 5',
      'PostgreSQL 15 RLS',
      'Redis 7',
      'BullMQ',
      'React Native',
      'Prisma',
      'TypeScript',
    ],
    repoUrl: 'https://github.com/Scardubu/taxbridge',
    caseStudy: '/work/taxbridge',
  },
  {
    id: 'sabiscore',
    slug: 'sabiscore',
    title: 'SabiScore',
    type: 'ML Platform · Observability',
    status: 'live',
    tagline:
      'Production ML prediction and self-monitoring platform for live decision windows.',
    description:
      'Ensemble credit and prediction scoring (XGBoost, LightGBM, CatBoost) with real-time output quality monitoring. Alerts engineers the moment a model begins degrading — before any user is affected. 99.9%+ uptime (Prometheus · 90-day window). ~30% inference latency reduction via query optimisation and Redis caching. 45% MTTD improvement over reactive alerting baseline.',
    context:
      'Ensemble inference must complete in <120ms p99 at peak load with no model warmup on cold start.',
    decisions: [
      {
        chosen: 'FastAPI + Redis Pub/Sub for inference serving',
        rejected: 'Synchronous REST with database polling',
        reason:
          'Sub-50ms event fan-out at sustained load with dead-letter recovery — impossible with polling under concurrent sessions',
      },
    ],
    outcomes: [
      '30% inference latency reduction',
      '99.9%+ uptime',
      '45% MTTD improvement',
      'Prometheus 90-day proof',
    ],
    tags: [
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
    repoUrl: 'https://github.com/Scardubu/Sabiscore',
    caseStudy: '/work/sabiscore',
  },
  {
    id: 'swarmxq',
    slug: 'swarmxq',
    title: 'SwarmXQ',
    type: 'AI Platform · Agent Orchestration',
    status: 'live',
    tagline:
      'Self-improving multi-agent operator platform — autonomous evolution, live dashboard, production-grade AI fleet management.',
    description:
      'Full-stack AI agent orchestration platform built for reliability under resource constraints. Features an autonomous evolution layer that continuously improves agent behaviour from production signals, a live ops dashboard for real-time fleet monitoring, and a workflow engine that coordinates heterogeneous agent types across long-horizon tasks. Triadic GGUF model dispatch: Phi-4-mini for routing, DeepSeek-R1 for reasoning, Qwen2.5-Coder for execution — all served via Ollama with zero cloud dependency.',
    context:
      'Full agent fleet must operate on 8 GB VRAM with zero cloud API dependency — Ollama + GGUF quantisation enforced as a hard constraint throughout.',
    decisions: [
      {
        chosen: 'Local GGUF triadic model dispatch via Ollama',
        rejected: 'Single large remote LLM API call per task',
        reason:
          'Specialised small models routed by task class outperform a single large model on latency, cost, and offline resilience — critical for production Lagos infrastructure where cloud egress is metered',
      },
    ],
    outcomes: [
      'autonomous agent evolution',
      'live ops dashboard',
      'zero cloud dependency',
      'triadic model routing',
    ],
    tags: [
      'Python 3.12',
      'Ollama',
      'FastAPI',
      'BullMQ',
      'PostgreSQL',
      'TypeScript',
      'Next.js 15',
    ],
    repoUrl: 'https://github.com/Scardubu/SwarmXQ',
    caseStudy: '/work/swarmxq',
  },
];

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}