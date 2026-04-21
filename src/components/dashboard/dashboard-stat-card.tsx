import type { ReactNode } from "react";

export type DashboardStatCardProps = {
  label: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
};

export function DashboardStatCard({
  label,
  value,
  description,
  icon,
}: DashboardStatCardProps) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        {icon ? (
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#FF6B2B]/10 text-[#FF6B2B]">
            {icon}
          </span>
        ) : null}
      </div>
      <p className="mt-3 font-heading text-3xl font-bold tracking-tight text-[#0B1C3A]">
        {value}
      </p>
      {description ? (
        <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      ) : null}
    </div>
  );
}
