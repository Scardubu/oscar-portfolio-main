"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PROJECTS } from "@/app/lib/constants";
import type { Project } from "@/app/lib/constants";
import { ProjectCard } from "./ProjectCard";
import { ProjectModal } from "./ProjectModal";

export function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  return (
    <section
      id="projects"
      aria-label="Projects showcase"
      className="relative min-h-screen w-full bg-gradient-to-b from-bg-primary via-bg-secondary to-bg-primary px-6 py-20 lg:px-12 lg:py-32"
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
          Featured <span className="text-gradient-accent">Builds</span>
        </h2>
        <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-300 lg:text-xl xl:text-2xl">
          Real products where I owned the full stack&mdash;from data pipelines
          and ML models to APIs and frontends. Everything here shipped to real
          users, not just ran in a notebook.
        </p>
      </motion.div>

      {/* Projects grid - PRD: 3 columns desktop, stacked mobile */}
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-1 lg:gap-12">
        {PROJECTS.filter((p) => p.featured).map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            onOpenModal={setSelectedProject}
          />
        ))}
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mx-auto mt-16 max-w-7xl text-center"
      >
        <p className="mb-6 text-gray-300">
          Have a production ML or AI product in mind and want a builder who can
          own it end-to-end?
        </p>
        <a
          href="#contact"
          className="inline-flex items-center gap-2 rounded-lg bg-accent-primary px-8 py-4 font-bold text-black shadow-[0_0_20px_rgba(0,217,255,0.3)] transition-all hover:bg-accent-primary/90 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(0,217,255,0.5)]"
        >
          Let&apos;s talk about your use case
        </a>
      </motion.div>

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={selectedProject !== null}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
