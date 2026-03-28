'use client';
/**
 * components/sections/Hero.tsx
 * ──────────────────────────────────────────────────────────────────────────
 * AUTHORITY ENGINE v3 — World-Class Production Ready
 *
 * Refined from deep analysis:
 *   • KineticHeadline (repo source): now uses gradient={true} + built-in spring
 *     CHAR_VARIANTS (rotateX + blur stagger) for true kinetic pop
 *   • Framer Motion scroll triggers: useScroll + useTransform parallax on
 *     headshot + floating pills (subtle depth, 2025 best-practice)
 *   • Metric counter: switched to true easeOutExpo (snappier, premium finish)
 *     — inspired by top Framer portfolios (Josh Comeau, Hover.dev, Awwwards)
 *   • Data: 100% synced to current lib/data.ts (HERO_* exports only)
 *   • Design system: liquid-glass, retro-grid, dopamine orbs, live-dot,
 *     all CSS vars/globals.css preserved
 *   • Performance: GPU-only (transform/opacity), reduced-motion safe,
 *     once: true inView, RAF counters
 *
 * World-class inspirations merged:
 *   • Parallax depth (Framer Academy + Hover.dev examples)
 *   • Spring-kinetic text (repo KineticHeadline + Aceternity/Magic UI)
 *   • Expo easing counters (top 2025 Next.js portfolios)
 *   • Subtle floating metrics + live uptime signal
 * ──────────────────────────────────────────────────────────────────────────
 */

import { useRef, useEffect, useState } from 'react';
import {
  motion,
  useReducedMotion,
  useInView,
  AnimatePresence,
  useScroll,
  useTransform,
} from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  ChevronDown,
  Sparkles,
  MapPin,
} from 'lucide-react';
import KineticHeadline from '@/components/ui/KineticHeadline';

import {
  HERO_AVAILABILITY,
  HERO_ROLE_TAGS,
  HERO_METRICS,
  HERO_CTA_PRIMARY,
  HERO_CTA_TERTIARY,
  HERO_CTA_SECONDARY,
  HERO_SUBHEADLINE,
} from '@/lib/data';

// ── Premium counter (easeOutExpo — researched best for metrics) ─────────────

function useCounter(
  target: number,
  decimals = 0,
  duration = 1800,
  active = false
) {
  const [val, setVal] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!active || started.current) return;
    started.current = true;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      // easeOutExpo — crisp, premium finish used in top portfolios
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setVal(parseFloat((target * eased).toFixed(decimals)));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, target, decimals, duration]);

  return active ? val : 0;
}

// ── HeroMetric (live only on uptime, sublabel from data) ───────────────────

function HeroMetric({
  metric,
  delay,
  active,
}: {
  metric: typeof HERO_METRICS[number];
  delay: number;
  active: boolean;
}) {
  const shouldRed = useReducedMotion();

  const valueStr = metric.value;
  const numTarget = parseFloat(valueStr.replace(/[^0-9.]/g, '')) || 0;
  const suffix = valueStr.replace(/[\d.]/g, '');
  const decimals = valueStr.includes('.') ? 1 : 0;

  const count = useCounter(numTarget, decimals, 1800, !shouldRed && active);

  const displayed = !shouldRed && active
    ? count.toFixed(decimals) + suffix
    : valueStr;

  const isLive = metric.label.toLowerCase().includes('uptime');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      className="liquid-glass rounded-[var(--radius-xl)] p-[var(--bento-pad-sm)]
                 flex flex-col gap-1 min-w-[120px]"
    >
      {isLive && (
        <span className="flex items-center gap-1.5 mb-1">
          <span
            className="live-dot animate-ping-slow"
            style={{ color: 'var(--accent-primary)' }}
          />
          <span
            className="text-[10px] uppercase tracking-widest font-semibold"
            style={{ color: 'var(--accent-primary)' }}
          >
            Live
          </span>
        </span>
      )}

      <span
        className="font-bold tabular-nums leading-none"
        style={{
          fontSize: 'var(--fs-metric)',
          color: 'var(--text-primary)',
          lineHeight: 'var(--lh-tight)',
        }}
      >
        {displayed}
      </span>

      <span
        className="font-medium"
        style={{ fontSize: 'var(--fs-caption)', color: 'var(--text-secondary)' }}
      >
        {metric.label}
      </span>
      {metric.sublabel && (
        <span
          className="text-[10px] opacity-75 block"
          style={{ color: 'var(--text-muted)' }}
        >
          {metric.sublabel}
        </span>
      )}
    </motion.div>
  );
}

