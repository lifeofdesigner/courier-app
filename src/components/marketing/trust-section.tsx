import { CmsIcon } from "@/components/marketing/cms-icon";
import { Container } from "@/components/layout";
import { SectionHeading } from "@/components/ui";
import type { TrustSectionContent } from "@/types/cms";

export type TrustSectionProps = {
  content: TrustSectionContent;
};

export function TrustSection({ content }: TrustSectionProps) {
  return (
    <section className="bg-background py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow={content.eyebrow}
          title={content.title}
          description={content.description}
          align="center"
        />
        {content.metrics.length > 0 ? (
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {content.metrics.map((metric) => (
              <div
                key={`${metric.value}-${metric.label}`}
                className="rounded-lg border border-border bg-white p-5 text-center shadow-sm"
              >
                <p className="text-3xl font-bold tracking-tight text-navy">
                  {metric.value}
                </p>
                <p className="mt-2 text-sm font-bold uppercase tracking-wide text-primary">
                  {metric.label}
                </p>
                {metric.description ? (
                  <p className="mt-3 text-sm leading-6 text-muted">
                    {metric.description}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {content.features.map((feature) => (
            <div
              key={feature.title}
              className="flex gap-3 rounded-lg border border-border bg-white p-5 shadow-sm"
            >
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <CmsIcon name={feature.icon} className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-semibold text-navy">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
