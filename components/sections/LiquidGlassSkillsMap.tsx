'use client';
/**
 * components/sections/LiquidGlassSkillsMap.tsx
 * ──────────────────────────────────────────────────────────────────────────
 * SIGNATURE MAP v3 — World-Class Production Ready
 *
 * Merged & refined from both versions + current codebase reality:
 *   • Tactile momentum physics canvas drag (premium feel from v1 — zero D3)
 *   • Data-driven connections via shared `usedIn` (current SKILLS + PROJECTS)
 *   • Liquid-glass nodes with emoji icons, level progress, active pulse
 *   • Category filter buttons + live connection highlighting
 *   • Framer Motion: useInView, AnimatePresence detail panel, spring scale
 *   • Certifications grid (from v2) with hover lift
 *   • No external dependencies (pure SVG + pointer events + RAF momentum)
 *
 * World-class inspirations:
 *   • Aceternity / Hover.dev interactive maps
 *   • Awwwards tactile skill canvases
 *   • Framer Academy scroll + spring polish
 *
 * Seamless integration:
 *   • 100% uses existing SKILLS + PROJECTS from '@/lib/data'
 *   • Same CSS vars, liquid-glass, badge, section-label, --bento-pad
 *   • Matches Hero & Bento patterns (useInView, AnimatePresence, reduced-motion)
 *   • Drop-in replacement — no breakage, no new packages
 * ──────────────────────────────────────────────────────────────────────────
 */

import { useRef, useState, useEffect, useCallback } from 'react';
import {
  motion,
  useInView,
  AnimatePresence,
  useReducedMotion,
} from 'framer-motion';
import { SectionLabel } from '@/components/reusable';
import { SKILLS, PROJECTS, type Skill } from '@/lib/data';

// ── Category config (synced to current data.ts) ───────────────────────────

const CATEGORY_COLORS: Record<Skill['category'], string> = {
  ml: 'var(--accent-secondary)',
  backend: 'var(--accent-fintech)',
  frontend: 'var(--accent-primary)',
  devops: 'var(--accent-warn)',
  blockchain: 'var(--accent-secondary)',
};

const CATEGORY_LABELS: Record<Skill['category'], string> = {
  ml: 'Machine Learning',
  backend: 'Backend',
  frontend: 'Frontend',
  devops: 'DevOps',
  blockchain: 'Blockchain',
};

// ── Deterministic node positions (clustered, SSR-safe) ─────────────────────

const NODE_POSITIONS: Record<string, { x: number; y: number }> = {
  // ML cluster — top right
  xgboost: { x: 820, y: 120 },
  pytorch: { x: 950, y: 80 },
  scikit: { x: 820, y: 220 },
  langchain: { x: 950, y: 200 },
  mlflow: { x: 820, y: 320 },
  // Backend cluster — left
  fastapi: { x: 180, y: 180 },
  fastify: { x: 80, y: 280 },
  postgresql: { x: 280, y: 340 },
  redis: { x: 180, y: 420 },
  python: { x: 80, y: 100 },
  // Frontend cluster — bottom left
  nextjs: { x: 320, y: 520 },
  'react-native': { x: 180, y: 580 },
  typescript: { x: 420, y: 480 },
  // DevOps cluster — center
  docker: { x: 520, y: 420 },
  'github-actions': { x: 620, y: 320 },
  prisma: { x: 520, y: 180 },
  // Blockchain cluster — bottom right
  web3py: { x: 950, y: 420 },
  circom: { x: 820, y: 520 },
};

// ── Build links from shared usedIn (current data model) ────────────────────

function buildLinks(skills: Skill[]) {
  const links: { source: string; target: string }[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < skills.length; i++) {
    for (let j = i + 1; j < skills.length; j++) {
      const a = skills[i];
      const b = skills[j];
      const shared = a.usedIn?.some((p) => b.usedIn?.includes(p)) ?? false;
      if (shared) {
        const key = `${a.id}-${b.id}`;
        if (!seen.has(key)) {
          seen.add(key);
          links.push({ source: a.id, target: b.id });
        }
      }
    }
  }
  return links;
}

