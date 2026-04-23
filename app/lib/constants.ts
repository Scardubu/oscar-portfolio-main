// Constants for portfolio data (PRD Feature 2: Projects-001 to Projects-009)

// Testimonials for social proof
export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  title: string;
  company: string;
  avatar?: string;
  rating: number;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "tobi-omokore",
    quote: "Oscar's ensemble model improved our prediction accuracy by 23% in production. His deployment expertise and attention to monitoring ensured smooth rollout with zero downtime.",
    author: "Tobi Omokore",
    title: "CTO",
    company: "BALL 247",
    rating: 5,
  },
  {
    id: "amina-hassan",
    quote: "Working with Oscar was a game-changer. He didn't just build a model—he delivered a complete ML system with monitoring, retraining pipelines, and comprehensive documentation.",
    author: "Amina Hassan",
    title: "Head of Engineering",
    company: "Trovotech Ltd",
    rating: 5,
  },
  {
    id: "chioma-iheagwara",
    quote: "Reduced our document processing time from 8 hours to 45 minutes with Oscar's NLP solution. The model is still running flawlessly in production 8 months later.",
    author: "Chioma Iheagwara",
    title: "Product Manager",
    company: "Legum Solutions",
    rating: 5,
  },
  {
    id: "egundeyi-olamide",
    quote: "Oscar's ability to translate complex ML concepts into practical business solutions is exceptional. He's equally comfortable discussing model architecture and user experience.",
    author: "Egundeyi Olamide",
    title: "AI Research Lead",
    company: "TradeBuza",
    rating: 5,
  },
];

// Portfolio-wide metrics for hero and stats sections
export interface PortfolioMetric {
  id: string;
  label: string;
  value: string;
  icon: string;
  description: string;
}

export const PORTFOLIO_METRICS: PortfolioMetric[] = [
  {
    id: "impact",
    label: "Global Impact",
    value: "Worldwide",
    icon: "🌍",
    description: "From Nigeria to audiences everywhere",
  },
  {
    id: "precision",
    label: "AI Precision",
    value: "Signal-Led",
    icon: "🎯",
    description: "Research-grade intelligence in production",
  },
  {
    id: "reliability",
    label: "Unwavering Reliability",
    value: "Always-On",
    icon: "✅",
    description: "Operational calm under pressure",
  },
  {
    id: "scale",
    label: "Built for Scale",
    value: "Elastic",
    icon: "🚀",
    description: "Architecture that holds as the surface grows",
  },
  {
    id: "technologies",
    label: "Technologies",
    value: "15+",
    icon: "🛠️",
    description: "Languages & frameworks",
  },
  {
    id: "clients",
    label: "Clients Served",
    value: "5+",
    icon: "💼",
    description: "Startups & enterprises",
  },
];

// Profile data for consistent use across the site
export const PROFILE = {
  name: "Oscar Ndugbu",
  title: "Fullstack Engineer",
  tagline: "Fullstack Engineer · Backend Infrastructure & AI Systems",
  location: "Nigeria",
  locationDisplay: "Lagos, Nigeria 🇳🇬",
  timezone: "WAT (UTC+1)",
  availableFor: "Remote & On-site (Nigeria)",
  email: "scardubu@gmail.com",
  phone: "+234-803-388-5065",
  social: {
    github: "https://github.com/scardubu",
    linkedin: "https://linkedin.com/in/oscardubu",
    twitter: "https://twitter.com/oscardubu",
  },
  bio: {
    short:
      "Fullstack engineer building production-grade backend systems, AI pipelines, and product interfaces that stay fast and reliable.",
    medium:
      "Platform architect and fullstack engineer delivering compliant, observable fintech systems end-to-end — from PostgreSQL RLS data models and FastAPI services to React/Next.js product surfaces. Consulting across West Africa and Europe.",
    long: `Production ML systems designed and deployed end-to-end—from feature engineering and model training to APIs, DevOps, and monitoring. Work spans ensemble models, real-time inference, and full-stack applications that people actually use.

Based in Nigeria and working with teams globally, focus is on sports analytics, fintech, and predictive systems where model performance directly impacts business outcomes. Open to consulting, technical partnerships, and high-impact ML roles.`,
  },
  highlights: [
    "Production ML Systems: Design and deploy ensemble models powering real-time prediction platforms at global scale",
    "Performance Engineering: Optimize ML inference pipelines for low-latency, high-throughput production workloads",
    "Full-Stack Development: Build complete AI applications from data pipelines and APIs to responsive frontends",
    "MLOps & Automation: Implement CI/CD for ML models with monitoring and auto-retraining systems",
    "🚀 Production ML Systems: Design and deploy ensemble models powering real-time prediction platforms at global scale",
    "⚡ Performance Engineering: Optimize ML inference pipelines for low-latency, high-throughput production workloads",
    "🛠️ Full-Stack Development: Build complete AI applications from data pipelines and APIs to responsive frontends",
    "🔄 MLOps & Automation: Implement CI/CD for ML models with monitoring and auto-retraining systems",
  ],
};

