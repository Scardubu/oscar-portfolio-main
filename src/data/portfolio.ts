// src/data/portfolio.ts
// Single source of truth for all portfolio content.
// Edit this file to update content — never hardcode in components.

export const siteConfig = {
  name: "Oscar Dubu",
  title: "Oscar Dubu — Full-Stack + AI/ML Engineer",
  description:
    "I build AI systems that ship to production. Sports intelligence, ML pipelines, and full-stack platforms — from infra to UI.",
  url: "https://www.scardubu.dev",
  ogImage: "/og-image.png",
  location: "Lagos, Nigeria",
  timezone: "WAT (UTC+1)",
  status: "Open to Senior ML / Full-Stack Roles & Consulting",
  available: true,
} as const;

export const social = {
  github:   "https://github.com/Scardubu",
  linkedin: "https://linkedin.com/in/oscar-dubu",
  twitter:  "https://twitter.com/scardubu",
  email:    "oscar@scardubu.dev",
} as const;

// ── Hero ──────────────────────────────────────────────────────────────────
export const hero = {
  greeting: "Hey, I'm Oscar",
  rotatingWords: ["AI systems", "real products", "ML pipelines", "smart tools"],
  tagline: "that ship to production.",
  bio: "My flagship sports intelligence platform, SabiScore, powers real-time insights that sharpen every decision — engineered for seamless flow and unwavering performance at global scale.",
  manifesto:
    "From Nigeria to audiences worldwide, I fuse cutting-edge AI research with intuitive product mastery to create experiences that don't just work — they captivate, perform, and endure.",
  metrics: [
    { value: "Worldwide", label: "Global impact — from Nigeria to audiences everywhere" },
    { value: "Signal-Led", label: "Research-grade AI in production" },
    { value: "Always-On", label: "Operational calm under pressure" },
    { value: "Full",   label: "Stack ownership — infra to UI" },
  ],
  floatingCards: [
    { label: "Posture",     value: "Battle-Tested" },
    { label: "SabiScore",   value: "Live in Production", accent: true },
  ],
  techStack: [
    "Next.js 15", "Python", "FastAPI", "PostgreSQL",
    "PyTorch", "TypeScript", "Docker", "Redis",
  ],
} as const;

// ── Projects ──────────────────────────────────────────────────────────────
export type ProjectStatus = "live" | "documented" | "backtested" | "snapshot";

export interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  problem: string;
  solution: string;
  outcome: string;
  status: ProjectStatus;
  featured: boolean;
  tags: string[];
  links: {
    live?:  string;
    repo?:  string;
    demo?:  string;
    case?:  string;
  };
  accent: "cyan" | "violet" | "teal" | "warn";
  size: "large" | "medium" | "small"; // bento grid sizing hint
}

export const projects: Project[] = [
  {
    id: "sabiscore",
    name: "SabiScore",
    tagline: "Sports Intelligence Platform",
    description:
      "End-to-end sports prediction platform that processes live match data, runs ML inference, and surfaces actionable insights for fans and analysts.",
    problem:
      "Sports fans make decisions based on gut feel. Data exists but isn't accessible or actionable in real time.",
    solution:
      "Built a full pipeline: data ingestion → feature engineering → model serving → real-time API → consumer UI. Prediction model trained on 3 seasons of match data.",
    outcome:
      "7 out of 10 predictions correct. Running 24/7 on self-hosted infra. Used daily for match analysis.",
    status: "live",
    featured: true,
    tags: ["Python", "FastAPI", "PyTorch", "PostgreSQL", "Next.js", "Redis", "Docker"],
    links: {
      live: "https://sabiscore.app",
      repo: "https://github.com/Scardubu/sabiscore",
    },
    accent: "cyan",
    size: "large",
  },
  {
    id: "ml-pipeline",
    name: "MLOps Pipeline",
    tagline: "Production ML Infrastructure",
    description:
      "Reusable MLOps framework covering experiment tracking, model versioning, automated retraining triggers, and inference monitoring.",
    problem:
      "ML projects stall at the Jupyter notebook stage because productionising a model requires building infra from scratch each time.",
    solution:
      "Abstracted the common pipeline: data validation → training → evaluation → registry → serving → drift detection. Configurable per project.",
    outcome:
      "Powers SabiScore's model lifecycle. Redeployments take under 5 minutes. Drift alerts fire before prediction quality degrades.",
    status: "documented",
    featured: false,
    tags: ["Python", "MLflow", "FastAPI", "PostgreSQL", "Docker", "GitHub Actions"],
    links: {
      repo: "https://github.com/Scardubu/ml-pipeline",
    },
    accent: "violet",
    size: "medium",
  },
  {
    id: "data-ingestion",
    name: "Real-Time Data Ingestion",
    tagline: "Event-Driven Sports Data Layer",
    description:
      "WebSocket-based ingestion service that normalises live sports data from multiple sources into a consistent schema for downstream ML consumption.",
    problem:
      "Sports data APIs are inconsistent, unreliable, and expensive. A prediction model is only as good as its input data.",
    solution:
      "Built an adapter layer that fans out to multiple providers, deduplicates events, validates schema, and streams clean events to a message queue.",
    outcome:
      "Reduced data pipeline failures from weekly to near-zero. Supports 3 data sources with automatic failover.",
    status: "documented",
    featured: false,
    tags: ["Python", "WebSockets", "Redis Streams", "Pydantic", "FastAPI"],
    links: {
      repo: "https://github.com/Scardubu/data-ingestion",
    },
    accent: "teal",
    size: "medium",
  },
];

