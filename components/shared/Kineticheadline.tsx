"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface KineticHeadlineProps {
  words: readonly string[];
  className?: string;
  wordClassName?: string;
  intervalMs?: number;
}

export function KineticHeadline({
  words,
  className,
  wordClassName,
  intervalMs = 2200,
}: KineticHeadlineProps) {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || words.length <= 1) return;

    const id = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrent((c) => (c + 1) % words.length);
        setAnimating(false);
      }, 350);
    }, intervalMs);

    return () => clearInterval(id);
  }, [words, intervalMs, reduced]);

  const word = words[current] ?? words[0];

  return (
    <span
      className={cn("inline-block overflow-hidden align-bottom", className)}
      aria-live="polite"
      aria-atomic="true"
    >
      <span
        key={current}
        className={cn(
          "inline-block text-gradient-kinetic",
          !reduced && "transition-all duration-350",
          animating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0",
          wordClassName
        )}
        style={{ fontFamily: "var(--font-syne, sans-serif)" }}
      >
        {word}
      </span>
    </span>
  );
}
