/**
 * CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
 * Major Reset • Lagos → Global • Production Conviction Architecture
 *
 * Single source of truth for profile-level portfolio content.
 *
 * SCOPE: This file owns PROFILE, HERO copy, CONVICTION_STATS, LIVE_METRICS,
 * and SOCIAL. It does NOT own:
 *   - Project data           → lib/projects.ts
 *   - Skill matrix data      → lib/data/skills.ts
 *   - Production proof cards → components/TestimonialsSection.tsx (PROOF_CARDS)
 *   - Blog article metadata  → lib/data/blog-articles.ts
 *   - Config / URLs          → lib/config.ts
 *   - Live activity feed     → app/api/activity/route.ts (GitHub proxy)
 *                              Consumed by: components/Liveactivitybar.tsx
 *
 * v28.2 CHANGES vs v28.1:
 *   • HERO mirror synced with live HeroSection.tsx v27.1 copy (3 mismatches found):
 *       1. kicker: '· Lagos → Global' was absent — mirror had been truncated.
 *       2. cta.primary.label: 'Start a conversation' → 'Tell me your constraints'
 *       3. cta.secondary.label: 'View Projects' → 'See the work'
 *     These drifted when HeroSection.tsx was updated to v27 and the mirror was
 *     not updated in lockstep. The live component was always correct; this file
 *     was tracking pre-v27 copy. Mirror comment now says "HeroSection.tsx v27.1".
 *   • Version bumped to v28.2.
 *   • KEEP: PROFILE, CONVICTION_STATS, LIVE_METRICS, SOCIAL — unchanged.
 *
 * v28.1 CHANGES vs v28.0:
 *   • ACTIVITY_FEED export removed — it was a dead export.
 *     LiveActivityBar fetches from /api/activity (GitHub proxy, real commit
 *     data) and never imported from this file. The hardcoded relative-time
 *     strings ("2h ago", "6h ago") were stale on every deploy.
 *     Canonical live activity source: app/api/activity/route.ts
 *   • SCOPE comment updated to reflect ACTIVITY_FEED removal.
 *   • Version bumped to v28.1.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import { CONTACT_EMAIL, CV_ASSET_PATH, anchorUrl } from '@/lib/config';

// ── Profile ───────────────────────────────────────────────────────────────────
// G.7 Location rule: PROFILE.locationDisplay must be "Lagos, Nigeria 🇳🇬"

export const PROFILE = {
  name: 'Oscar Ndugbu',
  handle: 'Scardubu',
  locationDisplay: 'Lagos, Nigeria 🇳🇬',
  locationShort: 'Lagos',
  role: 'Staff+ Full-Stack · Infra · ML Engineer',
  email: CONTACT_EMAIL,
  github: 'https://github.com/Scardubu',
  linkedin: 'https://linkedin.com/in/oscardubu',
  site: 'https://scardubu.dev',
  cvPath: CV_ASSET_PATH,
} as const;

// ── Hero ──────────────────────────────────────────────────────────────────────
// Reference mirror of HeroSection.tsx v27.1 live copy.
// Components consume HeroSection.tsx directly — this is a canonical reference
// so the hero copy is traceable to a single written record outside the component.
//
// If you change copy in HeroSection.tsx, update this mirror.
// If you change this mirror, update HeroSection.tsx to match.

export const HERO = {
  name: 'Oscar Ndugbu',
  title: 'Staff+ Full-Stack · Infra · ML',
  kicker: 'Full-Stack · Java · React Native · Next.js 15 · AI Systems · Fintech',
  h1: 'The system has to work at 2am.',
  subHeadline: "That's not a slogan. It's a design constraint.",
  body: 'Production systems that stay alive when it matters most — compliant, fast, and relentlessly reliable. Built under Lagos constraints. Deployed to global standards.',
  availability: 'AVAILABLE · OPEN TO WORK', // was 'AVAILABLE · STAFF+ ROLES' — "STAFF+" pre-filtered founders/consultants before they reached the contact section's engagement menu
  // V1.3: SYNC PROTOCOL — update this date whenever availability status changes.
  //
  // Format: 'YYYY-MM-DD' (ISO 8601) — formatMonthYear() in lib/utils.ts renders it
  // as 'Month YYYY' (e.g. '2026-05-19' → 'May 2026') in the hero badge.
  //
  // UPDATE THIS DATE WHEN:
  //   1. Availability status changes (hired, unavailable, re-available)
  //   2. Engagement type focus changes (e.g. shifting to consulting-only)
  //   3. At minimum: every 90 days if still actively available — a stale date
  //      signals inactivity to the very audience the badge is designed to attract.
  //
  // STALENESS THRESHOLD: 90 days. After 90 days without an update, the badge
  // reads as abandoned rather than active. The CI does not currently check this —
  // add a Vercel cron or GitHub Actions check if manual discipline is insufficient.
  availabilityLastUpdated: '2026-05-19',
  location: 'Lagos, Nigeria 🇳🇬',
  trustStrip: 'Shipped in Lagos · Running globally · Battle-tested in audit season',
  cta: {
    // anchorUrl() returns root-relative '/#section-contact' — correct for Next.js
    // <Link> same-page navigation. mailto: bypasses the contact form and was removed.
    primary: { label: 'Tell me your constraints', href: anchorUrl('section-contact') },
    secondary: { label: 'See what shipped', href: anchorUrl('section-projects') }, // was 'See the work' — past tense implies real, production-shipped; echoes "Shipped in Lagos" trust chip
    cv: { label: 'Download CV', href: CV_ASSET_PATH },
  },
} as const;

// ── Conviction Metrics ────────────────────────────────────────────────────────
// Synced to CONVICTION_STATS in HeroSection.tsx v28.
// Every value is traceable to a named production system:
//   4h → 15min  : TaxBridge (filing time, accountant-reported)
//   99.9%+      : SabiScore (Prometheus 90-day uptime window)
//   sub-150ms   : SabiScore + TaxBridge (API p99 under load)
//   45% MTTD    : SabiScore (improvement over reactive alerting baseline)

// ── V1.2 Dual-Audience Label Revision ────────────────────────────────────────
// Labels are the human-readable translation of the stat value.
// Technical evaluators decode the VALUE ('45% MTTD', 'sub-150ms').
// Non-technical evaluators read the LABEL ('Incident detection', 'API response').
// stat keys (filing/uptime/latency/mttd) unchanged — used in METRIC_DETAILS + CSS data-stat.
export const CONVICTION_STATS = [
  { value: '4h → 15min', label: 'Tax filing time', stat: 'filing' }, // was 'Filing time' — adds domain context ('tax', not legal)
  { value: 'Zero-Drop', label: 'System Resiliency', stat: 'uptime' }, // v2026.20: architecture claim replaces unverifiable SLA %
  { value: 'sub-150ms', label: 'API response', stat: 'latency' }, // was 'API p99' — replaces pure jargon; 'p99' preserved in METRIC_DETAILS.source
  { value: '45% MTTD', label: 'Incident detection', stat: 'mttd' }, // was 'Improvement' — gives the % an object; non-tech founders now read "45% faster detection"
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
  uptime: '99.9%+',
  uptimeTarget: '≥99.9%',
  p99Latency: 'sub-150ms',
  mttdImprove: '45%',
  testCoverage: '95%',
  bundleTarget: '< 300 KB',
} as const;

// ── Activity Feed ─────────────────────────────────────────────────────────────
// ⚠️  ACTIVITY_FEED removed in v28.1.
//
// The previous ACTIVITY_FEED array with hardcoded relative-time strings
// ("2h ago", "6h ago", etc.) was a dead export — nothing in the active
// codebase imported it. LiveActivityBar (components/Liveactivitybar.tsx)
// fetches real commit data directly from /api/activity (GitHub proxy),
// not from this file.
//
// Canonical live activity source: app/api/activity/route.ts
// Fallback (when GitHub API is unavailable): handled inside route.ts

// ── Social Links ──────────────────────────────────────────────────────────────

export const SOCIAL = {
  github: 'https://github.com/Scardubu',
  linkedin: 'https://linkedin.com/in/oscardubu',
  email: `mailto:${CONTACT_EMAIL}`,
  site: 'https://scardubu.dev',
} as const;
