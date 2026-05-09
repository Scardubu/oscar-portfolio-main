// CONVICTION ENGINE v8.0 — FULL REPLACEMENT
'use client';

import { m, useInView, useReducedMotion } from 'framer-motion';
import { useMemo, useRef } from 'react';

import { fadeRise, noMotion, staggerContainer } from '@/lib/motionVariants';

const CERTS = [
  { name: 'AWS Certified Developer', date: 'Dec 2023' },
  { name: 'GCP Associate Cloud Engineer', date: 'Aug 2023' },
  { name: 'OpenJS Node.js Services Developer (JSNSD)', date: 'May 2024' },
  { name: 'PostgreSQL 14 Associate', date: 'Mar 2024' },
] as const;

export function AboutSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const reducedMotion = useReducedMotion();
  const container = useMemo(() => staggerContainer(0.09, 0.05), []);
  const child = reducedMotion ? noMotion : fadeRise;

  return (
    <section id="section-about" ref={ref} className="border-t border-(--color-border) py-[var(--section-py)]">
      <div className="container">
        <m.div
          variants={container}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid gap-12 lg:grid-cols-[3fr_2fr] lg:items-start"
        >
          <div>
            <m.p
              variants={child}
              className="label-mono" style={{ color: 'var(--color-cyan)' }}
            >
              BACKGROUND
            </m.p>
            <m.h2 variants={child} id="about-heading" className="mt-4 text-white">
              A decade of infrastructure. Four years of product.
            </m.h2>
            <m.p variants={child} className="mt-3 max-w-[42ch] text-xl" style={{ color: 'var(--color-text-secondary)' }}>
              Non-CS background. Federal-scale engineering. Production ML. Full-stack delivery.
            </m.p>

            <m.p
              variants={child}
              className="mt-6 max-w-(--max-width-prose) text-base leading-8 text-white/78"
            >
              Fullstack engineer and platform architect with four years of independent product and
              consulting work — shipping a tax compliance platform, an AI-powered observability
              tool, and an encrypted blockchain data system.
            </m.p>

            <m.p
              variants={child}
              className="mt-5 max-w-(--max-width-prose) text-base leading-8 text-white/72"
            >
              Before that, over a decade building and maintaining critical data infrastructure
              within Nigeria&apos;s federal public sector — UBEC — managing ETL pipelines,
              dashboards, and state-level federal budget allocation systems touching every state in
              the country, and West Africa and Europe.
            </m.p>

            <m.p
              variants={child}
              className="mt-5 max-w-(--max-width-prose) text-base leading-8 text-white/72"
            >
              Non-CS academic background (B.Tech Environmental Technology, FUTO, 2006–2011).
              Technical credibility built through a decade of production-grade engineering, four
              active cloud certifications, and 15+ merged upstream contributions.
            </m.p>

            <m.div
              variants={child}
              className="glass-medium mt-8 rounded-[var(--radius-lg)] border-l-2 p-4 sm:p-6"
              style={{ borderLeftColor: 'var(--color-cyan)' }}
            >
              <p className="text-sm leading-7 text-white/78">
                During my time at Nigeria&apos;s Universal Basic Education Commission, I built the
                data systems that tracked school funding across every Nigerian state — federal-scale
                infrastructure, not side projects.
              </p>
            </m.div>

            <m.p variants={child} className="mt-8 text-lg text-white/78">
              Lagos precision. Global scale.
            </m.p>
          </div>

          <div>
            <m.h3
              variants={child}
              className="font-body text-sm tracking-widest text-white/80 uppercase"
            >
              Certifications
            </m.h3>
            <div className="mt-6 space-y-3">
              {CERTS.map((cert) => (
                <m.article
                  key={cert.name}
                  variants={child}
                  className="glass-surface rounded-(--radius-md) p-4"
                >
                  <p className="text-sm font-medium text-white">{cert.name}</p>
                  <p className="mt-1 font-mono text-[11px] text-white/55">{cert.date}</p>
                </m.article>
              ))}
            </div>
          </div>
        </m.div>
      </div>
    </section>
  );
}
