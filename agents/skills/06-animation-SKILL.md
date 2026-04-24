---
name: animation
version: 3.1.0
description: >
  Design and implement production-grade animations for scardubu.dev using Framer
  Motion 11+, CSS transitions, and the View Transitions API. Use when: creating
  scroll-linked parallax effects, spring physics interactions, page transitions,
  staggered reveals, cursor followers, hover magnetic effects, ML pipeline
  visualizations, BullMQ queue animations, or any motion design work.
  Portfolio context: CONVICTION ENGINE — Lagos-velocity spring feel, neural pulse
  glows, cryptographic particle flows (Hashablanca), ML model pipeline animations
  (SabiScore), BullMQ job queue visualization (TaxBridge).
  Triggers: "animate", "add motion", "scroll effect", "parallax", "page transition",
  "hover effect", "cursor follower", "spring animation", "stagger", "Framer Motion".
  Do NOT use for: static CSS layout (use 03-frontend-design-SKILL.md), SEO,
  database work, or API design.
stack: Framer Motion 11+ · CSS custom properties · View Transitions API · Tailwind CSS 4
portfolio: scardubu.dev
---

Animation in a portfolio is not decoration. It is signal. A spring-physics cursor
follower says "I understand browser performance." A scroll-linked parallax without
layout shift says "I know how Composite layer promotion works." An animation that
ignores prefers-reduced-motion says "I shipped without thinking about the user."
Every animation in scardubu.dev must earn its bundle cost and pass the a11y bar.

---

## PHASE 1 — ANIMATION STRATEGY

### 1.1 Animation Budget (Every Animation Justifies Its Cost)

Before implementing, answer:

- **What does this animation communicate?** (conviction, precision, depth, velocity)
- **What is the bundle cost?** (Framer Motion chunk? GSAP? CSS only?)
- **What is the runtime cost?** (will this force Layout? Paint? Composite only?)
- **What is the a11y cost?** (prefers-reduced-motion fallback designed?)
- **What is the mobile cost?** (does this degrade at 320px and on touch?)

**Decision tree for animation approach:**

```
Can this be achieved with CSS transitions/animations alone?
  YES → Use CSS. No JS cost.
  NO  → Does it need scroll-linked behavior or spring physics?
    SPRING/SCROLL → Framer Motion (LazyMotion subset)
    COMPLEX PATH  → Consider GSAP (with bundle justification)
    3D/WebGL      → @react-three/fiber (dynamic import, lazy, ssr: false)
```

### 1.2 Performance Rules (Non-Negotiable)

```
SAFE to animate (Compositor layer — no layout, no paint):
  transform: translateX/Y/Z, scale, rotate, scaleX/Y
  opacity
  filter (with GPU hint: will-change: filter)

UNSAFE — causes Layout (reflow — never animate):
  width, height, top, left, right, bottom
  margin, padding
  border-width
  font-size

UNSAFE — causes Paint (expensive):
  background-color (prefer opacity on overlay instead)
  box-shadow (prefer filter: drop-shadow for moving elements)
  border-radius (on animated elements — prefer clip-path)

CLS PREVENTION:
  Always set explicit dimensions on animated containers
  Never animate height from 0 to auto — use scaleY(0 → 1) + transformOrigin: top
  Always use will-change: transform sparingly (creates stacking context)
```

### 1.3 Framer Motion Architecture

```typescript
// ALWAYS: LazyMotion wraps app layout — NOT individual components
// src/app/layout.tsx
import { LazyMotion, domAnimation } from 'framer-motion';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LazyMotion features={domAnimation} strict>
          {children}
        </LazyMotion>
      </body>
    </html>
  );
}

// Then in components: import { m } from 'framer-motion' (not motion)
// m.div instead of motion.div — same API, uses the lazy-loaded feature set
import { m } from 'framer-motion';
<m.div animate={{ opacity: 1 }} />
```

---

## PHASE 2 — ANIMATION PATTERNS (VALIDATED SKILL LIBRARY)

