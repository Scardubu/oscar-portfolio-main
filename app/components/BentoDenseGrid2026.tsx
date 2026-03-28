"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Github, Sparkles } from "lucide-react";

import { PROJECTS } from "@/app/lib/constants";
import { LiquidGlassCard } from "@/components/ui/LiquidGlassCard";

const PROJECT_STORY: Record<
  string,
  {
    eyebrow: string;
    thesis: string;
    problem: string;
    context: string;
    approach: string;
    keyDecision: string;
    tradeoff: string;
    outcome: string;
    accent: "cyan" | "violet" | "teal";
    span: string;
  }
> = {
  sabiscore: {
    eyebrow: "Flagship AI platform",
    thesis: "A sports intelligence product shaped around fast, trustworthy decision-making.",
    problem: "Sports prediction products often create noise instead of confidence when users need a clear call.",
    context: "The challenge was to make live model output feel usable, not overwhelming, in a time-sensitive setting.",
    approach: "Built a full-stack ML product with calm interface language, explicit confidence framing, and platform-grade responsiveness.",
    keyDecision: "Prioritized legibility and product trust over exposing every raw model detail in the primary flow.",
    tradeoff: "Chose a narrower, more opinionated surface so the experience stayed clear under pressure.",
    outcome: "The result feels like a real product surface rather than an ML experiment dressed up for demo day.",
    accent: "cyan",
    span: "lg:col-span-7",
  },
  hashablanca: {
    eyebrow: "Privacy-first infrastructure",
    thesis: "A token distribution system where privacy requirements and operator clarity were treated as one design problem.",
    problem: "Blockchain distribution workflows can become brittle, opaque, and risky once privacy and multi-chain coordination enter the picture.",
    context: "Operators needed a workflow that respected cryptographic constraints without turning everyday use into friction.",
    approach: "Designed a backend-heavy orchestration layer with a clearer operating surface for reviewing, validating, and executing distribution steps.",
    keyDecision: "Made operator confidence the product goal, not just successful chain execution in the background.",
    tradeoff: "Accepted more deliberate workflow steps to reduce ambiguity around privacy, compliance, and execution state.",
    outcome: "The system communicates disciplined engineering judgment in a domain where trust is usually hard to earn.",
    accent: "violet",
    span: "lg:col-span-5",
  },
  "ai-consulting": {
    eyebrow: "Advisory and integration",
    thesis: "A consulting pattern for teams that need AI work translated into production decisions, not just prototypes.",
    problem: "Many teams know they should use AI, but not how to turn that ambition into a reliable product or workflow.",
    context: "The work required technical depth, stakeholder translation, and a path from experimentation to something worth maintaining.",
    approach: "Scoped the problem, mapped where AI actually changed the workflow, and translated that into architecture, interface, and implementation choices.",
    keyDecision: "Kept the work grounded in operating reality rather than leading with novelty or model hype.",
    tradeoff: "Moved slower upfront on framing so later engineering decisions stayed aligned with the business case.",
    outcome: "This proves an ability to guide technical direction while keeping communication clear for non-specialist stakeholders.",
    accent: "teal",
    span: "lg:col-span-5",
  },
};

export function BentoDenseGrid2026() {
  return (
    <div className="bento-dense-2026">
      {PROJECTS.filter((project) => project.featured).map((project, index) => {
        const story = PROJECT_STORY[project.id];

        if (!story) return null;

        return (
          <motion.article
            key={project.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: index * 0.08 }}
            className={story.span}
          >
            <LiquidGlassCard
              variant={story.accent}
              interactive
              className="bento-2026-card h-full"
            >
              <div className="bento-2026-inner">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-3">
                    <p className="bento-2026-eyebrow">{story.eyebrow}</p>
                    <h3 className="text-balance text-2xl font-semibold tracking-tight text-[var(--text-primary)] md:text-3xl">
                      {project.title}
                    </h3>
                  </div>
                  <span className="bento-2026-icon">
                    <Sparkles className="h-4 w-4" />
                  </span>
                </div>

                <p className="text-pretty text-sm leading-7 text-[var(--text-secondary)] md:text-base">
                  {story.thesis}
                </p>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="bento-2026-panel">
                    <p className="bento-2026-label">Problem</p>
                    <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                      {story.problem}
                    </p>
                  </div>
                  <div className="bento-2026-panel">
                    <p className="bento-2026-label">Context</p>
                    <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                      {story.context}
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="bento-2026-panel">
                    <p className="bento-2026-label">Approach</p>
                    <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                      {story.approach}
                    </p>
                  </div>
                  <div className="bento-2026-panel">
                    <p className="bento-2026-label">Key decision</p>
                    <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                      {story.keyDecision}
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="bento-2026-panel">
                    <p className="bento-2026-label">Tradeoff</p>
                    <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                      {story.tradeoff}
                    </p>
                  </div>
                  <div className="bento-2026-panel">
                    <p className="bento-2026-label">Outcome</p>
                    <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                      {story.outcome}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {project.techStack.slice(0, 5).map((tech) => (
                    <span key={`${project.id}-${tech}`} className="bento-2026-chip">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  {project.links.demo ? (
                    <a
                      href={project.links.demo}
                      target="_blank"
                      rel="noreferrer"
                      className="bento-2026-cta-primary"
                    >
                      Experience it live
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  ) : null}
                  {project.links.github ? (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noreferrer"
                      className="bento-2026-cta-secondary"
                    >
                      Inspect the code
                      <Github className="h-4 w-4" />
                    </a>
                  ) : null}
                </div>
              </div>
            </LiquidGlassCard>
          </motion.article>
        );
      })}

      <motion.aside
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.24 }}
        className="lg:col-span-7"
      >
        <LiquidGlassCard variant="cyan" interactive className="bento-2026-card h-full">
          <div className="bento-2026-inner justify-between">
            <div className="space-y-3">
              <p className="bento-2026-eyebrow">What the work proves</p>
              <h3 className="text-balance text-2xl font-semibold tracking-tight text-[var(--text-primary)] md:text-3xl">
                The portfolio is easiest to trust when the work shows the decisions behind the polish.
              </h3>
              <p className="text-sm leading-7 text-[var(--text-secondary)] md:text-base">
                These projects are framed to answer the questions strong hiring teams actually ask: can he frame the problem, make tradeoffs, and ship something that feels production-ready?
              </p>
            </div>

            <div className="bento-2026-panel">
              <p className="bento-2026-label">Shareable takeaway</p>
              <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                Oscar is a product-minded AI engineer who can own architecture, interface quality, and execution without creating confusion around the work.
              </p>
            </div>
          </div>
        </LiquidGlassCard>
      </motion.aside>
    </div>
  );
}
