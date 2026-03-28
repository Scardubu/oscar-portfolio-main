'use client'

/**
 * components/hero/HeroSection.tsx
 *
 * The first 8 seconds of every reviewer's experience.
 *
 * Copy decisions (each line is deliberate):
 *
 *   "I build ML systems that stay in production."
 *   → "stay in production" implies shipping, monitoring, debugging, iteration.
 *   → It is specific and falsifiable — a reviewer looks for evidence immediately.
 *   → It positions Oscar as infrastructure-minded, not demo-minded.
 *
 *   "Principal Backend Engineer — ML infrastructure, fintech compliance,
 *    distributed data pipelines."
 *   → Three specific domain claims. All three are evidenced by project cards below.
 *
 *   "Four production systems. Verifiable outcomes. Every architecture decision documented."
 *   → "Four" is immediately checked against the project section.
 *   → "Verifiable" is immediately tested by the MetricBadge sources.
 *   → "Architecture decision documented" — a reviewer scrolls to DecisionChip.
 *
 * REMOVED:
 *   "Hey, I'm Oscar 👋"         — junior portfolio energy
 *   "Self-taught from Nigeria"  — credibility limiter in Staff+ context
 *   "real problems for real people" — marketing copy, not engineering identity
 *   Animated counters from zero — HARD CONSTRAINT VIOLATION
 */

import * as React from 'react'
import Image      from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { fadeUp, stagger, viewportOnce } from '@/lib/motion'
import { HeroStats }  from '@/components/hero/HeroStats'
import { anchorUrl }  from '@/lib/config'

// ─── Component ────────────────────────────────────────────────────────────────

export function HeroSection(): React.ReactElement {
  const prefersReduced = useReducedMotion()
  const shouldAnimate  = !prefersReduced

  return (
    <section
      id="home"
      aria-labelledby="hero-heading"
      className="
        relative min-h-[90dvh] flex items-center
        px-4 sm:px-6 lg:px-8
        pt-24 pb-16
        overflow-hidden
      "
    >
      {/* Subtle radial gradient — visual depth without distraction */}
      <div
        className="
          pointer-events-none absolute inset-0 -z-10
          bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(0,217,255,0.06),transparent)]
        "
        aria-hidden="true"
      />

      <div className="w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Left column: copy ─────────────────────────────────────── */}
          <motion.div
            variants={shouldAnimate ? stagger(0.1, 0.12) : {}}
            initial={shouldAnimate ? 'hidden' : false}
            whileInView={shouldAnimate ? 'visible' : undefined}
            viewport={shouldAnimate ? viewportOnce : undefined}
            className="flex flex-col gap-6"
          >
            {/* Location tag */}
            <motion.p
              variants={shouldAnimate ? fadeUp : {}}
              className="
                inline-flex items-center gap-2 self-start
                text-sm text-[color:var(--text-muted)] font-medium
              "
              aria-label="Location: Nigeria, remote-first"
            >
              <span aria-hidden="true">🇳🇬</span>
              Nigeria · Remote-First
            </motion.p>

            {/* Main heading */}
            <motion.h1
              id="hero-heading"
              variants={shouldAnimate ? fadeUp : {}}
              className="text-display"
            >
              I build ML systems
              <br />
              <span style={{ color: 'var(--accent-primary)' }}>
                that stay in production.
              </span>
            </motion.h1>

            {/* Sub-heading */}
            <motion.p
              variants={shouldAnimate ? fadeUp : {}}
              className="text-subhead max-w-lg"
            >
              Principal Backend Engineer — ML infrastructure, fintech compliance
              systems, and distributed data pipelines.
            </motion.p>

            {/* Value statement */}
            <motion.p
              variants={shouldAnimate ? fadeUp : {}}
              className="text-body max-w-lg"
            >
              Four production systems. Verifiable outcomes.
              Every architecture decision documented.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={shouldAnimate ? fadeUp : {}}
              className="flex flex-wrap gap-3 mt-2"
              role="group"
              aria-label="Primary actions"
            >
              <a
                href={anchorUrl('projects')}
                className="
                  inline-flex items-center gap-2 px-5 py-2.5
                  rounded-lg font-semibold text-sm
                  bg-[color:var(--accent-primary)] text-[color:var(--bg-base)]
                  hover:brightness-110 transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-primary)]
                  focus:ring-offset-2 focus:ring-offset-[color:var(--bg-base)]
                "
                aria-label="View production systems"
              >
                View Systems
                <span aria-hidden="true">↓</span>
              </a>

              <a
                href="/cv/oscar-ndugbu-cv.pdf"
                download
                className="
                  inline-flex items-center gap-2 px-5 py-2.5
                  rounded-lg font-semibold text-sm
                  border border-[color:var(--border-default)]
                  text-[color:var(--text-secondary)]
                  hover:border-[color:var(--border-strong)]
                  hover:text-[color:var(--text-primary)]
                  transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-primary)]
                  focus:ring-offset-2 focus:ring-offset-[color:var(--bg-base)]
                "
                aria-label="Download CV as PDF"
              >
                Download CV
                <span aria-hidden="true">↓</span>
              </a>

              <a
                href={anchorUrl('contact')}
                className="
                  inline-flex items-center gap-2 px-5 py-2.5
                  rounded-lg font-semibold text-sm
                  border border-[color:var(--border-subtle)]
                  text-[color:var(--text-muted)]
                  hover:border-[color:var(--border-default)]
                  hover:text-[color:var(--text-secondary)]
                  transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-primary)]
                  focus:ring-offset-2 focus:ring-offset-[color:var(--bg-base)]
                "
                aria-label="Contact Oscar"
              >
                Let&apos;s Talk
              </a>
            </motion.div>
          </motion.div>

          {/* ── Right column: headshot ──────────────────────────────── */}
          <motion.div
            variants={shouldAnimate ? fadeUp : {}}
            initial={shouldAnimate ? 'hidden' : false}
            whileInView={shouldAnimate ? 'visible' : undefined}
            viewport={shouldAnimate ? viewportOnce : undefined}
            className="relative flex justify-center lg:justify-end"
          >
            {/* Glow ring behind headshot */}
            <div
              className="
                absolute inset-0 rounded-full
                bg-[radial-gradient(circle_at_center,rgba(0,217,255,0.12),transparent_70%)]
                blur-2xl
              "
              aria-hidden="true"
            />

            <div className="
              relative w-64 h-64 sm:w-80 sm:h-80
              rounded-full overflow-hidden
              border-2 border-[color:var(--border-default)]
              ring-4 ring-[color:var(--bg-surface)]
            ">
              <Image
                src="/headshot.webp"
                alt="Oscar Ndugbu — Principal Backend Engineer"
                fill
                sizes="(max-width: 640px) 256px, 320px"
                className="object-cover object-top"
                priority
              />
            </div>
          </motion.div>
        </div>

        {/* ── Metrics row — full width below the two columns ──────────── */}
        <div className="mt-16">
          <p className="text-caption mb-5" style={{ color: 'var(--text-muted)' }}>
            Production metrics — all values sourced and verifiable
          </p>
          <HeroStats />
        </div>
      </div>
    </section>
  )
}