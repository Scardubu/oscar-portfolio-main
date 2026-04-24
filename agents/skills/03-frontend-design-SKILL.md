---
name: frontend-design
version: 3.1.0
description: >
  Design and build production-grade, visually distinctive React/Next.js components,
  pages, and design systems. Use when: building UI components, redesigning sections,
  creating landing pages, implementing animations, designing dashboards, building
  forms, or reviewing visual quality and accessibility.
  Portfolio context: scardubu.dev CONVICTION ENGINE — bento grids, parallax hero,
  project showcases for TaxBridge/SabiScore/Hashablanca, WAT timezone widgets.
  Triggers: "build a component", "design this page", "create a hero section",
  "redesign", "make this look", "dashboard UI", "animate", "responsive".
  Do NOT use for: pure animation logic (use 06-animation-SKILL.md), SEO metadata
  only (use 07-seo-structured-data-SKILL.md), or backend API design.
stack: Next.js 15 App Router · React 19 · TypeScript strict · Tailwind CSS 4
       Framer Motion 11+ · Geist Sans/Mono · Radix UI primitives
portfolio: scardubu.dev
---

Every pixel of scardubu.dev is a portfolio artifact. Recruiters at Stripe, Cloudflare,
and Vercel have seen thousands of developer portfolios. Most look identical:
Inter font, purple gradient on white, three feature cards, a GitHub icon row.
OscarForge's mandate is to stop the scroll. One differentiation hook per section.
No defaults. No safe choices. No AI-slop aesthetics.

---

## PHASE 1 — CONTEXT DECODING (Resolve Before Writing Any Code)

### 1.1 Audience × Emotional Register → Design Instinct

| Audience                     | Register             | Design Direction                                    |
| ---------------------------- | -------------------- | --------------------------------------------------- |
| Stripe/Cloudflare tech lead  | Precision + trust    | Editorial mono, tight grid, data-forward            |
| Non-technical decision maker | Narrative + impact   | Story-first, metric callouts, human photography     |
| Open source community        | Craft + authenticity | Dense information, code aesthetics, terminal motifs |
| Portfolio (all three)        | Conviction           | ALL of the above — layered, not averaged            |

### 1.2 Aesthetic Commitment (Choose ONE Before Writing Code)

Each section of scardubu.dev has an assigned aesthetic. Never blend tones within a section.

| Tone                    | Application         | Typography                             | Motion Feel          |
| ----------------------- | ------------------- | -------------------------------------- | -------------------- |
| **Editorial Precision** | Hero, About         | Display serif or editorial sans + mono | Measured, deliberate |
| **Technical Depth**     | TaxBridge project   | Mono-heavy, data tables, terminal      | Precise snap         |
| **Cryptographic**       | Hashablanca         | Tight monochrome, mathematical spacing | Particle, entropy    |
| **ML Pipeline**         | SabiScore           | Structured grid, model flow, data viz  | Staggered reveal     |
| **Lagos Velocity**      | USSD / mobile story | Warm neutral, constraint-driven        | Fast snap, no frills |

### 1.3 Differentiation Hook (State Before Coding — Always)

Before writing a single component, complete this sentence:
> "This section is unmistakably different from every other developer portfolio because ___"

Examples:
- "Because the hero uses a live WAT timezone clock as the anchor identity signal"
- "Because TaxBridge card shows a real BullMQ queue animation, not a screenshot"
- "Because the skill section renders as a terminal session, not a tag cloud"

If you cannot complete the sentence, the design needs more specificity.

### 1.4 Constraint Inventory

```
Framework:   Next.js 15 App Router — distinguish RSC vs client components
Bundle:      ≤ 80kB gzipped initial JS (Framer Motion via LazyMotion only)
A11y:        WCAG 2.2 AA — always, not optional
Responsive:  320px → 1440px (no horizontal scroll at any breakpoint)
Motion:      prefers-reduced-motion alternative for every animated element
3D:          Optional, dynamic import with ssr: false, lazy-loaded
Dark mode:   Tailwind dark: class — tokens for both modes in @theme
Fonts:       Geist Sans (body) + Geist Mono (code/data) via next/font/local
```

