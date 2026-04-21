import Link from "next/link";
import { Inbox } from "lucide-react";

export type DashboardEmptyStateProps = {
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
};

export function DashboardEmptyState({
  title,
  description,
  action,
}: DashboardEmptyStateProps) {
  return (
    <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50/60 p-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#FF6B2B] shadow-sm">
        <Inbox aria-hidden="true" className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-lg font-bold tracking-tight text-[#0B1C3A]">
        {title}
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-slate-600">
        {description}
      </p>
      {action ? (
        <Link
          href={action.href}
          className="mt-5 inline-flex h-11 items-center justify-center rounded-2xl bg-[#FF6B2B] px-5 text-sm font-semibold text-white transition hover:bg-[#e85f22] focus:outline-none focus:ring-4 focus:ring-[#FF6B2B]/20"
        >
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}
