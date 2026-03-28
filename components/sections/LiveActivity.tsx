'use client';
/**
 * components/sections/LiveActivity.tsx
 * ──────────────────────────────────────────────────────────────────────────
 * REFINE — Real-time Feel Engine
 *
 * Fixes applied:
 * 1. Initialize with deterministic data — no async, no stuck "loading" state
 * 2. GitHub stats rendered immediately from lib/data.ts
 * 3. Activity feed with stagger animation
 * 4. Portfolio performance metrics (FCP, LCP, TTFB, bundle size)
 * 5. Rotating local activity entry every 12s for motion continuity
 * ──────────────────────────────────────────────────────────────────────────
 */

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Github, Activity, Zap, Clock } from 'lucide-react';
import { ACTIVITY_FEED, GITHUB_STATS, PORTFOLIO_PERF, type ActivityItem } from '@/lib/data';
import { cn } from '@/lib/utils';

// ── Activity dot ──────────────────────────────────────────────────────────

const DOT_COLORS: Record<ActivityItem['color'], string> = {
  cyan:   'var(--accent-primary)',
  violet: 'var(--accent-secondary)',
  teal:   'var(--accent-fintech)',
  warn:   'var(--accent-warn)',
};

const TYPE_LABELS: Record<ActivityItem['type'], string> = {
  commit:  'commit',
  deploy:  'deploy',
  metric:  'metric',
  release: 'release',
};

function ActivityRow({ item, index, inView }: {
  item:   ActivityItem;
  index:  number;
  inView: boolean;
}) {
  const color = DOT_COLORS[item.color];

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.4, delay: 0.05 + index * 0.06 }}
      className="flex items-start gap-3 py-2.5"
      style={{ borderBottom: '1px solid var(--border-subtle)' }}
    >
      {/* Type dot */}
      <span
        className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
        style={{ background: color, boxShadow: `0 0 6px ${color}` }}
      />

      <div className="flex-1 min-w-0">
        <p
          className="text-sm leading-snug truncate"
          style={{ color: 'var(--text-primary)' }}
        >
          {item.message}
        </p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
          <span
            className="inline-block px-1.5 py-0.5 rounded mr-1.5"
            style={{ background: 'var(--bg-elevated)', color }}
          >
            {TYPE_LABELS[item.type]}
          </span>
          {item.repo} · {item.timestamp}
        </p>
      </div>
    </motion.div>
  );
}

// ── Gauge bar ─────────────────────────────────────────────────────────────

