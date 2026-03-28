export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export interface HeroMetric {
  title: string;
  value: string;
  detail: string;
  pulse?: boolean;
}

export interface StoryCard {
  eyebrow: string;
  title: string;
  body: string;
  evidence?: string;
}

export interface WorkProject {
  slug: string;
  title: string;
  category: string;
  oneLiner: string;
  summary: string;
  context: string;
  problem: string;
  approach: string;
  decisions: Array<{
    label: string;
    detail: string;
  }>;
  outcome: string;
  evidenceSummary: string;
  liveUrl: string;
  repoUrl: string;
  stack: string[];
}

export const homeNavigation: NavItem[] = [
  { id: 'work', label: 'Work', href: '#work' },
  { id: 'skills', label: 'Skills', href: '#skills' },
  { id: 'experience', label: 'Exp', href: '#experience' },
  { id: 'contact', label: 'Contact', href: '#contact' },
];

export const heroCopy = {
  badge: 'Nigeria NG · Remote-First',
  headline: "Hey, I'm Oscar 👋",
  position:
    'I engineer production AI systems that turn complex intelligence into tools people trust and actually use.',
  bio: 'My flagship sports intelligence platform SabiScore delivers real-time insights that help enthusiasts make sharper, better-informed decisions — running 24/7 with proven reliability across high-traffic events. With 4+ years shipping scalable ML systems from Nigeria to global audiences, I specialize in bridging frontier research and intentional design — building AI experiences that hold up under real-world conditions.',
  proofTitle:
    'The engineer you hire when product clarity, platform reliability, and AI behavior all have to hold at the same time.',
  proofBody:
    'The strongest signal here is not a claim. It is the combination of shipped work, explicit tradeoffs, and an interface disciplined enough to explain the work without asking for trust first.',
  ctaPrimary: 'See My Work →',
  ctaSecondary: 'Open to Staff / Senior ML · Full-Stack · Consulting',
  contactEmail: 'scardubu@gmail.com',
} as const;

export const heroMetrics: HeroMetric[] = [
  {
    value: 'Real-World Reach',
    title: 'Production systems, live users',
    detail:
      'Working software with public surfaces, real traffic, and observable operating constraints.',
  },
  {
    value: 'Precision AI',
    title: 'Embedding-based, not rule-based',
    detail:
      'Retrieval, ranking, and model behavior framed around coherence under edge cases instead of brittle heuristics.',
  },
  {
    value: 'Always On',
    title: '24/7 across high-traffic windows',
    detail:
      'Health checks, graceful fallback paths, and environment-scoped guardrails keep the surface usable when pressure rises.',
  },
  {
    value: '4+ Years',
    title: 'Shipping ML at production scale',
    detail:
      'End-to-end ownership across data, inference, interface, deployment, and operating feedback loops.',
    pulse: true,
  },
];

export const positioning = {
  oneLine:
    'Oscar Ndugbu is the engineer you hire when AI behavior, product clarity, and platform reliability have to work as one system.',
  expanded: [
    'His strongest work sits where model output meets user judgment: systems that need dependable data flow, legible interfaces, and explicit operational choices.',
    'The portfolio is designed to make ownership obvious. Every claim is tied to shipped work, every section reduces a hiring doubt, and the writing stays close to architecture rather than performance.',
  ],
  strengths: [
    'Frames AI work around decisions users and operators actually have to make.',
    'Builds full-stack systems where backend reliability and interface clarity reinforce each other.',
    'Communicates tradeoffs in a way recruiters, hiring managers, and technical reviewers can all forward accurately.',
  ],
  diff: 'He is building and shipping from Nigeria into global, production-facing contexts while treating interface quality as part of system design rather than decoration. That combination of context, technical range, and editorial restraint is difficult to fake and harder to copy.',
} as const;

