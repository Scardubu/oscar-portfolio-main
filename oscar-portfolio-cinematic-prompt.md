# Oscar Ndugbu Portfolio — Cinematic Scroll: Precision Completion Prompt

## Codebase State Audit (Read Before Touching Anything)

The cinematic scroll architecture is **85% complete**. Do not re-implement what already exists. Audit these files first, then apply only the targeted fixes and enhancements below.

### Already implemented and working — do not rewrite:
- `lib/cinematic/chapters.ts` — 8-chapter registry with full palette, motion, and transition config
- `components/cinematic/ScrollCinemaProvider.tsx` — Lenis + GSAP ticker sync, `activeChapter` state, `scrollToSection`, reduced-motion detection, dataset writes
- `hooks/useChapterTimeline.ts` — GSAP ScrollTrigger per-section with staged reveals from `data-cinematic` targets
- `components/cinematic/ChapterFrame.tsx` — semantic `<section>` wrapper with chapter CSS custom properties and transition language
- `components/cinematic/ThreeBrushField.tsx` — Three.js WebGL atmospheric shader with cursor + scroll + palette uniforms
- `components/ScrollProgress.tsx` — chapter-aware vertical rail using `useScrollCinema` context
- `components/Navbar.tsx` — fully refactored to `useScrollCinema`, zero manual scroll listeners
- `app/providers.tsx` — `ThemeProvider → MotionProvider → ScrollCinemaProvider` stack
- `app/layout.tsx` — mounts `ThreeBrushField`, chapter-aware `ScrollProgress`, `CursorGlow`, `GrainOverlay`; `GradientMesh` is NOT mounted
- All section components (`ProjectsSection`, `TestimonialsSection`, `OpenSourceSection`, `SkillsSection`, `AboutSection`, `WritingSection`, `ContactSection`) — each uses `ChapterFrame` and `data-cinematic` attributes

### Animation system architecture (understand before editing):
- **GSAP / ScrollTrigger** is the reveal engine for all sections wrapped in `ChapterFrame`. It sets `autoAlpha: 0` on `data-cinematic` targets in `useLayoutEffect` (before paint), then reveals them on scroll via timeline.
- **Framer-motion** handles the hero section, micro-interactions (hover, accordion, mobile menu), and carousels. It is NOT used for cross-section scroll-reveal inside `ChapterFrame` wrappers.
- `m.div variants={child}` elements inside `ChapterFrame` sections have no parent `initial` / `animate` → framer-motion variants are dormant there. GSAP owns their opacity lifecycle.
- Do not add `whileInView`, `initial="hidden"`, or `animate="visible"` to any element inside `ChapterFrame`. It will create competing animation ownership.

---

## Critical Bug Fixes (apply exactly as specified)

### BUG 1 — `scrollToSection` uses `immediate: true`, killing smooth scroll
**File:** `components/cinematic/ScrollCinemaProvider.tsx`, line 75

**Current:**
```ts
lenisRef.current.scrollTo(el, { offset: -88, immediate: true });
```

**Fix:**
```ts
lenisRef.current.scrollTo(el, { offset: -88 });
```

`immediate: true` in Lenis means instant jump, bypassing the smooth scroll interpolation entirely. Remove it. The default (`false`) gives the cinematic glide the design requires.

---

### BUG 2 — `ThreeBrushField` recreates the entire WebGL context on every chapter change
**File:** `components/cinematic/ThreeBrushField.tsx`

The main `useEffect` that creates the renderer, scene, camera, geometry, and RAF loop has `activeChapter` in its dependency array (line ~244). Every chapter transition destroys and rebuilds the WebGL context, causing a canvas black-flash between sections.

**Fix:** The main renderer-creation effect must depend only on `[reducedMotion]`. A second effect (already present) handles the palette update imperatively. Ensure the dependency arrays are:

```ts
// Renderer + RAF loop — only recreate when motion preference changes
useEffect(() => {
  // ... all renderer setup, geometry, material, RAF, event listeners ...
}, [reducedMotion]); // ← only reducedMotion; NOT activeChapter, NOT scrollProgressRef

// Palette update — fire on chapter change without rebuilding WebGL
useEffect(() => {
  const uniforms = uniformsRef.current;
  if (!uniforms) return;
  const chapter = CHAPTERS.find((c) => c.id === activeChapter) ?? CHAPTERS[0];
  uniforms.uAccent.value.set(chapter.colors.accent);
  uniforms.uWash.value.set(chapter.colors.wash);
  uniforms.uIntensity.value = chapter.motion.drift;
}, [activeChapter]); // ← only activeChapter
```

