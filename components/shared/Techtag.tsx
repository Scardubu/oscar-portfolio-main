import { cn } from "@/lib/utils";

interface TechTagProps {
  label: string;
  size?: "sm" | "md";
  className?: string;
}

export function TechTag({ label, size = "md", className }: TechTagProps) {
  return (
    <span
      className={cn(
        "inline-block rounded-full border border-[var(--border-subtle)] font-mono text-[var(--text-muted)] transition-colors duration-150",
        "hover:border-[var(--accent-primary-border)] hover:text-[var(--accent-primary)]",
        size === "sm" ? "px-2.5 py-0.5 text-[10px]" : "px-3 py-1 text-xs",
        className
      )}
    >
      {label}
    </span>
  );
}
