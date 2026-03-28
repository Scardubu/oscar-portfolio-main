"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks";
import { cn } from "@/lib/utils";

interface KineticHeadlineProps {
  /** Primary large text — rendered as the kinetic display  */
  text: string;
  /** Optional gradient variant */
  gradient?: "accent" | "kinetic" | "fintech" | "none";
  /** Section label above the headline */
  eyebrow?: string;
  /** Subtitle below the headline */
  sub?: string;
  /** HTML tag to render as */
  as?: "h1" | "h2" | "h3";
  className?: string;
  textClassName?: string;
  centered?: boolean;
}

/**
 * KineticHeadline — Section authority headline.
 * Animates words in with stagger + clip-path reveal.
 * Falls back to static text with prefers-reduced-motion.
 */
export function KineticHeadline({
  text,
  gradient = "none",
  eyebrow,
  sub,
  as: Tag = "h2",
  className,
  textClassName,
  centered = false,
}: KineticHeadlineProps) {
  const reduced = useReducedMotion();
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.2 });

  const words = text.split(" ");

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: "0.6em",
      skewY: 3,
      clipPath: "inset(0 0 100% 0)",
    },
    visible: {
      opacity: 1,
      y: 0,
      skewY: 0,
      clipPath: "inset(0 0 0% 0)",
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const gradientClass = {
    accent: "text-gradient-accent",
    kinetic: "text-gradient-kinetic",
    fintech: "text-gradient-fintech",
    none: "",
  }[gradient];

  return (
    <div
      ref={ref}
      className={cn("flex flex-col gap-3", centered && "items-center text-center", className)}
    >
      {eyebrow && (
        <motion.span
          className="text-caption text-[var(--accent-primary)] tracking-[0.2em]"
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {eyebrow}
        </motion.span>
      )}

      <Tag className={cn("text-kinetic overflow-hidden", textClassName)}>
        {reduced ? (
          <span className={cn(gradientClass)}>{text}</span>
        ) : (
          <motion.span
            className={cn("flex flex-wrap gap-x-[0.25em]", centered && "justify-center")}
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            {words.map((word, i) => (
              <motion.span
                key={i}
                className={cn(
                  "inline-block overflow-hidden gpu-accelerate",
                  i === words.length - 1 && gradient !== "none" ? gradientClass : "",
                )}
                variants={wordVariants}
              >
                {word}
              </motion.span>
            ))}
          </motion.span>
        )}
      </Tag>

      {sub && (
        <motion.p
          className="text-subhead max-w-2xl"
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          {sub}
        </motion.p>
      )}
    </div>
  );
}