export interface CaseStudySection {
  title: string;
  bullets: string[];
}

export interface Project {
  id: string;
  title: string;
  brief: string;
  techStack: string[];
  metrics: {
    label: string;
    value: string;
    description?: string;
  }[];
  links: {
    demo?: string;
    github?: string;
    caseStudy?: string;
  };
  featured: boolean;
  demoType?: "chart" | "privacy" | "llm";
  githubRepo?: string; // For API integration
  caseStudy?: {
    summary?: string;
    sections: CaseStudySection[];
  };
}

export const PROJECTS: Project[] = [
  {
    id: 'sabiscore',
    title: 'SabiScore - AI Sports Prediction Platform',
    brief:
      'Production ML platform with ensemble models, monitored inference delivery, and a legible decision-support surface',
    techStack: ['Next.js', 'FastAPI', 'XGBoost', 'PostgreSQL', 'Redis', 'Docker'],
    metrics: [
      {
        label: 'Model Stack',
        value: 'Ensemble',
        description: 'XGBoost and LightGBM orchestration',
      },
      {
        label: 'Inference Profile',
        value: 'Signal-Led',
        description: 'Confidence framing tuned for live decisions',
      },
      {
        label: 'Pipeline Scope',
        value: 'End-to-End',
        description: 'Data ingestion through product delivery',
      },
      {
        label: 'Cache Layer',
        value: 'Redis',
        description: 'Low-latency prediction delivery',
      },
      {
        label: 'Delivery Posture',
        value: 'High availability',
        description: 'Graceful fallback and monitored serving boundaries',
      },
      {
        label: 'API Latency',
        value: '87ms',
        description: 'Avg. prediction response time',
      },
    ],
    links: {
      demo: 'https://sabiscore.vercel.app',
      github: 'https://github.com/scardubu/sabiscore',
    },
    featured: true,
    demoType: 'chart',
    githubRepo: 'scardubu/sabiscore',
    caseStudy: {
      summary:
        'Production ML platform delivering sub-200ms predictions, reliable uptime, and clear decision support for live sports intelligence.',
      sections: [
        {
          title: 'Problem & Context',
          bullets: [
            'Users needed trustworthy sports intelligence beyond gut-feel blogs and Telegram groups.',
            'Legacy scripts broke whenever leagues updated data schemas or when traffic spiked.',
            'Models lacked monitoring, so nobody knew when accuracy dropped after transfer windows or injuries.',
          ],
        },
        {
          title: 'System Design',
          bullets: [
            '220+ engineered features spanning rolling form, xG deltas, rest days, and player availability signals.',
            'Weighted ensemble (XGBoost, LightGBM, Random Forest) with confidence-aware routing and auto retraining hooks.',
            'FastAPI + Redis edge cache serving predictions in 87ms average with PostgreSQL for historical storage.',
          ],
        },
        {
          title: 'Impact',
          bullets: [
            'The platform was designed for repeated live-decision sessions during active match windows.',
            'Confidence-aware ranking kept the surface readable instead of overwhelming users with raw model output.',
            'Operational visibility came from alerts, dashboards, and structured monitoring hooks.',
          ],
        },
      ],
    },
  },
  {
    id: 'hashablanca',
    title: 'Hashablanca - Blockchain Token Distribution',
    brief:
      'Multi-chain token distribution platform with ZK proofs for privacy-preserving transactions',
    techStack: ['FastAPI', 'React', 'Web3.py', 'Circom', 'PostgreSQL', 'Docker'],
    metrics: [
      {
        label: 'Multi-Chain Support',
        value: '4 Networks',
        description: 'Ethereum, Polygon, BSC, StarkNet',
      },
      {
        label: 'File Processing',
        value: '4GB+',
        description: 'CBOR streaming for large datasets',
      },
      {
        label: 'Test Coverage',
        value: '90%+',
        description: 'Unit + integration tests',
      },
      {
        label: 'Privacy',
        value: 'ZK Proofs',
        description: 'Zero-knowledge transaction privacy',
      },
      {
        label: 'Compliance',
        value: 'GDPR',
        description: 'PII detection & anonymization',
      },
    ],
    links: {
      caseStudy: '#hashablanca-case-study',
    },
    featured: true,
    demoType: 'privacy',
    // githubRepo removed - repository is private/unavailable
    caseStudy: {
      summary:
        'Architected a privacy-first token distribution engine handling 4GB+ airdrop manifests across four chains without leaking PII.',
      sections: [
        {
          title: 'Problem & Context',
          bullets: [
            'Fintech client needed to distribute compliance-sensitive tokens to 50k+ wallets across multiple chains.',
            'CSV-based tooling crashed on 1GB files and leaked names/email hashes in logs.',
            'Auditors required GDPR guarantees plus verifiable proofs of distribution.',
          ],
        },
        {
          title: 'System Design',
          bullets: [
            'CBOR streaming parser with resumable uploads for 4GB manifests and progress checkpoints.',
            'Unified FastAPI gateway abstracting Ethereum, Polygon, BSC, and StarkNet with per-chain gas heuristics.',
            'Circom-powered ZK proofs + regex/NLP PII detectors to ensure only hashed payloads left the secure enclave.',
          ],
        },
        {
          title: 'Impact',
          bullets: [
            'Reduced gas spend by ~30% via batching and EIP-1559 tuning.',
            'Met GDPR review with automated redaction reports and encryption at rest (AES-GCM-256).',
            'Achieved 90%+ automated test coverage and passed two third-party security audits without major findings.',
          ],
        },
      ],
    },
  },
  {
    id: 'ai-consulting',
    title: 'AI Consulting & LLM Integration',
    brief:
      'ML consulting services helping teams debug models and integrate LLMs for stakeholder communication',
    techStack: ['Ollama', 'GPT-4', 'LangChain', 'Python', 'FastAPI'],
    metrics: [
      {
        label: 'Time Reduction',
        value: '60%',
        description: 'ML debugging time (10hr to 4hr)',
      },
      {
        label: 'Clients Served',
        value: '5+',
        description: 'Startups & enterprises',
      },
      {
        label: 'LLM Explanations',
        value: '100%',
        description: 'Technical to business translation',
      },
    ],
    links: {
      caseStudy: '#ai-consulting-case-studies',
    },
    featured: true,
    demoType: 'llm',
  },
];

