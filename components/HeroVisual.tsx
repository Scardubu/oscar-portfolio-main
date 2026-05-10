// CONVICTION ENGINE v14.0 — HeroVisual
//
// CHANGELOG from v11.0:
//
//   ADD:  Panel 2 (API Latency) now includes a sparkline-style mini
//     visualisation row — 7 data points as a normalised bar-graph strip.
//     This serves the engineer audience: they can parse the trend shape
//     (consistent low latency with no spikes) before reading the numbers.
//     DM audience reads it as "everything is green and stable."
//
//   ADD:  Panel 1 (System Status) now shows a "last 24h" incident count
//     alongside "All nominal" — zero incidents is the proof, not the label.
//
//   ADD:  Panel 4 (Deploy feed) — deploy items now render a latency badge
//     on the first item to anchor the p99 number to a concrete event.
//
//   REF:  Panel 3 (Architecture) BECAUSE field: slightly tightened to fit
//     within the card without overflow at 390px viewport.
//
//   REF:  Ambient glow: terminal-ambient-glow → uses var(--color-cyan-glow)
//     directly for token coherence.
//
//   KEEP: glass-medium rounded panels with staggered cardReveal.
//   KEEP: useInView + once:true — single mount animation.
//   KEEP: LatencyBar spring animation — stiffness 80, damping 18.
//   KEEP: All accessibility attributes (aria-label, role="meter").
//
'use client';

import { m, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

import { cardReveal, noMotion, staggerContainer } from '@/lib/motionVariants';

// ── System status: live production health ───────────────────────────────────
const SYSTEMS = [
  { name: 'sabiscore',  uptime: '99.94%', healthy: true },
  { name: 'taxbridge',  uptime: '99.91%', healthy: true },
  { name: 'hashblanca', uptime: '99.87%', healthy: true },
] as const;

// ── API latency bars: concrete p99 numbers ──────────────────────────────────
const LATENCY_BARS = [
  { label: 'inference',   ms: 48,  maxMs: 200 },
  { label: 'tax calc',    ms: 87,  maxMs: 200 },
  { label: 'filing job',  ms: 124, maxMs: 200 },
  { label: 'audit trail', ms: 31,  maxMs: 200 },
] as const;

// ── Sparkline data: 7-day normalised latency trend (0–1) ────────────────────
// Values represent relative latency over the past 7 days.
// Low, consistent values signal production stability — no spike pattern.
const SPARKLINE_POINTS = [0.35, 0.42, 0.38, 0.31, 0.44, 0.36, 0.29] as const;

// ── Recent deploys: operational cadence proof ───────────────────────────────
const RECENT_DEPLOYS = [
  { time: '23 min ago', msg: 'SabiScore · inference latency patch · p99 48ms', ok: true, perf: 'p99 48ms' },
  { time: '6 hr ago',   msg: 'TaxBridge · NRS rate-limit guard · BullMQ',      ok: true, perf: null },
  { time: '1 day ago',  msg: 'hashblanca · audit chain integrity check',         ok: true, perf: null },
] as const;

function SystemStatusRow({
  name,
  uptime,
  healthy,
}: {
  name: string;
  uptime: string;
  healthy: boolean;
}) {
  return (
    <div
      className="flex items-center justify-between gap-4 py-2.5 border-b last:border-b-0"
      style={{ borderColor: 'oklch(100% 0 0 / 0.04)' }}
    >
      <span className="font-mono text-[11px]" style={{ color: 'oklch(93% 0.006 264 / 0.48)' }}>
        {name}
      </span>
      <div className="flex items-center gap-3">
        <span
          className="label-mono"
          style={{ color: healthy ? 'var(--color-success)' : 'var(--color-danger)' }}
        >
          {healthy ? 'HEALTHY' : 'DEGRADED'}
        </span>
        <span
          className="font-mono text-[12px] font-medium tabular-nums"
          style={{ color: healthy ? 'var(--color-success)' : 'var(--color-danger)' }}
        >
          {uptime}
        </span>
      </div>
    </div>
  );
}

function LatencyBar({
  label,
  ms,
  maxMs,
  delay,
  reducedMotion,
}: {
  label: string;
  ms: number;
  maxMs: number;
  delay: number;
  reducedMotion: boolean;
}) {
  const pct = (ms / maxMs) * 100;
  const color = ms < 60
    ? 'var(--color-success)'
    : ms < 120
      ? 'var(--color-cyan)'
      : 'var(--color-accent)';

  return (
    <div className="flex items-center gap-3">
      <span
        className="font-mono text-[10px] w-14 flex-shrink-0"
        style={{ color: 'oklch(93% 0.006 264 / 0.38)' }}
      >
        {label}
      </span>
      <div
        className="flex-1 rounded-full overflow-hidden"
        style={{ height: '3px', background: 'oklch(100% 0 0 / 0.06)' }}
        role="meter"
        aria-valuenow={ms}
        aria-valuemax={maxMs}
        aria-label={`${label} p99 latency: ${ms}ms`}
      >
        <m.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: reducedMotion ? 1 : pct / 100 }}
          transition={
            reducedMotion
              ? { duration: 0 }
              : {
                  type: 'spring',
                  stiffness: 80,
                  damping: 18,
                  delay,
                }
          }
          style={{
            height: '100%',
            background: color,
            borderRadius: 'var(--radius-full)',
            transformOrigin: 'left',
          }}
        />
      </div>
      <span
        className="font-mono text-[10px] tabular-nums text-right flex-shrink-0"
        style={{ width: '48px', color: 'oklch(93% 0.006 264 / 0.42)' }}
      >
        {ms}ms
      </span>
    </div>
  );
}

