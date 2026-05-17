/**
 * CONVICTION ENGINE v15.0 — MOTION VOCABULARY
 * ─────────────────────────────────────────────────────────────────────────
 * THE SINGLE SOURCE OF MOTION TRUTH.
 *
 * lib/motion.ts has been deleted. All exports that lived there now live here.
 * Every component should import from '@/lib/motionVariants' — never from
 * '@/lib/motion' (which no longer exists).
 *
 * Changelog from v14.0:
 *   v15.0 MERGE: Absorbed all exports from lib/motion.ts:
 *     fadeIn, fadeUp, reveal, revealLeft, revealRight, scaleIn,
 *     stagger, staggerSlow, heroContainer, heroItem, listItem,
 *     interactive, liquidCard, mobileMenu (name-collision resolved — see below),
 *     mobileMenuItem, mobileMenuItems, filterTransition, springConfig,
 *     viewportOnceDefault, pageTransition (merged with existing)
 *
 *   NAME COLLISION RESOLUTION:
 *     Both files exported mobileMenu, mobileMenuItem, mobileMenuItems,
 *     filterTransition, and pageTransition. The motionVariants.ts versions
 *     are canonical (more complete spring vocabulary). lib/motion.ts versions
 *     are discarded. If any component produced subtly different animation,
 *     the canonical version is the correct reference.
 *
 *   v15.0 NEW: mobileReducedVariant() helper — halves durations on mobile.
 *     Called at component level: `mobileReducedVariant(variants, isMobile)`.
 *     Does NOT remove transforms — only duration halving is safe cross-device.
 *
 *   v15.0 NEW: viewportOnceDefault export (alias for viewportOnce, backward compat).
 *
 *   KEEP all spring vocabulary names — external components reference by name.
 *   KEEP HERO_SCROLL_CONFIG — parallax values unchanged.
 *   KEEP noMotion, viewportOnce, viewportRelaxed — stable API surface.
 *
 * Spring vocabulary:
 *   snappy    → micro-interactions, hover states   (stiffness 420 / damping 30)
 *   smooth    → card reveals, section entrances    (stiffness 260 / damping 24)
 *   gentle    → hero headline, large Didone type   (stiffness 180 / damping 20)
 *   cinematic → dramatic section wipes             (stiffness 80  / damping 18)
 *   layout    → spatial continuity preserving      (stiffness 300 / damping 28)
 *   hoverRise → hover lift, instant settle         (stiffness 500 / damping 32)
 *   decisive  → CTA hover, primary interactive     (stiffness 600 / damping 35)
 */

import type { Transition, Variant, Variants } from 'framer-motion';

/* ══════════════════════════════════════════════════════════════════════════
   SPRING PRESETS
   ══════════════════════════════════════════════════════════════════════════ */

export const springs = {
  /** Micro-interactions: hover states, tab switches, pill toggles */
  snappy: { type: 'spring', stiffness: 420, damping: 30, mass: 0.8 } as Transition,
  /** Card reveals, section entrances, dialog appearance */
  smooth: { type: 'spring', stiffness: 260, damping: 24, mass: 0.9 } as Transition,
  /** Hero headline, large Didone display type */
  gentle: { type: 'spring', stiffness: 180, damping: 20, mass: 1.0 } as Transition,
  /** Feature card, dramatic section reveal */
  cinematic: { type: 'spring', stiffness: 80, damping: 18, mass: 1.4 } as Transition,
  /** Layout transitions — preserves spatial continuity */
  layout: { type: 'spring', stiffness: 300, damping: 28, mass: 0.8 } as Transition,
  /** Hover lift — instant physical settle */
  hoverRise: { type: 'spring', stiffness: 500, damping: 32, mass: 0.6 } as Transition,
  /** CTA hover, primary interactive — ultra-snappy zero-bounce */
  decisive: { type: 'spring', stiffness: 600, damping: 35, mass: 0.5 } as Transition,
} as const;

