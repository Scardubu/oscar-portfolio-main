'use client';
// CONVICTION ENGINE v1.0 — TestimonialsSection
//
// P2-D: TESTIMONIALS data existed in lib/portfolio-data.ts but was never rendered.
// This component closes that gap. Placement: between ProjectsSection and
// OpenSourceSection (maximum authority placement — proof lands immediately
// after the technical evidence, before OSS).
//
// Desktop: 2-column grid.
// Mobile:  single-column stack — no horizontal scroll on narrow viewports.
// Motion:  cardReveal stagger, reducedMotion gate, viewportOnce.
// WCAG:    <blockquote> with cite attr, <footer> inside for attribution,
//          StarRow uses role="img" + aria-label.

import { m, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

import {
  cardReveal,
  clipReveal,
  fadeRise,
  noMotion,
  staggerContainer,
} from '@/lib/motionVariants';
import { TESTIMONIALS } from '@/lib/portfolio-data';

// ── Star rating row ───────────────────────────────────────────────────────────

function StarRow() {
  return (
    <div
      className="flex items-center gap-0.5"
      aria-label="5 out of 5 stars"
      role="img"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="currentColor"
          aria-hidden="true"
          style={{ color: 'oklch(73% 0.17 65)' }}
        >
          <path d="M6 1l1.39 2.82L10.5 4.24l-2.25 2.19.53 3.09L6 7.77 3.22 9.52l.53-3.09L1.5 4.24l3.11-.42L6 1z" />
        </svg>
      ))}
    </div>
  );
}

// ── Main section ──────────────────────────────────────────────────────────────

export function TestimonialsSection() {
  const ref           = useRef<HTMLElement>(null);
  const inView        = useInView(ref, { once: true, margin: '-80px' });
  const reducedMotion = useReducedMotion();

  const container   = staggerContainer(0.08, 0.05);
  const itemVariant = reducedMotion ? noMotion : fadeRise;
  const headVariant = reducedMotion ? noMotion : clipReveal;

  return (
    <section
      id="section-testimonials"
      ref={ref}
      aria-labelledby="testimonials-heading"
      className="border-t py-[var(--section-py)]"
      style={{ borderColor: 'var(--color-border)' }}
    >
      <div className="container">
        <m.div
          variants={container}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {/* ── Eyebrow ─────────────────────────────────────────────────── */}
          <m.div variants={itemVariant} className="section-kicker-row">
            <span className="section-number" aria-hidden="true">01.5</span>
            <span className="section-label">Client Signal</span>
          </m.div>

          <m.h2
            variants={headVariant}
            id="testimonials-heading"
            className="mt-4 mb-3"
          >
            What the teams say.
          </m.h2>

          <m.p
            variants={itemVariant}
            className="mb-10 max-w-[52ch] text-base leading-8"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            From BALL 247 to TradeBuza — real quotes from the CTOs, engineering
            leads, and product managers who shipped with these systems in
            production.
          </m.p>

          {/* ── 2-col grid (mobile: 1-col) ──────────────────────────────── */}
          <m.div
            variants={container}
            className="grid gap-4 sm:grid-cols-2"
          >
            {TESTIMONIALS.map((t, i) => (
              <m.blockquote
                key={t.id}
                variants={reducedMotion ? noMotion : cardReveal(i % 2 === 0 ? 20 : 28)}
                className="glass-medium rounded-[var(--radius-xl)] p-6 flex flex-col gap-4"
                style={{ borderLeft: `3px solid ${t.accent}` }}
                cite={t.company}
              >
                <StarRow />

                <p
                  className="text-sm leading-7 flex-1"
                  style={{ color: 'var(--color-text-primary)', opacity: 0.85 }}
                >
                  &ldquo;{t.quote}&rdquo;
                </p>

                <footer
                  className="flex items-center gap-3 border-t pt-4"
                  style={{ borderColor: 'var(--color-border-subtle)' }}
                >
                  {/* Initials avatar */}
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-semibold"
                    style={{
                      background: `${t.accent}1A`,
                      color: t.accent,
                      border: `1px solid ${t.accent}33`,
                    }}
                    aria-hidden="true"
                  >
                    {t.initials}
                  </div>

                  <div>
                    <p
                      className="text-sm font-semibold leading-tight"
                      style={{
                        color: 'var(--color-text-primary)',
                        fontFamily: 'var(--font-display)',
                      }}
                    >
                      {t.name}
                    </p>
                    <p
                      className="font-mono text-[10px] tracking-wide mt-0.5"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      {t.title} · {t.company}
                    </p>
                  </div>
                </footer>
              </m.blockquote>
            ))}
          </m.div>
        </m.div>
      </div>
    </section>
  );
}