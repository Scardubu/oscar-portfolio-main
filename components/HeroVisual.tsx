'use client';

// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
// HeroVisual.tsx — v16.0
//
// CHANGELOG v16.0 (upgrade from v15):
//   UPGRADE: SystemStatusRow — UptimeRing SVG replaces plain text color spans.
//            Circular progress ring renders actual uptime % as a filled arc.
//            Glow filter applied to the stroke when system is healthy.
//   UPGRADE: SparklinePath — smooth SVG cubic bezier replaces the bar-strip.
//            Area fill gradient beneath the line. Latest point gets a glow dot.
//            Vertical grid lines at each data point for reading aid.
//   UPGRADE: Architecture panel — ModelRouteFlow appended below BECAUSE block.
//            Renders the triadic phi4-fast/deepseek-r1/qwen-worker routing
//            with per-model accent color and task class label.
//   UPGRADE: Deploy feed rows — DeployRow component adds SHA badge + branch
//            chip. Status indicator now uses a bordered circle instead of
//            the inline ✓ character in the message string.
//   UPGRADE: Panel 1 header — "last 24h" incident counter relocated to its
//            own capsule badge for tighter visual hierarchy.
//   KEEP: cardReveal animations, useInView + once:true, LatencyBar spring.
//   KEEP: All SYSTEMS, LATENCY_BARS, SPARKLINE_POINTS, RECENT_DEPLOYS data.
//   KEEP: Accessibility attrs (aria-label, role="meter", aria-valuenow, etc.)