/**
 * springConfig — canonical alias for springs.smooth.
 * Used by legacy components (ThemeToggle, CommandPalette, GlassCard).
 * New code: use springs.smooth directly.
 */
export const springConfig: Transition = springs.smooth;

/* ══════════════════════════════════════════════════════════════════════════
   VIEWPORT CONFIG
   ══════════════════════════════════════════════════════════════════════════ */

export const viewportOnce = { once: true, margin: '-72px' } as const;
export const viewportRelaxed = { once: true, margin: '-40px' } as const;
/** Backward-compat alias — prefer viewportOnce in new code */
export const viewportOnceDefault = { once: true, margin: '-80px' } as const;

/* ══════════════════════════════════════════════════════════════════════════
   MOBILE MOTION HELPER
   ══════════════════════════════════════════════════════════════════════════ */

/**
 * mobileReducedVariant — halves all transition durations on mobile.
 *
 * Call at component top-level:
 *   const isMobile = useMediaQuery('(max-width: 767px)');
 *   const variants = mobileReducedVariant(cardReveal(), isMobile);
 *
 * Does NOT remove scale or translate transforms — only duration reduction.
 * Removing transforms can cause layout jumps on constrained viewports.
 *
 * Spring transitions don't have a `duration` property, so spring-based
 * variants are returned unmodified — springs self-regulate via stiffness/damping.
 */
export function mobileReducedVariant<T extends Variants>(
  variants: T,
  isMobile: boolean
): T {
  if (!isMobile) return variants;

  const result: Variants = {};
  for (const [key, value] of Object.entries(variants)) {
    if (typeof value !== 'object' || value === null) {
      result[key] = value as Variant;
      continue;
    }
    // Downcast to Record for safe runtime property access.
    // The `as unknown as Variant` bridge on assignment is intentional:
    // framer-motion 11 tightened MakeKeyframes<TargetProperties> to use
    // a --${string} index signature incompatible with Record<string,unknown>,
    // so we must re-enter the Variant type after manipulation.
    const state = value as Record<string, unknown>;
    const transition = state.transition as Record<string, unknown> | undefined;
    if (transition && typeof transition.duration === 'number') {
      result[key] = {
        ...state,
        transition: {
          ...transition,
          duration: transition.duration / 2,
          ...(typeof transition.delay === 'number'
            ? { delay: transition.delay / 2 }
            : {}),
        },
      } as unknown as Variant;
    } else {
      result[key] = state as unknown as Variant;
    }
  }
  return result as T;
}

/* ══════════════════════════════════════════════════════════════════════════
   CONTAINERS — stagger orchestration
   ══════════════════════════════════════════════════════════════════════════ */

/**
 * staggerContainer
 * @param stagger  delay between children (default 0.07s — tightened from 0.08 for snappier reveals)
 * @param delay    initial delay before first child (default 0.04s — tightened from 0.05)
 */