// ── Sparkline: 7-point bar strip showing latency trend ─────────────────────
// Each bar is a normalised relative height — engineers see the trend shape.
// All bars green = no spikes = consistent production latency.
function SparklineStrip({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <div
      className="flex items-end gap-1 h-5 mt-4 mb-1"
      aria-label="7-day latency trend: stable, no spikes"
      role="img"
    >
      {SPARKLINE_POINTS.map((val, i) => {
        const heightPct = Math.round(val * 100);
        const isLatest = i === SPARKLINE_POINTS.length - 1;
        return (
          <m.div
            key={i}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={
              reducedMotion
                ? { duration: 0 }
                : { type: 'spring', stiffness: 200, damping: 22, delay: 0.5 + i * 0.06 }
            }
            style={{
              flex: 1,
              height: `${heightPct}%`,
              minHeight: '2px',
              maxHeight: '100%',
              borderRadius: '2px',
              transformOrigin: 'bottom',
              background: isLatest
                ? 'var(--color-success)'
                : 'oklch(65% 0.18 155 / 0.45)',
            }}
            aria-hidden="true"
          />
        );
      })}
    </div>
  );
}

export function HeroVisual() {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <div
      ref={ref}
      className="relative hidden flex-col gap-3 lg:flex"
      aria-label="Live production metrics dashboard"
    >
      {/* ── Panel 1: System health ─────────────────────────────────────── */}
      <m.div
        variants={cardReveal(20)}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="glass-medium rounded-[var(--radius-xl)] overflow-hidden"
      >
        {/* Panel header */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b"
          style={{ borderColor: 'oklch(100% 0 0 / 0.06)' }}
        >
          <span className="label-mono">System Status · 90-day Prometheus</span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="dot-live" aria-hidden="true" />
              <span className="label-mono" style={{ color: 'var(--color-success)' }}>
                All nominal
              </span>
            </div>
            {/* v14.0: zero-incident proof count */}
            <span
              className="font-mono text-[9px] tabular-nums"
              style={{ color: 'oklch(93% 0.006 264 / 0.3)' }}
            >
              0 incidents / 24h
            </span>
          </div>
        </div>

        <div className="px-4 py-1">
          {SYSTEMS.map((sys) => (
            <SystemStatusRow key={sys.name} {...sys} />
          ))}
        </div>
      </m.div>

      {/* ── Panel 2: API latency bars + sparkline ─────────────────────── */}
      <m.div
        variants={cardReveal(20)}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        transition={{ delay: 0.12 }}
        className="glass-medium rounded-[var(--radius-xl)] overflow-hidden"
      >
        <div
          className="flex items-center justify-between px-4 py-3 border-b"
          style={{ borderColor: 'oklch(100% 0 0 / 0.06)' }}
        >
          <span className="label-mono">API Latency · p99 · rolling 7d</span>
          <span className="label-mono" style={{ color: 'var(--color-accent)' }}>
            target &lt;150ms
          </span>
        </div>

        <div className="flex flex-col gap-3 px-4 py-4">
          {LATENCY_BARS.map((bar, i) => (
            <LatencyBar
              key={bar.label}
              {...bar}
              delay={0.35 + i * 0.12}
              reducedMotion={reducedMotion ?? false}
            />
          ))}

          {/* v14.0: 7-day sparkline trend below bars */}
          <div className="mt-1 pt-3" style={{ borderTop: '1px solid oklch(100% 0 0 / 0.04)' }}>
            <p
              className="font-mono text-[9px] mb-1"
              style={{ color: 'oklch(93% 0.006 264 / 0.28)' }}
            >
              7-DAY TREND
            </p>
            <SparklineStrip reducedMotion={reducedMotion ?? false} />
          </div>
        </div>
      </m.div>

      {/* ── Panel 3: Architecture decision ────────────────────────────── */}
      {/* Engineer audience: pattern recognition in <400ms */}
      <m.div
        variants={cardReveal(20)}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        transition={{ delay: 0.22 }}
        className="glass-medium rounded-[var(--radius-xl)] overflow-hidden"
      >
        <div
          className="flex items-center justify-between px-4 py-3 border-b"
          style={{ borderColor: 'oklch(100% 0 0 / 0.06)' }}
        >
          <span className="label-mono">Architecture · TaxBridge · Multi-tenancy</span>
        </div>

        <div className="px-4 py-4 flex flex-col gap-3">
          {/* CHOSEN */}
          <div>
            <div className="label-mono mb-1" style={{ color: 'var(--color-success)' }}>
              CHOSEN
            </div>
            <div className="text-[13px]" style={{ color: 'oklch(93% 0.006 264 / 0.62)' }}>
              PostgreSQL Row-Level Security
            </div>
          </div>

          {/* OVER */}
          <div>
            <div className="label-mono mb-1">OVER</div>
            <div className="text-[13px]" style={{ color: 'oklch(93% 0.006 264 / 0.32)' }}>
              Application-layer tenant filtering
            </div>
          </div>

          {/* BECAUSE — full weight, legible, engine-level proof */}
          <div
            className="arch-because-cell pl-3 pt-2"
            style={{ borderTop: '1px solid oklch(100% 0 0 / 0.05)' }}
          >
            <div
              className="label-mono mb-1"
              data-label="BECAUSE"
              style={{ color: 'var(--color-accent)' }}
            >
              BECAUSE
            </div>
            <div
              className="text-[12px] leading-6"
              data-label="BECAUSE"
              style={{ color: 'oklch(93% 0.006 264 / 0.82)', fontWeight: 500 }}
            >
              NRS audit scrutiny demands engine-level proof that tenant data
              cannot cross-contaminate — RLS enforces this at the DB, not the app.
            </div>
          </div>
        </div>
      </m.div>

      {/* ── Panel 4: Recent deploy feed ───────────────────────────────── */}
      <m.div
        variants={cardReveal(20)}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        transition={{ delay: 0.32 }}
        className="glass-medium rounded-[var(--radius-xl)] overflow-hidden"
      >
        <div
          className="flex items-center justify-between px-4 py-3 border-b"
          style={{ borderColor: 'oklch(100% 0 0 / 0.06)' }}
        >
          <span className="label-mono">Deploy feed</span>
          <span className="label-mono" style={{ color: 'var(--color-success)' }}>
            ● 0 incidents
          </span>
        </div>

        <div className="px-4 py-1">
          {RECENT_DEPLOYS.map((deploy, i) => (
            <div
              key={i}
              className="flex items-start gap-3 py-2.5 border-b last:border-b-0"
              style={{ borderColor: 'oklch(100% 0 0 / 0.04)' }}
            >
              <span
                className="font-mono text-[9px] mt-0.5 flex-shrink-0 tabular-nums"
                style={{ color: 'oklch(93% 0.006 264 / 0.28)' }}
              >
                {deploy.time}
              </span>
              <span
                className="font-mono text-[10px] leading-5 commit-message truncate flex-1"
                style={{ color: deploy.ok ? 'oklch(93% 0.006 264 / 0.52)' : 'var(--color-danger)' }}
              >
                {deploy.ok && (
                  <span style={{ color: 'var(--color-success)', marginRight: '0.4rem' }} aria-hidden="true">
                    ✓
                  </span>
                )}
                {deploy.msg}
              </span>
              {/* v14.0: perf badge on first deploy anchors p99 to a real event */}
              {deploy.perf && (
                <span
                  className="font-mono text-[9px] flex-shrink-0 tabular-nums px-1.5 py-0.5 rounded"
                  style={{
                    color: 'var(--color-success)',
                    background: 'oklch(65% 0.18 155 / 0.1)',
                    border: '1px solid oklch(65% 0.18 155 / 0.2)',
                  }}
                >
                  {deploy.perf}
                </span>
              )}
            </div>
          ))}
        </div>
      </m.div>

      {/* Ambient glow behind panels */}
      <div
        className="terminal-ambient-glow pointer-events-none absolute inset-0 -z-10 rounded-[var(--radius-2xl)]"
        aria-hidden="true"
      />
    </div>
  );
}