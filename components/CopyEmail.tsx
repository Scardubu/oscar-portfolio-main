'use client';
// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
// Major Reset • Lagos → Global • Production Conviction Architecture
// FIXED (v21.1): Missing <a opening tag — broken JSX causing build failure.
// Renders as <a href="mailto:..."> — opens mail client on touch devices.
// On desktop with clipboard API: intercepts click and copies address.
// Icon always visible (not hover-only) for touch accessibility.
// Min touch target: 44×44px guaranteed.

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
    // FIX v21.1: restored missing <a opening tag
    <a
      href={`mailto:${email}`}
      onClick={handleClick}
      aria-label={
        copied
          ? 'Email address copied to clipboard'
          : `Send email to ${email}`
      }
      className={`copy-email inline-flex min-h-[44px] items-center gap-1.5 font-mono text-xs tracking-wider transition-colors ${className}`}
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
      className="shrink-0"
    >
      <rect x="4" y="4" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M2.5 8H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
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
      className="shrink-0"
    >
      <path
        d="M2 6.5L4.5 9L10 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}