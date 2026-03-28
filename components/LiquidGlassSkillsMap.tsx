"use client";
// components/LiquidGlassSkillsMap.tsx — Signature Component
// ─────────────────────────────────────────────────────────────────────────────
// Framer Motion powered force-directed skill graph:
//   • useDragControls + drag constraints for nodes
//   • spring physics on node release (velocity-based)
//   • whileHover glow + scale on skill nodes
//   • AnimatePresence for detail panel
//   • layout animations for category filter transitions
//   • useReducedMotion: static grid fallback
// ─────────────────────────────────────────────────────────────────────────────

import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useSpring as useMotionSpring,
  useMotionValue,
  animate,
} from "framer-motion";
import {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { cn } from "@/lib/utils";
import { SKILLS } from "@/lib/portfolio-data";
import type { Skill, SkillCategory } from "@/lib/portfolio-data";
import { springs, scaleIn, staggerContainer, fadeUp } from "@/lib/motion";

// ── Constants ─────────────────────────────────────────────────────────────────

const NODE_R       = 48;
const REPULSION    = 4800;
const SPRING_K     = 0.016;
const DAMPING      = 0.80;
const REST_LEN     = 155;
const SETTLE_AFTER = 200;

const CATEGORIES: SkillCategory[] = [
  "ML & AI", "Backend", "Frontend", "DevOps", "Blockchain",
];

const CAT_COLOR: Record<SkillCategory, string> = {
  "ML & AI":   "#00d9ff",
  "Backend":   "#00c896",
  "Frontend":  "#7c3aed",
  "DevOps":    "#f59e0b",
  "Blockchain":"#7b61ff",
};

// ── Types ─────────────────────────────────────────────────────────────────────

interface NodeState {
  id:    string;
  skill: Skill;
  x:     number;
  y:     number;
  vx:    number;
  vy:    number;
}

// ── Physics tick ─────────────────────────────────────────────────────────────

function tickPhysics(
  nodes:  NodeState[],
  w:      number,
  h:      number,
  pinned: string | null
): NodeState[] {
  const next = nodes.map((n) => ({ ...n }));

  for (let i = 0; i < next.length; i++) {
    for (let j = i + 1; j < next.length; j++) {
      const dx    = (next[j]!.x - next[i]!.x) || 0.01;
      const dy    = (next[j]!.y - next[i]!.y) || 0.01;
      const dist2 = dx * dx + dy * dy + 1;
      const dist  = Math.sqrt(dist2);
      const force = REPULSION / dist2;
      const fx    = (dx / dist) * force;
      const fy    = (dy / dist) * force;
      next[i]!.vx -= fx;
      next[i]!.vy -= fy;
      next[j]!.vx += fx;
      next[j]!.vy += fy;
    }
  }

  // Same-category spring
  for (let i = 0; i < next.length; i++) {
    for (let j = i + 1; j < next.length; j++) {
      if (next[i]!.skill.category !== next[j]!.skill.category) continue;
      const dx   = next[j]!.x - next[i]!.x;
      const dy   = next[j]!.y - next[i]!.y;
      const dist = Math.sqrt(dx * dx + dy * dy) + 0.01;
      const diff = (dist - REST_LEN) * SPRING_K;
      next[i]!.vx += (dx / dist) * diff;
      next[i]!.vy += (dy / dist) * diff;
      next[j]!.vx -= (dx / dist) * diff;
      next[j]!.vy -= (dy / dist) * diff;
    }
  }

  // Center gravity
  for (const n of next) {
    n.vx += (w / 2 - n.x) * 0.003;
    n.vy += (h / 2 - n.y) * 0.003;
  }

  for (const n of next) {
    if (n.id === pinned) continue;
    n.vx *= DAMPING;
    n.vy *= DAMPING;
    n.x = Math.max(NODE_R, Math.min(w - NODE_R, n.x + n.vx));
    n.y = Math.max(NODE_R, Math.min(h - NODE_R, n.y + n.vy));
  }

  return next;
}

function initNodes(skills: Skill[], w: number, h: number): NodeState[] {
  return skills.map((skill, i) => {
    const angle  = (i / skills.length) * Math.PI * 2;
    const radius = Math.min(w, h) * 0.3;
    return {
      id:    skill.name,
      skill,
      x:     w / 2 + radius * Math.cos(angle),
      y:     h / 2 + radius * Math.sin(angle),
      vx:    0,
      vy:    0,
    };
  });
}

// ── Connections SVG ───────────────────────────────────────────────────────────

function Connections({
  nodes,
  activeCategory,
}: {
  nodes:          NodeState[];
  activeCategory: SkillCategory | "All Skills";
}) {
  const lines = useMemo(() => {
    const result: {
      key:    string;
      x1:     number;
      y1:     number;
      x2:     number;
      y2:     number;
      color:  string;
      dist:   number;
    }[] = [];

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const ni = nodes[i]!;
        const nj = nodes[j]!;
        if (ni.skill.category !== nj.skill.category) continue;
        if (
          activeCategory !== "All Skills" &&
          ni.skill.category !== activeCategory
        )
          continue;

        const dx   = nj.x - ni.x;
        const dy   = nj.y - ni.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > REST_LEN * 2.4) continue;

        result.push({
          key:   `${ni.id}-${nj.id}`,
          x1:    ni.x,
          y1:    ni.y,
          x2:    nj.x,
          y2:    nj.y,
          color: CAT_COLOR[ni.skill.category]!,
          dist,
        });
      }
    }
    return result;
  }, [nodes, activeCategory]);

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width="100%"
      height="100%"
      aria-hidden="true"
    >
      {lines.map((l) => (
        <line
          key={l.key}
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          stroke={l.color}
          strokeOpacity={0.16}
          strokeWidth={1.5}
          strokeDasharray="3 5"
        />
      ))}
    </svg>
  );
}

