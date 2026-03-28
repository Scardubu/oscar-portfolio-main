"use client";

import React, { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface NavigationBarProps {
  availableForWork?: boolean;
  onAvailabilityToggle?: (v: boolean) => void;
}

const NAV_LINKS = [
  { label: "Work", href: "#work" },
  { label: "How it gets built", href: "#skills" },
  { label: "What was owned", href: "#experience" },
  { label: "Let's build", href: "#contact" },
] as const;

/**
 * NavigationBar
 *
 * Sticky · Full glass physics (L1–L5) · Active section scroll-linked
 * Mobile: hamburger → full-screen glass overlay
 */
export function NavigationBar({
  availableForWork = true,
  onAvailabilityToggle,
}: NavigationBarProps) {
  const prefersReducedMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [mobileOpen, setMobileOpen] = useState(false);

  // Scroll detection for glass activation
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Active section via IntersectionObserver (scroll-linked, not click-state)
  useEffect(() => {
    const sections = NAV_LINKS.map(l => l.href.slice(1));
    const observers: IntersectionObserver[] = [];

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.4, rootMargin: "0px 0px -40% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach(o => o.disconnect());
  }, []);

  const navVariants = {
    transparent: { backgroundColor: "rgba(10,10,15,0)" },
    glass: { backgroundColor: "rgba(10,10,15,0.72)" },
  };

  return (
    <>
      <motion.header
        role="banner"
        variants={prefersReducedMotion ? {} : navVariants}
        animate={scrolled ? "glass" : "transparent"}
        transition={{ duration: 0.3 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
          transition: "border-color 0.3s ease, backdrop-filter 0.3s ease",
        }}
      >
        <nav
          aria-label="Primary navigation"
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 clamp(16px, 4vw, 48px)",
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <a
            href="/"
            aria-label="Oscar Dubu — home"
            className="focus-ring-branded"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1px",
              textDecoration: "none",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "16px",
                color: "var(--color-text-primary)",
                letterSpacing: "-0.02em",
              }}
            >
              Oscar Dubu
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "var(--color-text-tertiary)",
                letterSpacing: "0.06em",
              }}
            >
              Production AI · Full-stack
            </span>
          </a>

          {/* Desktop links */}
          <ul
            role="list"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "clamp(16px, 3vw, 32px)",
              listStyle: "none",
            }}
            className="hidden md:flex"
          >
            {NAV_LINKS.map(link => {
              const id = link.href.slice(1);
              const isActive = activeSection === id;
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="focus-ring-branded"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "14px",
                      fontWeight: isActive ? 600 : 400,
                      color: isActive
                        ? "var(--color-accent-text)"
                        : "var(--color-text-secondary)",
                      textDecoration: "none",
                      transition: "color 0.2s ease",
                      position: "relative",
                    }}
                  >
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        style={{
                          position: "absolute",
                          bottom: "-4px",
                          left: 0,
                          right: 0,
                          height: "1px",
                          background: "var(--color-accent-primary)",
                          borderRadius: "1px",
                        }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                      />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Availability toggle + mobile menu */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* Availability toggle */}
            <button
              aria-label={`Availability: ${availableForWork ? "open" : "closed"}`}
              aria-pressed={availableForWork}
              onClick={() => onAvailabilityToggle?.(!availableForWork)}
              className="focus-ring-branded"
              style={{
                width: "48px",
                height: "28px",
                borderRadius: "14px",
                background: availableForWork
                  ? "var(--color-accent-primary)"
                  : "rgba(255,255,255,0.12)",
                border: "none",
                cursor: "pointer",
                position: "relative",
                transition: "background 0.2s ease",
                flexShrink: 0,
              }}
            >
              <motion.span
                animate={{ x: availableForWork ? 22 : 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
                style={{
                  position: "absolute",
                  top: "3px",
                  left: "0",
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  background: "#fff",
                  display: "block",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                }}
              />
            </button>

            {/* Mobile hamburger */}
            <button
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              onClick={() => setMobileOpen(v => !v)}
              className="focus-ring-branded md:hidden"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                color: "var(--color-text-secondary)",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                {mobileOpen ? (
                  <path d="M4 4L16 16M4 16L16 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                ) : (
                  <>
                    <path d="M2 5H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M2 10H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M2 15H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile full-screen overlay */}
      {mobileOpen && (
        <motion.div
          id="mobile-nav"
          role="dialog"
          aria-label="Navigation menu"
          initial={prefersReducedMotion ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99,
            background: "rgba(10,10,15,0.96)",
            backdropFilter: "blur(40px) saturate(200%)",
            WebkitBackdropFilter: "blur(40px) saturate(200%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "32px",
          }}
        >
          {NAV_LINKS.map((link, i) => (
            <motion.a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="focus-ring-branded"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(28px, 6vw, 40px)",
                fontWeight: 700,
                color: "var(--color-text-primary)",
                textDecoration: "none",
                letterSpacing: "-0.03em",
              }}
            >
              {link.label}
            </motion.a>
          ))}
        </motion.div>
      )}
    </>
  );
}