/**
 * CONVICTION ENGINE V1.1 — MOTION VOCABULARY
 * THE SINGLE SOURCE OF MOTION TRUTH.
 *
 * CHANGELOG v1.1 → v1.0:
 *   - Preserved every v1.0 export name, value, and semantic — zero breaking changes.
 *   - Added section: MAGNETIC BUTTON VARIANTS — works with `useMagnetic` hook.
 *   - Added section: SPOTLIGHT REVEAL — focused, high-contrast section entry.
 *   - Added section: DRAG INTERACTION — for draggable proof cards.
 *   - Added section: SHARED LAYOUT CONFIG — AnimateSharedLayout transition presets.
 *   - Added section: CHAPTER TRANSITION — framer-motion variants for chapter-aware
 *     elements that live outside ChapterFrame (e.g. the chapter progress rail dots).
 *   - Added section: NOTIFICATION / TOAST — entrance + exit for toast system.
 *   - Added section: PROGRESS BAR — scaleX fill with configurable easing.
 *   - Added `presenceConfig` helper — wraps AnimatePresence mode/initial options.
 *   - Expanded spring vocabulary: added `orbital` and `bouncy` presets.
 *   - `HERO_SCROLL_CONFIG` range values now typed as const tuples (unchanged values).
 *
 * MERGE NOTES:
 *   - Absorbed the v15.0 lib/motion.ts exports into this canonical module.
 *   - Preserved the V1 scroll-smoothness pass and retained the newer, calmer timings.
 *   - mobileReducedVariant only reduces timing values on mobile; it never mutates transforms.
 *   - viewportOnceDefault remains a backward-compat alias for viewportOnce.
 *
 * ARCHITECTURE CONSTRAINT:
 *   Do NOT add `useScroll` or `useTransform` framer-motion hooks in any component
 *   mounted on the homepage — they create page-level scroll subscribers that
 *   compete with Lenis. GSAP ScrollTrigger / useScrollCinema are the scroll
 *   primitives for the homepage cinematic system.
 *
 * KEEP: all spring vocabulary names, HERO_SCROLL_CONFIG, noMotion,
 * viewportOnce, viewportRelaxed, and every exported variant name from v1.0.
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

  // v1.1 additions
  orbital: { type: 'spring', stiffness: 120, damping: 14, mass: 1.2 } as Transition, // slow, looping feel
  bouncy: { type: 'spring', stiffness: 560, damping: 22, mass: 0.7 } as Transition, // elastic snap for icons
  magnetic: { type: 'spring', stiffness: 500, damping: 32, mass: 0.5 } as Transition, // matches useMagnetic spring
} as const;

const SPRING_STANDARD: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 25,
};

const SPRING_STANDARD_EXIT: Transition = {
  type: 'spring',
  stiffness: 180,
  damping: 20,
};

const SPRING_DRAMATIC_REVEAL: Transition = {
  type: 'spring',
  stiffness: 160,
  damping: 20,
  mass: 1.2,
};


const SPRING_LETTER_REVEAL: Transition = {
  type: 'spring',
  stiffness: 280,
  damping: 24,
  mass: 0.8,
};

const SPRING_CLIP_REVEAL: Transition = {
  type: 'spring',
  stiffness: 90,
  damping: 22,
  mass: 1.1,
};

const SPRING_SCALE_X_REVEAL: Transition = {
  type: 'spring',
  stiffness: 120,
  damping: 18,
  mass: 0.9,
};

const SPRING_ACCORDION_HEIGHT: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 26,
};

const SPRING_SPOTLIGHT_CLIP: Transition = {
  type: 'spring',
  stiffness: 80,
  damping: 20,
  mass: 1.2,
};

const SPRING_PROGRESS_FILL: Transition = {
  type: 'spring',
  stiffness: 90,
  damping: 20,
  mass: 0.9,
};

const SPRING_SHARED_LAYOUT: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
  mass: 0.8,
};

/**
 * springConfig — canonical alias for springs.smooth.
 * Used by legacy components. New code should use springs.smooth directly.
 */
