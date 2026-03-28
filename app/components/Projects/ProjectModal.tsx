"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Github, TrendingUp, Users, Activity, Zap } from "lucide-react";
import { useMemo } from "react";
import type { Project } from "@/app/lib/constants";
import { trackEvent } from "@/app/lib/analytics";

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

// Map metrics to appropriate icons
const getMetricIcon = (label: string) => {
  if (label.includes("User")) return Users;
  if (label.includes("Accuracy") || label.includes("ROI") || label.includes("Confidence")) return TrendingUp;
  if (label.includes("Uptime") || label.includes("Network") || label.includes("Chain")) return Activity;
  return Zap;
};

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  const impactSection = useMemo(
    () =>
      project?.caseStudy?.sections.find((section) =>
        section.title.toLowerCase().includes("impact")
      ),
    [project?.caseStudy]
  );

  const otherSections = useMemo(
    () =>
      project?.caseStudy?.sections.filter((section) => section !== impactSection) ?? [],
    [project?.caseStudy, impactSection]
  );

  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
              {/* Header */}
              <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-800 bg-slate-900/95 p-6 backdrop-blur-sm">
                <div>
                  <h2 className="mb-2 text-3xl font-bold text-white">
                    {project.title}
                  </h2>
                  <p className="text-slate-400">{project.brief}</p>
                </div>
                <button
                  onClick={() => {
                    trackEvent("Projects", "Close Modal", project.id);
                    onClose();
                  }}
                  className="text-slate-400 transition-colors hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Content */}
              <div className="space-y-8 p-6">
                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {project.metrics.map((metric, i) => {
                    const Icon = getMetricIcon(metric.label);
                    return (
                      <div
                        key={i}
                        className="rounded-lg border border-slate-700 bg-slate-800/50 p-4"
                      >
                        <Icon className="mb-2 h-5 w-5 text-cyan-400" />
                        <div className="mb-1 text-2xl font-bold text-white">
                          {metric.value}
                        </div>
                        <div className="text-sm text-slate-400">{metric.label}</div>
                        {metric.description && (
                          <div className="mt-2 text-xs text-slate-500">
                            {metric.description}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Tech Stack */}
                <div>
                  <h3 className="mb-3 text-xl font-semibold text-white">
                    Technology Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech, i) => (
                      <span
                        key={i}
                        className="rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Case Study Content */}
                {project.caseStudy && (
                  <div className="space-y-6">
                    {project.caseStudy.summary && (
                      <p className="text-base text-slate-300">
                        {project.caseStudy.summary}
                      </p>
                    )}
                    {otherSections.map((section) => (
                      <div key={`${project.id}-modal-${section.title}`}>
                        <h3 className="mb-3 text-xl font-semibold text-white">
                          {section.title}
                        </h3>
                        <ul className="space-y-3 text-slate-300">
                          {section.bullets.map((bullet) => (
                            <li key={bullet} className="flex gap-3">
                              <span className="mt-1 text-cyan-400">•</span>
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {/* Business Impact */}
                {impactSection && (
                  <div>
                    <h3 className="mb-3 text-xl font-semibold text-white">
                      Business Impact
                    </h3>
                    <ul className="space-y-3 text-slate-300">
                      {impactSection.bullets.map((bullet) => (
                        <li key={`modal-impact-${bullet}`} className="flex gap-3">
                          <span className="text-green-400">✓</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* CTAs */}
                <div className="flex flex-wrap gap-4 pt-4">
                  {project.links.demo && (
                    <a
                      href={project.links.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackEvent("Projects", "View Demo", project.id)}
                      className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-105 hover:shadow-blue-500/40"
                    >
                      <ExternalLink className="h-5 w-5" />
                      View Live Demo
                    </a>
                  )}
                  {project.links.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackEvent("Projects", "View Repo", project.id)}
                      className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-6 py-3 font-semibold text-slate-200 transition-all hover:border-slate-600 hover:bg-slate-700"
                    >
                      <Github className="h-5 w-5" />
                      View Source Code
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
