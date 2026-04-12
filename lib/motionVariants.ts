import type { Variants } from 'framer-motion';

export const staggerContainer = (stagger = 0.1, delay = 0): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
      delayChildren: delay,
    },
  },
});

export const fadeRise: Variants = {
  hidden: { opacity: 0, y: 14, filter: 'blur(3px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 280,
      damping: 30,
      mass: 0.7,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.15,
    },
  },
};

export const clipReveal: Variants = {
  hidden: { clipPath: 'inset(0 0 100% 0)', opacity: 0 },
  visible: {
    clipPath: 'inset(0 0 0% 0)',
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 55,
      damping: 20,
      mass: 1.4,
    },
  },
};

export const scaleXReveal: Variants = {
  hidden: { opacity: 0, scaleX: 0.7 },
  visible: {
    opacity: 1,
    scaleX: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 28,
    },
  },
};

export const cardReveal = (yOffset = 24): Variants => ({
  hidden: { opacity: 0, y: yOffset, scale: 0.975 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 24,
      mass: 1,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.97,
    transition: { duration: 0.15 },
  },
});

export const pillarHover = {
  y: -3,
  scale: 1.005,
  transition: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 30,
  },
};

export const scrollIndicatorBounce = {
  y: [0, 8, 0],
  transition: {
    duration: 1.8,
    repeat: Infinity,
    ease: 'easeInOut',
  },
};

export const noMotion: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0 } },
};
