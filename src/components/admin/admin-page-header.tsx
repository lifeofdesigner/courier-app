import Link from "next/link";

import { AdminStatusPill, type AdminStatusTone } from "./admin-status-pill";

export type AdminPageBreadcrumb = {
  label: string;
  href?: string;
};

export type AdminPageAction = {
  label: string;
  href: string;
  download?: string;
};

export type AdminPageHeaderProps = {
  breadcrumbs?: AdminPageBreadcrumb[];
  title: string;
  description: string;
  status?: {
    label: string;
    tone?: AdminStatusTone;
  };
  primaryAction?: AdminPageAction;
  secondaryAction?: AdminPageAction;
};

export function AdminPageHeader({
  breadcrumbs,
  title,
  description,
  status,
  primaryAction,
  secondaryAction,
}: AdminPageHeaderProps) {
  function renderAction(action: AdminPageAction, variant: "primary" | "secondary") {
    const className =
      variant === "primary"
        ? "inline-flex h-11 items-center justify-center rounded-2xl bg-[#b0825f] px-5 text-sm font-semibold text-white transition hover:opacity-95 focus:outline-none focus:ring-4 focus:ring-[#b0825f]/20"
        : "inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-[#2b1d16] transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200";

    if (action.download) {
      return (
        <a href={action.href} download={action.download} className={className}>
          {action.label}
        </a>
      );
    }

    return (
      <Link href={action.href} className={className}>
        {action.label}
      </Link>
    );
  }

  return (
    <header className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
      {breadcrumbs?.length ? (
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
            {breadcrumbs.map((item, index) => (
              <li key={`${item.label}-${index}`} className="flex items-center gap-2">
                {item.href ? (
                  <Link
                    href={item.href}
                    className="transition hover:text-[#2b1d16]"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-[#2b1d16]">{item.label}</span>
                )}
                {index < breadcrumbs.length - 1 ? (
                  <span aria-hidden="true" className="text-slate-300">
                    /
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
        </nav>
      ) : null}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          {status ? (
            <div className="mb-3">
              <AdminStatusPill label={status.label} tone={status.tone} />
            </div>
          ) : null}
          <h1 className="font-heading text-3xl font-bold text-[#2b1d16] sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
            {description}
          </p>
        </div>

        {primaryAction || secondaryAction ? (
          <div className="flex flex-wrap gap-3">
            {secondaryAction ? renderAction(secondaryAction, "secondary") : null}
            {primaryAction ? renderAction(primaryAction, "primary") : null}
          </div>
        ) : null}
      </div>
    </header>
  );
}