Also: `scrollProgressRef` is a React ref (`MutableRefObject`). Its `.current` is read inside the RAF callback — the ref itself never changes identity and must NOT be in any effect's dependency array.

---

### BUG 3 — Hero section never re-triggers the `prologue` chapter on scroll-back
**File:** `components/HeroSection.tsx`

The hero renders as a bare `<m.section id="hero">`, not wrapped in `ChapterFrame`. This means `useChapterTimeline` is never called for it. `activeChapter` is initialised to `'prologue'` by `useState`, so the initial page load is correct. But once the user scrolls into `proof` and scrolls back up to the hero, the chapter stays `proof` — the navbar active state, brush field palette, and scroll-progress dot are all wrong.

**Fix:** Add a minimal GSAP ScrollTrigger inside `HeroSection` that calls `setActiveChapter` on enter and enterBack. Import only what is needed — do not pull GSAP globally into HeroSection.

```ts
// In HeroSection — add to existing useEffect block (or a new dedicated one)
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useRef, useEffect } from 'react';
import { useScrollCinema } from '@/components/cinematic/ScrollCinemaProvider';

// Inside HeroSection component:
const heroRef = useRef<HTMLElement>(null);
const { setActiveChapter } = useScrollCinema();

useEffect(() => {
  const el = heroRef.current;
  if (!el) return;

  const st = ScrollTrigger.create({
    trigger: el,
    start: 'top 60%',
    onEnter: () => setActiveChapter('prologue'),
    onEnterBack: () => setActiveChapter('prologue'),
  });

  return () => st.kill();
}, [setActiveChapter]);
```

Attach `ref={heroRef}` to the `<m.section id="hero" ...>` element. Do not alter any existing hero animation or framer-motion logic.

---

## Enhancement Instructions

### 4 — Add chapter-level CSS accent transitions to `globals.css`
When `data-active-chapter` changes on `documentElement`, the chapter accent color should cross-fade visibly in any CSS surface that consumes `--chapter-accent`. Add this block to `app/globals.css` (after the `:root` block):

```css
/* ── Chapter accent cross-fade ──────────────────────────────────────────── */
:root {
  --chapter-accent: #67e8f9;
  --chapter-wash: #0c1320;
  --chapter-ink: #06070a;
  transition:
    --chapter-accent 0.6s var(--ease-out-expo),
    --chapter-wash 0.6s var(--ease-out-expo),
    --chapter-ink 0.6s var(--ease-out-expo);
}

/* Chapter-specific overrides on the documentElement dataset */
html[data-active-chapter='prologue']   { --chapter-accent: #67e8f9; --chapter-wash: #0c1320; --chapter-ink: #06070a; }
html[data-active-chapter='proof']      { --chapter-accent: #5eead4; --chapter-wash: #101825; --chapter-ink: #07080b; }
html[data-active-chapter='credibility']{ --chapter-accent: #fbbf24; --chapter-wash: #161411; --chapter-ink: #090a0d; }
html[data-active-chapter='craft']      { --chapter-accent: #38bdf8; --chapter-wash: #11192a; --chapter-ink: #07090c; }
html[data-active-chapter='range']      { --chapter-accent: #c084fc; --chapter-wash: #171120; --chapter-ink: #07080b; }
html[data-active-chapter='human']      { --chapter-accent: #fde68a; --chapter-wash: #20170f; --chapter-ink: #0a0807; }
html[data-active-chapter='judgment']   { --chapter-accent: #93c5fd; --chapter-wash: #101624; --chapter-ink: #08090c; }
html[data-active-chapter='epilogue']   { --chapter-accent: #34d399; --chapter-wash: #07110e; --chapter-ink: #06070a; }
```

Note: CSS `transition` on custom properties requires `@property` registration or a browser that supports transitioning them directly. For maximum compatibility, also add a `@property` declaration for each:

```css
@property --chapter-accent {
  syntax: '<color>';
  inherits: true;
  initial-value: #67e8f9;
}
@property --chapter-wash {
  syntax: '<color>';
  inherits: true;
  initial-value: #0c1320;
}
@property --chapter-ink {
  syntax: '<color>';
  inherits: true;
  initial-value: #06070a;
}
```

---

### 5 — Remove `border-t` from `ChapterFrame` for the first section
**File:** `components/cinematic/ChapterFrame.tsx`, line 58

