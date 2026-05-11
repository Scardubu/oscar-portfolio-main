// CONVICTION ENGINE v14.1 — AboutSection
//
// CHANGELOG from v14.0:
//
//   UPGRADE: Cert cards — teal left border accent + provider badge pill.
//     Each cert now has a two-character provider shortcode (AWS / GCP / JS /
//     PG) rendered as a teal-tinted mono badge on the right. The border-l-2
//     gives the right visual hierarchy weight against the flat glass surface.
//
//   FIX:  grid-cols-1 on mobile / sm:grid-cols-2 on sm+ / lg:grid-cols-1 on
//     lg+ — kept from v14.0. Prevents excessive scroll on 390px viewports.
//
//   KEEP: glass-surface applied to cert cards (v13 fix).
//   KEEP: 3fr/2fr desktop prose-to-credentials split — correct proportion.
//   KEEP: staggerContainer + useInView — correct orchestration pattern.
//   KEEP: UBEC federal-scale callout — strongest objection defang in the file.
//   KEEP: prefers-reduced-motion: noMotion fallback.
//   KEEP: All aria-label, role, and WCAG 2.2 landmark semantics.
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
  {
    name: 'AWS Certified Developer',
    date: 'Dec 2023',
    provider: 'AWS',
  },
  {
    name: 'GCP Associate Cloud Engineer',
    date: 'Aug 2023',
    provider: 'GCP',
  },
  {
    name: 'OpenJS Node.js Services Developer (JSNSD)',
    date: 'May 2024',
    provider: 'JS',
  },
  {
    name: 'PostgreSQL 14 Associate',
    date: 'Mar 2024',
    provider: 'PG',
  },
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

            {/*
              v14.1 UPGRADE: Cert cards — teal left border + provider badge.
              border-l-2 with film-teal creates scannable visual hierarchy.
              Provider badge (AWS/GCP/JS/PG) adds instant recognition at glance.
              2-col grid on sm+ prevents excessive mobile scroll.
            */}
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {CERTS.map((cert) => (
                <m.article
                  key={cert.name}
                  variants={itemVariants}
                  className="glass-surface rounded-[var(--radius-md)] border-l-2 p-4"
                  style={{
                    borderLeftColor: 'var(--color-film-teal)',
                    minHeight: '56px',
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-white leading-snug">
                      {cert.name}
                    </p>
                    {/* Provider badge — instant credential scan */}
                    <span
                      className="mt-0.5 shrink-0 rounded border px-1.5 py-0.5 font-mono text-[9px] font-semibold tracking-widest uppercase"
                      style={{
                        borderColor: 'var(--color-film-teal-glow)',
                        color: 'var(--color-film-teal)',
                        background: 'var(--color-film-teal-surface)',
                      }}
                      aria-label={`Provider: ${cert.provider}`}
                    >
                      {cert.provider}
                    </span>
                  </div>

                  <p
                    className="mt-1.5 font-mono text-[11px]"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
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