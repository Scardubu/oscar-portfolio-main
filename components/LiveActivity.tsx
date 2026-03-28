"use client";
// components/LiveActivity.tsx — System Status
// ─────────────────────────────────────────────────────────────────────────────
// Framer Motion:
//   • AnimatePresence for live ticker item transitions
//   • whileInView stagger for activity feed entries
//   • Spring-physics uptime ring draw
//   • layout animations for CWV bars
// ─────────────────────────────────────────────────────────────────────────────

import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { LIVE_METRICS, ACTIVITY_FEED } from "@/lib/portfolio-data";
import {
  staggerContainer,
  staggerFast,
  fadeUp,
  fadeLeft,
  fadeRight,
  activityItem,
  liquidCard,
  springs,
} from "@/lib/motion";

// ── Activity type config ──────────────────────────────────────────────────────

const ACTIVITY_CONFIG = {
  ml:      { label: "ML",      color: "var(--accent-primary)",   icon: "🤖" },
  user:    { label: "User",    color: "var(--success)",          icon: "👤" },
  perf:    { label: "Perf",    color: "var(--accent-fintech)",   icon: "⚡" },
  infra:   { label: "Infra",   color: "var(--accent-secondary)", icon: "🔗" },
  shipped: { label: "Shipped", color: "var(--accent-warn)",      icon: "🚀" },
} as const;

// ── Live ticker events ─────────────────────────────────────────────────────────

const TICKER_EVENTS = [
  "Prediction request served — 84ms",
  "Cache hit — Redis feature store",
  "SabiScore: new match event processed",
  "Health check passed — all services ✓",
  "XGBoost inference: 91ms latency",
  "PostgreSQL query optimized: 12ms",
  "Model v3.2: drift score nominal",
] as const;

// ── Animated live dot ─────────────────────────────────────────────────────────