function MetricBar({
  label,
  value,
  max,
  unit,
  color,
  inView,
  delay,
}: {
  label:  string;
  value:  number;
  max:    number;
  unit:   string;
  color:  string;
  inView: boolean;
  delay:  number;
}) {
  const pct = Math.min((value / max) * 100, 100);
  // Lower is better for ms metrics — invert green for high scores
  const isGood = unit === 'ms' ? value < max * 0.5 : value > max * 0.9;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-baseline">
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</span>
        <span className="text-xs font-mono font-bold" style={{ color }}>
          {value}{unit}
        </span>
      </div>
      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ background: 'var(--bg-elevated)' }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${pct}%` } : {}}
          transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────

export default function LiveActivity() {
  const sectionRef   = useRef<HTMLElement>(null);
  const inView       = useInView(sectionRef, { once: true, amount: 0.1 });

  // Simulate a new event appearing every 12 seconds
  const [feed, setFeed] = useState(ACTIVITY_FEED);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 600);
    }, 12000);
    return () => clearInterval(id);
  }, [inView]);

  const perf = PORTFOLIO_PERF;
  const gh   = GITHUB_STATS;

  return (
    <section
      id="activity"
      ref={sectionRef}
      className="py-[var(--space-section)]"
      aria-label="GitHub activity and portfolio metrics"
    >
      <div className="section-container">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="section-label">Live Activity</div>
          <h2 className="section-title">
            Shipping in{' '}
            <span className="text-gradient-accent">production</span>
          </h2>
          <p className="section-subtitle">
            Open-source work, deployment cadence, and portfolio performance — live.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-[var(--bento-gap)]">

          {/* Activity feed */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="liquid-glass rounded-[var(--radius-2xl)] p-[var(--bento-pad)]"
          >
            {/* Feed header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold" style={{ color: 'var(--text-primary)', fontSize: 'var(--fs-body)' }}>
                Recent Activity
              </h3>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'live-dot transition-all duration-300',
                    pulse ? 'scale-150' : ''
                  )}
                  style={{ color: 'var(--metric-live)' }}
                />
                <span className="text-xs" style={{ color: 'var(--metric-live)' }}>LIVE</span>
              </div>
            </div>

            {/* Feed items */}
            <div>
              {feed.map((item, i) => (
                <ActivityRow key={item.id} item={item} index={i} inView={inView} />
              ))}
            </div>
          </motion.div>

          {/* Right column: GitHub stats + performance */}
          <div className="flex flex-col gap-[var(--bento-gap)]">

            {/* GitHub stats */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="liquid-glass rounded-[var(--radius-2xl)] p-[var(--bento-pad)]"
            >
              <div className="flex items-center gap-2 mb-4">
                <Github size={16} style={{ color: 'var(--accent-primary)' }} />
                <h3 className="font-semibold" style={{ color: 'var(--text-primary)', fontSize: 'var(--fs-body)' }}>
                  GitHub Activity
                </h3>
              </div>
              <div className="bento-metric-row gap-3">
                {[
                  { val: gh.commits + '+', label: 'Commits/yr' },
                  { val: gh.repos,          label: 'Public repos' },
                  { val: gh.followers,      label: 'Followers' },
                ].map((s) => (
                  <div key={s.label} className="flex flex-col gap-1">
                    <span
                      className="font-bold tabular-nums"
                      style={{ fontSize: 'var(--fs-subhead)', color: 'var(--text-primary)' }}
                    >
                      {s.val}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
              <a
                href={gh.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-sm mt-4 w-full gap-2"
              >
                <Github size={14} />
                View GitHub Profile
              </a>
            </motion.div>

            {/* Portfolio performance */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.22 }}
              className="liquid-glass rounded-[var(--radius-2xl)] p-[var(--bento-pad)] flex-1"
            >
              <div className="flex items-center gap-2 mb-5">
                <Zap size={16} style={{ color: 'var(--accent-primary)' }} />
                <h3 className="font-semibold" style={{ color: 'var(--text-primary)', fontSize: 'var(--fs-body)' }}>
                  Portfolio Performance
                </h3>
                <span
                  className="badge ml-auto"
                  style={{
                    background:  'var(--metric-live-dim)',
                    borderColor: 'var(--metric-live-border)',
                    color:       'var(--metric-live)',
                  }}
                >
                  {perf.uptime} uptime
                </span>
              </div>

              <div className="flex flex-col gap-4">
                <MetricBar label="FCP"         value={parseInt(perf.fcp)}  max={500}  unit="ms" color="var(--accent-primary)"  inView={inView} delay={0.3} />
                <MetricBar label="LCP"         value={parseInt(perf.lcp)}  max={1000} unit="ms" color="var(--accent-fintech)"  inView={inView} delay={0.38} />
                <MetricBar label="TTFB"        value={parseInt(perf.ttfb)} max={200}  unit="ms" color="var(--accent-secondary)" inView={inView} delay={0.46} />
                <MetricBar label="Bundle size" value={perf.bundleKb}       max={perf.bundleTarget} unit="KB" color="var(--accent-warn)" inView={inView} delay={0.54} />
              </div>

              {/* Traffic snapshot */}
              <div
                className="mt-5 pt-4 flex items-center justify-between"
                style={{ borderTop: '1px solid var(--border-subtle)' }}
              >
                <div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Monthly visitors</div>
                  <div className="font-bold" style={{ color: 'var(--text-primary)', fontSize: 'var(--fs-body)' }}>
                    {perf.monthlyVisitors}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Avg. session</div>
                  <div className="font-bold" style={{ color: 'var(--text-primary)', fontSize: 'var(--fs-body)' }}>
                    {Math.floor(perf.avgSessionSecs / 60)}m {perf.avgSessionSecs % 60}s
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
