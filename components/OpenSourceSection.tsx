// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
// Major Reset • Lagos → Global • Production Conviction Architecture
'use client';

import { m, useAnimate, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useRef } from 'react';

import { ChapterFrame } from '@/components/cinematic/ChapterFrame';
import { SectionIntro } from '@/components/shared/SectionIntro';
import { getChapterBySectionId } from '@/lib/cinematic/chapters';
import { anchorUrl } from '@/lib/config';
import { cardReveal, clipReveal, fadeRise, hoverLift, noMotion } from '@/lib/motionVariants';

const OSS_PROJECTS = [
  {
    name: 'pg-tenant',
    stack: 'Node.js · PostgreSQL',
    desc: 'A PostgreSQL Row-Level Security helper for moving tenant-isolation policy closer to the database boundary instead of relying only on application checks. The repository documents the implementation and its intended use in multi-tenant systems.',
    metric: 'DB-layer isolation policy',
    metricEvidence: 'Public source repository',
    href: 'https://github.com/Scardubu/pg-tenant',
    install: 'npm i pg-tenant',
    badge: 'Public source',
    badgeColor: 'var(--color-film-teal)',
    badgeBorder: 'oklch(73% 0.18 196 / 0.25)',
  },
  {
    name: 'audit-chain',
    stack: 'Fintech · Auditability',
    desc: 'A hash-linked audit-log pattern designed to make retrospective record changes detectable during integrity checks. The public repository exposes the implementation so the chain construction and verification approach can be inspected directly.',
    metric: 'Hash-linked audit records',
    metricEvidence: 'Public source repository',
    href: 'https://github.com/Scardubu/audit-chain',
    install: 'npm i audit-chain',
    badge: 'Public source',
    badgeColor: 'oklch(72% 0.17 160)',
    badgeBorder: 'oklch(72% 0.17 160 / 0.25)',
  },
  {
    name: 'node-debug-llm',
    stack: 'AI · DevOps',
    desc: 'An incident-triage experiment that turns logs and traces into ranked root-cause suggestions for operator review. Its public source makes the input path and ranking workflow inspectable without presenting an unmeasured time-savings claim.',
    metric: 'Ranked root-cause suggestions',
    metricEvidence: 'Public source repository',
    href: 'https://github.com/Scardubu/node-debug-llm',
    install: 'npm i node-debug-llm',
    badge: 'Public source',
    badgeColor: 'oklch(75% 0.16 300)',
    badgeBorder: 'oklch(75% 0.16 300 / 0.25)',
  },
  {
    name: 'llm-dispatch',
    stack: 'AI · Agent Orchestration',
    desc: 'A local-model routing pattern derived from SwarmXQ. It assigns task classes to different GGUF models and defines fallback chains, with the linked public SwarmXQ source providing the inspectable evidence path for the routing approach.',
    metric: 'Task-aware local routing',
    metricEvidence: 'SwarmXQ public source',
    href: 'https://github.com/Scardubu/SwarmXQ',
    install: 'pip install llm-dispatch',
    badge: 'Source-linked',
    badgeColor: 'oklch(73% 0.17 65)',
    badgeBorder: 'oklch(73% 0.17 65 / 0.25)',
  },
] as const;

// CopyInstall — useAnimate() imperative sequence per Motion Contract Tier 3.
// Sequence: COPY → scale(0.96) → COPIED ✓ (teal border pulse) → reset at 1.8s.
function CopyInstall({ text }: { text: string }) {
  const reducedMotion = useReducedMotion();
  const [scope, animate] = useAnimate();
  const labelRef = useRef<HTMLSpanElement>(null);

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
      await animate(scope.current, { scale: 1 }, { type: 'spring', stiffness: 420, damping: 26 });
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
      onClick={() => {
        void handleCopy();
      }}
      aria-label={`Copy install command: ${text}`}
      className="flex min-h-[48px] w-full items-center justify-between gap-3 rounded-lg border border-[oklch(100%_0_0_/_0.08)] bg-white/[0.03] px-3 py-3 text-left hover:border-white/16 focus-visible:ring-2 focus-visible:ring-[color:var(--chapter-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none active:scale-[0.98]"
    >
      <code className="text-color-film-teal min-w-0 flex-1 font-mono text-[11px] tracking-wide break-words sm:break-normal">
        {text}
      </code>
      <span
        ref={labelRef}
        className="text-color-text-muted min-w-[40px] shrink-0 text-right font-mono text-[10px] tracking-widest uppercase"
        aria-live="polite"
      >
        COPY
      </span>
    </button>
  );
}

