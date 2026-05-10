// CONVICTION ENGINE v15.0 — ContactSection
//
// v15.0 MOBILE-NATIVE REBUILD:
//
//   MOBILE CONVERSION:
//     Primary CTA: Full-width on mobile — thumb comfort zone, no grip shift.
//     Hire cards: Single column stack on mobile (grid-cols-1 default).
//     Section heading: reduced vertical gap between heading and CTA on mobile.
//     Email CTA at bottom: sticky-positioned on mobile for persistent access.
//
//   THUMB ERGONOMICS:
//     Primary "Email Oscar" button: 56px height on mobile (thumb comfort zone).
//     Secondary CV: full-width below primary on mobile.
//     Min-height 48px on all interactive elements.
//
//   OBJECTION DEFANGING: unchanged (most effective pattern in v14).
//
//   KEEP: Three hire vectors with accent-color left borders.
//   KEEP: Spring physics card hover (stiffness 420, damping 30) — desktop.
//   KEEP: CopyEmail for users who want to paste into their own compose.
//   KEEP: GitHub + LinkedIn social links.
//   KEEP: Narrative arc closure: "The system has to work at 2am. Let's make sure it does."
//
'use client';

import { m, useInView, useReducedMotion } from 'framer-motion';
import { useMemo, useRef } from 'react';

import { CopyEmail } from '@/components/CopyEmail';
import {
  cardReveal,
  clipReveal,
  fadeRise,
  noMotion,
  staggerContainer,
} from '@/lib/motionVariants';

const CONTACT_CARDS = [
  {
    id: 'staff-plus',
    featured: true,
    title: 'STAFF+ / PRINCIPAL',
    headline: 'Product delivery · APIs · data infrastructure',
    body: 'Staff+ and Principal Backend roles at fintech and AI-native product companies. Multi-tenant PostgreSQL RLS, idempotent BullMQ queues, and zero-downtime deployments — baseline, not feature.',
    objection: 'React Native Expo 54 · Next.js 15 · Spring Boot · FastAPI · Effect-TS · Turborepo.',
    accentColor: 'var(--color-success)',
    glowColor: 'oklch(65% 0.18 155 / 0.06)',
  },
  {
    id: 'technical-cofounder',
    featured: false,
    title: 'TECHNICAL CO-FOUNDER',
    headline: 'Pre-seed to Series A · Africa / emerging markets',
    body: 'Four years shipping production platforms from zero — compliance architecture (NDPC, NRS/DigiTax), observability, and backend infrastructure through early funding rounds.',
    objection: 'The system should outlast the seed deck. Available for full-time equity engagements.',
    accentColor: 'var(--color-accent)',
    glowColor: 'oklch(63% 0.22 258 / 0.06)',
  },
  {
    id: 'consulting',
    featured: false,
    title: 'INFRASTRUCTURE CONSULTING',
    headline: 'Production reliability · compliance systems · ML backends',
    body: 'Deliverable-led, not hourly. Scoped engagements: incident remediation, architecture review, Nigerian tax compliance (NTA 2025 / NRS 2026), and ML inference optimisation.',
    objection: 'You get working infrastructure — not billable-hour reports.',
    accentColor: 'var(--color-cyan)',
    glowColor: 'oklch(74% 0.18 195 / 0.06)',
  },
] as const;

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.88c-2.77.6-3.35-1.18-3.35-1.18-.46-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.54 2.36 1.1 2.93.84.09-.65.35-1.1.63-1.36-2.21-.25-4.54-1.1-4.54-4.92 0-1.09.39-1.98 1.03-2.67-.1-.25-.45-1.28.1-2.66 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.9-1.29 2.74-1.02 2.74-1.02.56 1.38.21 2.41.11 2.66.64.69 1.03 1.58 1.03 2.67 0 3.83-2.33 4.66-4.56 4.91.36.31.67.92.67 1.86v2.76c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
      <path d="M4.98 3.5a1.75 1.75 0 1 1 0 3.5 1.75 1.75 0 0 1 0-3.5ZM3.5 8.75h2.96V20.5H3.5V8.75Zm7.17 0h2.84v1.6h.04c.39-.75 1.37-1.85 2.82-1.85 3.02 0 3.58 1.98 3.58 4.56v7.44H17V14c0-1.5-.03-3.42-2.08-3.42-2.08 0-2.4 1.63-2.4 3.31v6.61h-2.85V8.75Z" />
    </svg>
  );
}

