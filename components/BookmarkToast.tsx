'use client';

import { useEffect, useState } from 'react';

export function BookmarkToast() {
  const [visible, setVisible] = useState(false);
  const [shortcutLabel, setShortcutLabel] = useState('Ctrl+D');

  useEffect(() => {
    try {
      if (globalThis.localStorage.getItem('bookmark_dismissed')) return;
    } catch {
      return;
    }

    const isApplePlatform = /Mac|iPhone|iPad|iPod/i.test(globalThis.navigator.userAgent);
    setShortcutLabel(isApplePlatform ? '⌘D' : 'Ctrl+D');

    const onScroll = () => {
      if (globalThis.scrollY > globalThis.innerHeight * 0.4) {
        setVisible(true);
        globalThis.removeEventListener('scroll', onScroll);
      }
    };

    globalThis.addEventListener('scroll', onScroll, { passive: true });
    return () => globalThis.removeEventListener('scroll', onScroll);
  }, []);

  const dismiss = () => {
    setVisible(false);
    try {
      globalThis.localStorage.setItem('bookmark_dismissed', '1');
    } catch {
      // ignore
    }
  };

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 max-w-xs rounded-2xl border border-white/15 bg-[rgba(15,15,25,0.92)] px-5 py-4 shadow-2xl backdrop-blur-xl"
    >
      <button
        onClick={dismiss}
        aria-label="Dismiss bookmark suggestion"
        className="absolute right-3 top-3 text-white/50 transition hover:text-white"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2" strokeLinecap="round" aria-hidden="true">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
      <p className="text-sm font-semibold text-white">Enjoying the portfolio?</p>
      <p className="mt-1 text-xs text-white/60">Press <kbd className="rounded border border-white/20 px-1 py-0.5">{shortcutLabel}</kbd> to bookmark this page.</p>
    </div>
  );
}
