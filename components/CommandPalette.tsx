'use client';
// components/CommandPalette.tsx — CONVICTION ENGINE v22.0
//
// v22 vs v21:
//
//   [BUG FIX SCROLL-1]: `scrollTo('about')` → `scrollTo('section-about')`.
//     Root cause: The DOM element has `id="section-about"` (set in AboutSection.tsx).
//     `document.getElementById('about')` returned null — the command silently did
//     nothing. The nav anchor contract is: Projects=section-projects, OSS=open-source,
//     Skills=skills, About=section-about, Writing=section-writing, Contact=section-contact.
//
//   [BUG FIX SCROLL-2]: `scrollTo('contact')` → `scrollTo('section-contact')`.
//     Same root cause as SCROLL-1 — `id="section-contact"` in ContactSection.tsx.
//
//   [BUG FIX ARIA-1]: Moved `role="dialog" aria-modal="true" aria-label="Command palette"`
//     from the outer overlay div to the inner panel div.
//     Root cause: The outer div is the backdrop — its onClick closes the palette.
//     A clickable-to-dismiss element is not a dialog; the panel is. Screen readers
//     were announcing the dismissible overlay as the dialog and finding the panel
//     as an anonymous child. Also added aria-hidden="true" to the backdrop so AT
//     ignores it entirely. The panel now carries the correct dialog semantics.
//
//   [FIX COMPOSITOR-1]: Removed `backdropFilter: 'blur(4px)'` from the overlay div.
//     Root cause: Same GPU compositor flash as Navbar v22 SCROLL_FLICKER-3.
//     When AnimatePresence mounts the overlay cold, backdrop-filter triggers
//     on-demand GPU layer promotion — the promotion IS the flash.
//     `rgba(0,0,0,0.72)` is visually equivalent to the previous blur+opacity combo.
//
//   [FIX COMPOSITOR-2]: Removed `backdrop-blur-xl` from the mobile FAB button.
//     When the command palette closes, AnimatePresence unmounts the overlay and the
//     FAB re-appears. Without backdrop-blur-xl, the FAB appears without triggering
//     any compositor layer work. `bg-black/85` is opaque enough to not need blur.
//     `transform-gpu` permanently pre-promotes the FAB so re-appearance is instant.
//
//   KEEP: All v21 keyboard navigation, group rendering, search filtering, mobile
//     bottom-sheet layout, drag handle, safe-area inset, iOS focus delay,
//     all command items, all motion variants and spring physics.

