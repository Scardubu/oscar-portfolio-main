'use client';
/**
 * components/ui/KineticHeadline.tsx
 * ──────────────────────────────────────────────────────────────────────────
 * Character-level animated headline using Framer Motion.
 * Each character staggered-reveals with a spring easing.
 * Gradient text uses --gradient-accent-text token.
 * Respects prefers-reduced-motion via useReducedMotion().
 * ──────────────────────────────────────────────────────────────────────────
 */

import { m, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface KineticHeadlineProps {
  /** The text to animate character by character */
  text:         string;
  /** Wrapper element — defaults to h1 */
  as?:          'h1' | 'h2' | 'h3' | 'span';
  /** Apply gradient text style */
  gradient?:    boolean;
  /** Stagger delay per character (seconds) */
  stagger?:     number;
  /** Initial reveal delay (seconds) */
  delay?:       number;
  className?:   string;
  /** If false, render as static text (for section headings) */
  animated?:    boolean;
}

const CHAR_VARIANTS = {
  hidden:  { opacity: 0, y: 24,  rotateX: -30, filter: 'blur(4px)' },
  visible: { opacity: 1, y: 0,   rotateX:   0, filter: 'blur(0px)' },
};

const WORD_VARIANTS = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0  },
};

export default function KineticHeadline({
  text,
  as: Tag  = 'h1',
  gradient  = false,
  stagger   = 0.028,
  delay     = 0,
  className,
  animated  = true,
}: KineticHeadlineProps) {
  const shouldReduce = useReducedMotion();

  const containerVariants = {
    hidden:  {},
    visible: {
      transition: {
        staggerChildren:  shouldReduce ? 0 : stagger,
        delayChildren:    delay,
      },
    },
  };

  const charVariant = shouldReduce ? WORD_VARIANTS : CHAR_VARIANTS;

  const charTransition = {
    duration:  shouldReduce ? 0.3 : 0.5,
    ease:      [0.34, 1.56, 0.64, 1] as [number,number,number,number], // spring
  };

  if (!animated) {
    return (
      <Tag
        className={cn(
          gradient && 'text-gradient-kinetic',
          className
        )}
      >
        {text}
      </Tag>
    );
  }

  // Split into words to enable line wrapping, animate per-character
  const words = text.split(' ');

  return (
    <m.div variants={containerVariants} initial="hidden" animate="visible" aria-label={text}>
      <Tag
        className={cn('inline', gradient && 'text-gradient-kinetic', className)}
        aria-hidden="true"
      >
        {words.map((word, wi) => (
          <span key={wi} className="inline-block whitespace-nowrap">
            {word.split('').map((char, ci) => (
              <m.span
                key={ci}
                variants={charVariant}
                transition={charTransition}
                className="inline-block origin-bottom"
              >
                {char}
              </m.span>
            ))}
            {/* Non-breaking space between words */}
            {wi < words.length - 1 && (
              <m.span
                variants={charVariant}
                transition={charTransition}
                className="inline-block"
              >
                &nbsp;
              </m.span>
            )}
          </span>
        ))}
      </Tag>
    </m.div>
  );
}
