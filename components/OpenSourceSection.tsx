'use client';

import { m, useInView, useReducedMotion } from 'framer-motion';
import { useMemo, useRef } from 'react';

import { cardReveal, fadeRise, noMotion, staggerContainer } from '@/lib/motionVariants';

const OSS_PROJECTS = [
  {
    name: 'pg-tenant',
    stack: 'Node.js · PostgreSQL',
    desc: "Enforces strict database-level data separation between clients. One tenant's records are completely invisible to another even when application-layer bugs exist. Used in production by fintech teams.",
    href: 'https://github.com/Scardubu/pg-tenant',
    label: 'npm i pg-tenant',
  },
  {
    name: 'audit-chain',
    stack: 'Fintech · Compliance',
    desc: 'Generates a cryptographically linked audit log where every entry is mathematically bound to the previous one. Makes retroactive edits or tampering instantly detectable. Built for NRS and GDPR trails.',
    href: 'https://github.com/Scardubu/audit-chain',
    label: 'npm i audit-chain',
  },
  {
    name: 'node-debug-llm',
    stack: 'AI · DevOps',
    desc: 'Streams live system logs and traces to an AI model, which returns a ranked plain-English list of likely root causes — compressing hours of manual incident investigation into minutes.',
    href: 'https://github.com/Scardubu/node-debug-llm',
    label: 'npm i node-debug-llm',
  },
] as const;

export function OpenSourceSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const reducedMotion = useReducedMotion();
  const container = useMemo(() => staggerContainer(0.09, 0.05), []);
  const child = reducedMotion ? noMotion : fadeRise;
  const card = useMemo(() => (reducedMotion ? noMotion : cardReveal(24)), [reducedMotion]);

  return (
    <section
      id="open-source"
      ref={ref}
      aria-labelledby="oss-heading"
      className="border-border border-t py-28 sm:py-32"
    >
      <div className="container">
        <m.div variants={container} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
          <m.span variants={child} className="label">
            <span
              className="text-text-muted mr-3 font-mono text-[10px] tracking-widest select-none"
              aria-hidden="true"
            >
              02
            </span>
            <span>Open source</span>
          </m.span>
          <m.h2 variants={child} id="oss-heading" className="mt-4 max-w-[28ch] text-white">
            Tools built for the problems nobody else solved yet.
          </m.h2>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {OSS_PROJECTS.map((item) => (
              <m.a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                variants={card}
                whileHover={
                  reducedMotion
                    ? undefined
                    : {
                        y: -3,
                        transition: { type: 'spring', stiffness: 400, damping: 30 },
                      }
                }
                className="glass glass-medium group flex flex-col rounded-(--radius-lg) p-6 sm:p-7"
                aria-label={`${item.name} — ${item.stack} on GitHub`}
              >
                <p className="label">{item.stack}</p>
                <h3 className="mt-4 text-white">{item.name}</h3>
                <p className="mt-4 flex-1 text-sm leading-7 text-white/65">{item.desc}</p>
                <div className="mt-6 flex items-center justify-between gap-3 border-t border-(--color-border) pt-5">
                  <span className="font-mono text-[11px] text-(--color-text-muted) transition group-hover:text-(--color-text-secondary)">
                    {item.label}
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 shrink-0 fill-current text-(--color-text-muted) transition group-hover:text-(--color-accent)"
                    aria-hidden="true"
                  >
                    <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.88c-2.77.6-3.35-1.18-3.35-1.18-.46-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.54 2.36 1.1 2.93.84.09-.65.35-1.1.63-1.36-2.21-.25-4.54-1.1-4.54-4.92 0-1.09.39-1.98 1.03-2.67-.1-.25-.45-1.28.1-2.66 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.9-1.29 2.74-1.02 2.74-1.02.56 1.38.21 2.41.11 2.66.64.69 1.03 1.58 1.03 2.67 0 3.83-2.33 4.66-4.56 4.91.36.31.67.92.67 1.86v2.76c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
                  </svg>
                </div>
              </m.a>
            ))}
          </div>

          <m.p variants={child} className="mt-10 font-mono text-xs text-(--color-text-muted)">
            15+ merged contributions to XGBoost & scikit-learn &nbsp;·&nbsp; 12 public repositories
          </m.p>
        </m.div>
      </div>
    </section>
  );
}