// ── Skill node — Framer Motion drag with spring release ───────────────────────

function SkillNode({
  node,
  dimmed,
  selected,
  onDragStart,
  onDragUpdate,
  onDragEnd,
  onClick,
}: {
  node:          NodeState;
  dimmed:        boolean;
  selected:      boolean;
  onDragStart:   (id: string) => void;
  onDragUpdate:  (id: string, x: number, y: number) => void;
  onDragEnd:     (id: string, vx: number, vy: number) => void;
  onClick:       (id: string) => void;
}) {
  const prefersReduced = useReducedMotion();
  const color  = CAT_COLOR[node.skill.category]!;
  const radius = NODE_R + (node.skill.level / 100) * 14;

  // Track drag velocity for spring release
  const lastPos = useRef<{ x: number; y: number; t: number } | null>(null);

  return (
    <motion.div
      className="absolute flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
      style={{
        left:        node.x - radius,
        top:         node.y - radius,
        width:       radius * 2,
        height:      radius * 2,
        touchAction: "none",
      }}
      drag
      dragMomentum={false}
      dragElastic={0}
        onDragStart={() => {
          onDragStart(node.id);
          lastPos.current = { x: node.x, y: node.y, t: Date.now() };
      }}
      onDrag={(_, info) => {
        const now = Date.now();
        lastPos.current = { x: info.point.x, y: info.point.y, t: now };
        onDragUpdate(node.id, info.point.x, info.point.y);
      }}
      onDragEnd={(_, info) => {
        onDragEnd(node.id, info.velocity.x * 0.1, info.velocity.y * 0.1);
      }}
      onClick={() => onClick(node.id)}
      whileHover={
        prefersReduced
          ? {}
          : { scale: 1.12, zIndex: 10 }
      }
      whileTap={prefersReduced ? {} : { scale: 0.95 }}
      animate={
        dimmed
          ? { opacity: 0.25 }
          : selected
          ? { opacity: 1, scale: 1.08 }
          : { opacity: 1, scale: 1 }
      }
      transition={springs.snappy}
      role="button"
      aria-label={`${node.skill.name} — ${node.skill.category}, ${node.skill.level}% proficiency`}
      aria-pressed={selected}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(node.id);
        }
      }}
    >
      <div
        className="w-full h-full rounded-full flex items-center justify-center"
        style={{
          background:  `rgba(5,5,7,0.65)`,
          backdropFilter: "blur(20px) saturate(1.8)",
          border:      `1.5px solid ${color}${selected ? "99" : "44"}`,
          boxShadow:   selected
            ? `0 0 0 2px ${color}66, 0 0 28px ${color}33, inset 0 1px 0 rgba(255,255,255,0.08)`
            : `0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)`,
        }}
      >
        <div className="flex flex-col items-center gap-0.5 px-2 text-center">
          <span
            className="font-bold uppercase tracking-wider leading-tight"
            style={{ fontSize: "0.58rem", color }}
          >
            {node.skill.name}
          </span>
          {/* Proficiency bar */}
          <div className="w-7 h-0.5 rounded-full bg-white/10 mt-0.5 overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width:      `${node.skill.level}%`,
                background: color,
                opacity:    0.65,
              }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Detail panel ──────────────────────────────────────────────────────────────

