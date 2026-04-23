// CONVICTION ENGINE v7.0 — FULL REPLACEMENT
// constants/z-index.ts
// Single source of truth for all z-index values.
// Every layer comment maps to a real element in the codebase.
// NEVER use raw z-index numbers in TSX or CSS — import from here.

export const Z = {
  /** Ambient background orbs (GradientMesh) */
  AMBIENT: 0,
  /** Grain texture overlay (GrainOverlay) */
  GRAIN: 1,
  /** Cursor glow following pointer */
  CURSOR: 1,
  /** Main page content */
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