function LiveDot({ color }: { color: string }) {
  const prefersReduced = useReducedMotion();
  return (
    <span className="relative inline-flex w-2 h-2 flex-shrink-0 mt-0.5" aria-hidden="true">
      {!prefersReduced && (
        <motion.span
          className="absolute inline-flex h-full w-full rounded-full"
          style={{ background: color }}
          animate={{ scale: [1, 1.9, 1], opacity: [0.7, 0, 0.7] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <span
        className="relative inline-flex rounded-full w-2 h-2"
        style={{ background: color }}
      />
    </span>
  );
}

// ── Live ticker ───────────────────────────────────────────────────────────────

function LiveTicker() {
  const prefersReduced = useReducedMotion();
  const [tickIdx, setTickIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setTickIdx((i) => (i + 1) % TICKER_EVENTS.length);
    }, 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="liquid-depth-layer px-3 py-2.5 flex items-center gap-2 overflow-hidden min-h-[36px]">
      <LiveDot color="var(--metric-live)" />
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.span
            key={tickIdx}
            className="block text-caption text-secondary font-mono truncate"
            initial={prefersReduced ? {} : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReduced ? {} : { opacity: 0, y: -10 }}
            transition={springs.snappy}
          >
            {TICKER_EVENTS[tickIdx]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Activity feed item ────────────────────────────────────────────────────────

function ActivityFeedItem({
  event,
  time,
  type,
  index,
}: {
  event: string;
  time:  string;
  type:  keyof typeof ACTIVITY_CONFIG;
  index: number;
}) {
  const cfg = ACTIVITY_CONFIG[type];
  return (
    <motion.div
      className="flex items-start gap-3 py-2.5 border-b border-white/[0.05] last:border-0"
      variants={activityItem}
      custom={index}
      layout
    >
      <LiveDot color={cfg.color} />
      <div className="flex-1 min-w-0">
        <p className="text-body text-secondary leading-snug line-clamp-2">
          {event}
        </p>
      </div>
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <span
          className="text-[0.58rem] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full"
          style={{ background: cfg.color + "18", color: cfg.color }}
        >
          {cfg.label}
        </span>
        <span className="text-caption text-muted whitespace-nowrap">
          {time}
        </span>
      </div>
    </motion.div>
  );
}

// ── CWV bar ───────────────────────────────────────────────────────────────────

function CWVBar({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max:   number;
  color: string;
}) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-caption text-muted">
        <span>{label}</span>
        <motion.span
          style={{ color }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          {value}ms
        </motion.span>
      </div>
      <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ ...springs.liquid, delay: 0.2 }}
          style={{ background: color }}
        />
      </div>
    </div>
  );
}

// ── Uptime ring ───────────────────────────────────────────────────────────────

function UptimeRing({ value }: { value: string }) {
  const pct  = parseFloat(value);
  const r    = 36;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  return (
    <div className="relative w-24 h-24 flex-shrink-0">
      <svg width="96" height="96" viewBox="0 0 96 96" aria-hidden="true">
        <circle
          cx="48" cy="48" r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="6"
        />
        <motion.circle
          cx="48" cy="48" r={r}
          fill="none"
          stroke="var(--accent-fintech)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDashoffset={circ * 0.25}
          initial={{ strokeDasharray: `0 ${circ}` }}
          whileInView={{
            strokeDasharray: `${dash} ${circ - dash}`,
          }}
          viewport={{ once: true }}
          transition={{ ...springs.liquid, duration: 1.2 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono font-extrabold text-sm text-gradient-fintech leading-none">
          {value}
        </span>
        <span className="text-[0.55rem] text-muted uppercase tracking-wider mt-0.5">
          uptime
        </span>
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function LiveActivity() {
  return (
    <section
      id="activity"
      className="section-gap max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
      aria-labelledby="activity-heading"
    >
      {/* Header */}
      <motion.div
        className="mb-12"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.p className="text-caption text-muted mb-2" variants={fadeUp}>
          System Status
        </motion.p>
        <motion.h2
          id="activity-heading"
          className="text-headline text-gradient-kinetic"
          variants={fadeUp}
        >
          Portfolio Performance
        </motion.h2>
        <motion.p
          className="text-subhead text-secondary mt-3 max-w-xl"
          variants={fadeUp}
        >
          Live-style metrics mirroring production targets — uptime, Core Web
          Vitals, and real deployment activity.
        </motion.p>
      </motion.div>

      {/* Two-column grid */}
      <div className="bento-grid">
        {/* Uptime + CWV */}
        <motion.div
          className="col-span-12 sm:col-span-6 liquid-glass liquid-glass-teal bento-cell flex flex-col gap-6"
          variants={liquidCard}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="flex items-center gap-5">
            <UptimeRing value={LIVE_METRICS.uptime} />
            <div>
              <p className="text-caption text-muted mb-0.5">System Reliability</p>
              <p className="text-headline text-primary">{LIVE_METRICS.uptime}</p>
              <p className="text-caption text-muted mt-1">
                Target: {LIVE_METRICS.uptimeTarget}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-caption text-muted uppercase tracking-widest">
              Core Web Vitals
            </p>
            <CWVBar
              label="FCP"
              value={120}
              max={400}
              color="var(--accent-primary)"
            />
            <CWVBar
              label="LCP"
              value={420}
              max={800}
              color="var(--accent-fintech)"
            />
            <CWVBar
              label="TTFB"
              value={80}
              max={200}
              color="var(--accent-secondary)"
            />
          </div>

          <div className="flex justify-between items-center text-caption">
            <span className="text-muted">Bundle size</span>
            <span className="font-mono text-primary">
              {LIVE_METRICS.bundleSize}
              <span className="text-muted ml-1">/ {LIVE_METRICS.bundleTarget}</span>
            </span>
          </div>
        </motion.div>

        {/* Live ticker + feed */}
        <motion.div
          className="col-span-12 sm:col-span-6 liquid-glass liquid-glass-cyan bento-cell flex flex-col gap-4"
          variants={liquidCard}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ ...springs.liquid, delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <p className="text-caption text-muted uppercase tracking-widest">
              Live Activity
            </p>
            <span className="badge badge-primary text-[0.55rem]">
              <span className="relative flex h-1.5 w-1.5 mr-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--metric-live)] opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--metric-live)]" />
              </span>
              Live
            </span>
          </div>

          <LiveTicker />

          {/* Feed */}
          <motion.div
            className="flex flex-col overflow-hidden"
            variants={staggerFast}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[...ACTIVITY_FEED].map((item, i) => (
              <ActivityFeedItem
                key={item.id}
                event={item.event}
                time={item.time}
                type={item.type}
                index={i}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* Stat cells */}
        {[
          {
            label:    "Monthly Visitors",
            value:    `${LIVE_METRICS.monthlyVisits}`,
            gradient: "text-gradient-accent",
            span:     "col-span-12 sm:col-span-4",
          },
          {
            label:    "Avg. Session",
            value:    LIVE_METRICS.avgSession,
            gradient: "text-gradient-fintech",
            span:     "col-span-12 sm:col-span-4",
          },
          {
            label:    "Lighthouse Score",
            value:    "99 / 100",
            gradient: "",
            color:    "var(--accent-secondary)",
            span:     "col-span-12 sm:col-span-4",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            className={cn(
              stat.span,
              "liquid-glass bento-cell-sm flex flex-col gap-2"
            )}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ ...springs.default, delay: i * 0.08 }}
            whileHover={{ y: -2 }}
          >
            <p className="text-caption text-muted">{stat.label}</p>
            <span
              className={cn(
                "font-mono font-extrabold leading-none",
                stat.gradient
              )}
              style={{
                fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                color: "color" in stat ? stat.color : undefined,
              }}
            >
              {stat.value}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
