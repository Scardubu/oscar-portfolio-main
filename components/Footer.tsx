// CONVICTION ENGINE v8.0 — FULL REPLACEMENT

export function Footer() {
  return (
    <footer
      role="contentinfo"
      aria-label="Site footer"
      className="border-t border-(--glass-border) py-8"
    >
      <div className="container flex flex-col justify-between gap-6 sm:gap-8 lg:flex-row lg:items-start">
        <div>
          <p className="font-display text-lg font-bold text-white">Oscar Ndugbu</p>
          <p className="mt-1 text-sm text-white/50">Lagos precision. Global scale.</p>
          <p className="mt-3 text-xs text-white/35">
            © 2024–2026 Oscar Ndugbu · Built with Next.js 15
          </p>
          <p className="mt-2 font-mono text-[11px] text-white/35">
            ● All systems operational · last checked:{' '}
            {new Date().toISOString().slice(0, 16).replace('T', ' ')}
          </p>
        </div>

        <div className="space-y-2">
          <nav aria-label="Footer navigation" className="flex flex-wrap gap-3 sm:gap-4">
            <a
              href="#section-projects"
              className="inline-flex min-h-11 items-center py-3 text-sm text-white/65 transition hover:text-white"
            >
              Projects
            </a>
            <a
              href="#section-writing"
              className="inline-flex min-h-11 items-center py-3 text-sm text-white/65 transition hover:text-white"
            >
              Writing
            </a>
            <a
              href="#section-about"
              className="inline-flex min-h-11 items-center py-3 text-sm text-white/65 transition hover:text-white"
            >
              About
            </a>
            <a
              href="#section-contact"
              className="inline-flex min-h-11 items-center py-3 text-sm text-white/65 transition hover:text-white"
            >
              Contact
            </a>
          </nav>
          <div className="flex flex-wrap gap-3 sm:gap-4">
            <a
              href="https://github.com/Scardubu"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center py-3 text-sm text-white/50 transition hover:text-white"
            >
              GitHub ↗
            </a>
            <a
              href="https://linkedin.com/in/oscar-ndugbu"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center py-3 text-sm text-white/50 transition hover:text-white"
            >
              LinkedIn ↗
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