`ChapterFrame` unconditionally applies `border-t`. The Projects section (first section below the hero) renders a visible rule between the hero and the first chapter, which breaks the cinematic continuity. Fix by accepting an optional `noBorderTop` prop and forwarding it:

```tsx
type ChapterFrameProps = {
  chapter: ChapterConfig;
  children: ReactNode;
  ariaLabelledBy?: string;
  className?: string;
  contentClassName?: string;
  noBorderTop?: boolean; // add this
};

// In className:
className={clsx(
  'relative py-[var(--section-py)]',
  !noBorderTop && 'border-t',  // conditional
  className
)}
```

Then in `ProjectsSection.tsx`:
```tsx
<ChapterFrame chapter={chapter} ariaLabelledBy="projects-heading" noBorderTop className="...">
```

---

### 6 — Throttle `ScrollTrigger.update()` call inside Lenis scroll handler
**File:** `components/cinematic/ScrollCinemaProvider.tsx`

The current `onScroll` callback calls `ScrollTrigger.update()` on every Lenis tick, which is every RAF frame. GSAP already refreshes ScrollTrigger through the ticker. Replace the explicit `update()` call with GSAP's built-in sync:

```ts
// Remove:
const onScroll = ({ scroll, limit }: { scroll: number; limit: number }) => {
  scrollProgressRef.current = limit > 0 ? scroll / limit : 0;
  ScrollTrigger.update(); // ← remove this line
};

// Keep only:
const onScroll = ({ scroll, limit }: { scroll: number; limit: number }) => {
  scrollProgressRef.current = limit > 0 ? scroll / limit : 0;
};
```

GSAP's `ticker.add(raf)` call already drives ScrollTrigger. The duplicate `ScrollTrigger.update()` causes double-processing per frame and can cause subtle animation stutter.

---

### 7 — Guard `mix-blend-mode: screen` on `ThreeBrushField` for mobile
**File:** `components/cinematic/ThreeBrushField.tsx`

`mix-blend-mode: screen` on the canvas triggers GPU compositing on every frame and is expensive on low-power mobile devices. Apply it only on desktop:

```tsx
// Change the wrapper className from:
className="pointer-events-none fixed inset-0 -z-[1] overflow-hidden opacity-90 [mix-blend-mode:screen]"

// To:
className="pointer-events-none fixed inset-0 -z-[1] overflow-hidden opacity-90 sm:[mix-blend-mode:screen]"
```

On mobile (`< 640px`), the blend mode is disabled — the canvas renders with `mix-blend-mode: normal`, which is a compositor no-op and significantly cheaper.

---

### 8 — Pin chapter scrollbar glow to `--chapter-accent` in `globals.css`
The scrollbar currently uses a hardcoded teal (`rgba(0, 200, 232, 0.3)`). Connect it to the active chapter accent so it evolves with each section:

```css
/* In globals.css scrollbar block — replace hardcoded value: */
* {
  scrollbar-color: color-mix(in oklch, var(--chapter-accent) 30%, transparent) var(--color-space-black);
}
```

---

### 9 — Add `aria-live` region for chapter changes (accessibility)
**File:** `components/cinematic/ScrollCinemaProvider.tsx`

Screen-reader users benefit from knowing which chapter is active as they scroll. Add a visually hidden `aria-live` announcement that fires when `activeChapter` changes. This must be rendered inside `ScrollCinemaProvider`'s returned JSX:

```tsx
return (
  <ScrollCinemaContext.Provider value={value}>
    {children}
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {`Now viewing: ${CHAPTERS.find((c) => c.id === activeChapter)?.label ?? ''}`}
    </div>
  </ScrollCinemaContext.Provider>
);
```

Import `CHAPTERS` from `@/lib/cinematic/chapters`.

---

### 10 — Ensure `useChapterTimeline` does not pin on initial SSR markup
**File:** `hooks/useChapterTimeline.ts`

Add a guard at the top of `useLayoutEffect` to ensure pinning logic only fires after the Lenis instance is ready (i.e., after hydration and first scroll setup). `useLayoutEffect` already runs client-side only, but the `canPin` check references `mm.matches`. Ensure the media query object is safely created:

```ts
// Existing code is correct but add safety check:
if (typeof window === 'undefined') return;
const mm = window.matchMedia('(min-width: 1024px)');
```

This is already implicitly safe since `useLayoutEffect` doesn't run on the server, but being explicit prevents React Server Component linting errors when the hook file is analysed statically.

---

## Files to Touch — Summary

