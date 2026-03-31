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
    id: 'sabiscore',
    title: 'SabiScore',
    tagline: 'Production sports intelligence platform for live decision windows.',
    description:
      'End-to-end ML pipeline processing alternative financial data signals through a trained ' +
      'gradient boosting model, served via FastAPI with real-time monitoring and drift alerts.',
    context:
      'Needed real-time prediction under infrastructure constraints common in sub-Saharan Africa while ' +
      'serving a global audience through high-traffic concurrent events.',
    decisions: [
      {
        chosen: 'Ensemble meta-learner across gradient-boosted models.',
        rejected: 'Single-model prediction pipeline',
        reason:
          'Improved calibration across varied operating conditions without making the serving layer opaque.',
      },
      {
        chosen: 'Redis caching in front of repeat inference reads.',
        rejected: 'Direct Postgres reads per request',
        reason:
          'Direct reads exceeded 200ms during peak windows; cache eliminated latency spikes without scaling infrastructure prematurely.',
      },
      {
        chosen: 'Embedding-based feature retrieval.',
        rejected: 'Rule-based heuristics',
        reason: 'Generalized more reliably across event types than handcrafted rules.',
      },
      {
        chosen: 'FastAPI inference with Redis caching and Postgres-backed features.',
        rejected: 'LLM-style request-time inference',
        reason:
          'Kept the system cheaper to run, easier to debug, and more predictable under sustained usage.',
      },
    ],
    status: 'live',
    featured: true,
    tags: ['Python', 'FastAPI', 'XGBoost', 'PostgreSQL', 'Redis', 'Next.js'],
    demoUrl: 'https://sabiscore.vercel.app',
    repoUrl: 'https://github.com/Scardubu/sabiscore',
    image: '/projects/sabiscore.webp',
  },
  {
    id: 'hashablanca',
    title: 'Hashablanca',
    tagline: 'Real-time blockchain transaction analytics platform.',
    description:
      'Streaming pipeline ingesting on-chain data to surface anomalies and transaction patterns ' +
      'for compliance teams. Built on Kafka, dbt, and React.',
    context:
      'Data products for teams that need event-stream visibility, repeatable modeling, ' +
      'and business-readable outputs across volatile blockchain data.',
    decisions: [
      {
        chosen: 'Kafka event streaming with dbt transformation layers.',
        rejected: 'Batch SQL pipelines with scheduled refreshes',
        reason:
          'Event-level granularity enables real-time anomaly detection that batch windows miss entirely.',
      },
    ],
    status: 'wip',
    featured: false,
    tags: ['TypeScript', 'Kafka', 'dbt', 'React', 'Python', 'Ethereum'],
    image: '/projects/hashablanca.webp',
  },
  {
    id: 'ml-consulting',
    title: 'ML Systems Consulting',
    tagline: 'Production ML architecture and delivery for fintech clients.',
    description:
      'Technical consulting spanning model productionization, MLOps pipeline design, and team ' +
      'enablement across payments, lending, and fraud detection.',
    context:
      'Consulting covers ML debugging tooling and LLM integration where technical ' +
      'model behavior must translate into business-readable outcomes.',
    decisions: [
      {
        chosen: 'Structured discovery-first engagement with documented architecture review.',
        rejected: 'Direct implementation without systematic codebase audit',
        reason:
          'System-level diagnosis before code changes prevents rework and de-risks handover to internal teams.',
      },
    ],
    status: 'live',
    featured: false,
    tags: ['MLOps', 'Python', 'AWS', 'Terraform', 'FastAPI', 'MLflow'],
    image: '/projects/consulting.webp',
  },
];

// FORBIDDEN in any field:
//   Self-reported ROI/accuracy claims · Betting references · First-person language
