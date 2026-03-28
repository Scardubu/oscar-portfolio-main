"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, BookOpen, Briefcase, Code2, Mail, Home } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { trackEvent } from "@/app/lib/analytics";

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Projects", href: "/#projects", icon: Briefcase },
  { label: "Skills", href: "/#skills", icon: Code2 },
  { label: "Blog", href: "/blog", icon: BookOpen, highlight: true },
  { label: "Contact", href: "/#contact", icon: Mail },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 50);

    // Calculate scroll progress
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;
    setScrollProgress(progress);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial call after mount
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mounted, handleScroll]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "border-b border-white/10 bg-bg-primary/80 backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        {/* Scroll Progress Bar */}
        <div
          className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
          role="progressbar"
          aria-valuenow={Math.round(scrollProgress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Page scroll progress"
        />
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
          {/* Logo / Name */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="group flex items-center gap-2"
              onClick={() => trackEvent("Navigation", "Click", "Logo")}
            >
              <span className="text-xl font-bold text-white transition-colors group-hover:text-accent-primary">
                Oscar<span className="text-accent-primary">.</span>
              </span>
            </Link>
            <span className="hidden text-xs font-semibold uppercase tracking-widest text-accent-primary sm:inline">
              Production ML Engineer
            </span>
          </div>

          {/* Desktop Navigation */}
          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => trackEvent("Navigation", "Click", item.label)}
                  className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    item.highlight
                      ? "bg-accent-primary/10 text-accent-primary hover:bg-accent-primary/20"
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                  {item.highlight && (
                    <span className="ml-1 rounded bg-accent-primary/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-primary">
                      New
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <ThemeToggle variant="inline" className="hidden md:flex lg:flex" />
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-lg p-2 text-gray-300 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 right-0 top-0 z-50 w-72 border-l border-white/10 bg-bg-primary p-6 lg:hidden"
          >
            <div className="mb-8 flex items-center justify-between">
              <span className="text-lg font-bold text-white">Menu</span>
              <div className="flex items-center gap-3">
                <ThemeToggle variant="inline" />
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-white"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <ul className="space-y-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={() => {
                      trackEvent("Navigation", "Click Mobile", item.label);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium transition-all ${
                      item.highlight
                        ? "bg-accent-primary/10 text-accent-primary"
                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                    {item.highlight && (
                      <span className="ml-auto rounded bg-accent-primary/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-primary">
                        New
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>

            {/* CTA in mobile menu */}
            <div className="mt-8 border-t border-white/10 pt-6">
              <Link
                href="/#contact"
                onClick={() => {
                  trackEvent("Navigation", "Click Mobile CTA", "Get in Touch");
                  setIsMobileMenuOpen(false);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105"
              >
                <Mail className="h-4 w-4" />
                Get in Touch
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
