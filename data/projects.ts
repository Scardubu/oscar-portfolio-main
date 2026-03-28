export type ProjectStatus = "live" | "wip" | "archived";

export interface Decision {
  chosen: string;
  rejected: string;
  reason: string;
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  context?: string;
  decisions?: Decision[];
  status: ProjectStatus;
  featured: boolean;
  tags: string[];    // Max 6
  demoUrl?: string;  // REQUIRED if status === "live" — must resolve before ship
  repoUrl?: string;
  image?: string;    // /projects/[id].webp
}

export const projects: Project[] = [
  {
    id: "sabiscore",
    title: "SabiScore",
    tagline: "Real-time sports intelligence built for live concurrent sessions.",
    description:
      "Production sports intelligence across live events, shipped end-to-end " +
      "with ensemble models, FastAPI inference, Redis caching, Postgres, Docker, and Next.js.",
    context:
      "Production systems serving live concurrent sessions across high-traffic " +
      "events without sacrificing reliability or product clarity.",
    decisions: [
      {
        chosen:
          "Ensemble meta-learner (XGBoost + LightGBM + scikit-learn stacked) over single-model.",
        rejected: "Single-model prediction pipeline",
        reason: "+6.3pp accuracy at acceptable inference latency.",
      },
      {
        chosen: "Redis caching after Postgres latency exceeded 200ms at peak.",
        rejected: "Direct Postgres reads per request",
        reason: "Cache eliminated spikes without infrastructure scaling.",
      },
      {
        chosen: "Embedding-based retrieval and ensemble meta-learning.",
        rejected: "Rule-based prediction",
        reason: "Insufficient cross-league generalization.",
      },
      {
        chosen: "FastAPI inference with Redis caching and Postgres-backed features.",
        rejected: "GPT-based inference",
        reason: "Cost incompatible with free-tier economics.",
      },
    ],
    status: "live",
    featured: true,
    tags: ["Python", "FastAPI", "XGBoost", "PostgreSQL", "Redis", "Next.js"],
    demoUrl: "https://sabiscore.vercel.app",
    repoUrl: "https://github.com/Scardubu/sabiscore",
    image: "/projects/sabiscore.webp",
  },
  {
    id: "hashablanca",
    title: "Hashablanca",
    tagline: "Blockchain analytics infrastructure for operational visibility.",
    description:
      "Streaming pipeline ingesting on-chain data to surface anomalies and " +
      "transaction patterns for compliance teams. Built on Kafka, dbt, and React.",
    context:
      "Data products for teams that need event-stream visibility, repeatable modeling, " +
      "and business-readable outputs across volatile blockchain data.",
    status: "wip",
    featured: false,
    tags: ["TypeScript", "Kafka", "dbt", "React", "Python", "Ethereum"],
    image: "/projects/hashablanca.webp",
  },
  {
    id: "ml-consulting",
    title: "ML Systems Consulting",
    tagline: "ML debugging, platform reliability, and LLM integration for delivery teams.",
    description:
      "Technical consulting spanning model productionization, MLOps pipeline " +
      "design, observability, and team enablement across applied AI programs.",
    context:
      "Consulting covers ML debugging tooling and LLM integration where technical " +
      "model behavior must translate into business-readable outcomes.",
    status: "live",
    featured: false,
    tags: ["MLOps", "Python", "AWS", "Terraform", "FastAPI", "MLflow"],
    image: "/projects/consulting.webp",
  },
];

// FORBIDDEN in any field:
//   Self-reported ROI/accuracy claims · Betting references · First-person language
