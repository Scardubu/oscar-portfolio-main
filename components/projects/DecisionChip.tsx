/**
 * components/projects/DecisionChip.tsx
 *
 * Surfaces engineering trade-offs with explicit rejected alternatives.
 * This is the component that answers "Why did you choose X?" before
 * the reviewer asks it.
 *
 * DecisionRecord type imported from lib/types — not redefined here.
 */

import * as React from 'react'
import type { DecisionRecord } from '@/lib/types'

// ─── Props ────────────────────────────────────────────────────────────────────

interface DecisionChipProps {
  record:     DecisionRecord
  className?: string
}

interface DecisionListProps {
  records:    DecisionRecord[]
  className?: string
}

// ─── DecisionChip ────────────────────────────────────────────────────────────

export function DecisionChip({ record, className = '' }: DecisionChipProps): React.ReactElement {
  return (
    <div
      className={`
        rounded-lg border border-[color:var(--border-default)]
        bg-[color:var(--bg-elevated)] p-4 space-y-3
        ${className}
      `}
      role="article"
      aria-label={`Architecture decision: ${record.decision}`}
    >
      {/* Header label */}
      <p className="text-[10px] font-bold tracking-widest uppercase text-[color:var(--text-muted)]">
        Design decision
      </p>

      {/* Decision statement */}
      <p className="text-sm font-semibold text-[color:var(--text-primary)] leading-snug">
        {record.decision}
      </p>

      {/* Rejected vs Chosen chips */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Alternatives considered">
        <div
          className="
            inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md
            bg-red-950/40 border border-red-800/30
            text-xs text-red-300 font-medium
          "
          aria-label={`Rejected: ${record.rejected}`}
        >
          <span className="text-red-500 font-bold" aria-hidden="true">✕</span>
          {record.rejected}
        </div>

        <div
          className="
            inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md
            bg-green-950/40 border border-green-800/30
            text-xs text-green-300 font-medium
          "
          aria-label={`Chosen: ${record.chosen}`}
        >
          <span className="text-green-400 font-bold" aria-hidden="true">✓</span>
          {record.chosen}
        </div>
      </div>

      {/* Reasoning — must reference a structural or measurable constraint */}
      <p className="
        text-xs text-[color:var(--text-muted)] leading-relaxed
        border-l-2 border-[color:var(--border-default)] pl-3
      ">
        {record.reason}
      </p>
    </div>
  )
}

// ─── DecisionList ─────────────────────────────────────────────────────────────

export function DecisionList({ records, className = '' }: DecisionListProps): React.ReactElement | null {
  if (records.length === 0) return null

  return (
    <div
      className={`space-y-3 ${className}`}
      role="list"
      aria-label={`${records.length} architecture decision${records.length === 1 ? '' : 's'}`}
    >
      {records.map(record => (
        <div key={record.decision} role="listitem">
          <DecisionChip record={record} />
        </div>
      ))}
    </div>
  )
}