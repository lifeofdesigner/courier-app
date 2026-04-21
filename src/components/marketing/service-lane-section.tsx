import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

type ServiceLaneStep = {
  title: string;
  description: string;
};

type ServiceLaneSectionProps = {
  title: string;
  description: string;
  steps: readonly ServiceLaneStep[];
};

export function ServiceLaneSection({
  title,
  description,
  steps,
}: ServiceLaneSectionProps) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-[#FF6B2B]">
            Delivery workflow
          </p>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-[#0B1C3A]">
            {title}
          </h2>
          <p className="mt-4 text-base leading-8 text-slate-600">
            {description}
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/quote"
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#FF6B2B] px-5 text-sm font-semibold text-white transition hover:bg-[#e85f22] focus:outline-none focus:ring-4 focus:ring-[#FF6B2B]/20"
            >
              Get a Quote
            </Link>
            <Link
              href="/book"
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-[#0B1C3A] transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200"
            >
              Book Pickup
            </Link>
          </div>
        </div>
        <ol className="grid gap-4">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="flex gap-4 rounded-[24px] border border-slate-200 bg-slate-50 p-5"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-[#0B1C3A] shadow-sm">
                {index + 1}
              </span>
              <div>
                <h3 className="flex items-center gap-2 font-heading text-lg font-bold tracking-tight text-[#0B1C3A]">
                  <CheckCircle2
                    aria-hidden="true"
                    className="h-4 w-4 text-[#FF6B2B]"
                  />
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
