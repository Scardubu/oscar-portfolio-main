// CONVICTION ENGINE v11.0 — ContactSection
//
// Design principles:
//   • Stripe trust architecture: "you" language — address the reader's situation,
//     not Oscar's desires. Objections are defanged by anticipating them inline.
//     "Deliverable-led, not hourly" kills the hourly-billing objection.
//   • Three hire-me vectors: Staff+ hire, Technical CTO, Consulting.
//     Each serves a different decision-maker reading the same page.
//   • CTA hierarchy: one primary (email), one secondary (CV download).
//     No tertiary — decision fatigue kills conversions.
//   • Glass cards: left-border accent color identifies the hire type instantly.
//   • A24 resonance: headline "Let's build something that doesn't fail at 2am"
//     completes the hero's design-constraint motif. Full narrative arc closure.
//
'use client';

import { m, useInView, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
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
    title: 'STAFF+ / PRINCIPAL',
    headline: 'Product delivery · APIs · data infrastructure',
    body: 'Available for Staff+ and Principal Backend roles at fintech and AI-native product companies. Four years of independent platform work — user-facing surfaces, multi-tenant PostgreSQL RLS, idempotent BullMQ queues, and zero-downtime deployments as a baseline, not a feature.',
    accentColor: 'var(--color-success)',
    glowColor: 'oklch(65% 0.18 155 / 0.06)',
  },
  {
    id: 'technical-cofounder',
    title: 'TECHNICAL CO-FOUNDER',
    headline: 'Pre-seed to Series A · Africa / emerging markets',
    body: 'Four years shipping production platforms from zero. Backend infrastructure, compliance architecture (NDPC, NRS/DigiTax), and observability through early funding rounds. The system should outlast the seed deck — I build like it will.',
    accentColor: 'var(--color-accent)',
    glowColor: 'oklch(63% 0.22 258 / 0.06)',
  },
  {
    id: 'consulting',
    title: 'INFRASTRUCTURE CONSULTING',
    headline: 'Production reliability · compliance systems · ML backends',
    body: 'Scoped engagements: production incident remediation, architecture review, Nigerian tax compliance integration (NTA 2025 / NRS 2026), and ML inference pipeline optimisation. Deliverable-led, not hourly. You get working infrastructure — not billable-hour reports.',
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
          {/* ── Section kicker ──────────────────────────────────────── */}
          <m.div variants={child} className="section-kicker-row">
            <span className="section-number" aria-hidden="true">06</span>
            <span className="section-label">Contact</span>
          </m.div>

          {/* ── Headline: A24 narrative closure — mirrors hero motif ── */}
          {/* "That's not a slogan. It's a design constraint." → close loop */}
          <m.h2
            id="contact-heading"
            variants={reducedMotion ? child : clipReveal}
            className="mt-3 max-w-[24ch]"
          >
            Let&apos;s build something that doesn&apos;t fail at 2am.
          </m.h2>

          {/* ── Body: Stripe "you" language — address reader's situation */}
          <m.p
            variants={child}
            className="mt-5 max-w-[56ch] text-base leading-8"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            If you need a backend that holds under pressure, infrastructure legible to the
            next engineer, or a technical co-founder who&apos;s shipped from zero — I&apos;m
            available. No discovery calls before seeing actual work; it&apos;s all on this page.
          </m.p>

          {/* ── Primary CTA strip ───────────────────────────────────── */}
          <m.div variants={child} className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="mailto:scardubu@gmail.com"
              className="cta-primary"
              aria-label="Email Oscar Ndugbu"
            >
              Send an email
            </a>
            <a
              href="/cv/oscar-ndugbu-resume.pdf"
              download
              className="cta-secondary"
              aria-label="Download Oscar's resume PDF"
            >
              Download CV
            </a>
            <CopyEmail />
          </m.div>

          {/* ── Social links ────────────────────────────────────────── */}
          <m.div
            variants={child}
            className="mt-6 flex items-center gap-4"
          >
            <a
              href="https://github.com/Scardubu"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-ghost"
              aria-label="GitHub profile"
            >
              <GitHubIcon />
              <span className="ml-1.5">Scardubu</span>
            </a>
            <a
              href="https://linkedin.com/in/oscar-ndugbu"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-ghost"
              aria-label="LinkedIn profile"
            >
              <LinkedInIcon />
              <span className="ml-1.5">Oscar Ndugbu</span>
            </a>
          </m.div>

          {/* ── Three hire-me cards ─────────────────────────────────── */}
          {/* Grid: 1 col mobile, 3 col desktop — left-border color codes type */}
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CONTACT_CARDS.map(({ id, title, headline, body, accentColor, glowColor }, i) => (
              <m.div
                key={id}
                variants={card(i)}
                className="glass-medium rounded-[var(--radius-xl)] p-6 relative overflow-hidden"
                style={{
                  borderLeft: `2px solid ${accentColor}`,
                  // Subtle ambient glow matching card type
                  background: glowColor,
                }}
                whileHover={reducedMotion ? undefined : {
                  y: -3,
                  transition: { type: 'spring', stiffness: 400, damping: 30 },
                }}
              >
                {/* Type label */}
                <p className="label-mono mb-3" style={{ color: accentColor }}>
                  {title}
                </p>

                {/* Headline: service promise */}
                <p
                  className="text-sm font-medium mb-4 leading-snug"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {headline}
                </p>

                {/* Body: objection-defanging precision (Stripe style) */}
                <p
                  className="text-sm leading-7"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {body}
                </p>

                {/* Ambient corner glow: spatial depth cue */}
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: '80px',
                    height: '80px',
                    background: `radial-gradient(circle at 100% 100%, ${accentColor.replace(')', ' / 0.08)')}, transparent 70%)`,
                    pointerEvents: 'none',
                  }}
                />
              </m.div>
            ))}
          </div>
        </m.div>
      </div>
    </section>
  );
}
