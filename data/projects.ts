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
      'End-to-end ML pipeline for sports event prediction, served through FastAPI with Redis-backed ' +
      'response delivery, operational monitoring, and clear confidence framing.',
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
    tagline: 'Blockchain analytics infrastructure for operational visibility.',
    description:
      'Streaming pipeline ingesting on-chain data to surface anomalies and ' +
      'transaction patterns for compliance teams. Built on Kafka, dbt, and React.',
    context:
      'Data products for teams that need event-stream visibility, repeatable modeling, ' +
      'and business-readable outputs across volatile blockchain data.',
    status: 'wip',
    featured: false,
    tags: ['TypeScript', 'Kafka', 'dbt', 'React', 'Python', 'Ethereum'],
    image: '/projects/hashablanca.webp',
  },
  {
    id: 'ml-consulting',
    title: 'ML Systems Consulting',
    tagline: 'Production ML architecture and delivery for fintech and platform teams.',
    description:
      'Technical consulting spanning model productionization, MLOps pipeline ' +
      'design, observability, and team enablement across applied AI programs.',
    context:
      'Consulting covers ML debugging tooling and LLM integration where technical ' +
      'model behavior must translate into business-readable outcomes.',
    status: 'live',
    featured: false,
    tags: ['MLOps', 'Python', 'AWS', 'Terraform', 'FastAPI', 'MLflow'],
    image: '/projects/consulting.webp',
  },
];

// FORBIDDEN in any field:
//   Self-reported ROI/accuracy claims · Betting references · First-person language