export const springConfig: Transition = springs.smooth;

export const hoverLift = (y = -3) => ({ y, transition: springs.layout });
export const hoverNudgeX = (x = 2) => ({ x, transition: springs.layout });

/* ═══════════ VIEWPORT CONFIG ════════════════════════════════════════════ */

export const viewportOnce = { once: true, margin: '-80px' } as const;
export const viewportRelaxed = { once: true, margin: '-40px' } as const;
export const viewportTight = { once: true, margin: '-120px' } as const;
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
 * @param stagger  delay between children (default 0.065s)
 * @param delay    initial delay before first child (default 0.04s)
 */
export const staggerContainer = (stagger = 0.065, delay = 0.04): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
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

/** fadeRise — body text, secondary elements, proof cards */
export const fadeRise: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: springs.smooth },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

/** fadeRiseSmooth — gentle spring for narrative body text */
export const fadeRiseSmooth: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: springs.gentle },
  exit: { opacity: 0, y: -6, transition: { duration: 0.15 } },
};

/** fadeRiseGentle — for large elements like hero sub-lines */
export const fadeRiseGentle: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: springs.gentle },
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
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: springs.smooth },
  exit: { opacity: 0, y: -8, filter: 'blur(2px)', transition: { duration: 0.15 } },
};

/** dramaticReveal — for full-width section headings */
export const dramaticReveal = (yOffset = 36): Variants => ({
  hidden: { opacity: 0, y: yOffset },
  visible: {
    opacity: 1,
    y: 0,
    transition: SPRING_DRAMATIC_REVEAL,
  },
});

/** sectionEntrance — full-section reveals without scale */
export const sectionEntrance = (yOffset = 20): Variants => ({
  hidden: { opacity: 0, y: yOffset },
  visible: { opacity: 1, y: 0, transition: springs.gentle },
});

/** scaleIn — opacity + subtle scale for dialogs and popovers */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: springs.smooth },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.12 } },
};

/* ═══════════ DIRECTIONAL REVEALS ════════════════════════════════════════ */

export const reveal: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: SPRING_STANDARD },
  exit: { opacity: 0, y: 8, transition: SPRING_STANDARD_EXIT },
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

/** liquidCard — glass card entrance */
export const liquidCard: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: springs.smooth },
  exit: { opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.14 } },
};

/* ═══════════ A24 DIDONE WORD REVEAL ════════════════════════════════════ */

/**
 * wordReveal — for headline word-by-word cinematic reveals.
 * Wrap each word in `overflow-hidden`. Apply this variant to the inner span.
 */
export const wordReveal: Variants = {
  hidden: { y: '110%' },
  visible: { y: '0%', transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] } },
};

export const wordRevealContainer = (stagger = 0.065, delay = 0.1): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

/**
 * letterReveal — per-character reveal for short, high-conviction labels.
 */
export const letterReveal: Variants = {
  hidden: { y: '100%', opacity: 0 },
  visible: {
    y: '0%',
    opacity: 1,
    transition: SPRING_LETTER_REVEAL,
  },
};

export const letterRevealContainer = (stagger = 0.04, delay = 0.05): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

/* ═══════════ CLIP REVEAL ════════════════════════════════════════════════ */

/**
 * clipReveal — left-to-right clip wipe for section headings.
 */
