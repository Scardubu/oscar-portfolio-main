'use client';
// components/CommandPalette.tsx — CONVICTION ENGINE v19.0
// ─────────────────────────────────────────────────────────────────────────────
// Mobile: bottom-sheet pattern (slides up from bottom 0) — CTA-zone reachable.
// Desktop: top-center panel (legacy position preserved).
// Touch targets: min-h-[48px] per item — WCAG 2.2 §2.5.8.
// ─────────────────────────────────────────────────────────────────────────────

import { AnimatePresence, m, useReducedMotion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { CV_ASSET_PATH } from '@/lib/config';
import { springs } from '@/lib/motionVariants';

interface CommandItem {
  id:       string;
  label:    string;
  shortcut?: string;
  group:    string;
  action:   () => void;
}

type CommandPaletteWindow = Window & { __commandPaletteRequested?: boolean };

// ── Panel motion variants — desktop: top-center, mobile: bottom-sheet ─────────
const PANEL_VARIANTS_DESKTOP = {
  hidden:  { opacity: 0, y: -12, scale: 0.98 },
  visible: { opacity: 1, y: 0,   scale: 1 },
  exit:    { opacity: 0, y: -8,  scale: 0.98 },
};

const PANEL_VARIANTS_MOBILE = {
  hidden:  { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0  },
  exit:    { opacity: 0, y: 60 },
};

export function CommandPalette() {
  const [open,        setOpen]        = useState(false);
  const [query,       setQuery]       = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile,    setIsMobile]    = useState(false);

  const inputRef           = useRef<HTMLInputElement>(null);
  const openRef            = useRef(open);
  const activeIndexRef     = useRef(activeIndex);
  const filteredRef        = useRef<CommandItem[]>([]);

  const router       = useRouter();
  const pathname     = usePathname();
  const reducedMotion = useReducedMotion();

  // Detect mobile once on mount
  useEffect(() => {
    setIsMobile(!window.matchMedia('(pointer: fine)').matches);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setActiveIndex(0);
  }, []);

  const scrollTo = useCallback(
    (id: string) => {
      if (pathname !== '/') {
        router.push(`/#${id}`);
        close();
        return;
      }
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      close();
    },
    [close, pathname, router]
  );

  const commands = useMemo<CommandItem[]>(
    () => [
      // ── Navigate ──────────────────────────────────────────────────────
      { id: 'nav-projects',    group: 'Navigate', label: 'Projects',      action: () => scrollTo('section-projects') },
      { id: 'nav-open-source', group: 'Navigate', label: 'Open Source',   action: () => scrollTo('open-source')     },
      { id: 'nav-skills',      group: 'Navigate', label: 'Skills',        action: () => scrollTo('skills')          },
      { id: 'nav-about',       group: 'Navigate', label: 'About',         action: () => scrollTo('about')           },
      { id: 'nav-writing',     group: 'Navigate', label: 'Writing',       action: () => scrollTo('section-writing') },
      { id: 'nav-contact',     group: 'Navigate', label: 'Contact',       action: () => scrollTo('contact')         },
      // ── Case studies ──────────────────────────────────────────────────
      { id: 'cs-taxbridge',    group: 'Case Studies', label: 'TaxBridge case study',   action: () => { router.push('/work/taxbridge');   close(); } },
      { id: 'cs-sabiscore',    group: 'Case Studies', label: 'SabiScore case study',   action: () => { router.push('/work/sabiscore');   close(); } },
      { id: 'cs-hashablanca',  group: 'Case Studies', label: 'Hashablanca case study', action: () => { router.push('/work/hashablanca'); close(); } },
      // ── Actions ───────────────────────────────────────────────────────
      {
        id: 'action-writing', group: 'Actions', label: 'All writing',
        action: () => { router.push('/writing'); close(); },
      },
      {
        id: 'action-resume', group: 'Actions', label: 'Open résumé', shortcut: 'R',
        action: () => { window.open(CV_ASSET_PATH, '_blank', 'noopener,noreferrer'); close(); },
      },
      {
        id: 'action-email', group: 'Actions', label: 'Send email', shortcut: 'E',
        action: () => { globalThis.location.href = 'mailto:oscar@scardubu.dev'; close(); },
      },
    ],
    [router, scrollTo, close]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => c.label.toLowerCase().includes(q) || c.group.toLowerCase().includes(q));
  }, [commands, query]);

  openRef.current      = open;
  activeIndexRef.current = activeIndex;
  filteredRef.current  = filtered;

  const execute = useCallback((cmd: CommandItem) => { cmd.action(); }, []);

  // Keyboard handler
  useEffect(() => {
    const toggle    = () => setOpen((v) => !v);
    const openFn    = () => setOpen(true);

    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggle();
        return;
      }
      if (!openRef.current) return;

      if (e.key === 'Escape')     { e.preventDefault(); close(); return; }
      if (e.key === 'ArrowDown')  { e.preventDefault(); setActiveIndex((i) => Math.min(i + 1, Math.max(filteredRef.current.length - 1, 0))); }
      if (e.key === 'ArrowUp')    { e.preventDefault(); setActiveIndex((i) => Math.max(i - 1, 0)); }
      if (e.key === 'Enter') {
        e.preventDefault();
        const cmd = filteredRef.current[activeIndexRef.current];
        if (cmd) execute(cmd);
      }
    };

    document.addEventListener('keydown', onKey, { capture: true });
    globalThis.addEventListener('command-palette:open', openFn);
    return () => {
      document.removeEventListener('keydown', onKey, { capture: true });
      globalThis.removeEventListener('command-palette:open', openFn);
    };
  }, [close, execute]);

  // Pick up early-intercept flag set before hydration
  useEffect(() => {
    const w = globalThis as unknown as CommandPaletteWindow;
    if (w.__commandPaletteRequested) {
      setOpen(true);
      w.__commandPaletteRequested = false;
    }
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 40);
  }, [open]);

  useEffect(() => { setActiveIndex(0); }, [query]);

  // Group filtered commands for display
  const groups = useMemo(() => {
    const map = new Map<string, CommandItem[]>();
    filtered.forEach((c) => {
      const arr = map.get(c.group) ?? [];
      arr.push(c);
      map.set(c.group, arr);
    });
    return map;
  }, [filtered]);

  const panelVariants = isMobile ? PANEL_VARIANTS_MOBILE : PANEL_VARIANTS_DESKTOP;
  const panelTransition = reducedMotion ? { duration: 0 } : springs.smooth;

  return (
    <AnimatePresence>
      {open && (
        // Overlay
        <m.div
          className="fixed inset-0 z-[500]"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          initial={reducedMotion ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reducedMotion ? {} : { opacity: 0 }}
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
        >
          {/* Panel — bottom-sheet on mobile, top-center on desktop */}
          <m.div
            className={`
              absolute glass-full overflow-hidden
              ${isMobile
                ? 'bottom-0 left-0 right-0 rounded-t-[var(--radius-xl)] max-h-[75vh]'
                : 'top-[15vh] left-1/2 -translate-x-1/2 w-full max-w-[540px] rounded-[var(--radius-xl)]'
              }
            `}
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={panelTransition}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag handle — mobile only */}
            {isMobile && (
              <div className="flex justify-center pt-3 pb-1" aria-hidden="true">
                <div
                  className="h-1 w-10 rounded-full"
                  style={{ background: 'var(--color-border)' }}
                />
              </div>
            )}

            {/* Search input */}
            <div
              className="border-b px-4 py-3 flex items-center gap-3"
              style={{ borderColor: 'var(--color-border)' }}
            >
              {/* Search icon */}
              <svg
                className="h-4 w-4 shrink-0"
                style={{ color: 'var(--color-text-muted)' }}
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="8.5" cy="8.5" r="5.75" stroke="currentColor" strokeWidth="1.5" />
                <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>

              <input
                ref={inputRef}
                className="flex-1 bg-transparent text-sm outline-none placeholder:font-mono placeholder:text-xs placeholder:tracking-wide"
                style={{ color: 'var(--color-text-primary)' }}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search or jump to…"
                aria-label="Command search"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
              />

              {/* Esc hint — desktop only */}
              {!isMobile && (
                <kbd
                  className="shrink-0 rounded border px-1.5 py-0.5 font-mono text-[10px]"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
                >
                  ESC
                </kbd>
              )}
            </div>

            {/* Results */}
            <div
              className="overflow-y-auto"
              style={{ maxHeight: isMobile ? 'calc(75vh - 80px)' : '360px' }}
            >
              {filtered.length === 0 ? (
                <p
                  className="px-4 py-6 text-center font-mono text-xs"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  No results for &ldquo;{query}&rdquo;
                </p>
              ) : (
                Array.from(groups.entries()).map(([groupName, items]) => {
                  let runningIndex = 0;
                  // Calculate offset for this group in the flat filtered list
                  filtered.forEach((c, i) => {
                    if (c.id === items[0]?.id) runningIndex = i;
                  });

                  return (
                    <div key={groupName}>
                      <p
                        className="px-4 pb-1 pt-3 font-mono text-[10px] tracking-widest uppercase"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        {groupName}
                      </p>
                      {items.map((cmd, localI) => {
                        const flatIndex = runningIndex + localI;
                        const isActive  = flatIndex === activeIndex;

                        return (
                          <button
                            key={cmd.id}
                            type="button"
                            className="w-full flex items-center gap-3 px-4 min-h-[48px] text-left transition-colors"
                            style={{
                              background: isActive ? 'var(--color-border-subtle)' : 'transparent',
                              color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                            }}
                            data-active={isActive}
                            onClick={() => execute(cmd)}
                            onMouseEnter={() => setActiveIndex(flatIndex)}
                          >
                            <span className="flex-1 text-sm">{cmd.label}</span>
                            {cmd.shortcut && (
                              <kbd
                                className="shrink-0 rounded border px-1.5 py-0.5 font-mono text-[10px]"
                                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
                              >
                                {cmd.shortcut}
                              </kbd>
                            )}
                            {isActive && (
                              <svg
                                className="h-3 w-3 shrink-0"
                                style={{ color: 'var(--color-film-teal)' }}
                                viewBox="0 0 12 12"
                                fill="none"
                                aria-hidden="true"
                              >
                                <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  );
                })
              )}

              {/* Safe zone for mobile home bar */}
              {isMobile && <div className="h-6" aria-hidden="true" />}
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}