"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function BookmarkToast() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("bm-shown")) return;
    const onScroll = () => {
      const depth = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      if (depth >= 0.8) {
        setVisible(true);
        localStorage.setItem("bm-shown", "1");
        window.removeEventListener("scroll", onScroll);
        setTimeout(() => setVisible(false), 4000);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status" aria-live="polite"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-6 right-6 z-50 glass-card text-xs text-zinc-300
            px-4 py-2 pointer-events-none"
        >
          Bookmark this · ⌘D
        </motion.div>
      )}
    </AnimatePresence>
  );
}