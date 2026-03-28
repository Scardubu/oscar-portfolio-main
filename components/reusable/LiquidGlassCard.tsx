"use client";

import {
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "cyan" | "violet" | "teal" | "float";

interface LiquidGlassCardOwnProps {
  variant?: Variant;
  hover?: boolean;
  depth?: boolean;
  className?: string;
  children: ReactNode;
}

type LiquidGlassCardProps<T extends ElementType = "div"> =
  LiquidGlassCardOwnProps & {
    as?: T;
  } & Omit<ComponentPropsWithoutRef<T>, keyof LiquidGlassCardOwnProps | "as">;

const variantClass: Record<Variant, string> = {
  default: "liquid-glass",
  cyan: "liquid-glass liquid-glass-cyan",
  violet: "liquid-glass liquid-glass-violet",
  teal: "liquid-glass liquid-glass-teal",
  float: "liquid-glass liquid-glass-float",
};

export function LiquidGlassCard<T extends ElementType = "div">({
  as,
  variant = "default",
  hover = true,
  depth = false,
  className,
  children,
  ...rest
}: LiquidGlassCardProps<T>) {
  const Component = (as ?? "div") as ElementType;

  const content = depth ? (
    <div className="liquid-depth-layer h-full w-full rounded-[inherit] p-6 md:p-8">
      {children}
    </div>
  ) : (
    children
  );

  return (
    <Component
      className={cn(
        variantClass[variant],
        hover && !depth && "liquid-glass-hover",
        depth && "liquid-glass-depth-shell",
        className
      )}
      {...rest}
    >
      {content}
    </Component>
  );
}

export default LiquidGlassCard;
