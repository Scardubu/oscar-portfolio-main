/**
 * CONVICTION ENGINE v14.0 — MOTION VOCABULARY
 * ─────────────────────────────────────────────────────────────────────────
 * Changelog from v12.0:
 *
 *   NEW: dramaticReveal — for full-width section heading reveals where the
 *     scale of the motion should feel physically weighty. Combines a larger
 *     Y travel (36px) with a slight scale-down start (0.96). Lower spring
 *     stiffness (160) makes it feel like a large object settling.
 *     Use for ContactSection and AboutSection h2 elements.
 *
 *   NEW: letterReveal — per-character reveal for short, high-conviction
 *     words (e.g. acronyms, KPI labels). Faster spring than wordReveal
 *     because characters are smaller and need a snappier feel.
 *     Use sparingly — word-level reveal is the primary pattern.
 *
 *   NEW: glassCardReveal — identical physics to cardReveal but with an
 *     additional backdrop-filter reveal trick: starts at blur(8px) and
 *     settles to blur(0). Only for glass-elevated tier cards where the
 *     blur-on-enter signals the glass "condensing" into focus.
 *     NOTE: Use sparingly — promotes to compositor layer. Not for lists.
 *
 *   NEW: springs.decisive — for CTA buttons and primary interactive
 *     elements that need to feel instant but still physical.
 *     stiffness 600, damping 35 — ultra-snappy with zero bounce.
 *
 *   REF: wordReveal spring: stiffness 200 → 190, mass 1.0 → 1.05.
 *     Adds a fractionally heavier feel to large headline letterforms.
 *     The difference is subtle but compounds across 7 words.
 *
 *   REF: fadeRise: y: 16 → 14. Shorter travel = more confident reveal.
 *     16px was appropriate at v11; with the tightened grid in v14 the
 *     extra travel is visible as a layout shift on slow connections.
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

import type { Transition, Variants } from 'framer-motion';

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
  /** v14.0 NEW: CTA hover, primary interactive — ultra-snappy zero-bounce */
  decisive: { type: 'spring', stiffness: 600, damping: 35, mass: 0.5 } as Transition,
} as const;

/* ══════════════════════════════════════════════════════════════════════════
   VIEWPORT CONFIG
   ══════════════════════════════════════════════════════════════════════════ */

export const viewportOnce = { once: true, margin: '-72px' } as const;
export const viewportRelaxed = { once: true, margin: '-40px' } as const;

/* ══════════════════════════════════════════════════════════════════════════
   CONTAINERS — stagger orchestration
   ══════════════════════════════════════════════════════════════════════════ */

/**
 * staggerContainer
 * @param stagger  delay between children (default 0.08s)
 * @param delay    initial delay before first child (default 0.05s)
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

/* ══════════════════════════════════════════════════════════════════════════
   PRIMITIVE REVEALS
   ══════════════════════════════════════════════════════════════════════════ */

/**
 * fadeRise — body text, secondary elements, proof cards.
 *
 * v12 CHANGE: Removed `filter: blur(4px)` from hidden state.
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

/**
 * v14.0 NEW — dramaticReveal
 * For full-width section headings where the motion should feel physically
 * weighty. Lower stiffness (160) = heavier object settling.
 * Use for ContactSection h2, AboutSection h2.
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

/* ══════════════════════════════════════════════════════════════════════════
   A24 DIDONE WORD REVEAL
   ══════════════════════════════════════════════════════════════════════════ */

/**
 * wordReveal — for headline word-by-word cinematic reveals.
 *
 * Wrap each word in an `overflow:hidden` clipping container.
 * Apply this variant to the INNER span (the one that translates).
 * Creates the "rising from below the frame" letterform unfurl.
 *
 * v14.0: stiffness 200 → 190, mass 1.0 → 1.05.
 * Adds a fractionally heavier feel at large headline sizes.
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
 * v14.0 NEW — letterReveal
 * Per-character reveal for short, high-conviction words (KPI labels, acronyms).
 * Faster spring than wordReveal — characters are smaller, need snappier feel.
 * Use sparingly — word-level reveal is the primary pattern.
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

/** Container: stagger each letter's reveal (faster than word stagger) */
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
 *
 * Spring tuned cinematic: low stiffness creates the sense of a physical
 * curtain being drawn rather than a digital fade.
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
 * @param yOffset vertical travel (px). Positive = rises up, negative = drops down.
 *
 * Scale starts at 0.972 — just enough to feel physical without being obvious.
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
 * sectionEntrance — for full-section reveals where scale would cause
 * layout thrashing. Use for AboutSection, WritingSection, ContactSection.
 * No scale — only opacity + Y translate.
 */
export const sectionEntrance = (yOffset = 20): Variants => ({
  hidden: { opacity: 0, y: yOffset },
  visible: {
    opacity: 1,
    y: 0,
    transition: springs.gentle,
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

/* ══════════════════════════════════════════════════════════════════════════
   ACCORDION REVEAL — AnimatePresence height collapse
   ══════════════════════════════════════════════════════════════════════════ */

/**
 * accordionReveal — used for "Read full brief" expandable sections.
 *
 * Framer Motion handles height: 0 → 'auto' via JS-measured FLIP internally.
 * Acceptable for content that expands once per session (not on scroll).
 * Opacity fade runs concurrently to soften the layout shift visually.
 *
 * For scroll-critical sections, use clipReveal instead.
 */
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

/**
 * HERO SCROLL PARALLAX CONFIGURATION
 *
 * Usage in HeroSection.tsx:
 *
 *   const heroRef = useRef<HTMLElement>(null);
 *   const { scrollYProgress } = useScroll({
 *     target: heroRef,
 *     offset: ['start start', 'end start'],
 *   });
 *   const textY   = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);
 *   const visualY = useTransform(scrollYProgress, [0, 1], ['0%', '6%']);
 *   const heroOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
 *
 * Apply textY to the left text column, visualY to the HeroVisual wrapper.
 * Apply heroOpacity to the outer container for a cinematic exit.
 *
 * Why different rates:
 *   Text (10%) exits faster — DMs see the headline fade as they commit.
 *   Visual (6%) lingers — system status stays readable a beat longer.
 *   This "depth difference" is the key cinematic effect.
 *
 * Hardware safety: translateY via MotionValue is always on the compositor.
 */
export const HERO_SCROLL_CONFIG = {
  offset: ['start start', 'end start'] as ['start start', 'end start'],
  textRange: [0, 1] as [number, number],
  textOutput: ['0%', '10%'] as [string, string],
  visualRange: [0, 1] as [number, number],
  visualOutput: ['0%', '6%'] as [string, string],
  opacityRange: [0, 0.65] as [number, number],
  opacityOutput: [1, 0] as [number, number],
} as const;

/* ══════════════════════════════════════════════════════════════════════════
   NO-MOTION ACCESSIBILITY FALLBACK
   ══════════════════════════════════════════════════════════════════════════ */

/**
 * noMotion — used when:
 *   1. useReducedMotion() returns true (word-split layouts need this because
 *      the DOM structure changes, not just the animation)
 *   2. Any explicit "no animation" override
 *
 * Note: MotionConfig(reducedMotion="user") handles animation suppression
 * automatically across all `m.*` components. noMotion is only needed when
 * the COMPONENT STRUCTURE changes based on motion preference.
 */
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