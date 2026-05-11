/**
 * lib/data/skills.ts
 *
 * Every skill node must carry at least one used-in:system-id tag.
 * Java 17 and Spring Boot 3 appear with used-in:taxbridge context — never bare.
 * Fintech & Compliance is a first-class pillar, not a subsection of Backend.
 *
 * Level definitions:
 *   expert       — used in production; can design, debug, and teach it
 *   proficient   — used in production; can implement and maintain without reference
 *   foundational — used in a project; understand it well enough to extend
 */

import type { SkillNode, SkillPillar } from '@/lib/types';

// ─── Skill data ───────────────────────────────────────────────────────────────

export const SKILLS: SkillNode[] = [
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
    id: 'python',
    name: 'Python 3.11+',
    pillar: 'Backend & APIs',
    level: 'expert',
    tags: ['used-in:sabiscore', 'used-in:ubec'],
  },
  {
    id: 'java17',
    name: 'Java 17+',
    pillar: 'Backend & APIs',
    level: 'proficient',
    tags: ['used-in:taxbridge', 'used-in:ubec'],
  },
  {
    id: 'springboot',
    name: 'Spring Boot 3',
    pillar: 'Backend & APIs',
    level: 'proficient',
    tags: ['used-in:taxbridge'],
  },
  {
    id: 'pydantic',
    name: 'Pydantic v2',
    pillar: 'Backend & APIs',
    level: 'expert',
    tags: ['used-in:taxbridge', 'used-in:ubec'],
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
    id: 'grpc',
    name: 'gRPC / Protobuf',
    pillar: 'Backend & APIs',
    level: 'proficient',
    tags: ['used-in:sabiscore', 'used-in:taxbridge'],
  },

  // ── Fintech & Compliance ──────────────────────────────────────────────────
  {
    id: 'postgres-rls',
    name: 'Postgres RLS',
    pillar: 'Fintech & Compliance',
    level: 'expert',
    tags: ['used-in:taxbridge', 'documented'],
  },
  {
    id: 'event-sourcing',
    name: 'Event Sourcing',
    pillar: 'Fintech & Compliance',
    level: 'proficient',
    tags: ['used-in:taxbridge'],
  },
  {
    id: 'multitenant',
    name: 'Multi-tenant Design',
    pillar: 'Fintech & Compliance',
    level: 'expert',
    tags: ['used-in:taxbridge'],
  },
  {
    id: 'gdpr',
    name: 'GDPR Controls',
    pillar: 'Fintech & Compliance',
    level: 'proficient',
    tags: ['used-in:taxbridge', 'used-in:swarmxq'],
  },
  {
    id: 'kyc-aml',
    name: 'KYC/AML Patterns',
    pillar: 'Fintech & Compliance',
    level: 'foundational',
    tags: ['used-in:taxbridge'],
  },
  {
    id: 'audit-trail',
    name: 'Audit Trail Design',
    pillar: 'Fintech & Compliance',
    level: 'proficient',
    tags: ['used-in:taxbridge', 'used-in:ubec'],
  },

  // ── Data & Storage ─────────────────────────────────────────────────────────
  {
    id: 'postgres',
    name: 'PostgreSQL 16',
    pillar: 'Data & Storage',
    level: 'expert',
    tags: ['used-in:sabiscore', 'used-in:taxbridge', 'used-in:ubec'],
  },
  {
    id: 'redis',
    name: 'Redis 7',
    pillar: 'Data & Storage',
    level: 'expert',
    tags: ['used-in:sabiscore', 'used-in:taxbridge', 'documented'],
  },
  {
    id: 'bullmq',
    name: 'BullMQ',
    pillar: 'Data & Storage',
    level: 'proficient',
    tags: ['used-in:taxbridge'],
  },
  {
    id: 'airflow',
    name: 'Apache Airflow',
    pillar: 'Data & Storage',
    level: 'proficient',
    tags: ['used-in:ubec'],
  },
  {
    id: 'pandas',
    name: 'pandas',
    pillar: 'Data & Storage',
    level: 'expert',
    tags: ['used-in:ubec', 'used-in:sabiscore'],
  },
  {
    id: 'great-expectations',
    name: 'Great Expectations',
    pillar: 'Data & Storage',
    level: 'proficient',
    tags: ['used-in:ubec'],
  },

  // ── DevOps & SRE ──────────────────────────────────────────────────────────
  {
    id: 'docker',
    name: 'Docker',
    pillar: 'DevOps & SRE',
    level: 'expert',
    tags: ['used-in:sabiscore', 'used-in:taxbridge', 'used-in:swarmxq'],
  },
  {
    id: 'github-actions',
    name: 'GitHub Actions',
    pillar: 'DevOps & SRE',
    level: 'proficient',
    tags: ['used-in:sabiscore'],
  },
  {
    id: 'sentry',
    name: 'Sentry',
    pillar: 'DevOps & SRE',
    level: 'proficient',
    tags: ['used-in:sabiscore', 'documented'],
  },
  {
    id: 'blue-green',
    name: 'Blue-Green Deployments',
    pillar: 'DevOps & SRE',
    level: 'proficient',
    tags: ['used-in:sabiscore', 'documented'],
  },
  {
    id: 'prometheus',
    name: 'Prometheus / Grafana',
    pillar: 'DevOps & SRE',
    level: 'proficient',
    tags: ['used-in:sabiscore', 'documented'],
  },

  // ── Frontend & Full-Stack ─────────────────────────────────────────────────
  {
    id: 'nextjs',
    name: 'Next.js 15',
    pillar: 'Frontend & Full-Stack',
    level: 'proficient',
    tags: ['used-in:sabiscore', 'documented'],
  },
  {
    id: 'typescript',
    name: 'TypeScript strict',
    pillar: 'Frontend & Full-Stack',
    level: 'expert',
    tags: ['used-in:sabiscore', 'documented'],
  },
  {
    id: 'react',
    name: 'React 19',
    pillar: 'Frontend & Full-Stack',
    level: 'proficient',
    tags: ['used-in:sabiscore', 'used-in:swarmxq'],
  },
  {
    id: 'react-native',
    name: 'React Native / Expo SDK 54',
    pillar: 'Frontend & Full-Stack',
    level: 'proficient',
    tags: ['used-in:taxbridge'],
  },
  {
    id: 'turborepo',
    name: 'Turborepo 2',
    pillar: 'Frontend & Full-Stack',
    level: 'proficient',
    tags: ['used-in:taxbridge'],
  },

  // ── AI Agent Orchestration ────────────────────────────────────────────────
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
    id: 'phi4-mini',
    name: 'Phi-4-mini (router)',
    pillar: 'AI Agent Orchestration',
    level: 'proficient',
    tags: ['used-in:swarmxq'],
  },
  {
    id: 'deepseek-r1',
    name: 'DeepSeek-R1 (reasoning)',
    pillar: 'AI Agent Orchestration',
    level: 'proficient',
    tags: ['used-in:swarmxq'],
  },
  {
    id: 'qwen-coder',
    name: 'Qwen2.5-Coder (code gen)',
    pillar: 'AI Agent Orchestration',
    level: 'proficient',
    tags: ['used-in:swarmxq'],
  },
  {
    id: 'autonomous-evolution',
    name: 'Autonomous Agent Evolution',
    pillar: 'AI Agent Orchestration',
    level: 'proficient',
    tags: ['used-in:swarmxq', 'documented'],
  },

  // ── Blockchain & Web3 ─────────────────────────────────────────────────────
  {
    id: 'circom',
    name: 'Circom 2',
    pillar: 'Blockchain & Web3',
    level: 'proficient',
    tags: ['used-in:hashablanca'],
  },
  {
    id: 'snarkjs',
    name: 'snarkjs (Groth16)',
    pillar: 'Blockchain & Web3',
    level: 'proficient',
    tags: ['used-in:hashablanca'],
  },
  {
    id: 'solidity',
    name: 'Solidity',
    pillar: 'Blockchain & Web3',
    level: 'foundational',
    tags: ['used-in:hashablanca'],
  },
  {
    id: 'web3py',
    name: 'Web3.py',
    pillar: 'Blockchain & Web3',
    level: 'proficient',
    tags: ['used-in:hashablanca'],
  },

  // ── ML & AI (extended) ─────────────────────────────────────────────────────
  {
    id: 'pytorch',
    name: 'PyTorch',
    pillar: 'ML & AI',
    level: 'proficient',
    tags: ['used-in:sabiscore', 'documented'],
  },
  {
    id: 'onnx-runtime',
    name: 'ONNX Runtime',
    pillar: 'ML & AI',
    level: 'proficient',
    tags: ['used-in:sabiscore'],
  },
  {
    id: 'huggingface',
    name: 'Hugging Face',
    pillar: 'ML & AI',
    level: 'proficient',
    tags: ['used-in:sabiscore', 'documented'],
  },
  {
    id: 'langchain',
    name: 'LangChain / LangGraph',
    pillar: 'ML & AI',
    level: 'foundational',
    tags: ['used-in:sabiscore'],
  },
  {
    id: 'mlflow',
    name: 'MLflow',
    pillar: 'ML & AI',
    level: 'proficient',
    tags: ['used-in:sabiscore', 'documented'],
  },

  // ── DevOps & SRE (extended) ────────────────────────────────────────────────
  {
    id: 'kubernetes',
    name: 'Kubernetes / K8s',
    pillar: 'DevOps & SRE',
    level: 'proficient',
    tags: ['used-in:sabiscore', 'used-in:taxbridge'],
  },
  {
    id: 'opentelemetry',
    name: 'OpenTelemetry',
    pillar: 'DevOps & SRE',
    level: 'proficient',
    tags: ['used-in:sabiscore', 'used-in:taxbridge', 'documented'],
  },
  {
    id: 'terraform',
    name: 'Terraform',
    pillar: 'DevOps & SRE',
    level: 'foundational',
    tags: ['used-in:sabiscore'],
  },

  // ── Backend & APIs (extended) ──────────────────────────────────────────────
  {
    id: 'graphql',
    name: 'GraphQL',
    pillar: 'Backend & APIs',
    level: 'proficient',
    tags: ['used-in:taxbridge', 'used-in:swarmxq'],
  },
  {
    id: 'celery',
    name: 'Celery',
    pillar: 'Backend & APIs',
    level: 'proficient',
    tags: ['used-in:ubec', 'used-in:sabiscore'],
  },

  // ── Frontend & Full-Stack (extended) ──────────────────────────────────────
  {
    id: 'tailwind-v4',
    name: 'Tailwind CSS v4',
    pillar: 'Frontend & Full-Stack',
    level: 'expert',
    tags: ['used-in:sabiscore', 'documented'],
  },
];

// ─── Accessors ────────────────────────────────────────────────────────────────

export const ALL_PILLARS: SkillPillar[] = [
  'ML & AI',
  'Backend & APIs',
  'Fintech & Compliance',
  'Data & Storage',
  'DevOps & SRE',
  'Frontend & Full-Stack',
  'AI Agent Orchestration',
  'Blockchain & Web3',
]

export function getSkillsByPillar(pillar: SkillPillar): SkillNode[] {
  return SKILLS.filter(s => s.pillar === pillar)
}

export function getSkillsBySystem(systemId: string): SkillNode[] {
  return SKILLS.filter(s => (s.tags as readonly string[]).includes(`used-in:${systemId}`))
}