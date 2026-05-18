/**
 * CONVICTION ENGINE V1.0 — MOTION VOCABULARY
 * THE SINGLE SOURCE OF MOTION TRUTH.
 *
 * MERGE NOTES:
 *   - Absorbed the v15.0 lib/motion.ts exports into this canonical module.
 *   - Preserved the V1 scroll-smoothness pass and retained the newer, calmer timings.
 *   - mobileReducedVariant only reduces timing values on mobile; it never mutates transforms.
 *   - viewportOnceDefault remains a backward-compat alias for viewportOnce.
 *
 * KEEP: all spring vocabulary names, HERO_SCROLL_CONFIG, noMotion,
 * viewportOnce, viewportRelaxed, and every exported variant name.
 */

import type { Transition, Variant, Variants } from 'framer-motion';

/* ═══════════ SPRING PRESETS ══════════════════════════════════════════════ */

export const springs = {
  snappy: { type: 'spring', stiffness: 420, damping: 30, mass: 0.8 } as Transition,
  smooth: { type: 'spring', stiffness: 260, damping: 24, mass: 0.9 } as Transition,
  gentle: { type: 'spring', stiffness: 180, damping: 20, mass: 1 } as Transition,
  cinematic: { type: 'spring', stiffness: 80, damping: 18, mass: 1.4 } as Transition,
  layout: { type: 'spring', stiffness: 300, damping: 28, mass: 0.8 } as Transition,
  hoverRise: { type: 'spring', stiffness: 500, damping: 32, mass: 0.6 } as Transition,
  decisive: { type: 'spring', stiffness: 600, damping: 35, mass: 0.5 } as Transition,
} as const;

/**
 * springConfig — canonical alias for springs.smooth.
 * Used by legacy components. New code should use springs.smooth directly.
 */
export const springConfig: Transition = springs.smooth;

/* ═══════════ VIEWPORT CONFIG ════════════════════════════════════════════ */

// V1: -80px — reveals start when 80px of section is visible.
// Gives spring animations more runway before the element reaches center.
export const viewportOnce = { once: true, margin: '-80px' } as const;
export const viewportRelaxed = { once: true, margin: '-40px' } as const;
/** Backward-compat alias — prefer viewportOnce in new code */
export const viewportOnceDefault = viewportOnce;

/* ═══════════ MOBILE MOTION HELPER ═══════════════════════════════════════ */

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function reduceTransitionObject(transition: Record<string, unknown>): Record<string, unknown> {
  const next: Record<string, unknown> = { ...transition };

  for (const [key, value] of Object.entries(next)) {
    if (
      typeof value === 'number' &&
      (key === 'duration' ||
        key === 'delay' ||
        key === 'repeatDelay' ||
        key === 'delayChildren' ||
        key === 'staggerChildren')
    ) {
      next[key] = Math.max(0, value / 2);
      continue;
    }

    if (isPlainObject(value)) {
      next[key] = reduceTransitionObject(value);
    }
  }

  return next;
}

/**
 * mobileReducedVariant — halves timing values on mobile.
 *
 * Call at component top-level:
 *   const isMobile = useMediaQuery('(max-width: 767px)');
 *   const variants = mobileReducedVariant(cardReveal(), isMobile);
 *
 * Does NOT remove scale or translate transforms — only timing reduction.
 * Spring transitions remain effectively spring-driven; timing-based values
 * inside transition objects are reduced when present.
 */
export function mobileReducedVariant<T extends Variants>(variants: T, isMobile: boolean): T {
  if (!isMobile) return variants;

  const result: Variants = {};

  for (const [key, value] of Object.entries(variants)) {
    if (typeof value !== 'object' || value === null) {
      result[key] = value as Variant;
      continue;
    }

    const state = value as Record<string, unknown>;
    const transition = state.transition;

    if (isPlainObject(transition)) {
      result[key] = {
        ...state,
        transition: reduceTransitionObject(transition),
      } as unknown as Variant;
    } else {
      result[key] = state as unknown as Variant;
    }
  }

  return result as T;
}

/* ═══════════ CONTAINERS ════════════════════════════════════════════════ */

/**
 * staggerContainer
 * @param stagger  delay between children (default 0.065s — tightened for snappier reveals)
 * @param delay    initial delay before first child (default 0.04s)
 */
export const staggerContainer = (stagger = 0.065, delay = 0.04): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
      delayChildren: delay,
    },
  },
});

/** Slower stagger for editorial content (articles, timelines) */
export const staggerSlow: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
  exit: { transition: { staggerChildren: 0.06, staggerDirection: -1 } },
};

