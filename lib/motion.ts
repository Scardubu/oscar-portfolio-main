import type { Variants } from 'framer-motion';

export const springConfig = {
  type: 'spring',
  stiffness: 300,
  damping: 25,
} as const;

/** Named spring presets used by NavBar and interactive components */
export const springs = {
  snappy: { type: 'spring', stiffness: 400, damping: 28 } as const,
  smooth: { type: 'spring', stiffness: 260, damping: 22 } as const,
  gentle: { type: 'spring', stiffness: 180, damping: 20 } as const,
  bouncy: { type: 'spring', stiffness: 350, damping: 18 } as const,
  layout: { type: 'spring', stiffness: 300, damping: 30, mass: 0.8 } as const,
  default: { type: 'spring', stiffness: 300, damping: 25 } as const,
};

/** Reusable viewport options — element animates once when it enters the viewport */
export const viewportOnce = { once: true, margin: '-60px' } as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: springConfig },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: springConfig },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

/** Mobile nav panel — slides down from top */
export const mobileMenu: Variants = {
  hidden: { opacity: 0, y: -8, scaleY: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scaleY: 1,
    transition: { ...springs.smooth, staggerChildren: 0.05, delayChildren: 0.04 },
  },
  exit: {
    opacity: 0,
    y: -6,
    scaleY: 0.97,
    transition: { duration: 0.18, ease: [0.65, 0, 0.35, 1] },
  },
};

/** Container for staggered mobile menu items */
export const mobileMenuItems: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.055, delayChildren: 0.06 } },
  exit: {},
};

/** Individual mobile menu link */
export const mobileMenuItem: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: springs.snappy },
  exit: { opacity: 0, x: -6, transition: { duration: 0.12 } },
};