// ── Skills ────────────────────────────────────────────────────────────────
export type SkillCategory = "AI/ML" | "Backend" | "Frontend" | "DevOps" | "Data";

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: "expert" | "proficient" | "familiar";
  connections: string[]; // ids of related skills
}

export const skills: Skill[] = [
  // AI/ML
  { id: "pytorch",     name: "PyTorch",          category: "AI/ML",    level: "expert",     connections: ["python", "mlflow", "fastapi"] },
  { id: "scikit",      name: "scikit-learn",      category: "AI/ML",    level: "expert",     connections: ["python", "pandas"] },
  { id: "mlflow",      name: "MLflow",            category: "AI/ML",    level: "proficient", connections: ["pytorch", "docker"] },
  { id: "huggingface", name: "Hugging Face",      category: "AI/ML",    level: "proficient", connections: ["pytorch", "python"] },

  // Backend
  { id: "python",      name: "Python",            category: "Backend",  level: "expert",     connections: ["fastapi", "pytorch", "postgresql"] },
  { id: "fastapi",     name: "FastAPI",           category: "Backend",  level: "expert",     connections: ["python", "postgresql", "redis"] },
  { id: "nodejs",      name: "Node.js",           category: "Backend",  level: "proficient", connections: ["typescript", "postgresql"] },
  { id: "postgresql",  name: "PostgreSQL",        category: "Backend",  level: "expert",     connections: ["python", "fastapi", "prisma"] },
  { id: "redis",       name: "Redis",             category: "Backend",  level: "proficient", connections: ["fastapi", "docker"] },
  { id: "prisma",      name: "Prisma",            category: "Backend",  level: "proficient", connections: ["postgresql", "typescript"] },

  // Frontend
  { id: "typescript",  name: "TypeScript",        category: "Frontend", level: "expert",     connections: ["nextjs", "react", "nodejs"] },
  { id: "nextjs",      name: "Next.js",           category: "Frontend", level: "expert",     connections: ["typescript", "react", "tailwind"] },
  { id: "react",       name: "React",             category: "Frontend", level: "expert",     connections: ["nextjs", "typescript"] },
  { id: "tailwind",    name: "Tailwind CSS",      category: "Frontend", level: "expert",     connections: ["nextjs", "react"] },
  { id: "framer",      name: "Framer Motion",     category: "Frontend", level: "proficient", connections: ["react", "nextjs"] },

  // DevOps
  { id: "docker",      name: "Docker",            category: "DevOps",   level: "expert",     connections: ["python", "fastapi", "ghactions"] },
  { id: "ghactions",   name: "GitHub Actions",    category: "DevOps",   level: "proficient", connections: ["docker", "vercel"] },
  { id: "vercel",      name: "Vercel",            category: "DevOps",   level: "expert",     connections: ["nextjs", "ghactions"] },
  { id: "linux",       name: "Linux / VPS",       category: "DevOps",   level: "proficient", connections: ["docker", "python"] },

  // Data
  { id: "pandas",      name: "Pandas",            category: "Data",     level: "expert",     connections: ["python", "scikit"] },
  { id: "sql",         name: "SQL",               category: "Data",     level: "expert",     connections: ["postgresql", "python"] },
  { id: "websockets",  name: "WebSockets",        category: "Data",     level: "proficient", connections: ["fastapi", "nodejs"] },
];

export const skillCategories: { id: SkillCategory; label: string; accent: string }[] = [
  { id: "AI/ML",    label: "AI / ML",    accent: "var(--accent-primary)"   },
  { id: "Backend",  label: "Backend",    accent: "var(--accent-secondary)" },
  { id: "Frontend", label: "Frontend",   accent: "var(--accent-fintech)"   },
  { id: "DevOps",   label: "DevOps",     accent: "var(--accent-warn)"      },
  { id: "Data",     label: "Data",       accent: "#e879f9"                 },
];

