/**
 * lib/data/projects.ts
 *
 * VERIFIED SOURCE OF TRUTH for all four core portfolio systems.
 *
 * Metric verification log (checked against live blog articles 2026-03-23):
 *   - SabiScore accuracy:    71%   ← ensemble-models-production article, results table
 *   - Brier score (ensemble): 0.15  ← ensemble-models-production article, results table
 *   - Brier score (baseline): 0.19  ← ensemble-models-production article, results table
 *   - Cache hit rate:         73%   ← ensemble-models-production article, inline text
 *   - Inference latency:      87ms  ← fastapi-ml-engineers article, inline text
 *   - Meta-learner:  LogisticRegression(C=0.1) — NOT a neural net (article confirmed)
 *   - Previous files incorrectly stated 0.21 Brier and 94% cache hit — both corrected.
 *
 * Hard constraint checks (all passing):
 *   ✓ No "100% anything"
 *   ✓ No bare numbers without badges
 *   ✓ No "years of experience"
 *   ✓ No MetricBadge.value used as a qualitative noun
 *   ✓ No imports from component files (inversion eliminated)
 */

import { blogUrl }          from '@/lib/config'
import type {
  ProjectData,
  SystemMetric,
  ArcStage,
  DecisionRecord,
  ComplianceTag,
  BlogArticleRef,
  SystemId,
} from '@/lib/types'

// ─── SabiScore ───────────────────────────────────────────────────────────────

const sabiScoreMetrics: SystemMetric[] = [
  {
    value:       '71%',
    label:       'prediction accuracy',
    badge:       'documented',
    sourceLabel: 'ensemble-models-production',
    sourceHref:  blogUrl('ensemble-models-production'),
    sublabel:    'backtested across 3 seasons; baseline was 64%',
  },
  {
    value:       '0.15',
    label:       'Brier score',
    badge:       'documented',
    sourceLabel: 'ensemble-models-production',
    sourceHref:  blogUrl('ensemble-models-production'),
    sublabel:    'lower is better; random baseline = 0.25, single model = 0.19',
  },
  {
    value:       '87ms',
    label:       'median inference',
    badge:       'documented',
    sourceLabel: 'fastapi-ml-engineers',
    sourceHref:  blogUrl('fastapi-ml-engineers'),
    sublabel:    'Redis-cached; p99 < 200ms',
  },
  {
    value:       '73%',
    label:       'cache hit rate',
    badge:       'documented',
    sourceLabel: 'ensemble-models-production',
    sourceHref:  blogUrl('ensemble-models-production'),
    sublabel:    'TTL keyed on match_id + model_version',
  },
  {
    value:       'reviewed',
    label:       'historical evaluation',
    badge:       'backtested',
    sourceLabel: 'backtest review',
    sublabel:    'historical analysis only',
  },
  {
    value:       '350+',
    label:       'registered users',
    badge:       'snapshot',
    sourceLabel: 'snapshot: Dec 2024',
    sublabel:    'monthly active on SabiScore platform',
  },
]

const sabiScoreArc: ArcStage[] = [
  {
    id:          '1',
    label:       'Feature Store',
    description: 'Historical match stats, 5-game form ratings, H2H records, and market odds pulled on schedule.',
    tech:        'PostgreSQL + Redis',
  },
  {
    id:          '2',
    label:       'Base Models',
    description: 'XGBoost and LightGBM trained independently with time-based splits — no random shuffle on temporal data.',
    tech:        'scikit-learn pipeline',
  },
  {
    id:          '3',
    label:       'OOF Predictions',
    description: 'Out-of-fold predictions generated via 5-fold CV on training set. Prevents leakage to meta-learner.',
    tech:        'KFold(shuffle=False)',
  },
  {
    id:          '4',
    label:       'Meta-Learner',
    description: 'Regularised LogisticRegression(C=0.1) stacked on OOF predictions. Simple and calibrated by design.',
    tech:        'sklearn LogisticRegression',
  },
  {
    id:          '5',
    label:       'Inference Cache',
    description: '73% cache hit rate in production. TTL keyed on match_id + model_version; invalidated on retrain.',
    tech:        'Redis 7',
  },
  {
    id:          '6',
    label:       'API + Explainability',
    description: 'FastAPI async endpoint at 87ms median. Feature importance snippets returned with every prediction.',
    tech:        'FastAPI + uvicorn',
  },
  {
    id:          '7',
    label:       'Drift Monitor',
    description: 'Brier score and PSI tracked per match-week. Alert fires if Brier degrades beyond 0.03 from baseline.',
    tech:        'Evidently AI',
  },
]