### 2.1 Spring Physics Cursor Follower

```typescript
// src/components/animation/CursorFollower.tsx
// Validated: v15.0 | Bundle cost: ~0kB extra (uses LazyMotion subset)
'use client';

import { m, useMotionValue, useSpring } from 'framer-motion';
import { useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';

// Spring config: "snappy Lagos precision"
const SPRING = { stiffness: 300, damping: 28, mass: 0.5 };

export function CursorFollower() {
  const shouldReduce = useReducedMotion();
  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);
  const sx = useSpring(mx, SPRING);
  const sy = useSpring(my, SPRING);

  useEffect(() => {
    if (shouldReduce) return;
    const move = (e: MouseEvent) => { mx.set(e.clientX); my.set(e.clientY); };
    window.addEventListener('pointermove', move);
    return () => window.removeEventListener('pointermove', move);
  }, [mx, my, shouldReduce]);

  if (shouldReduce) return null;

  return (
    <m.div
      aria-hidden="true"   // Decorative — hidden from screen readers
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed left-0 top-0 z-50 h-8 w-8
                 -translate-x-1/2 -translate-y-1/2 rounded-full
                 bg-[--color-accent]/20 mix-blend-screen backdrop-blur-sm
                 ring-1 ring-[--color-accent]/40"
    />
  );
}
```

### 2.2 Scroll-Linked Parallax Hero

```typescript
// src/components/hero/ParallaxHero.tsx
// Validated: v15.0 | Uses Compositor-only transforms — no Layout triggers
'use client';

import { m, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

export function ParallaxHero({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Spring smoothing — prevents jitter
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // Transform ranges — translateY only (Compositor-safe)
  const y = useTransform(smoothProgress, [0, 1], ['0%', '40%']);
  const opacity = useTransform(smoothProgress, [0, 0.6], [1, 0]);

  if (shouldReduce) {
    return <section ref={ref}>{children}</section>;
  }

  return (
    <section ref={ref} className="relative overflow-hidden">
      <m.div style={{ y, opacity }} className="will-change-transform">
        {children}
      </m.div>
    </section>
  );
}
```

### 2.3 Staggered Reveal on Scroll

```typescript
// src/components/animation/StaggerReveal.tsx
'use client';

import { m, useReducedMotion } from 'framer-motion';

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: [0.0, 0.0, 0.2, 1] },
  },
};

const reducedVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
};

export function StaggerReveal({ children }: { children: React.ReactNode }) {
  const shouldReduce = useReducedMotion();
  return (
    <m.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-10%' }}
    >
      {children}
    </m.div>
  );
}

export function StaggerItem({ children, className }: {
  children: React.ReactNode;
  className?: string;
}) {
  const shouldReduce = useReducedMotion();
  return (
    <m.div
      variants={shouldReduce ? reducedVariants : itemVariants}
      className={className}
    >
      {children}
    </m.div>
  );
}
```

### 2.4 Magnetic Hover Effect (Project Cards)

```typescript
// Validated: v15.0 | Pure transform — Compositor only
'use client';

import { m, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';

const SPRING_CFG = { stiffness: 300, damping: 30 };

export function MagneticCard({ children, className }: {
  children: React.ReactNode;
  className?: string;
}) {
  const shouldReduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], ['7deg', '-7deg']), SPRING_CFG);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], ['-7deg', '7deg']), SPRING_CFG);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <m.div
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
      style={shouldReduce ? {} : {
        rotateX,
        rotateY,
        transformPerspective: 1000,
        transformStyle: 'preserve-3d',
      }}
      className={className}
    >
      {children}
    </m.div>
  );
}
```

### 2.5 ML Pipeline Visualization (SabiScore)

