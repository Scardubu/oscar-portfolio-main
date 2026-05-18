// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
// Major Reset • Lagos → Global • Production Conviction Architecture
// constants/z-index.ts
// Single source of truth for all z-index values.
// Every layer comment maps to a real element in the codebase.
// NEVER use raw z-index numbers in TSX or CSS — import from here.
//
// Stacking order (bottom → top):
//   AMBIENT (0) → GRAIN (1) → CONTENT (2) → SHARE_SIDEBAR (40)
//   → TOAST/PROGRESS_BAR (50) → SCROLL_PROGRESS (60) → SKIP_NAV (150)
//   → NAV (200) → COMMAND_PALETTE (500) → MODAL (9000)

export const Z = {
  /** Ambient background orbs (GradientMesh) */
  AMBIENT: 0,
  /** Grain texture overlay (GrainOverlay) */
  GRAIN: 1,
  /** Cursor glow following pointer */
  CURSOR: 1,
  /** Main page content (isolation: isolate applied — Safari bleed fix) */
  CONTENT: 2,
  /** Sticky footer */
  FOOTER: 2,
  /** Share button sidebar (blog) */
  SHARE_SIDEBAR: 40,
  /** BookmarkToast / BlogProgressWidget floating widget */
  TOAST: 50,
  /** Top-bar progress line (blog) */
  PROGRESS_BAR: 50,
  /** Navigation bar */
  NAV: 200,
  /** Skip-nav anchor */
  SKIP_NAV: 150,
  /** Scroll progress bar (global) */
  SCROLL_PROGRESS: 60,
  /** Command palette overlay */
  COMMAND_PALETTE: 500,
  /** Modal / dialog overlay */
  MODAL: 9000,
} as const;

export type ZLayer = (typeof Z)[keyof typeof Z];