export const workProjects: WorkProject[] = [
  {
    slug: 'sabiscore',
    title: 'SabiScore',
    category: 'Sports intelligence platform',
    oneLiner:
      'A production AI product designed to keep fast decisions legible during live sports windows.',
    summary:
      'SabiScore combines data ingestion, model serving, ranking logic, and a consumer-facing surface into one operating system for live sports intelligence.',
    context:
      'Sports prediction products usually fail in the same place: they expose too much raw signal, rely on fragile data providers, and become hard to trust the moment traffic or uncertainty rises.',
    problem:
      'The core challenge was not just prediction quality. It was packaging live intelligence into an experience that stayed calm, credible, and readable while events were unfolding.',
    approach:
      'The ingestion, inference, and product surface were designed as a single system: fallback-aware data pipelines, clear confidence framing, and UI choices that keep the product usable under time pressure.',
    decisions: [
      {
        label: 'Rejected raw probability-heavy presentation',
        detail:
          'The product needed decision support, not a dashboard full of numerically dense model output. The shipped surface privileges context, confidence framing, and readable primary actions.',
      },
      {
        label: 'Rejected single-provider dependency',
        detail:
          'Live sports data fails in uneven ways. Provider abstraction, checks, and fallback handling were treated as product requirements, not backend niceties.',
      },
    ],
    outcome:
      'The result reads like a product, not a model demo: dependable during busy match windows, clearer for repeat users, and easier to maintain because the operating assumptions are explicit.',
    evidenceSummary: 'Live product and public repository available.',
    liveUrl: 'https://sabiscore.vercel.app',
    repoUrl: 'https://github.com/Scardubu/sabiscore',
    stack: ['Next.js 15', 'FastAPI', 'Python', 'PostgreSQL', 'Redis', 'Docker'],
  },
  {
    slug: 'oscar-portfolio',
    title: 'Oscar Portfolio Platform',
    category: 'Hiring surface and content system',
    oneLiner:
      'A recruiter-facing product surface built to prove technical judgment before any conversation starts.',
    summary:
      'This site is treated as a product artifact: App Router architecture, dynamic OG generation, structured content, motion with fallbacks, and a design system calibrated around credibility.',
    context:
      'Most engineering portfolios ask viewers to infer competence from style. That creates friction for recruiters and ambiguity for hiring committees.',
    problem:
      'The objective was to build a surface that answers the real screening questions quickly: what has shipped, what the engineer owns, and whether the writing matches the code.',
    approach:
      'I rebuilt the information architecture around hiring doubts, converted projects into decision artifacts, used restrained motion, and kept every strong statement tied to evidence that can be opened immediately.',
    decisions: [
      {
        label: 'Rejected decorative motion',
        detail:
          'Animation is used only to reveal hierarchy, depth, or current activity. Reduced-motion fallbacks remove non-essential movement without breaking understanding.',
      },
      {
        label: 'Rejected inflated metrics as proof',
        detail:
          'The surface uses qualitative outcomes, route-level case studies, and public links instead of unverifiable percentages or portfolio filler.',
      },
    ],
    outcome:
      'The page now behaves like a hiring artifact: scannable in seconds, shareable in one sentence, and detailed enough for technical review without requiring outside explanation.',
    evidenceSummary: 'Live site and repository available.',
    liveUrl: 'https://scardubu.dev',
    repoUrl: 'https://github.com/Scardubu/oscar-portfolio',
    stack: ['Next.js 15', 'TypeScript', 'Tailwind CSS 4', 'Framer Motion', '@vercel/og'],
  },
];

export const experienceCards: StoryCard[] = [
  {
    eyebrow: 'What I have owned',
    title: 'Platform, model, and interface decisions in the same delivery loop.',
    body: 'SabiScore required full-stack ownership: ingestion logic, inference pathways, frontend delivery, and the operating decisions that keep the surface understandable while the system is live.',
    evidence: 'Visible in the shipped product, repository history, and case study detail.',
  },
  {
    eyebrow: 'How I work',
    title: 'Architecture language first, implementation detail second.',
    body: 'I frame work in terms of constraints, failure modes, and handoff quality. That makes the eventual code easier to build, easier to explain, and easier to operate with other teams.',
    evidence: 'Visible in the project cards, route-level work pages, and production-oriented copy.',
  },
  {
    eyebrow: 'Why teams respond',
    title: 'The work is easy to brief without translation.',
    body: 'Recruiters get a clear role fit, hiring managers get visible systems judgment, and technical reviewers can inspect links without uncovering contradictions between the story and the implementation.',
    evidence: 'This portfolio is intentionally structured around that handoff.',
  },
];

export const thinkingCards: StoryCard[] = [
  {
    eyebrow: 'How I think',
    title: 'Good AI products reduce uncertainty instead of exporting it to the user.',
    body: 'The model is only part of the system. Reliability, framing, and interface decisions determine whether intelligence is usable when someone needs to act.',
  },
  {
    eyebrow: 'Tradeoff discipline',
    title: 'Restraint is usually the quality signal.',
    body: 'When removing a section, number, or animation makes the page clearer, it should go. The same rule applies to product systems: less noise, stronger judgment.',
  },
  {
    eyebrow: 'Global context',
    title: 'Built from Nigeria for teams that care about execution, not geography theater.',
    body: 'The differentiator is not the location itself. It is the pattern of decisions made under real constraints and still delivered at a level global teams can evaluate without context setting.',
  },
];

export const contactCopy = {
  title: "Let's build something real",
  body: 'Best-fit conversations involve Staff or Senior ML roles, full-stack AI product work, and consulting engagements where architecture and interface quality both matter from the first week.',
  shareLine:
    'Shareable sentence: Oscar is a production AI engineer with systems judgment, interface restraint, and clear ownership across the stack.',
} as const;

export const liveActivityFallback = {
  label: 'Active',
  dateLabel: 'Updated recently',
};
