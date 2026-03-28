// ─────────────────────────────────────────────────────────────────────
// SectionLabel.tsx
// Uppercase overline label — consistent section entry pattern.
// ─────────────────────────────────────────────────────────────────────
 
interface SectionLabelProps {
  children:   React.ReactNode
  accent?:    'primary' | 'secondary' | 'fintech' | 'warn'
  className?: string
}
 
const accentVarMap = {
  primary:   'var(--accent-primary)',
  secondary: 'var(--accent-secondary-text)',
  fintech:   'var(--accent-fintech)',
  warn:      'var(--accent-warn)',
}
 
export function SectionLabel({
  children,
  accent    = 'primary',
  className = '',
}: SectionLabelProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span
        className="block w-6 h-px"
        style={{ background: accentVarMap[accent] }}
        aria-hidden="true"
      />
      <span
        className="text-caption"
        style={{ color: accentVarMap[accent] }}
      >
        {children}
      </span>
    </div>
  )
}