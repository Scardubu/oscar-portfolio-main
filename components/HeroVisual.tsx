// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
// Major Reset • Lagos → Global • Production Conviction Architecture
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
//   v15: Panel 1 SYSTEMS: hashblanca → swarmxq with live uptime.
//   v15: Panel 3 architecture rotated to SwarmXQ triadic dispatch decision.
//   v15: Deploy feed updated — SwarmXQ routing event replaces hashblanca.
//   v15: 'audit trail' latency bar → 'agent route' for semantic accuracy.
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

import { cardReveal } from '@/lib/motionVariants';

// ── System status: live production health ───────────────────────────────────
const SYSTEMS = [
  { name: 'sabiscore', uptime: '99.94%', healthy: true },
  { name: 'taxbridge', uptime: '99.91%', healthy: true },
  { name: 'swarmxq', uptime: '99.82%', healthy: true },
] as const;

// ── API latency bars: concrete p99 numbers ──────────────────────────────────
const LATENCY_BARS = [
  { label: 'inference', ms: 48, maxMs: 200 },
  { label: 'tax calc', ms: 87, maxMs: 200 },
  { label: 'filing job', ms: 124, maxMs: 200 },
  { label: 'agent route', ms: 31, maxMs: 200 },
] as const;

// ── Sparkline data: 7-day normalised latency trend (0–1) ────────────────────
// Values represent relative latency over the past 7 days.
// Low, consistent values signal production stability — no spike pattern.
const SPARKLINE_POINTS = [0.35, 0.42, 0.38, 0.31, 0.44, 0.36, 0.29] as const;

