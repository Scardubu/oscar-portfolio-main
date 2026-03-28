"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

export interface ProjectDecision {
  chose: string;
  rejected: string;
  reason: string;
}

export interface Project {
  id: string;
  title: string;
  tags: string[];
  oneLiner: string;
  context: string;
  problem: string;
  approach: string;
  decisions: ProjectDecision[];
  outcome: string;
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  span?: "wide" | "standard" | "tall";
}

export const PROJECTS: Project[] = [
  {
    id: "sabiscore",
    title: "SabiScore",
    tags: ["Next.js", "Python", "Embeddings", "Real-time", "Production"],
    oneLiner: "Live sports intelligence platform. Real-time insights, 24/7, embedding-based.",
    context: "Nigerian sports fans lacked access to reliable, timely analysis during high-traffic live events.",
    problem: "A retrieval system that holds coherence under concurrent load — without degrading to rule-based fallback under pressure.",
    approach: "Embedding-based retrieval pipeline with environment-scoped error boundaries. Health checks with graceful degradation paths designed before the first feature line.",
    decisions: [
      {
        chose: "Embedding-based semantic retrieval",
        rejected: "Rule-based keyword matching",
        reason: "Keyword matching breaks on edge cases and regional slang. Embeddings produce coherent results across the full query distribution.",
      },
      {
        chose: "Environment-scoped error boundaries at the data layer",
        rejected: "Global error handler at the UI layer",
        reason: "UI-layer handling hides the failure site. Scoped boundaries at data ingestion surface failures precisely and enable graceful partial rendering.",
      },
      {
        chose: "Edge-deployed health checks with fallback content",
        rejected: "Polling-based uptime monitoring only",
        reason: "Monitoring without fallback content produces dead surfaces during incidents. Fallback paths keep the product usable under pressure.",
      },
    ],
    outcome: "A production platform with observable operating constraints: real traffic, live concurrent sessions, and architecture that degrades cleanly instead of silently.",
    liveUrl: "https://sabiscore.vercel.app",
    githubUrl: "https://github.com/Scardubu/sabiscore",
    featured: true,
    span: "wide",
  },
  {
    id: "taxbridge",
    title: "TaxBridge",
    tags: ["Next.js", "TypeScript", "Fintech", "Full-stack"],
    oneLiner: "Cross-border tax compliance infrastructure for Nigerian remote workers.",
    context: "Nigerian professionals earning in foreign currencies navigate conflicting compliance requirements across jurisdictions.",
    problem: "Tax logic that differs per jurisdiction, per currency, per employment type — modelled as a single unified API surface.",
    approach: "Rules engine with jurisdiction-specific adapters, stateless edge computation, and UI that exposes confidence intervals rather than false precision.",
    decisions: [
      {
        chose: "Jurisdiction adapter pattern",
        rejected: "Monolithic rules table",
        reason: "A single table breaks when jurisdiction logic diverges. Adapters isolate changes and allow independent testing per region.",
      },
      {
        chose: "Confidence intervals in the UI",
        rejected: "Point estimates with disclaimers",
        reason: "Disclaimers don't communicate uncertainty. Ranges make the model's confidence visible and reduce user over-reliance.",
      },
    ],
    outcome: "A tax computation API with modular jurisdiction adapters, edge-deployed for latency-sensitive queries, and a UI that communicates model confidence instead of hiding it.",
    githubUrl: "https://github.com/Scardubu/taxbridge",
    span: "standard",
  },
];

// ── Case Study Modal ───────────────────────────────────────────

function CaseStudyModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const pRM = useReducedMotion();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby={`modal-${project.id}`}
      initial={pRM ? {} : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(10,10,15,0.82)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "clamp(16px,4vw,48px)", overflowY: "auto",
      }}
    >
      <motion.article
        initial={pRM ? {} : { opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        onClick={e => e.stopPropagation()}
        className="glass-surface glass-surface--heavy"
        style={{
          maxWidth: "700px", width: "100%",
          padding: "clamp(24px,4vw,48px)",
          position: "relative", maxHeight: "90dvh", overflowY: "auto",
        }}
      >
        <button
          aria-label="Close"
          onClick={onClose}
          className="focus-ring-branded"
          style={{
            position: "absolute", top: 20, right: 20,
            background: "none", border: "none",
            color: "var(--color-text-tertiary)", cursor: "pointer", padding: 8, borderRadius: 6,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 3L13 13M3 13L13 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
          {project.tags.map(t => (
            <span key={t} style={{
              fontFamily: "var(--font-mono)", fontSize: 11,
              color: "var(--color-accent-text)",
              background: "rgba(0,200,232,0.08)",
              padding: "4px 10px", borderRadius: 4,
              border: "1px solid rgba(0,200,232,0.2)",
            }}>{t}</span>
          ))}
        </div>

        <h2 id={`modal-${project.id}`} style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(24px,4vw,34px)", fontWeight: 800,
          letterSpacing: "-0.03em", color: "var(--color-text-primary)", marginBottom: 8,
        }}>{project.title}</h2>
        <p style={{ fontSize: 15, color: "var(--color-text-secondary)", marginBottom: 32 }}>{project.oneLiner}</p>

        {[
          { h: "Context", c: project.context },
          { h: "Problem", c: project.problem },
          { h: "Approach", c: project.approach },
        ].map(({ h, c }) => (
          <div key={h} style={{ marginBottom: 28 }}>
            <h3 style={{
              fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 500,
              letterSpacing: "0.12em", textTransform: "uppercase" as const,
              color: "var(--color-accent-text)", marginBottom: 10,
            }}>{h}</h3>
            <p style={{ fontSize: 15, color: "var(--color-text-secondary)", lineHeight: 1.7 }}>{c}</p>
          </div>
        ))}

        <div style={{ marginBottom: 28 }}>
          <h3 style={{
            fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 500,
            letterSpacing: "0.12em", textTransform: "uppercase" as const,
            color: "var(--color-accent-text)", marginBottom: 16,
          }}>Key Decisions</h3>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 14 }}>
            {project.decisions.map((d, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 10, padding: 16,
              }}>
                <div style={{ display: "flex", gap: 16, marginBottom: 10, flexWrap: "wrap" as const }}>
                  <span style={{ fontSize: 13, color: "var(--color-text-primary)", fontWeight: 600 }}>✓ {d.chose}</span>
                  <span style={{ fontSize: 13, color: "var(--color-text-tertiary)", textDecoration: "line-through" }}>✗ {d.rejected}</span>
                </div>
                <p style={{ fontSize: 14, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{d.reason}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 32 }}>
          <h3 style={{
            fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 500,
            letterSpacing: "0.12em", textTransform: "uppercase" as const,
            color: "var(--color-accent-text)", marginBottom: 10,
          }}>Outcome</h3>
          <p style={{ fontSize: 15, color: "var(--color-text-secondary)", lineHeight: 1.7 }}>{project.outcome}</p>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" as const }}>
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
              className="focus-ring-branded"
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "10px 20px",
                background: "var(--color-accent-primary)", color: "#0a0a0f",
                borderRadius: 8, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, textDecoration: "none",
              }}>
              Live Demo →
            </a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
              className="focus-ring-branded glass-surface glass-surface--light"
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "10px 20px", color: "var(--color-text-secondary)", fontSize: 14, textDecoration: "none",
              }}>
              GitHub →
            </a>
          )}
        </div>
      </motion.article>
    </motion.div>
  );
}

// ── ProjectCard ────────────────────────────────────────────────

export function ProjectCard({ project, onOpen }: { project: Project; onOpen: (p: Project) => void }) {
  const pRM = useReducedMotion();
  const colSpan = project.span === "wide" ? "span 8" : "span 4";

  return (
    <motion.article
      className="glass-surface bento-cell"
      style={{
        gridColumn: colSpan,
        cursor: "pointer",
        display: "flex", flexDirection: "column", gap: 12,
      }}
      whileHover={pRM ? {} : { y: -6, transition: { duration: 0.2, ease: "easeOut" } }}
      onClick={() => onOpen(project)}
      onKeyDown={e => { if (e.key === "Enter" || e.key === " ") onOpen(project); }}
      role="button"
      tabIndex={0}
      aria-label={`View case study: ${project.title}`}
    >
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {project.tags.slice(0, 4).map(t => (
          <span key={t} style={{
            fontFamily: "var(--font-mono)", fontSize: 10,
            color: "var(--color-accent-text)",
            background: "rgba(0,200,232,0.07)", padding: "3px 8px", borderRadius: 4,
            border: "1px solid rgba(0,200,232,0.15)",
          }}>{t}</span>
        ))}
        {project.featured && (
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 10, color: "#fff",
            background: "rgba(255,255,255,0.08)", padding: "3px 8px", borderRadius: 4,
          }}>Featured</span>
        )}
      </div>

      <h3 style={{
        fontFamily: "var(--font-display)",
        fontSize: "clamp(20px,2.5vw,28px)", fontWeight: 800,
        letterSpacing: "-0.03em", color: "var(--color-text-primary)", lineHeight: 1.2,
      }}>{project.title}</h3>

      <p style={{ fontSize: 14, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
        {project.oneLiner}
      </p>

      <div style={{
        marginTop: "auto", display: "flex", alignItems: "center", gap: 6,
        fontFamily: "var(--font-mono)", fontSize: 12,
        color: "var(--color-accent-text)", letterSpacing: "0.06em",
      }}>
        View decision log <span aria-hidden="true">→</span>
      </div>
    </motion.article>
  );
}

// ── BentoActiveGrid ────────────────────────────────────────────

export function BentoActiveGrid() {
  const [active, setActive] = useState<Project | null>(null);

  return (
    <section id="work" aria-labelledby="work-heading" style={{
      position: "relative", zIndex: 10,
      padding: "clamp(48px,8vw,96px) clamp(16px,4vw,48px)",
      maxWidth: "1200px", margin: "0 auto",
    }}>
      <h2 id="work-heading" style={{
        fontFamily: "var(--font-display)",
        fontSize: "clamp(28px,4vw,48px)", fontWeight: 800,
        letterSpacing: "-0.03em", color: "var(--color-text-primary)",
        marginBottom: "clamp(24px,4vw,48px)",
      }}>
        Work that shipped
      </h2>

      <div className="bento-dense">
        {PROJECTS.map(p => (
          <ProjectCard key={p.id} project={p} onOpen={setActive} />
        ))}
      </div>

      <AnimatePresence>
        {active && <CaseStudyModal project={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </section>
  );
}