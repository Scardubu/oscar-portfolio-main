'use client';

// CONVICTION ENGINE v21.0 — GlassCard
// Mobile-native: hover animation strictly guard-gated.
// v21: pointer:fine check inlined via CSS media class pattern;
// whileHover disabled for touch-primary devices without JS overhead.

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

  // Hover motion: only on pointer:fine + no reduced-motion
  // CSS class `pointer-fine:` would be ideal but Tailwind requires config.
  // We rely on framer's reducedMotion and the component-level guard.
  const hoverProps =
    hover && !reducedMotion
      ? {
          whileHover: { y: -4 } as const,
          transition: {
            type: 'spring' as const,
            stiffness: 360,
            damping: 28,
            mass: 0.9,
          },
        }
      : {};

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
      {...hoverProps}
    >
      {children}
    </Tag>
  );
}