// ── Main Hero — fully operational & world-class ────────────────────────────

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);

  const metricsInView = useInView(metricsRef, { once: true, amount: 0.2 });
  const shouldRed = useReducedMotion();

  // ── Scroll parallax (headshot + floating pills) ────────────────────────
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const headshotY = useTransform(scrollYProgress, [0, 1], [0, 35]); // subtle depth
  const pillYTop = useTransform(scrollYProgress, [0, 1], [0, -12]);
  const pillYBottom = useTransform(scrollYProgress, [0, 1], [0, 18]);

  // ── Role cycling (data-driven) ─────────────────────────────────────────
  const roles = HERO_ROLE_TAGS;
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    if (shouldRed) return;
    const id = setInterval(() => {
      setRoleIndex((i) => (i + 1) % roles.length);
    }, 2800);
    return () => clearInterval(id);
  }, [shouldRed, roles.length]);

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-[100dvh] flex items-center overflow-hidden
                 pt-[5rem] pb-[var(--space-section)]"
      aria-label="Hero — Oscar Ndugbu, Full-Stack ML Engineer"
    >
      {/* ── Background (retro-grid + dopamine orbs + noise) ── */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{ background: 'var(--gradient-hero)' }}
        />
        <div
          className="retro-grid absolute inset-0 opacity-100"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'var(--gradient-dopamine-full)' }}
          aria-hidden="true"
        />
        <div className="noise-overlay absolute inset-0 opacity-50" aria-hidden="true" />
      </div>

      {/* ── Content ── */}
      <div className="section-container w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 xl:gap-20 items-center">

          {/* ── Left column ── */}
          <div className="flex flex-col gap-8">

            {/* Location + availability badge */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center flex-wrap gap-3"
            >
              <span
                className="flex items-center gap-1.5 text-sm"
                style={{ color: 'var(--text-muted)' }}
              >
                <MapPin size={13} strokeWidth={2} />
                Lagos, Nigeria · Remote-First
              </span>

              <span
                className="badge"
                style={{
                  background: 'var(--accent-primary-dim)',
                  borderColor: 'var(--accent-primary-border)',
                  color: 'var(--accent-primary)',
                }}
              >
                <Sparkles size={11} strokeWidth={2.5} />
                {HERO_AVAILABILITY}
              </span>
            </motion.div>

            {/* Kinetic name (gradient + spring rotateX/blur) */}
            <div>
              <KineticHeadline
                text="Oscar Ndugbu"
                as="h1"
                gradient
                delay={0.15}
                stagger={0.028}
                className="font-black tracking-tight"
              />

              {/* Animated specialization */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="mt-3 h-9 overflow-hidden"
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={roleIndex}
                    initial={{ y: 28, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -28, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="block font-semibold text-gradient-accent"
                    style={{ fontSize: 'var(--fs-kinetic-sub)' }}
                  >
                    {roles[roleIndex]}
                  </motion.span>
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="max-w-[560px]"
              style={{
                fontSize: 'var(--fs-subhead)',
                color: 'var(--text-secondary)',
                lineHeight: 'var(--lh-relaxed)',
              }}
            >
              {HERO_SUBHEADLINE}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.15 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Link href={HERO_CTA_PRIMARY.href} className="btn btn-primary group">
                {HERO_CTA_PRIMARY.label}
                <ArrowRight
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
              <Link href={HERO_CTA_TERTIARY.href} className="btn btn-ghost">
                {HERO_CTA_TERTIARY.label}
              </Link>
              <a
                href={HERO_CTA_SECONDARY.href}
                download
                className="text-sm font-medium underline underline-offset-4 decoration-dotted
                           transition-colors duration-200"
                style={{ color: 'var(--text-muted)' }}
              >
                {HERO_CTA_SECONDARY.label}
              </a>
            </motion.div>

            {/* Metrics */}
            <div
              ref={metricsRef}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2"
            >
              {HERO_METRICS.map((m, i) => (
                <HeroMetric
                  key={m.label}
                  metric={m}
                  delay={1.25 + i * 0.1}
                  active={metricsInView}
                />
              ))}
            </div>
          </div>

          {/* ── Right column — parallax headshot (liquid-glass + floating pills) ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, x: 24 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.75, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative hidden lg:flex justify-center"
          >
            {/* Outer glow ring */}
            <div
              className="absolute -inset-6 rounded-[var(--radius-3xl)] pointer-events-none"
              style={{
                background: 'var(--gradient-dopamine-cyan)',
                filter: 'blur(40px)',
              }}
              aria-hidden="true"
            />

            {/* Liquid glass frame + parallax container */}
            <motion.div
              style={{ y: headshotY }}
              className="relative liquid-glass-cyan rounded-[var(--radius-3xl)] p-3
                         shadow-[var(--shadow-liquid-float)]"
            >
              <Image
                src="/headshot.webp"
                alt="Oscar Ndugbu professional headshot"
                width={380}
                height={460}
                priority
                className="rounded-[var(--radius-2xl)] object-cover object-top
                           w-[340px] h-[420px]"
                style={{ display: 'block' }}
              />

              {/* Floating pill — parallax */}
              <motion.div
                style={{ y: pillYTop, boxShadow: 'var(--shadow-liquid-3d)' }}
                className="absolute -top-4 -right-4 liquid-glass rounded-[var(--radius-xl)]
                           px-4 py-2 flex items-center gap-2"
              >
                <span
                  className="live-dot animate-ping-slow"
                  style={{ color: 'var(--metric-live)' }}
                />
                <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Always-On
                </span>
              </motion.div>

              {/* Floating pill — parallax */}
              <motion.div
                style={{ y: pillYBottom, boxShadow: 'var(--shadow-liquid-3d)' }}
                className="absolute -bottom-4 -left-4 liquid-glass rounded-[var(--radius-xl)]
                           px-4 py-2"
              >
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>AI Precision</div>
                <div className="text-sm font-bold" style={{ color: 'var(--accent-primary)' }}>
                  Signal-Led
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
      >
        <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
          scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={18} style={{ color: 'var(--text-muted)' }} />
        </motion.div>
      </motion.div>
    </section>
  );
}
