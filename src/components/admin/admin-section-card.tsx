import Link from "next/link";
import type { ReactNode } from "react";

export type AdminSectionCardProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  action?: {
    label: string;
    href: string;
  };
  id?: string;
  className?: string;
  contentClassName?: string;
  children: ReactNode;
};

export function AdminSectionCard({
  title,
  description,
  eyebrow,
  action,
  id,
  className,
  contentClassName,
  children,
}: AdminSectionCardProps) {
  return (
    <section
      id={id}
      className={`rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm ${
        className ?? ""
      }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          {eyebrow ? (
            <p className="text-xs font-bold uppercase text-[#b0825f]">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="text-xl font-bold text-[#2b1d16]">{title}</h2>
          {description ? (
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
              {description}
            </p>
          ) : null}
        </div>
        {action ? (
          <Link
            href={action.href}
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-[#2b1d16] transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200"
          >
            {action.label}
          </Link>
        ) : null}
      </div>
      <div className={contentClassName ?? "mt-6"}>{children}</div>
    </section>
  );
}