function SkillDetailPanel({ skill }: { skill: Skill | null }) {
  const prefersReduced = useReducedMotion();
  const color = skill ? CAT_COLOR[skill.category]! : "#00d9ff";

  return (
    <AnimatePresence mode="wait">
      {skill && (
        <motion.div
          key={skill.name}
          className="liquid-glass rounded-2xl p-4 flex flex-col gap-3"
          style={{ borderColor: color + "44" }}
          initial={{ opacity: 0, y: 10, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.96 }}
          transition={springs.default}
        >
          <div>
            <p className="text-caption text-muted uppercase tracking-widest mb-0.5">
              {skill.category}
            </p>
            <p className="text-headline text-primary">{skill.name}</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-caption text-muted">
              <span>Proficiency</span>
              <span style={{ color }}>{skill.level}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${skill.level}%` }}
                transition={{ ...springs.liquid, delay: 0.1 }}
                style={{ background: color }}
              />
            </div>
          </div>

          <div className="flex gap-4 text-caption text-muted">
            <div>
              <span className="block font-bold text-primary">
                {skill.yearsUsed}+
              </span>
              years used
            </div>
            <div>
              <span className="block font-bold text-primary">
                {skill.level >= 90
                  ? "Expert"
                  : skill.level >= 75
                  ? "Advanced"
                  : "Proficient"}
              </span>
              level
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Reduced motion: static grid fallback ──────────────────────────────────────

function StaticSkillGrid({
  skills,
  activeCategory,
}: {
  skills:          Skill[];
  activeCategory:  SkillCategory | "All Skills";
}) {
  const filtered =
    activeCategory === "All Skills"
      ? skills
      : skills.filter((s) => s.category === activeCategory);

  return (
    <div className="flex flex-wrap gap-2 p-6">
      {filtered.map((skill) => {
        const color = CAT_COLOR[skill.category]!;
        return (
          <span
            key={skill.name}
            className="badge font-mono text-xs"
            style={{
              background:  color + "18",
              color,
              borderColor: color + "44",
            }}
          >
            {skill.name}
          </span>
        );
      })}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function LiquidGlassSkillsMap() {
  const prefersReduced     = useReducedMotion();
  const containerRef        = useRef<HTMLDivElement>(null);
  const [size, setSize]     = useState({ w: 800, h: 500 });
  const [nodes, setNodes]   = useState<NodeState[]>([]);
  const [activeCategory, setActiveCategory] = useState<SkillCategory | "All Skills">("All Skills");
  const [selectedSkill, setSelectedSkill]   = useState<string | null>(null);
  const [pinnedId, setPinnedId]             = useState<string | null>(null);
  const tickRef    = useRef(0);
  const simActive  = useRef(true);
  const rafRef     = useRef<number | null>(null);

  // Measure container
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const { width, height } = entry.contentRect;
      setSize({ w: width, h: Math.max(height, 440) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Re-init nodes on category or size change
  useEffect(() => {
    if (size.w < 100) return;
    const filtered =
      activeCategory === "All Skills"
        ? SKILLS
        : SKILLS.filter((s) => s.category === activeCategory);
    setNodes(initNodes(filtered, size.w, size.h));
    tickRef.current  = 0;
    simActive.current = true;
  }, [activeCategory, size.w, size.h]);

  // Physics loop
  useEffect(() => {
    if (prefersReduced) {
      simActive.current = false;
      return;
    }

    const run = () => {
      if (!simActive.current) return;
      tickRef.current++;
      // Reduce tick rate after settling
      if (tickRef.current > SETTLE_AFTER && tickRef.current % 3 !== 0) {
        rafRef.current = requestAnimationFrame(run);
        return;
      }
      setNodes((prev) => tickPhysics(prev, size.w, size.h, pinnedId));
      rafRef.current = requestAnimationFrame(run);
    };

    rafRef.current = requestAnimationFrame(run);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [size.w, size.h, pinnedId, prefersReduced]);

  const handleDragStart = useCallback((id: string) => {
    setPinnedId(id);
    simActive.current = true;
    tickRef.current   = 0;
  }, []);

  const handleDragUpdate = useCallback(
    (id: string, clientX: number, clientY: number) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      setNodes((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, x, y, vx: 0, vy: 0 } : n
        )
      );
    },
    []
  );

  const handleDragEnd = useCallback(
    (id: string, vx: number, vy: number) => {
      setPinnedId(null);
      setNodes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, vx, vy } : n))
      );
      tickRef.current   = 0;
      simActive.current = true;
    },
    []
  );

  const handleNodeClick = useCallback((id: string) => {
    setSelectedSkill((prev) => (prev === id ? null : id));
  }, []);

  const visibleSkill = selectedSkill
    ? SKILLS.find((s) => s.name === selectedSkill) ?? null
    : null;

  return (
    <section
      id="skills"
      className="section-gap max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
      aria-labelledby="skills-heading"
    >
      {/* Header */}
      <motion.div
        className="mb-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
      >
        <motion.p className="text-caption text-muted mb-2" variants={fadeUp}>
          Signature
        </motion.p>
        <motion.h2
          id="skills-heading"
          className="text-headline text-gradient-kinetic"
          variants={fadeUp}
        >
          Technical Stack
        </motion.h2>
        <motion.p
          className="text-subhead text-secondary mt-3 max-w-xl"
          variants={fadeUp}
        >
          {prefersReduced
            ? "The tools I use to ship ML products — from model training to production APIs."
            : "Drag any node to explore. Click for proficiency details. Node size reflects production depth."}
        </motion.p>
      </motion.div>

      {/* Category filters */}
      <motion.div
        className="flex flex-wrap gap-2 mb-6"
        role="group"
        aria-label="Filter skills by category"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={springs.default}
      >
        {(["All Skills", ...CATEGORIES] as const).map((cat) => (
          <motion.button
            key={cat}
            onClick={() => setActiveCategory(cat as SkillCategory | "All Skills")}
            className={cn(
              "btn text-sm",
              activeCategory === cat ? "btn-primary" : "btn-ghost"
            )}
            aria-pressed={activeCategory === cat}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            transition={springs.snappy}
            layout
          >
            {cat}
          </motion.button>
        ))}
      </motion.div>

      {/* Map + detail */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Canvas */}
        <motion.div
          className="liquid-glass rounded-[var(--radius-3xl)] overflow-hidden noise-overlay flex-1 relative"
          style={{ minHeight: 440 }}
          ref={containerRef}
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={springs.liquid}
        >
          {prefersReduced ? (
            <StaticSkillGrid
              skills={SKILLS}
              activeCategory={activeCategory}
            />
          ) : (
            <>
              <Connections
                nodes={nodes}
                activeCategory={activeCategory}
              />
              {nodes.map((node) => (
                <SkillNode
                  key={node.id}
                  node={node}
                  dimmed={
                    activeCategory !== "All Skills" &&
                    node.skill.category !== activeCategory
                  }
                  selected={selectedSkill === node.id}
                  onDragStart={handleDragStart}
                  onDragUpdate={handleDragUpdate}
                  onDragEnd={handleDragEnd}
                  onClick={handleNodeClick}
                />
              ))}
              <div
                className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none"
                aria-hidden="true"
              >
                <span className="badge badge-primary opacity-50 text-[0.55rem]">
                  Drag nodes • Click for details
                </span>
              </div>
            </>
          )}
        </motion.div>

        {/* Detail panel + legend */}
        <div className="lg:w-56 flex flex-col gap-4">
          <SkillDetailPanel skill={visibleSkill} />

          <motion.div
            className="liquid-glass rounded-2xl p-4 flex flex-col gap-3"
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={springs.default}
          >
            <p className="text-caption text-muted mb-1">Categories</p>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className="flex items-center gap-2 w-full text-left group"
                onClick={() =>
                  setActiveCategory((prev) =>
                    prev === cat ? "All Skills" : cat
                  )
                }
              >
                <motion.div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: CAT_COLOR[cat] }}
                  whileHover={{ scale: 1.4 }}
                  transition={springs.bouncy}
                />
                <span className="text-caption text-secondary group-hover:text-primary transition-colors">
                  {cat}
                </span>
              </button>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
