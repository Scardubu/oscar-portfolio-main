import Link from 'next/link';

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.88c-2.77.6-3.35-1.18-3.35-1.18-.46-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.54 2.36 1.1 2.93.84.09-.65.35-1.1.63-1.36-2.21-.25-4.54-1.1-4.54-4.92 0-1.09.39-1.98 1.03-2.67-.1-.25-.45-1.28.1-2.66 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.9-1.29 2.74-1.02 2.74-1.02.56 1.38.21 2.41.11 2.66.64.69 1.03 1.58 1.03 2.67 0 3.83-2.33 4.66-4.56 4.91.36.31.67.92.67 1.86v2.76c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
      <path d="M4.98 3.5a1.75 1.75 0 1 1 0 3.5 1.75 1.75 0 0 1 0-3.5ZM3.5 8.75h2.96V20.5H3.5V8.75Zm7.17 0h2.84v1.6h.04c.39-.75 1.37-1.85 2.82-1.85 3.02 0 3.58 1.98 3.58 4.56v7.44H17V14c0-1.5-.03-3.42-2.08-3.42-2.08 0-2.4 1.63-2.4 3.31v6.61h-2.85V8.75Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.261 5.632L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2Z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/10 py-10">
      <div className="container">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          {/* Brand + back-to-top */}
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-white/80">Oscar Ndugbu</p>
            <p className="text-xs text-white/40">Full-Stack ML Engineer · Nigeria · © {new Date().getFullYear()}</p>
          </div>

          {/* CTA row */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/oscar-scardubu-resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download Oscar Ndugbu resume PDF"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-4 py-1.5 text-xs font-semibold text-white/70 transition hover:border-white/50 hover:text-white"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 4v12m0 0-4-4m4 4 4-4M4 20h16" />
              </svg>
              Résumé
            </Link>
            <a
              href="#main-content"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-4 py-1.5 text-xs font-semibold text-white/70 transition hover:border-white/50 hover:text-white"
              aria-label="Scroll back to top of page"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 19V5m0 0-7 7m7-7 7 7" />
              </svg>
              Back to top
            </a>
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-4 text-white/50">
            <Link
              href="https://github.com/Scardubu"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Oscar Ndugbu GitHub profile"
              className="transition hover:text-white"
            >
              <GitHubIcon />
            </Link>
            <Link
              href="https://linkedin.com/in/oscardubu"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Oscar Ndugbu LinkedIn profile"
              className="transition hover:text-white"
            >
              <LinkedInIcon />
            </Link>
            <Link
              href="https://x.com/scardubu"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Oscar Ndugbu X (Twitter) profile"
              className="transition hover:text-white"
            >
              <XIcon />
            </Link>
            <Link
              href="mailto:oscar@scardubu.dev"
              aria-label="Email Oscar Ndugbu"
              className="transition hover:text-white"
            >
              <EmailIcon />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
