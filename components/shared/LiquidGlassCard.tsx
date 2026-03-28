import { cn } from "@/lib/utils";

type GlassVariant = "default" | "cyan" | "violet" | "teal" | "warn" | "float";

interface LiquidGlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: GlassVariant;
  hover?: boolean;
  as?: React.ElementType;
  style?: React.CSSProperties;
  onClick?: () => void;
  "data-reveal"?: string;
}

const variantClasses: Record<GlassVariant, string> = {
  default: "liquid-glass",
  cyan:    "liquid-glass liquid-glass-cyan",
  violet:  "liquid-glass liquid-glass-violet",
  teal:    "liquid-glass liquid-glass-teal",
  warn:    "liquid-glass",
  float:   "liquid-glass liquid-glass-float",
};

export function LiquidGlassCard({
  children,
  className,
  variant = "default",
  hover = true,
  as: Tag = "div",
  style,
  onClick,
  "data-reveal": dataReveal,
}: LiquidGlassCardProps) {
  return (
    <Tag
      className={cn(
        variantClasses[variant],
        hover && "liquid-glass-hover",
        "noise-overlay",
        className
      )}
      style={style}
      onClick={onClick}
      data-reveal={dataReveal}
    >
      {children}
    </Tag>
  );
}
