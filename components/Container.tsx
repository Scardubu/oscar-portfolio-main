// CONVICTION ENGINE — Container.tsx
//
// Centralizes max-width, responsive horizontal padding, and horizontal
// overflow protection across all sections.
//
// The existing globals.css `.container` class does this job well.
// This component wraps it as a typed React primitive for use in new
// sections, ensuring authors can't accidentally compose inconsistent margins.
//
// Use when building new sections or refactoring existing ones.
// Do NOT use inside sections that already use `.container` directly —
// nesting Containers creates double padding.

import clsx from 'clsx';
import { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'aside';
}

export function Container({ children, className, as: Tag = 'div' }: ContainerProps) {
  return (
    <Tag
      className={clsx(
        'container',
        className
      )}
    >
      {children}
    </Tag>
  );
}
