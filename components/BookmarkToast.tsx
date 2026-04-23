// CONVICTION ENGINE v7.0 — FULL REPLACEMENT
'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const SESSION_KEY = 'portfolio_bookmark_shown';
const AUTO_DISMISS_MS = 8_000;
const SCROLL_THRESHOLD = 0.4;

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

    // sessionStorage: show once per browser session only
    try {
      if (globalThis.sessionStorage.getItem(SESSION_KEY)) return;
    } catch {
      return;
    }

    const isApplePlatform = /Mac|iPhone|iPad|iPod/i.test(globalThis.navigator.userAgent);
    setShortcutLabel(isApplePlatform ? '⌘D' : 'Ctrl+D');

    const onScroll = () => {
      if (globalThis.scrollY > globalThis.innerHeight * SCROLL_THRESHOLD) {
        setVisible(true);
        globalThis.removeEventListener('scroll', onScroll);
        timerRef.current = setTimeout(() => dismiss(), AUTO_DISMISS_MS);
      }
    };

    globalThis.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      globalThis.removeEventListener('scroll', onScroll);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  const dismiss = () => {
    setVisible(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    try {
      globalThis.sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      // storage blocked — silent
    }
  };

  if (!mounted || !visible) return null;

  return createPortal(
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="fixed top-[calc(var(--nav-height,72px)+1rem)] right-5 z-50 max-w-xs rounded-2xl border border-white/15 bg-[rgba(15,15,25,0.92)] px-5 py-4 shadow-2xl backdrop-blur-xl"
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
        Press <kbd className="rounded border border-white/20 px-1 py-0.5">{shortcutLabel}</kbd> to
        bookmark this page.
      </p>
    </div>,
    globalThis.document.body
  );
}