---

## PHASE 2 — AESTHETIC SYSTEM (Resolve Fully Before Coding)

### 2.1 Tailwind CSS 4 Token Architecture

```css
/* src/app/globals.css — Single source of truth for ALL visual decisions */
@import "tailwindcss";

@theme {
  /* Typography — Geist via next/font exposed as CSS vars */
  --font-sans:   var(--font-geist-sans), system-ui, sans-serif;
  --font-mono:   var(--font-geist-mono), ui-monospace, monospace;
  --font-display: "Fragment Mono", var(--font-geist-mono), monospace; /* or chosen display */

  /* Type scale — Perfect Fourth (1.333) */
  --text-xs:   0.75rem;    /* 12px */
  --text-sm:   0.875rem;   /* 14px */
  --text-base: 1rem;       /* 16px */
  --text-lg:   1.333rem;   /* 21px */
  --text-xl:   1.777rem;   /* 28px */
  --text-2xl:  2.369rem;   /* 38px */
  --text-3xl:  3.157rem;   /* 51px */
  --text-4xl:  4.209rem;   /* 67px */

  /* Spacing — 8pt grid */
  --spacing-1:  0.25rem;   /* 4px */
  --spacing-2:  0.5rem;    /* 8px */
  --spacing-3:  0.75rem;   /* 12px */
  --spacing-4:  1rem;      /* 16px */
  --spacing-6:  1.5rem;    /* 24px */
  --spacing-8:  2rem;      /* 32px */
  --spacing-12: 3rem;      /* 48px */
  --spacing-16: 4rem;      /* 64px */
  --spacing-24: 6rem;      /* 96px */
  --spacing-32: 8rem;      /* 128px */

  /* Color system — 4 semantic roles */
  --color-bg:       #0a0a0a;      /* deep neutral — not pure black */
  --color-surface:  #141414;      /* cards, panels */
  --color-border:   #262626;      /* subtle separators */
  --color-text:     #f5f5f5;      /* primary text */
  --color-muted:    #737373;      /* secondary text */
  --color-accent:   #f97316;      /* Lagos orange — conviction signal */
  --color-accent-2: #22c55e;      /* data green — ML/fintech success */
  --color-code-bg:  #111111;      /* terminal/code blocks */

  /* Motion — "snappy Lagos precision" spring feel */
  --duration-fast:  150ms;
  --duration-base:  300ms;
  --duration-slow:  600ms;
  --ease-spring:    cubic-bezier(0.175, 0.885, 0.32, 1.275);
  --ease-out:       cubic-bezier(0.0, 0.0, 0.2, 1);
  --ease-in-out:    cubic-bezier(0.4, 0.0, 0.2, 1);

  /* Border radius */
  --radius-sm:  4px;
  --radius-md:  8px;
  --radius-lg:  12px;
  --radius-xl:  20px;
  --radius-2xl: 32px;
}
```

### 2.2 Typography Rules

```
Display / Hero headings:
  - Use a DISTINCTIVE font — not Inter, Roboto, Arial, or system-ui
  - Options: Fragment Mono, Playfair Display, Space Grotesk, Cabinet Grotesk
  - Tracked: -0.02em to -0.04em (tight, intentional)
  - Weight: 700–900 (heavy creates authority)

Body text:
  - Geist Sans, 16px base, line-height 1.6
  - Max line-width: 72ch (readability)
  - Muted (#737373) for supporting text, not gray-500 guessing

Code / Data:
  - Geist Mono ALWAYS for any code, data, metric, or technical value
  - Tabular numbers: font-variant-numeric: tabular-nums
  - Never display a number in a sans-serif face when it's being compared

Anti-patterns (flag and reject):
  ❌ Inter as hero display font (AI-slop default #1)
  ❌ Purple gradient on white background (AI-slop default #2)
  ❌ Three equal-weight feature cards without hierarchy
  ❌ Gradient text on gradient background (unreadable)
  ❌ All-caps for body text (accessibility and readability)
```

