'use client';

import { useMemo, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

import { fadeRise, noMotion, staggerContainer } from '@/lib/motionVariants';

const ABOUT = {
  opening:
    "Backend engineer and platform architect with four years of independent product and consulting work — and over a decade building critical data infrastructure within Nigeria's federal public sector.",
  philosophy:
    'Non-CS degree, FUTO Environmental Technology 2011. Credibility built through production engineering, four cloud certifications (AWS, GCP, OpenJS Node.js, PostgreSQL), and 15+ merged upstream contributions to XGBoost and scikit-learn — third-party, verifiable signals.',
  ubec:
    'At UBEC — the Universal Basic Education Commission — working in the Planning, Research and Statistics department. Building the ETL pipelines and dashboards that consolidate national education data from all 36 state offices and feed federal budget allocation decisions.',
  current:
    'Currently consulting across fintech and SaaS teams in West Africa and Europe — auditing backend systems, resolving reliability issues, and building internal tooling alongside CTOs and senior engineers.',
  location: 'Lagos, Nigeria — open to remote.',
} as const;

const CERTS = [
  { name: 'AWS Certified Developer', date: 'Dec 2023' },
  { name: 'GCP Associate Cloud Engineer', date: 'Aug 2023' },
  { name: 'OpenJS Node.js Services (JSNSD)', date: 'May 2024' },
  { name: 'PostgreSQL 14 Associate', date: 'Mar 2024' },
] as const;

export function AboutSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const reducedMotion = useReducedMotion();
  const container = useMemo(() => staggerContainer(0.09, 0.05), []);
  const child = reducedMotion ? noMotion : fadeRise;

  return (
    <section
      id="about"
      ref={ref}
      aria-labelledby="about-heading"
      className="border-t border-(--color-border) py-28 sm:py-32"
    >
      <div className="container">
        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="about-grid grid gap-16 lg:items-start"
        >
          <div>
            <motion.span variants={child} className="label">
              Background
            </motion.span>
            <motion.h2 variants={child} id="about-heading" className="mt-4 text-white">
              The system has to work at 2am.
            </motion.h2>
            <motion.p
              variants={child}
              className="mt-3 font-mono text-xs tracking-widest text-(--color-text-muted) uppercase"
            >
              {"That's not a slogan. It's a design constraint."}
            </motion.p>

            <div className="mt-8 space-y-6">
              {[ABOUT.opening, ABOUT.philosophy, ABOUT.ubec, ABOUT.current].map((paragraph) => (
                <motion.p
                  key={paragraph}
                  variants={child}
                  className="font-display max-w-[66ch] text-(length:--text-xl) leading-[1.85] font-normal text-(--color-text-secondary)"
                >
                  {paragraph}
                </motion.p>
              ))}
              <motion.p variants={child} className="label pt-3 text-(--color-live)">
                {ABOUT.location}
              </motion.p>

              <div className="mt-12">
                <motion.span variants={child} className="label">
                  Experience
                </motion.span>
                <div className="mt-6 space-y-8">
                  <motion.div variants={child}>
                    <p className="mb-1 font-mono text-xs tracking-widest text-(--color-accent) uppercase">
                      Federal Civil Service · UBEC
                    </p>
                    <p className="mb-2 text-base leading-snug font-medium text-white">
                      Planning, Research &amp; Statistics — ETL &amp; Data Infrastructure
                    </p>
                    <p className="max-w-[56ch] text-sm leading-7 text-(--color-text-secondary)">
                      Building the pipelines that consolidate national education data from all 36
                      state offices, feeding federal budget allocation decisions.
                    </p>
                  </motion.div>
                  <motion.div variants={child}>
                    <p className="mb-1 font-mono text-xs tracking-widest text-(--color-accent) uppercase">
                      2021 – Present · West Africa &amp; Europe
                    </p>
                    <p className="mb-2 text-base leading-snug font-medium text-white">
                      Independent Consulting — Backend Systems &amp; Reliability
                    </p>
                    <p className="max-w-[56ch] text-sm leading-7 text-(--color-text-secondary)">
                      Auditing backend systems, resolving reliability issues, and building internal
                      tooling alongside CTOs and senior engineers across fintech and SaaS teams.
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <motion.span variants={child} className="label">
              Certifications
            </motion.span>
            <div className="mt-8 space-y-1">
              {CERTS.map((cert) => (
                <motion.div
                  key={cert.name}
                  variants={child}
                  className="flex items-center justify-between gap-4 border-b border-(--color-border) py-4 transition-colors hover:bg-white/[0.02]"
                >
                  <p className="font-display text-base font-medium text-white">{cert.name}</p>
                  <p className="font-mono text-xs text-(--color-text-muted)">{cert.date}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