/** Generic stagger (backward-compat alias) */
export const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.045, delayChildren: 0.08 } },
  exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};

/* ═══════════ PRIMITIVE REVEALS ══════════════════════════════════════════ */

/**
 * fadeRise — body text, secondary elements, proof cards.
 * V1: y 14 → 12. Shorter travel = less perceived jank.
 */
export const fadeRise: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springs.smooth,
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.15 },
  },
};

/**
 * fadeRiseSmooth — gentle spring for narrative body text / paragraph copy.
 * Calmer and more editorial than fadeRise.
 */
export const fadeRiseSmooth: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springs.gentle,
  },
  exit: { opacity: 0, y: -6, transition: { duration: 0.15 } },
};

/**
 * fadeRiseGentle — for large elements where smooth feels too snappy.
 * Use for hero sub-lines, Didone pull-quotes.
 */
export const fadeRiseGentle: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springs.gentle,
  },
};

/** fadeIn — opacity-only, no position transform */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: springs.smooth },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

/** fadeUp — body text with subtle upward travel and blur settle */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14, filter: 'blur(3px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: springs.smooth,
  },
  exit: { opacity: 0, y: -8, filter: 'blur(2px)', transition: { duration: 0.15 } },
};

/**
 * dramaticReveal — for full-width section headings.
 * Lower stiffness makes it feel like a large object settling.
 * NO scale — prevents layout reflow on wide headings.
 */
export const dramaticReveal = (yOffset = 36): Variants => ({
  hidden: { opacity: 0, y: yOffset },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 160,
      damping: 20,
      mass: 1.2,
    },
  },
});

/** sectionEntrance — full-section reveals without scale (prevents layout thrashing) */
export const sectionEntrance = (yOffset = 20): Variants => ({
  hidden: { opacity: 0, y: yOffset },
  visible: {
    opacity: 1,
    y: 0,
    transition: springs.gentle,
  },
});

/** scaleIn — opacity + subtle scale for dialogs and popovers */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: springs.smooth },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.12 } },
};

/* ═══════════ DIRECTIONAL REVEALS ════════════════════════════════════════ */

/** reveal — generic vertical fade-rise */
export const reveal: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 25 },
  },
  exit: {
    opacity: 0,
    y: 8,
    transition: { type: 'spring', stiffness: 180, damping: 20 },
  },
};

export const revealLeft: Variants = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: springs.snappy },
  exit: { opacity: 0, x: -8, transition: { duration: 0.12 } },
};

export const revealRight: Variants = {
  hidden: { opacity: 0, x: 16 },
  visible: { opacity: 1, x: 0, transition: springs.snappy },
  exit: { opacity: 0, x: 8, transition: { duration: 0.12 } },
};

/** listItem — for rendered lists and filter results */
export const listItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: springs.smooth },
  exit: { opacity: 0, y: 6, transition: { duration: 0.1 } },
};

/** liquidCard — glass card entrance (same physics as cardReveal + scale) */
export const liquidCard: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: springs.smooth },
  exit: { opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.14 } },
};

/* ═══════════ A24 DIDONE WORD REVEAL ════════════════════════════════════ */

/**
 * wordReveal — for headline word-by-word cinematic reveals.
 *
 * Wrap each word in an overflow-hidden clipping container.
 * Apply this variant to the inner span (the one that translates).
 */
export const wordReveal: Variants = {
  hidden: { y: '110%' },
  visible: {
    y: '0%',
    transition: {
      type: 'spring',
      stiffness: 190,
      damping: 22,
      mass: 1.05,
    },
  },
};

/** Parent container: stagger each word's reveal */
export const wordRevealContainer = (stagger = 0.065, delay = 0.1): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
      delayChildren: delay,
    },
  },
});

/**
 * letterReveal — per-character reveal for short, high-conviction words.
 * Faster spring than wordReveal — characters are smaller, need snappier feel.
 */
export const letterReveal: Variants = {
  hidden: { y: '100%', opacity: 0 },
  visible: {
    y: '0%',
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 280,
      damping: 24,
      mass: 0.8,
    },
  },
};

export const letterRevealContainer = (stagger = 0.04, delay = 0.05): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
      delayChildren: delay,
    },
  },
});

/* ═══════════ CLIP REVEAL ════════════════════════════════════════════════ */

/**
 * clipReveal — left-to-right clip wipe for section headings.
 * V1: stiffness 55 → 90, damping 18 → 22.
 * Completes in ~0.5s vs ~1.4s — reliable at any scroll speed.
 */
export const clipReveal: Variants = {
  hidden: { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
  visible: {
    clipPath: 'inset(0 0% 0 0)',
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 90,
      damping: 22,
      mass: 1.1,
    },
  },
};

