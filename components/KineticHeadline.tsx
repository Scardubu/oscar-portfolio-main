/**
 * KineticHeadline.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Word-by-word clip-path + translateY reveal using the oscar-kinetic-in
 * keyframe already defined in globals.css.
 *
 * Usage:
 *   <KineticHeadline
 *     text="Full-Stack ML Engineer"
 *     gradient
 *     as="h1"
 *   />
 * ─────────────────────────────────────────────────────────────────────────────
 */

"use client";

import React, { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface KineticHeadlineProps {
  text:       string;
  as?:        "h1" | "h2" | "h3" | "p" | "span";
  gradient?:  "accent" | "kinetic" | "fintech" | false;
  size?:      "display" | "kinetic" | "headline";
  className?: string;
  delay?:     number; // base delay in ms between words
  once?:      boolean;
}

const sizeClass = {
  display:  "text-display",
  kinetic:  "text-kinetic",
  headline: "text-headline",
};

const gradientClass = {
  accent:  "text-gradient-accent",
  kinetic: "text-gradient-kinetic",
  fintech: "text-gradient-fintech",
};

export function KineticHeadline({
  text,
  as:        Tag = "h1",
  gradient   = false,
  size       = "kinetic",
  className,
  delay      = 60,
  once       = true,
}: KineticHeadlineProps) {
  const ref                  = useRef<HTMLElement | null>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) { setStarted(true); return; }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          if (once) obs.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [once]);

  const words = text.split(" ");

  return (
    <Tag
      // @ts-expect-error — polymorphic ref
      ref={ref}
      className={cn(
        sizeClass[size],
        gradient && gradientClass[gradient],
        "overflow-hidden",
        className
      )}
      aria-label={text}
    >
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block mr-[0.2em] overflow-hidden"
          aria-hidden="true"
        >
          <span
            className={cn(
              "inline-block",
              started
                ? "animate-kinetic-in"
                : "opacity-0 translate-y-[0.6em]"
            )}
            style={{
              animationDelay: started ? `${i * delay}ms` : undefined,
            }}
          >
            {word}
          </span>
        </span>
      ))}
    </Tag>
  );
}
