import type React from 'react';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-[2] border-t border-[color:var(--color-border)] py-8">
      <div className="container flex flex-wrap items-center justify-between gap-4">
        <span className="font-mono text-xs tracking-[var(--tracking-wide)] text-[color:var(--color-text-muted)]">
          scardubu.dev &middot; {year}
        </span>

        <div className="flex items-center gap-6">
          <a
            href="https://github.com/Scardubu"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Oscar Ndugbu on GitHub"
            className="font-mono text-xs tracking-[var(--tracking-wide)] text-[color:var(--color-text-muted)] uppercase transition-colors hover:text-[color:var(--color-text-primary)]"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/oscardubu"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Oscar Ndugbu on LinkedIn"
            className="font-mono text-xs tracking-[var(--tracking-wide)] text-[color:var(--color-text-muted)] uppercase transition-colors hover:text-[color:var(--color-text-primary)]"
          >
            LinkedIn
          </a>
          <a
            href="mailto:scardubu@gmail.com"
            aria-label="Email Oscar Ndugbu"
            className="font-mono text-xs tracking-[var(--tracking-wide)] text-[color:var(--color-text-muted)] uppercase transition-colors hover:text-[color:var(--color-text-primary)]"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
