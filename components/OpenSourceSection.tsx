// CONVICTION ENGINE v21.0 — OpenSourceSection
// Mobile-native: single column on mobile, 3-col on md+.
// Lagos, Nigeria → Global.
//
// v21 changes vs v20:
//   • Section headline: more specific, names the infrastructure category.
//   • Card copy: first sentence is the outcome (not the mechanism).
//   • GitHub CTA: elevated border treatment for higher visual weight.
//   • Proof strip: metric dots upgraded to named metric badges.
//   • Install button: visual feedback ring on focus for keyboard users.
//   • whileHover guard: reducedMotion check before assignment.
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
    desc: 'Row-Level Security at the engine — not the app. Even when application bugs exist, one tenant\'s records are mathematically invisible to another. Used in production by fintech teams where a single data-leak event means regulatory audit.',
    href: 'https://github.com/Scardubu/pg-tenant',
    install: 'npm i pg-tenant',
    badge: 'Production-grade',
    badgeColor: 'var(--color-film-teal)',
    badgeBorder: 'oklch(73% 0.18 196 / 0.25)',
  },
  {
    name: 'audit-chain',
    stack: 'Fintech · Compliance',
    desc: 'Retroactive tampering becomes mathematically detectable. Every log entry is cryptographically bound to the previous — any edit breaks the chain instantly. Built for NRS and GDPR trails where proof of integrity is non-negotiable.',
    href: 'https://github.com/Scardubu/audit-chain',
    install: 'npm i audit-chain',
    badge: 'NRS · GDPR',
    badgeColor: 'oklch(72% 0.17 160)',
    badgeBorder: 'oklch(72% 0.17 160 / 0.25)',
  },
  {
    name: 'node-debug-llm',
    stack: 'AI · DevOps',
    desc: 'Incident triage in minutes, not hours. Streams live system logs and traces to an AI model, returning a ranked plain-English list of likely root causes — with full context, not just stack traces.',
    href: 'https://github.com/Scardubu/node-debug-llm',
    install: 'npm i node-debug-llm',
    badge: 'AI-powered',
    badgeColor: 'oklch(75% 0.16 300)',
    badgeBorder: 'oklch(75% 0.16 300 / 0.25)',
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
      className="w-full flex items-center justify-between gap-3 rounded-lg border bg-white/[0.03] px-3 py-3 text-left transition hover:border-white/16 active:scale-[0.98] min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25"
      style={{ borderColor: copied ? 'oklch(73% 0.18 196 / 0.5)' : 'oklch(100% 0 0 / 0.08)' }}
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
        {copied ? '✓ Done' : 'Copy'}
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
            className="mb-4 max-w-[26ch]"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Infrastructure for problems nobody packaged yet.
          </m.h2>

          <m.p
            variants={child}
            className="mb-10 sm:mb-12 max-w-[56ch] text-base leading-8"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Three production-hardened packages from the fintech trenches —
            each solving a gap that general-purpose libraries don't address.
            Install in minutes.
          </m.p>

          {/* Card grid */}
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
                    className="font-mono text-[9px] tracking-widest uppercase px-2 py-0.5 rounded border shrink-0"
                    style={{
                      color: item.badgeColor,
                      borderColor: item.badgeBorder,
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
                
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${item.name} on GitHub (opens in new tab)`}
                  className="mt-3 flex items-center justify-between gap-3 min-h-[48px] border-t pt-4 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25 rounded-sm"
                  style={{
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  <span className="font-mono text-[11px] tracking-wide uppercase transition group-hover:text-white">
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

          {/* Proof strip — metric-weight signals */}
          <m.div
            variants={child}
            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3"
          >
            {[
              { value: '15+', label: 'merged contributions', detail: 'XGBoost · scikit-learn' },
              { value: '12', label: 'public repositories', detail: 'GitHub' },
              { value: 'MIT', label: 'open license', detail: 'all packages' },
            ].map(({ value, label, detail }) => (
              <div key={value + label} className="flex items-baseline gap-2">
                <span
                  className="font-mono text-sm font-semibold"
                  style={{ color: 'var(--color-film-teal)' }}
                >
                  {value}
                </span>
                <span
                  className="font-mono text-[11px]"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {label}
                </span>
                <span
                  className="hidden sm:inline font-mono text-[10px]"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  · {detail}
                </span>
              </div>
            ))}
          </m.div>
        </m.div>
      </div>
    </section>
  );
}