const sabiScoreDecisions: DecisionRecord[] = [
  {
    decision: 'Meta-learner architecture',
    rejected: 'Neural meta-learner (MLP)',
    chosen:   'Regularised LogisticRegression(C=0.1)',
    reason:
      'An MLP meta-learner introduced overfitting on the OOF feature space of only 2 base model outputs. LogisticRegression with L2 regularisation is robust to this low-dimensional input and produces well-calibrated probabilities without Platt scaling.',
  },
  {
    decision: 'Cache key strategy',
    rejected: 'In-process LRU cache keyed on match_id only',
    chosen:   'Redis TTL keyed on match_id + model_version hash',
    reason:
      'A process restart would evict the LRU cache entirely. Keying on model_version enables precise invalidation on retrain without flushing predictions for unchanged matches.',
  },
  {
    decision: 'Train/test split',
    rejected: 'Random shuffle + stratified split',
    chosen:   'Time-based split (80th percentile date as boundary)',
    reason:
      'Random shuffling allows future match statistics to leak into training data for any row before the split boundary. Sports outcomes are non-stationary; the model must generalise forward in time, not across a random partition.',
  },
]

const sabiScoreBlog: BlogArticleRef = {
  slug:              'ensemble-models-production',
  title:             'Ensemble Models in Production: How We Achieved 71% Accuracy',
  tier:              1,
  system_tag:        'sabiscore',
  key_metric:        '64% → 71% accuracy',
  metric_badge:      'documented',
  read_time_minutes: 11,
  published_at:      '2024-11-25',
  excerpt:
    'The exact stacking pipeline that took SabiScore from 64% to 71% — including OOF leakage prevention, why we chose LogisticRegression over a neural meta-learner, and the Brier score comparison that proved the ensemble was actually better calibrated.',
}

// ─── TaxBridge ───────────────────────────────────────────────────────────────

const taxBridgeMetrics: SystemMetric[] = [
  {
    value:       'DB-layer',
    label:       'tenant isolation enforcement',
    badge:       'documented',
    sourceLabel: 'Postgres RLS policy audit',
    sublabel:    'enforced at Postgres, not ORM — cannot be bypassed by missing WHERE clause',
  },
  {
    value:       'append-only',
    label:       'audit event log',
    badge:       'documented',
    sourceLabel: 'event sourcing schema',
    sublabel:    'no UPDATE or DELETE permitted by DB policy rule',
  },
  {
    value:       '< 3s',
    label:       'OCR → structured data',
    badge:       'snapshot',
    sourceLabel: 'snapshot: internal benchmark',
    sublabel:    'standard A4 tax filing at 300 DPI',
  },
  {
    value:       'Java 17',
    label:       'compute engine runtime',
    badge:       'documented',
    sourceLabel: 'system architecture',
    sublabel:    'Spring Boot 3 — compile-time rule validation',
  },
]

const taxBridgeArc: ArcStage[] = [
  {
    id:          '1',
    label:       'OCR Ingestion',
    description: 'Tesseract 5 on rasterised PDF pages. Pre-classification rejects handwritten fields (confidence < 0.65) to manual review queue.',
    tech:        'Tesseract 5 + pdf2image',
  },
  {
    id:          '2',
    label:       'Structured Parse',
    description: 'Pydantic v2 strict schema validation. Missing required fields write to job audit log before failing — never silently dropped.',
    tech:        'Pydantic v2',
  },
  {
    id:          '3',
    label:       'Async Job Queue',
    description: 'BullMQ with exponential backoff (3 retries). removeOnFail set to prevent storage exhaustion under parse-failure spikes.',
    tech:        'BullMQ + Redis',
  },
  {
    id:          '4',
    label:       'Compute Engine',
    description: 'Jurisdiction-specific tax rules in Java 17 / Spring Boot 3. Compile-time validation — a null deduction field fails the build, not the runtime.',
    tech:        'Java 17 + Spring Boot 3',
  },
  {
    id:          '5',
    label:       'Audit Chain',
    description: 'Every state change appended to audit_events before response is returned. Postgres RULE prevents UPDATE or DELETE on this table.',
    tech:        'PostgreSQL event log',
  },
  {
    id:          '6',
    label:       'RLS Enforcement',
    description: 'Row-Level Security policy reads tenant_id from JWT via current_setting(). No WHERE clause in application code required — or trusted.',
    tech:        'Postgres RLS + JWT',
  },
]

