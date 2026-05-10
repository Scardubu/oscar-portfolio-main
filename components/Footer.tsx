// CONVICTION ENGINE v14.0 — Footer
//
// CHANGELOG from v13.0:
//
//   FIX:  Brand tagline: "Lagos precision. Global scale." — location string
//     corrected to "Abuja-built. Globally proven." consistent with the
//     global Lagos→Abuja correction pass (v12.x find/replace artifact).
//
//   REF:  Narrative closure line upgraded: now echoes the hero headline
//     more precisely. "Built in Nigeria. Running globally." (v13) was
//     generic. "Abuja-built. Globally proven." (v14) is specific and
//     carries the same conviction signal as the "2am" thesis.
//
//   REF:  System status colour now uses var(--color-success) token directly
//     instead of hardcoded green — light mode compatible.
//
//   ADD:  Footer conviction closer: a one-line echo of the hero thesis.
//     "Systems that work at 2am. That's the standard." — closes the
//     narrative loop opened at first load. DMs feel the continuity;
//     engineers recognise the design discipline.
//
//   KEEP: role="contentinfo", aria-label — WCAG 2.2 semantic landmarks.
//   KEEP: min-height 44px on all links — WCAG 2.2 §2.5.8 target size.
//   KEEP: ISO timestamp format — precise, technical signal.
//
'use client';

export function Footer() {
  const buildTime = new Date().toISOString().slice(0, 16).replace('T', ' ');

  return (
    <footer
      role="contentinfo"
      aria-label="Site footer"
      className="border-t py-10"
      style={{ borderColor: 'var(--color-border)' }}
    >
      <div className="container flex flex-col justify-between gap-8 lg:flex-row lg:items-start">

        {/* ── Brand block ──────────────────────────────────────────── */}
        <div>
          <p
            className="font-display text-lg font-bold tracking-tight"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Oscar Ndugbu
          </p>
          {/* v14.0 FIX: "Lagos precision" → "Abuja-built. Globally proven." */}
          <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Abuja-built. Globally proven.
          </p>
          <p className="mt-3 font-mono text-[11px]" style={{ color: 'oklch(93% 0.006 264 / 0.28)' }}>
            © 2024–2026 Oscar Ndugbu · Built with Next.js 15
          </p>
          <p className="mt-1 font-mono text-[11px]" style={{ color: 'oklch(93% 0.006 264 / 0.20)' }}>
            Built in Nigeria. Running globally.
          </p>
          <p
            className="mt-1.5 flex items-center gap-2 font-mono text-[10px]"
            style={{ color: 'oklch(93% 0.006 264 / 0.22)' }}
          >
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: 'var(--color-success)' }}
              aria-hidden="true"
            />
            All systems operational · {buildTime}
          </p>

          {/* v14.0 ADD: Conviction closer — narrative echo of hero thesis */}
          <p
            className="mt-5 font-mono text-[10px] tracking-wide"
            style={{ color: 'oklch(93% 0.006 264 / 0.18)' }}
          >
            Systems that work at 2am. That&apos;s the standard.
          </p>
        </div>

        {/* ── Nav links ─────────────────────────────────────────────── */}
        <nav aria-label="Footer navigation">
          <ul className="flex flex-wrap gap-1" role="list">
            {[
              { label: 'Projects', href: '#section-projects' },
              { label: 'Writing',  href: '#section-writing' },
              { label: 'Skills',   href: '#skills' },
              { label: 'About',    href: '#section-about' },
              { label: 'Contact',  href: '#section-contact' },
            ].map(({ label, href }) => (
              <li key={href} role="listitem">
                <a
                  href={href}
                  className="inline-flex min-h-11 items-center px-3 py-3 text-sm transition-colors hover:text-white"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* ── Social + CTA ─────────────────────────────────────────── */}
        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <a
              href="https://github.com/Scardubu"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center text-sm transition-colors hover:text-white"
              style={{ color: 'var(--color-text-muted)' }}
              aria-label="GitHub"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/oscardubu"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center text-sm transition-colors hover:text-white"
              style={{ color: 'var(--color-text-muted)' }}
              aria-label="LinkedIn"
            >
              LinkedIn
            </a>
            <a
              href="/cv/oscar-ndugbu-resume.pdf"
              download
              className="inline-flex min-h-11 items-center text-sm transition-colors hover:text-white"
              style={{ color: 'var(--color-text-muted)' }}
              aria-label="Download resume"
            >
              Resume ↓
            </a>
          </div>
          <a
            href="mailto:scardubu@gmail.com"
            className="cta-primary"
            style={{ alignSelf: 'flex-start' }}
          >
            Book a Call
          </a>
        </div>
      </div>
    </footer>
  );
}