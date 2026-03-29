'use client';

import { m } from 'framer-motion';
import type { CSSProperties, ReactNode } from 'react';

import { useReducedMotion } from '@/hooks/useReducedMotion';
import { springConfig } from '@/lib/motion';
import { cn } from '@/lib/utils';

type TagName = 'article' | 'div' | 'li' | 'section';

export interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  chromatic?: boolean;
  level?: 'full' | 'medium' | 'light';
  as?: TagName;
  id?: string;
  role?: string;
  style?: CSSProperties;
  tabIndex?: number;
  'aria-label'?: string;
  'data-reveal'?: string;
  'data-reveal-delay'?: string;
  'data-project-id'?: string;
}

export function GlassCard({
  children,
  className,
  hover = true,
  chromatic = false,
  level = 'full',
  as = 'div',
  id,
  role,
  style,
  tabIndex,
  'aria-label': ariaLabel,
  'data-reveal': dataReveal,
  'data-reveal-delay': dataRevealDelay,
  'data-project-id': dataProjectId,
}: Readonly<GlassCardProps>) {
  const prefersReducedMotion = useReducedMotion();
  const sharedClassName = cn(
    'glass',
    hover ? 'glass-card' : 'glass-no-hover',
    `glass-${level}`,
    chromatic && 'glass-chromatic',
    className
  );
  const sharedProps = {
    id,
    role,
    style,
    tabIndex,
    'aria-label': ariaLabel,
    'data-reveal': dataReveal,
    'data-reveal-delay': dataRevealDelay,
    'data-project-id': dataProjectId,
  };
  const hoverProps =
    hover && !prefersReducedMotion
      ? {
          whileHover: { scale: 1.01, translateY: -4 },
          transition: springConfig,
        }
      : {};

  if (as === 'article') {
    return (
      <m.article className={sharedClassName} {...hoverProps} {...sharedProps}>
        {children}
      </m.article>
    );
  }

  if (as === 'section') {
    return (
      <m.section className={sharedClassName} {...hoverProps} {...sharedProps}>
        {children}
      </m.section>
    );
  }

  if (as === 'li') {
    return (
      <m.li className={sharedClassName} {...hoverProps} {...sharedProps}>
        {children}
      </m.li>
    );
  }

  return (
    <m.div className={sharedClassName} {...hoverProps} {...sharedProps}>
      {children}
    </m.div>
  );
}
