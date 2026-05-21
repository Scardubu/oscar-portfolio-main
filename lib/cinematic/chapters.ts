export type ChapterId =
  | 'prologue'
  | 'proof'
  | 'credibility'
  | 'craft'
  | 'range'
  | 'human'
  | 'judgment'
  | 'epilogue';

export interface ChapterConfig {
  id: ChapterId;
  sectionId: string;
  index: number;
  label: string;
  mood: string;
  purpose: string;
  transition: string;
  pin?: boolean;
  motion: {
    scrub: number;
    parallax: number;
    drift: number;
  };
  colors: {
    ink: string;
    accent: string;
    wash: string;
    glow: string;
  };
}

export const CHAPTERS: readonly ChapterConfig[] = [
  {
    id: 'prologue',
    sectionId: 'hero',
    index: 0,
    label: 'Prologue',
    mood: 'authoritative, immediate, cinematic',
    purpose: 'Establish conviction and identity in the first glance.',
    transition: 'Fade from atmosphere into structured proof.',
    pin: false,
    motion: { scrub: 0.9, parallax: 10, drift: 0.18 },
    colors: {
      ink: '#06070a',
      accent: '#67e8f9',
      wash: '#0c1320',
      glow: '#7c3aed',
    },
  },
  {
    id: 'proof',
    sectionId: 'section-projects',
    index: 1,
    label: 'Proof',
    mood: 'dense, technical, high-conviction',
    purpose: 'Show real systems, metrics, and architecture decisions.',
    transition: 'Compress energy into a more structured evidence field.',
    pin: true,
    motion: { scrub: 1, parallax: 18, drift: 0.26 },
    colors: {
      ink: '#07080b',
      accent: '#5eead4',
      wash: '#101825',
      glow: '#22c55e',
    },
  },
  {
    id: 'credibility',
    sectionId: 'section-testimonials',
    index: 2,
    label: 'Credibility',
    mood: 'measured, calm, reliable',
    purpose: 'Convert proof into third-party validation.',
    transition: 'Ease off the density and let trust breathe.',
    pin: false,
    motion: { scrub: 0.75, parallax: 8, drift: 0.16 },
    colors: {
      ink: '#090a0d',
      accent: '#fbbf24',
      wash: '#161411',
      glow: '#f97316',
    },
  },
  {
    id: 'craft',
    sectionId: 'open-source',
    index: 3,
    label: 'Craft',
    mood: 'technical, transparent, public',
    purpose: 'Show inspectable engineering output.',
    transition: 'Shift from outcomes to observable habits.',
    pin: false,
    motion: { scrub: 0.8, parallax: 12, drift: 0.2 },
    colors: {
      ink: '#07090c',
      accent: '#38bdf8',
      wash: '#11192a',
      glow: '#0ea5e9',
    },
  },
  {
    id: 'range',
    sectionId: 'skills',
    index: 4,
    label: 'Range',
    mood: 'architectural, systematic, expansive',
    purpose: 'Reveal breadth after depth is established.',
    transition: 'Expand into a matrix-like systems view.',
    pin: true,
    motion: { scrub: 1, parallax: 16, drift: 0.24 },
    colors: {
      ink: '#07080b',
      accent: '#c084fc',
      wash: '#171120',
      glow: '#a855f7',
    },
  },
  {
    id: 'human',
    sectionId: 'section-about',
    index: 5,
    label: 'Human Context',
    mood: 'grounded, reflective, warm',
    purpose: 'Make the operator feel human and easy to trust.',
    transition: 'Slow the pace and widen the breathing room.',
    pin: false,
    motion: { scrub: 0.7, parallax: 7, drift: 0.14 },
    colors: {
      ink: '#0a0807',
      accent: '#fde68a',
      wash: '#20170f',
      glow: '#fb923c',
    },
  },
  {
    id: 'judgment',
    sectionId: 'section-writing',
    index: 6,
    label: 'Judgment',
    mood: 'editorial, precise, thoughtful',
    purpose: 'Show how decisions are made and defended.',
    transition: 'Use a chapter-turn feeling rather than a generic fade.',
    pin: false,
    motion: { scrub: 0.8, parallax: 10, drift: 0.18 },
    colors: {
      ink: '#08090c',
      accent: '#93c5fd',
      wash: '#101624',
      glow: '#60a5fa',
    },
  },
  {
    id: 'epilogue',
    sectionId: 'section-contact',
    index: 7,
    label: 'Epilogue',
    mood: 'direct, confident, minimal',
    purpose: 'Turn conviction into a clear next step.',
    transition: 'Strip away flourish and land on the CTA.',
    pin: false,
    motion: { scrub: 0.6, parallax: 5, drift: 0.1 },
    colors: {
      ink: '#06070a',
      accent: '#34d399',
      wash: '#07110e',
      glow: '#10b981',
    },
  },
] as const;

export const CHAPTER_BY_SECTION = Object.fromEntries(
  CHAPTERS.map((chapter) => [chapter.sectionId, chapter])
) as Record<string, ChapterConfig>;

export function getChapterBySectionId(sectionId: string) {
  return CHAPTER_BY_SECTION[sectionId] ?? CHAPTERS[0];
}
