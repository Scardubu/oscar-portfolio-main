'use client';

// CONVICTION ENGINE v20.0 — GlassCard
// Mobile-native: translateY-only hover (no scale = no GPU repaint on Android).
//
// v20 changes:
//   • TAG_MAP: `satisfies Record<TagName, typeof m.div>` — TypeScript catches
//     missing entries at compile time, not at runtime.
//   • HOVER_SPRING: moved whileHover props inline so the `transition` key is
//     co-located with the motion that uses it — prevents confusion with
//     MotionConfig defaultTransition.
//   • min-h-[inherit]: removed implicit minHeight contract — let consumers own sizing.
//   • aria-label: forwarded directly to the motion element — NVDA/VoiceOver
//     now announces the label on the card element itself, not a wrapper div.

import { m, useReducedMotion } from 'framer-motion';
import type { CSSProperties, ReactNode } from 'react';

import { cn } from '@/lib/utils';

type TagName = 'article' | 'div' | 'li' | 'section';

export interface GlassCardProps {
  children:             ReactNode;
  className?:           string;
  hover?:               boolean;
  chromatic?:           boolean;
  level?:               'full' | 'medium' | 'light';
  as?:                  TagName;
  id?:                  string;
  role?:                string;
  style?:               CSSProperties;
  tabIndex?:            number;
  'aria-label'?:        string;
  'data-reveal'?:       string;
  'data-reveal-delay'?: string;
  'data-project-id'?:   string;
}

const TAG_MAP = {
  article: m.article,
  div:     m.div,
  li:      m.li,
  section: m.section,
} as const satisfies Record<TagName, typeof m.div>;

export function GlassCard({
  children,
  className,
  hover     = true,
  chromatic = false,
  level     = 'full',
  as        = 'div',
  id,
  role,
  style,
  tabIndex,
  'aria-label':        ariaLabel,
  'data-reveal':       dataReveal,
  'data-reveal-delay': dataRevealDelay,
  'data-project-id':   dataProjectId,
}: Readonly<GlassCardProps>) {
  const reducedMotion = useReducedMotion();

  const Tag = TAG_MAP[as];

  const cardClass = cn(
    'glass',
    hover ? 'glass-card' : 'glass-no-hover',
    `glass-${level}`,
    chromatic && 'glass-chromatic',
    className
  );

  return (
    <Tag
      id={id}
      role={role}
      style={style}
      tabIndex={tabIndex}
      aria-label={ariaLabel}
      data-reveal={dataReveal}
      data-reveal-delay={dataRevealDelay}
      data-project-id={dataProjectId}
      className={cardClass}
      {...(hover && !reducedMotion
        ? {
            whileHover: { y: -4 },
            transition: { type: 'spring', stiffness: 360, damping: 28, mass: 0.9 },
          }
        : {})}
    >
      {children}
    </Tag>
  );
}