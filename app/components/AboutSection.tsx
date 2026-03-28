"use client";

import { motion } from "framer-motion";
import { PROFILE, PORTFOLIO_METRICS } from "@/app/lib/constants";

export function AboutSection() {
  return (
    <section
      id="about"
      aria-label="About Oscar"
      className="relative w-full bg-gradient-to-b from-bg-secondary via-bg-primary to-bg-secondary px-6 py-20 lg:px-12 lg:py-32"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-12 lg:flex-row">
        {/* Left: Bio and narrative */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex-1 space-y-6"
        >
          <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl lg:text-5xl">
            About <span className="text-gradient-accent">Oscar</span>
          </h2>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent-primary">
            Full-Stack ML Engineer • Production AI Systems
          </p>
          <p className="max-w-2xl text-base leading-relaxed text-gray-300 md:text-lg">
            {PROFILE.bio.medium}
          </p>
          <div className="space-y-3 text-sm leading-relaxed text-gray-300 md:text-base">
            {PROFILE.bio.long.split("\n").map((paragraph, idx) => {
              const trimmed = paragraph.trim();
              if (!trimmed) return null;
              return (
                <p key={idx} className="whitespace-pre-line">
                  {trimmed}
                </p>
              );
            })}
          </div>
          <ul className="mt-4 space-y-2 text-sm text-gray-200 md:text-base">
            {PROFILE.highlights.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Right: Snapshot metrics */}
        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex-1"
        >
          <div className="glass-panel rounded-2xl p-6 md:p-8">
            <h3 className="mb-4 text-lg font-semibold text-white md:text-xl">
              At a Glance
            </h3>
            <p className="mb-6 text-sm text-gray-400 md:text-base">
              A quick snapshot of the systems I build and the scale they run at.
            </p>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-2">
              {PORTFOLIO_METRICS.map((metric) => (
                <div key={metric.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="mb-1 text-2xl font-bold text-accent-primary md:text-3xl">
                    {metric.value}
                  </div>
                  <div className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    {metric.label}
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {metric.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.aside>
      </div>
    </section>
  );
}
