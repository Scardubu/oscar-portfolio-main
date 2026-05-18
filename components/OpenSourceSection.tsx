// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
// Major Reset • Lagos → Global • Production Conviction Architecture
'use client';

import { m, useAnimate, useInView, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { useMemo, useRef } from 'react';

import { anchorUrl } from '@/lib/config';
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
    desc: "Row-Level Security at the engine — not the app. Even when application bugs exist, one tenant's records are mathematically invisible to another. Production-deployed in TaxBridge, where a single data-leak event means regulatory audit.",
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
  {
    name: 'llm-dispatch',
    stack: 'AI · Agent Orchestration',
    desc: 'Triadic model routing extracted from SwarmXQ. Routes tasks to the right local GGUF model — Phi-4-mini for classification, DeepSeek-R1 for reasoning, Qwen2.5-Coder for code — with fallback chains and zero cloud egress.',
    href: 'https://github.com/Scardubu/SwarmXQ',
    install: 'pip install llm-dispatch',
    badge: 'Zero cloud',
    badgeColor: 'oklch(73% 0.17 65)',
    badgeBorder: 'oklch(73% 0.17 65 / 0.25)',
  },
] as const;

// CopyInstall — useAnimate() imperative sequence per Motion Contract Tier 3.
// Sequence: COPY → scale(0.96) → COPIED ✓ (teal border pulse) → reset at 1.8s.
function CopyInstall({ text }: { text: string }) {
  const reducedMotion    = useReducedMotion();
  const [scope, animate] = useAnimate();
  const labelRef         = useRef<HTMLSpanElement>(null);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      return;
    }

    if (labelRef.current) {
      labelRef.current.textContent = 'COPIED ✓';
      labelRef.current.style.color = 'var(--color-success)';
    }

    if (!reducedMotion) {
      await animate(scope.current, { scale: 0.96 }, { duration: 0.08, ease: 'easeIn' });
      await animate(scope.current, { scale: 1    }, { type: 'spring', stiffness: 420, damping: 26 });
      await animate(
        scope.current,
        { borderColor: 'oklch(73% 0.18 196 / 0.5)' },
        { duration: 0.12 }
      );
    }

    await new Promise<void>((res) => setTimeout(res, 1800));

    if (labelRef.current) {
      labelRef.current.textContent = 'COPY';
      labelRef.current.style.color = 'var(--color-text-muted)';
    }
    if (!reducedMotion) {
      void animate(scope.current, { borderColor: 'oklch(100% 0 0 / 0.08)' }, { duration: 0.2 });
    }
  }

  return (
    <button
      ref={scope}
      type="button"
      onClick={() => { void handleCopy(); }}
      aria-label={`Copy install command: ${text}`}
      className="w-full flex items-center justify-between gap-3 rounded-lg border bg-white/[0.03] px-3 py-3 text-left hover:border-white/16 active:scale-[0.98] min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25"
      style={{ borderColor: 'oklch(100% 0 0 / 0.08)' }}
    >
      <code
        className="min-w-0 flex-1 font-mono text-[11px] tracking-wide break-words sm:break-normal"
        style={{ color: 'var(--color-film-teal)' }}
      >
        {text}
      </code>
      <span
        ref={labelRef}
        className="shrink-0 font-mono text-[10px] tracking-widest uppercase min-w-[40px] text-right"
        style={{ color: 'var(--color-text-muted)' }}
        aria-live="polite"
      >
        COPY
      </span>
    </button>
  );
}

