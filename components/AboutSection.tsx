// CONVICTION ENGINE v14.0 — AboutSection
//
// CHANGELOG from v13.0:
//
//   UPGRADE: Mobile-native grid — single column default, 2-col at lg.
//     Cert cards now render in a 2-column grid on sm+ to prevent excessively
//     long single-column scroll on mobile before the CTA section appears.
//
//   FIX:  Closing tagline: "Lagos precision. Global scale." — preserved.
//     This is the correct location framing; matches Footer v14.1.
//
//   FIX:  Cert card touch targets: min-height 48px enforced on all cards.
//     Previous p-4 padding produced ~40px on small screens — below WCAG AAA.
//
//   KEEP: glass-surface applied to cert cards (v13 fix).
//   KEEP: 3fr/2fr desktop prose-to-credentials split — correct proportion.
//   KEEP: staggerContainer + useInView — correct orchestration pattern.
//   KEEP: UBEC federal-scale callout — strongest objection defang in the file.
//   KEEP: prefers-reduced-motion: noMotion fallback.
//
'use client';

import { m, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

import {
  fadeRise,
  noMotion,
  staggerContainer,
} from '@/lib/motionVariants';

const CERTS = [
  { name: 'AWS Certified Developer', date: 'Dec 2023' },
  { name: 'GCP Associate Cloud Engineer', date: 'Aug 2023' },
  { name: 'OpenJS Node.js Services Developer (JSNSD)', date: 'May 2024' },
  { name: 'PostgreSQL 14 Associate', date: 'Mar 2024' },
] as const;

export function AboutSection() {
  const ref = useRef<HTMLElement>(null);

  const inView = useInView(ref, {
    once: true,
    margin: '-80px',
  });

  const reducedMotion = useReducedMotion();

  const containerVariants = staggerContainer(0.09, 0.05);
  const itemVariants = reducedMotion ? noMotion : fadeRise;

  return (
    <section
      id="section-about"
      ref={ref}
      aria-labelledby="about-heading"
      className="border-t border-[var(--color-border)] py-[var(--section-py)]"
    >
      <div className="container">
        <m.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid gap-12 lg:grid-cols-[3fr_2fr] lg:items-start"
        >
          {/* LEFT COLUMN — narrative */}
          <div>
            <m.p
              variants={itemVariants}
              className="label-mono text-[var(--color-cyan)]"
            >
              BACKGROUND
            </m.p>

            <m.h2
              variants={itemVariants}
              id="about-heading"
              className="mt-4 text-white"
            >
              A decade of infrastructure. Four years of product.
            </m.h2>

            <m.p
              variants={itemVariants}
              className="mt-3 max-w-[42ch] text-xl text-[var(--color-text-secondary)]"
            >
              Non-CS background. Federal-scale engineering. Production ML.
              Full-stack delivery.
            </m.p>

            <m.p
              variants={itemVariants}
              className="mt-6 max-w-[var(--max-width-prose)] text-base leading-8 text-white/80"
            >
              Fullstack engineer and platform architect with four years of
              independent product and consulting work — shipping a tax
              compliance platform, an AI-powered observability tool, and an
              encrypted blockchain data system.
            </m.p>

            <m.p
              variants={itemVariants}
              className="mt-5 max-w-[var(--max-width-prose)] text-base leading-8 text-white/72"
            >
              Before that, over a decade building and maintaining critical data
              infrastructure within Nigeria&apos;s federal public sector —
              UBEC — managing ETL pipelines, dashboards, and state-level federal
              budget allocation systems across every state and local government
              area in the country, with reach extending into West Africa and Europe.
            </m.p>

            <m.p
              variants={itemVariants}
              className="mt-5 max-w-[var(--max-width-prose)] text-base leading-8 text-white/72"
            >
              Non-CS academic background (B.Tech Environmental Technology,
              FUTO, 2006–2011). Technical credibility built through a decade of
              production-grade engineering, four active cloud certifications,
              and 15+ merged upstream contributions.
            </m.p>

            {/* ── UBEC callout: Stripe objection-defanging ──────────────────── */}
            {/*
              Technique: state the objection the reader is forming, defang it.
              Objection: "non-CS background = self-taught, probably junior"
              Defang: "federal infrastructure ≠ side projects"
            */}
            <m.div
              variants={itemVariants}
              className="glass-surface mt-8 rounded-[var(--radius-lg)] border-l-2 p-4 sm:p-6"
              style={{
                borderLeftColor: 'var(--color-cyan)',
              }}
            >
              <p className="text-sm leading-7 text-white/78">
                At Nigeria&apos;s Universal Basic Education Commission, I built
                the data systems that tracked school funding across every Nigerian
                state and territory — federal-scale infrastructure processing
                real allocations, not academic exercises.
              </p>
            </m.div>

            <m.p
              variants={itemVariants}
              className="mt-8 text-lg text-white/80"
            >
              Lagos precision. Global scale.
            </m.p>
          </div>

          {/* RIGHT COLUMN — certifications */}
          <aside aria-label="Professional certifications">
            <m.h3
              variants={itemVariants}
              className="font-body text-sm uppercase tracking-widest text-white/80"
            >
              Certifications
            </m.h3>

            {/* v14.0: 2-col grid on sm+ — prevents excessively long mobile scroll */}
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {CERTS.map((cert) => (
                <m.article
                  key={cert.name}
                  variants={itemVariants}
                  className="glass-surface rounded-[var(--radius-md)] p-4"
                  // v14.0: enforce 48px min-height — WCAG AAA touch target
                  style={{ minHeight: '48px' }}
                >
                  <p className="text-sm font-medium text-white">
                    {cert.name}
                  </p>

                  <p className="mt-1 font-mono text-[11px] text-white/55">
                    {cert.date}
                  </p>
                </m.article>
              ))}
            </div>
          </aside>
        </m.div>
      </div>
    </section>
  );
}
