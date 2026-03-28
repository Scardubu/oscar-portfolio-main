"use client";

import Link from "next/link";
import { siteConfig, social } from "@/data/portfolio";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative z-10 border-t border-[var(--border-subtle)] bg-[var(--bg-base)]"
      role="contentinfo"
    >
      <div className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Brand */}
          <div className="flex flex-col items-center gap-1 md:items-start">
            <p
              className="text-[15px] font-bold text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-syne, sans-serif)" }}
            >
              {siteConfig.name}
            </p>
            <p className="font-mono text-[11px] text-[var(--text-muted)]">
              {siteConfig.location} · {siteConfig.timezone}
            </p>
          </div>

          {/* Social links */}
          <nav aria-label="Social links" className="flex items-center gap-4">
            {[
              { href: social.github,   label: "GitHub",   icon: "GH" },
              { href: social.linkedin, label: "LinkedIn", icon: "LI" },
              { href: social.twitter,  label: "Twitter",  icon: "X"  },
            ].map(({ href, label, icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-subtle)] font-mono text-[11px] font-semibold text-[var(--text-muted)] transition-all duration-200 hover:border-[var(--accent-primary-border)] hover:text-[var(--accent-primary)] no-underline"
              >
                {icon}
              </a>
            ))}
            <a
              href={`mailto:${social.email}`}
              className="btn btn-ghost text-sm"
            >
              Email me
            </a>
          </nav>

          {/* Copy */}
          <p className="text-xs text-[var(--text-muted)]">
            © {year} {siteConfig.name}. Built with Next.js 15.
          </p>
        </div>
      </div>
    </footer>
  );
}
