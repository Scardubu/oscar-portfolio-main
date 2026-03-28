/**
 * components/projects/ComplianceBadges.tsx
 *
 * Surfaces compliance, privacy, auditability, and ZK signals.
 *
 * INTEGRITY RULE: Every displayed tag must be defensible in a 60-second
 * technical screen. If a reviewer asks "what does KYC/AML mean in this
 * system?", Oscar must be able to explain the specific implementation.
 *
 * ComplianceTag type is imported from lib/types — not redefined here.
 */

import * as React       from 'react'
import type { ComplianceTag } from '@/lib/types'

// ─── Badge configuration ──────────────────────────────────────────────────────

interface BadgeConfig {
  label:   string
  icon:    string
  color:   string
  bg:      string
  border:  string
  /** Explanation shown on hover/focus — must be technically specific */
  tooltip: string
}

const BADGE_CONFIG: Record<ComplianceTag, BadgeConfig> = {
  'GDPR': {
    label:   'GDPR',
    icon:    '🛡',
    color:   'text-blue-300',
    bg:      'bg-blue-950/50',
    border:  'border-blue-700/40',
    tooltip: 'PII detection, data minimisation, and right-to-erasure patterns applied',
  },
  'PCI-DSS': {
    label:   'PCI-DSS',
    icon:    '💳',
    color:   'text-emerald-300',
    bg:      'bg-emerald-950/50',
    border:  'border-emerald-700/40',
    tooltip: 'Payment card data handling controls — no PAN storage in application layer',
  },
  'Audit Trail': {
    label:   'Audit Trail',
    icon:    '📋',
    color:   'text-violet-300',
    bg:      'bg-violet-950/50',
    border:  'border-violet-700/40',
    tooltip: 'Immutable append-only audit_events table — Postgres RULE prevents UPDATE or DELETE',
  },
  'Multi-tenant RLS': {
    label:   'Multi-tenant RLS',
    icon:    '🔐',
    color:   'text-cyan-300',
    bg:      'bg-cyan-950/50',
    border:  'border-cyan-700/40',
    tooltip: 'Postgres Row-Level Security — tenant isolation enforced at DB layer, not ORM layer',
  },
  'ZK Privacy': {
    label:   'ZK Privacy',
    icon:    '∅',
    color:   'text-purple-300',
    bg:      'bg-purple-950/50',
    border:  'border-purple-700/40',
    tooltip: 'Groth16 ZK-SNARK — proves eligibility without revealing the underlying value',
  },
  'KYC/AML': {
    label:   'KYC/AML',
    icon:    '🔍',
    color:   'text-amber-300',
    bg:      'bg-amber-950/50',
    border:  'border-amber-700/40',
    tooltip: 'Identity verification and anti-money-laundering patterns — field-level PII tagging',
  },
  'CBOR': {
    label:   'CBOR',
    icon:    '⬡',
    color:   'text-rose-300',
    bg:      'bg-rose-950/50',
    border:  'border-rose-700/40',
    tooltip: 'CBOR binary streaming — processes 4 GB+ distribution files without full-load memory',
  },
  'Sepolia Verified': {
    label:   'Sepolia Verified',
    icon:    '⛓',
    color:   'text-indigo-300',
    bg:      'bg-indigo-950/50',
    border:  'border-indigo-700/40',
    tooltip: 'Smart contract deployed and source-verified on Sepolia testnet via Etherscan',
  },
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface ComplianceBadgesProps {
  tags:       ComplianceTag[]
  className?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ComplianceBadges({ tags, className = '' }: ComplianceBadgesProps): React.ReactElement | null {
  if (tags.length === 0) return null

  return (
    <div
      className={`flex flex-wrap gap-2 ${className}`}
      role="list"
      aria-label="Compliance and security properties"
    >
      {tags.map(tag => {
        const cfg = BADGE_CONFIG[tag]

        return (
          <div
            key={tag}
            role="listitem"
            title={cfg.tooltip}
            aria-label={`${cfg.label}: ${cfg.tooltip}`}
            className={`
              inline-flex items-center gap-1.5 px-2.5 py-1
              rounded-md border text-xs font-semibold
              cursor-default select-none
              transition-all duration-200
              hover:brightness-125 hover:scale-[1.02]
              ${cfg.bg} ${cfg.border} ${cfg.color}
            `}
          >
            <span className="text-[11px]" aria-hidden="true">{cfg.icon}</span>
            {cfg.label}
          </div>
        )
      })}
    </div>
  )
}