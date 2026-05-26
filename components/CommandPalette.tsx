'use client';
// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
// Major Reset • Lagos → Global • Production Conviction Architecture

import { AnimatePresence, m, useReducedMotion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useScrollCinema } from '@/components/cinematic/ScrollCinemaProvider';
import { useTheme } from '@/components/ThemeProvider';
import { CONTACT_EMAIL, CV_ASSET_PATH } from '@/lib/config';
import { springs } from '@/lib/motionVariants';

interface CommandItem {
  id: string;
  label: string;
  shortcut?: string;
  group: string;
  action: () => void;
}

interface LiveStatusSnapshot {
  systemStatus: 'operational' | 'degraded' | 'down';
  uptime?: number;
  todayPredictions?: number | null;
}

type CommandPaletteWindow = Window & { __commandPaletteRequested?: boolean };

const PANEL_VARIANTS_DESKTOP = {
  hidden: { opacity: 0, y: -12, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -8, scale: 0.98 },
};

const PANEL_VARIANTS_MOBILE = {
  hidden: { opacity: 0, y: 72 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 72 },
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [whyLagosOpen, setWhyLagosOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [statusAvailable, setStatusAvailable] = useState(false);
  const [statusSnapshot, setStatusSnapshot] = useState<LiveStatusSnapshot | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  // Stores the element that had focus before the palette opened so we can
  // restore it on close — critical for keyboard and screen-reader UX.
  const triggerRef = useRef<HTMLElement | null>(null);
  const openRef = useRef(open);
  const activeIndexRef = useRef(activeIndex);
  const filteredRef = useRef<CommandItem[]>([]);

  const router = useRouter();
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const { scrollToSection } = useScrollCinema();
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    const media = window.matchMedia('(pointer: fine)');

    const syncMobile = () => {
      setIsMobile(!media.matches);
    };

    syncMobile();
    media.addEventListener('change', syncMobile);

    return () => {
      media.removeEventListener('change', syncMobile);
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    fetch('/api/live-metrics', { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: LiveStatusSnapshot | null) => {
        if (!data) return;
        if (
          data.systemStatus === 'operational' ||
          data.systemStatus === 'degraded' ||
          data.systemStatus === 'down'
        ) {
          setStatusSnapshot(data);
          setStatusAvailable(true);
        }
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setStatusAvailable(false);
      });

    return () => {
      controller.abort();
    };
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
      // Route through the cinema provider so the navigation glides via Lenis,
      // respects prefers-reduced-motion, and applies the -88px nav offset
      // — same code path as the navbar, hero CTAs, and hash links.
      scrollToSection(id);
      close();
    },
    [close, pathname, router, scrollToSection]
  );

  const commands = useMemo<CommandItem[]>(
    () => [
      // FIX v22: IDs corrected to match actual DOM ids in each section component.
      {
        id: 'nav-projects',
        group: 'Navigate',
        label: 'Projects',
        action: () => scrollTo('section-projects'),
      },
      {
        id: 'nav-open-source',
        group: 'Navigate',
        label: 'Open Source',
        action: () => scrollTo('open-source'),
      },
      { id: 'nav-skills', group: 'Navigate', label: 'Skills', action: () => scrollTo('skills') },
      {
        id: 'nav-about',
        group: 'Navigate',
        label: 'About',
        action: () => scrollTo('section-about'),
      },
      {
        id: 'nav-writing',
        group: 'Navigate',
        label: 'Writing',
        action: () => scrollTo('section-writing'),
      },
      {
        id: 'nav-contact',
        group: 'Navigate',
        label: 'Contact',
        action: () => scrollTo('section-contact'),
      },
      {
        id: 'cs-taxbridge',
        group: 'Case Studies',
        label: 'TaxBridge case study',
        action: () => {
          router.push('/work/taxbridge');
          close();
        },
      },
      {
        id: 'cs-sabiscore',
        group: 'Case Studies',
        label: 'SabiScore case study',
        action: () => {
          router.push('/work/sabiscore');
          close();
        },
      },
      {
        id: 'cs-hashablanca',
        group: 'Case Studies',
        label: 'Hashablanca case study',
        action: () => {
          router.push('/work/hashablanca');
          close();
        },
      },
      {
        id: 'action-writing',
        group: 'Actions',
        label: 'All writing',
        action: () => {
          router.push('/writing');
          close();
        },
      },
      {
        id: 'action-resume',
        group: 'Actions',
        label: 'Open résumé',
        shortcut: 'R',
        action: () => {
          window.open(CV_ASSET_PATH, '_blank', 'noopener,noreferrer');
          close();
        },
      },
      {
        id: 'action-copy-email',
        group: 'Actions',
        label: 'Copy email',
        shortcut: 'C',
        action: () => {
          void navigator.clipboard.writeText(CONTACT_EMAIL);
          close();
        },
      },
      {
        id: 'action-email',
        group: 'Actions',
        label: 'Send email',
        shortcut: 'E',
        action: () => {
          globalThis.location.href = `mailto:${CONTACT_EMAIL}`;
          close();
        },
      },
      {
        id: 'action-github',
        group: 'Actions',
        label: 'Open GitHub',
        action: () => {
          window.open('https://github.com/Scardubu', '_blank', 'noopener,noreferrer');
          close();
        },
      },
      {
        id: 'action-linkedin',
        group: 'Actions',
        label: 'Open LinkedIn',
        action: () => {
          window.open('https://linkedin.com/in/oscardubu', '_blank', 'noopener,noreferrer');
          close();
        },
      },
      {
        id: 'action-theme',
        group: 'Actions',
        label: 'Toggle theme',
        action: () => {
          setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
          close();
        },
      },
      // Easter Eggs — V1.0 Change 9: §DELIGHT_MISS:personality
      {
        id: 'why-lagos',
        group: 'Easter Eggs',
        label: '/why-lagos',
        action: () => {
          setWhyLagosOpen(true);
          close();
        },
      },
      ...(statusAvailable
        ? [
            {
              id: 'status',
              group: 'Easter Eggs',
              label: '/status',
              action: () => {
                setStatusOpen(true);
                close();
              },
            },
          ]
        : []),
    ],
    [close, resolvedTheme, router, scrollTo, setTheme, statusAvailable]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(
      (c) => c.label.toLowerCase().includes(q) || c.group.toLowerCase().includes(q)
    );
  }, [commands, query]);

  openRef.current = open;
  activeIndexRef.current = activeIndex;
  filteredRef.current = filtered;

  const execute = useCallback((cmd: CommandItem) => {
    cmd.action();
  }, []);

  // Save trigger element on open; restore focus on close (after exit animation).
  useEffect(() => {
    if (open) {
      triggerRef.current = document.activeElement as HTMLElement;
      return;
    }
    const saved = triggerRef.current;
    const t = setTimeout(() => {
      const fallbackTarget = document.getElementById('main-content');
      const target =
        saved && saved !== document.body
          ? saved
          : fallbackTarget instanceof HTMLElement
            ? fallbackTarget
            : null;

      target?.focus({ preventScroll: true });
      triggerRef.current = null;
    }, 150);
    return () => clearTimeout(t);
  }, [open]);

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
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      // Focus trap — cycle Tab / Shift+Tab within the dialog panel.
      if (e.key === 'Tab' && panelRef.current) {
        const focusable = Array.from(
          panelRef.current.querySelectorAll<HTMLElement>(
            'a[href]:not([disabled]),button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'
          )
        ).filter(
          (el) =>
            !el.hasAttribute('hidden') &&
            getComputedStyle(el).display !== 'none' &&
            getComputedStyle(el).visibility !== 'hidden'
        );
        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (
            document.activeElement === first ||
            !panelRef.current.contains(document.activeElement)
          ) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (
            document.activeElement === last ||
            !panelRef.current.contains(document.activeElement)
          ) {
            e.preventDefault();
            first.focus();
          }
        }
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, Math.max(filteredRef.current.length - 1, 0)));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      }
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

  const panelVariants = isMobile ? PANEL_VARIANTS_MOBILE : PANEL_VARIANTS_DESKTOP;
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
            className="fixed inset-0 z-[500] bg-[rgba(0,0,0,0.72)]"
            initial={reducedMotion ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reducedMotion ? {} : { opacity: 0 }}
            onClick={close}
            aria-hidden="true"
          >
            {/* FIX v22 [ARIA-1]: role="dialog" lives here — the panel is the dialog.
                The outer overlay div above is the dismissible backdrop (aria-hidden). */}
            <m.div
              ref={panelRef}
              className={[
                'glass-full absolute overflow-hidden',
                isMobile
                  ? 'right-0 bottom-0 left-0 max-h-[80vh] rounded-t-[var(--radius-xl)]'
                  : 'top-[15vh] left-1/2 w-full max-w-[540px] -translate-x-1/2 rounded-[var(--radius-xl)]',
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
                <div className="flex min-h-[48px] items-center justify-center pt-4 pb-2">
                  <div className="bg-color-border h-1 w-10 rounded-full" />
                </div>
              )}

              {/* Search input */}
              <div className="border-color-border flex items-center gap-3 border-b px-4 py-3">
                <svg
                  className="text-color-text-muted h-4 w-4 shrink-0"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle cx="8.5" cy="8.5" r="5.75" stroke="currentColor" strokeWidth="1.5" />
                  <path
                    d="M13.5 13.5L17 17"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>

                <input
                  ref={inputRef}
                  className="text-color-text-primary flex-1 bg-transparent text-sm outline-none placeholder:font-mono placeholder:text-xs placeholder:tracking-wide"
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
                  <kbd className="border-color-border text-color-text-muted shrink-0 rounded border px-1.5 py-0.5 font-mono text-[10px]">
                    ESC
                  </kbd>
                )}
              </div>

              {/* Results */}
              <div
                className="overflow-y-auto"
                // eslint-disable-next-line no-restricted-syntax
                style={{ maxHeight: isMobile ? 'calc(80vh - 96px)' : '360px' }}
              >
                {filtered.length === 0 ? (
                  <p className="text-color-text-muted px-4 py-6 text-center font-mono text-xs">
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
                        <p className="text-color-text-muted px-4 pt-3 pb-1 font-mono text-[10px] tracking-widest uppercase">
                          {groupName}
                        </p>
                        {items.map((cmd, localI) => {
                          const flatIndex = runningIndex + localI;
                          const isActive = flatIndex === activeIndex;

                          return (
                            <button
                              key={cmd.id}
                              type="button"
                              className="flex min-h-[48px] w-full items-center gap-3 px-4 text-left transition-colors focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:outline-none focus-visible:ring-inset"
                              // eslint-disable-next-line no-restricted-syntax
                              style={{
                                background: isActive ? 'oklch(100% 0 0 / 0.06)' : 'transparent',
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
                                <kbd className="border-color-border text-color-text-muted shrink-0 rounded border px-1.5 py-0.5 font-mono text-[10px]">
                                  {cmd.shortcut}
                                </kbd>
                              )}
                              {isActive && (
                                <svg
                                  className="text-color-film-teal h-3 w-3 shrink-0"
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
                    className="h-6 [padding-bottom:env(safe-area-inset-bottom,0px)]"
                    aria-hidden="true"
                  />
                )}
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>

      {/* Persistent FAB — FIX v23 [COMPOSITOR-2]:
          Keep a single fixed affordance across chapters for fast command access.
          bg-black/85 keeps readability without blur-driven layer promotion.
          transform-gpu pre-promotes for instant re-entry after palette close. */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open command palette"
          className="fixed right-4 z-40 flex h-12 w-12 transform-gpu items-center justify-center rounded-2xl border border-white/12 bg-black/85 text-white/70 shadow-[0_4px_24px_oklch(0%_0_0_/_0.4)] transition-colors duration-200 hover:border-white/20 hover:text-white focus-visible:ring-2 focus-visible:ring-[oklch(73%_0.18_196)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:outline-none sm:h-11 sm:w-auto sm:min-w-[3.5rem] sm:px-3 lg:h-10"
          // Lifts the FAB above iOS Safari's home-indicator gesture zone.
          // eslint-disable-next-line no-restricted-syntax
          style={{ bottom: 'max(1.5rem, calc(env(safe-area-inset-bottom, 0px) + 0.75rem))' }}
        >
          <span className="font-mono text-sm font-semibold tracking-tight" aria-hidden="true">
            <span className="sm:hidden">⌘</span>
            <span className="hidden sm:inline">⌘K</span>
          </span>
        </button>
      )}

      {/* /why-lagos modal — V1.0 Change 9: §DELIGHT_MISS:personality easter egg.
          Spec verbatim: "Constraint is a design tool. Lagos constraint is a sharper one."
          Dismiss on Escape or click-outside. */}
      <AnimatePresence>
        {statusOpen && statusSnapshot && (
          <m.div
            key="status-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-[oklch(0%_0_0_/_0.75)] p-6"
            onClick={() => setStatusOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Live system status"
            onKeyDown={(e) => {
              if (e.key === 'Escape') setStatusOpen(false);
            }}
            tabIndex={-1}
          >
            <m.div
              key="status-panel"
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              className="border-color-border relative w-full max-w-sm rounded-[var(--radius-xl)] border bg-[oklch(14%_0.008_264)] p-8 shadow-[0_32px_80px_oklch(0%_0_0_/_0.6)]"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-color-film-teal mb-4 font-mono text-[10px] tracking-widest uppercase">
                /status
              </p>
              <p className="text-color-text-primary text-base leading-8 font-medium">
                {statusSnapshot.systemStatus === 'operational'
                  ? 'All systems operational.'
                  : statusSnapshot.systemStatus === 'degraded'
                    ? 'Systems are degraded.'
                    : 'Service disruption detected.'}
              </p>
              <p className="text-color-text-secondary mt-4 text-sm leading-7">
                {typeof statusSnapshot.uptime === 'number'
                  ? `Reported uptime: ${statusSnapshot.uptime.toFixed(2)}%.`
                  : 'Live metrics available.'}{' '}
                {typeof statusSnapshot.todayPredictions === 'number'
                  ? `Today predictions: ${statusSnapshot.todayPredictions}.`
                  : ''}
              </p>
              <button
                type="button"
                onClick={() => setStatusOpen(false)}
                className="text-color-text-muted mt-6 font-mono text-[10px] tracking-widest uppercase transition hover:opacity-70"
                autoFocus
              >
                Dismiss ↩
              </button>
            </m.div>
          </m.div>
        )}

        {whyLagosOpen && (
          <m.div
            key="why-lagos-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-[oklch(0%_0_0_/_0.75)] p-6"
            onClick={() => setWhyLagosOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Why Lagos"
            onKeyDown={(e) => {
              if (e.key === 'Escape') setWhyLagosOpen(false);
            }}
            tabIndex={-1}
          >
            <m.div
              key="why-lagos-panel"
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              className="border-color-border relative w-full max-w-sm rounded-[var(--radius-xl)] border bg-[oklch(14%_0.008_264)] p-8 shadow-[0_32px_80px_oklch(0%_0_0_/_0.6)]"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-color-film-teal mb-4 font-mono text-[10px] tracking-widest uppercase">
                /why-lagos
              </p>
              <p className="text-color-text-primary text-base leading-8 font-medium">
                Constraint is a design tool.
                <br />
                Lagos constraint is a sharper one.
              </p>
              <p className="text-color-text-secondary mt-4 text-sm leading-7">
                Power cuts at 2am. Rate-limited government APIs. Audit pressure with a 48-hour
                window. Every system I build has been shaped by these constraints — not despite
                them, but because of them. Comfortable conditions produce comfortable systems.
              </p>
              <button
                type="button"
                onClick={() => setWhyLagosOpen(false)}
                className="text-color-text-muted mt-6 font-mono text-[10px] tracking-widest uppercase transition hover:opacity-70"
                autoFocus
              >
                Dismiss ↩
              </button>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
