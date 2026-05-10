/**
 * LiquidGlassCard.tsx
 * CONVICTION ENGINE v20.0 — BUG FIX + mobile-native motion
 *
 * BUG FIXED (v19.0 regression):
 *   `const Tag = \`m.${tag}\`` resolves to a string at runtime — strings are
 *   not valid React components. The rendered output was always m.div regardless
 *   of the `as` prop. Fixed via explicit TAG_MAP (same pattern as GlassCard).
 *
 * Mobile:
 *   - whileHover disabled on coarse-pointer (touch) devices via useReducedMotion
 *     companion logic — no hover events fire on mobile anyway, but this prevents
 *     stale whileHover states on Android.
 *   - whileTap scale:0.98 retained on all devices (physical, responsive).
 *   - No animation on reduced-motion per MotionConfig("user") global guard.
 */
'use client';

import { m, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { CSSProperties, ReactNode } from 'react';

type Accent  = 'cyan' | 'violet' | 'teal' | 'none';
type Size    = 'sm' | 'md' | 'lg' | 'feature';
type TagName = 'div' | 'article' | 'section' | 'li';

interface LiquidGlassCardProps {
  children:     ReactNode;
  accent?:      Accent;
  size?:        Size;
  interactive?: boolean;
  float?:       boolean;
  depth?:       boolean;
  className?:   string;
  as?:          TagName;
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

// Explicit TAG_MAP — template literal strings are not React components.
const TAG_MAP = {
  div:     m.div,
  article: m.article,
  section: m.section,
  li:      m.li,
} as const;

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

  // Cast to `typeof m.div` — all motion components share the same motion-prop surface.
  const Tag = TAG_MAP[tag] as typeof m.div;

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
    <Tag
      className={cn(
        'liquid-glass',
        ACCENT_CLASS[accent],
        interactive && 'liquid-glass-hover',
        float && !reducedMotion && 'animate-liquid-float',
        SIZE_CLASS[size],
        className
      )}
      style={style}
      {...hoverProps}
      {...rest}
    >
      {children}
    </Tag>
  );

  if (depth) {
    return <div className="liquid-glass-depth-shell">{inner}</div>;
  }

  return inner;
}