// PRD Feature 3: Skills-001 (40+ skills across 5 categories)
export interface Skill {
  id: string;
  name: string;
  category: "ml" | "backend" | "frontend" | "devops" | "blockchain";
  proficiency: "expert" | "advanced" | "proficient";
  yearsOfExperience: number;
  projects: string[]; // Project IDs where used
  relatedSkills?: string[]; // Skill IDs
}

export const SKILLS: Skill[] = [
  // ML & AI
  {
    id: "xgboost",
    name: "XGBoost",
    category: "ml",
    proficiency: "expert",
    yearsOfExperience: 3,
    projects: ["sabiscore"],
    relatedSkills: ["lightgbm", "random-forest", "scikit-learn"],
  },
  {
    id: "lightgbm",
    name: "LightGBM",
    category: "ml",
    proficiency: "expert",
    yearsOfExperience: 3,
    projects: ["sabiscore"],
    relatedSkills: ["xgboost", "random-forest"],
  },
  {
    id: "random-forest",
    name: "Random Forest",
    category: "ml",
    proficiency: "advanced",
    yearsOfExperience: 3,
    projects: ["sabiscore"],
    relatedSkills: ["xgboost", "lightgbm"],
  },
  {
    id: "tensorflow",
    name: "TensorFlow",
    category: "ml",
    proficiency: "advanced",
    yearsOfExperience: 2,
    projects: [],
    relatedSkills: ["scikit-learn"],
  },
  {
    id: "scikit-learn",
    name: "scikit-learn",
    category: "ml",
    proficiency: "expert",
    yearsOfExperience: 4,
    projects: ["sabiscore"],
    relatedSkills: ["xgboost", "tensorflow"],
  },
  {
    id: "langchain",
    name: "LangChain",
    category: "ml",
    proficiency: "advanced",
    yearsOfExperience: 1,
    projects: ["ai-consulting"],
    relatedSkills: ["gpt4"],
  },
  {
    id: "feature-engineering",
    name: "Feature Engineering",
    category: "ml",
    proficiency: "expert",
    yearsOfExperience: 4,
    projects: ["sabiscore"],
    relatedSkills: ["xgboost", "scikit-learn"],
  },
  {
    id: "gpt4",
    name: "GPT-4",
    category: "ml",
    proficiency: "advanced",
    yearsOfExperience: 1,
    projects: ["ai-consulting"],
    relatedSkills: ["langchain"],
  },

  // Backend
  {
    id: "fastapi",
    name: "FastAPI",
    category: "backend",
    proficiency: "expert",
    yearsOfExperience: 3,
    projects: ["sabiscore", "hashablanca", "ai-consulting"],
    relatedSkills: ["python", "postgresql", "redis"],
  },
  {
    id: "python",
    name: "Python 3.11",
    category: "backend",
    proficiency: "expert",
    yearsOfExperience: 5,
    projects: ["sabiscore", "hashablanca", "ai-consulting"],
    relatedSkills: ["fastapi", "sqlalchemy"],
  },
  {
    id: "nodejs",
    name: "Node.js",
    category: "backend",
    proficiency: "advanced",
    yearsOfExperience: 3,
    projects: [],
    relatedSkills: ["typescript", "nextjs"],
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    category: "backend",
    proficiency: "expert",
    yearsOfExperience: 4,
    projects: ["sabiscore", "hashablanca"],
    relatedSkills: ["sqlalchemy", "redis"],
  },
  {
    id: "redis",
    name: "Redis",
    category: "backend",
    proficiency: "advanced",
    yearsOfExperience: 2,
    projects: ["sabiscore"],
    relatedSkills: ["postgresql", "fastapi"],
  },
  {
    id: "sqlalchemy",
    name: "SQLAlchemy",
    category: "backend",
    proficiency: "expert",
    yearsOfExperience: 3,
    projects: ["sabiscore", "hashablanca"],
    relatedSkills: ["postgresql", "python"],
  },

  // Frontend
  {
    id: "nextjs",
    name: "Next.js 15",
    category: "frontend",
    proficiency: "expert",
    yearsOfExperience: 2,
    projects: ["sabiscore"],
    relatedSkills: ["react", "typescript", "tailwind"],
  },
  {
    id: "react",
    name: "React 18",
    category: "frontend",
    proficiency: "expert",
    yearsOfExperience: 3,
    projects: ["sabiscore", "hashablanca"],
    relatedSkills: ["nextjs", "typescript"],
  },
  {
    id: "typescript",
    name: "TypeScript",
    category: "frontend",
    proficiency: "expert",
    yearsOfExperience: 3,
    projects: ["sabiscore", "hashablanca"],
    relatedSkills: ["react", "nextjs", "nodejs"],
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    category: "frontend",
    proficiency: "expert",
    yearsOfExperience: 2,
    projects: ["sabiscore"],
    relatedSkills: ["nextjs", "react"],
  },
  {
    id: "shadcn",
    name: "shadcn/ui",
    category: "frontend",
    proficiency: "advanced",
    yearsOfExperience: 1,
    projects: [],
    relatedSkills: ["tailwind", "react"],
  },
  {
    id: "chartjs",
    name: "Chart.js",
    category: "frontend",
    proficiency: "advanced",
    yearsOfExperience: 2,
    projects: ["sabiscore"],
    relatedSkills: ["react"],
  },

  // DevOps
  {
    id: "docker",
    name: "Docker",
    category: "devops",
    proficiency: "expert",
    yearsOfExperience: 3,
    projects: ["sabiscore", "hashablanca"],
    relatedSkills: ["kubernetes", "github-actions"],
  },
  {
    id: "kubernetes",
    name: "Kubernetes",
    category: "devops",
    proficiency: "advanced",
    yearsOfExperience: 2,
    projects: [],
    relatedSkills: ["docker", "aws"],
  },
  {
    id: "aws",
    name: "AWS",
    category: "devops",
    proficiency: "advanced",
    yearsOfExperience: 2,
    projects: [],
    relatedSkills: ["docker", "gcp"],
  },
  {
    id: "gcp",
    name: "GCP",
    category: "devops",
    proficiency: "proficient",
    yearsOfExperience: 1,
    projects: [],
    relatedSkills: ["aws", "docker"],
  },
  {
    id: "vercel",
    name: "Vercel",
    category: "devops",
    proficiency: "expert",
    yearsOfExperience: 2,
    projects: ["sabiscore"],
    relatedSkills: ["nextjs", "github-actions"],
  },
  {
    id: "github-actions",
    name: "GitHub Actions",
    category: "devops",
    proficiency: "advanced",
    yearsOfExperience: 2,
    projects: ["sabiscore", "hashablanca"],
    relatedSkills: ["docker", "vercel"],
  },
  {
    id: "turborepo",
    name: "Turborepo",
    category: "devops",
    proficiency: "proficient",
    yearsOfExperience: 1,
    projects: [],
    relatedSkills: ["nextjs"],
  },

  // Blockchain
  {
    id: "web3py",
    name: "Web3.py",
    category: "blockchain",
    proficiency: "expert",
    yearsOfExperience: 2,
    projects: ["hashablanca"],
    relatedSkills: ["ethersjs", "circom"],
  },
  {
    id: "ethersjs",
    name: "ethers.js",
    category: "blockchain",
    proficiency: "advanced",
    yearsOfExperience: 2,
    projects: ["hashablanca"],
    relatedSkills: ["web3py"],
  },
  {
    id: "ethereum",
    name: "Ethereum",
    category: "blockchain",
    proficiency: "advanced",
    yearsOfExperience: 2,
    projects: ["hashablanca"],
    relatedSkills: ["polygon", "bsc", "web3py"],
  },
  {
    id: "polygon",
    name: "Polygon",
    category: "blockchain",
    proficiency: "advanced",
    yearsOfExperience: 2,
    projects: ["hashablanca"],
    relatedSkills: ["ethereum", "bsc"],
  },
  {
    id: "bsc",
    name: "BSC",
    category: "blockchain",
    proficiency: "advanced",
    yearsOfExperience: 2,
    projects: ["hashablanca"],
    relatedSkills: ["ethereum", "polygon"],
  },
  {
    id: "circom",
    name: "Circom (ZK Proofs)",
    category: "blockchain",
    proficiency: "proficient",
    yearsOfExperience: 1,
    projects: ["hashablanca"],
    relatedSkills: ["web3py"],
  },
  {
    id: "eip1559",
    name: "EIP-1559",
    category: "blockchain",
    proficiency: "advanced",
    yearsOfExperience: 2,
    projects: ["hashablanca"],
    relatedSkills: ["ethereum"],
  },
];

