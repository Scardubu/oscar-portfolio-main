"use client";
// components/PageWrapper.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Wraps every page with:
//   1. Framer Motion AnimatePresence page transition
//   2. Scroll-reveal IntersectionObserver (replaces ScrollRevealInit)
//   3. Reduced-motion guard at React level
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useReducedMotion } from "framer-motion";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { pageTransition } from "@/lib/motion";

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const prefersReduced = useReducedMotion();

  // Boot IntersectionObserver for CSS [data-reveal] elements
  useEffect(() => {
    if (prefersReduced) {
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        el.classList.add("is-visible");
      });
      return;
    }

    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -48px 0px" }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname, prefersReduced]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={prefersReduced ? undefined : pageTransition}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
