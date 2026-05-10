// CONVICTION ENGINE v20.0 — OpenSourceSection
// Mobile-native: single column stack on mobile, 3-col on md+.
// Lagos, Nigeria → Global.
//
// v20 changes:
//   • CopyInstall: min-h-[48px] for reliable thumb tap.
//   • Desc copy: outcome-first, benefit-led sentence structure.
//   • Footer proof: elevated to a metric strip for visual density.
//   • GitHub CTA: explicit icon + label, not icon-only.
//   • Card: pb-0 on mobile to let CTA sit at natural thumb zone.
'use client';

import { m, useInView, useReducedMotion } from 'framer-motion';
import { useMemo, useRef, useState } from 'react';

import {
  cardReveal,
  clipReveal,
  fadeRise,
  noMotion,
  staggerContainer,
} from '@/lib/motionVariants';

const OSS_PROJECTS = [
  {
    name: 'pg-tenant',
    stack: 'Node.js · PostgreSQL',
    desc: 'Eliminates cross-tenant data leaks at the database engine level — not the application layer. Even when application bugs exist, one tenant\'s records remain completely invisible to another. Used in production by fintech teams.',
    href: 'https://github.com/Scardubu/pg-tenant',
    install: 'npm i pg-tenant',
    badge: 'Production-grade',
  },
  {
    name: 'audit-chain',
    stack: 'Fintech · Compliance',
    desc: 'Makes retroactive tampering mathematically detectable. Every audit log entry is cryptographically bound to the previous one — any edit breaks the chain. Built for NRS and GDPR compliance trails where proof of integrity is non-negotiable.',
    href: 'https://github.com/Scardubu/audit-chain',
    install: 'npm i audit-chain',
    badge: 'NRS · GDPR',
  },
  {
    name: 'node-debug-llm',
    stack: 'AI · DevOps',
    desc: 'Turns hours of incident triage into minutes. Streams live system logs and traces to an AI model, which returns a ranked plain-English list of likely root causes — with context, not just stack traces.',
    href: 'https://github.com/Scardubu/node-debug-llm',
    install: 'npm i node-debug-llm',
    badge: 'AI-powered',
  },
] as const;

function CopyInstall({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    void navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`Copy install command: ${text}`}
      className="w-full flex items-center justify-between gap-3 rounded-lg border border-white/08 bg-white/04 px-3 py-3 text-left transition hover:border-white/16 active:scale-[0.98] min-h-[48px]"
    >
      <code
        className="font-mono text-[11px] tracking-wide truncate"
        style={{ color: 'var(--color-film-teal)' }}
      >
        {text}
      </code>
      <span
        className="shrink-0 font-mono text-[10px] tracking-widest uppercase transition min-w-[40px] text-right"
        style={{ color: copied ? 'var(--color-success)' : 'var(--color-text-muted)' }}
        aria-live="polite"
      >
        {copied ? '✓ Copied' : 'Copy'}
      </span>
    </button>
  );
}

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
      className="border-t py-[var(--section-py)]"
      style={{ borderColor: 'var(--color-border)' }}
    >
      <div className="container">
        <m.div
          variants={container}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {/* Section kicker */}
          <m.div variants={child} className="section-kicker-row mb-8 sm:mb-12">
            <span className="section-number" aria-hidden="true">02</span>
            <span className="section-label">Open Source</span>
          </m.div>

          <m.h2
            variants={reducedMotion ? child : clipReveal}
            id="oss-heading"
            className="mb-4 max-w-[28ch]"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Tools built for the problems nobody else solved yet.
          </m.h2>

          <m.p
            variants={child}
            className="mb-10 sm:mb-12 max-w-[58ch] text-base leading-8"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Open-source infrastructure from the fintech trenches — battle-tested in
            production, installable in minutes.
          </m.p>

          {/* Card grid: 1 col → 3 col */}
          <div className="grid gap-4 sm:gap-5 md:grid-cols-3">
            {OSS_PROJECTS.map((item) => (
              <m.div
                key={item.name}
                variants={card}
                whileHover={
                  reducedMotion
                    ? undefined
                    : { y: -3, transition: { type: 'spring', stiffness: 400, damping: 30 } }
                }
                className="glass-medium flex flex-col rounded-[var(--radius-xl)] p-5 sm:p-7"
              >
                {/* Stack + badge row */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <p className="label-mono" style={{ color: 'var(--color-text-muted)' }}>
                    {item.stack}
                  </p>
                  <span
                    className="font-mono text-[9px] tracking-widest uppercase px-2 py-0.5 rounded border"
                    style={{
                      color: 'var(--color-film-teal)',
                      borderColor: 'oklch(73% 0.18 196 / 0.2)',
                    }}
                  >
                    {item.badge}
                  </span>
                </div>

                <h3
                  className="text-lg font-semibold tracking-tight"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {item.name}
                </h3>

                <p
                  className="mt-3 flex-1 text-sm leading-[1.8]"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {item.desc}
                </p>

                {/* Install command */}
                <div className="mt-5">
                  <CopyInstall text={item.install} />
                </div>

                {/* GitHub CTA */}
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${item.name} on GitHub (opens in new tab)`}
                  className="mt-3 flex items-center justify-between gap-3 min-h-[48px] border-t pt-4 group"
                  style={{
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  <span
                    className="font-mono text-[11px] tracking-wide uppercase transition group-hover:text-white"
                  >
                    View on GitHub
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 shrink-0 fill-current transition group-hover:text-white"
                    aria-hidden="true"
                  >
                    <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.88c-2.77.6-3.35-1.18-3.35-1.18-.46-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.54 2.36 1.1 2.93.84.09-.65.35-1.1.63-1.36-2.21-.25-4.54-1.1-4.54-4.92 0-1.09.39-1.98 1.03-2.67-.1-.25-.45-1.28.1-2.66 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.9-1.29 2.74-1.02 2.74-1.02.56 1.38.21 2.41.11 2.66.64.69 1.03 1.58 1.03 2.67 0 3.83-2.33 4.66-4.56 4.91.36.31.67.92.67 1.86v2.76c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
                  </svg>
                </a>
              </m.div>
            ))}
          </div>

          {/* Proof strip */}
          <m.div
            variants={child}
            className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2"
          >
            {[
              '15+ merged contributions to XGBoost & scikit-learn',
              '12 public repositories',
              'MIT licensed',
            ].map((item) => (
              <span
                key={item}
                className="font-mono text-xs flex items-center gap-2"
                style={{ color: 'var(--color-text-muted)' }}
              >
                <span
                  className="inline-block h-1 w-1 rounded-full"
                  style={{ background: 'var(--color-film-teal)' }}
                  aria-hidden="true"
                />
                {item}
              </span>
            ))}
          </m.div>
        </m.div>
      </div>
    </section>
  );
}