### 2.3 Layout Archetypes

| Archetype        | Best for                          | Grid                                         |
| ---------------- | --------------------------------- | -------------------------------------------- |
| **Bento Grid**   | Portfolio overview, skills, stats | CSS grid with named areas, spanning cells    |
| **Editorial**    | Blog, about, case studies         | Center-justified, generous whitespace        |
| **Split**        | Project showcases                 | 50/50 or 60/40 with sticky panel             |
| **Asymmetric**   | Hero, statements                  | Off-center composition, deliberate imbalance |
| **Terminal**     | Code demos, USSD flows            | Full-bleed dark, mono font, cursor blink     |
| **Data-Forward** | SabiScore ML metrics              | Tight tables, small type, data density       |

---

## PHASE 3 — COMPONENT PRODUCTION CODE

### 3.1 React Server Component vs Client Component Decision

```typescript
// DEFAULT: Server Component (no 'use client')
// Use when: fetching data, rendering static content, SEO-critical content

// Add 'use client' ONLY when:
// - useState, useReducer, useEffect, useRef
// - Event handlers (onClick, onChange, onSubmit)
// - Browser APIs (window, document, IntersectionObserver)
// - Framer Motion animated components
// - Third-party client-only libraries

// Pattern: Push 'use client' DOWN the tree as far as possible
// ❌ Making an entire page client-only for one animated element
// ✅ Extracting the animated element into a client component
```

### 3.2 Bento Grid Implementation Pattern

```tsx
// src/components/grid/BentoGrid.tsx
'use client';

import { motion, LazyMotion, domAnimation } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';

interface BentoCell {
  id: string;
  colSpan?: 1 | 2 | 3;
  rowSpan?: 1 | 2;
  children: React.ReactNode;
  className?: string;
}

const cellVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.0, 0.0, 0.2, 1] },
  }),
};

const reducedVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
};

export function BentoGrid({ cells }: { cells: BentoCell[] }) {
  const shouldReduceMotion = useReducedMotion();
  const variants = shouldReduceMotion ? reducedVariants : cellVariants;

  return (
    <LazyMotion features={domAnimation}>
      <div
        role="list"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[200px]"
      >
        {cells.map((cell, i) => (
          <motion.div
            key={cell.id}
            role="listitem"
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-10%' }}
            variants={variants}
            className={[
              'rounded-xl border border-[--color-border] bg-[--color-surface]',
              'overflow-hidden p-6',
              cell.colSpan === 2 && 'sm:col-span-2',
              cell.colSpan === 3 && 'lg:col-span-3',
              cell.rowSpan === 2 && 'row-span-2',
              cell.className,
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {cell.children}
          </motion.div>
        ))}
      </div>
    </LazyMotion>
  );
}
```

### 3.3 Semantic HTML Checklist

```tsx
// Document structure
<header>           // site header — ONCE per page
<nav>              // navigation — aria-label="Main navigation"
<main>             // primary content — ONCE per page
<article>          // self-contained: blog post, project card
<section>          // themed group — requires heading
<aside>            // supplementary content
<footer>           // page footer

// Interactive elements
<button>           // actions (submit, toggle, open modal)
<a href="...">     // navigation to URLs
<input>            // form fields — always with associated <label>
<select>           // dropdowns with options
<textarea>         // multi-line input

// Heading hierarchy (NEVER skip levels)
<h1>               // page title — once per page (or once per landmark)
<h2>               // major sections
<h3>               // sub-sections within h2
<h4>               // rarely needed; question the structure if you reach h4

// Anti-patterns:
// ❌ <div onClick={...}>    → use <button>
// ❌ <span onClick={...}>  → use <button> or <a>
// ❌ <h3> after <h1>       → heading hierarchy skip
// ❌ <img> without alt     → use alt="" for decorative, descriptive for informative
```

### 3.4 Accessibility Implementation

