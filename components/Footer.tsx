import type React from 'react';

import { CopyEmail } from '@/components/CopyEmail';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-[2] border-t border-(--color-border) py-8">
      <div className="container flex flex-wrap items-center justify-between gap-4">
        <span className="font-mono text-xs tracking-(--tracking-wide) text-(--color-text-muted)">
          scardubu.dev &middot; {year} &middot; Built with Next.js 15 &middot; Conviction Engine
          v10.0
        </span>

        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <a
            href="https://github.com/Scardubu"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Oscar Ndugbu on GitHub"
            className="font-mono text-xs tracking-(--tracking-wide) text-(--color-text-muted) uppercase transition-colors hover:text-(--color-text-primary)"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/oscardubu"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Oscar Ndugbu on LinkedIn"
            className="font-mono text-xs tracking-(--tracking-wide) text-(--color-text-muted) uppercase transition-colors hover:text-(--color-text-primary)"
          >
            LinkedIn
          </a>
          <CopyEmail
            email="scardubu@gmail.com"
            className="text-(--color-text-muted) hover:text-(--color-text-primary)"
          />
          <a
            href="#hero"
            aria-label="Back to top"
            className="font-mono text-xs tracking-(--tracking-wide) text-(--color-text-muted) uppercase transition-colors hover:text-(--color-text-primary)"
          >
            ↑ Top
          </a>
        </div>
      </div>
    </footer>
  );
}
