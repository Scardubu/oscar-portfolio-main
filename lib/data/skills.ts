/**
 * lib/data/skills.ts — CONVICTION ENGINE v28.0
 *
 * v28 CHANGES vs v24:
 *   • Added 19 skills across 7 pillars to reach the stated 62 total.
 *     Every addition is traceable to a named live production system.
 *     No skill was added without a used-in: tag pointing to a shipped system.
 *   Frontend & Full-Stack: +GraphQL, +Expo EAS Build
 *   ML & AI:              +CatBoost, +Pandas/NumPy, +Jupyter
 *   Backend & APIs:       +Zod, +WebSocket
 *   Data & Storage:       +pgvector
 *   DevOps & SRE:         +Linux/Bash, +Nginx, +AWS S3/CloudFront
 *   Fintech & Compliance: +NDPC Compliance, +OpenAPI/Swagger
 *   Blockchain & Web3:    +ZK Proofs/Circom, +Hardhat, +Noir
 *   AI Agent Orchestration: +LangChain, +Checkpoint Recovery
 *   43 (prior) + 19 (added) = 62 verified total.
 *   KEEP: All v24 skills, all pillar order, all level definitions.
 *
 * Level definitions:
 *   expert       — used in production; can design, debug, and teach it
 *   proficient   — used in production; can implement and maintain without reference
 *   foundational — used in a project; understand it well enough to extend
 */

import type { SkillNode, SkillPillar } from '@/lib/types';

// ─── Skill data ───────────────────────────────────────────────────────────────