```typescript
// src/components/projects/MLPipelineViz.tsx
// Animated data flow: Feature Input → XGBoost → LightGBM → CatBoost → Ensemble → Score
'use client';

import { m, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useState, useEffect } from 'react';

const stages = [
  { id: 'input',    label: 'Feature Input',    sub: '47 credit signals' },
  { id: 'xgb',     label: 'XGBoost',          sub: 'Tree ensemble' },
  { id: 'lgbm',    label: 'LightGBM',         sub: 'Gradient boost' },
  { id: 'catboost', label: 'CatBoost',         sub: 'Categorical' },
  { id: 'ensemble', label: 'Ensemble',          sub: 'Weighted avg' },
  { id: 'score',   label: 'SabiScore',         sub: '742 / 850' },
] as const;

export function MLPipelineViz() {
  const shouldReduce = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (shouldReduce) { setActive(stages.length - 1); return; }
    const id = setInterval(() => setActive(i => (i + 1) % stages.length), 1400);
    return () => clearInterval(id);
  }, [shouldReduce]);

  return (
    <div
      role="img"
      aria-label="ML pipeline visualization: feature input through ensemble to SabiScore"
      className="flex flex-wrap items-center justify-center gap-2"
    >
      {stages.map((stage, i) => (
        <div key={stage.id} className="flex items-center gap-2">
          <m.div
            animate={{
              scale: i === active ? 1.08 : 1,
              borderColor: i <= active
                ? 'var(--color-accent)'
                : 'var(--color-border)',
              backgroundColor: i === active
                ? 'rgba(249, 115, 22, 0.1)'
                : 'var(--color-surface)',
            }}
            transition={shouldReduce
              ? { duration: 0 }
              : { duration: 0.3, ease: [0.0, 0.0, 0.2, 1] }
            }
            className="rounded-lg border px-3 py-2 text-center"
          >
            <p className="font-mono text-xs font-semibold text-[--color-text]">
              {stage.label}
            </p>
            <p className="font-mono text-[10px] text-[--color-muted]">{stage.sub}</p>
          </m.div>
          {i < stages.length - 1 && (
            <m.span
              aria-hidden="true"
              animate={{ opacity: i < active ? 1 : 0.2 }}
              transition={{ duration: 0.3 }}
              className="font-mono text-[--color-accent]"
            >
              →
            </m.span>
          )}
        </div>
      ))}
    </div>
  );
}
```

### 2.6 Neural Pulse Glow (Hero Background)

```css
/* Pure CSS — zero JS cost — Compositor-only (opacity + transform) */
/* src/app/globals.css */

@keyframes neural-pulse {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50%       { opacity: 0.7; transform: scale(1.15); }
}

@keyframes orbit {
  from { transform: rotate(0deg) translateX(120px) rotate(0deg); }
  to   { transform: rotate(360deg) translateX(120px) rotate(-360deg); }
}

.neural-node {
  animation: neural-pulse 3s ease-in-out infinite;
}

.neural-node:nth-child(2) { animation-delay: -1s; }
.neural-node:nth-child(3) { animation-delay: -2s; }

.orbital-dot {
  animation: orbit 8s linear infinite;
}

/* Always respect prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  .neural-node,
  .orbital-dot {
    animation: none;
    opacity: 0.4;
  }
}
```

### 2.7 Page Transitions (View Transitions API + Framer Motion)

```typescript
// src/components/animation/PageTransition.tsx
'use client';

import { m, AnimatePresence, useReducedMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';

const variants = {
  initial: { opacity: 0, y: 12, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0,  filter: 'blur(0px)' },
  exit:    { opacity: 0, y: -8, filter: 'blur(2px)' },
};

const reducedVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit:    { opacity: 0 },
};

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const shouldReduce = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      <m.div
        key={pathname}
        variants={shouldReduce ? reducedVariants : variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: shouldReduce ? 0.15 : 0.4, ease: [0.0, 0.0, 0.2, 1] }}
      >
        {children}
      </m.div>
    </AnimatePresence>
  );
}
```

### 2.8 BullMQ Queue Visualization (TaxBridge)