```tsx
// Focus ring — always :focus-visible (not :focus which fires on click)
// In globals.css:
// *:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 3px; }

// ARIA for custom interactive components
<button
  aria-expanded={isOpen}
  aria-controls="menu-content"
  aria-label="Toggle project details"
>
  <ChevronIcon aria-hidden="true" />
</button>

<div id="menu-content" role="region" aria-live="polite">
  {/* Dynamic content that screen readers should announce */}
</div>

// Skip navigation link (always first element in body)
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50
             focus:px-4 focus:py-2 focus:bg-[--color-accent] focus:text-white focus:rounded-md"
>
  Skip to main content
</a>

// Color contrast helper — always check before shipping:
// Normal text (< 18px bold, < 24px): 4.5:1 minimum
// Large text (≥ 18px bold, ≥ 24px): 3:1 minimum
// UI components / focus rings: 3:1 minimum
// Decorative elements: exempt
```

### 3.5 Image Optimization Pattern

```tsx
import Image from 'next/image';

// ✅ Hero image (above fold — priority + explicit dimensions)
<Image
  src="/images/oscar-portrait.webp"
  alt="Oscar Ndugbu, Staff Full-Stack ML Engineer based in Lagos"
  width={640}
  height={800}
  priority    // LCP element — preloads
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ..."
  className="object-cover object-top"
  sizes="(max-width: 768px) 100vw, 50vw"
/>

// ✅ Below-fold images (lazy load by default)
<Image
  src="/images/taxbridge-dashboard.webp"
  alt="TaxBridge dashboard showing real-time VAT filing queue for Lagos SMEs"
  width={1200}
  height={800}
  placeholder="blur"
  blurDataURL="..."
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
/>

// Rules:
// - always set width + height (prevents CLS)
// - always set sizes (correct srcset generation)
// - alt text: descriptive for informative, "" for decorative
// - priority: ONLY for above-the-fold images (max 1–2 per page)
// - placeholder="blur" always set (prevents layout shift)
```

### 3.6 Loading States & Error Boundaries (Always Required)

```tsx
// Loading skeleton (always implement before data component)
export function FilingSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading tax filings"
      className="space-y-4"
    >
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="h-20 rounded-xl bg-[--color-surface] animate-pulse"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  );
}

// Error boundary (wrap every data-fetching component)
'use client';
import { Component, type ReactNode } from 'react';

interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { hasError: boolean; error?: Error; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div role="alert" className="rounded-xl border border-red-900/30 bg-red-950/20 p-6">
          <p className="text-sm text-red-400">
            Something went wrong. Please refresh the page.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
```

---

## PHASE 4 — PORTFOLIO-SPECIFIC COMPONENTS

### 4.1 WAT Timezone Widget (Lagos Identity — Load-Bearing)

```tsx
// src/components/identity/WATClock.tsx
'use client';
import { useEffect, useState } from 'react';

export function WATClock() {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString('en-NG', {
        timeZone: 'Africa/Lagos',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
    setTime(fmt());
    const id = setInterval(() => setTime(fmt()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span
      aria-label="Current time in Lagos, Nigeria (WAT)"
      className="font-mono text-[--color-muted] tabular-nums"
    >
      WAT {time}
    </span>
  );
}
```

### 4.2 Terminal Typewriter (Differentiation Hook for Hero)

```tsx
// src/components/hero/TerminalTypewriter.tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

const lines = [
  'Staff Full-Stack ML Engineer',
  'TaxBridge — Lagos SMEs in 15 min',
  'SabiScore — Credit without history',
  'Hashablanca — Privacy as primitive',
];

export function TerminalTypewriter() {
  const [display, setDisplay] = useState('');
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    if (shouldReduce) { setDisplay(lines[0]); return; }

    const current = lines[lineIdx];
    if (charIdx < current.length) {
      const t = setTimeout(() => {
        setDisplay(current.slice(0, charIdx + 1));
        setCharIdx(c => c + 1);
      }, 55);
      return () => clearTimeout(t);
    }
    const pause = setTimeout(() => {
      setLineIdx(i => (i + 1) % lines.length);
      setCharIdx(0);
    }, 2200);
    return () => clearTimeout(pause);
  }, [charIdx, lineIdx, shouldReduce]);

  return (
    <p
      aria-label="Rotating description"
      aria-live="polite"
      className="font-mono text-lg text-[--color-accent] min-h-[1.5em]"
    >
      {display}
      <span aria-hidden="true" className="animate-pulse">▋</span>
    </p>
  );
}
```