| File | Change type | Scope |
|---|---|---|
| `components/cinematic/ScrollCinemaProvider.tsx` | Bug fix + Enhancement | Remove `immediate: true`; remove `ScrollTrigger.update()`; add `aria-live` region |
| `components/cinematic/ThreeBrushField.tsx` | Bug fix + Enhancement | Fix dep array (remove `activeChapter` from main effect); add `sm:` prefix to blend mode |
| `components/HeroSection.tsx` | Bug fix | Add `heroRef` + minimal GSAP ScrollTrigger for prologue chapter re-entry |
| `components/cinematic/ChapterFrame.tsx` | Enhancement | Add `noBorderTop` prop |
| `components/ProjectsSection.tsx` | Enhancement | Pass `noBorderTop` to ChapterFrame |
| `app/globals.css` | Enhancement | Add `@property` declarations + `html[data-active-chapter]` CSS transitions + scrollbar chapter accent |
| `hooks/useChapterTimeline.ts` | Enhancement | Add `typeof window === 'undefined'` guard (defensive only) |

---

## Files to Not Touch

- `lib/cinematic/chapters.ts` — chapter registry is canonical and correct
- `app/providers.tsx` — provider stack is correct
- `app/layout.tsx` — layer ordering is correct; `GradientMesh` is correctly absent
- `components/Navbar.tsx` — scroll integration is correct
- `components/ScrollProgress.tsx` — chapter-aware rail is correct
- All section components except `ProjectsSection.tsx` — ChapterFrame and data-cinematic attributes are complete
- All metadata, JSON-LD, route files, data sources, build scripts
- `components/GradientMesh.tsx` — leave in repo, correctly not mounted on homepage

---

## Implementation Constraints

- TypeScript strict mode. No `any`. No type assertions on DOM queries unless explicitly null-checked.
- Do not install new dependencies. All required packages (`gsap`, `lenis`, `three`, `framer-motion`) are already in `package.json`.
- Do not add `useScroll` or `useTransform` from framer-motion to any component that is mounted on the homepage. These create page-level scroll subscribers that compete with Lenis.
- Respect `reducedMotion` in every new code path. When `reducedMotion` is true: no pinning, no GSAP transitions (use duration: 0 or skip), no Lenis, no RAF-driven canvas updates.
- Keep desktop smooth at 60fps. Profile the three RAF loops (Lenis → GSAP ticker → ThreeBrushField RAF) — they must share a single frame budget, not stack independently.
- Do not create hydration mismatches. Any DOM reads or writes (`document`, `window`, `matchMedia`) must be inside `useEffect` / `useLayoutEffect` or guarded with `typeof window !== 'undefined'`.
- CSS custom property transitions require `@property` registration for browser-interpolated transitions. Always pair `@property` with the `html[data-active-chapter]` overrides.

---

## Acceptance Criteria

**Scroll behaviour:**
- [ ] Lenis smooth scroll operates correctly on navbar clicks and hash navigation (no instant jumps)
- [ ] One Lenis instance. One GSAP ticker. One Three.js RAF. Zero duplicate scroll listeners.
- [ ] `ScrollTrigger.update()` is NOT called manually inside the Lenis scroll callback

**Chapter system:**
- [ ] `activeChapter` changes to `'prologue'` when user scrolls back up to the hero section
- [ ] Navbar active dot matches the visible section at all scroll positions including scroll-back
- [ ] Scroll-progress rail dot moves correctly through all 8 chapters bidirectionally
- [ ] `data-active-chapter` on `documentElement` updates correctly throughout the scroll journey

**Visual quality:**
- [ ] ThreeBrushField canvas does NOT flicker or black-flash during chapter transitions
- [ ] Chapter accent color transitions smoothly (CSS cross-fade) as sections enter
- [ ] `mix-blend-mode: screen` is absent on mobile (< 640px) for performance
- [ ] No visible top border between the hero section and the Projects section

**Accessibility:**
- [ ] `aria-live` region announces chapter label changes to screen readers
- [ ] All existing ARIA labels, `aria-labelledby`, keyboard navigation, and skip-nav links are intact
- [ ] `prefers-reduced-motion` users receive: no pinning, no canvas animation, no Lenis, static fallback field

**Build:**
- [ ] `pnpm type-check` passes with zero errors
- [ ] `pnpm lint` passes with zero errors
- [ ] `pnpm build` completes without warnings on dynamic imports
- [ ] No hydration mismatch warnings in browser console on initial load

**Content integrity:**
- [ ] Zero changes to verified copy, metrics, case study content, structured data, or metadata
- [ ] Section render order is unchanged: hero → projects → testimonials → open-source → skills → about → writing → contact
