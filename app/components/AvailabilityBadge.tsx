"use client";

import { motion } from "framer-motion";

interface AvailabilityBadgeProps {
  status?: "available" | "limited" | "unavailable";
  className?: string;
}

export function AvailabilityBadge({
  status = "available",
  className = "",
}: AvailabilityBadgeProps) {
  const statusConfig = {
    available: {
      color: "bg-green-500",
      text: "Available for new projects",
      pulse: true,
    },
    limited: {
      color: "bg-yellow-500",
      text: "Limited availability",
      pulse: true,
    },
    unavailable: {
      color: "bg-red-500",
      text: "Currently unavailable",
      pulse: false,
    },
  };

  const config = statusConfig[status];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm ${className}`}
    >
      <span className="relative flex h-3 w-3">
        {config.pulse && (
          <span
            className={`absolute inline-flex h-full w-full animate-ping rounded-full ${config.color} opacity-75`}
          />
        )}
        <span
          className={`relative inline-flex h-3 w-3 rounded-full ${config.color}`}
        />
      </span>
      <span className="text-sm font-medium text-gray-300">{config.text}</span>
    </motion.div>
  );
}