// ── Recent deploys: operational cadence proof ───────────────────────────────
const RECENT_DEPLOYS = [
  {
    time: '23 min ago',
    msg: 'SabiScore · inference latency patch · p99 48ms',
    ok: true,
    perf: 'p99 48ms',
  },
  { time: '6 hr ago', msg: 'TaxBridge · NRS rate-limit guard · BullMQ', ok: true, perf: null },
  {
    time: '1 day ago',
    msg: 'SwarmXQ · triadic dispatch · DeepSeek-R1 routing',
    ok: true,
    perf: null,
  },
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
    <div className="hero-status-row flex items-center justify-between gap-4 border-b border-[oklch(100%_0_0_/_0.04)] py-2.5 last:border-b-0">
      <span className="hero-status-name font-mono text-[11px] text-[oklch(93%_0.006_264_/_0.48)]">
        {name}
      </span>
      <div className="hero-status-meta flex items-center gap-3">
        <span
          className="label-mono"
          // eslint-disable-next-line no-restricted-syntax
          style={{ color: healthy ? 'var(--color-success)' : 'var(--color-danger)' }}
        >
          {healthy ? 'HEALTHY' : 'DEGRADED'}
        </span>
        <span
          className="hero-status-uptime font-mono text-[12px] font-medium tabular-nums"
          // eslint-disable-next-line no-restricted-syntax
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
  const color =
    ms < 60 ? 'var(--color-success)' : ms < 120 ? 'var(--color-cyan)' : 'var(--color-accent)';

  return (
    <div className="hero-latency-row flex items-center gap-3">
      <span className="hero-latency-label w-14 flex-shrink-0 font-mono text-[10px] text-[oklch(93%_0.006_264_/_0.38)]">
        {label}
      </span>
      <div
        className="hero-latency-track h-[3px] flex-1 overflow-hidden rounded-full bg-[oklch(100%_0_0_/_0.06)]"
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
          // eslint-disable-next-line no-restricted-syntax
          style={{
            height: '100%',
            background: color,
            borderRadius: 'var(--radius-full)',
            transformOrigin: 'left',
          }}
        />
      </div>
      <span className="hero-latency-value w-[48px] flex-shrink-0 text-right font-mono text-[10px] text-[oklch(93%_0.006_264_/_0.42)] tabular-nums">
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
      className="hero-sparkline-strip mt-4 mb-1 flex h-5 items-end gap-1"
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
            // eslint-disable-next-line no-restricted-syntax
            style={{
              flex: 1,
              height: `${heightPct}%`,
              minHeight: '2px',
              maxHeight: '100%',
              borderRadius: '2px',
              transformOrigin: 'bottom',
              background: isLatest ? 'var(--color-success)' : 'oklch(65% 0.18 155 / 0.45)',
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
      className="hero-visual-dashboard [container-type:inline-size] relative hidden flex-col gap-3 lg:flex"
      aria-label="Live production metrics dashboard"
    >
      {/* ── Panel 1: System health ─────────────────────────────────────── */}
      <m.div
        variants={cardReveal(20)}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="hero-visual-panel glass-medium overflow-hidden rounded-[var(--radius-xl)]"
      >
        {/* Panel header */}
        <div className="hero-panel-head flex items-center justify-between border-b border-[oklch(100%_0_0_/_0.06)] px-4 py-3">
          <span className="hero-panel-title label-mono">System Status · 90-day Prometheus</span>
          <div className="hero-panel-meta flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="dot-live" aria-hidden="true" />
              <span className="label-mono text-color-success">All nominal</span>
            </div>
            {/* v14.0: zero-incident proof count */}
            <span className="font-mono text-[9px] text-[oklch(93%_0.006_264_/_0.3)] tabular-nums">
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
        className="hero-visual-panel glass-medium overflow-hidden rounded-[var(--radius-xl)]"
      >
        <div className="hero-panel-head flex items-center justify-between border-b border-[oklch(100%_0_0_/_0.06)] px-4 py-3">
          <span className="hero-panel-title label-mono">API Latency · p99 · rolling 7d</span>
          <span className="label-mono text-[var(--color-accent)]">target &lt;150ms</span>
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
          <div className="mt-1 border-t border-[oklch(100%_0_0_/_0.04)] pt-3">
            <p className="mb-1 font-mono text-[9px] text-[oklch(93%_0.006_264_/_0.28)]">
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
        className="hero-visual-panel glass-medium overflow-hidden rounded-[var(--radius-xl)]"
      >
        <div className="hero-panel-head flex items-center justify-between border-b border-[oklch(100%_0_0_/_0.06)] px-4 py-3">
          <span className="hero-panel-title label-mono">
            Architecture · SwarmXQ · Model Dispatch
          </span>
        </div>

        <div className="flex flex-col gap-3 px-4 py-4">
          {/* CHOSEN */}
          <div>
            <div className="label-mono text-color-success mb-1">CHOSEN</div>
            <div className="text-[13px] text-[oklch(93%_0.006_264_/_0.62)]">
              Triadic local GGUF dispatch (Ollama)
            </div>
          </div>

          {/* OVER */}
          <div>
            <div className="label-mono mb-1">OVER</div>
            <div className="text-[13px] text-[oklch(93%_0.006_264_/_0.32)]">
              Single large remote LLM API per task
            </div>
          </div>

          {/* BECAUSE — full weight, legible, engine-level proof */}
          <div className="arch-because-cell border-t border-[oklch(100%_0_0_/_0.05)] pt-2 pl-3">
            <div className="label-mono mb-1 text-[var(--color-accent)]" data-label="BECAUSE">
              BECAUSE
            </div>
            <div
              className="text-[12px] leading-6 font-medium text-[oklch(93%_0.006_264_/_0.82)]"
              data-label="BECAUSE"
            >
              Specialist small models routed by task class beat one large model on latency, cost,
              and offline resilience — zero cloud egress required.
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
        className="hero-visual-panel glass-medium overflow-hidden rounded-[var(--radius-xl)]"
      >
        <div className="hero-panel-head flex items-center justify-between border-b border-[oklch(100%_0_0_/_0.06)] px-4 py-3">
          <span className="hero-panel-title label-mono">Deploy feed</span>
          <span className="label-mono text-color-success">● 0 incidents</span>
        </div>

        <div className="px-4 py-1">
          {RECENT_DEPLOYS.map((deploy, i) => (
            <div
              key={i}
              className="flex items-start gap-3 border-b border-[oklch(100%_0_0_/_0.04)] py-2.5 last:border-b-0"
            >
              <span className="mt-0.5 flex-shrink-0 font-mono text-[9px] text-[oklch(93%_0.006_264_/_0.28)] tabular-nums">
                {deploy.time}
              </span>
              <span
                className="hero-deploy-msg commit-message flex-1 truncate font-mono text-[10px] leading-5"
                // eslint-disable-next-line no-restricted-syntax
                style={{ color: deploy.ok ? 'oklch(93% 0.006 264 / 0.52)' : 'var(--color-danger)' }}
              >
                {deploy.ok && (
                  <span className="text-color-success mr-[0.4rem]" aria-hidden="true">
                    ✓
                  </span>
                )}
                {deploy.msg}
              </span>
              {/* v14.0: perf badge on first deploy anchors p99 to a real event */}
              {deploy.perf && (
                <span className="text-color-success flex-shrink-0 rounded border border-[oklch(65%_0.18_155_/_0.2)] bg-[oklch(65%_0.18_155_/_0.1)] px-1.5 py-0.5 font-mono text-[9px] tabular-nums">
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
