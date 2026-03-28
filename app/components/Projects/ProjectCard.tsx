"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";
import type { Project } from "@/app/lib/constants";
import { SabiScoreDemo } from "./SabiScoreDemo";
import { HashablancaDemo } from "./HashablancaDemo";
import { AIConsultingDemo } from "./AIConsultingDemo";
import { GitHubWidget } from "./GitHubWidget";
import { trackEvent } from "@/app/lib/analytics";

interface ProjectCardProps {
  project: Project;
  index: number;
  onOpenModal?: (project: Project) => void;
}

export function ProjectCard({ project, index, onOpenModal }: ProjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const impactSection = useMemo(
    () =>
      project.caseStudy?.sections.find((section) =>
        section.title.toLowerCase().includes("impact")
      ),
    [project.caseStudy]
  );

  // PRD Card-002: Render appropriate demo component based on demoType
  const renderDemo = () => {
    if (!showDemo) return null;

    switch (project.demoType) {
      case "chart":
        return <SabiScoreDemo />;
      case "privacy":
        return <HashablancaDemo />;
      case "llm":
        return <AIConsultingDemo />;
      default:
        return null;
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="group relative flex flex-col rounded-2xl glass-panel p-6 transition-all duration-300 hover:border-accent-primary/40 hover:premium-glow hover:scale-[1.01] lg:p-8"
    >
      {/* PRD Card-001: Title + Brief */}
      <div className="mb-6">
        <h3 className="mb-3 text-2xl font-bold tracking-tight text-white transition-colors group-hover:text-accent-primary lg:text-3xl lg:tracking-wide">
          {project.title}
        </h3>
        <p className="text-base leading-relaxed text-gray-300 lg:text-lg">
          {project.brief}
        </p>
      </div>

      {/* PRD Card-001: Tech Stack Badges */}
      <div className="mb-6 flex flex-wrap gap-2">
        {project.techStack.map((tech) => (
          <span
            key={tech}
            className="rounded-full border border-accent-primary/30 bg-accent-primary/10 px-4 py-1.5 text-sm font-medium text-accent-primary transition-colors hover:border-accent-primary/50 hover:bg-accent-primary/20"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* PRD Card-001: Key Metrics Grid */}
      <div className="mb-8 grid grid-cols-2 gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-5 lg:grid-cols-3">
        {project.metrics.map((metric) => (
          <div key={metric.label} className="group/metric">
            <div className="mb-1 font-mono text-2xl font-bold text-accent-primary drop-shadow-[0_0_8px_rgba(0,217,255,0.3)] lg:text-3xl">
              {metric.value}
            </div>
            <div className="text-xs font-medium uppercase tracking-wider text-gray-400 lg:text-sm">
              {metric.label}
            </div>
            {metric.description && (
              <div className="mt-2 hidden text-xs text-gray-500 group-hover/metric:block">
                {metric.description}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* PRD Card-001: Dual CTAs + PRD Card-007: GitHub Widget */}
      <div className="mb-8 flex flex-wrap items-center gap-4">
        <button
          onClick={() => {
            trackEvent("Projects", "Open Modal", project.id);
            onOpenModal?.(project);
          }}
          className="inline-flex items-center gap-2 rounded-lg border-2 border-cyan-400/50 bg-cyan-400/10 px-8 py-4 font-bold text-cyan-400 transition-all hover:border-cyan-400 hover:bg-cyan-400/20 hover:shadow-lg hover:shadow-cyan-400/20"
        >
          View Full Case Study
          <ArrowRight className="h-5 w-5" />
        </button>
        {project.links.demo && (
          <a
            href={project.links.demo}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("Projects", "View Demo", project.id)}
            className="inline-flex items-center gap-2 rounded-lg bg-[#00d9ff] px-8 py-4 font-bold text-black shadow-[0_0_20px_rgba(0,217,255,0.3)] transition-all hover:bg-[#00d9ff]/90 hover:shadow-[0_0_30px_rgba(0,217,255,0.5)] hover:scale-105"
          >
            View Live Demo
            <ExternalLink className="h-5 w-5" />
          </a>
        )}
        {project.links.github && (
          <a
            href={project.links.github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("Projects", "View Repo", project.id)}
            className="inline-flex items-center gap-2 rounded-lg border-2 border-white/20 bg-white/5 px-8 py-4 font-bold text-white transition-all hover:border-accent-primary/50 hover:bg-white/10 hover:text-accent-primary hover:shadow-[0_0_20px_rgba(0,217,255,0.15)]"
          >
            See Code
            <Github className="h-5 w-5" />
          </a>
        )}
        {project.links.caseStudy && (
          <button
            onClick={() => {
              trackEvent("Projects", "Toggle Case Study", project.id);
              setIsExpanded(!isExpanded);
            }}
            className="inline-flex items-center gap-2 rounded-lg border-2 border-white/20 bg-white/5 px-8 py-4 font-bold text-white transition-all hover:border-accent-primary/50 hover:bg-white/10 hover:text-accent-primary"
          >
            {isExpanded ? "Hide" : "Read"} Case Study
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      {/* PRD Card-007: GitHub Integration Widget */}
      {project.githubRepo && <GitHubWidget repo={project.githubRepo} />}

      {/* PRD Card-002: Interactive Demo Toggle */}
      {project.demoType && (
        <div className="mb-4">
          <button
            onClick={() => setShowDemo(!showDemo)}
            className="w-full rounded-lg border-2 border-accent-primary/30 bg-accent-primary/5 px-4 py-3 font-semibold text-accent-primary transition-all hover:border-accent-primary/60 hover:bg-accent-primary/15 hover:shadow-lg hover:shadow-accent-primary/20"
          >
            {showDemo ? "Hide" : "View"} Interactive Demo
          </button>
        </div>
      )}

      {/* PRD Card-002: Embedded Mini-Demo */}
      {renderDemo()}

      {/* PRD Card-008: Expandable Technical Implementation */}
      {isExpanded && project.caseStudy && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-6 space-y-6 rounded-xl border border-white/10 bg-white/[0.02] p-6"
        >
          {project.caseStudy.summary && (
            <p className="text-base text-gray-200">
              {project.caseStudy.summary}
            </p>
          )}
          {project.caseStudy.sections.map((section) => (
            <div key={`${project.id}-${section.title}`} className="space-y-3">
              <h4 className="text-lg font-semibold text-white">
                {section.title}
              </h4>
              <ul className="space-y-2 text-sm text-gray-300 lg:text-base">
                {section.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-2">
                    <span className="text-accent-primary">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {impactSection && (
            <div className="rounded-lg border border-accent-primary/30 bg-accent-primary/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-accent-primary">
                Impact Snapshot
              </p>
              <ul className="mt-2 space-y-2 text-sm text-white/90">
                {impactSection.bullets.map((bullet) => (
                  <li key={`impact-${bullet}`} className="flex gap-2">
                    <span className="text-green-400">✓</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}
    </motion.article>
  );
}