// ── Main component ─────────────────────────────────────────────────────────

export default function LiquidGlassSkillsMap() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const inView = useInView(sectionRef, { once: true, amount: 0.1 });
  const shouldRed = useReducedMotion();

  const [activeSkill, setActiveSkill] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<Skill['category'] | 'All'>('All');

  // ── Pre-computed connections ─────────────────────────────────────────────
  const allLinks = buildLinks(SKILLS);

  const visibleSkills = activeCategory === 'All'
    ? SKILLS
    : SKILLS.filter((s) => s.category === activeCategory);

  const visibleIds = new Set(visibleSkills.map((s) => s.id));

  const visibleLinks = allLinks.filter(
    (l) => visibleIds.has(l.source) && visibleIds.has(l.target)
  );

  const activeSkillData = activeSkill
    ? SKILLS.find((s) => s.id === activeSkill)
    : null;

  const activeConnectionIds = activeSkillData
    ? new Set([
        activeSkill,
        ...visibleLinks
          .filter((l) => l.source === activeSkill || l.target === activeSkill)
          .flatMap((l) => [l.source, l.target]),
      ])
    : new Set<string>();

  // ── Canvas momentum drag (premium tactile physics) ───────────────────────
  const stateRef = useRef({ x: 0, y: 0, vx: 0, vy: 0 });
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0, t: 0 });
  const rafId = useRef(0);

  const applyTransform = useCallback(() => {
    if (!canvasRef.current) return;
    canvasRef.current.style.transform = `translate(${stateRef.current.x}px, ${stateRef.current.y}px)`;
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const onPointerDown = (e: PointerEvent) => {
      dragging.current = true;
      wrap.setPointerCapture(e.pointerId);
      lastPos.current = { x: e.clientX, y: e.clientY, t: Date.now() };
      cancelAnimationFrame(rafId.current);
      stateRef.current.vx = 0;
      stateRef.current.vy = 0;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      const dt = Math.max(Date.now() - lastPos.current.t, 1);

      stateRef.current.x += dx;
      stateRef.current.y += dy;
      if (!shouldRed) {
        stateRef.current.vx = (dx / dt) * 16;
        stateRef.current.vy = (dy / dt) * 16;
      }
      applyTransform();
      lastPos.current = { x: e.clientX, y: e.clientY, t: Date.now() };
    };

    const onPointerUp = () => {
      dragging.current = false;
      if (shouldRed) return;

      const momentum = () => {
        stateRef.current.vx *= 0.91;
        stateRef.current.vy *= 0.91;
        stateRef.current.x += stateRef.current.vx;
        stateRef.current.y += stateRef.current.vy;
        applyTransform();

        if (Math.abs(stateRef.current.vx) > 0.15 || Math.abs(stateRef.current.vy) > 0.15) {
          rafId.current = requestAnimationFrame(momentum);
        }
      };
      rafId.current = requestAnimationFrame(momentum);
    };

    wrap.addEventListener('pointerdown', onPointerDown);
    wrap.addEventListener('pointermove', onPointerMove);
    wrap.addEventListener('pointerup', onPointerUp);
    wrap.addEventListener('pointercancel', onPointerUp);

    return () => {
      wrap.removeEventListener('pointerdown', onPointerDown);
      wrap.removeEventListener('pointermove', onPointerMove);
      wrap.removeEventListener('pointerup', onPointerUp);
      wrap.removeEventListener('pointercancel', onPointerUp);
      cancelAnimationFrame(rafId.current);
    };
  }, [applyTransform, shouldRed]);

  // SVG dimensions
  const SVG_W = 1100;
  const SVG_H = 660;

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="py-[var(--space-section)]"
      aria-label="Skills Architecture Map"
    >
      <div className="section-container">
        {/* Header + filters */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <SectionLabel accent="primary">Skills Architecture</SectionLabel>
          <h2 className="section-title">
            The Toolbox That Ships
          </h2>
          <p className="section-subtitle max-w-xl">
            Drag the canvas. Click nodes to see connections. Built from real production usage.
          </p>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mt-8" role="group">
            {(['All', ...Object.keys(CATEGORY_COLORS)] as const).map((cat) => (
              <button
                key={cat}
                onClick={() =>
                  setActiveCategory(
                    cat === 'All' ? 'All' : (cat as Skill['category'])
                  )
                }
                className={`btn btn-sm transition-all ${
                  activeCategory === cat ? 'btn-primary' : 'btn-ghost'
                }`}
              >
                {cat === 'All' ? 'All' : CATEGORY_LABELS[cat as Skill['category']]}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Interactive Map */}
        <div
          ref={wrapRef}
          className="relative mx-auto overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--border-subtle)]"
          style={{
            width: '100%',
            maxWidth: '100vw',
            height: 'clamp(420px, 55vw, 660px)',
            background: 'var(--bg-surface)',
            cursor: 'grab',
            userSelect: 'none',
          }}
        >
          {/* Dopamine + noise overlay */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ background: 'var(--gradient-dopamine-full)', opacity: 0.45 }}
          />

          {/* Draggable canvas */}
          <div
            ref={canvasRef}
            className="absolute left-1/2 top-1/2"
            style={{
              width: SVG_W,
              height: SVG_H,
              transformOrigin: 'top left',
              marginLeft: -(SVG_W / 2),
              marginTop: -(SVG_H / 2),
              willChange: 'transform',
            }}
          >
            {/* Connection lines */}
            <svg
              width={SVG_W}
              height={SVG_H}
              className="absolute inset-0 pointer-events-none"
              aria-hidden="true"
            >
              {visibleLinks.map((link, i) => {
                const a = NODE_POSITIONS[link.source];
                const b = NODE_POSITIONS[link.target];
                if (!a || !b) return null;

                const isActive = activeSkill && activeConnectionIds.has(link.source) && activeConnectionIds.has(link.target);
                const color = isActive
                  ? CATEGORY_COLORS[SKILLS.find((s) => s.id === link.source)?.category ?? 'ml']
                  : 'rgba(255,255,255,0.25)';

                return (
                  <line
                    key={i}
                    x1={a.x + 42}
                    y1={a.y + 42}
                    x2={b.x + 42}
                    y2={b.y + 42}
                    stroke={color}
                    strokeWidth={isActive ? 2.5 : 1}
                    strokeDasharray={isActive ? undefined : '3 3'}
                    opacity={isActive ? 0.85 : 0.22}
                    style={{ transition: 'all 0.2s ease' }}
                  />
                );
              })}
            </svg>

            {/* Skill nodes */}
            {visibleSkills.map((skill) => {
              const pos = NODE_POSITIONS[skill.id];
              if (!pos) return null;

              const color = CATEGORY_COLORS[skill.category];
              const isActive = activeSkill === skill.id;
              const isRelated = activeConnectionIds.has(skill.id);
              const isDimmed = activeSkill && !isRelated;

              return (
                <motion.button
                  key={skill.id}
                  onClick={() => setActiveSkill((prev) => (prev === skill.id ? null : skill.id))}
                  className="absolute flex flex-col items-center gap-1.5 group"
                  style={{
                    left: pos.x,
                    top: pos.y,
                    width: 88,
                    opacity: isDimmed ? 0.28 : 1,
                  }}
                  whileTap={{ scale: 0.92 }}
                  animate={isActive ? { scale: 1.15 } : { scale: 1 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 18 }}
                  aria-pressed={isActive}
                  aria-label={`${skill.name} — ${CATEGORY_LABELS[skill.category]} — level ${skill.level}/5`}
                >
                  {/* Liquid glass node */}
                  <div
                    className="relative w-20 h-20 rounded-3xl border flex items-center justify-center transition-all duration-300 backdrop-blur-xl"
                    style={{
                      background: isActive ? `${color}15` : 'rgba(19,19,24,0.75)',
                      borderColor: isActive ? color : isRelated ? `${color}60` : 'rgba(255,255,255,0.1)',
                      boxShadow: isActive
                        ? `0 0 28px -6px ${color}70, 0 8px 16px rgba(0,0,0,0.5)`
                        : '0 4px 14px rgba(0,0,0,0.4)',
                    }}
                  >
                    {/* Emoji icon */}
                    <span className="text-3xl drop-shadow-sm">{skill.icon}</span>

                    {/* Level progress */}
                    <div className="absolute bottom-2 left-3 right-3 h-1 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${(skill.level / 5) * 100}%`,
                          background: color,
                        }}
                      />
                    </div>

                    {/* Active ring */}
                    {isActive && (
                      <span
                        className="absolute inset-0 rounded-3xl border border-current animate-ping"
                        style={{ color, animationDuration: '1.6s' }}
                      />
                    )}
                  </div>

                  {/* Label */}
                  <span
                    className="text-[10px] font-medium tracking-tight"
                    style={{ color: isActive ? color : 'var(--text-muted)' }}
                  >
                    {skill.name}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Active detail panel */}
          <AnimatePresence>
            {activeSkillData && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.97 }}
                className="absolute bottom-6 right-6 liquid-glass p-6 rounded-3xl max-w-xs shadow-[var(--shadow-liquid-3d)]"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{activeSkillData.icon}</span>
                      <div>
                        <p className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                          {activeSkillData.name}
                        </p>
                        <p className="text-xs uppercase tracking-[0.08em]" style={{ color: CATEGORY_COLORS[activeSkillData.category] }}>
                          {CATEGORY_LABELS[activeSkillData.category]}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveSkill(null)}
                    className="text-2xl leading-none text-[var(--text-muted)] hover:text-white transition-colors"
                  >
                    ×
                  </button>
                </div>

                <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>
                  {activeSkillData.description}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {activeSkillData.usedIn?.map((pid) => {
                    const proj = PROJECTS.find((p) => p.id === pid);
                    return proj ? (
                      <span
                        key={pid}
                        className="badge text-xs px-3 py-1"
                        style={{
                          background: 'var(--bg-elevated)',
                          borderColor: 'var(--border-subtle)',
                        }}
                      >
                        {proj.title}
                      </span>
                    ) : null;
                  })}
                  <span className="badge text-xs px-3 py-1" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}>
                    Level {activeSkillData.level}/5
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Drag hint */}
          <div
            className="absolute bottom-6 left-6 flex items-center gap-2 text-xs pointer-events-none"
            style={{ color: 'var(--text-muted)' }}
          >
            <span>↔︎ Drag canvas to explore</span>
          </div>
        </div>

        {/* Certifications */}
        <div className="mt-16">
          <h3 className="mb-6 text-caption uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>
            Certifications & Continuous Learning
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-[var(--bento-gap)]">
            {[
              {
                title: '17 Kaggle Micro-Courses',
                org: 'Kaggle',
                year: '2023',
                url: 'https://www.kaggle.com/scardubu',
              },
              {
                title: 'Machine Learning Crash Course',
                org: 'Google',
                year: '2022',
                url: 'https://developers.google.com/machine-learning/crash-course',
              },
              {
                title: 'Machine Learning Specialization',
                org: 'Coursera • Andrew Ng',
                year: '2022',
                url: 'https://www.coursera.org/specializations/machine-learning',
              },
            ].map((cert, i) => (
              <motion.a
                key={i}
                href={cert.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.1 }}
                className="liquid-glass rounded-[var(--radius-2xl)] p-6 group hover:shadow-[var(--shadow-liquid-3d-hover)] transition-all"
              >
                <p className="font-semibold group-hover:text-[var(--accent-primary)] transition-colors" style={{ color: 'var(--text-primary)' }}>
                  {cert.title}
                </p>
                <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                  {cert.org} • {cert.year}
                </p>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