const taxBridgeDecisions: DecisionRecord[] = [
  {
    decision: 'Compute engine language',
    rejected: 'Python (same stack as OCR layer)',
    chosen:   'Java 17 + Spring Boot 3',
    reason:
      'Jurisdiction rule engine requires compile-time type enforcement. A null deduction field in Python raises a runtime AttributeError in production; in Java it fails the build. Spring Validation catches constraint violations before the computation layer is reached.',
  },
  {
    decision: 'Audit strategy',
    rejected: 'Application-level structured logging',
    chosen:   'Database-level append-only event table with RULE enforcement',
    reason:
      'Application logs are mutable — a misconfigured rotation policy or a log management incident can destroy them. A Postgres append-only table enforced by a RULE cannot be cleared without leaving a forensic trace at the DB level.',
  },
  {
    decision: 'BullMQ retry configuration',
    rejected: 'Default retry with no removeOnFail limit',
    chosen:   'Exponential backoff (3 attempts) + removeOnFail: { count: 100 }',
    reason:
      'Under a batch OCR parse failure, unbounded retries fill the Redis-backed queue within seconds. removeOnFail caps the dead-letter queue and prevents a downstream memory exhaustion cascade.',
  },
]

const taxBridgeCompliance: ComplianceTag[] = [
  'GDPR',
  'Audit Trail',
  'Multi-tenant RLS',
  'KYC/AML',
]

// ─── Hashablanca ─────────────────────────────────────────────────────────────

const hashablancaMetrics: SystemMetric[] = [
  {
    value:       'Groth16',
    label:       'ZK proof scheme',
    badge:       'documented',
    sourceLabel: 'Circom circuit implementation',
    sublabel:    'snarkjs + Circom — proof generated off-chain, verified on-chain',
  },
  {
    value:       'Sepolia',
    label:       'verifier contract network',
    badge:       'documented',
    sourceLabel: 'Sepolia Etherscan',
    sublabel:    'ZK verifier contract deployed and verified',
  },
  {
    value:       '4',
    label:       'supported chains',
    badge:       'documented',
    sourceLabel: 'project documentation',
    sublabel:    'Ethereum · Polygon · BSC · StarkNet',
  },
  {
    value:       '4 GB+',
    label:       'streaming file capacity',
    badge:       'documented',
    sourceLabel: 'integration test suite',
    sublabel:    'CBOR chunked streaming — no full-load memory requirement',
  },
]

const hashablancaArc: ArcStage[] = [
  {
    id:          '1',
    label:       'Eligibility Request',
    description: 'User requests a proof of balance eligibility. No balance value is transmitted — only the intent to prove.',
    tech:        'FastAPI endpoint',
  },
  {
    id:          '2',
    label:       'Circuit Witness',
    description: 'Circom circuit generates a witness from private inputs (balance) and public inputs (threshold). Private inputs never leave the client.',
    tech:        'Circom 2 + snarkjs',
  },
  {
    id:          '3',
    label:       'Groth16 Proof',
    description: 'Off-chain Groth16 proof generated. Proof size is constant regardless of circuit complexity — important for on-chain gas costs.',
    tech:        'snarkjs groth16.prove()',
  },
  {
    id:          '4',
    label:       'On-Chain Verification',
    description: 'Solidity verifier contract on Sepolia checks proof validity. Token transfer executes only on a verified proof.',
    tech:        'Solidity + ethers.js',
  },
  {
    id:          '5',
    label:       'CBOR Distribution',
    description: 'Distribution lists up to 4 GB streamed via CBOR chunked reads. No full-file load in memory at any point in the pipeline.',
    tech:        'CBOR + chunked stream',
  },
]

