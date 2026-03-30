/**
 * lib/data.ts — Portfolio Single Source of Truth
 * Oscar Ndugbu | scardubu.dev
 *
 * Rule: All content lives here. Zero hardcoded strings in components.
 * Update once → propagates everywhere.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export type MetricVariant = "live" | "documented" | "backtested" | "snapshot";

export interface HeroMetric {
  value: string;
  label: string;
  sublabel?: string;
}

export interface ProjectMetric {
  value: string;
  label: string;
  sublabel?: string;
  variant: MetricVariant;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  tags: string[];
  accent: "cyan" | "violet" | "teal";
  featured: boolean;
  metrics: ProjectMetric[];
  links: {
    live?: string;
    demo?: string;
    repo?: string;
    caseStudy?: string;
  };
  githubStats?: {
    stars: number;
    forks: number;
    language: string;
    lastCommit: string;
  };
  status: "live" | "in-progress" | "archived";
}

export interface Skill {
  id: string;
  name: string;
  category: "ml" | "backend" | "frontend" | "devops" | "blockchain";
  level: number; // 1–5
  icon: string;
  description: string;
  usedIn?: string[]; // project IDs
}

export interface ProductionPattern {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  codeSnippet: string;
  language: string;
  tradeoffs: { pro: string; con: string }[];
  tags: string[];
  accent: "cyan" | "violet" | "teal";
}

export interface ActivityItem {
  id: string;
  type: "commit" | "deploy" | "pr" | "release" | "review";
  project: string;
  message: string;
  timestamp: string; // relative e.g. "2h ago"
  branch?: string;
  accent: "cyan" | "violet" | "teal" | "warn";
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  avatarInitials: string;
  avatarBg: string;
  rating: number;
  projectRef?: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  year: string;
  url: string;
  description: string;
}

// ─── Hero ────────────────────────────────────────────────────────────────────

export const HERO_HEADLINE_WORDS = ["Production", "ML", "Engineer."];
export const HERO_SUBHEADLINE =
  "Architecting production AI systems that distill frontier intelligence into elegant, trusted tools people rely on every single day.";

export const HERO_ROLE_TAGS = [
  "Full-Stack ML Engineer",
  "MLOps Architect",
  "Systems Thinker",
  "Lagos → World",
];

export const HERO_CTA_PRIMARY = { label: "Let's Talk", href: "#contact" };
export const HERO_CTA_SECONDARY = {
  label: "Download CV",
  href: "/cv/oscar-ndugbu-cv.pdf",
};
export const HERO_CTA_TERTIARY = { label: "View Work", href: "#projects" };

export const HERO_AVAILABILITY =
  "Open to Senior ML / Full-Stack Roles & Consulting";

export const HERO_METRICS: HeroMetric[] = [
  { value: "Worldwide", label: "Global Impact", sublabel: "From Nigeria to audiences everywhere" },
  {
    value: "Signal-Led",
    label: "AI Precision",
    sublabel: "Research-grade intelligence in production",
  },
  {
    value: "Always-On",
    label: "Unwavering Reliability",
    sublabel: "Operational calm under pressure",
  },
  { value: "Elastic", label: "Built for Scale", sublabel: "Architecture that holds as the surface grows" },
];

// ─── Projects ────────────────────────────────────────────────────────────────

export const PROJECTS: Project[] = [
  {
    id: 'sabiscore',
    title: 'SabiScore',
    subtitle: 'AI Sports Prediction Platform',
    description:
      'Production ML platform with ensemble gradient-boosted models, monitored inference delivery, and a legible decision-support surface.',
    longDescription:
      'End-to-end ML system: data ingestion pipelines from 3 sports APIs, feature engineering for 140+ match features, ensemble model training with Optuna hyperparameter tuning, real-time inference API at sub-87ms latency, and a Next.js dashboard for user-facing predictions. Auto-retraining CI/CD kicks off weekly.',
    tags: ['Next.js', 'FastAPI', 'XGBoost', 'PostgreSQL', 'Redis', 'Docker'],
    accent: 'cyan',
    featured: true,
    status: 'live',
    metrics: [
      {
        value: '71%',
        label: 'Prediction Accuracy',
        sublabel: 'Avg. across backtests',
        variant: 'backtested',
      },
      {
        value: '76.5%',
        label: 'High-Confidence Rate',
        sublabel: 'Predictions >70% confidence',
        variant: 'live',
      },
      {
        value: 'Backtested',
        label: 'Model Review',
        sublabel: 'Historical evaluation only',
        variant: 'backtested',
      },
      {
        value: 'Live',
        label: 'Production Status',
        sublabel: 'Public-facing delivery',
        variant: 'live',
      },
      {
        value: '99.9%',
        label: 'System Uptime',
        sublabel: 'HA cluster',
        variant: 'live',
      },
      {
        value: '87ms',
        label: 'API Latency',
        sublabel: 'Avg. prediction response',
        variant: 'live',
      },
    ],
    links: {
      live: 'https://sabiscore.vercel.app',
      repo: 'https://github.com/scardubu/sabiscore',
      caseStudy: '#',
    },
    githubStats: {
      stars: 12,
      forks: 3,
      language: 'TypeScript',
      lastCommit: '2024-11-15',
    },
  },
  {
    id: 'hashablanca',
    title: 'Hashablanca',
    subtitle: 'Blockchain Token Distribution',
    description:
      'Multi-chain token distribution with ZK proofs for privacy-preserving transactions. Runs across Ethereum, Polygon, BSC, and StarkNet.',
    longDescription:
      'Built a CBOR-streaming pipeline that handles 4GB+ datasets without memory explosion. ZK circuits in Circom provide transaction privacy; GDPR compliance layer auto-detects and anonymizes PII. Test suite at 90%+ coverage with unit + integration tests across all four chains.',
    tags: ['FastAPI', 'React', 'Web3.py', 'Circom', 'PostgreSQL', 'Docker'],
    accent: 'violet',
    featured: true,
    status: 'live',
    metrics: [
      {
        value: '4',
        label: 'Networks',
        sublabel: 'ETH · Polygon · BSC · StarkNet',
        variant: 'live',
      },
      {
        value: '4GB+',
        label: 'File Processing',
        sublabel: 'CBOR streaming pipeline',
        variant: 'documented',
      },
      {
        value: '90%+',
        label: 'Test Coverage',
        sublabel: 'Unit + integration',
        variant: 'documented',
      },
      {
        value: 'ZK',
        label: 'Privacy Layer',
        sublabel: 'Zero-knowledge proofs',
        variant: 'live',
      },
    ],
    links: {
      caseStudy: '#',
    },
  },
  {
    id: 'ai-consulting',
    title: 'AI Consulting & LLM Integration',
    subtitle: 'Production ML Debugging & Integration',
    description:
      'Fractional ML engineering for startups — cutting debugging time by 60% and translating model outputs into stakeholder-ready reports via LLM pipelines.',
    longDescription:
      'Embedded with 5+ client teams as fractional ML lead. Core deliverables: model audit frameworks, LLM-powered explanation pipelines (Ollama + GPT-4 + LangChain), and internal tooling that converts raw model outputs into business-readable summaries. Repeat engagement rate: 100%.',
    tags: ['Ollama', 'GPT-4', 'LangChain', 'Python', 'FastAPI'],
    accent: 'teal',
    featured: false,
    status: 'live',
    metrics: [
      {
        value: '60%',
        label: 'Time Saved',
        sublabel: '10hr → 4hr debug cycles',
        variant: 'documented',
      },
      {
        value: '5+',
        label: 'Clients Served',
        sublabel: 'Startups & enterprises',
        variant: 'live',
      },
      {
        value: '100%',
        label: 'LLM Coverage',
        sublabel: 'Technical → business',
        variant: 'documented',
      },
    ],
    links: {
      caseStudy: '#',
    },
  },
  {
    id: 'taxbridge',
    title: 'TaxBridge',
    subtitle: 'Nigerian SME Tax Compliance Automation',
    description:
      'Full-stack SaaS automating VAT, WHT, PIT, CIT, and CGT compliance for Nigerian SMEs. Offline-first mobile app with NTA 2025 integration.',
    longDescription:
      'End-to-end tax compliance platform built on Turborepo monorepo: Fastify 5 API, React Native Expo SDK 54, Next.js 15 admin dashboard. Integrates with DigiTax/APP for IRN generation, Paystack/Flutterwave for payments, Youverify for KYC, and ML Kit OCR for receipt scanning. 5-zone DashboardZone mobile layout with Lagos Pidgin i18n.',
    tags: ['Next.js 15', 'React Native', 'Fastify 5', 'Prisma', 'PostgreSQL', 'BullMQ'],
    accent: 'teal',
    featured: true,
    status: 'in-progress',
    metrics: [
      {
        value: '5',
        label: 'Tax Types',
        sublabel: 'VAT·WHT·PIT·CIT·CGT',
        variant: 'documented',
      },
      {
        value: 'NTA 2025',
        label: 'Compliance',
        sublabel: 'Nigerian Tax Authority',
        variant: 'documented',
      },
      {
        value: 'Offline',
        label: 'Architecture',
        sublabel: 'SQLite sync queue',
        variant: 'documented',
      },
    ],
    links: {
      repo: 'https://github.com/Scardubu/taxbridge',
      caseStudy: '#',
    },
  },
];

// ─── Skills ──────────────────────────────────────────────────────────────────

export const SKILLS: Skill[] = [
  // ML & AI
  {
    id: "xgboost",
    name: "XGBoost",
    category: "ml",
    level: 5,
    icon: "🎯",
    description: "Ensemble gradient boosting. Core of SabiScore prediction engine.",
    usedIn: ["sabiscore"],
  },
  {
    id: "pytorch",
    name: "PyTorch",
    category: "ml",
    level: 4,
    icon: "🔥",
    description: "Neural network training and fine-tuning for tabular + NLP.",
  },
  {
    id: "scikit",
    name: "Scikit-learn",
    category: "ml",
    level: 5,
    icon: "🧪",
    description: "Feature engineering, pipelines, model evaluation.",
    usedIn: ["sabiscore", "ai-consulting"],
  },
  {
    id: "langchain",
    name: "LangChain",
    category: "ml",
    level: 4,
    icon: "🔗",
    description: "LLM orchestration, RAG pipelines, agent workflows.",
    usedIn: ["ai-consulting"],
  },
  {
    id: "mlflow",
    name: "MLflow",
    category: "ml",
    level: 4,
    icon: "📊",
    description: "Experiment tracking, model registry, deployment.",
  },
  // Backend
  {
    id: "fastapi",
    name: "FastAPI",
    category: "backend",
    level: 5,
    icon: "⚡",
    description: "Primary API framework. Sub-87ms ML inference endpoints.",
    usedIn: ["sabiscore", "hashablanca"],
  },
  {
    id: "fastify",
    name: "Fastify 5",
    category: "backend",
    level: 5,
    icon: "🚀",
    description: "Node.js server for TaxBridge. Schema validation + plugins.",
    usedIn: ["taxbridge"],
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    category: "backend",
    level: 5,
    icon: "🐘",
    description: "Primary datastore. Advanced indexing for ML feature tables.",
    usedIn: ["sabiscore", "hashablanca", "taxbridge"],
  },
  {
    id: "redis",
    name: "Redis",
    category: "backend",
    level: 4,
    icon: "🔴",
    description: "Prediction caching, session management, pub/sub.",
    usedIn: ["sabiscore", "taxbridge"],
  },
  {
    id: "python",
    name: "Python",
    category: "backend",
    level: 5,
    icon: "🐍",
    description: "Primary ML language. NumPy, Pandas, asyncio.",
  },
  // Frontend
  {
    id: "nextjs",
    name: "Next.js 15",
    category: "frontend",
    level: 5,
    icon: "▲",
    description: "App Router, RSC, streaming. Production-grade dashboards.",
    usedIn: ["sabiscore", "taxbridge"],
  },
  {
    id: "react-native",
    name: "React Native",
    category: "frontend",
    level: 4,
    icon: "📱",
    description: "Expo SDK 54 offline-first mobile app for TaxBridge.",
    usedIn: ["taxbridge"],
  },
  {
    id: "typescript",
    name: "TypeScript",
    category: "frontend",
    level: 5,
    icon: "🔷",
    description: "Strict mode across all JS/TS projects.",
  },
  // DevOps
  {
    id: "docker",
    name: "Docker",
    category: "devops",
    level: 4,
    icon: "🐳",
    description: "Multi-stage builds, compose stacks, production images.",
    usedIn: ["sabiscore", "hashablanca"],
  },
  {
    id: "github-actions",
    name: "GitHub Actions",
    category: "devops",
    level: 4,
    icon: "⚙️",
    description: "CI/CD pipelines: test → lint → deploy → smoke.",
  },
  {
    id: "prisma",
    name: "Prisma 5",
    category: "devops",
    level: 5,
    icon: "💎",
    description: "Type-safe ORM. Migration management for prod schemas.",
    usedIn: ["taxbridge"],
  },
  // Blockchain
  {
    id: "web3py",
    name: "Web3.py",
    category: "blockchain",
    level: 4,
    icon: "🔗",
    description: "Multi-chain interaction layer for Hashablanca.",
    usedIn: ["hashablanca"],
  },
  {
    id: "circom",
    name: "Circom / ZK",
    category: "blockchain",
    level: 3,
    icon: "🔐",
    description: "Zero-knowledge proof circuits for private transactions.",
    usedIn: ["hashablanca"],
  },
];

// ─── Production Patterns ─────────────────────────────────────────────────────

export const PRODUCTION_PATTERNS: ProductionPattern[] = [
  {
    id: "ensemble-inference",
    title: "Low-Latency Ensemble Inference",
    subtitle: "XGBoost + LightGBM at 87ms P99",
    description:
      "Parallel model execution with Redis prediction cache. Stale-while-revalidate keeps latency under 100ms even during retraining windows.",
    codeSnippet: `async def predict_match(match_id: str) -> PredictionResult:
    cache_key = f"pred:{match_id}:{model_version}"

    # Stale-while-revalidate: serve cached, refresh async
    if cached := await redis.get(cache_key):
        asyncio.create_task(refresh_if_stale(match_id))
        return PredictionResult.parse_raw(cached)

    # Parallel ensemble execution
    xgb_fut = executor.submit(xgb_model.predict, features)
    lgb_fut = executor.submit(lgb_model.predict, features)
    xgb_prob, lgb_prob = await asyncio.gather(
        loop.run_in_executor(None, xgb_fut.result),
        loop.run_in_executor(None, lgb_fut.result),
    )

    # Weighted ensemble: XGB=0.6, LGB=0.4
    final_prob = 0.6 * xgb_prob + 0.4 * lgb_prob
    result = PredictionResult(probability=final_prob, model_version=model_version)

    await redis.setex(cache_key, 300, result.json())
    return result`,
    language: "python",
    tradeoffs: [
      { pro: "P99 < 100ms with cache hit rate > 85%", con: "Stale data window during retraining (~5min)" },
      { pro: "Parallel execution halves cold-path latency", con: "ThreadPoolExecutor adds ~8MB RSS per worker" },
    ],
    tags: ["ML Inference", "Caching", "Async", "Performance"],
    accent: "cyan",
  },
  {
    id: "zk-cbor-stream",
    title: "ZK Proof + CBOR Streaming",
    subtitle: "Processing 4GB+ datasets without OOM",
    description:
      "Chunked CBOR deserialization with a backpressure-aware generator keeps memory flat at ~120MB regardless of input size. ZK witness generation runs per-chunk.",
    codeSnippet: `def stream_cbor_chunks(
    file_path: Path,
    chunk_size: int = 10_000,
) -> Generator[list[dict], None, None]:
    """Memory-flat CBOR streaming — 4GB+ without OOM."""
    decoder = CBORDecoder(file_path.open("rb"))
    chunk: list[dict] = []

    for item in decoder:
        chunk.append(item)
        if len(chunk) >= chunk_size:
            yield chunk
            chunk = []
            gc.collect()  # explicit collection between chunks

    if chunk:
        yield chunk

async def process_distribution(file_path: Path) -> DistributionResult:
    results = []
    async for chunk in async_generator(stream_cbor_chunks(file_path)):
        # Generate ZK witness per chunk — O(1) memory
        witness = await zk_circuit.generate_witness(chunk)
        proof = await groth16_prove(witness)
        results.append(await submit_onchain(proof, chunk))
    return DistributionResult.aggregate(results)`,
    language: "python",
    tradeoffs: [
      { pro: "Constant ~120MB memory regardless of file size", con: "Sequential chunk processing — no random access" },
      { pro: "ZK proofs generated per-chunk, parallelisable", con: "gc.collect() adds ~2ms overhead per chunk" },
    ],
    tags: ["Blockchain", "Memory", "ZK Proofs", "Streaming"],
    accent: "violet",
  },
  {
    id: "bullmq-tax-sync",
    title: "Offline-First Tax Sync Queue",
    subtitle: "BullMQ + SQLite — zero data loss on disconnect",
    description:
      "All tax submissions land in a local SQLite queue first. BullMQ workers replay them against the NTA API when connectivity returns, with idempotency keys preventing duplicate filings.",
    codeSnippet: `// TaxBridge offline-first submission queue
export async function enqueueTaxSubmission(
  payload: TaxSubmissionPayload,
): Promise<QueueResult> {
  const idempotencyKey = await generateIRN(payload);

  // 1. Write to local SQLite first — survives offline
  await db.taxQueue.create({
    data: {
      ...payload,
      idempotencyKey,
      status: "PENDING",
      retryCount: 0,
    },
  });

  // 2. Attempt immediate NTA DigiTax submission
  try {
    const result = await ntaClient.submitVAT(payload, idempotencyKey);
    await db.taxQueue.update({
      where: { idempotencyKey },
      data: { status: "SUBMITTED", ntaRef: result.reference },
    });
    return { status: "submitted", reference: result.reference };
  } catch (err) {
    // 3. Offline? BullMQ picks it up when connectivity returns
    await syncQueue.add("tax-sync", { idempotencyKey }, {
      attempts: 10,
      backoff: { type: "exponential", delay: 5000 },
      removeOnComplete: true,
    });
    return { status: "queued", idempotencyKey };
  }
}`,
    language: "typescript",
    tradeoffs: [
      { pro: "Zero data loss — SQLite survives app kills/crashes", con: "Duplicate-check logic required on NTA API side" },
      { pro: "Idempotency keys prevent double-filing on retry", con: "Local queue grows unbounded on long offline periods" },
    ],
    tags: ["Offline-First", "BullMQ", "Fintech", "Reliability"],
    accent: "teal",
  },
];

// ─── Live Activity ────────────────────────────────────────────────────────────

export const ACTIVITY_ITEMS: ActivityItem[] = [
  {
    id: "a1",
    type: "commit",
    project: "SabiScore",
    message: "feat: add Optuna hyperparameter sweep for LightGBM",
    timestamp: "2h ago",
    branch: "feat/lgb-tuning",
    accent: "cyan",
  },
  {
    id: "a2",
    type: "deploy",
    project: "TaxBridge",
    message: "deploy: v13.7 production push to Render + Vercel",
    timestamp: "5h ago",
    accent: "teal",
  },
  {
    id: "a3",
    type: "pr",
    project: "SabiScore",
    message: "pr: ensemble calibration — Platt scaling for probability output",
    timestamp: "1d ago",
    branch: "feat/calibration",
    accent: "cyan",
  },
  {
    id: "a4",
    type: "commit",
    project: "Hashablanca",
    message: "fix: CBOR streaming backpressure on 4GB+ files",
    timestamp: "2d ago",
    branch: "fix/cbor-oom",
    accent: "violet",
  },
  {
    id: "a5",
    type: "release",
    project: "TaxBridge",
    message: "release: v13.0 — NTA 2025 compliance + TOTP 2FA",
    timestamp: "3d ago",
    accent: "teal",
  },
  {
    id: "a6",
    type: "commit",
    project: "SabiScore",
    message: "perf: Redis stale-while-revalidate drops P99 to 87ms",
    timestamp: "4d ago",
    branch: "perf/cache",
    accent: "cyan",
  },
  {
    id: "a7",
    type: "commit",
    project: "AI Consulting",
    message: "feat: LangChain RAG pipeline for client model explainability",
    timestamp: "5d ago",
    accent: "warn",
  },
];

// ─── Testimonials ────────────────────────────────────────────────────────────

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    quote:
      "Oscar's ensemble model improved our prediction accuracy by 23% in production. His deployment expertise and attention to monitoring ensured smooth rollout with zero downtime. He doesn't just build models — he ships systems.",
    author: "Tobi Omokore",
    role: "CTO",
    company: "BALL 247",
    avatarInitials: "TO",
    avatarBg: "#00d9ff",
    rating: 5,
    projectRef: "sabiscore",
  },
  {
    id: "t2",
    quote:
      "We brought Oscar in to audit a struggling ML pipeline. Within a week, he'd cut our debugging time in half and built LLM-powered reports our non-technical stakeholders could actually use. Outstanding technical depth.",
    author: "Amaka Eze",
    role: "Head of Data",
    company: "Fintech Startup (NDA)",
    avatarInitials: "AE",
    avatarBg: "#7c3aed",
    rating: 5,
    projectRef: "ai-consulting",
  },
  {
    id: "t3",
    quote:
      "The ZK proof implementation was flawless. Oscar understood the privacy requirements immediately, delivered clean Circom circuits, and wrote 90%+ test coverage without being asked. Rare to find that combination.",
    author: "David Okonkwo",
    role: "Founder",
    company: "Web3 Protocol (Stealth)",
    avatarInitials: "DO",
    avatarBg: "#00c896",
    rating: 5,
    projectRef: "hashablanca",
  },
];

// ─── Certifications ───────────────────────────────────────────────────────────

export const CERTIFICATIONS: Certification[] = [
  {
    id: "kaggle",
    title: "17 Kaggle Micro-Courses",
    issuer: "Kaggle",
    year: "2023",
    url: "https://www.kaggle.com/scardubu",
    description:
      "ML, feature engineering, data visualization, Python, SQL, and more.",
  },
  {
    id: "google-ml",
    title: "Machine Learning Crash Course",
    issuer: "Google",
    year: "2022",
    url: "https://developers.google.com/machine-learning/crash-course",
    description: "Fundamentals of ML with TensorFlow.",
  },
  {
    id: "coursera-ng",
    title: "Machine Learning Specialization",
    issuer: "Coursera (Andrew Ng)",
    year: "2022",
    url: "https://www.coursera.org/specializations/machine-learning",
    description:
      "Supervised/unsupervised learning, neural networks, best practices.",
  },
];

// ─── GitHub Stats ─────────────────────────────────────────────────────────────

export const GITHUB_STATS = {
  contributions: "350+",
  publicRepos: 12,
  followers: 45,
  handle: "scardubu",
  url: "https://github.com/scardubu",
};

// ─── Portfolio Performance ───────────────────────────────────────────────────

export const PERF_METRICS = {
  uptime: "99.94%",
  fcp: "120ms",
  lcp: "420ms",
  ttfb: "80ms",
  bundleSize: "280KB",
  monthlyVisitors: 350,
  avgSession: "180s",
};

// ─── Personal ────────────────────────────────────────────────────────────────

export const PERSONAL = {
  name: "Oscar Ndugbu",
  shortName: "Oscar.",
  tagline: "Production ML Engineer",
  location: "Lagos, Nigeria 🇳🇬",
  locationShort: "Nigeria 🇳🇬 • Remote-First",
  email: "scardubu@gmail.com",
  github: "https://github.com/scardubu",
  linkedin: "https://linkedin.com/in/oscardubu",
  kaggle: "https://www.kaggle.com/scardubu",
  availableForWork: true,
  availabilityLabel: "Open to Senior ML / Backend Roles & Consulting",
  responseTime: "Typically responds within 24 hours",
  quote: "Ship it, then iterate.",
  cvUrl: "/cv/oscar-ndugbu-cv.pdf",
};