export const clipReveal: Variants = {
  hidden: { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
  visible: {
    clipPath: 'inset(0 0% 0 0)',
    opacity: 1,
    transition: SPRING_CLIP_REVEAL,
  },
};

/* ═══════════ CARD REVEAL ════════════════════════════════════════════════ */

/** cardReveal — for featured/hero cards (singular, high-importance). Includes scale. */
export const cardReveal = (yOffset = 28): Variants => ({
  hidden: { opacity: 0, y: yOffset, scale: 0.972 },
  visible: { opacity: 1, y: 0, scale: 1, transition: springs.smooth },
  exit: { opacity: 0, y: -10, scale: 0.97, transition: { duration: 0.14 } },
});

/** gridItemReveal — for grid items (4+ cards). No scale — prevents compositor pressure. */
export const gridItemReveal = (yOffset = 20): Variants => ({
  hidden: { opacity: 0, y: yOffset },
  visible: { opacity: 1, y: 0, transition: springs.smooth },
  exit: { opacity: 0, y: -8, transition: { duration: 0.13 } },
});

/** glassCardReveal — cardReveal with backdrop-filter settle */
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
    transition: SPRING_SCALE_X_REVEAL,
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
      height: SPRING_ACCORDION_HEIGHT,
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

/**
 * filterTransition — VARIANTS object for filter-driven list transitions.
 *
 * ⚠️  THIS IS A `Variants` OBJECT — NOT A `Transition` CONFIG.
 *
 * CORRECT usage (as `variants` prop on `m.` elements):
 *   <m.div variants={filterTransition} initial="hidden" animate="visible" exit="exit">
 *
 * WRONG usage (as `transition` prop — causes runtime TypeError):
 *   <m.div transition={filterTransition}>   ← CRASHES: "can't access property opacity of undefined"
 *
 * When you need a `transition` prop for a filter grid swap, use an inline
 * Transition config instead:
 *   transition={{ type: 'spring', stiffness: 300, damping: 28 }}
 * or use springs.snappy directly:
 *   transition={springs.snappy}
 *
 * The naming is kept for backward-compat with WritingSection (correct consumer).
 * Do not rename — just read this comment before reaching for it.
 */
export const filterTransition: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: springs.snappy },
  exit: { opacity: 0, y: -4, transition: { duration: 0.1 } },
};

/* ═══════════ HERO PARALLAX ═════════════════════════════════════════════ */

// CONSTRAINT: do NOT use framer-motion useScroll/useTransform on the homepage.
// These values are used by non-homepage pages (blog article heroes, etc.).
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

/* ═══════════ MAGNETIC BUTTON (v1.1) ════════════════════════════════════
 * Use with the `useMagnetic` hook. Apply `style={{ x, y }}` from the hook
 * to the `m.` wrapper and these variants for the tap / hover states.
 *
 * Usage:
 *   const { ref, x, y } = useMagnetic({ strength: 0.3 });
 *   <m.button
 *     ref={ref}
 *     style={{ x, y }}
 *     variants={magneticButton}
 *     whileHover="hover"
 *     whileTap="tap"
 *   />
 */
export const magneticButton: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.04, transition: springs.magnetic },
  tap: { scale: 0.96, transition: { ...springs.decisive, duration: 0.08 } },
};

/**
 * magneticIcon — tighter scale range for icon-only magnetic targets
 * (nav icons, social links, GitHub stars button).
 */
export const magneticIcon: Variants = {
  rest: { scale: 1, rotate: 0 },
  hover: { scale: 1.12, rotate: 3, transition: springs.magnetic },
  tap: { scale: 0.9, rotate: -3, transition: springs.decisive },
};

/* ═══════════ SPOTLIGHT REVEAL (v1.1) ═══════════════════════════════════
 * For elements that should feel like they emerge from a spotlight:
 * a radial clip-path that expands outward from the element center.
 *
 * Use on `<m.div>` with `whileInView="visible"` and viewport={viewportOnce}.
 * Pair with GSAP inside ChapterFrame — this is for standalone non-cinematic
 * components (blog pages, modal interiors, command palette results).
 */
export const spotlightReveal: Variants = {
  hidden: {
    opacity: 0,
    clipPath: 'circle(0% at 50% 50%)',
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    clipPath: 'circle(100% at 50% 50%)',
    scale: 1,
    transition: {
      clipPath: SPRING_SPOTLIGHT_CLIP,
      opacity: { duration: 0.2 },
      scale: springs.gentle,
    },
  },
  exit: {
    opacity: 0,
    clipPath: 'circle(0% at 50% 50%)',
    scale: 0.98,
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
  },
};

