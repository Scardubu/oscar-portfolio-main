"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const STORAGE_KEY = "od_bookmark_shown";

/**
 * BookmarkToast
 *
 * Fires once at 80% scroll depth.
 * localStorage flag prevents repeat shows.
 * Glass surface, 4s auto-dismiss.
 * WCAG AA: role="status", polite announcement.
 */
export function BookmarkToast() {
  const [visible, setVisible] = useState(false);
  const pRM = useReducedMotion();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(STORAGE_KEY)) return;

    const onScroll = () => {
      const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      if (scrolled >= 0.8) {
        setVisible(true);
        localStorage.setItem(STORAGE_KEY, "1");
        window.removeEventListener("scroll", onScroll);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Auto-dismiss after 4s
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(t);
  }, [visible]);

  const isMac = typeof navigator !== "undefined" && /Mac/.test(navigator.platform);
  const shortcut = isMac ? "⌘D" : "Ctrl+D";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          aria-live="polite"
          aria-label="Bookmark this page"
          initial={pRM ? {} : { opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="glass-card glass-medium fixed bottom-5 right-4 z-[300] flex max-w-[280px] cursor-pointer items-center gap-3 px-5 py-4 text-white sm:right-8"
          onClick={() => setVisible(false)}
        >
          <span aria-hidden="true">🔖</span>
          <div>
            <p className="text-sm font-semibold">Bookmark this</p>
            <p className="font-mono text-xs text-white/65">
              {shortcut} to save for later
            </p>
          </div>
          <button
            aria-label="Dismiss"
            onClick={e => { e.stopPropagation(); setVisible(false); }}
            className="ml-auto rounded-md p-1 text-white/50 transition hover:text-white"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2 2L10 10M2 10L10 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
