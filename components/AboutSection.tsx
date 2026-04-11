'use client';

import { useMemo, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

import { cardReveal, fadeRise, noMotion, staggerContainer } from '@/lib/motionVariants';

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

const OPEN_SOURCE = [
  {
    name: 'pg-tenant',
    stack: 'Node.js · PostgreSQL',
    desc:
      "Enforces strict database-level data separation between clients. One tenant's records are completely invisible to another even when application-layer bugs exist. Used in production by fintech teams.",
    href: 'https://github.com/Scardubu/pg-tenant',
  },
  {
    name: 'audit-chain',
    stack: 'Fintech · Compliance',
    desc:
      'Generates a cryptographically linked audit log where every entry is mathematically bound to the previous one. Makes retroactive edits or tampering instantly detectable. Built for NRS and GDPR trails.',
    href: 'https://github.com/Scardubu/audit-chain',
  },
  {
    name: 'node-debug-llm',
    stack: 'AI · DevOps',
    desc:
      'Streams live system logs and traces to an AI model, which returns a ranked plain-English list of likely root causes — compressing hours of manual incident investigation into minutes.',
    href: 'https://github.com/Scardubu/node-debug-llm',
  },
] as const;

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
  const card = useMemo(() => (reducedMotion ? noMotion : cardReveal(24)), [reducedMotion]);

  return (
    <section
      id="about"
      ref={ref}
      aria-labelledby="about-heading"
      className="border-t border-[color:var(--color-border)] py-28 sm:py-32"
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
              The engineer
            </motion.h2>

            <div className="mt-8 space-y-6">
              {[ABOUT.opening, ABOUT.philosophy, ABOUT.ubec, ABOUT.current].map((paragraph) => (
                <motion.p
                  key={paragraph}
                  variants={child}
                  className="max-w-[66ch] text-[length:var(--text-xl)] leading-[1.85] text-[color:var(--color-text-secondary)]"
                  style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}
                >
                  {paragraph}
                </motion.p>
              ))}
              <motion.p variants={child} className="label pt-3 text-[color:var(--color-live)]">
                {ABOUT.location}
              </motion.p>
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
                  className="flex items-center justify-between gap-4 border-b border-[color:var(--color-border)] py-4 transition-colors hover:bg-white/[0.02]"
                >
                  <p
                    className="text-base font-medium text-white"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {cert.name}
                  </p>
                  <p className="font-mono text-xs text-[color:var(--color-text-muted)]">
                    {cert.date}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="mt-20"
        >
          <motion.span variants={child} className="label">
            Open source
          </motion.span>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {OPEN_SOURCE.map((item) => (
              <motion.a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                variants={card}
                whileHover={
                  reducedMotion
                    ? undefined
                    : {
                        y: -2,
                        transition: { type: 'spring', stiffness: 400, damping: 30 },
                      }
                }
                className="glass glass-medium block rounded-[var(--radius-lg)] p-6 sm:p-7"
              >
                <p className="label">{item.stack}</p>
                <h3 className="mt-4 text-white">{item.name}</h3>
                <p
                  className="mt-4 text-base leading-8 text-white/65"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {item.desc}
                </p>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
