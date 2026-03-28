"use client";

import { useEffect } from "react";

export function useScrollReveal(selector = "[data-reveal]") {
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      document.querySelectorAll(selector).forEach((element) => {
        element.classList.add("revealed");
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    document.querySelectorAll(selector).forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [selector]);
}
