"use client";

export const glassContainerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export const glassItemVariants = {
  hidden: {
    opacity: 0,
    y: 16,
    filter: "blur(6px)",
  },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const glassHoverMotion = {
  whileHover: {
    y: -4,
    scale: 1.01,
    transition: {
      duration: 0.28,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export const glassTapMotion = {
  whileTap: {
    scale: 0.995,
    transition: {
      duration: 0.12,
    },
  },
};

export const glassFloatMotion = {
  animate: {
    y: [0, -6, 0],
  },
  transition: {
    duration: 7,
    repeat: Infinity,
    ease: "easeInOut" as const,
  },
};