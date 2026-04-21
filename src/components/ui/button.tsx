import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";
import type { ComponentSize } from "@/types/ui";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ComponentSize;
  isFullWidth?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white shadow-sm hover:bg-primary/90 focus-visible:outline-primary",
  secondary:
    "bg-navy text-white shadow-sm hover:bg-navy/90 focus-visible:outline-navy",
  outline:
    "border border-border bg-white text-navy hover:border-primary/50 hover:bg-primary/5 focus-visible:outline-primary",
  ghost:
    "text-navy hover:bg-slate-100 focus-visible:outline-primary",
};

const sizeClasses: Record<ComponentSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

type ButtonVariantOptions = {
  variant?: ButtonVariant;
  size?: ComponentSize;
  isFullWidth?: boolean;
  className?: string;
};

export function buttonVariants({
  variant = "primary",
  size = "md",
  isFullWidth = false,
  className,
}: ButtonVariantOptions = {}) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50",
    variantClasses[variant],
    sizeClasses[size],
    isFullWidth && "w-full",
    className,
  );
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  isFullWidth = false,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonVariants({ variant, size, isFullWidth, className })}
      {...props}
    />
  );
}
