import type { ReactNode } from "react";

type BlogHeroProps = {
  eyebrow: string;
  title: string;
  description?: string;
  meta?: string;
  children?: ReactNode;
};

export function BlogHero({
  eyebrow,
  title,
  description,
  meta,
  children,
}: BlogHeroProps) {
  return (
    <section className="border-b border-slate-200 bg-white py-16 lg:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-wide text-[#FF6B2B]">
            {eyebrow}
          </p>
          <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight text-[#0B1C3A] lg:text-5xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-4 text-base leading-8 text-slate-600">
              {description}
            </p>
          ) : null}
          {meta ? (
            <p className="mt-5 text-sm font-semibold uppercase tracking-wide text-slate-500">
              {meta}
            </p>
          ) : null}
        </div>
        {children ? <div className="mt-10">{children}</div> : null}
      </div>
    </section>
  );
}