export function OpenSourceSection() {
  const ref           = useRef<HTMLElement>(null);
  const inView        = useInView(ref, { once: true, margin: '-40px' });
  const reducedMotion = useReducedMotion();
  const container     = useMemo(() => staggerContainer(0.09, 0.05), []);
  const child         = reducedMotion ? noMotion : fadeRise;
  const card          = useMemo(() => (reducedMotion ? noMotion : cardReveal(24)), [reducedMotion]);

  return (
    <section
      id="open-source"
      ref={ref}
      aria-labelledby="oss-heading"
      className="border-t py-[var(--section-py)] section-deferred overflow-x-clip"
      style={{ borderColor: 'var(--color-border)' }}
    >
      <div className="container">
        <m.div
          variants={container}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {/*
            v24 PATTERN: Editorial intro — section-intro-editorial (layout.css).
            Mobile: kicker, h2, description stack vertically (unchanged).
            lg+: kicker+h2 left column; description right column with editorial weight.
          */}
          <m.div variants={child} className="section-intro-editorial mb-10 sm:mb-12">
            {/* Left: kicker + heading */}
            <div>
              <div className="section-kicker-row mb-4">
                <span className="section-number" aria-hidden="true">02</span>
                <span className="section-label">Open Source</span>
              </div>
              <m.h2
                variants={reducedMotion ? child : clipReveal}
                id="oss-heading"
                className="max-w-[26ch]"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Infrastructure for problems nobody packaged yet.
              </m.h2>
            </div>

            {/* Right: description — v25 copy update per CE spec §P3-C */}
            <div className="lg:flex lg:flex-col lg:justify-end">
              <p
                className="max-w-[52ch] text-base leading-8"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Four production-hardened packages from the fintech trenches — each
                solving a gap that general-purpose libraries don&apos;t address.
                Install in minutes.
              </p>
            </div>
          </m.div>

          {/* Reciprocity frame — V1.0 Change 4: gift framing before proof. Per spec §Reciprocity Engine.
              "extracted from production" signals maturity; "solved for real, then published"
              signals generosity. Must appear before the first package card. */}
          <m.p
            variants={child}
            className="mb-6 max-w-[60ch] text-sm leading-7"
            style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}
          >
            Four packages extracted from production TaxBridge and SabiScore — solved for real,
            then published.
          </m.p>

          {/* Card grid: 1-col mobile → 2-col sm → 4-col xl */}
          <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {OSS_PROJECTS.map((item) => (
              <m.div
                key={item.name}
                variants={card}
                whileHover={
                  reducedMotion
                    ? undefined
                    : { y: -3, transition: { type: 'spring', stiffness: 400, damping: 30 } }
                }
                className="glass-medium flex min-w-0 flex-col rounded-[var(--radius-xl)] p-5 sm:p-7"
              >
                {/* Stack + badge row */}
                <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
                  <p
                    className="label-mono min-w-0 flex-1 pr-2 leading-snug break-words"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {item.stack}
                  </p>
                  <span
                    className="font-mono text-[9px] tracking-widest uppercase px-2 py-0.5 rounded border shrink-0 max-w-full whitespace-normal text-right leading-tight break-words"
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
                  className="mt-3 flex-1 text-sm leading-[1.8] break-words"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {item.desc}
                </p>

                {/* Install command with useAnimate() COPY → COPIED ✓ sequence */}
                <div className="mt-5">
                  <CopyInstall text={item.install} />
                </div>

                {/* GitHub link */}
                <a
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

          {/* Proof strip */}
          <m.div
            variants={child}
            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3"
          >
            {[
              { value: '4',   label: 'production packages', detail: 'npm + pip'              },
              { value: '15+', label: 'merged contributions', detail: 'XGBoost · scikit-learn' },
              { value: 'MIT', label: 'open license',         detail: 'all packages'           },
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

          {/* OSS transparency footer — V1.0 Change 4: eliminates "is this real?" doubt */}
          <m.p
            variants={child}
            className="mt-5 font-mono text-[11px] opacity-40"
            style={{ color: 'var(--color-text-muted)' }}
          >
            All packages are publicly auditable →{' '}
            <a
              href="https://github.com/Scardubu"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:opacity-70 transition-opacity"
              style={{ color: 'var(--color-film-teal)' }}
            >
              GitHub
            </a>
          </m.p>

          {/* Flow hook — V1.0 Change 6b: §Flow Mechanics §Open-source */}
          <m.p
            variants={child}
            className="mt-4 font-mono text-[13px]"
            style={{ opacity: 0.5, letterSpacing: '0.06em', color: 'var(--color-text-muted)' }}
          >
            <Link href={anchorUrl('skills')} className="hover:opacity-80 transition-opacity">
              The stack that makes these possible →
            </Link>
          </m.p>
        </m.div>
      </div>
    </section>
  );
}
