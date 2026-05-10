'use client';
/**
 * KineticHeadline.tsx — CONVICTION ENGINE v19.0
 * Word-by-word spring reveal using Framer Motion variants.
 * Replaces CSS keyframe approach (FOUC risk, no spring physics).
 *
 * Each word clips via overflow:hidden wrapper + translateY spring.
 * IntersectionObserver triggers the animate state.
 * MotionConfig(reducedMotion="user") in MotionProvider handles global guard.
 */

import { m, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';
import { springs } from '@/lib/motionVariants';

interface KineticHeadlineProps {
  text:       string;
  as?:        'h1' | 'h2' | 'h3' | 'p' | 'span';
  gradient?:  'accent' | 'kinetic' | 'fintech' | false;
  size?:      'display' | 'kinetic' | 'headline';
  className?: string;
  delay?:     number;   // per-word stagger delay in ms (default: 55)
  once?:      boolean;
}

const SIZE_CLASS: Record<NonNullable<KineticHeadlineProps['size']>, string> = {
  display:  'text-display',
  kinetic:  'text-kinetic',
  headline: 'text-headline',
};

const GRADIENT_CLASS: Record<NonNullable<Exclude<KineticHeadlineProps['gradient'], false>>, string> = {
  accent:  'text-gradient-accent',
  kinetic: 'text-gradient-kinetic',
  fintech: 'text-gradient-fintech',
};

// Word-level spring — slightly heavier mass for large headline letterforms
const WORD_SPRING = {
  ...springs.gentle,
  mass: 1.05,
} as const;

export function KineticHeadline({
  text,
  as:       Tag     = 'h1',
  gradient           = false,
  size               = 'kinetic',
  className,
  delay              = 55,
  once               = true,
}: Readonly<KineticHeadlineProps>) {
  const ref                    = useRef<HTMLElement | null>(null);
  const [visible, setVisible]  = useState(false);
  const reducedMotion          = useReducedMotion();
  const words                  = text.split(' ');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // With reducedMotion, reveal immediately (MotionConfig handles animation suppression)
    if (reducedMotion) {
      setVisible(true);
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          if (once) obs.unobserve(el);
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold: 0.08 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [once, reducedMotion]);

  return (
    <Tag
      ref={ref}
      aria-label={text}
      className={cn(
        SIZE_CLASS[size],
        gradient && GRADIENT_CLASS[gradient],
        'flex flex-wrap gap-x-[0.22em] gap-y-0',
        className
      )}
    >
      {words.map((word, i) => (
        // Clip container: overflow:hidden so translateY slides from below
        <span
          key={i}
          aria-hidden="true"
          style={{ overflow: 'hidden', display: 'inline-block', lineHeight: 'inherit' }}
        >
          <m.span
            style={{ display: 'inline-block' }}
            initial={{ opacity: 0, y: '0.6em' }}
            animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: '0.6em' }}
            transition={
              reducedMotion
                ? { duration: 0 }
                : { ...WORD_SPRING, delay: i * (delay / 1000) }
            }
          >
            {word}
          </m.span>
        </span>
      ))}
    </Tag>
  );
}