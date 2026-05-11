// CONVICTION ENGINE v24.0 — Projects Data
// v24 CHANGES vs v23:
//   • SwarmXQ: tagline, description, and tags updated to foreground the
//     Next.js 15 live dashboard — the strongest full-stack proof in the project.
//   • TaxBridge: "React Native app" made explicit in tagline (was buried in tags).
//   • SabiScore: "Next.js 15 dashboard" named explicitly in description.
//   • Hashablanca: preserved as a historical reference, archived status.
//   • KEEP: All project slugs, repoUrls, caseStudy paths unchanged.

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
    // v24: "React Native app" is now named in the tagline
    tagline:
      'Nigerian SME tax filing from 4 hours to 15 minutes — React Native app, NRS-integrated, audit-ready.',
    description:
      'Full tax compliance workflow automation for Nigerian small businesses — VAT, withholding tax, and annual returns. React Native / Expo 54 mobile app connected to a Fastify 5 API with PostgreSQL RLS isolating each tenant at the database level. Real-time calculations under <150ms at load. Idempotent BullMQ job queue ensures no submission is ever double-processed — even through mid-request server failure. Hash-chained immutable audit trail. 95% test coverage.',
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
      'React Native / Expo 54',
      'Fastify 5',
      'TypeScript',
      'PostgreSQL 15 RLS',
      'Redis 7',
      'BullMQ',
      'Prisma',
      'Java 17',
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
      'Production ML prediction and self-monitoring platform — ensemble inference behind a Next.js 15 live dashboard.',
    // v24: "Next.js 15 dashboard" explicitly named
    description:
      'Ensemble credit and prediction scoring (XGBoost, LightGBM, CatBoost) with real-time output quality monitoring served through a Next.js 15 dashboard with Tailwind v4. Alerts engineers the moment a model begins degrading — before any user is affected. 99.9%+ uptime (Prometheus · 90-day window). ~30% inference latency reduction via query optimisation and Redis caching. 45% MTTD improvement over reactive alerting baseline.',
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
      'Next.js 15',
      'React 19',
      'Tailwind v4',
      'FastAPI',
      'XGBoost',
      'LightGBM',
      'CatBoost',
      'Redis Pub/Sub',
      'Prometheus',
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
    // v24: "Next.js 15 live ops dashboard" foregrounded — strongest full-stack proof
    tagline:
      'Self-improving multi-agent platform — autonomous evolution layer, Next.js 15 live ops dashboard, zero cloud dependency.',
    description:
      'Full-stack AI agent orchestration platform. Frontend: Next.js 15 App Router dashboard with React 19, Tailwind v4, and Framer Motion for real-time fleet monitoring, workflow visualisation, and agent lifecycle management. Backend: Python multi-agent runtime with Fastify TypeScript API bridge, autonomous evolution layer that continuously improves agent behaviour from production signals, and a workflow engine coordinating heterogeneous agent types. Triadic GGUF model dispatch: Phi-4-mini for routing, DeepSeek-R1 for reasoning, Qwen2.5-Coder for execution — all via Ollama, zero cloud API dependency.',
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
      'Next.js 15 live ops dashboard',
      'zero cloud dependency',
      'triadic model routing',
    ],
    tags: [
      'Next.js 15',
      'React 19',
      'Tailwind v4',
      'Framer Motion',
      'TypeScript',
      'Fastify 5',
      'Python 3.12',
      'Ollama',
      'FastAPI',
      'BullMQ',
      'PostgreSQL',
    ],
    repoUrl: 'https://github.com/Scardubu/SwarmXQ',
    caseStudy: '/work/swarmxq',
  },
  // Hashablanca: archived — predecessor to SwarmXQ. Skills preserved.
  {
    id: 'hashablanca',
    slug: 'hashablanca',
    title: 'Hashablanca',
    type: 'AI Platform · Predecessor',
    status: 'archived',
    tagline:
      'The multi-agent shell that evolved into SwarmXQ — agent skills, orchestration patterns, and runtime model still in use.',
    description:
      'Original multi-agent orchestration system (shell-script + Python paradigm) that established the agent skill contracts, task routing logic, and GGUF model dispatch patterns later used in SwarmXQ. Audited and surgically patched (21 issues resolved); its agent catalog of 30 specialist agents forms the foundation of SwarmXQ\'s APEX-17 evolution pipeline.',
    context:
      'Developed under the same 8 GB VRAM constraint as SwarmXQ. All runtime decisions informed the production architecture.',
    outcomes: [
      '30-agent catalog foundation',
      'APEX-17 pipeline basis',
      'agent skill contracts',
      'GGUF model dispatch patterns',
    ],
    tags: [
      'Python 3.11',
      'Shell scripting',
      'Ollama',
      'GGUF',
      'Agent Orchestration',
    ],
    repoUrl: 'https://github.com/Scardubu/hashablanca',
    caseStudy: '/work/hashablanca',
  },
];

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}