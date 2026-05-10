// CONVICTION ENGINE v13.0 — AboutSection
//
// CHANGELOG from v8.1:
//
//   FIX:  .glass-surface applied to cert cards — was a silent no-op in v12.x
//     because .glass-surface was never defined in globals.css.
//     v13.0 adds the class to the design system; cards now have correct
//     glass treatment: blur(8px) saturate(120%), subtle fresnel top-edge.
//
//   FIX:  "Lagos" in kicker/bio copy removed. "Nigeria's federal public
//     sector" is the correct framing — UBEC operates nationwide from Abuja.
//
//   REF:  UBEC paragraph punched up — "touching every state" → "every
//     local government area" is more precise and more authoritative.
//
//   REF:  Callout block: "Not side projects" framing sharpened to match
//     the Stripe objection-defanging vocabulary used in ContactSection.
//
//   REF:  Certifications — layout tightened, dates made consistent.
//
//   ADD:  Section scoped ambient glow via #section-about CSS rule (globals).
//         No DOM change required — CSS-only ambient depth.
//
//   KEEP: staggerContainer + useInView — correct orchestration pattern.
//   KEEP: 3fr/2fr grid — gives prose room to breathe, credentials visible.
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

            {/* ── Callout: UBEC scale — objection-defanging ────────────────── */}
            {/*
              Stripe technique: state the objection the reader is forming,
              then immediately defang it.
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

            <div className="mt-6 space-y-3">
              {CERTS.map((cert) => (
                <m.article
                  key={cert.name}
                  variants={itemVariants}
                  className="glass-surface rounded-[var(--radius-md)] p-4"
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
