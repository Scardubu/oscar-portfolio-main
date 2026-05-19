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
  const pulseStyle: CSSProperties = {
    background: color,
    animation: `ping ${pulseDuration} cubic-bezier(0, 0, 0.2, 1) infinite`,
  };

  return (
    <span
      className={['relative flex h-1.5 w-1.5 shrink-0', className].filter(Boolean).join(' ')}
      aria-hidden="true"
    >
      <span className="absolute inline-flex h-full w-full rounded-full opacity-75" style={pulseStyle} />
      <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: color }} />
    </span>
  );
}
