"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, ChevronDown } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { cn } from "@/lib/utils";
import type { Project } from "@/data/projects";

export function ProjectCard({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);

  return (
    <GlassCard
      level={project.featured ? "full" : "medium"}
      chromatic={project.featured}
      className="p-6"
      data-project-id={project.id}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-white text-lg leading-tight">{project.title}</h3>
        <span className={cn(
          "text-xs px-2 py-1 rounded-full font-mono border",
          project.status === "live"     && "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
          project.status === "wip"      && "bg-amber-500/10 text-amber-400 border-amber-500/20",
          project.status === "archived" && "bg-zinc-800/60 text-zinc-500 border-zinc-700",
        )}>
          {project.status === "live" && (
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 mr-1.5
              animate-pulse" aria-hidden="true" />
          )}
          {project.status}
        </span>
      </div>

      <p className="text-sm text-zinc-300 mb-4 leading-relaxed">{project.tagline}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {project.tags.map(tag => (
          <span key={tag}
            className="text-xs px-2 py-1 rounded-md bg-zinc-800/60 text-zinc-400 font-mono">
            {tag}
          </span>
        ))}
      </div>

      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={`decisions-${project.id}`}
        className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300
          transition-colors"
      >
        {open ? "Hide decisions" : "Architecture decisions"}
        <ChevronDown
          className={cn("w-3 h-3 transition-transform duration-200", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={`decisions-${project.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-white/[0.08] space-y-4 text-sm">
              {project.context && (
                <div>
                  <span className="text-zinc-500 uppercase text-[10px] tracking-widest">
                    Context
                  </span>
                  <p className="text-zinc-300 mt-1 leading-relaxed">{project.context}</p>
                </div>
              )}
              {project.decisions?.map((d, i) => (
                <div key={i} className="pl-3 border-l border-cyan-500/30">
                  <p className="text-xs">
                    <span className="text-cyan-400">Chose: </span>{d.chosen}
                  </p>
                  <p className="text-xs text-zinc-500">
                    Rejected: {d.rejected} — {d.reason}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-4 mt-4 pt-3 border-t border-white/[0.05]">
        {project.demoUrl && (
          <a href={project.demoUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-cyan-400
              transition-colors">
            <ExternalLink className="w-3 h-3" aria-hidden="true" />View Live ↗
          </a>
        )}
        {project.repoUrl && (
          <a href={project.repoUrl} target="_blank" rel="noopener noreferrer"
            aria-label={`${project.title} source on GitHub`}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200
              transition-colors">
            <Github className="w-3 h-3" aria-hidden="true" />Source
          </a>
        )}
      </div>
    </GlassCard>
  );
}