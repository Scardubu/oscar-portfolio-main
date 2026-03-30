import type { Project } from '@/components/ProjectCard';

/**
 * Project data — structured as hiring artifacts.
 * Each entry answers: what was built, what constraints mattered,
 * what was rejected explicitly, where the evidence lives.
 *
 * B06 fix: No self-reported ROI percentages or betting yield claims anywhere.
 * Decisions use verbatim language from Phase 2 brief.
 */
export const projects: Project[] = [
  {
    id: 'sabiscore',
    name: 'SabiScore',
    category: 'Sports Intelligence Platform',
    status: 'live',
    featured: true,
    wide: true,
    claim:
      'A production AI product designed to keep fast decisions legible during live sports windows. Ensemble inference, Redis-cached predictions, real-time frontend — one engineer, full ownership.',
    stack: [
      'Python',
      'FastAPI',
      'XGBoost',
      'LightGBM',
      'scikit-learn',
      'Redis',
      'PostgreSQL',
      'Docker',
      'Next.js',
      'React',
    ],
    context:
      'Sports prediction products usually fail in the same place: they expose too much raw signal, rely on fragile data providers, and become hard to trust the moment traffic or uncertainty rises. The constraint was building something legible and reliable under those exact conditions — from Nigeria, on commodity infrastructure.',
    problem:
      'Peak match windows produce request bursts that overwhelm naive database queries. A Postgres query path that performs acceptably at 20 concurrent users degrades sharply at 200. Compounding this: inference latency on the full ensemble is 280–400ms, incompatible with sub-200ms UX expectations during live events.',
    approach:
      'Ingestion, inference, and product surface built as a single system with explicit failure modes at every boundary. Fallback-aware data pipelines, Redis caching on the hot prediction path, clear confidence framing in the UI, ensemble meta-learning over single-model to reduce overfit on narrow historical windows.',
    decisions: [
      {
        chosen: 'Ensemble meta-learner (XGBoost + LightGBM + scikit-learn stacked)',
        rejected: 'Single XGBoost model',
        reason:
          'Backtesting showed +6.3pp accuracy gain at acceptable inference latency for the confidence threshold in use.',
      },
      {
        chosen: 'Redis caching layer on prediction hot path',
        rejected: 'Direct Postgres query per request',
        reason:
          'Postgres query latency exceeded 200ms during peak match windows. Cache hit rate eliminated latency spikes without infrastructure scaling.',
      },
      {
        chosen: 'Embedding-based retrieval for similar-match context',
        rejected: 'Rule-based prediction heuristics',
        reason:
          'Insufficient generalization across leagues — rules captured recency bias, not structural match patterns.',
      },
      {
        chosen: 'FastAPI + self-hosted Docker inference',
        rejected: 'GPT-based inference API',
        reason:
          'Cost-per-call incompatible with free-tier user economics at target prediction volume.',
      },
    ],
    outcome:
      'System designed for repeated live-decision sessions during high-traffic match windows. Redis-backed delivery keeps the prediction path responsive, and ownership spans feature engineering through production inference through UI.',
    links: {
      demo: 'https://sabiscore.vercel.app',
      github: 'https://github.com/Scardubu/sabiscore',
    },
  },

  {
    id: 'hashablanca',
    name: 'Hashablanca',
    category: 'Blockchain Data Transfer',
    status: 'wip',
    featured: false,
    claim:
      'Multi-chain encrypted data transfer with zero-knowledge proof architecture. Sensitive data never touches an intermediary in plaintext.',
    stack: ['TypeScript', 'Node.js', 'Solidity', 'ZK-SNARKs', 'IPFS', 'Ethereum', 'Polygon'],
    context:
      'On-chain data transfer solutions typically force a tradeoff: data is visible to validators (trust-based), or encryption is bolted on at the application layer without formal proof guarantees. Hashablanca closes that gap using ZK proofs at the transfer layer itself.',
    problem:
      'Proving data integrity without revealing the data — across chains with different proof verification costs — without requiring trusted setup assumptions that are operationally brittle.',
    approach:
      'ZK-SNARK proofs generated client-side before submission. IPFS content addressing for encrypted payload storage. Multi-chain adapter layer abstracts verification cost differences between Ethereum L1 and Polygon.',
    decisions: [
      {
        chosen: 'ZK-SNARKs (Groth16) for proof generation',
        rejected: 'STARK-based proofs',
        reason:
          'Groth16 proof size is significantly smaller, reducing on-chain verification gas cost — critical for L1 deployments.',
      },
      {
        chosen: 'IPFS for encrypted payload storage',
        rejected: 'On-chain data storage',
        reason:
          'Gas cost of on-chain storage is prohibitive for payloads above ~32 bytes. IPFS content addressing preserves integrity guarantees without the cost.',
      },
    ],
    outcome:
      'Proof generation pipeline end-to-end. Multi-chain adapter tested across Goerli and Mumbai testnets. Production deployment pending audit.',
    links: {
      github: 'https://github.com/Scardubu/hashablanca',
    },
  },

  {
    id: 'ml-consulting',
    name: 'ML Debugging Tooling & LLM Integration',
    category: 'Technical Consulting',
    status: 'live',
    featured: false,
    claim:
      'ML debugging tools and LLM integration work for teams that need technical model behavior translated to business-readable form. Covers the observability gaps standard monitoring misses.',
    stack: [
      'Python',
      'FastAPI',
      'LangChain',
      'OpenAI',
      'Anthropic',
      'PostgreSQL',
      'Redis',
      'TypeScript',
    ],
    context:
      'Teams integrating LLMs consistently hit the same wall: standard application monitoring does not surface the failure modes that matter — prompt drift, context window saturation, embedding retrieval degradation, confidence calibration gaps. The symptom appears in user behavior, not error logs.',
    problem:
      'Diagnosing non-deterministic model behavior at the integration layer requires tooling that does not exist in standard APM stacks. Engineers end up doing ad-hoc inspection in notebooks after the fact.',
    approach:
      'Purpose-built observability layer: structured prompt/response logging with diff tracking, confidence score distribution monitoring, embedding similarity drift detection, and business-readable anomaly surfacing. Deployed as a sidecar to existing LLM integration points.',
    decisions: [
      {
        chosen: 'Structured logging with semantic diff tracking',
        rejected: 'Raw request/response logging',
        reason:
          'Raw logs grow fast and produce no signal. Semantic diffs surface the changes that actually affect model behavior.',
      },
      {
        chosen: 'Business-readable anomaly layer above raw metrics',
        rejected: 'Exposing raw perplexity / logprob scores to stakeholders',
        reason:
          'Technical scores without context cause decision paralysis. Translation to business impact produces action.',
      },
    ],
    outcome:
      'Deployed for multiple teams. Mean time to LLM integration issue diagnosis reduced from days to hours. Pattern library of common LLM integration failure modes used as onboarding reference.',
    links: {},
  },
];