const hashablancaDecisions: DecisionRecord[] = [
  {
    decision: 'Privacy mechanism',
    rejected: 'Merkle tree membership proof',
    chosen:   'Groth16 ZK-SNARK via Circom',
    reason:
      'A Merkle proof reveals the tree root and can leak timing information about which branch was traversed. A Groth16 ZK-SNARK proves eligibility with zero knowledge of the underlying balance value — the verifier learns only that the prover knows a value satisfying the circuit constraints.',
  },
  {
    decision: 'Distribution file format',
    rejected: 'JSON with full in-memory parse',
    chosen:   'CBOR chunked streaming',
    reason:
      'Distribution lists can exceed 4 GB. A full JSON parse requires loading the entire file into memory before any processing can begin. CBOR chunked streaming processes records as they arrive, with a constant memory footprint regardless of file size.',
  },
]

const hashablancaCompliance: ComplianceTag[] = [
  'ZK Privacy',
  'Sepolia Verified',
  'GDPR',
  'CBOR',
]

// ─── UBEC Pipeline ───────────────────────────────────────────────────────────

const ubecMetrics: SystemMetric[] = [
  {
    value:       '36',
    label:       'state data sources ingested',
    badge:       'documented',
    sourceLabel: 'project documentation',
    sublabel:    'all Nigerian states · heterogeneous formats (CSV, Excel, XML)',
  },
  {
    value:       '< 2%',
    label:       'deduplication false-positive rate',
    badge:       'snapshot',
    sourceLabel: 'snapshot: internal validation run',
    sublabel:    'blocking + probabilistic record linkage; exact match would miss ~15–20%',
  },
  {
    value:       'Airflow',
    label:       'orchestration runtime',
    badge:       'documented',
    sourceLabel: 'system architecture',
    sublabel:    'DAG with per-state retry semantics for partial submissions',
  },
]

const ubecArc: ArcStage[] = [
  {
    id:          '1',
    label:       'Multi-State Ingest',
    description: '36 state files in heterogeneous formats (CSV, Excel, XML). Airflow DAG handles partial submissions — missing states do not block other states.',
    tech:        'Apache Airflow',
  },
  {
    id:          '2',
    label:       'Schema Normaliser',
    description: 'Ministry-specific column names mapped to canonical schema. Example: "School Name" vs "SCHOOL_NM" vs "schname" → normalised to school_name.',
    tech:        'pandas + Pydantic v2',
  },
  {
    id:          '3',
    label:       'Deduplication',
    description: 'Blocking on school_id + LGA + year, then probabilistic similarity scoring for fuzzy school name matches. Exact-match alone misses 15–20% of true duplicates.',
    tech:        'dedupe.io + PostgreSQL',
  },
  {
    id:          '4',
    label:       'Validation Gate',
    description: 'Cross-state consistency checks via Great Expectations. A state failing validation is flagged for review — not silently accepted.',
    tech:        'Great Expectations',
  },
  {
    id:          '5',
    label:       'Ministry Reports',
    description: 'Aggregated outputs per ministry with a full audit trace linking each output row to its source state file and ingestion run.',
    tech:        'PostgreSQL + Jinja templates',
  },
]

const ubecDecisions: DecisionRecord[] = [
  {
    decision: 'Deduplication strategy',
    rejected: 'Exact-match on school_name',
    chosen:   'Blocking + probabilistic record linkage (dedupe.io)',
    reason:
      'State submissions use inconsistent school name spellings across ministries. Exact match misses 15–20% of true duplicates in validation runs. Probabilistic linkage with a blocking pass on school_id + LGA + year reduces the comparison space from O(n²) to a tractable candidate set.',
  },
  {
    decision: 'Partial submission handling',
    rejected: 'Block pipeline until all 36 states submit',
    chosen:   'Per-state DAG tasks with independent retry and partial-output flag',
    reason:
      'Waiting for all 36 states creates a single-state bottleneck — one late submission holds all ministry reporting. Per-state tasks allow 35 states to complete reporting while the 36th is flagged for follow-up.',
  },
]

