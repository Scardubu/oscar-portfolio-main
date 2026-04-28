// CONVICTION ENGINE v10.0 — FULL REPLACEMENT

type RevealVariant = 'fade-up' | 'fade-in' | 'slide-right' | 'char-split';

export const SPRING_FAST = { type: 'spring', stiffness: 400, damping: 30 } as const;
export const SPRING_MEDIUM = { type: 'spring', stiffness: 280, damping: 24 } as const;
export const SPRING_SLOW = { type: 'spring', stiffness: 160, damping: 20 } as const;

export const REVEAL_VARIANTS: Record<RevealVariant, { hidden: object; visible: object }> = {
  'fade-up': { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } },
  'fade-in': { hidden: { opacity: 0 }, visible: { opacity: 1 } },
  'slide-right': { hidden: { opacity: 0, x: -32 }, visible: { opacity: 1, x: 0 } },
  'char-split': { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } },
};

export const STAGGER_PROOF_GRID = 0.08;
export const STAGGER_OPEN_SOURCE = 0.1;
export const STAGGER_CONTACT_CARDS = 0.1;
export const STAGGER_HERO_CHAR = 0.025;
export const STAGGER_SKILLS = 0.04;
