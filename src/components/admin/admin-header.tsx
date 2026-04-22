import Link from "next/link";

export type AdminHeaderProps = {
  title: string;
  description: string;
  adminName?: string | null;
  primaryAction?: {
    label: string;
    href: string;
  };
};

export function AdminHeader({
  title,
  description,
  adminName,
  primaryAction,
}: AdminHeaderProps) {
  return (
    <header className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-[#b0825f]">
            Admin workspace{adminName ? ` - ${adminName}` : ""}
          </p>
          <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight text-[#2b1d16] sm:text-4xl">
            {title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            {description}
          </p>
        </div>
        {primaryAction ? (
          <Link
            href={primaryAction.href}
            className="inline-flex h-11 items-center justify-center rounded-2xl bg-[#b0825f] px-5 text-sm font-semibold text-white transition hover:bg-[#9a704f] focus:outline-none focus:ring-4 focus:ring-[#b0825f]/20"
          >
            {primaryAction.label}
          </Link>
        ) : null}
      </div>
    </header>
  );
}