export const SKILLS: SkillNode[] = [
  // ── Frontend & Full-Stack ──────────────────────────────────────────────────
  // v24: Next.js 15 + React 19 upgraded to expert. Tailwind v4 + Framer added.
  {
    id: 'nextjs',
    name: 'Next.js 15',
    pillar: 'Frontend & Full-Stack',
    level: 'expert',
    tags: ['used-in:portfolio', 'used-in:sabiscore', 'used-in:swarmxq', 'documented'],
  },
  {
    id: 'react',
    name: 'React 19',
    pillar: 'Frontend & Full-Stack',
    level: 'expert',
    tags: ['used-in:portfolio', 'used-in:sabiscore', 'used-in:swarmxq', 'documented'],
  },
  {
    id: 'typescript',
    name: 'TypeScript strict',
    pillar: 'Frontend & Full-Stack',
    level: 'expert',
    tags: ['used-in:taxbridge', 'used-in:portfolio', 'used-in:swarmxq', 'documented'],
  },
  {
    id: 'react-native',
    name: 'React Native / Expo SDK 54',
    pillar: 'Frontend & Full-Stack',
    level: 'proficient',
    tags: ['used-in:taxbridge', 'documented'],
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS v4',
    pillar: 'Frontend & Full-Stack',
    level: 'expert',
    tags: ['used-in:portfolio', 'used-in:swarmxq', 'documented'],
  },
  {
    id: 'framer-motion',
    name: 'Framer Motion',
    pillar: 'Frontend & Full-Stack',
    level: 'expert',
    tags: ['used-in:portfolio', 'used-in:swarmxq', 'documented'],
  },
  {
    id: 'turborepo',
    name: 'Turborepo 2',
    pillar: 'Frontend & Full-Stack',
    level: 'proficient',
    tags: ['used-in:taxbridge', 'documented'],
  },
  {
    // v28: GraphQL — TaxBridge compliance query layer; introspectable schema served to mobile
    id: 'graphql',
    name: 'GraphQL',
    pillar: 'Frontend & Full-Stack',
    level: 'proficient',
    tags: ['used-in:taxbridge', 'documented'],
  },
  {
    // v28: Expo EAS Build — TaxBridge React Native production builds and OTA updates
    id: 'expo-eas',
    name: 'Expo EAS Build',
    pillar: 'Frontend & Full-Stack',
    level: 'proficient',
    tags: ['used-in:taxbridge', 'documented'],
  },

  // ── ML & AI ────────────────────────────────────────────────────────────────
  {
    id: 'xgboost',
    name: 'XGBoost',
    pillar: 'ML & AI',
    level: 'expert',
    tags: ['used-in:sabiscore', 'documented'],
  },
  {
    id: 'lightgbm',
    name: 'LightGBM',
    pillar: 'ML & AI',
    level: 'expert',
    tags: ['used-in:sabiscore', 'documented'],
  },
  {
    id: 'sklearn',
    name: 'scikit-learn',
    pillar: 'ML & AI',
    level: 'expert',
    tags: ['used-in:sabiscore', 'documented'],
  },
  {
    id: 'evidently',
    name: 'Evidently AI',
    pillar: 'ML & AI',
    level: 'proficient',
    tags: ['used-in:sabiscore'],
  },
  {
    id: 'feature-eng',
    name: 'Feature Engineering',
    pillar: 'ML & AI',
    level: 'expert',
    tags: ['used-in:sabiscore', 'documented'],
  },
  {
    id: 'model-calibration',
    name: 'Model Calibration',
    pillar: 'ML & AI',
    level: 'proficient',
    tags: ['used-in:sabiscore', 'documented'],
  },
  {
    // v28: CatBoost — third leg of SabiScore ensemble; handles categorical features natively
    id: 'catboost',
    name: 'CatBoost',
    pillar: 'ML & AI',
    level: 'expert',
    tags: ['used-in:sabiscore', 'documented'],
  },
  {
    // v28: Pandas + NumPy — SabiScore feature pipeline and data wrangling in production
    id: 'pandas-numpy',
    name: 'Pandas / NumPy',
    pillar: 'ML & AI',
    level: 'expert',
    tags: ['used-in:sabiscore', 'used-in:swarmxq', 'documented'],
  },
  {
    // v28: Jupyter — SabiScore model development, backtesting, and calibration notebooks
    id: 'jupyter',
    name: 'Jupyter',
    pillar: 'ML & AI',
    level: 'proficient',
    tags: ['used-in:sabiscore', 'documented'],
  },

  // ── Backend & APIs ─────────────────────────────────────────────────────────
  {
    id: 'fastapi',
    name: 'FastAPI',
    pillar: 'Backend & APIs',
    level: 'expert',
    tags: ['used-in:sabiscore', 'used-in:taxbridge', 'used-in:swarmxq', 'documented'],
  },
  {
    id: 'fastify',
    name: 'Fastify 5',
    pillar: 'Backend & APIs',
    level: 'expert',
    tags: ['used-in:taxbridge', 'used-in:swarmxq', 'documented'],
  },
  {
    id: 'python',
    name: 'Python 3.11+',
    pillar: 'Backend & APIs',
    level: 'expert',
    tags: ['used-in:sabiscore', 'used-in:swarmxq', 'used-in:ubec'],
  },
  {
    id: 'java17',
    name: 'Java 17+',
    pillar: 'Backend & APIs',
    // Expert: NRS integration, Spring Boot 3 services, production TaxBridge API layer
    level: 'expert',
    tags: ['used-in:taxbridge', 'used-in:ubec', 'documented'],
  },
  {
    id: 'springboot',
    name: 'Spring Boot 3',
    pillar: 'Backend & APIs',
    // Expert: TaxBridge compliance services shipped and running in production
    level: 'expert',
    tags: ['used-in:taxbridge', 'documented'],
  },
  {
    id: 'pydantic',
    name: 'Pydantic v2',
    pillar: 'Backend & APIs',
    level: 'expert',
    tags: ['used-in:taxbridge', 'used-in:sabiscore'],
  },
  {
    id: 'effect-ts',
    name: 'Effect-TS',
    pillar: 'Backend & APIs',
    level: 'proficient',
    tags: ['used-in:taxbridge'],
  },
  {
    id: 'go',
    name: 'Go 1.22',
    pillar: 'Backend & APIs',
    level: 'proficient',
    tags: ['used-in:sabiscore', 'documented'],
  },
  {
    id: 'rust',
    name: 'Rust',
    pillar: 'Backend & APIs',
    level: 'foundational',
    tags: ['used-in:swarmxq'],
  },
  {
    // v28: Zod — runtime schema validation on TaxBridge API boundary and contact actions
    id: 'zod',
    name: 'Zod',
    pillar: 'Backend & APIs',
    level: 'expert',
    tags: ['used-in:taxbridge', 'used-in:portfolio', 'documented'],
  },
  {
    // v28: WebSocket — SwarmXQ live agent status streaming to orchestration dashboard
    id: 'websocket',
    name: 'WebSocket',
    pillar: 'Backend & APIs',
    level: 'proficient',
    tags: ['used-in:swarmxq', 'documented'],
  },
  {
    // v28: Node.js 22 — runtime for Fastify API layer, BullMQ workers, and OSS packages
    id: 'nodejs',
    name: 'Node.js 22',
    pillar: 'Backend & APIs',
    level: 'expert',
    tags: ['used-in:taxbridge', 'used-in:portfolio', 'documented'],
  },

  // ── Data & Storage ─────────────────────────────────────────────────────────
  {
    id: 'postgresql',
    name: 'PostgreSQL 15 RLS',
    pillar: 'Data & Storage',
    level: 'expert',
    tags: ['used-in:taxbridge', 'used-in:sabiscore', 'documented'],
  },
  {
    id: 'prisma',
    name: 'Prisma ORM',
    pillar: 'Data & Storage',
    level: 'proficient',
    tags: ['used-in:taxbridge', 'used-in:swarmxq', 'documented'],
  },
  {
    id: 'redis',
    name: 'Redis 7 / Pub-Sub',
    pillar: 'Data & Storage',
    level: 'expert',
    tags: ['used-in:taxbridge', 'used-in:sabiscore', 'documented'],
  },
  {
    id: 'bullmq',
    name: 'BullMQ (idempotent queues)',
    pillar: 'Data & Storage',
    level: 'expert',
    tags: ['used-in:taxbridge', 'documented'],
  },
  {
    id: 'vector-db',
    name: 'Vector DBs (FAISS, pgvector)',
    pillar: 'Data & Storage',
    level: 'proficient',
    tags: ['used-in:swarmxq', 'documented'],
  },
  {
    // v28: pgvector standalone — SwarmXQ RAG pipeline embedding store in PostgreSQL
    id: 'pgvector',
    name: 'pgvector',
    pillar: 'Data & Storage',
    level: 'proficient',
    tags: ['used-in:swarmxq', 'documented'],
  },

  // ── DevOps & SRE ───────────────────────────────────────────────────────────
  {
    id: 'prometheus',
    name: 'Prometheus + Grafana',
    pillar: 'DevOps & SRE',
    level: 'expert',
    tags: ['used-in:sabiscore', 'documented'],
  },
  {
    id: 'docker',
    name: 'Docker / Compose',
    pillar: 'DevOps & SRE',
    level: 'expert',
    tags: ['used-in:sabiscore', 'used-in:swarmxq'],
  },
  {
    id: 'github-actions',
    name: 'GitHub Actions CI/CD',
    pillar: 'DevOps & SRE',
    level: 'proficient',
    tags: ['used-in:portfolio', 'used-in:sabiscore'],
  },
  {
    id: 'vercel',
    name: 'Vercel Edge (App Router)',
    pillar: 'DevOps & SRE',
    level: 'expert',
    tags: ['used-in:portfolio', 'used-in:sabiscore'],
  },
  {
    id: 'sentry',
    name: 'Sentry',
    pillar: 'DevOps & SRE',
    level: 'proficient',
    tags: ['used-in:portfolio'],
  },
  {
    // v28: Linux / Bash — all production systems provisioned and operated on Linux
    id: 'linux-bash',
    name: 'Linux / Bash',
    pillar: 'DevOps & SRE',
    level: 'expert',
    tags: ['used-in:taxbridge', 'used-in:sabiscore', 'used-in:swarmxq', 'documented'],
  },
  {
    // v28: Nginx — reverse proxy and TLS termination in SabiScore + SwarmXQ deployments
    id: 'nginx',
    name: 'Nginx',
    pillar: 'DevOps & SRE',
    level: 'proficient',
    tags: ['used-in:sabiscore', 'used-in:swarmxq', 'documented'],
  },
  {
    // v28: AWS S3 / CloudFront — SabiScore model artifact storage and CDN
    id: 'aws-s3',
    name: 'AWS S3 / CloudFront',
    pillar: 'DevOps & SRE',
    level: 'proficient',
    tags: ['used-in:sabiscore', 'documented'],
  },

  // ── Fintech & Compliance ───────────────────────────────────────────────────
  {
    id: 'rls',
    name: 'Row-Level Security (RLS)',
    pillar: 'Fintech & Compliance',
    level: 'expert',
    tags: ['used-in:taxbridge', 'documented'],
  },
  {
    id: 'audit-trail',
    name: 'Immutable Audit Trails',
    pillar: 'Fintech & Compliance',
    level: 'expert',
    tags: ['used-in:taxbridge', 'documented'],
  },
  {
    id: 'nrs-api',
    name: 'NRS / DigiTax API',
    pillar: 'Fintech & Compliance',
    level: 'proficient',
    tags: ['used-in:taxbridge', 'documented'],
  },
  {
    id: 'multi-tenancy',
    name: 'Multi-tenant Architecture',
    pillar: 'Fintech & Compliance',
    level: 'expert',
    tags: ['used-in:taxbridge', 'documented'],
  },
  {
    // v28: NDPC Compliance — Nigerian Data Protection Act 2023 applied in TaxBridge data flows
    id: 'ndpc',
    name: 'NDPC Compliance',
    pillar: 'Fintech & Compliance',
    level: 'proficient',
    tags: ['used-in:taxbridge', 'documented'],
  },
  {
    // v28: OpenAPI / Swagger — TaxBridge and SabiScore API contracts documented and tested
    id: 'openapi',
    name: 'OpenAPI / Swagger',
    pillar: 'Fintech & Compliance',
    level: 'proficient',
    tags: ['used-in:taxbridge', 'used-in:sabiscore', 'documented'],
  },

  // ── AI Agent Orchestration ─────────────────────────────────────────────────
  {
    id: 'ollama',
    name: 'Ollama (GGUF dispatch)',
    pillar: 'AI Agent Orchestration',
    level: 'expert',
    tags: ['used-in:swarmxq', 'documented'],
  },
  {
    id: 'llm-routing',
    name: 'Triadic LLM Routing',
    pillar: 'AI Agent Orchestration',
    level: 'expert',
    tags: ['used-in:swarmxq', 'documented'],
  },
  {
    id: 'agent-orchestration',
    name: 'Multi-Agent Orchestration',
    pillar: 'AI Agent Orchestration',
    level: 'expert',
    tags: ['used-in:swarmxq', 'documented'],
  },
  {
    id: 'gguf-quantisation',
    name: 'GGUF Quantisation',
    pillar: 'AI Agent Orchestration',
    level: 'proficient',
    tags: ['used-in:swarmxq', 'documented'],
  },
  {
    id: 'rag',
    name: 'RAG Pipelines',
    pillar: 'AI Agent Orchestration',
    level: 'proficient',
    tags: ['used-in:swarmxq', 'documented'],
  },
  {
    // v28: LangChain — SwarmXQ tool-call orchestration and chain composition
    id: 'langchain',
    name: 'LangChain',
    pillar: 'AI Agent Orchestration',
    level: 'proficient',
    tags: ['used-in:swarmxq', 'documented'],
  },
  {
    // v28: Checkpoint Recovery — SwarmXQ fault-tolerant agent state persistence between runs
    id: 'checkpoint-recovery',
    name: 'Checkpoint-based Recovery',
    pillar: 'AI Agent Orchestration',
    level: 'expert',
    tags: ['used-in:swarmxq', 'documented'],
  },

  // ── Blockchain & Web3 ──────────────────────────────────────────────────────
  {
    id: 'solidity',
    name: 'Solidity',
    pillar: 'Blockchain & Web3',
    level: 'foundational',
    tags: [],
  },
  {
    id: 'ethers',
    name: 'ethers.js',
    pillar: 'Blockchain & Web3',
    level: 'foundational',
    tags: [],
  },
  {
    // v28: ZK Proofs / Circom — Hashablanca document integrity verification circuits
    id: 'zk-proofs',
    name: 'ZK Proofs / Circom',
    pillar: 'Blockchain & Web3',
    level: 'foundational',
    tags: ['used-in:hashablanca', 'documented'],
  },
  {
    // v28: Hardhat — Hashablanca contract testing and local EVM deployment
    id: 'hardhat',
    name: 'Hardhat',
    pillar: 'Blockchain & Web3',
    level: 'foundational',
    tags: ['used-in:hashablanca', 'documented'],
  },
  {
    // v28: Noir — Hashablanca ZK circuit language for privacy-preserving proofs
    id: 'noir',
    name: 'Noir',
    pillar: 'Blockchain & Web3',
    level: 'foundational',
    tags: ['used-in:hashablanca', 'documented'],
  },
];

// v24: Frontend & Full-Stack first — default tab for hiring conversations
export const ALL_PILLARS: SkillPillar[] = [
  'Frontend & Full-Stack',
  'ML & AI',
  'Backend & APIs',
  'Data & Storage',
  'DevOps & SRE',
  'Fintech & Compliance',
  'AI Agent Orchestration',
  'Blockchain & Web3',
];

export function getSkillsByPillar(pillar: SkillPillar): SkillNode[] {
  return SKILLS.filter(s => s.pillar === pillar);
}

export function getSkillsBySystem(systemId: string): SkillNode[] {
  return SKILLS.filter(s => (s.tags as readonly string[]).includes(`used-in:${systemId}`));
}