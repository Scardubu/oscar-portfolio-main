/**
 * portfolio-data.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Single source of truth for all portfolio content.
 * Components import from here — never hardcode content in JSX.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ── Hero ─────────────────────────────────────────────────────────────────────

export const HERO = {
  greeting:    "Hey, I'm Oscar 👋",
  name:        "Oscar Ndugbu",
  title:       "Full-Stack ML Engineer",
  subtitle:    "Production AI systems shipped to real users — not prototypes, not notebooks.",
  description: `Flagship sports intelligence platform <strong>SabiScore</strong> powers real-time insights that sharpen every decision — engineered for seamless flow and unwavering performance at global scale. From Nigeria to audiences worldwide: cutting-edge ML research fused with full-stack product execution.`,
  location:    "Nigeria 🇳🇬 · Remote-First",
  availability: "Open to Senior ML / Full-Stack Roles & Consulting",
  cta: {
    primary:   { label: "Let's Talk 💬", href: "#contact" },
    secondary: { label: "Download CV",   href: "/cv/oscar-ndugbu-resume.pdf" },
    scroll:    { label: "View Work",  href: "#projects" },
  },
} as const;

// ── Hero Metrics ──────────────────────────────────────────────────────────────

export const HERO_METRICS = [
  { value: 99.9, suffix: '%', label: 'System Uptime', type: 'documented' as const },
  { value: 87, suffix: 'ms', label: 'API p50 Latency', type: 'documented' as const },
  { value: 4, suffix: '+', label: 'Years Shipping', type: 'snapshot' as const },
  { value: 3, suffix: '', label: 'Live Systems', type: 'live' as const },
] as const;

// ── Projects ─────────────────────────────────────────────────────────────────

export type MetricType = "live" | "documented" | "backtested" | "snapshot";

export interface ProjectMetric {
  value:  string;
  label:  string;
  type:   MetricType;
}

export interface Project {
  id:          string;
  title:       string;
  tagline:     string;
  description: string;
  stack:       string[];
  metrics:     ProjectMetric[];
  links: {
    caseStudy?: string;
    demo?:      string;
    repo?:      string;
  };
  accent: "cyan" | "violet" | "teal";
  featured: boolean;
}

export const PROJECTS: Project[] = [
  {
    id:      "sabiscore",
    title:   "SabiScore",
    tagline: "AI Sports Prediction Platform",
    description:
      "Production ML platform for sports intelligence. Ensemble model stack (XGBoost + LightGBM + feature engineering pipeline) with Full MLOps: CI/CD retraining, Redis caching, sub-90ms API latency.",
    stack:   ["Next.js", "FastAPI", "XGBoost", "PostgreSQL", "Redis", "Docker"],
    metrics: [
      { value: "99.9%", label: "System Uptime",        type: "documented"  },
      { value: "87ms",  label: "p50 API Latency",      type: "documented"  },
      { value: "4",     label: "MLOps Pipeline Stages",type: "documented"  },
    ],
    links: {
      caseStudy: "#",
      demo:      "https://sabiscore.vercel.app",
      repo:      "https://github.com/scardubu/sabiscore",
    },
    accent:   "cyan",
    featured: true,
  },
  {
    id:      "hashablanca",
    title:   "Hashablanca",
    tagline: "Blockchain Token Distribution",
    description:
      "Multi-chain token distribution platform with ZK proofs for privacy-preserving transactions. CBOR streaming handles 4GB+ file processing. 90%+ test coverage. GDPR-compliant PII detection and anonymization across Ethereum, Polygon, BSC, and StarkNet.",
    stack:   ["FastAPI", "React", "Web3.py", "Circom", "PostgreSQL", "Docker"],
    metrics: [
      { value: "4",    label: "Chain Networks",  type: "documented" },
      { value: "4GB+", label: "File Processing", type: "documented" },
      { value: "90%+", label: "Test Coverage",   type: "documented" },
      { value: "ZK",   label: "Privacy Proofs",  type: "documented" },
    ],
    links: {
      caseStudy: "#",
    },
    accent:   "violet",
    featured: true,
  },
  {
    id:      "ai-consulting",
    title:   "AI Consulting & LLM Integration",
    tagline: "Enterprise ML Debugging & Integration",
    description:
      "ML consulting for startups and enterprises: model debugging, LLM integration (GPT-4, Ollama/Llama 3), and LangChain pipelines that translate technical outputs into stakeholder-ready business communication. Average debugging time reduced from 10hr to 4hr.",
    stack:   ["Ollama", "GPT-4", "LangChain", "Python", "FastAPI"],
    metrics: [
      { value: "60%",  label: "Debug Time Reduction", type: "documented" },
      { value: "5+",   label: "Clients Served",       type: "live"       },
      { value: "100%", label: "LLM Coverage",         type: "documented" },
    ],
    links: {
      caseStudy: "#",
    },
    accent:   "teal",
    featured: true,
  },
];

// ── Skills ────────────────────────────────────────────────────────────────────

export type SkillCategory = "ML & AI" | "Backend" | "Frontend" | "DevOps" | "Blockchain";

export interface Skill {
  name:       string;
  category:   SkillCategory;
  level:      number; // 0–100
  yearsUsed:  number;
  color:      string; // CSS color for node
}

export const SKILLS: Skill[] = [
  // ML & AI
  { name: "XGBoost",        category: "ML & AI",    level: 92, yearsUsed: 3, color: "#00d9ff" },
  { name: "LightGBM",       category: "ML & AI",    level: 88, yearsUsed: 3, color: "#00d9ff" },
  { name: "Scikit-learn",   category: "ML & AI",    level: 90, yearsUsed: 4, color: "#00d9ff" },
  { name: "PyTorch",        category: "ML & AI",    level: 75, yearsUsed: 2, color: "#00d9ff" },
  { name: "LangChain",      category: "ML & AI",    level: 82, yearsUsed: 2, color: "#00d9ff" },
  { name: "MLflow",         category: "ML & AI",    level: 78, yearsUsed: 2, color: "#00d9ff" },
  { name: "Ollama",         category: "ML & AI",    level: 80, yearsUsed: 1, color: "#00d9ff" },
  // Backend
  { name: "FastAPI",        category: "Backend",    level: 95, yearsUsed: 3, color: "#00c896" },
  { name: "Python",         category: "Backend",    level: 95, yearsUsed: 4, color: "#00c896" },
  { name: "PostgreSQL",     category: "Backend",    level: 88, yearsUsed: 4, color: "#00c896" },
  { name: "Redis",          category: "Backend",    level: 82, yearsUsed: 2, color: "#00c896" },
  { name: "Node.js",        category: "Backend",    level: 80, yearsUsed: 3, color: "#00c896" },
  // Frontend
  { name: "Next.js",        category: "Frontend",   level: 90, yearsUsed: 3, color: "#7c3aed" },
  { name: "React",          category: "Frontend",   level: 90, yearsUsed: 3, color: "#7c3aed" },
  { name: "TypeScript",     category: "Frontend",   level: 85, yearsUsed: 2, color: "#7c3aed" },
  { name: "Tailwind CSS",   category: "Frontend",   level: 92, yearsUsed: 3, color: "#7c3aed" },
  // DevOps
  { name: "Docker",         category: "DevOps",     level: 85, yearsUsed: 3, color: "#f59e0b" },
  { name: "GitHub Actions", category: "DevOps",     level: 82, yearsUsed: 2, color: "#f59e0b" },
  { name: "Vercel",         category: "DevOps",     level: 90, yearsUsed: 3, color: "#f59e0b" },
  { name: "Linux/Ubuntu",   category: "DevOps",     level: 80, yearsUsed: 4, color: "#f59e0b" },
  // Blockchain
  { name: "Web3.py",        category: "Blockchain", level: 78, yearsUsed: 2, color: "#7c3aed" },
  { name: "Circom/ZK",      category: "Blockchain", level: 70, yearsUsed: 1, color: "#7c3aed" },
  { name: "Solidity",       category: "Blockchain", level: 65, yearsUsed: 1, color: "#7c3aed" },
];

// ── Testimonials ──────────────────────────────────────────────────────────────

export const TESTIMONIALS = [
  {
    id:       "tobi",
    quote:    "Oscar's ensemble model improved our prediction accuracy by 23% in production. His deployment expertise and attention to monitoring ensured smooth rollout with zero downtime.",
    name:     "Tobi Omokore",
    title:    "CTO",
    company:  "BALL 247",
    initials: "TO",
    accent:   "#00d9ff",
  },
  {
    id:       "chidi",
    quote:    "He owns the full stack — model, API, and frontend — and delivers production-ready code on the first pass. Rare combination of ML depth and engineering discipline.",
    name:     "Chidi Eze",
    title:    "Head of Product",
    company:  "Fintech Startup",
    initials: "CE",
    accent:   "#00c896",
  },
  {
    id:       "amara",
    quote:    "The LLM integration Oscar built saves our analysts 6 hours per week by translating model outputs into stakeholder presentations automatically. Exceptional ROI.",
    name:     "Amara Obi",
    title:    "Data Science Lead",
    company:  "Enterprise Client",
    initials: "AO",
    accent:   "#7c3aed",
  },
];

// ── Live Activity Feed ────────────────────────────────────────────────────────

export const LIVE_METRICS = {
  uptime:        "99.94%",
  uptimeTarget:  "≥99.9%",
  fcp:           "120ms",
  lcp:           "420ms",
  ttfb:          "80ms",
  bundleSize:    "280 KB",
  bundleTarget:  "< 300 KB",
  monthlyVisits: 350,
  avgSession:    "3m 00s",
} as const;

export const ACTIVITY_FEED = [
  { id: "a1", event: "SabiScore prediction model retrained",        time: "2h ago",  type: "ml"      as const },
  { id: "a2", event: "New user registered on SabiScore",           time: "4h ago",  type: "user"    as const },
  { id: "a3", event: "Portfolio Lighthouse score: 99/100",         time: "1d ago",  type: "perf"    as const },
  { id: "a4", event: "SwarmXQ agent evolution cycle completed",    time: "2d ago",  type: "infra"   as const },
  { id: "a5", event: "Consulting client ML pipeline shipped",      time: "3d ago",  type: "shipped" as const },
  { id: "a6", event: "XGBoost model v3.2 deployed to production",  time: "5d ago",  type: "ml"      as const },
  { id: "a7", event: "Portfolio deployed: new bento grid layout",  time: "1w ago",  type: "shipped" as const },
] as const;

// ── Production Patterns ───────────────────────────────────────────────────────

export const PRODUCTION_PATTERNS = [
  {
    id:      "mlops",
    title:   "MLOps Pipeline",
    caption: "Automated ML lifecycle",
    description: "Feature engineering to model training to validation to blue-green deployment to monitoring to auto-retraining on drift detection. GitHub Actions CI/CD, MLflow experiment tracking.",
    metrics: [{ value: "< 4hr", label: "Model retrain cycle" }, { value: "0",  label: "Manual deploys" }],
    accent: "cyan" as const,
  },
  {
    id:      "inference",
    title:   "Inference Architecture",
    caption: "Sub-100ms prediction API",
    description: "FastAPI + Redis feature cache + async Celery workers. Prediction requests served from in-memory feature store; cache hit rate > 85%. PostgreSQL for historical storage.",
    metrics: [{ value: "87ms", label: "p50 latency" }, { value: "85%+", label: "Cache hit rate" }],
    accent: "teal" as const,
  },
  {
    id:      "zk",
    title:   "ZK Privacy Layer",
    caption: "Zero-knowledge proofs",
    description: "Circom circuits for privacy-preserving token distribution on Hashablanca. On-chain verification with off-chain proving. EVM-compatible across 4 networks.",
    metrics: [{ value: "4",    label: "Chain networks" }, { value: "< 2s", label: "Proof generation" }],
    accent: "violet" as const,
  },
  {
    id:      "observability",
    title:   "Observability Stack",
    caption: "Production monitoring",
    description: "Structured logging, error rate alerting, p95 latency dashboards, model drift detection (PSI score), uptime monitoring with PagerDuty-style alerting.",
    metrics: [{ value: "99.9%", label: "Uptime SLA" }, { value: "< 5m", label: "MTTR" }],
    accent: "teal" as const,
  },
];

// ── Social Links ──────────────────────────────────────────────────────────────

export const SOCIAL = {
  github:   "https://github.com/scardubu",
  linkedin: "https://linkedin.com/in/oscardubu",
  email:    "mailto:scardubu@gmail.com",
  twitter:  "https://twitter.com/scardubu",
} as const;