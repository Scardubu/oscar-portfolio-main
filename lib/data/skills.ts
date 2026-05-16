/**
 * lib/data/skills.ts — CONVICTION ENGINE v24.0
 *
 * v24 CHANGES vs v23:
 *   • ALL_PILLARS: "Frontend & Full-Stack" moved to position 0 (was 5).
 *     Default tab now shows React · Next.js 15 · React Native — the skills
 *     most relevant to Staff+ and co-founder conversations.
 *   • Next.js 15: level 'proficient' → 'expert'. Used in 3 production systems
 *     (portfolio, SabiScore, SwarmXQ dashboard). Expert threshold met.
 *   • React 19: level 'proficient' → 'expert'. Cross-project ownership.
 *   • Added Tailwind CSS v4: expert, used-in:portfolio + used-in:swarmxq
 *   • Added Framer Motion: expert, used-in:portfolio
 *   • Added Prisma ORM: proficient, used-in:taxbridge
 *   • Added Fastify 5: expert, used-in:taxbridge + used-in:swarmxq
 *   • KEEP: All existing skills unchanged. Level definitions below.
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