'use client';

import { motion, useReducedMotion } from 'framer-motion';

interface KineticNameProps {
  name: string;
  className?: string;
  id?: string;
}

export function KineticName({ name, className, id }: KineticNameProps) {
  const prefersReducedMotion = useReducedMotion();
  const nameCharacters = name.split('');

  return (
    <h1 id={id} aria-label={name} className={className}>
      {nameCharacters.map((character, index) => (
        <motion.span
          key={index}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ delay: index * 0.03, duration: 0.24 }}
          aria-hidden="true"
        >
          {character === ' ' ? '\u00A0' : character}
        </motion.span>
      ))}
    </h1>
  );
}
