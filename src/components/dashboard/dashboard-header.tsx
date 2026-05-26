import Link from "next/link";

export type DashboardHeaderProps = {
  title: string;
  description: string;
  userName?: string | null;
  primaryAction?: {
    label: string;
    href: string;
  };
};

export function DashboardHeader({
  title,
  description,
  userName,
  primaryAction,
}: DashboardHeaderProps) {
  return (
    <header className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          {userName ? (
            <p className="text-sm font-bold uppercase tracking-wide text-primary">
              Signed in as {userName}
            </p>
          ) : null}
          <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight text-navy sm:text-4xl">
            {title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            {description}
          </p>
        </div>
        {primaryAction ? (
          <Link
            href={primaryAction.href}
            className="inline-flex h-11 items-center justify-center rounded-2xl bg-primary px-5 text-sm font-semibold text-white transition hover:brightness-95 focus:outline-none focus:ring-4 focus:ring-primary/20"
          >
            {primaryAction.label}
          </Link>
        ) : null}
      </div>
    </header>
  );
}
