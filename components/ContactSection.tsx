// CONVICTION ENGINE v16.0 — ContactSection
//
// CHANGELOG from v15.0:
//
//   MOBILE CONVERSION OVERHAUL:
//     - Primary "Email Oscar" button: cta-primary--lg (56px) on mobile.
//       Full-width, thumb comfort zone. Impossible to miss.
//     - FloatingContactCTA: sticky pill that appears on scroll, hides when
//       contact section is visible. Persistent conversion anchor.
//     - Hire cards: reduced to 2 columns on sm (was 1 col then 3 col).
//       Featured card gets full-width treatment on mobile.
//     - Section heading: compressed mb on mobile (mb-6 vs mb-10).
//
//   OBJECTION DEFANGING (preserved + strengthened):
//     - Three hire vectors unchanged — strongest pattern in codebase.
//     - Featured card border accent upgraded: 3px solid (was 2px).
//     - "The system has to work at 2am. Let's make sure it does." preserved.
//
//   KEEP: Spring physics card hover (stiffness 420, damping 30) — desktop.
//   KEEP: CopyEmail for paste-into-compose workflow.
//   KEEP: GitHub + LinkedIn social links with min-height 44px.
//   KEEP: Narrative closure: conviction arc echo.
//
'use client';

import { m, useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';

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

/* ── Floating sticky CTA — mobile persistent conversion anchor ─────────────── */
/*
  Appears after 2s page load, hides when contact section is in view.
  Lives outside main section flow — rendered as a sibling in the DOM.
  CSS class .contact-sticky-cta handles display: none on desktop.
*/
export function FloatingContactCTA() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const contactSection = document.getElementById('section-contact');
    if (!contactSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHidden(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(contactSection);
    return () => observer.disconnect();
  }, []);

  return (
    <a
      href="mailto:scardubu@gmail.com"
      className="contact-sticky-cta"
      data-hidden={hidden ? 'true' : 'false'}
      aria-label="Email Oscar to start a conversation"
    >
      <span
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{ background: 'var(--color-success)', flexShrink: 0 }}
        aria-hidden="true"
      />
      Start a conversation
    </a>
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
          {/* ── Section kicker ────────────────────────────────────── */}
          <m.div variants={child} className="section-kicker-row">
            <span className="section-number" aria-hidden="true">05</span>
            <span className="section-label">Contact</span>
          </m.div>

          {/* ── Section heading: A24 clip wipe ────────────────────── */}
          <m.h2
            variants={headingVariant}
            id="contact-heading"
            className="mb-4 md:mb-6"
          >
            The system has to work at 2am.
          </m.h2>

          <m.p
            variants={child}
            className="mb-8 max-w-[52ch] text-base leading-8"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Let&apos;s make sure it does. Whether you&apos;re hiring for Staff+,
            co-founding, or fixing something on fire — start here.
          </m.p>

          {/* ── Primary mobile CTA — 56px, full-width ──────────────── */}
          {/*
            Conviction Engine conversion law: the email CTA must be
            impossible to miss on mobile. 56px height, full-width,
            green dot showing availability — before hire cards, not after.
          */}
          <m.div variants={child} className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="mailto:scardubu@gmail.com"
              className="cta-primary cta-primary--lg tactile-press"
              aria-label="Email Oscar Ndugbu"
            >
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ background: 'var(--color-success)' }}
                aria-hidden="true"
              />
              Email Oscar
            </a>
            <a
              href="/cv/oscar-ndugbu-resume.pdf"
              download
              className="cta-secondary tactile-press"
              aria-label="Download resume PDF"
            >
              Download CV ↓
            </a>
          </m.div>

          {/* ── Hire vectors — 3 engagement modes ─────────────────── */}
          <m.div
            variants={container}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {CONTACT_CARDS.map((card_item, i) => (
              <m.div
                key={card_item.id}
                variants={card(i)}
                className={`rounded-[var(--radius-xl)] p-6 sm:p-8 relative overflow-hidden ${
                  card_item.featured ? 'glass-full sm:col-span-2 lg:col-span-1' : 'glass-medium'
                }`}
                style={{
                  borderLeft: `3px solid ${card_item.accentColor}`,
                  background: card_item.featured
                    ? `linear-gradient(135deg, ${card_item.glowColor} 0%, transparent 60%)`
                    : undefined,
                }}
                whileHover={
                  reducedMotion
                    ? undefined
                    : { y: -3, transition: { type: 'spring', stiffness: 420, damping: 30 } }
                }
              >
                {/* Glow orb — desktop depth */}
                <div
                  className="pointer-events-none absolute -top-8 -right-8 h-32 w-32 rounded-full blur-3xl hidden md:block"
                  style={{ background: card_item.glowColor, opacity: 0.8 }}
                  aria-hidden="true"
                />

                <div className="relative z-10">
                  <p
                    className="label-mono mb-3"
                    style={{ color: card_item.accentColor }}
                  >
                    {card_item.title}
                  </p>

                  <p
                    className="text-base font-semibold leading-snug mb-3"
                    style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-display)' }}
                  >
                    {card_item.headline}
                  </p>

                  <p
                    className="text-sm leading-7 mb-4"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {card_item.body}
                  </p>

                  {/* Objection defang — italicised conviction closer */}
                  <p
                    className="text-xs leading-6 italic border-t pt-3"
                    style={{
                      borderColor: 'var(--color-border-subtle)',
                      color: 'var(--color-text-muted)',
                    }}
                  >
                    {card_item.objection}
                  </p>
                </div>
              </m.div>
            ))}
          </m.div>

          {/* ── Social links + CopyEmail ───────────────────────────── */}
          <m.div
            variants={child}
            className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/Scardubu"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm transition-colors min-h-11 min-w-11"
                style={{ color: 'var(--color-text-muted)' }}
                aria-label="GitHub profile"
              >
                <GitHubIcon />
                <span className="hidden sm:inline">GitHub</span>
              </a>
              <a
                href="https://linkedin.com/in/oscardubu"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm transition-colors min-h-11 min-w-11"
                style={{ color: 'var(--color-text-muted)' }}
                aria-label="LinkedIn profile"
              >
                <LinkedInIcon />
                <span className="hidden sm:inline">LinkedIn</span>
              </a>
              <CopyEmail email="scardubu@gmail.com" />
            </div>

            {/* Narrative closer — conviction arc */}
            <p
              className="font-mono text-[10px] tracking-wider uppercase max-w-[36ch] text-right hidden md:block"
              style={{ color: 'oklch(93% 0.006 264 / 0.28)' }}
            >
              Systems that work at 2am.
              <br />
              That&apos;s the standard.
            </p>
          </m.div>
        </m.div>
      </div>
    </section>
  );
}