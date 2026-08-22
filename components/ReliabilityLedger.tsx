'use client';

import { m, useReducedMotion } from 'framer-motion';
import type { JSX } from 'react';

export type ReliabilityLedgerRecord = {
  constraint: string;
  decision: string;
  outcome: string;
  evidence: string;
};

type ReliabilityLedgerProps = ReliabilityLedgerRecord & {
  compact?: boolean;
  label?: string;
};

const LEDGER_FIELDS = [
  { key: 'constraint', label: 'Constraint', tone: 'ledger-constraint' },
  { key: 'decision', label: 'Decision', tone: 'ledger-decision' },
  { key: 'outcome', label: 'Outcome', tone: 'ledger-outcome' },
  { key: 'evidence', label: 'Evidence', tone: 'ledger-evidence' },
] as const;

export function ReliabilityLedger({
  constraint,
  decision,
  outcome,
  evidence,
  compact = false,
  label = 'Reliability Ledger',
}: Readonly<ReliabilityLedgerProps>): JSX.Element {
  const reducedMotion = useReducedMotion();
  const record = { constraint, decision, outcome, evidence };

  return (
    <div
      className={compact ? 'reliability-ledger reliability-ledger--compact' : 'reliability-ledger'}
      aria-label={label}
    >
      <p className="reliability-ledger-title">{label}</p>
      <div className="relative">
        <m.span
          aria-hidden="true"
          className="reliability-ledger-trace reliability-ledger-trace--mobile"
          initial={false}
          whileInView={reducedMotion ? undefined : { scaleY: [0, 1] }}
          viewport={{ once: true, amount: 0.55 }}
          transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
        />
        <m.span
          aria-hidden="true"
          className="reliability-ledger-trace reliability-ledger-trace--desktop"
          initial={false}
          whileInView={reducedMotion ? undefined : { scaleX: [0, 1] }}
          viewport={{ once: true, amount: 0.55 }}
          transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
        />

        <ol className="reliability-ledger-grid">
          {LEDGER_FIELDS.map(({ key, label: fieldLabel, tone }) => (
            <li key={key} className={`reliability-ledger-item ${tone}`}>
              <span className="reliability-ledger-node" aria-hidden="true" />
              <p className="reliability-ledger-label">{fieldLabel}</p>
              <p className="reliability-ledger-value">{record[key]}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
