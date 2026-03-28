import * as React from 'react'

interface SectionHeaderProps {
  tag?: string
  title: string
  subtitle?: string
  align?: 'left' | 'center' | 'right'
  className?: string
}

export function SectionHeader({
  tag,
  title,
  subtitle,
  align = 'left',
  className = '',
}: SectionHeaderProps): React.ReactElement {
  const alignClass =
    align === 'center'
      ? 'text-center mx-auto'
      : align === 'right'
        ? 'text-right ml-auto'
        : 'text-left'

  return (
    <div className={`mb-10 max-w-2xl ${alignClass} ${className}`}>
      {tag && (
        <p className="text-xs font-bold tracking-widest uppercase mb-3 text-[color:var(--accent-primary)]">
          {tag}
        </p>
      )}
      <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight text-[color:var(--text-primary)]">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-4 text-base leading-relaxed text-[color:var(--text-muted)]">
          {subtitle}
        </p>
      )}
    </div>
  )
}
