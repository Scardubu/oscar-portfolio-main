/**
 * CONVICTION ENGINE v11.0 — MOTION VOCABULARY
 * ─────────────────────────────────────────────────────────────────────────
 * Principles applied:
 *   • Linear spring physics: never linear/robotic, always physically grounded
 *   • A24 Didone authority: word-level reveals, narrow→wide letterform unfurl
 *   • Framer Motion orchestrated variants: staggerChildren drives all reveals
 *   • Hardware-accelerated only: opacity + transform — no width/height animation
 *
 * Spring vocabulary:
 *   snappy  → micro-interactions, hover states (stiffness 420 / damping 30)
 *   smooth  → card reveals, section entrances (stiffness 260 / damping 24)
 *   gentle  → hero headline, large Didone (stiffness 180 / damping 20)
 *   cinematic → dramatic section wipes (stiffness 80 / damping 18)
 */

import type { Transition, Variants } from 'framer-motion';

/* ── Spring transition presets ──────────────────────────────────────────── */

export const springs = {
  /** Micro-interactions, tab switches, hover responses */
  snappy: { type: 'spring', stiffness: 420, damping: 30, mass: 0.8 } as Transition,
  /** Card reveals, section entrances */
  smooth: { type: 'spring', stiffness: 260, damping: 24, mass: 0.9 } as Transition,
  /** Hero headline, large type */
  gentle: { type: 'spring', stiffness: 180, damping: 20, mass: 1.0 } as Transition,
  /** Feature project card, cinematic drama */
  cinematic: { type: 'spring', stiffness: 80, damping: 18, mass: 1.4 } as Transition,
  /** Layout transitions — preserves spatial continuity */
  layout: { type: 'spring', stiffness: 300, damping: 28, mass: 0.8 } as Transition,
  /** Hover elevation: instant settle */
  hoverRise: { type: 'spring', stiffness: 500, damping: 32, mass: 0.6 } as Transition,
} as const;

/* ── Viewport config ───────────────────────────────────────────────────── */

export const viewportOnce = { once: true, margin: '-72px' } as const;
export const viewportRelaxed = { once: true, margin: '-40px' } as const;

/* ── Container: stagger orchestration ─────────────────────────────────── */

/**
 * staggerContainer
 * @param stagger  - delay between children (default 0.08s)
 * @param delay    - initial delay before first child (default 0.05s)
 */
export const staggerContainer = (stagger = 0.08, delay = 0.05): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
      delayChildren: delay,
    },
  },
});

/* ── Primitive: fade + rise (body text, secondary elements) ────────────── */

export const fadeRise: Variants = {
  hidden: { opacity: 0, y: 16, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: springs.smooth,
  },
  exit: {
    opacity: 0,
    y: -8,
    filter: 'blur(2px)',
    transition: { duration: 0.15 },
  },
};

/* ── A24 Didone word reveal ────────────────────────────────────────────── */
/**
 * For character/word-level reveals.
 * Wrap each word in overflow:hidden, apply this variant to the inner span.
 * Creates the "rising from below" cinematic typeface unfurl.
 */
export const wordReveal: Variants = {
  hidden: { y: '110%' },
  visible: {
    y: '0%',
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 22,
      mass: 1.0,
    },
  },
};

/**
 * Parent container for word reveals — stagger each word
 */
export const wordRevealContainer = (stagger = 0.065, delay = 0.1): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
      delayChildren: delay,
    },
  },
});

/* ── Clip reveal: geometric wipe ───────────────────────────────────────── */
/**
 * Left-to-right clip wipe — A24 cinematic.
 * Use for section headings, proof callout borders.
 */
export const clipReveal: Variants = {
  hidden: { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
  visible: {
    clipPath: 'inset(0 0% 0 0)',
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 55,
      damping: 18,
      mass: 1.2,
    },
  },
};

/* ── Card reveal: translate + scale ────────────────────────────────────── */
/**
 * @param yOffset - vertical travel distance (default 28px)
 * Signs matter: positive = rises up, negative = drops down
 */
export const cardReveal = (yOffset = 28): Variants => ({
  hidden: { opacity: 0, y: yOffset, scale: 0.972 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: springs.smooth,
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.97,
    transition: { duration: 0.14 },
  },
});

/* ── Scale-X bar fill (metric bars, skill levels) ──────────────────────── */
export const scaleXReveal: Variants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 18,
      mass: 0.9,
    },
  },
};

/* ── Pillar hover (interactive panels) ─────────────────────────────────── */
export const pillarHover = {
  y: -3,
  scale: 1.006,
  transition: springs.hoverRise,
} as const;

/* ── Hover elevation (cards) ────────────────────────────────────────────── */
export const cardHover = {
  y: -4,
  scale: 1.004,
  transition: springs.hoverRise,
} as const;

export const cardHoverReset = {
  y: 0,
  scale: 1,
  transition: springs.hoverRise,
} as const;

/* ── Accordion collapse (full brief, arch details) ──────────────────────── */
export const accordionReveal: Variants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: 'auto',
    transition: {
      height: springs.smooth,
      opacity: { duration: 0.2, delay: 0.05 },
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: {
      height: springs.snappy,
      opacity: { duration: 0.12 },
    },
  },
};

/* ── Mobile menu: slide + fade ──────────────────────────────────────────── */
export const mobileMenu: Variants = {
  hidden: { opacity: 0, y: -12, scaleY: 0.92 },
  visible: {
    opacity: 1,
    y: 0,
    scaleY: 1,
    transition: springs.snappy,
  },
  exit: {
    opacity: 0,
    y: -8,
    scaleY: 0.95,
    transition: { duration: 0.15 },
  },
};

export const mobileMenuItem: Variants = {
  hidden: { opacity: 0, x: -8 },
  visible: {
    opacity: 1,
    x: 0,
    transition: springs.smooth,
  },
};

export const mobileMenuItems = (stagger = 0.06): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger },
  },
});

/* ── Filter tab transitions ──────────────────────────────────────────────── */
export const filterTransition: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springs.snappy,
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: { duration: 0.1 },
  },
};

/* ── NoMotion: accessibility fallback ───────────────────────────────────── */
export const noMotion: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0 } },
};

/* ── Page transition ────────────────────────────────────────────────────── */
export const pageTransition: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};