```typescript
// src/components/projects/QueueViz.tsx
'use client';

import { m, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useState, useEffect } from 'react';

type Job = { id: string; type: 'VAT' | 'CIT' | 'PIT'; status: 'waiting' | 'active' | 'completed' };

const DEMO_JOBS: Job[] = [
  { id: 'job_a1b2', type: 'VAT', status: 'waiting' },
  { id: 'job_c3d4', type: 'CIT', status: 'active' },
  { id: 'job_e5f6', type: 'PIT', status: 'completed' },
];

const STATUS_COLOR = {
  waiting:   '--color-muted',
  active:    '--color-accent',
  completed: '--color-accent-2',
} as const;

export function QueueViz() {
  const shouldReduce = useReducedMotion();
  const [jobs, setJobs] = useState<Job[]>(DEMO_JOBS);

  useEffect(() => {
    if (shouldReduce) return;
    const id = setInterval(() => {
      setJobs(prev => prev.map(j =>
        j.status === 'waiting' && Math.random() > 0.6
          ? { ...j, status: 'active' }
          : j.status === 'active' && Math.random() > 0.5
          ? { ...j, status: 'completed' }
          : j
      ));
    }, 1200);
    return () => clearInterval(id);
  }, [shouldReduce]);

  return (
    <div
      role="img"
      aria-label="TaxBridge BullMQ job queue — real-time filing processing"
      className="space-y-2"
    >
      <p className="font-mono text-xs text-[--color-muted] uppercase tracking-widest mb-3">
        Filing Queue
      </p>
      <AnimatePresence>
        {jobs.map(job => (
          <m.div
            key={job.id}
            layout
            initial={shouldReduce ? { opacity: 0 } : { opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={shouldReduce ? { opacity: 0 } : { opacity: 0, x: 16 }}
            transition={{ duration: 0.3, ease: [0.0, 0.0, 0.2, 1] }}
            className="flex items-center justify-between rounded-lg
                       border border-[--color-border] bg-[--color-surface]
                       px-4 py-2"
          >
            <span className="font-mono text-xs text-[--color-text]">{job.id}</span>
            <span className="font-mono text-xs text-[--color-muted]">{job.type}</span>
            <span
              className="font-mono text-xs font-semibold"
              style={{ color: `var(${STATUS_COLOR[job.status]})` }}
            >
              {job.status}
            </span>
          </m.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
```

---

## PHASE 3 — QUALITY GATE

```
Bundle:
□ LazyMotion wraps layout, not individual components (m.div not motion.div)
□ Bundle delta calculated: new dep? justify cost
□ 3D components: dynamic import with { ssr: false } — never in RSC

Performance:
□ Only transform/opacity/filter animated — no width/height/margin
□ will-change: transform used sparingly (only on continuously animating elements)
□ useScroll/useTransform: no layout-recalculating properties in chain
□ Spring config documented with stiffness/damping/mass values and rationale
□ Animation does not cause measurable CLS (test with Lighthouse)

Accessibility:
□ Every animation has a prefers-reduced-motion fallback
□ Fallback is tested (DevTools → Rendering → Emulate CSS prefers-reduced-motion)
□ Decorative animations: aria-hidden="true"
□ Dynamic content: aria-live region if animation conveys information
□ No autoplaying motion > 5s without pause control
□ Cursor animations fall back gracefully on touch devices (pointer: coarse)

Responsive:
□ Animation degrades correctly at 320px
□ Touch: no hover-only interactions without touch alternative
□ Cursor follower: hidden on touch (pointer-events: none + coarse check)

Code Quality:
□ Spring configurations named and documented (not magic numbers)
□ useReducedMotion() checked in every animated client component
□ No animation logic in Server Components
□ AnimatePresence present for mount/unmount animations
□ layout prop used for list reordering (not manual position transitions)
```

---

*Every animation is a performance commitment and an accessibility contract.*
*If a recruiter at Cloudflare sees jank, they notice. If a user with vestibular*
*disorder gets motion sickness, you failed them. Make it earn the budget.*
*Make it pass the bar. Then make it beautiful.*
