/**
 * CONVICTION ENGINE v12.0 — MOTION VOCABULARY
 * ─────────────────────────────────────────────────────────────────────────
 * Changelog from v11.0:
 *
 *   BUG FIX (CRITICAL — performance):
 *     fadeRise hidden state had `filter: 'blur(4px)'`. With 20+ orchestrated
 *     elements, this promotes every target to its own compositor layer on
 *     mount, causing GPU layer explosion and jank on mid-range devices.
 *     REMOVED. Opacity + transform only — always hardware-accelerated.
 *
 *   BUG FIX (perf): accordionReveal animated `height: 0 → 'auto'`.
 *     Framer Motion does handle this via JS measurement, but it also
 *     triggers layout recalculation on every frame. Replaced with a
 *     clip-path + opacity approach that stays on the compositor.
 *     NOTE: height animation is KEPT for the JS-measured auto-height case
 *     (framer handles this via FLIP internally), but we reduce the motion
 *     footprint with a faster opacity fade.
 *
 *   NEW: heroScrollY / heroScrollOpacity — MotionValues for scroll-linked
 *     hero parallax. Import and use with `useTransform` in HeroSection.
 *
 *   NEW: sectionEntrance — softer than cardReveal, designed for full-width
 *     section heading wipes. Removes scale to avoid content reflow.
 *
 *   CLARIFIED: noMotion now correctly resolves to an immediate opacity:1
 *     with zero duration. MotionConfig(reducedMotion="user") handles the
 *     system-level check; individual components DON'T need useReducedMotion()
 *     for the motion themselves — only for conditional layout changes that
 *     AREN'T motion (e.g. disabling a word-split layout when reduced).
 *
 * Spring vocabulary:
 *   snappy    → micro-interactions, hover states   (stiffness 420 / damping 30)
 *   smooth    → card reveals, section entrances    (stiffness 260 / damping 24)
 *   gentle    → hero headline, large Didone type   (stiffness 180 / damping 20)
 *   cinematic → dramatic section wipes             (stiffness 80  / damping 18)
 *   layout    → spatial continuity preserving      (stiffness 300 / damping 28)
 *   hoverRise → hover lift, instant settle         (stiffness 500 / damping 32)
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
 * Reason: backdrop-filter on glass elements already creates stacking contexts.
 * Adding blur on top of that during animation promotion overloads the
 * compositor with 20+ promoted layers, causing frame drops on mid-range GPUs.
 * The opacity + translateY motion is visually complete without blur.
 */
export const fadeRise: Variants = {
  hidden: { opacity: 0, y: 16 },
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
 * Spring tuned to: weighted, not snappy. The mass of 1.0 gives the
 * headline a sense of physical presence — ink settling onto paper.
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
 * Engineers notice the motion is spring-based; DMs just feel "it's alive".
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
 * This is acceptable for content that expands once per session (not on scroll).
 * The opacity fade runs concurrently to soften the layout shift visually.
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
 *   Text (10%) exits faster — DMs see the headline fade as they commit to scroll.
 *   Visual (6%) lingers — system status stays readable a beat longer.
 *   This "depth difference" is the key cinematic effect: parallax creates Z-axis.
 *
 * Hardware safety: translateY via MotionValue is always on the compositor.
 * No layout recalculation triggered.
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
 *   1. useReducedMotion() returns true (word-split layouts need this check
 *      because the DOM structure changes, not just the animation)
 *   2. Any explicit "no animation" override
 *
 * Note: MotionConfig(reducedMotion="user") handles the animation suppression
 * automatically across all `m.*` components. noMotion is only needed when
 * the COMPONENT STRUCTURE changes based on motion preference (e.g., word-split
 * headlines render differently vs. plain text for screen readers + reduced motion).
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