const ubecCompliance: ComplianceTag[] = ['Audit Trail', 'GDPR']

// ─── Assembled project list ──────────────────────────────────────────────────

export const PROJECTS: ProjectData[] = [
  {
    id: 'sabiscore',
    name: 'SabiScore',
    tagline: 'Ensemble ML sports prediction with production-oriented inference delivery',
    featured: true,
    description:
      'ML platform with stacked XGBoost and LightGBM models, Redis-backed inference delivery, and drift monitoring against a single-model baseline.',
    stack: [
      'FastAPI',
      'XGBoost',
      'LightGBM',
      'scikit-learn',
      'Redis',
      'PostgreSQL',
      'Next.js',
      'Docker',
    ],
    metrics: sabiScoreMetrics,
    arc: sabiScoreArc,
    decisions: sabiScoreDecisions,
    compliance: [],
    blog: sabiScoreBlog,
    demoUrl: 'https://sabiscore.vercel.app',
    repoUrl: 'https://github.com/scardubu/sabiscore',
  },
  {
    id: 'taxbridge',
    name: 'TaxBridge',
    tagline: 'OCR → tax computation → append-only audit chain — Postgres RLS enforced',
    featured: true,
    description:
      'Multi-tenant tax computation platform. OCR extracts structured data from scanned filings; Java 17 / Spring Boot 3 applies jurisdiction-specific rules with compile-time type safety; every mutation is appended to an immutable audit_events table before the response is returned. Row-Level Security enforces tenant isolation at the database layer — not the ORM layer.',
    stack: [
      'FastAPI',
      'PostgreSQL',
      'BullMQ',
      'Tesseract OCR',
      'Redis',
      'Java 17',
      'Spring Boot 3',
      'Docker',
    ],
    metrics: taxBridgeMetrics,
    arc: taxBridgeArc,
    decisions: taxBridgeDecisions,
    compliance: taxBridgeCompliance,
    blog: undefined, // BLOG GAP — article in progress: taxbridge-ocr-tax-pipeline-postgres-rls
    contextNote: 'Internal engagement — source code available on request',
  },
  {
    id: 'hashablanca',
    name: 'Hashablanca',
    tagline: 'ZK proof verification on Sepolia — privacy-preserving token distribution',
    featured: false,
    description:
      'Distributed ledger for multi-chain token distribution. Groth16 ZK-SNARKs verify account balance eligibility without disclosing the balance. Verifier contract deployed on Sepolia. CBOR streaming handles 4 GB+ distribution lists without full-file memory loading.',
    stack: [
      'FastAPI',
      'Circom 2',
      'snarkjs',
      'Solidity',
      'Web3.py',
      'PostgreSQL',
      'React',
      'Docker',
    ],
    metrics: hashablancaMetrics,
    arc: hashablancaArc,
    decisions: hashablancaDecisions,
    compliance: hashablancaCompliance,
    blog: undefined,
    contextNote: 'Testnet deployment — Sepolia contract verifiable on Etherscan',
  },
  {
    id: 'ubec',
    name: 'UBEC Data Pipeline',
    tagline: 'Federal-scale education data — 36 Nigerian states, probabilistic deduplication',
    featured: false,
    description:
      'Batch ingestion pipeline for the Universal Basic Education Commission. Processes multi-ministry reporting data from 36 states with heterogeneous column schemas, probabilistic deduplication, and per-state retry semantics. Partial submissions do not block complete states from reporting.',
    stack: [
      'Python 3.11',
      'Apache Airflow',
      'pandas',
      'PostgreSQL',
      'Great Expectations',
      'Docker',
    ],
    metrics: ubecMetrics,
    arc: ubecArc,
    decisions: ubecDecisions,
    compliance: ubecCompliance,
    blog: undefined,
    contextNote: 'Government engagement — not open source',
  },
];

// ─── Accessors ────────────────────────────────────────────────────────────────

export function getProject(id: SystemId): ProjectData | undefined {
  return PROJECTS.find(p => p.id === id)
}

export function getFeaturedProjects(): ProjectData[] {
  return PROJECTS.filter(p => p.featured)
}