import { AnimatePresence, m, useReducedMotion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { CONTACT_EMAIL, CV_ASSET_PATH } from '@/lib/config';
import { springs } from '@/lib/motionVariants';

interface CommandItem {
  id:        string;
  label:     string;
  shortcut?: string;
  group:     string;
  action:    () => void;
}

type CommandPaletteWindow = Window & { __commandPaletteRequested?: boolean };

const PANEL_VARIANTS_DESKTOP = {
  hidden:  { opacity: 0, y: -12, scale: 0.98 },
  visible: { opacity: 1, y: 0,   scale: 1    },
  exit:    { opacity: 0, y: -8,  scale: 0.98 },
};

const PANEL_VARIANTS_MOBILE = {
  hidden:  { opacity: 0, y: 72 },
  visible: { opacity: 1, y: 0  },
  exit:    { opacity: 0, y: 72 },
};

export function CommandPalette() {
  const [open,        setOpen]        = useState(false);
  const [query,       setQuery]       = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile,    setIsMobile]    = useState(false);

  const inputRef       = useRef<HTMLInputElement>(null);
  const openRef        = useRef(open);
  const activeIndexRef = useRef(activeIndex);
  const filteredRef    = useRef<CommandItem[]>([]);

  const router        = useRouter();
  const pathname      = usePathname();
  const reducedMotion = useReducedMotion();

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
      // FIX v22: IDs corrected to match actual DOM ids in each section component.
      { id: 'nav-projects',    group: 'Navigate', label: 'Projects',    action: () => scrollTo('section-projects') },
      { id: 'nav-open-source', group: 'Navigate', label: 'Open Source', action: () => scrollTo('open-source')     },
      { id: 'nav-skills',      group: 'Navigate', label: 'Skills',      action: () => scrollTo('skills')          },
      { id: 'nav-about',       group: 'Navigate', label: 'About',       action: () => scrollTo('section-about')   },
      { id: 'nav-writing',     group: 'Navigate', label: 'Writing',     action: () => scrollTo('section-writing') },
      { id: 'nav-contact',     group: 'Navigate', label: 'Contact',     action: () => scrollTo('section-contact') },
      {
        id: 'cs-taxbridge',  group: 'Case Studies', label: 'TaxBridge case study',
        action: () => { router.push('/work/taxbridge');   close(); },
      },
      {
        id: 'cs-sabiscore',  group: 'Case Studies', label: 'SabiScore case study',
        action: () => { router.push('/work/sabiscore');   close(); },
      },
      {
        id: 'cs-hashablanca', group: 'Case Studies', label: 'Hashablanca case study',
        action: () => { router.push('/work/hashablanca'); close(); },
      },
      {
        id: 'action-writing', group: 'Actions', label: 'All writing',
        action: () => { router.push('/writing'); close(); },
      },
      {
        id: 'action-resume', group: 'Actions', label: 'Open résumé', shortcut: 'R',
        action: () => { window.open(CV_ASSET_PATH, '_blank', 'noopener,noreferrer'); close(); },
      },
      {
        id: 'action-copy-email', group: 'Actions', label: 'Copy email', shortcut: 'C',
        action: () => {
          void navigator.clipboard.writeText(CONTACT_EMAIL);
          close();
        },
      },
      {
        id: 'action-email', group: 'Actions', label: 'Send email', shortcut: 'E',
        action: () => { globalThis.location.href = `mailto:${CONTACT_EMAIL}`; close(); },
      },
      {
        id: 'action-github', group: 'Actions', label: 'Open GitHub',
        action: () => { window.open('https://github.com/Scardubu', '_blank', 'noopener,noreferrer'); close(); },
      },
      {
        id: 'action-linkedin', group: 'Actions', label: 'Open LinkedIn',
        action: () => { window.open('https://linkedin.com/in/oscardubu', '_blank', 'noopener,noreferrer'); close(); },
      },
      {
        id: 'action-theme', group: 'Actions', label: 'Toggle theme',
        action: () => {
          const root = document.documentElement;
          root.classList.toggle('light');
          close();
        },
      },
    ],
    [router, scrollTo, close]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.group.toLowerCase().includes(q)
    );
  }, [commands, query]);

  openRef.current        = open;
  activeIndexRef.current = activeIndex;
  filteredRef.current    = filtered;

  const execute = useCallback((cmd: CommandItem) => { cmd.action(); }, []);

  // Keyboard navigation
  useEffect(() => {
    const toggle = () => setOpen((v) => !v);
    const openFn = () => setOpen(true);

    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggle();
        return;
      }
      if (!openRef.current) return;
      if (e.key === 'Escape')    { e.preventDefault(); close(); return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex((i) => Math.min(i + 1, Math.max(filteredRef.current.length - 1, 0))); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setActiveIndex((i) => Math.max(i - 1, 0)); }
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

  // Pick up early-intercept flag
  useEffect(() => {
    const w = globalThis as unknown as CommandPaletteWindow;
    if (w.__commandPaletteRequested) {
      setOpen(true);
      w.__commandPaletteRequested = false;
    }
  }, []);

  // Focus input when opened — delayed on mobile to prevent keyboard jump on iOS
  useEffect(() => {
    if (!open) return;
    const delay = isMobile ? 320 : 60;
    const t = setTimeout(() => inputRef.current?.focus(), delay);
    return () => clearTimeout(t);
  }, [open, isMobile]);

  // Groups for display
  const groups = useMemo(() => {
    const map = new Map<string, CommandItem[]>();
    filtered.forEach((c) => {
      const arr = map.get(c.group) ?? [];
      arr.push(c);
      map.set(c.group, arr);
    });
    return map;
  }, [filtered]);

  const panelVariants   = isMobile ? PANEL_VARIANTS_MOBILE : PANEL_VARIANTS_DESKTOP;
  const panelTransition = reducedMotion ? { duration: 0 } : springs.smooth;

  return (
    <>
      <AnimatePresence>
        {open && (
          // FIX v22 [COMPOSITOR-1, ARIA-1]:
          //   - No backdropFilter — was triggering on-demand GPU layer promotion on mount.
          //     rgba(0,0,0,0.72) is visually equivalent at this coverage level.
          //   - aria-hidden="true": the backdrop is not a dialog — it's a dismiss target.
          //     The inner panel below carries role="dialog" and the actual semantics.
          <m.div
            className="fixed inset-0 z-[500]"
            style={{ background: 'rgba(0,0,0,0.72)' }}
            initial={reducedMotion ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reducedMotion ? {} : { opacity: 0 }}
            onClick={close}
            aria-hidden="true"
          >
            {/* FIX v22 [ARIA-1]: role="dialog" lives here — the panel is the dialog.
                The outer overlay div above is the dismissible backdrop (aria-hidden). */}
            <m.div
              className={[
                'absolute glass-full overflow-hidden',
                isMobile
                  ? 'bottom-0 left-0 right-0 rounded-t-[var(--radius-xl)] max-h-[80vh]'
                  : 'top-[15vh] left-1/2 -translate-x-1/2 w-full max-w-[540px] rounded-[var(--radius-xl)]',
              ].join(' ')}
              role="dialog"
              aria-modal="true"
              aria-label="Command palette"
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={panelTransition}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drag handle — enlarged tap target on mobile */}
              {isMobile && (
                <div
                  className="flex justify-center items-center pt-4 pb-2"
                  aria-hidden="true"
                  style={{ minHeight: '48px' }}
                >
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
                style={{ maxHeight: isMobile ? 'calc(80vh - 96px)' : '360px' }}
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
                              className="w-full flex items-center gap-3 px-4 min-h-[48px] text-left transition-colors focus-visible:outline-none focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-white/20"
                              style={{
                                background: isActive
                                  ? 'oklch(100% 0 0 / 0.06)'
                                  : 'transparent',
                                color: isActive
                                  ? 'var(--color-text-primary)'
                                  : 'var(--color-text-secondary)',
                              }}
                              data-active={isActive}
                              onClick={() => execute(cmd)}
                              onMouseEnter={() => setActiveIndex(flatIndex)}
                            >
                              <span className="flex-1 text-sm">{cmd.label}</span>
                              {cmd.shortcut && (
                                <kbd
                                  className="shrink-0 rounded border px-1.5 py-0.5 font-mono text-[10px]"
                                  style={{
                                    borderColor: 'var(--color-border)',
                                    color: 'var(--color-text-muted)',
                                  }}
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
                                  <path
                                    d="M2.5 6h7M6.5 3l3 3-3 3"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    );
                  })
                )}

                {/* Safe zone: iOS home indicator */}
                {isMobile && (
                  <div
                    className="h-6"
                    style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
                    aria-hidden="true"
                  />
                )}
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>

      {/* Mobile FAB — FIX v22 [COMPOSITOR-2]:
          backdrop-blur-xl removed — was triggering on-demand GPU layer promotion
          each time the FAB appeared after the palette closed. bg-black/85 is
          opaque enough to read on any background without needing blur.
          transform-gpu permanently pre-promotes the FAB so appearance is instant. */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open command palette"
          className="fixed bottom-6 right-4 z-40 transform-gpu flex h-12 w-12 items-center justify-center rounded-2xl border border-white/12 bg-black/85 text-white/70 transition-colors duration-200 hover:border-white/20 hover:text-white lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(73%_0.18_196)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          style={{ boxShadow: '0 4px 24px oklch(0% 0 0 / 0.4)' }}
        >
          <span className="font-mono text-sm font-semibold tracking-tight" aria-hidden="true">⌘</span>
        </button>
      )}
    </>
  );
}