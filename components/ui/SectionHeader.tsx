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
        <p className="mb-3 text-xs font-bold tracking-widest text-(--accent-primary) uppercase">
          {tag}
        </p>
      )}
      <h1 className="text-4xl leading-tight font-extrabold tracking-tight text-(--text-primary) sm:text-5xl">
        {title}
      </h1>
      {subtitle && <p className="mt-4 text-base leading-relaxed text-(--text-muted)">{subtitle}</p>}
    </div>
  );
}