// ── Production Patterns ───────────────────────────────────────────────────
export const productionPatterns = [
  {
    id: "mlops",
    title: "MLOps Pipeline",
    icon: "🧠",
    description: "Experiment tracking → model registry → automated retraining → drift detection. Models don't degrade silently.",
    steps: ["Data validation", "Feature store", "Training run", "Evaluation gate", "Registry push", "Inference serving", "Drift monitor"],
    stack: ["MLflow", "PyTorch", "FastAPI", "PostgreSQL", "Docker"],
    accent: "cyan" as const,
  },
  {
    id: "realtime",
    title: "Real-Time Data Layer",
    icon: "⚡",
    description: "WebSocket ingestion → normalisation → message queue → fan-out. Multiple sources, one clean schema.",
    steps: ["Source adapters", "Schema validation", "Deduplication", "Redis Streams", "Consumer workers"],
    stack: ["Python", "WebSockets", "Redis", "Pydantic"],
    accent: "violet" as const,
  },
  {
    id: "fullstack",
    title: "Full-Stack API Design",
    icon: "🏗️",
    description: "FastAPI backend with OpenAPI spec → TypeScript client generation → React Query caching. Type-safe from DB to UI.",
    steps: ["Pydantic models", "FastAPI routes", "OpenAPI spec", "TS client gen", "React Query", "Optimistic UI"],
    stack: ["FastAPI", "TypeScript", "Next.js", "PostgreSQL", "Prisma"],
    accent: "teal" as const,
  },
  {
    id: "deploy",
    title: "CI/CD & Deployment",
    icon: "🚀",
    description: "Commit → lint + type check → test → build → deploy. Zero-downtime rollouts with automatic rollback on failure.",
    steps: ["PR checks", "Lint + types", "Unit tests", "Docker build", "Registry push", "Deploy + health check"],
    stack: ["GitHub Actions", "Docker", "Vercel", "Linux"],
    accent: "warn" as const,
  },
];

// ── Live Activity ─────────────────────────────────────────────────────────
export const activityFeed = [
  { type: "commit",   message: "feat: improve match prediction confidence scoring",  repo: "sabiscore",        time: "2h ago",    status: "live" },
  { type: "deploy",   message: "Deployed v2.4.1 to production",                       repo: "sabiscore",        time: "3h ago",    status: "live" },
  { type: "commit",   message: "refactor: extract feature engineering to shared lib", repo: "ml-pipeline",      time: "yesterday", status: "live" },
  { type: "model",    message: "Retrain triggered — new match data ingested",          repo: "sabiscore",        time: "yesterday", status: "live" },
  { type: "commit",   message: "fix: websocket reconnect on provider timeout",         repo: "data-ingestion",   time: "2d ago",    status: "live" },
  { type: "commit",   message: "docs: add architecture diagram for MLOps pipeline",    repo: "ml-pipeline",      time: "3d ago",    status: "live" },
  { type: "deploy",   message: "Staging environment updated",                          repo: "oscar-portfolio",  time: "4d ago",    status: "live" },
];

// ── Experience ────────────────────────────────────────────────────────────
export const experience = [
  {
    id: "sabiscore-founder",
    role: "Founder & Lead Engineer",
    company: "SabiScore",
    type: "Founder",
    duration: "2022 — Present",
    current: true,
    description: "Built and shipped a sports AI platform end-to-end — data pipelines, ML models, API, and consumer UI.",
    bullets: [
      "Designed and trained a match prediction model achieving 7/10 correct call rate on live fixtures",
      "Built full MLOps pipeline: ingestion → training → serving → monitoring, with automated retraining",
      "Architected FastAPI + PostgreSQL backend serving real-time predictions via WebSocket and REST",
    ],
    stack: ["Python", "PyTorch", "FastAPI", "PostgreSQL", "Next.js", "Redis", "Docker"],
    accent: "cyan" as const,
  },
  {
    id: "freelance",
    role: "Senior Full-Stack Engineer",
    company: "Freelance / Consulting",
    type: "Contract",
    duration: "2020 — Present",
    current: true,
    description: "Designed and delivered production web platforms and AI integrations for clients across Nigeria and remotely.",
    bullets: [
      "Built data dashboards and automation tools integrating third-party APIs for business clients",
      "Delivered Next.js + TypeScript frontends with full CI/CD pipelines and Vercel deployment",
      "Consulted on AI/ML integration for two early-stage startups — scoping, architecture, and MVP delivery",
    ],
    stack: ["Next.js", "TypeScript", "Python", "PostgreSQL", "Tailwind CSS"],
    accent: "violet" as const,
  },
];

// ── Testimonials ──────────────────────────────────────────────────────────
export const testimonials = [
  {
    id: "t1",
    quote:
      "Oscar doesn't just write code — he thinks through the system. He built our data pipeline from scratch, handled the infra, and shipped it faster than we expected. Rare to find someone who owns the full stack like that.",
    name: "Tunde Adeyemi",
    role: "CTO",
    company: "Early-Stage Fintech (Nigeria)",
    initials: "TA",
    accent: "cyan" as const,
  },
  {
    id: "t2",
    quote:
      "What stood out was how he approached the ML problem — he didn't just train a model, he built the feedback loop that keeps it improving. That's senior-level thinking.",
    name: "Amara Osei",
    role: "Product Lead",
    company: "Sports Tech Startup",
    initials: "AO",
    accent: "violet" as const,
  },
];

// ── Role interest options for contact form ────────────────────────────────
export const roleInterests = [
  "Senior ML Engineer",
  "Senior Full-Stack Engineer",
  "AI/ML Consulting",
  "Technical Lead / Staff Engineer",
  "Contract / Freelance",
  "Other",
] as const;
