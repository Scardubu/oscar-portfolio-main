'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { CSSProperties, ReactNode } from 'react';
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
      <motion.article className={sharedClassName} {...hoverProps} {...sharedProps}>
        {children}
      </motion.article>
    );
  }

  if (as === 'section') {
    return (
      <motion.section className={sharedClassName} {...hoverProps} {...sharedProps}>
        {children}
      </motion.section>
    );
  }

  if (as === 'li') {
    return (
      <motion.li className={sharedClassName} {...hoverProps} {...sharedProps}>
        {children}
      </motion.li>
    );
  }

  return (
    <motion.div className={sharedClassName} {...hoverProps} {...sharedProps}>
      {children}
    </motion.div>
  );
}
