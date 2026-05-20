import type { CSSProperties } from 'react';

type StatusPulseDotProps = {
  color: string;
  pulseDuration?: string;
  className?: string;
};

export function StatusPulseDot({
  color,
  pulseDuration = '1.2s',
  className,
}: Readonly<StatusPulseDotProps>) {
  // Inject dynamic values as CSS custom properties so inner spans can reference
  // them via Tailwind arbitrary values — no inline styles on inner elements.
  const outerStyle = { '--dot-color': color, '--pulse-dur': pulseDuration } as CSSProperties;

  return (
    <span
      className={['relative flex h-1.5 w-1.5 shrink-0', className].filter(Boolean).join(' ')}
      // eslint-disable-next-line no-restricted-syntax
      style={outerStyle}
      aria-hidden="true"
    >
      <span
        className="absolute inline-flex h-full w-full rounded-full opacity-75 [animation:ping_var(--pulse-dur)_cubic-bezier(0,0,0.2,1)_infinite] bg-[var(--dot-color)]"
      />
      <span
        className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--dot-color)]"
      />
    </span>
  );
}
