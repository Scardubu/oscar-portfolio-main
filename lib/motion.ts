/**
 * lib/motion.ts — CONVICTION ENGINE v19.0
 * ─────────────────────────────────────────────────────────────────────────────
 * RULE: This file is the bridge between legacy imports and the canonical
 * motionVariants.ts spring vocabulary. All new code should import directly
 * from lib/motionVariants. This file exists only to satisfy legacy component
 * imports and must not define competing spring constants.
 *
 * FIXED: Removed duplicate `springConfig` const that caused a TypeScript
 * "Duplicate identifier" error when both the local const and the re-export
 * from motionVariants were present in the same module.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import type { Transition, Variants } from 'framer-motion';

// ── Re-export canonical spring vocabulary (single source of truth) ────────────
export {
  springs,
  viewportOnce,
  viewportRelaxed,
  noMotion,
  fadeRise,
  staggerContainer,
  cardReveal,
  clipReveal,
  accordionReveal,
} from './motionVariants';

// ── springConfig — canonical alias to springs.smooth ─────────────────────────
// Used by: ThemeToggle, CommandPalette, GlassCard (legacy imports)
// New code → use springs.snappy / springs.smooth from motionVariants directly.
export const springConfig: Transition = {
  type:      'spring',
  stiffness: 260,
  damping:   24,
  mass:      0.9,
};

// ── VIEWPORT CONFIG ───────────────────────────────────────────────────────────
export const viewportOnceDefault = { once: true, margin: '-80px' } as const;

// ── BASE REVEAL (SYSTEM PRIMITIVE) ───────────────────────────────────────────
export const reveal: Variants = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0,  transition: { type: 'spring', stiffness: 300, damping: 25 } },
  exit:    { opacity: 0, y: 8,  transition: { type: 'spring', stiffness: 180, damping: 20 } },
};

export const revealLeft: Variants = {
  hidden:  { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0,  transition: { type: 'spring', stiffness: 420, damping: 30 } },
  exit:    { opacity: 0, x: -8, transition: { type: 'spring', stiffness: 180, damping: 20 } },
};

export const revealRight: Variants = {
  hidden:  { opacity: 0, x: 16 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 420, damping: 30 } },
  exit:    { opacity: 0, x: 8, transition: { type: 'spring', stiffness: 180, damping: 20 } },
};

export const scaleIn: Variants = {
  hidden:  { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1,    transition: { type: 'spring', stiffness: 260, damping: 24 } },
  exit:    { opacity: 0, scale: 0.98, transition: { type: 'spring', stiffness: 180, damping: 20 } },
};

// ── STAGGER SYSTEM ────────────────────────────────────────────────────────────
export const stagger: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.045, delayChildren: 0.08 } },
  exit:    { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};

// ── HERO SEQUENCE ─────────────────────────────────────────────────────────────
export const heroContainer: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
};

export const heroItem: Variants = {
  hidden:  { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 420, damping: 30 } },
};

// ── MOBILE NAV ────────────────────────────────────────────────────────────────
export const mobileMenu: Variants = {
  hidden:  { opacity: 0, y: -10, scaleY: 0.96 },
  visible: {
    opacity: 1, y: 0, scaleY: 1,
    transition: { type: 'spring', stiffness: 260, damping: 24, staggerChildren: 0.05, delayChildren: 0.04 },
  },
  exit: { opacity: 0, y: -8, scaleY: 0.97, transition: { type: 'spring', stiffness: 180, damping: 20 } },
};

export const mobileMenuItems: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
  exit:    { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};

export const mobileMenuItem: Variants = {
  hidden:  { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 420, damping: 30 } },
  exit:    { opacity: 0, x: -6, transition: { type: 'spring', stiffness: 180, damping: 20 } },
};

// ── INTERACTION STATES ────────────────────────────────────────────────────────
export const interactive = {
  hover: { y: -3, transition: { type: 'spring', stiffness: 420, damping: 30 } },
  tap:   { scale: 0.97, transition: { type: 'spring', stiffness: 400, damping: 30 } },
};

// ── LIST / FILTER ─────────────────────────────────────────────────────────────
export const listItem: Variants = {
  hidden:  { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } },
  exit:    { opacity: 0, y: 6, transition: { type: 'spring', stiffness: 180, damping: 20 } },
};

// ── FILTER TRANSITION ─────────────────────────────────────────────────────────
export const filterTransition: Transition = {
  type: 'spring', stiffness: 320, damping: 26, mass: 0.8,
};

// ── FADE UP ───────────────────────────────────────────────────────────────────
export const fadeIn: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { type: 'spring', stiffness: 260, damping: 24 } },
  exit:    { opacity: 0, transition: { type: 'spring', stiffness: 180, damping: 20 } },
};

export const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 14, filter: 'blur(3px)' },
  visible: { opacity: 1, y: 0,  filter: 'blur(0px)', transition: { type: 'spring', stiffness: 260, damping: 24 } },
  exit:    { opacity: 0, y: -8, filter: 'blur(2px)', transition: { type: 'spring', stiffness: 180, damping: 20 } },
};

// ── STAGGER SLOW ──────────────────────────────────────────────────────────────
export const staggerSlow: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
  exit:    { transition: { staggerChildren: 0.06, staggerDirection: -1 } },
};

// ── LIQUID CARD ───────────────────────────────────────────────────────────────
export const liquidCard: Variants = {
  hidden:  { opacity: 0, y: 24, scale: 0.97 },
  visible: { opacity: 1, y: 0,  scale: 1,    transition: { type: 'spring', stiffness: 260, damping: 24 } },
  exit:    { opacity: 0, y: -8, scale: 0.98, transition: { type: 'spring', stiffness: 180, damping: 20 } },
};

// ── PAGE TRANSITION ───────────────────────────────────────────────────────────
// Note: PageWrapper no longer uses AnimatePresence on mobile — this is kept
// for desktop/blog page transitions that opt-in explicitly.
export const pageTransition: Variants = {
  hidden:  { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 30, mass: 0.8 } },
  exit:    { opacity: 0, y: -8, transition: { type: 'spring', stiffness: 300, damping: 30, mass: 0.8 } },
};