import { m, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

import { cardReveal } from '@/lib/motionVariants';

// ── System status ────────────────────────────────────────────────────────────
const SYSTEMS = [
  { name: 'sabiscore', uptime: 100, uptimeStr: 'ACTIVE', healthy: true },
  { name: 'taxbridge', uptime: 100, uptimeStr: 'ACTIVE', healthy: true },
  { name: 'swarmxq', uptime: 100, uptimeStr: 'ACTIVE', healthy: true },
] as const;

// ── API latency bars ─────────────────────────────────────────────────────────
const LATENCY_BARS = [
  { label: 'inference', ms: 48, maxMs: 200 },
  { label: 'tax calc', ms: 87, maxMs: 200 },
  { label: 'filing job', ms: 124, maxMs: 200 },
  { label: 'agent route', ms: 31, maxMs: 200 },
] as const;

// ── Sparkline: 7-day normalised latency trend (0–1) ──────────────────────────
const SPARKLINE_POINTS = [0.35, 0.42, 0.38, 0.31, 0.44, 0.36, 0.29] as const;

// ── Recent deploys ───────────────────────────────────────────────────────────
const RECENT_DEPLOYS = [
  {
    time: '23 min ago',
    msg: 'SabiScore · inference latency patch · p99 48ms',
    ok: true,
    perf: 'p99 48ms',
    branch: 'main',
    sha: 'a3f9c12',
  },
  {
    time: '6 hr ago',
    msg: 'TaxBridge · NRS rate-limit guard · BullMQ',
    ok: true,
    perf: null,
    branch: 'main',
    sha: 'b7e2d41',
  },
  {
    time: '1 day ago',
    msg: 'SwarmXQ · triadic dispatch · DeepSeek-R1 routing',
    ok: true,
    perf: null,
    branch: 'feat/routing',
    sha: 'c8f1a93',
  },
] as const;

// ── Triadic model routing ────────────────────────────────────────────────────
const MODEL_ROUTES = [
  { id: 'phi4', label: 'phi4\u2011fast', task: 'Reasoning', color: 'var(--color-film-teal)' },
  { id: 'deepseek', label: 'deepseek\u2011r1', task: 'Planning', color: 'var(--color-accent)' },
  { id: 'qwen', label: 'qwen\u2011worker', task: 'Execution', color: 'var(--color-film-amber)' },
] as const;

// ────────────────────────────────────────────────────────────────────────────
// UptimeRing — circular SVG progress arc
// ────────────────────────────────────────────────────────────────────────────
function UptimeRing({ uptime, healthy }: Readonly<{ uptime: number; healthy: boolean }>) {
  const r = 9;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(Math.max(uptime, 0), 100);
  const dash = (pct / 100) * circ;
  const gap = circ - dash;
  const color = healthy ? 'var(--color-success)' : 'var(--color-danger)';

  return (
    <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true" className="shrink-0">
      {/* Track */}
      <circle cx="11" cy="11" r={r} fill="none" stroke="oklch(100% 0 0 / 0.07)" strokeWidth="2" />
      {/* Fill arc */}
      <circle
        cx="11"
        cy="11"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeDasharray={`${dash.toFixed(2)} ${gap.toFixed(2)}`}
        strokeLinecap="round"
        transform="rotate(-90 11 11)"
        // eslint-disable-next-line no-restricted-syntax
        style={{ filter: healthy ? `drop-shadow(0 0 3px ${color})` : 'none' }}
      />
    </svg>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// SystemStatusRow
// ────────────────────────────────────────────────────────────────────────────
function SystemStatusRow({
  name,
  uptime,
  uptimeStr,
  healthy,
}: Readonly<{ name: string; uptime: number; uptimeStr: string; healthy: boolean }>) {
  const color = healthy ? 'var(--color-success)' : 'var(--color-danger)';

  return (
    <div className="hero-status-row flex items-center justify-between gap-3 border-b border-[oklch(100%_0_0_/_0.04)] py-2.5 last:border-b-0">
      <div className="flex min-w-0 items-center gap-2.5">
        <UptimeRing uptime={uptime} healthy={healthy} />
        <span className="hero-status-name font-mono text-[11px] text-[oklch(93%_0.006_264_/_0.55)]">
          {name}
        </span>
      </div>

      <div className="hero-status-meta flex shrink-0 items-center gap-2.5">
        <span
          className="label-mono text-[9px]"
          // eslint-disable-next-line no-restricted-syntax
          style={{ color }}
        >
          {healthy ? 'HEALTHY' : 'DEGRADED'}
        </span>
        <span
          className="hero-status-uptime font-mono text-[11px] font-semibold tabular-nums"
          // eslint-disable-next-line no-restricted-syntax
          style={{ color }}
        >
          {uptimeStr}
        </span>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// LatencyBar — spring-animated gradient bar
// ────────────────────────────────────────────────────────────────────────────
function LatencyBar({
  label,
  ms,
  maxMs,
  delay,
  reducedMotion,
}: Readonly<{
  label: string;
  ms: number;
  maxMs: number;
  delay: number;
  reducedMotion: boolean;
}>) {
  const pct = (ms / maxMs) * 100;
  const color =
    ms < 60 ? 'var(--color-success)' : ms < 120 ? 'var(--color-cyan)' : 'var(--color-accent)';
  const gradientColor =
    ms < 60
      ? 'oklch(65% 0.18 155 / 0.35)'
      : ms < 120
        ? 'oklch(74% 0.18 195 / 0.35)'
        : 'oklch(63% 0.22 258 / 0.35)';

  return (
    <div className="hero-latency-row flex items-center gap-3">
      <span className="hero-latency-label w-[3.25rem] shrink-0 font-mono text-[10px] text-[oklch(93%_0.006_264_/_0.38)]">
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
            reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 80, damping: 18, delay }
          }
          // eslint-disable-next-line no-restricted-syntax
          style={{
            height: '100%',
            background: `linear-gradient(90deg, ${color}, ${gradientColor})`,
            borderRadius: 'var(--radius-full)',
            transformOrigin: 'left',
          }}
        />
      </div>

      <span className="hero-latency-value w-[44px] shrink-0 text-right font-mono text-[10px] text-[oklch(93%_0.006_264_/_0.42)] tabular-nums">
        {ms}ms
      </span>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// SparklinePath — smooth SVG cubic bezier with area fill
// ────────────────────────────────────────────────────────────────────────────
function SparklinePath({ reducedMotion }: Readonly<{ reducedMotion: boolean }>) {
  const W = 200;
  const H = 20;
  const pts = [...SPARKLINE_POINTS];
  const maxV = Math.max(...pts);

  const coords = pts.map((v, i) => ({
    x: (i / (pts.length - 1)) * W,
    y: H - (v / maxV) * (H - 4) - 2,
  }));

  // Smooth cubic bezier through all points
  const linePath = coords.reduce<string>((acc, pt, i) => {
    if (i === 0) return `M ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
    const prev = coords[i - 1]!;
    const cpx = ((prev.x + pt.x) / 2).toFixed(1);
    return `${acc} C ${cpx} ${prev.y.toFixed(1)} ${cpx} ${pt.y.toFixed(1)} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
  }, '');

  const fillPath = `${linePath} L ${W} ${H} L 0 ${H} Z`;
  const last = coords[coords.length - 1]!;

  return (
    <svg
      width="100%"
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      aria-label="7-day latency trend: stable, no spikes"
      role="img"
      preserveAspectRatio="none"
      className="overflow-visible"
    >
      <defs>
        <linearGradient id="spark-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-success)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="var(--color-success)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Vertical guide lines */}
      {coords.map((pt, i) => (
        <line
          key={i}
          x1={pt.x}
          y1="0"
          x2={pt.x}
          y2={H}
          stroke="oklch(100% 0 0 / 0.05)"
          strokeWidth="1"
          strokeDasharray="2 3"
        />
      ))}

      {/* Area fill */}
      <path d={fillPath} fill="url(#spark-area)" />

      {/* Line */}
      <m.path
        d={linePath}
        fill="none"
        stroke="var(--color-success)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={
          reducedMotion
            ? { duration: 0 }
            : {
                pathLength: { duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.5 },
                opacity: { duration: 0.3, delay: 0.5 },
              }
        }
      />

      {/* Latest point glow dot */}
      <m.circle
        cx={last.x}
        cy={last.y}
        r="3"
        fill="var(--color-success)"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={
          reducedMotion
            ? { duration: 0 }
            : { delay: 1.8, type: 'spring', stiffness: 300, damping: 20 }
        }
        // eslint-disable-next-line no-restricted-syntax
        style={{ filter: 'drop-shadow(0 0 4px var(--color-success))' }}
      />
    </svg>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// ModelRouteFlow — triadic dispatch visualisation
// ────────────────────────────────────────────────────────────────────────────
function ModelRouteFlow() {
  return (
    <div className="mt-3 border-t border-[oklch(100%_0_0_/_0.05)] pt-3">
      <p className="mb-2.5 font-mono text-[9px] text-[oklch(93%_0.006_264_/_0.28)]">
        TRIADIC DISPATCH
      </p>

      <div className="flex items-center gap-2">
        {/* Router node */}
        <div className="flex shrink-0 flex-col items-center gap-1">
          <div className="flex h-6 w-6 items-center justify-center rounded-md border border-[oklch(100%_0_0_/_0.1)] bg-[oklch(100%_0_0_/_0.04)]">
            <span
              className="h-1.5 w-1.5 rounded-full"
              aria-hidden="true"
              // eslint-disable-next-line no-restricted-syntax
              style={{
                background: 'var(--color-film-teal)',
                boxShadow: '0 0 6px var(--color-film-teal)',
              }}
            />
          </div>
          <span className="font-mono text-[7px] text-[oklch(93%_0.006_264_/_0.28)]">ROUTER</span>
        </div>

        {/* Connector */}
        <div className="relative flex-1" aria-hidden="true">
          <div className="h-px bg-[oklch(100%_0_0_/_0.1)]" />
          <span className="absolute -top-[5px] -right-0.5 font-mono text-[8px] text-[oklch(93%_0.006_264_/_0.2)]">
            ▶
          </span>
        </div>

        {/* Model nodes */}
        <div className="flex items-start gap-1.5">
          {MODEL_ROUTES.map((model) => (
            <div key={model.id} className="flex flex-col items-center gap-1">
              <div
                className="rounded-md px-1.5 py-1 text-center font-mono text-[8px] leading-tight"
                // eslint-disable-next-line no-restricted-syntax
                style={{
                  color: model.color,
                  background: `color-mix(in oklch, ${model.color} 8%, transparent)`,
                  border: `1px solid color-mix(in oklch, ${model.color} 22%, transparent)`,
                }}
              >
                {model.label}
              </div>
              <span className="font-mono text-[7px] text-[oklch(93%_0.006_264_/_0.32)]">
                {model.task}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// DeployRow — enhanced with SHA badge + branch chip
// ────────────────────────────────────────────────────────────────────────────
function DeployRow({ deploy }: Readonly<{ deploy: (typeof RECENT_DEPLOYS)[number] }>) {
  const okColor = deploy.ok ? 'var(--color-success)' : 'var(--color-danger)';

  return (
    <div className="flex items-start gap-2 border-b border-[oklch(100%_0_0_/_0.04)] py-2.5 last:border-b-0">
      {/* Status circle */}
      <div className="mt-0.5 shrink-0">
        <div
          className="flex h-3.5 w-3.5 items-center justify-center rounded-full"
          // eslint-disable-next-line no-restricted-syntax
          style={{
            background: `color-mix(in oklch, ${okColor} 12%, transparent)`,
            border: `1px solid color-mix(in oklch, ${okColor} 28%, transparent)`,
          }}
        >
          <span
            className="font-mono text-[7px] leading-none"
            // eslint-disable-next-line no-restricted-syntax
            style={{ color: okColor }}
          >
            {deploy.ok ? '✓' : '✗'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        {/* SHA + branch row */}
        <div className="mb-1 flex items-center gap-1.5">
          <span className="shrink-0 rounded border border-[oklch(100%_0_0_/_0.08)] bg-[oklch(100%_0_0_/_0.04)] px-1.5 py-px font-mono text-[9px] text-[oklch(93%_0.006_264_/_0.38)] tabular-nums">
            {deploy.sha}
          </span>
          <span
            className="shrink-0 rounded px-1.5 py-px font-mono text-[8px]"
            // eslint-disable-next-line no-restricted-syntax
            style={{
              color: 'var(--color-film-teal)',
              background: 'oklch(70% 0.21 188 / 0.08)',
              border: '1px solid oklch(70% 0.21 188 / 0.16)',
            }}
          >
            {deploy.branch}
          </span>
        </div>

        {/* Commit message */}
        <span
          className="hero-deploy-msg commit-message font-mono text-[10px] leading-5"
          // eslint-disable-next-line no-restricted-syntax
          style={{
            color: deploy.ok ? 'oklch(93% 0.006 264 / 0.52)' : 'var(--color-danger)',
          }}
        >
          {deploy.msg}
        </span>
      </div>

      {/* Time + perf column */}
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="font-mono text-[9px] whitespace-nowrap text-[oklch(93%_0.006_264_/_0.28)] tabular-nums">
          {deploy.time}
        </span>
        {deploy.perf && (
          <span className="shrink-0 rounded border border-[oklch(65%_0.18_155_/_0.2)] bg-[oklch(65%_0.18_155_/_0.1)] px-1.5 py-0.5 font-mono text-[9px] text-[var(--color-success)] tabular-nums">
            {deploy.perf}
          </span>
        )}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// HeroVisual — main export
// ────────────────────────────────────────────────────────────────────────────
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
      {/* ── Panel 1: System health ───────────────────────────────────────── */}
      <m.div
        variants={cardReveal(20)}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="hero-visual-panel glass-medium overflow-hidden rounded-[var(--radius-xl)]"
      >
        <div className="hero-panel-head flex items-center justify-between border-b border-[oklch(100%_0_0_/_0.06)] px-4 py-3">
          <span className="hero-panel-title label-mono">
            System Health · High-Availability Architecture
          </span>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="dot-live" aria-hidden="true" />
              <span className="label-mono text-color-success">All nominal</span>
            </div>
            <span className="rounded-full border border-[oklch(100%_0_0_/_0.06)] bg-[oklch(100%_0_0_/_0.04)] px-1.5 py-0.5 font-mono text-[9px] text-[oklch(93%_0.006_264_/_0.3)] tabular-nums">
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

      {/* ── Panel 2: API latency + sparkline ────────────────────────────── */}
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

          <div className="mt-1 border-t border-[oklch(100%_0_0_/_0.04)] pt-3">
            <p className="mb-2 font-mono text-[9px] text-[oklch(93%_0.006_264_/_0.28)]">
              7-DAY TREND
            </p>
            <SparklinePath reducedMotion={reducedMotion ?? false} />
          </div>
        </div>
      </m.div>

      {/* ── Panel 3: Architecture decision ──────────────────────────────── */}
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
          <div>
            <div className="label-mono text-color-success mb-1">CHOSEN</div>
            <div className="text-[13px] text-[oklch(93%_0.006_264_/_0.62)]">
              Triadic local GGUF dispatch (Ollama)
            </div>
          </div>

          <div>
            <div className="label-mono mb-1">OVER</div>
            <div className="text-[13px] text-[oklch(93%_0.006_264_/_0.32)]">
              Single large remote LLM API per task
            </div>
          </div>

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

          {/* v16: triadic dispatch route diagram */}
          <ModelRouteFlow />
        </div>
      </m.div>

      {/* ── Panel 4: Recent deploy feed ──────────────────────────────────── */}
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
            <DeployRow key={i} deploy={deploy} />
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
