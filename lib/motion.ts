import type { Transition, Variants } from 'framer-motion';

/**
 * CORE SPRING SYSTEM
 * Single source of truth for all motion behavior
 */
export const springs = {
  snappy: { type: 'spring', stiffness: 420, damping: 30 },
  smooth: { type: 'spring', stiffness: 260, damping: 24 },
  gentle: { type: 'spring', stiffness: 180, damping: 20 },
  bouncy: { type: 'spring', stiffness: 360, damping: 18 },
  layout: { type: 'spring', stiffness: 300, damping: 28, mass: 0.8 },
  default: { type: 'spring', stiffness: 300, damping: 25 },
} as const;

/**
 * VIEWPORT CONFIG
 * Ensures consistent scroll-triggered behavior
 */
export const viewportOnce = {
  once: true,
  margin: '-80px',
} as const;

/**
 * BASE REVEAL (SYSTEM PRIMITIVE)
 * Used across hero, sections, cards
 */
export const reveal: Variants = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: springs.default,
  },
  exit: {
    opacity: 0,
    y: 8,
    transition: springs.gentle,
  },
};

/**
 * DIRECTIONAL REVEALS (SPATIAL INTELLIGENCE)
 * Enforces non-flat motion system
 */
export const revealLeft: Variants = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: springs.snappy },
  exit: { opacity: 0, x: -8, transition: springs.gentle },
};

export const revealRight: Variants = {
  hidden: { opacity: 0, x: 16 },
  visible: { opacity: 1, x: 0, transition: springs.snappy },
  exit: { opacity: 0, x: 8, transition: springs.gentle },
};

/**
 * SCALE ENTRY (USED FOR CARDS / MODALS)
 */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: springs.smooth },
  exit: { opacity: 0, scale: 0.98, transition: springs.gentle },
};

/**
 * STAGGER SYSTEM (MANDATORY FOR GROUPS)
 */
export const stagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.045,
      delayChildren: 0.08,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
};

/**
 * HERO SEQUENCE (FAST, CONTROLLED)
 * Must complete <300ms perceived time
 */
export const heroContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.05,
    },
  },
};

export const heroItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springs.snappy,
  },
};

/**
 * MOBILE NAV PANEL
 */
export const mobileMenu: Variants = {
  hidden: {
    opacity: 0,
    y: -10,
    scaleY: 0.96,
  },
  visible: {
    opacity: 1,
    y: 0,
    scaleY: 1,
    transition: {
      ...springs.smooth,
      staggerChildren: 0.05,
      delayChildren: 0.04,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    scaleY: 0.97,
    transition: springs.gentle,
  },
};

export const mobileMenuItems: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
};

export const mobileMenuItem: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: springs.snappy,
  },
  exit: {
    opacity: 0,
    x: -6,
    transition: springs.gentle,
  },
};

/**
 * INTERACTION STATES (HOVER / TAP)
 */
export const interactive = {
  hover: {
    scale: 1.02,
    transition: springs.snappy,
  },
  tap: {
    scale: 0.97,
    transition: springs.gentle,
  },
};

/**
 * FILTER / LIST TRANSITIONS (CRITICAL FOR TheCut)
 */
export const listItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springs.default,
  },
  exit: {
    opacity: 0,
    y: 6,
    transition: springs.gentle,
  },
};

/**
 * SPRING CONFIG
 * Generic spring transition object — use as `transition={springConfig}`
 * for one-off interactive elements (ThemeToggle, GlassCard hover, etc.)
 */
export const springConfig: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 24,
};

/**
 * STAGGER CONTAINER (VARIANTS OBJECT — no-call form)
 * For use directly as `variants={staggerContainer}` without calling as a fn.
 * Triggers stagger on all direct motion children.
 */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.04,
      staggerDirection: -1,
    },
  },
};

/**
 * FADE UP
 * Child reveal with upward motion + blur clear.
 * Pair with staggerContainer or stagger.
 */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: springs.smooth },
  exit: { opacity: 0, transition: springs.gentle },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14, filter: 'blur(3px)' },
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
    transition: springs.gentle,
  },
};

/**
 * STAGGER SLOW
 * Relaxed stagger cadence for long card lists (4+ items).
 */
export const staggerSlow: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.1,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.06,
      staggerDirection: -1,
    },
  },
};

/**
 * LIQUID CARD
 * Card reveal with depth cue — for bento grids and feature cards.
 */
export const liquidCard: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: springs.smooth,
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.98,
    transition: springs.gentle,
  },
};

/**
 * FILTER TRANSITION
 * Used by SkillsMap tab panel swap — snappy spring feel.
 */
export const filterTransition: Transition = {
  type: 'spring',
  stiffness: 320,
  damping: 26,
  mass: 0.8,
};

/**
 * PAGE TRANSITION
 * Spring-based page-level enter/exit. Used by PageWrapper AnimatePresence.
 */
export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30, mass: 0.8 },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { type: 'spring', stiffness: 300, damping: 30, mass: 0.8, duration: 0.15 },
  },
};
