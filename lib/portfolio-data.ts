/**
 * CONVICTION ENGINE — canonical profile-level portfolio content.
 *
 * This module owns public identity, hero copy, conviction stats, live metrics,
 * and social links. Project-specific content remains in lib/projects.ts.
 */
import { CONTACT_EMAIL, CV_ASSET_PATH, anchorUrl } from '@/lib/config';

export const PROFILE = {
  name: 'Oscar Ndugbu',
  handle: 'Scardubu',
  locationDisplay: 'Lagos, Nigeria 🇳🇬',
  locationShort: 'Lagos',
  role: 'Staff Backend and Platform Engineer',
  email: CONTACT_EMAIL,
  github: 'https://github.com/Scardubu',
  linkedin: 'https://linkedin.com/in/oscardubu',
  site: 'https://scardubu.dev',
  cvPath: CV_ASSET_PATH,
} as const;

export const HERO = {
  name: 'Oscar Ndugbu',
  title: 'Staff Backend and Platform Engineer',
  kicker: 'Staff Backend and Platform Engineer',
  h1: 'The system has to work at 2am.',
  subHeadline: "That's not a slogan. It's a design constraint.",
  body: 'Reliability-first AI, financial, and platform systems built for audit season, compliance pressure, and real incidents. Lagos constraints. Global standards.',
  availability: 'AVAILABLE · OPEN TO WORK',
  availabilityLastUpdated: '2026-06-29',
  location: 'Lagos, Nigeria 🇳🇬',
  trustStrip: 'Shipped in Lagos · Running globally · Battle-tested in audit season',
  cta: {
    primary: { label: 'Tell me your constraints', href: anchorUrl('section-contact') },
    secondary: { label: 'See what shipped', href: anchorUrl('section-projects') },
    cv: { label: 'Download CV', href: CV_ASSET_PATH },
  },
} as const;

export const CONVICTION_STATS = [
  { value: '4h → 15min', label: 'Tax filing time', stat: 'filing' },
  { value: 'Zero-Drop', label: 'System Resiliency', stat: 'uptime' },
  { value: 'sub-150ms', label: 'API response', stat: 'latency' },
  { value: '45% MTTD', label: 'Incident detection', stat: 'mttd' },
] as const;

export const LIVE_METRICS = {
  uptime: '99.9%+',
  uptimeTarget: '≥99.9%',
  p99Latency: 'sub-150ms',
  mttdImprove: '45%',
  testCoverage: '95%',
  bundleTarget: '< 300 KB',
} as const;

export const SOCIAL = {
  github: 'https://github.com/Scardubu',
  linkedin: 'https://linkedin.com/in/oscardubu',
  email: `mailto:${CONTACT_EMAIL}`,
  site: 'https://scardubu.dev',
} as const;
