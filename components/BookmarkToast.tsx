// CONVICTION ENGINE v8.0 — FULL REPLACEMENT
'use client';

import { AnimatePresence, m } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { springConfig } from '@/lib/motion';

const SESSION_KEY = 'portfolio_bookmark_shown';
const AUTO_DISMISS_MS = 6_000;
const INITIAL_DELAY_MS = 2_500;

export function BookmarkToast() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [shortcutLabel, setShortcutLabel] = useState('Ctrl+D');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (globalThis.innerWidth < 480) return;

    try {
      if (globalThis.sessionStorage.getItem(SESSION_KEY)) return;
    } catch {
      return;
    }

    const isApplePlatform = /Mac|iPhone|iPad|iPod/i.test(globalThis.navigator.userAgent);
    setShortcutLabel(isApplePlatform ? '⌘D' : 'Ctrl+D');

    const showTimer = setTimeout(() => {
      setVisible(true);
    }, INITIAL_DELAY_MS);

    return () => {
      clearTimeout(showTimer);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [mounted]);

  useEffect(() => {
    if (!visible) return;

    try {
      globalThis.sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      // storage blocked — silent
    }

    timerRef.current = setTimeout(() => dismiss(), AUTO_DISMISS_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [visible]);

  const dismiss = () => {
    setVisible(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence mode="wait">
      {visible ? (
        <m.div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          initial={{ x: '120%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '120%', opacity: 0 }}
          transition={springConfig}
          className="glass-surface fixed top-20 right-4 z-60 max-w-[280px] rounded-xl px-5 py-4"
        >
          <button
            onClick={dismiss}
            aria-label="Dismiss bookmark suggestion"
            className="absolute top-2 right-2 flex min-h-[44px] min-w-[44px] items-center justify-center text-white/50 transition hover:text-white focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:outline-none"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 fill-none stroke-current stroke-2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
          <p className="pr-6 text-sm font-semibold text-white">Enjoying the portfolio?</p>
          <p className="mt-1 text-xs text-white/60">
            Press <kbd className="rounded border border-white/20 px-1 py-0.5">{shortcutLabel}</kbd>{' '}
            to bookmark this page.
          </p>
        </m.div>
      ) : null}
    </AnimatePresence>,
    globalThis.document.body
  );
}
