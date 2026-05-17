/**
 * portfolio-data.ts — CONVICTION ENGINE v27.0
 * ─────────────────────────────────────────────────────────────────────────────
 * Single source of truth for profile-level portfolio content.
 *
 * SCOPE: This file owns PROFILE, HERO copy, TESTIMONIALS, LIVE_METRICS, and
 * ACTIVITY_FEED. It does NOT own project data (→ lib/projects.ts) or
 * skill matrix data (→ lib/data/skills.ts). Import from those files directly.
 *
 * v27 SYNC:
 *   • PROFILE added — PROFILE.locationDisplay = "Lagos, Nigeria 🇳🇬" per spec.
 *   • HERO: updated to match HeroSection.tsx v21 live copy exactly.
 *     location, availability, CTA labels synced to spec.
 *   • HERO_METRICS: updated to match CONVICTION_STATS in HeroSection.tsx.
 *   • PROJECTS: removed — stale. Import from lib/projects.ts.
 *   • SKILLS: removed — stale. Import from lib/data/skills.ts.
 *   • TESTIMONIALS: synced to app/lib/constants.ts canonical testimonials
 *     (4 named clients: BALL 247, Trovotech, Legum, TradeBuza).
 *   • LIVE_METRICS, ACTIVITY_FEED: updated values to match production metrics.
 *   • SOCIAL: urls verified against live accounts.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import { CONTACT_EMAIL, CV_ASSET_PATH, anchorUrl } from '@/lib/config';

// ── Profile ───────────────────────────────────────────────────────────────────
// G.7 Location rule: PROFILE.locationDisplay must be "Lagos, Nigeria 🇳🇬"

export const PROFILE = {
  name:            'Oscar Ndugbu',
  handle:          'Scardubu',
  locationDisplay: 'Lagos, Nigeria 🇳🇬',
  locationShort:   'Lagos',
  role:            'Staff+ Full-Stack · Infra · ML Engineer',
  email:           CONTACT_EMAIL,
  github:          'https://github.com/Scardubu',
  linkedin:        'https://linkedin.com/in/oscardubu',
  site:            'https://scardubu.dev',
  cvPath:          '/cv/oscar-ndugbu-resume.pdf',
} as const;

// ── Hero ──────────────────────────────────────────────────────────────────────
// Synced to HeroSection.tsx v21 live copy (the canonical rendered source).
// Components should consume HeroSection.tsx directly; this is a reference mirror.

export const HERO = {
  name:         'Oscar Ndugbu',
  title:        'Staff+ Full-Stack · Infra · ML',
  kicker:       'Full-Stack · React Native · Next.js 15 · AI Systems',
  h1:           'The system has to work at 2am.',
  subHeadline:  "That's not a slogan. It's a design constraint.",
  body:         'Production systems that stay alive when it matters most — compliant, fast, and relentlessly reliable.',
  availability: 'AVAILABLE · STAFF+ ROLES',
  location:     'Lagos, Nigeria 🇳🇬',
  trustStrip:   'Shipped in Lagos · Running globally · Battle-tested in audit season',
  cta: {
    // anchorUrl() returns root-relative '/#section-contact' — correct for Next.js
    // <Link> same-page navigation. mailto: was removed: the contact form is the
    // designed conversion endpoint; a mailto cold-open bypasses it entirely.
    primary:   { label: 'Start a conversation', href: anchorUrl('section-contact') },
    secondary: { label: 'View Projects',        href: anchorUrl('section-projects') },
    cv:        { label: 'Download CV',          href: CV_ASSET_PATH },
  },
} as const;

// ── Hero / Conviction Metrics ─────────────────────────────────────────────────
// Synced to CONVICTION_STATS in HeroSection.tsx.

export const CONVICTION_STATS = [
  { value: '4h → 15min', label: 'Filing time',   stat: 'filing'  },
  { value: '99.9%+',     label: '90-day uptime', stat: 'uptime'  },
  { value: 'sub-150ms',  label: 'API p99',       stat: 'latency' },
  { value: '45% MTTD',   label: 'Improvement',   stat: 'mttd'    },
] as const;

// ── Testimonials ──────────────────────────────────────────────────────────────
// 4 named clients. Synced from app/lib/constants.ts (canonical quote source).
// Render in: testimonials strip (between Projects and OSS) or About section.

export interface Testimonial {
  readonly id:      string;
  readonly quote:   string;
  readonly name:    string;
  readonly title:   string;
  readonly company: string;
  readonly initials: string;
  readonly accent:  string;
  readonly rating:  5;
}

export const TESTIMONIALS: readonly Testimonial[] = [
  {
    id:       'tobi-omokore',
    quote:    "Oscar's ensemble model improved our prediction accuracy by 23% in production. His deployment expertise and attention to monitoring ensured smooth rollout with zero downtime.",
    name:     'Tobi Omokore',
    title:    'CTO',
    company:  'BALL 247',
    initials: 'TO',
    accent:   'var(--color-film-teal)',
    rating:   5,
  },
  {
    id:       'amina-hassan',
    quote:    "Working with Oscar was a game-changer. He didn't just build a model — he delivered a complete ML system with monitoring, retraining pipelines, and comprehensive documentation.",
    name:     'Amina Hassan',
    title:    'Head of Engineering',
    company:  'Trovotech Ltd',
    initials: 'AH',
    accent:   'oklch(72% 0.17 160)',
    rating:   5,
  },
  {
    id:       'chioma-iheagwara',
    quote:    "Reduced our document processing time from 8 hours to 45 minutes with Oscar's NLP solution. The model is still running flawlessly in production 8 months later.",
    name:     'Chioma Iheagwara',
    title:    'Product Manager',
    company:  'Legum Solutions',
    initials: 'CI',
    accent:   'oklch(75% 0.16 300)',
    rating:   5,
  },
  {
    id:       'egundeyi-olamide',
    quote:    "Oscar's ability to translate complex ML concepts into practical business solutions is exceptional. He's equally comfortable discussing model architecture and user experience.",
    name:     'Egundeyi Olamide',
    title:    'AI Research Lead',
    company:  'TradeBuza',
    initials: 'EO',
    accent:   'oklch(73% 0.17 65)',
    rating:   5,
  },
] as const;

// ── Live Metrics ──────────────────────────────────────────────────────────────
// Values from Prometheus / Vercel Analytics — update after each deploy.

export const LIVE_METRICS = {
  uptime:       '99.9%+',
  uptimeTarget: '≥99.9%',
  p99Latency:   'sub-150ms',
  mttdImprove:  '45%',
  testCoverage: '95%',
  bundleTarget: '< 300 KB',
} as const;

// ── Activity Feed ─────────────────────────────────────────────────────────────

export const ACTIVITY_FEED = [
  { id: 'a1', event: 'SabiScore prediction model retrained',         time: '2h ago',  type: 'ml'      as const },
  { id: 'a2', event: 'TaxBridge: zero data-loss audit cycle passed', time: '6h ago',  type: 'infra'   as const },
  { id: 'a3', event: 'Portfolio Lighthouse score: 99/100',           time: '1d ago',  type: 'perf'    as const },
  { id: 'a4', event: 'SwarmXQ evolution cycle — 3 agents upgraded',  time: '2d ago',  type: 'ml'      as const },
  { id: 'a5', event: 'NRS compliance validation: TaxBridge passing', time: '3d ago',  type: 'shipped' as const },
  { id: 'a6', event: 'XGBoost + LightGBM ensemble v3.2 deployed',   time: '5d ago',  type: 'ml'      as const },
  { id: 'a7', event: 'Portfolio v27 deployed — About section update', time: '1w ago',  type: 'shipped' as const },
] as const;

// ── Social Links ──────────────────────────────────────────────────────────────

export const SOCIAL = {
  github:   'https://github.com/Scardubu',
  linkedin: 'https://linkedin.com/in/oscardubu',
  email:    `mailto:${CONTACT_EMAIL}`,
  site:     'https://scardubu.dev',
} as const;