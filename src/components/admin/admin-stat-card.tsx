import type { ReactNode } from "react";

export type AdminStatCardProps = {
  title?: string;
  label?: string;
  value: string | number;
  delta?: string;
  description?: string;
  helperText?: string;
  icon?: ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger" | "info";
};

const toneClasses = {
  neutral: "bg-[#f4efe8] text-[#2b1d16]",
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-700",
  danger: "bg-rose-50 text-rose-700",
  info: "bg-blue-50 text-blue-700",
};

export function AdminStatCard({
  title,
  label,
  value,
  delta,
  description,
  helperText,
  icon,
  tone = "neutral",
}: AdminStatCardProps) {
  const displayTitle = title ?? label ?? "Metric";
  const supportingText = helperText ?? description;

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-semibold text-slate-500">{displayTitle}</p>
        {icon ? (
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-2xl ${toneClasses[tone]}`}
          >
            {icon}
          </span>
        ) : null}
      </div>
      <p className="mt-3 font-heading text-3xl font-bold text-[#2b1d16]">
        {value}
      </p>
      {delta || supportingText ? (
        <div className="mt-2 space-y-1">
          {delta ? (
            <p className="text-xs font-bold uppercase text-[#b0825f]">{delta}</p>
          ) : null}
          {supportingText ? (
            <p className="text-sm leading-6 text-slate-600">{supportingText}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
