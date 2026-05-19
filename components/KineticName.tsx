'use client';

import { m, useReducedMotion } from 'framer-motion';

interface KineticNameProps {
  name: string;
  className?: string;
  id?: string;
}

// Stagger each character by 22ms; spring-settled within ~400ms total.
const CHAR_TRANSITION = (i: number) => ({
  delay: i * 0.022,
  type: 'spring' as const,
  stiffness: 420,
  damping: 32,
  mass: 0.9,
});

export function KineticName({ name, className, id }: Readonly<KineticNameProps>) {
  const reducedMotion = useReducedMotion();
  const chars = name.split('');

  return (
    <h1
      id={id}
      aria-label={name}
      className={['flex flex-wrap gap-x-0', className].filter(Boolean).join(' ')}
    >
      {chars.map((char, i) => (
        <m.span
          key={i}
          aria-hidden="true"
          initial={reducedMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reducedMotion ? { duration: 0 } : CHAR_TRANSITION(i)}
          className="inline-block"
        >
          {char === ' ' ? '\u00A0' : char}
        </m.span>
      ))}
    </h1>
  );
}
