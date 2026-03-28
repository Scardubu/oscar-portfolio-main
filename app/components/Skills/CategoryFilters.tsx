"use client";

import { motion } from "framer-motion";
import type { Skill } from "@/app/lib/constants";
import { CATEGORY_COLORS, CATEGORY_LABELS } from "@/app/lib/skillUtils";

interface CategoryFiltersProps {
  activeCategory: Skill["category"] | "all";
  onCategoryChange: (category: Skill["category"] | "all") => void;
}

const CATEGORIES: Array<Skill["category"] | "all"> = [
  "all",
  "ml",
  "backend",
  "frontend",
  "devops",
  "blockchain",
];

export function CategoryFilters({
  activeCategory,
  onCategoryChange,
}: CategoryFiltersProps) {
  return (
    <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
      {CATEGORIES.map((category) => {
        const isActive = activeCategory === category;
        const label = category === "all" ? "All Skills" : CATEGORY_LABELS[category];
        const color = category === "all" ? "#FFFFFF" : CATEGORY_COLORS[category];

        return (
          <motion.button
            key={category}
            onClick={() => onCategoryChange(category)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative rounded-full px-6 py-2.5 font-semibold transition-all ${
              isActive
                ? "text-black shadow-lg"
                : "border border-white/20 bg-white/5 text-white hover:border-white/40 hover:bg-white/10"
            }`}
            style={{
              backgroundColor: isActive ? color : undefined,
            }}
          >
            {/* Active indicator dot */}
            {isActive && category !== "all" && (
              <motion.span
                layoutId="activeCategory"
                className="absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-white"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            {label}
          </motion.button>
        );
      })}
    </div>
  );
}
