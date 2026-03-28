'use client';

import { useState } from "react";
import { Workflow, Zap, Database, Cpu } from "lucide-react";

type IconType = typeof Workflow;

interface Pattern {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  icon: IconType;
  projectExample: string;
}

const patterns: Pattern[] = [
  {
    id: "realtime-api",
    name: "Real-time Prediction API",
    description: "Sub-200ms inference with Redis caching and FastAPI",
    technologies: ["FastAPI", "Redis", "Docker", "PostgreSQL", "XGBoost", "Vercel"],
    icon: Zap,
    projectExample: "SabiScore prediction endpoints (87ms avg latency)",
  },
  {
    id: "ensemble-system",
    name: "Ensemble ML System",
    description: "Multiple models + meta-learner for 71% accuracy",
    technologies: ["XGBoost", "LightGBM", "scikit-learn", "FastAPI", "PostgreSQL", "Docker"],
    icon: Workflow,
    projectExample: "SabiScore ensemble model (71% accuracy)",
  },
  {
    id: "batch-pipeline",
    name: "Batch ETL + Training",
    description: "Automated retraining with monitoring and validation",
    technologies: ["Python", "PostgreSQL", "Docker", "GitHub Actions", "FastAPI"],
    icon: Database,
    projectExample: "Automated model retraining & validation",
  },
  {
    id: "full-stack-app",
    name: "Full-Stack ML App",
    description: "End-to-end product from data to responsive UI",
    technologies: ["React", "Next.js", "Tailwind", "FastAPI", "PostgreSQL", "Vercel"],
    icon: Cpu,
    projectExample: "SabiScore, Hashablanca complete products",
  },
];

export function ProductionPatternsVisualization() {
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);

  return (
    <div className="glass-panel rounded-2xl border border-white/10 p-6 shadow-xl">
      <h3 className="text-2xl font-bold text-white">Production ML Patterns</h3>
      <p className="mt-2 text-sm text-gray-300">
        Common architectures I have built end-to-end. Hover to see the tech stack for each pattern.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {patterns.map((pattern) => {
          const Icon = pattern.icon;
          const isSelected = selectedPattern === pattern.id;
          return (
            <div
              key={pattern.id}
              onMouseEnter={() => setSelectedPattern(pattern.id)}
              onMouseLeave={() => setSelectedPattern(null)}
              className={`relative cursor-pointer rounded-xl border-2 p-5 transition-all duration-200 ${
                isSelected
                  ? "border-accent-primary bg-accent-primary/10 shadow-lg shadow-accent-primary/30"
                  : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`rounded-lg p-2 ${
                    isSelected ? "bg-accent-primary/20" : "bg-white/10"
                  }`}
                >
                  <Icon className={`h-6 w-6 ${isSelected ? "text-accent-primary" : "text-white"}`} />
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-semibold text-white">{pattern.name}</h4>
                  <p className="text-sm text-gray-300">{pattern.description}</p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {pattern.technologies.map((tech) => (
                  <span
                    key={tech}
                    className={`rounded-full px-2 py-1 text-xs font-semibold transition ${
                      isSelected
                        ? "bg-accent-primary text-bg-primary shadow shadow-accent-primary/50"
                        : "bg-white/10 text-gray-200"
                    }`}
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {isSelected && (
                <div className="mt-3 text-xs font-medium text-accent-primary">
                  This pattern is used in: {pattern.projectExample}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-center">
        <a
          href="#projects"
          className="inline-flex items-center gap-2 text-sm font-semibold text-accent-primary hover:text-accent-primary/80"
        >
          See these patterns in real projects →
        </a>
      </div>
    </div>
  );
}