### 4.3 Project Card — Magnetic Hover + Metric Callout

```tsx
// src/components/projects/ProjectCard.tsx
'use client';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';
import Link from 'next/link';

interface ProjectCardProps {
  title: string;
  slug: string;
  description: string;
  metric: { value: string; label: string };
  tags: string[];
}

export function ProjectCard({ title, slug, description, metric, tags }: ProjectCardProps) {
  const shouldReduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], ['7deg', '-7deg']), { stiffness: 300, damping: 30 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], ['-7deg', '7deg']), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const reset = () => { mx.set(0); my.set(0); };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      style={shouldReduce ? {} : { rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      className="group relative rounded-2xl border border-[--color-border]
                 bg-[--color-surface] p-6 transition-colors
                 hover:border-[--color-accent]/40"
    >
      {/* Metric callout — Evidence-First Positioning */}
      <div className="mb-4 inline-flex items-baseline gap-1">
        <span className="font-mono text-3xl font-bold text-[--color-accent]">
          {metric.value}
        </span>
        <span className="text-sm text-[--color-muted]">{metric.label}</span>
      </div>

      <h3 className="mb-2 text-xl font-semibold text-[--color-text]">{title}</h3>
      <p className="mb-4 text-sm leading-relaxed text-[--color-muted]">{description}</p>

      <div className="mb-6 flex flex-wrap gap-2">
        {tags.map(tag => (
          <span key={tag} className="rounded-md bg-[--color-bg] px-2 py-1 font-mono text-xs text-[--color-muted]">
            {tag}
          </span>
        ))}
      </div>

      <Link
        href={`/projects/${slug}`}
        className="inline-flex items-center gap-2 text-sm font-medium
                   text-[--color-accent] underline-offset-4
                   hover:underline focus-visible:underline"
        aria-label={`View ${title} project details`}
      >
        View case study →
      </Link>
    </motion.div>
  );
}
```

---

## PHASE 5 — SELF-CRITIQUE BEFORE DELIVERY

Run this checklist on every component before surfacing:

```
DIFFERENTIATION:
□ The one-sentence hook is stated and visible
□ No default AI-generated aesthetics (Inter display, purple-on-white, 3 equal cards)

TOKENS:
□ All CSS values use @theme tokens — zero magic hex values or px literals
□ No Tailwind classes that override tokens with hardcoded values

ACCESSIBILITY:
□ Semantic HTML elements used (button, nav, main, article, section)
□ Heading hierarchy is correct and unbroken
□ All images have alt text (descriptive or "" for decorative)
□ All interactive elements have accessible names
□ Focus ring visible and high-contrast (:focus-visible)
□ Color contrast verified (4.5:1 text, 3:1 UI)
□ prefers-reduced-motion respected

RESPONSIVE:
□ Renders correctly at 320px (no horizontal overflow)
□ Renders correctly at 768px (tablet reflow correct)
□ Renders correctly at 1440px (full visual impact)
□ Touch targets ≥ 24px minimum (44px for primary actions)

PERFORMANCE:
□ All images use next/image with width, height, sizes, placeholder
□ Framer Motion via LazyMotion (not full bundle import)
□ No console.log or debugging artifacts
□ Loading skeleton present for async data
□ Error boundary present for data-dependent render

NEXT.JS PATTERNS:
□ RSC vs client boundary is correct (push 'use client' down the tree)
□ No window/document access without useEffect guard
□ Dynamic imports with ssr: false for 3D components
```

---

*The portfolio is the proof. Every component is a signal.*
*Oscar's code runs in Lagos on a 4G connection AND on a Stripe engineer's MacBook.*
*Build for both. Sacrifice neither. Let the constraints make it interesting.*
