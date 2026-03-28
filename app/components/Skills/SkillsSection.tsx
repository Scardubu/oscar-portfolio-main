"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Skill } from "@/app/lib/constants";
import { SKILLS } from "@/app/lib/constants";
import { TechGraph } from "./TechGraph";
import { SkillCloud } from "./SkillCloud";
import { CategoryFilters } from "./CategoryFilters";
import { Certifications } from "./Certifications";
import { SkillModal } from "./SkillModal";
import { trackEvent } from "@/app/lib/analytics";

const EXPLORED_SKILLS_KEY = "oscar-portfolio-explored-skills";

export function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState<
    Skill["category"] | "all"
  >("all");
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [exploredSkills, setExploredSkills] = useState<Set<string>>(new Set());

  // Prevent hydration mismatch by waiting for mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load explored skills from localStorage on mount
  useEffect(() => {
    if (!mounted) return;
    try {
      const stored = localStorage.getItem(EXPLORED_SKILLS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as string[];
        setExploredSkills(new Set(parsed));
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [mounted]);

  // Save explored skills to localStorage
  const saveExploredSkills = useCallback((skills: Set<string>) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(EXPLORED_SKILLS_KEY, JSON.stringify([...skills]));
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // PRD: Mobile detection for graph/grid toggle (<768px)
  useEffect(() => {
    if (!mounted) return;
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [mounted]);

  // Filter skills by category
  const filteredSkills =
    activeCategory === "all"
      ? SKILLS
      : SKILLS.filter((skill) => skill.category === activeCategory);

  const handleSkillClick = (skill: Skill) => {
    setSelectedSkill(skill);
    
    // Track exploration
    if (!exploredSkills.has(skill.id)) {
      const newExplored = new Set(exploredSkills);
      newExplored.add(skill.id);
      setExploredSkills(newExplored);
      saveExploredSkills(newExplored);
      trackEvent("Skills", "Explore", skill.name);
    }
  };

  const handleCloseModal = () => {
    setSelectedSkill(null);
  };

  const handleResetExploration = () => {
    setExploredSkills(new Set());
    if (typeof window !== "undefined") {
      localStorage.removeItem(EXPLORED_SKILLS_KEY);
    }
    trackEvent("Skills", "ResetExploration", "all");
  };

  const explorationProgress = Math.round((exploredSkills.size / SKILLS.length) * 100);

  return (
    <section
      id="skills"
      aria-label="Skills and expertise"
      className="relative min-h-screen w-full bg-linear-to-b from-bg-primary via-bg-secondary to-bg-primary px-6 py-20 lg:px-12 lg:py-32"
    >
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mx-auto mb-16 max-w-7xl text-center"
      >
        <h2 className="mb-6 text-4xl font-extrabold tracking-tight text-white lg:text-5xl xl:text-6xl">
          Technical <span className="text-gradient-accent">Stack</span>
        </h2>
        <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-300 lg:text-xl xl:text-2xl">
          The tools I use to ship ML products&mdash;from model training to
          production APIs. Click any node to explore how I&apos;ve applied it.
        </p>

        {/* Exploration Progress */}
        {exploredSkills.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mt-6 flex max-w-md items-center gap-4"
          >
            <div className="flex-1">
              <div className="mb-1 flex items-center justify-between text-xs text-gray-400">
                <span>Skills explored</span>
                <span>{exploredSkills.size} / {SKILLS.length}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${explorationProgress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                />
              </div>
            </div>
            <button
              onClick={handleResetExploration}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-400 transition-colors hover:border-white/20 hover:text-white"
            >
              Reset
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* Category filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mx-auto max-w-7xl"
      >
        <CategoryFilters
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      </motion.div>

      {/* Visualization: TechGraph (desktop) or SkillCloud (mobile) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mx-auto max-w-7xl"
      >
        {isMobile ? (
          <SkillCloud skills={filteredSkills} onSkillClick={handleSkillClick} exploredSkills={exploredSkills} />
        ) : (
          <TechGraph skills={filteredSkills} onSkillClick={handleSkillClick} exploredSkills={exploredSkills} />
        )}
      </motion.div>

      {/* Certifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Certifications />
      </motion.div>

      {/* Skill Modal (PRD Skill-003: Tech Stack Explorer) */}
      <AnimatePresence>
        {selectedSkill && (
          <SkillModal
            skill={selectedSkill}
            onClose={handleCloseModal}
            onSkillClick={handleSkillClick}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
