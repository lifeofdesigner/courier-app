import type { ReactNode } from "react";

export type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
  footer,
}: AuthShellProps) {
  return (
    <main className="bg-slate-50">
      <section className="py-16 lg:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-xl">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-sm font-bold uppercase tracking-wide text-[#FF6B2B]">
                {eyebrow}
              </p>
              <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight text-[#0B1C3A] sm:text-4xl">
                {title}
              </h1>
              <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                {description}
              </p>
              <div className="mt-8">{children}</div>
              {footer ? <div className="mt-6">{footer}</div> : null}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
