import { cn } from '@/lib/utils';

interface TechTagProps {
  label: string;
  size?: 'sm' | 'md';
  className?: string;
}

export function TechTag({ label, size = 'md', className }: Readonly<TechTagProps>) {
  return (
    <span
      className={cn(
        'inline-block rounded-full border font-mono transition-colors duration-150',
        // Border and color: always readable (no hover-only contrast)
        'text-color-text-muted border-white/12',
        // Size
        size === 'sm' ? 'px-2.5 py-0.5 text-[10px]' : 'px-3 py-1 text-xs',
        // Hover: only on pointer:fine (desktop) — safe for mobile
        'hover:[@media(hover:hover)]:border-white/30 hover:[@media(hover:hover)]:text-white',
        className
      )}
    >
      {label}
    </span>
  );
}
