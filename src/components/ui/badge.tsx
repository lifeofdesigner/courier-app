import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";
import type { StatusTone } from "@/types/ui";

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: StatusTone;
};

const toneClasses: Record<StatusTone, string> = {
  neutral: "bg-slate-100 text-slate-700 ring-slate-200",
  primary: "bg-primary/10 text-primary ring-primary/20",
  success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  warning: "bg-amber-50 text-amber-700 ring-amber-200",
  danger: "bg-red-50 text-red-700 ring-red-200",
};

export function Badge({
  className,
  tone = "neutral",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}
