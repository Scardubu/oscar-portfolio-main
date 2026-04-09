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
      'End-to-end sports intelligence pipeline processing match, form, and market signals through ' +
      'an ensemble scoring stack, served via FastAPI with real-time monitoring and drift alerts.',
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
    id: 'taxbridge',
    title: 'TaxBridge',
    tagline: 'Offline-first tax operations platform for OCR intake, rule-safe computation, and immutable audit trails.',
    description:
      'Multi-tenant tax workflow handling OCR extraction, jurisdiction-specific computation, and ' +
      'append-only audit events with database-enforced tenant isolation.',
    context:
      'Needed offline-first intake, regulator-readable traceability, and strict tenant isolation without ' +
      'turning every request into a fragile cross-service orchestration problem.',
    decisions: [
      {
        chosen: 'Java 17 and Spring Boot 3 for the tax computation engine.',
        rejected: 'Python for the full OCR and rule-compute stack',
        reason:
          'Jurisdiction rules needed compile-time guarantees so invalid deduction states fail before deployment instead of surfacing as runtime computation defects.',
      },
      {
        chosen: 'Append-only audit events enforced at the database layer.',
        rejected: 'Application-level structured logs only',
        reason:
          'An immutable audit surface keeps regulator-facing history intact even when app logs rotate, fail, or are queried out of context.',
      },
    ],
    status: 'wip',
    featured: false,
    tags: ['Java 17', 'Spring Boot 3', 'PostgreSQL', 'FastAPI', 'Redis', 'Tesseract OCR'],
    image: '/projects/taxbridge.webp',
  },
];

// FORBIDDEN in any field:
//   Self-reported ROI/accuracy claims · Betting references · First-person language