/* ═══════════ DRAG INTERACTION (v1.1) ═══════════════════════════════════
 * For draggable proof cards or horizontal carousels.
 * Apply `whileDrag="dragging"` to the draggable `m.` element.
 */
export const draggableCard: Variants = {
  rest: { scale: 1, boxShadow: '0 4px 24px rgba(0,0,0,0.40)', cursor: 'grab' },
  dragging: {
    scale: 1.04,
    boxShadow: '0 24px 64px rgba(0,0,0,0.72)',
    cursor: 'grabbing',
    zIndex: 10,
  },
};

/**
 * dragConstraints — sensible horizontal drag bounds.
 * Pass the container ref as `left` and `right` constraints in the component.
 */
export const dragTransition = {
  power: 0.3,
  timeConstant: 200,
  modifyTarget: (target: number) => Math.round(target),
} as const;

/* ═══════════ SHARED LAYOUT TRANSITION (v1.1) ═══════════════════════════
 * Used with `layoutId` for AnimatePresence shared element transitions.
 * Consistent spring physics for expanding cards, active filter pills, etc.
 */
export const sharedLayoutTransition = {
  layout: SPRING_SHARED_LAYOUT,
} as const;

/**
 * activeTabIndicator — for `layoutId="active-tab"` underline / pill.
 * Wraps the indicator in consistent layout-spring physics.
 */
export const activeTabIndicator = {
  layoutId: 'active-tab',
  transition: sharedLayoutTransition.layout,
} as const;

/* ═══════════ CHAPTER TRANSITION (v1.1) ═════════════════════════════════
 * For UI elements that live outside ChapterFrame but should visually
 * respond to chapter changes (e.g. scroll-progress rail dots, nav accent).
 *
 * Usage: AnimatePresence key={activeChapter} + these variants.
 */
export const chapterBadge: Variants = {
  hidden: { opacity: 0, scale: 0.85, y: 4 },
  visible: { opacity: 1, scale: 1, y: 0, transition: springs.snappy },
  exit: { opacity: 0, scale: 0.9, y: -4, transition: { duration: 0.1 } },
};

export const chapterLabel: Variants = {
  hidden: { opacity: 0, x: -6 },
  visible: { opacity: 1, x: 0, transition: springs.smooth },
  exit: { opacity: 0, x: 6, transition: { duration: 0.1 } },
};

/* ═══════════ NOTIFICATION / TOAST (v1.1) ═══════════════════════════════ */

export const toastEntrance: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.94 },
  visible: { opacity: 1, y: 0, scale: 1, transition: springs.snappy },
  exit: { opacity: 0, y: 8, scale: 0.96, transition: { duration: 0.15, ease: 'easeIn' } },
};

export const toastContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
  exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};

/* ═══════════ PROGRESS BAR (v1.1) ═══════════════════════════════════════ */

/**
 * progressFill — for skill bars, metric bars.
 * Set `--progress` CSS variable on the element and use scaleX from 0 → var(--progress).
 * Or pass a custom `widthTarget` to the visible variant at the call site.
 */
export const progressFill = (widthTarget: string | number = '100%'): Variants => ({
  hidden: { scaleX: 0, opacity: 0.6, originX: 0 },
  visible: {
    scaleX: typeof widthTarget === 'string' ? 1 : widthTarget,
    opacity: 1,
    originX: 0,
    transition: SPRING_PROGRESS_FILL,
  },
});

/* ═══════════ PRESENCE HELPER (v1.1) ════════════════════════════════════
 * Centralised AnimatePresence config objects so mode and initial
 * are consistent across the component tree.
 */
export const presenceConfig = {
  /** Standard: wait for exit before entering (modals, page transitions) */
  wait: { mode: 'wait' as const, initial: false },
  /** Popover: simultaneous enter + exit (tooltips, menus) */
  sync: { mode: 'sync' as const, initial: false },
  /** Pop layout: preserves layout-aware exits for list/toast transitions */
  popout: { mode: 'popLayout' as const, initial: false },
} as const;
