// Compatibility component retained for older layout imports. It deliberately
// presents an evidence link state, not simulated operational telemetry.

interface SystemStatusProps {
  showLabel?: boolean;
  labelMode?: 'short' | 'full';
}

export function SystemStatus({ showLabel = true, labelMode = 'short' }: SystemStatusProps = {}) {
  const toneClass = labelMode === 'full' ? 'text-color-text-secondary' : 'text-color-text-muted';
  const labelClass = labelMode === 'full' ? 'inline text-color-text-primary' : 'hidden sm:inline';
  const label = labelMode === 'full' ? 'Public evidence record' : 'Evidence';

  return (
    <span
      aria-label="Public evidence record"
      title="Public evidence record"
      className={`${toneClass} text-2xs relative inline-flex items-center gap-1.5 font-mono tracking-widest uppercase select-none`}
    >
      <span className="bg-color-film-teal h-1.5 w-1.5 rounded-full" aria-hidden="true" />

      {showLabel && <span className={labelClass}>{label}</span>}
    </span>
  );
}
