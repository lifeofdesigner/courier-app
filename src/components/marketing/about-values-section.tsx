import type { LucideIcon } from "lucide-react";

type ValueItem = {
  title: string;
  description: string;
  icon: LucideIcon;
};

type AboutValuesSectionProps = {
  title: string;
  description: string;
  values: readonly ValueItem[];
};

export function AboutValuesSection({
  title,
  description,
  values,
}: AboutValuesSectionProps) {
  return (
    <section>
      <div className="max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-wide text-[#FF6B2B]">
          How we operate
        </p>
        <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-[#0B1C3A]">
          {title}
        </h2>
        <p className="mt-4 text-base leading-8 text-slate-600">
          {description}
        </p>
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {values.map((value) => {
          const Icon = value.icon;

          return (
            <article
              key={value.title}
              className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm"
            >
              <Icon aria-hidden="true" className="h-6 w-6 text-[#FF6B2B]" />
              <h3 className="mt-5 font-heading text-xl font-bold tracking-tight text-[#0B1C3A]">
                {value.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {value.description}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