export function OpenSourceSection() {
  const reducedMotion = useReducedMotion();
  const chapter = getChapterBySectionId('open-source');
  const child = reducedMotion ? noMotion : fadeRise;
  const card = useMemo(() => (reducedMotion ? noMotion : cardReveal(24)), [reducedMotion]);

  return (
    <ChapterFrame
      chapter={chapter}
      ariaLabelledBy="oss-heading"
      className="border-color-border section-deferred overflow-x-clip"
    >
      <div>
        <m.div variants={child} className="mb-10 sm:mb-12">
          <SectionIntro
            eyebrowNumber="02"
            eyebrowLabel="Open Source"
            headingId="oss-heading"
            title={<>Infrastructure patterns with inspectable source.</>}
            description={
              'Four source-linked packages and experiments focused on tenant isolation, auditability, incident triage, and local-model routing. Each card names the evidence path it can actually support.'
            }
            eyebrowVariant={child}
            titleVariant={reducedMotion ? child : clipReveal}
            descriptionVariant={child}
            titleClassName="text-color-text-primary max-w-[26ch]"
            descriptionClassName="text-color-text-secondary max-w-[52ch] text-base leading-8"
          />
        </m.div>

        <m.p
          variants={child}
          data-cinematic="panel"
          className="text-color-text-muted mb-6 max-w-[60ch] font-mono text-sm leading-7"
        >
          The evidence contract is simple: public-source claims link to public source; private project
          context is not presented as third-party verification.
        </m.p>

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
          {OSS_PROJECTS.map((item) => (
            <m.div
              key={item.name}
              variants={card}
              data-cinematic="card"
              whileHover={reducedMotion ? undefined : hoverLift(-3)}
              className="glass-medium craft-project-card flex min-w-0 flex-col rounded-[var(--radius-xl)] p-5 sm:p-7"
            >
              <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
                <p className="label-mono text-color-text-muted min-w-0 flex-1 pr-2 leading-snug break-words">
                  {item.stack}
                </p>
                <span
                  className="max-w-full shrink-0 rounded border px-2 py-0.5 text-right font-mono text-[9px] leading-tight tracking-widest break-words whitespace-normal uppercase"
                  // eslint-disable-next-line no-restricted-syntax
                  style={{
                    color: item.badgeColor,
                    borderColor: item.badgeBorder,
                  }}
                >
                  {item.badge}
                </span>
              </div>

              <h3 className="text-color-text-primary text-lg font-semibold tracking-tight">
                {item.name}
              </h3>

              <p className="text-color-text-secondary mt-3 flex-1 text-sm leading-[1.8] break-words">
                {item.desc}
              </p>

              <div className="mt-4 flex flex-wrap gap-2" aria-label={`${item.name} key signals`}>
                <span className="craft-metric-chip">Signal: {item.metric}</span>
                <span className="craft-metric-chip craft-metric-chip--muted">
                  Evidence: {item.metricEvidence}
                </span>
              </div>

              <div className="mt-5">
                <CopyInstall text={item.install} />
              </div>

              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${item.name} on GitHub (opens in new tab)`}
                className="border-color-border group text-color-text-muted mt-3 flex min-h-[48px] items-center justify-between gap-3 rounded-sm border-t pt-4 focus-visible:ring-2 focus-visible:ring-[color:var(--chapter-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
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

        <m.div
          variants={child}
          data-cinematic="proof"
          className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3"
        >
          {[
            { value: '4', label: 'source-linked entries', detail: 'npm · pip · GitHub' },
            { value: 'Source', label: 'inspectable', detail: 'implementation paths named' },
            { value: 'Claims', label: 'bounded', detail: 'no unlinked outcome metrics' },
          ].map(({ value, label, detail }) => (
            <div key={value + label} className="flex items-baseline gap-2">
              <span className="text-color-film-teal font-mono text-sm font-semibold">{value}</span>
              <span className="text-color-text-secondary font-mono text-[11px]">{label}</span>
              <span className="text-color-text-muted hidden font-mono text-[10px] sm:inline">
                · {detail}
              </span>
            </div>
          ))}
        </m.div>

        <m.p variants={child} className="text-color-text-muted mt-5 font-mono text-[11px]">
          Public evidence paths are available on{' '}
          <a
            href="https://github.com/Scardubu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-color-film-teal inline-flex items-center gap-0.5 underline underline-offset-2 transition-opacity hover:opacity-70"
          >
            GitHub
            <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
          </a>
          .
        </m.p>

        <m.p
          variants={child}
          data-cinematic="cta"
          className="text-color-text-muted mt-4 font-mono text-[13px] [letter-spacing:0.06em]"
        >
          <Link href={anchorUrl('skills')} className="transition-opacity hover:opacity-80">
            The stack that makes these possible →
          </Link>
        </m.p>
      </div>
    </ChapterFrame>
  );
}
