'use client';

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

// Spring: no scale (causes GPU repaint on Android) — translateY only.
const HOVER_SPRING = {
  whileHover: { y: -4 },
  transition:  { type: 'spring', stiffness: 360, damping: 28, mass: 0.9 },
} as const;

const TAG_MAP = {
  article: m.article,
  div:     m.div,
  li:      m.li,
  section: m.section,
} as const;

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

  const props = {
    id,
    role,
    style,
    tabIndex,
    'aria-label':        ariaLabel,
    'data-reveal':       dataReveal,
    'data-reveal-delay': dataRevealDelay,
    'data-project-id':   dataProjectId,
    className:           cardClass,
    ...(hover && !reducedMotion ? HOVER_SPRING : {}),
  };

  return <Tag {...props}>{children}</Tag>;
}