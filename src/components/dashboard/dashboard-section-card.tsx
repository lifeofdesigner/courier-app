import Link from "next/link";
import type { ReactNode } from "react";

export type DashboardSectionCardProps = {
  title: string;
  description?: string;
  action?: {
    label: string;
    href: string;
  };
  children: ReactNode;
};

export function DashboardSectionCard({
  title,
  description,
  action,
  children,
}: DashboardSectionCardProps) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-navy">
            {title}
          </h2>
          {description ? (
            <p className="mt-2 text-sm leading-7 text-slate-600">
              {description}
            </p>
          ) : null}
        </div>
        {action ? (
          <Link
            href={action.href}
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-navy transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200"
          >
            {action.label}
          </Link>
        ) : null}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}
