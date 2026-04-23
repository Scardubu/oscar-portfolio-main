// CONVICTION ENGINE v9.0 — FULL REPLACEMENT
// components/CopyEmail.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Copy-to-clipboard email micro-interaction. (V30 FIX)
// Renders as <a href="mailto:..."> so it works on mobile (opens mail client)
// and on desktop uses navigator.clipboard.writeText for instant copy.
// States: idle → hover (copy icon) → copied (✓ Copied!) → idle (after 1200ms)
// ─────────────────────────────────────────────────────────────────────────────

'use client';

import { useState } from 'react';

interface CopyEmailProps {
  email: string;
  className?: string;
}

export function CopyEmail({ email, className = '' }: CopyEmailProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Only intercept on devices with clipboard API; fall through to mailto on touch.
    if (typeof navigator.clipboard?.writeText === 'function') {
      try {
        e.preventDefault();
        await navigator.clipboard.writeText(email);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      } catch {
        // Fallback: let the default mailto: behaviour happen.
      }
    }
  };

  return (
    <a
      href={`mailto:${email}`}
      onClick={handleCopy}
      aria-label={
        copied ? 'Email address copied to clipboard' : 'Copy email address or open mail client'
      }
      className={`copy-email group inline-flex items-center gap-1.5 font-mono text-xs tracking-wider text-white transition-colors hover:text-(--color-accent) ${className}`}
    >
      {copied ? (
        <>
          <CheckIcon />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <span>{email}</span>
          <CopyIcon />
        </>
      )}
    </a>
  );
}

function CopyIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      className="opacity-0 transition-opacity group-hover:opacity-60"
    >
      <rect x="4" y="4" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M2 8H1.5A1.5 1.5 0 0 1 0 6.5v-5A1.5 1.5 0 0 1 1.5 0h5A1.5 1.5 0 0 1 8 1.5V2"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      className="text-(--color-accent)"
    >
      <path
        d="M2 6l3 3 5-5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