// PRD Feature 3: Skill-004 (Certifications)
export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
  description?: string;
}

export const CERTIFICATIONS: Certification[] = [
  {
    id: "kaggle-17",
    title: "17 Kaggle Micro-Courses",
    issuer: "Kaggle",
    date: "2023",
    credentialUrl: "https://www.kaggle.com/scardubu",
    description:
      "Completed courses in ML, feature engineering, data visualization, and more",
  },
  {
    id: "google-ml",
    title: "Machine Learning Crash Course",
    issuer: "Google",
    date: "2022",
    credentialUrl: "https://developers.google.com/machine-learning/crash-course",
    description: "Fundamentals of ML with TensorFlow",
  },
  {
    id: "coursera-ml",
    title: "Machine Learning Specialization",
    issuer: "Coursera (Andrew Ng)",
    date: "2022",
    credentialUrl: "https://www.coursera.org/specializations/machine-learning",
    description: "Supervised/unsupervised learning, neural networks, best practices",
  },
];

// Contact options for the enhanced contact section
export interface ContactOption {
  id: string;
  icon: string;
  title: string;
  description: string;
  cta: string;
  href: string;
}

export const CONTACT_OPTIONS: ContactOption[] = [
  {
    id: "consulting",
    icon: "💼",
    title: "Consulting & Projects",
    description: "Custom ML solutions, model deployment, and MLOps implementation",
    cta: "Discuss Your Project",
    href: "mailto:scardubu@gmail.com?subject=Consulting%20Inquiry",
  },
  {
    id: "partnership",
    icon: "🤝",
    title: "Technical Partnerships",
    description: "Co-founder opportunities, technical advisorship, and strategic collaboration",
    cta: "Explore Partnership",
    href: "mailto:scardubu@gmail.com?subject=Partnership%20Opportunity",
  },
  {
    id: "speaking",
    icon: "🎓",
    title: "Speaking & Mentorship",
    description: "Tech talks, workshops, and mentoring for ML engineers",
    cta: "Send Invitation",
    href: "mailto:scardubu@gmail.com?subject=Speaking%20Inquiry",
  },
];
