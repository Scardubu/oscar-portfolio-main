import { Github, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/6 pt-8 pb-10 md:pb-14">
      <div className="glass-surface glass-surface-light flex flex-col gap-6 rounded-[1.75rem] px-6 py-6 md:flex-row md:items-end md:justify-between md:px-8">
        <div className="space-y-3">
          <p className="text-lg font-semibold text-[var(--text-primary)]">Oscar Dubu</p>
          <p className="max-w-xl text-sm leading-7 text-[var(--text-secondary)] md:text-base">
            Production AI systems, full-stack delivery, and product surfaces that stay legible under
            real operating conditions.
          </p>
          <p className="text-xs tracking-[0.22em] text-[var(--text-muted)] uppercase">
            Nigeria NG · Remote-First
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="https://github.com/Scardubu"
            target="_blank"
            rel="noreferrer"
            className="focus-ring-branded inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-[var(--text-primary)]"
          >
            <Github className="h-4 w-4" />
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/oscardubu"
            target="_blank"
            rel="noreferrer"
            className="focus-ring-branded inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-[var(--text-primary)]"
          >
            <Linkedin className="h-4 w-4" />
            LinkedIn
          </a>
          <a
            href="mailto:scardubu@gmail.com"
            className="focus-ring-branded inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-[var(--text-primary)]"
          >
            <Mail className="h-4 w-4" />
            Email
          </a>
        </div>
      </div>
      <p className="pt-5 text-center text-xs text-[var(--text-muted)]">
        © {currentYear} Oscar Dubu · Built with Next.js 15, TypeScript, Tailwind CSS 4, and Framer
        Motion.
      </p>
    </footer>
  );
}
