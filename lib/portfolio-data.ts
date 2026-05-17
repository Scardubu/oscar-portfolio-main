/**
 * portfolio-data.ts — CONVICTION ENGINE v28.0
 * ─────────────────────────────────────────────────────────────────────────────
 * Single source of truth for profile-level portfolio content.
 *
 * SCOPE: This file owns PROFILE, HERO copy, CONVICTION_STATS, LIVE_METRICS,
 * ACTIVITY_FEED, and SOCIAL. It does NOT own:
 *   - Project data           → lib/projects.ts
 *   - Skill matrix data      → lib/data/skills.ts
 *   - Production proof cards → components/TestimonialsSection.tsx (PROOF_CARDS)
 *   - Blog article metadata  → lib/data/blog-articles.ts
 *   - Config / URLs          → lib/config.ts
 *
 * v28 CHANGES vs v27:
 *   • TESTIMONIALS export removed — unverifiable named quotes replaced by
 *     PROOF_CARDS in TestimonialsSection.tsx (verified system outcomes only).
 *   • ACTIVITY_FEED a7 updated: "Portfolio v28 deployed — data layer cleanup"
 *   • SCOPE comment corrected: removed stale reference to app/lib/constants.ts
 *     (that file does not exist in the current codebase).
 *   • Version bumped to v28.0.
 *   • KEEP: PROFILE, HERO, CONVICTION_STATS, LIVE_METRICS, SOCIAL — unchanged.
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
  cvPath:          CV_ASSET_PATH,
} as const;

// ── Hero ──────────────────────────────────────────────────────────────────────
// Reference mirror of HeroSection.tsx v26 live copy.
// Components consume HeroSection.tsx directly — this is a canonical reference
// so the hero copy is traceable to a single written record outside the component.
//
// If you change copy in HeroSection.tsx, update this mirror.
// If you change this mirror, update HeroSection.tsx to match.

export const HERO = {
  name:         'Oscar Ndugbu',
  title:        'Staff+ Full-Stack · Infra · ML',
  kicker:       'Full-Stack · React Native · Next.js 15 · AI Systems',
  h1:           'The system has to work at 2am.',
  subHeadline:  "That's not a slogan. It's a design constraint.",
  body:         'Production systems that stay alive when it matters most — compliant, fast, and relentlessly reliable. Built under Lagos constraints. Deployed to global standards.',
  availability: 'AVAILABLE · STAFF+ ROLES',
  location:     'Lagos, Nigeria 🇳🇬',
  trustStrip:   'Shipped in Lagos · Running globally · Battle-tested in audit season',
  cta: {
    // anchorUrl() returns root-relative '/#section-contact' — correct for Next.js
    // <Link> same-page navigation. mailto: bypasses the contact form and was removed.
    primary:   { label: 'Start a conversation', href: anchorUrl('section-contact') },
    secondary: { label: 'View Projects',        href: anchorUrl('section-projects') },
    cv:        { label: 'Download CV',          href: CV_ASSET_PATH },
  },
} as const;

// ── Conviction Metrics ────────────────────────────────────────────────────────
// Synced to CONVICTION_STATS in HeroSection.tsx v26.
// Every value is traceable to a named production system:
//   4h → 15min  : TaxBridge (filing time, accountant-reported)
//   99.9%+      : SabiScore (Prometheus 90-day uptime window)
//   sub-150ms   : SabiScore + TaxBridge (API p99 under load)
//   45% MTTD    : SabiScore (improvement over reactive alerting baseline)

export const CONVICTION_STATS = [
  { value: '4h → 15min', label: 'Filing time',   stat: 'filing'  },
  { value: '99.9%+',     label: '90-day uptime', stat: 'uptime'  },
  { value: 'sub-150ms',  label: 'API p99',       stat: 'latency' },
  { value: '45% MTTD',   label: 'Improvement',   stat: 'mttd'    },
] as const;

// ── Testimonials ──────────────────────────────────────────────────────────────
// ⚠️  Named testimonials removed in v28.0.
//
// The previous TESTIMONIALS array contained quotes from named companies that
// could not be independently verified before rendering. The verification gap
// was caught and closed in TestimonialsSection.tsx v2.0, which replaced the
// section with PROOF_CARDS — verified system outcomes with traceable metrics.
//
// Canonical proof layer:
//   components/TestimonialsSection.tsx → PROOF_CARDS
//   (TaxBridge · SabiScore · SwarmXQ · UBEC — traceable to lib/projects.ts)
//
// Do not re-add named testimonials without explicit written client consent
// and an independently verifiable company reference.

// ── Live Metrics ──────────────────────────────────────────────────────────────
// Source: Prometheus (uptime, MTTD, latency) + test runner (coverage).
// Update after each deploy or retraining cycle.

export const LIVE_METRICS = {
  uptime:       '99.9%+',
  uptimeTarget: '≥99.9%',
  p99Latency:   'sub-150ms',
  mttdImprove:  '45%',
  testCoverage: '95%',
  bundleTarget: '< 300 KB',
} as const;

// ── Activity Feed ─────────────────────────────────────────────────────────────
// Recent engineering activity across live systems.
// Update timestamps and events after each significant deploy or model cycle.

export const ACTIVITY_FEED = [
  { id: 'a1', event: 'SabiScore prediction model retrained',            time: '2h ago',  type: 'ml'      as const },
  { id: 'a2', event: 'TaxBridge: zero data-loss audit cycle passed',    time: '6h ago',  type: 'infra'   as const },
  { id: 'a3', event: 'Portfolio Lighthouse score: 99/100',              time: '1d ago',  type: 'perf'    as const },
  { id: 'a4', event: 'SwarmXQ evolution cycle — 3 agents upgraded',     time: '2d ago',  type: 'ml'      as const },
  { id: 'a5', event: 'NRS compliance validation: TaxBridge passing',    time: '3d ago',  type: 'shipped' as const },
  { id: 'a6', event: 'XGBoost + LightGBM ensemble v3.2 deployed',      time: '5d ago',  type: 'ml'      as const },
  { id: 'a7', event: 'Portfolio v28 deployed — data layer cleanup',     time: '1w ago',  type: 'shipped' as const },
] as const;

// ── Social Links ──────────────────────────────────────────────────────────────

export const SOCIAL = {
  github:   'https://github.com/Scardubu',
  linkedin: 'https://linkedin.com/in/oscardubu',
  email:    `mailto:${CONTACT_EMAIL}`,
  site:     'https://scardubu.dev',
} as const;