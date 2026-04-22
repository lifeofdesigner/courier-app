import { Container } from "@/components/layout";
import { CmsIcon } from "@/components/marketing/cms-icon";
import type { HomepageWorkflowContent } from "@/types/cms";

export type HomepageWorkflowProps = {
  content: HomepageWorkflowContent;
};

export function HomepageWorkflow({ content }: HomepageWorkflowProps) {
  if (content.steps.length === 0) {
    return null;
  }

  return (
    <section className="overflow-hidden bg-[#071328] py-16 text-white sm:py-20">
      <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">
            {content.eyebrow}
          </p>
          <h2 className="mt-3 max-w-3xl font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            {content.title}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
            {content.description}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {content.steps.map((step, index) => (
              <article
                key={`${step.title}-${index}`}
                className="border border-white/10 bg-white/[0.06] p-5"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center bg-primary text-white">
                    <CmsIcon name={step.icon} className="h-5 w-5" />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                    Step {index + 1}
                  </span>
                </div>
                <h3 className="mt-5 font-heading text-lg font-bold">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="relative min-h-[28rem] overflow-hidden bg-slate-900">
          {content.image ? (
            <div
              role="img"
              aria-label={content.image.alt}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${content.image.src})` }}
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-[#071328] via-[#071328]/35 to-transparent" />
          <div className="absolute left-6 top-6 border border-white/15 bg-white/95 px-5 py-4 text-navy shadow-xl">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
              {content.badgeLabel}
            </p>
            <p className="mt-2 font-heading text-3xl font-bold">
              {content.badgeValue}
            </p>
          </div>
          <div className="absolute inset-x-6 bottom-6 border border-white/15 bg-[#071328]/85 p-5 backdrop-blur">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">
              Connected workflow
            </p>
            <p className="mt-2 text-sm leading-7 text-slate-200">
              Quote, booking, tracking, and printable shipment records stay
              aligned around the selected transport mode.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