export function ContactSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const reducedMotion = useReducedMotion();

  const container = useMemo(() => staggerContainer(0.09, 0.05), []);
  const child = reducedMotion ? noMotion : fadeRise;
  const headingVariant = reducedMotion ? child : clipReveal;
  const card = (i: number) => (reducedMotion ? noMotion : cardReveal(24 + i * 4));

  return (
    <section
      id="section-contact"
      ref={ref}
      aria-labelledby="contact-heading"
      className="border-t py-[var(--section-py)]"
      style={{ borderColor: 'var(--color-border)' }}
    >
      <div className="container">
        <m.div
          variants={container}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {/* ── Section kicker ──────────────────────────────────────────── */}
          <m.div variants={child} className="section-kicker-row mb-10 max-w-4xl">
            <span className="section-number" aria-hidden="true">06</span>
            <span className="section-label">CONTACT</span>
          </m.div>

          {/* ── Section heading ─────────────────────────────────────────── */}
          <m.h2
            variants={headingVariant}
            id="contact-heading"
            className="mb-4 max-w-[26ch]"
          >
            The system has to work at 2am.{' '}
            <span style={{ color: 'var(--color-text-secondary)' }}>
              {"Let's make sure it does."}
            </span>
          </m.h2>

          <m.p
            variants={child}
            className="mb-10 max-w-[56ch] text-base leading-8"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Three paths. One outcome. Pick the one that matches where you are.
          </m.p>

          {/* ── Hire vector cards ──────────────────────────────────────── */}
          {/* v15: grid-cols-1 default → lg:grid-cols-3. Mobile stacks vertically. */}
          <div className="grid gap-4 lg:grid-cols-3 mb-12">
            {CONTACT_CARDS.map((card_item, i) => (
              <m.div
                key={card_item.id}
                variants={card(i)}
                className="glass-medium rounded-[var(--radius-xl)] overflow-hidden"
                style={{
                  background: card_item.glowColor,
                  borderLeft: `3px solid ${card_item.accentColor}`,
                  padding: card_item.featured
                    ? 'clamp(1.25rem, 2.5vw, 2rem)'
                    : 'clamp(1rem, 2vw, 1.75rem)',
                }}
                whileHover={
                  reducedMotion
                    ? undefined
                    : { y: -3, transition: { type: 'spring', stiffness: 420, damping: 30 } }
                }
              >
                {/* Title */}
                <p
                  className="label-mono mb-3"
                  style={{ color: card_item.accentColor }}
                >
                  {card_item.title}
                  {card_item.featured && (
                    <span
                      className="ml-2 inline-flex items-center rounded-full px-1.5 py-0.5 font-mono text-[9px] tracking-wider"
                      style={{
                        background: 'oklch(65% 0.18 155 / 0.15)',
                        color: 'var(--color-success)',
                        border: '1px solid oklch(65% 0.18 155 / 0.25)',
                      }}
                    >
                      PRIMARY
                    </span>
                  )}
                </p>

                {/* Headline */}
                <p
                  className="mb-3 font-semibold leading-snug"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(0.9375rem, 1.5vw + 0.5rem, 1.25rem)',
                    color: 'var(--color-text-primary)',
                  }}
                >
                  {card_item.headline}
                </p>

                {/* Body */}
                <p
                  className="text-sm leading-7"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {card_item.body}
                </p>

                {/* Objection defanging */}
                <p
                  className="mt-4 text-xs leading-6"
                  style={{ color: card_item.accentColor, opacity: 0.8 }}
                >
                  {card_item.objection}
                </p>
              </m.div>
            ))}
          </div>

          {/* ══════════════════════════════════════════════════════════════════
              v15 PRIMARY CTA BLOCK — mobile-native thumb zone
              Mobile: full-width stacked buttons (cta-hero-group class).
              Desktop: inline flex row.
              56px height on mobile for reliable one-thumb press.
              ══════════════════════════════════════════════════════════════════ */}
          <m.div variants={child}>
            {/* Mobile CTA group — full width stacked */}
            <div className="cta-hero-group mb-3">
              <a
                href="mailto:scardubu@gmail.com"
                className="cta-primary"
                aria-label="Email Oscar directly — opens your email client"
                style={{
                  // v15: 56px on mobile for thumb-comfort zone
                  minHeight: 'clamp(48px, 6vw, 56px)',
                }}
              >
                Email Oscar directly
              </a>
              <a
                href="/cv/oscar-ndugbu-resume.pdf"
                download
                className="cta-secondary"
                aria-label="Download Oscar's CV as PDF"
              >
                Download CV
              </a>
            </div>

            {/* Efficiency signal: defangs form/queue friction */}
            <p
              className="font-mono text-[10px] tracking-wider"
              style={{ color: 'var(--color-text-muted)' }}
            >
              No form, no queue. Opens your email client.
            </p>

            {/* Copy email: for users who want to paste into their own compose */}
            <div className="mt-3">
              <CopyEmail />
            </div>
          </m.div>

          {/* ── Social links ────────────────────────────────────────────── */}
          <m.div
            variants={child}
            className="mt-8 flex items-center gap-4"
          >
            <p
              className="font-mono text-[11px] tracking-widest uppercase"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Also on
            </p>
            <div className="flex gap-3">
              <a
                href="https://github.com/Scardubu"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg transition-colors hover:text-white"
                style={{
                  color: 'var(--color-text-muted)',
                  minHeight: '48px',
                  minWidth: '48px',
                }}
                aria-label="Oscar Ndugbu on GitHub"
              >
                <GitHubIcon />
              </a>
              <a
                href="https://linkedin.com/in/oscardubu"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg transition-colors hover:text-white"
                style={{
                  color: 'var(--color-text-muted)',
                  minHeight: '48px',
                  minWidth: '48px',
                }}
                aria-label="Oscar Ndugbu on LinkedIn"
              >
                <LinkedInIcon />
              </a>
            </div>
          </m.div>

        </m.div>
      </div>
    </section>
  );
}