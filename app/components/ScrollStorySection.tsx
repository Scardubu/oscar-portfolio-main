'use client';

import { motion, useReducedMotion } from 'framer-motion';

import type { StoryCard } from '@/app/lib/homepage';

interface ScrollStorySectionProps {
  id: string;
  eyebrow: string;
  title: string;
  copy: string;
  cards: StoryCard[];
}

export function ScrollStorySection({ id, eyebrow, title, copy, cards }: ScrollStorySectionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section id={id} className="scroll-mt-28 pb-16 md:pb-24">
      <div className="mb-6 space-y-3 md:mb-10">
        <p className="text-xs tracking-[0.24em] text-[var(--text-secondary)] uppercase">
          {eyebrow}
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-balance text-[var(--text-primary)] md:text-5xl">
          {title}
        </h2>
        <p className="max-w-3xl text-base leading-7 text-pretty text-[var(--text-secondary)] md:text-lg">
          {copy}
        </p>
      </div>

      <div className="grid gap-[var(--bento-gap)] lg:grid-cols-3">
        {cards.map((card, index) => (
          <motion.article
            key={`${id}-${card.title}`}
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: index * 0.08 }}
            className="glass-surface glass-surface-light bento-cell bento-cell--tall flex h-full flex-col gap-4 rounded-[1.5rem]"
          >
            <div className="space-y-3">
              <p className="text-xs tracking-[0.22em] text-[var(--accent-primary)] uppercase">
                {card.eyebrow}
              </p>
              <h3 className="text-xl font-semibold tracking-tight text-[var(--text-primary)] md:text-2xl">
                {card.title}
              </h3>
            </div>
            <p className="text-sm leading-7 text-[var(--text-secondary)] md:text-base">
              {card.body}
            </p>
            {card.evidence ? (
              <p className="mt-auto border-t border-white/8 pt-4 text-sm text-[var(--text-secondary)]">
                <span className="text-[var(--text-primary)]">Evidence:</span> {card.evidence}
              </p>
            ) : null}
          </motion.article>
        ))}
      </div>
    </section>
  );
}