/* ═══════════ CARD REVEAL ════════════════════════════════════════════════ */

/**
 * cardReveal — for featured/hero cards only (singular, high-importance).
 * Includes scale — do NOT use for grids of 4+ items (compositor pressure).
 */
export const cardReveal = (yOffset = 28): Variants => ({
  hidden: { opacity: 0, y: yOffset, scale: 0.972 },
  visible: { opacity: 1, y: 0, scale: 1, transition: springs.smooth },
  exit: { opacity: 0, y: -10, scale: 0.97, transition: { duration: 0.14 } },
});

/**
 * gridItemReveal — for grid items (4+ cards simultaneously).
 * V1 NEW: no scale — prevents N compositor layers on grid entrance.
 * Same spring timing as cardReveal for consistent feel.
 */
export const gridItemReveal = (yOffset = 20): Variants => ({
  hidden: { opacity: 0, y: yOffset },
  visible: { opacity: 1, y: 0, transition: springs.smooth },
  exit: { opacity: 0, y: -8, transition: { duration: 0.13 } },
});

/** glassCardReveal — like cardReveal with a backdrop-filter blur settle */
export const glassCardReveal = (yOffset = 28): Variants => ({
  hidden: { opacity: 0, y: yOffset, scale: 0.972 },
  visible: { opacity: 1, y: 0, scale: 1, transition: springs.smooth },
  exit: { opacity: 0, y: -10, scale: 0.97, transition: { duration: 0.14 } },
});

/* ═══════════ SCALE-X BAR FILL ══════════════════════════════════════════ */

export const scaleXReveal: Variants = {
  hidden: { scaleX: 0, opacity: 0, originX: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    originX: 0,
    transition: { type: 'spring', stiffness: 120, damping: 18, mass: 0.9 },
  },
};

/* ═══════════ HOVER STATES ══════════════════════════════════════════════ */

export const pillarHover = { y: -3, scale: 1.006, transition: springs.hoverRise } as const;
export const cardHover = { y: -4, scale: 1.004, transition: springs.hoverRise } as const;
export const cardHoverReset = { y: 0, scale: 1, transition: springs.hoverRise } as const;

export const interactive = {
  hover: { y: -3, transition: springs.snappy },
  tap: { scale: 0.97, transition: springs.snappy },
};

/* ═══════════ HERO SEQUENCE ═════════════════════════════════════════════ */

// Hero retains 0.055 stagger — tighter for first-impression timing.
export const heroContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.055, delayChildren: 0.05 } },
};

export const heroItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: springs.snappy },
};

/* ═══════════ ACCORDION ══════════════════════════════════════════════════ */

export const accordionReveal: Variants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: 'auto',
    transition: {
      height: { type: 'spring', stiffness: 260, damping: 26 },
      opacity: { duration: 0.18, delay: 0.06 },
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: {
      height: springs.snappy,
      opacity: { duration: 0.1 },
    },
  },
};

/* ═══════════ MOBILE MENU ════════════════════════════════════════════════ */

export const mobileMenu: Variants = {
  hidden: { opacity: 0, y: -12, scaleY: 0.92, originY: 0 },
  visible: { opacity: 1, y: 0, scaleY: 1, originY: 0, transition: springs.snappy },
  exit: { opacity: 0, y: -8, scaleY: 0.95, originY: 0, transition: { duration: 0.15 } },
};

export const mobileMenuItem: Variants = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0, transition: springs.smooth },
};

export const mobileMenuItems = (stagger = 0.06): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger } },
});

/* ═══════════ FILTER TRANSITIONS ════════════════════════════════════════ */

export const filterTransition: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: springs.snappy },
  exit: { opacity: 0, y: -4, transition: { duration: 0.1 } },
};

/* ═══════════ HERO PARALLAX ═════════════════════════════════════════════ */

export const HERO_SCROLL_CONFIG = {
  offset: ['start start', 'end start'] as ['start start', 'end start'],
  textRange: [0, 1] as [number, number],
  textOutput: ['0%', '7%'] as [string, string],
  visualRange: [0, 1] as [number, number],
  visualOutput: ['0%', '4%'] as [string, string],
  opacityRange: [0, 0.8] as [number, number],
  opacityOutput: [1, 0] as [number, number],
} as const;

/* ═══════════ ACCESSIBILITY FALLBACK ════════════════════════════════════ */

export const noMotion: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0 } },
};

/* ═══════════ PAGE TRANSITION ═══════════════════════════════════════════ */

export const pageTransition: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};
