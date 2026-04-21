import type { LucideIcon } from "lucide-react";

type ServiceDetail = {
  title: string;
  description: string;
  icon: LucideIcon;
  bullets: readonly string[];
};

type ServiceDetailGridProps = {
  services: readonly ServiceDetail[];
};

export function ServiceDetailGrid({ services }: ServiceDetailGridProps) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {services.map((service) => {
        const Icon = service.icon;

        return (
          <article
            key={service.title}
            className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF6B2B]/10 text-[#FF6B2B]">
              <Icon aria-hidden="true" className="h-5 w-5" />
            </span>
            <h2 className="mt-5 font-heading text-xl font-bold tracking-tight text-[#0B1C3A]">
              {service.title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {service.description}
            </p>
            <ul className="mt-5 space-y-3">
              {service.bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="flex gap-3 text-sm leading-6 text-slate-600"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF6B2B]" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </article>
        );
      })}
    </div>
  );
}
