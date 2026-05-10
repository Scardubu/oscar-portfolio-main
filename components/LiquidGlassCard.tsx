/**
 * LiquidGlassCard.tsx
 * CONVICTION ENGINE v19.0 — mobile-native motion + design-system alignment
 *
 * - Interactive cards: spring lift on hover (desktop), scale on tap (all)
 * - Framer Motion m.* used correctly (requires LazyMotion in MotionProvider)
 * - depth shell: gradient border wrapper
 */
'use client';

import { m, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { CSSProperties, ReactNode } from 'react';

type Accent  = 'cyan' | 'violet' | 'teal' | 'none';
type Size    = 'sm' | 'md' | 'lg' | 'feature';

interface LiquidGlassCardProps {
  children:     ReactNode;
  accent?:      Accent;
  size?:        Size;
  interactive?: boolean;
  float?:       boolean;
  depth?:       boolean;
  className?:   string;
  as?:          'div' | 'article' | 'section' | 'li';
  style?:       CSSProperties;
  'data-reveal'?: string;
  [key: string]: unknown;
}

const ACCENT_CLASS: Record<Accent, string> = {
  cyan:   'liquid-glass-cyan',
  violet: 'liquid-glass-violet',
  teal:   'liquid-glass-teal',
  none:   '',
};

const SIZE_CLASS: Record<Size, string> = {
  sm:      'bento-cell-sm',
  md:      'bento-cell',
  lg:      'bento-cell',
  feature: 'bento-cell-feature',
};

const HOVER_SPRING = { type: 'spring', stiffness: 340, damping: 26, mass: 0.9 } as const;
const TAP_SPRING   = { type: 'spring', stiffness: 400, damping: 30 } as const;

export function LiquidGlassCard({
  children,
  accent      = 'none',
  size        = 'md',
  interactive = false,
  float       = false,
  depth       = false,
  className,
  as:         tag = 'div',
  style,
  ...rest
}: Readonly<LiquidGlassCardProps>) {
  const reducedMotion = useReducedMotion();

  const Tag = `m.${tag}` as unknown as typeof m.div;

  const hoverProps = interactive && !reducedMotion
    ? {
        whileHover: { y: -4, boxShadow: 'var(--glass-shadow-hover)' },
        whileTap:   { scale: 0.98 },
        transition: HOVER_SPRING,
      }
    : interactive && reducedMotion
    ? { whileTap: { scale: 0.98 }, transition: TAP_SPRING }
    : {};

  const inner = (
    <m.div
      className={cn(
        'liquid-glass',
        ACCENT_CLASS[accent],
        interactive && 'liquid-glass-hover',
        float && !reducedMotion && 'animate-liquid-float',
        SIZE_CLASS[size],
        className
      )}
      // eslint-disable-next-line no-restricted-syntax
      style={style}
      {...hoverProps}
      {...rest}
    >
      {children}
    </m.div>
  );

  if (depth) {
    return <div className="liquid-glass-depth-shell">{inner}</div>;
  }

  return inner;
}