export const staggerContainer = (stagger = 0.07, delay = 0.04): Variants => ({
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

/* ══════════════════════════════════════════════════════════════════════════
   PRIMITIVE REVEALS
   ══════════════════════════════════════════════════════════════════════════ */

/**
 * fadeRise — body text, secondary elements, proof cards.
 * v14 CHANGE: y: 16 → 14. Shorter travel = more confident reveal.
 */
export const fadeRise: Variants = {
  hidden: { opacity: 0, y: 14 },
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
 * dramaticReveal — for full-width section headings (ContactSection, AboutSection h2).
 * Lower stiffness (160) makes it feel like a large object settling.
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

/* ══════════════════════════════════════════════════════════════════════════
   DIRECTIONAL REVEALS
   ══════════════════════════════════════════════════════════════════════════ */

/** reveal — generic vertical fade-rise (backward-compat alias for fadeRise) */
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

/* ══════════════════════════════════════════════════════════════════════════
   A24 DIDONE WORD REVEAL
   ══════════════════════════════════════════════════════════════════════════ */

/**
 * wordReveal — for headline word-by-word cinematic reveals.
 *
 * Wrap each word in an `overflow:hidden` clipping container.
 * Apply this variant to the INNER span (the one that translates).
 * Creates the "rising from below the frame" letterform unfurl.
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
 * Use sparingly.
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

/* ══════════════════════════════════════════════════════════════════════════
   CLIP REVEAL — geometric wipe
   ══════════════════════════════════════════════════════════════════════════ */

/**
 * clipReveal — left-to-right clip wipe.
 * Use for section headings and proof callout borders.
 * Creates the A24 "unknown → revealed" geometric intersection.
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

/* ══════════════════════════════════════════════════════════════════════════
   CARD REVEAL — translate + scale
   ══════════════════════════════════════════════════════════════════════════ */

/**
 * cardReveal
 * @param yOffset vertical travel (px). Positive = rises up.
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

/**
 * glassCardReveal — like cardReveal with a backdrop-filter blur settle.
 * Use sparingly — promotes to compositor layer. Not for lists.
 */
export const glassCardReveal = (yOffset = 28): Variants => ({
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

/* ══════════════════════════════════════════════════════════════════════════
   SCALE-X BAR FILL — metric bars, skill levels
   ══════════════════════════════════════════════════════════════════════════ */

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

/* ══════════════════════════════════════════════════════════════════════════
   HOVER STATES — interactive panels
   ══════════════════════════════════════════════════════════════════════════ */

export const pillarHover = {
  y: -3,
  scale: 1.006,
  transition: springs.hoverRise,
} as const;

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

/** interactive — whileHover/whileTap shorthand for card components */
export const interactive = {
  hover: { y: -3, transition: springs.snappy },
  tap: { scale: 0.97, transition: springs.snappy },
};

/* ══════════════════════════════════════════════════════════════════════════
   HERO SEQUENCE
   ══════════════════════════════════════════════════════════════════════════ */

/** heroContainer — stagger orchestrator for HeroSection children */
export const heroContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
};

/** heroItem — child variant for hero sequence items */
export const heroItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: springs.snappy },
};

/* ══════════════════════════════════════════════════════════════════════════
   ACCORDION REVEAL — AnimatePresence height collapse
   ══════════════════════════════════════════════════════════════════════════ */

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

/* ══════════════════════════════════════════════════════════════════════════
   MOBILE MENU
   ══════════════════════════════════════════════════════════════════════════ */

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

/* ══════════════════════════════════════════════════════════════════════════
   FILTER TAB TRANSITIONS
   ══════════════════════════════════════════════════════════════════════════ */

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

/* ══════════════════════════════════════════════════════════════════════════
   SCROLL-LINKED HERO PARALLAX
   ══════════════════════════════════════════════════════════════════════════ */

export const HERO_SCROLL_CONFIG = {
  offset: ['start start', 'end start'] as ['start start', 'end start'],
  textRange: [0, 1] as [number, number],
  textOutput: ['0%', '7%'] as [string, string],   // was 10% — reduced for smoother feel
  visualRange: [0, 1] as [number, number],
  visualOutput: ['0%', '4%'] as [string, string],  // was 6% — subtler parallax on visual panel
  opacityRange: [0, 0.8] as [number, number],       // was 0.65 — fade starts at 80% scroll, not 65%
  opacityOutput: [1, 0] as [number, number],
} as const;

/* ══════════════════════════════════════════════════════════════════════════
   NO-MOTION ACCESSIBILITY FALLBACK
   ══════════════════════════════════════════════════════════════════════════ */

export const noMotion: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0 } },
};

/* ══════════════════════════════════════════════════════════════════════════
   PAGE TRANSITION
   ══════════════════════════════════════════════════════════════════════════ */

export const pageTransition: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};