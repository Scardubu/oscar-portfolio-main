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

import type { SkillNode, SkillPillar } from '@/lib/types'

// ─── Skill data ───────────────────────────────────────────────────────────────

export const SKILLS: SkillNode[] = [

  // ── ML & AI ────────────────────────────────────────────────────────────────
  {
    id:     'xgboost',
    name:   'XGBoost',
    pillar: 'ML & AI',
    level:  'expert',
    tags:   ['used-in:sabiscore', 'documented'],
  },
  {
    id:     'lightgbm',
    name:   'LightGBM',
    pillar: 'ML & AI',
    level:  'expert',
    tags:   ['used-in:sabiscore', 'documented'],
  },
  {
    id:     'sklearn',
    name:   'scikit-learn',
    pillar: 'ML & AI',
    level:  'expert',
    tags:   ['used-in:sabiscore', 'documented'],
  },
  {
    id:     'evidently',
    name:   'Evidently AI',
    pillar: 'ML & AI',
    level:  'proficient',
    tags:   ['used-in:sabiscore'],
  },
  {
    id:     'feature-eng',
    name:   'Feature Engineering',
    pillar: 'ML & AI',
    level:  'expert',
    tags:   ['used-in:sabiscore', 'documented'],
  },
  {
    id:     'model-calibration',
    name:   'Model Calibration',
    pillar: 'ML & AI',
    level:  'proficient',
    tags:   ['used-in:sabiscore', 'documented'],
  },

  // ── Backend & APIs ─────────────────────────────────────────────────────────
  {
    id:     'fastapi',
    name:   'FastAPI',
    pillar: 'Backend & APIs',
    level:  'expert',
    tags:   ['used-in:sabiscore', 'used-in:taxbridge', 'used-in:hashablanca', 'documented'],
  },
  {
    id:     'python',
    name:   'Python 3.11+',
    pillar: 'Backend & APIs',
    level:  'expert',
    tags:   ['used-in:sabiscore', 'used-in:ubec'],
  },
  {
    id:     'java17',
    name:   'Java 17+',
    pillar: 'Backend & APIs',
    level:  'proficient',
    tags:   ['used-in:taxbridge', 'used-in:ubec'],
  },
  {
    id:     'springboot',
    name:   'Spring Boot 3',
    pillar: 'Backend & APIs',
    level:  'proficient',
    tags:   ['used-in:taxbridge'],
  },
  {
    id:     'pydantic',
    name:   'Pydantic v2',
    pillar: 'Backend & APIs',
    level:  'expert',
    tags:   ['used-in:taxbridge', 'used-in:ubec'],
  },

  // ── Fintech & Compliance ──────────────────────────────────────────────────
  {
    id:     'postgres-rls',
    name:   'Postgres RLS',
    pillar: 'Fintech & Compliance',
    level:  'expert',
    tags:   ['used-in:taxbridge', 'documented'],
  },
  {
    id:     'event-sourcing',
    name:   'Event Sourcing',
    pillar: 'Fintech & Compliance',
    level:  'proficient',
    tags:   ['used-in:taxbridge'],
  },
  {
    id:     'multitenant',
    name:   'Multi-tenant Design',
    pillar: 'Fintech & Compliance',
    level:  'expert',
    tags:   ['used-in:taxbridge'],
  },
  {
    id:     'gdpr',
    name:   'GDPR Controls',
    pillar: 'Fintech & Compliance',
    level:  'proficient',
    tags:   ['used-in:taxbridge', 'used-in:hashablanca'],
  },
  {
    id:     'kyc-aml',
    name:   'KYC/AML Patterns',
    pillar: 'Fintech & Compliance',
    level:  'foundational',
    tags:   ['used-in:taxbridge'],
  },
  {
    id:     'audit-trail',
    name:   'Audit Trail Design',
    pillar: 'Fintech & Compliance',
    level:  'proficient',
    tags:   ['used-in:taxbridge', 'used-in:ubec'],
  },

  // ── Data & Storage ─────────────────────────────────────────────────────────
  {
    id:     'postgres',
    name:   'PostgreSQL 16',
    pillar: 'Data & Storage',
    level:  'expert',
    tags:   ['used-in:sabiscore', 'used-in:taxbridge', 'used-in:ubec'],
  },
  {
    id:     'redis',
    name:   'Redis 7',
    pillar: 'Data & Storage',
    level:  'expert',
    tags:   ['used-in:sabiscore', 'used-in:taxbridge', 'documented'],
  },
  {
    id:     'bullmq',
    name:   'BullMQ',
    pillar: 'Data & Storage',
    level:  'proficient',
    tags:   ['used-in:taxbridge'],
  },
  {
    id:     'airflow',
    name:   'Apache Airflow',
    pillar: 'Data & Storage',
    level:  'proficient',
    tags:   ['used-in:ubec'],
  },
  {
    id:     'pandas',
    name:   'pandas',
    pillar: 'Data & Storage',
    level:  'expert',
    tags:   ['used-in:ubec', 'used-in:sabiscore'],
  },
  {
    id:     'great-expectations',
    name:   'Great Expectations',
    pillar: 'Data & Storage',
    level:  'proficient',
    tags:   ['used-in:ubec'],
  },

  // ── DevOps & SRE ──────────────────────────────────────────────────────────
  {
    id:     'docker',
    name:   'Docker',
    pillar: 'DevOps & SRE',
    level:  'expert',
    tags:   ['used-in:sabiscore', 'used-in:taxbridge', 'used-in:hashablanca'],
  },
  {
    id:     'github-actions',
    name:   'GitHub Actions',
    pillar: 'DevOps & SRE',
    level:  'proficient',
    tags:   ['used-in:sabiscore'],
  },
  {
    id:     'sentry',
    name:   'Sentry',
    pillar: 'DevOps & SRE',
    level:  'proficient',
    tags:   ['used-in:sabiscore', 'documented'],
  },
  {
    id:     'blue-green',
    name:   'Blue-Green Deployments',
    pillar: 'DevOps & SRE',
    level:  'proficient',
    tags:   ['used-in:sabiscore', 'documented'],
  },
  {
    id:     'prometheus',
    name:   'Prometheus / Grafana',
    pillar: 'DevOps & SRE',
    level:  'proficient',
    tags:   ['used-in:sabiscore', 'documented'],
  },

  // ── Frontend & Full-Stack ─────────────────────────────────────────────────
  {
    id:     'nextjs',
    name:   'Next.js 14',
    pillar: 'Frontend & Full-Stack',
    level:  'proficient',
    tags:   ['used-in:sabiscore'],
  },
  {
    id:     'typescript',
    name:   'TypeScript strict',
    pillar: 'Frontend & Full-Stack',
    level:  'expert',
    tags:   ['used-in:sabiscore', 'documented'],
  },
  {
    id:     'react',
    name:   'React 18',
    pillar: 'Frontend & Full-Stack',
    level:  'proficient',
    tags:   ['used-in:sabiscore', 'used-in:hashablanca'],
  },

  // ── Blockchain & Web3 ─────────────────────────────────────────────────────
  {
    id:     'circom',
    name:   'Circom 2',
    pillar: 'Blockchain & Web3',
    level:  'proficient',
    tags:   ['used-in:hashablanca'],
  },
  {
    id:     'snarkjs',
    name:   'snarkjs (Groth16)',
    pillar: 'Blockchain & Web3',
    level:  'proficient',
    tags:   ['used-in:hashablanca'],
  },
  {
    id:     'solidity',
    name:   'Solidity',
    pillar: 'Blockchain & Web3',
    level:  'foundational',
    tags:   ['used-in:hashablanca'],
  },
  {
    id:     'web3py',
    name:   'Web3.py',
    pillar: 'Blockchain & Web3',
    level:  'proficient',
    tags:   ['used-in:hashablanca'],
  },
]

// ─── Accessors ────────────────────────────────────────────────────────────────

export const ALL_PILLARS: SkillPillar[] = [
  'ML & AI',
  'Backend & APIs',
  'Fintech & Compliance',
  'Data & Storage',
  'DevOps & SRE',
  'Frontend & Full-Stack',
  'Blockchain & Web3',
]

export function getSkillsByPillar(pillar: SkillPillar): SkillNode[] {
  return SKILLS.filter(s => s.pillar === pillar)
}

export function getSkillsBySystem(systemId: string): SkillNode[] {
  return SKILLS.filter(s =>
    s.tags.some(t => t === `used-in:${systemId}`)
  )
}
