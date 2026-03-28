"use client";

import { motion } from "framer-motion";
import { X, ExternalLink, Award } from "lucide-react";
import type { Skill } from "@/app/lib/constants";
import {
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  getProficiencyLabel,
} from "@/app/lib/skillUtils";
import { PROJECTS, SKILLS } from "@/app/lib/constants";

interface SkillModalProps {
  skill: Skill | null;
  onClose: () => void;
  onSkillClick?: (skill: Skill) => void;
}

export function SkillModal({
  skill,
  onClose,
  onSkillClick,
}: SkillModalProps) {
  if (!skill) return null;

  const categoryColor = CATEGORY_COLORS[skill.category];
  const projectDetails = skill.projects
    .map((projId) => PROJECTS.find((p) => p.id === projId))
    .filter(Boolean);
  const relatedSkillDetails = skill.relatedSkills
    ?.map((skillId) => SKILLS.find((s) => s.id === skillId))
    .filter(Boolean);

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed inset-x-4 bottom-4 top-4 z-50 mx-auto max-w-3xl overflow-y-auto rounded-2xl border border-white/20 bg-gradient-to-br from-bg-primary to-bg-secondary p-6 shadow-2xl lg:inset-x-auto lg:left-1/2 lg:top-1/2 lg:max-h-[80vh] lg:-translate-x-1/2 lg:-translate-y-1/2"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-white/10 p-2 transition-all hover:bg-white/20"
          aria-label="Close modal"
        >
          <X className="h-5 w-5 text-white" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="mb-3 flex items-center gap-3">
            <div
              className="h-4 w-4 rounded-full"
              style={{ backgroundColor: categoryColor }}
            />
            <span className="text-sm font-semibold text-gray-400">
              {CATEGORY_LABELS[skill.category]}
            </span>
          </div>
          <h2 className="mb-2 text-3xl font-bold text-white lg:text-4xl">
            {skill.name}
          </h2>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-accent-primary" />
              <span className="text-gray-300">
                {getProficiencyLabel(skill.proficiency)}
              </span>
            </div>
            <div className="text-gray-400">•</div>
            <div className="text-gray-300">
              {skill.yearsOfExperience} years experience
            </div>
          </div>
        </div>

        {/* Projects section */}
        {projectDetails.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-3 text-lg font-bold text-white">
              Used in Projects
            </h3>
            <div className="space-y-3">
              {projectDetails.map((project) => (
                <a
                  key={project?.id}
                  href={`#projects`}
                  onClick={onClose}
                  className="group block rounded-lg border border-white/10 bg-white/5 p-4 transition-all hover:border-accent-primary/50 hover:bg-white/10"
                >
                  <div className="mb-1 flex items-center justify-between">
                    <h4 className="font-semibold text-white group-hover:text-accent-primary">
                      {project?.title}
                    </h4>
                    <ExternalLink className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-accent-primary" />
                  </div>
                  <p className="text-sm text-gray-400">{project?.brief}</p>
                  {project?.metrics && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {Object.entries(project.metrics)
                        .slice(0, 2)
                        .map(([key, value]) => {
                          const displayValue = typeof value === 'object' && value !== null 
                            ? (value as { label?: string; value?: string }).label || (value as { label?: string; value?: string }).value || String(value)
                            : String(value);
                          return (
                            <span
                              key={key}
                              className="rounded-full bg-accent-primary/10 px-2 py-0.5 text-xs text-accent-primary"
                            >
                              {displayValue}
                            </span>
                          );
                        })}
                    </div>
                  )}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Related skills section */}
        {relatedSkillDetails && relatedSkillDetails.length > 0 && (
          <div>
            <h3 className="mb-3 text-lg font-bold text-white">
              Related Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {relatedSkillDetails.map((relatedSkill) => {
                if (!relatedSkill) return null;
                const relatedColor = CATEGORY_COLORS[relatedSkill.category];
                return (
                  <button
                    key={relatedSkill.id}
                    onClick={() => {
                      onSkillClick?.(relatedSkill);
                    }}
                    className="group flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 transition-all hover:border-white/40 hover:bg-white/10"
                  >
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: relatedColor }}
                    />
                    <span className="text-sm font-medium text-white group-hover:text-accent-primary">
                      {relatedSkill.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty state */}
        {projectDetails.length === 0 && !relatedSkillDetails?.length && (
          <div className="py-8 text-center text-gray-400">
            <p>No additional details available for this skill.</p>
          </div>
        )}
      </motion.div>
    </>
  );
}
