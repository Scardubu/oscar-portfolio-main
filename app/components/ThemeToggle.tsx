"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";

interface ThemeToggleProps {
  variant?: "floating" | "inline";
  className?: string;
}

export function ThemeToggle({ variant = "floating", className }: ThemeToggleProps = {}) {
  // Initialize with default to prevent hydration mismatch
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Load theme preference after mount to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
    
    const stored = localStorage.getItem("theme");
    if (stored) {
      setIsDark(stored === "dark");
    } else {
      setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark, mounted]);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.classList.toggle("dark", newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  const baseClasses =
    variant === "floating"
      ? "fixed right-6 top-6 z-50 flex items-center justify-center rounded-full border border-slate-700 bg-slate-800/80 p-3 shadow-lg backdrop-blur-sm"
      : "flex items-center justify-center rounded-full border border-white/10 bg-white/5 p-2 text-sm text-gray-300 backdrop-blur-sm";

  return (
    <motion.button
      suppressHydrationWarning
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className={twMerge(
        baseClasses,
        "transition-all hover:border-cyan-400/50 hover:text-white hover:shadow-cyan-500/20",
        className,
      )}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className={variant === "inline" ? "h-4 w-4 text-yellow-400" : "h-5 w-5 text-yellow-400"} />
      ) : (
        <Moon className={variant === "inline" ? "h-4 w-4 text-slate-300" : "h-5 w-5 text-slate-300"} />
      )}
    </motion.button>
  );
}
