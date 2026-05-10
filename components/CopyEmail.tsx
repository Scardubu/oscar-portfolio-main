'use client';
// components/CopyEmail.tsx — CONVICTION ENGINE v19.0
// Renders as <a href="mailto:..."> — opens mail client on touch devices.
// On desktop with clipboard API: intercepts click and copies address.
// Icon is always visible (not hover-only) for touch accessibility.

import { useState } from 'react';

interface CopyEmailProps {
  email:      string;
  className?: string;
}

export function CopyEmail({ email, className = '' }: Readonly<CopyEmailProps>) {
  const [copied, setCopied] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof navigator.clipboard?.writeText === 'function') {
      try {
        e.preventDefault();
        await navigator.clipboard.writeText(email);
        setCopied(true);
        setTimeout(() => setCopied(false), 1400);
      } catch {
        // Clipboard denied — fall through to mailto:
      }
    }
  };

  return (
    
      href={`mailto:${email}`}
      onClick={handleClick}
      aria-label={
        copied
          ? 'Email address copied to clipboard'
          : `Send email to ${email}`
      }
      className={`copy-email inline-flex items-center gap-1.5 font-mono text-xs tracking-wider transition-colors ${className}`}
      style={{ color: copied ? 'var(--color-film-teal)' : 'var(--color-text-muted)' }}
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
      style={{ opacity: 0.5 }}
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