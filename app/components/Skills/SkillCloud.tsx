"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { Skill } from "@/app/lib/constants";
import {
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  getProficiencyLabel,
} from "@/app/lib/skillUtils";
import { PROJECTS } from "@/app/lib/constants";

interface SkillCloudProps {
  skills: Skill[];
  onSkillClick?: (skill: Skill) => void;
  exploredSkills?: Set<string>;
}

export function SkillCloud({ skills, onSkillClick, exploredSkills = new Set() }: SkillCloudProps) {
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);

  const toggleSkill = (skillId: string) => {
    setExpandedSkill(expandedSkill === skillId ? null : skillId);
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {skills.map((skill, index) => {
        const isExpanded = expandedSkill === skill.id;
        const isExplored = exploredSkills.has(skill.id);
        const categoryColor = CATEGORY_COLORS[skill.category];
        const projectNames = skill.projects
          .map((projId) => PROJECTS.find((p) => p.id === projId)?.title)
          .filter(Boolean);

        return (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.03 }}
            className={`rounded-xl border p-4 transition-all hover:border-white/20 hover:bg-white/10 ${
              isExplored
                ? "border-cyan-500/30 bg-cyan-500/5"
                : "border-white/10 bg-white/5"
            }`}
          >
            {/* Skill header */}
            <button
              onClick={() => {
                toggleSkill(skill.id);
                onSkillClick?.(skill);
              }}
              className="flex w-full items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                {/* Category indicator */}
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: categoryColor }}
                />
                <div>
                  <h4 className="font-semibold text-white">{skill.name}</h4>
                  <p className="text-xs text-gray-400">
                    {CATEGORY_LABELS[skill.category]} •{" "}
                    {getProficiencyLabel(skill.proficiency)}
                  </p>
                </div>
              </div>
              {isExpanded ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </button>

            {/* Expanded details */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-3 space-y-2 border-t border-white/10 pt-3 text-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Experience:</span>
                    <span className="font-semibold text-white">
                      {skill.yearsOfExperience} years
                    </span>
                  </div>
                  {projectNames.length > 0 && (
                    <div>
                      <span className="text-gray-400">Used in:</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {projectNames.map((name) => (
                          <span
                            key={name}
                            className="rounded-full bg-accent-primary/10 px-2 py-0.5 text-xs text-accent-primary"
                          >
                            {name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {skill.relatedSkills && skill.relatedSkills.length > 0 && (
                    <div>
                      <span className="text-gray-400">Related:</span>
                      <div className="mt-1 text-xs text-gray-300">
                        {skill.relatedSkills.slice(0, 3).join(", ")}
                        {skill.relatedSkills.length > 3 &&
                          ` +${skill.relatedSkills.length - 3} more`}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}

