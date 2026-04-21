import { CmsIcon } from "@/components/marketing/cms-icon";
import { Container } from "@/components/layout";
import { Badge } from "@/components/ui";
import type { CoverageBlurb } from "@/types/cms";

export type CoverageSectionProps = {
  content: CoverageBlurb;
};

export function CoverageSection({ content }: CoverageSectionProps) {
  return (
    <section className="bg-white py-16 sm:py-20">
      <Container className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-primary">
            {content.eyebrow}
          </p>
          <h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-navy sm:text-4xl">
            {content.title}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted sm:text-lg">
            {content.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {content.regions.map((region) => (
              <Badge key={region} tone="neutral">
                {region}
              </Badge>
            ))}
          </div>
          {content.metrics.length > 0 ? (
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {content.metrics.map((metric) => (
                <div
                  key={`${metric.value}-${metric.label}`}
                  className="rounded-lg border border-border bg-background p-4"
                >
                  <p className="text-2xl font-bold text-navy">{metric.value}</p>
                  <p className="mt-1 text-sm font-bold uppercase tracking-wide text-primary">
                    {metric.label}
                  </p>
                  {metric.description ? (
                    <p className="mt-2 text-sm leading-6 text-muted">
                      {metric.description}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="rounded-lg border border-border bg-background p-5 shadow-sm">
          {content.image ? (
            <div
              role="img"
              aria-label={content.image.alt}
              className="mb-5 h-44 rounded-lg bg-cover bg-center"
              style={{ backgroundImage: `url(${content.image.src})` }}
            />
          ) : null}
          <div className="grid gap-4">
            {content.operations.map((operation) => (
              <div
                key={operation.title}
                className="rounded-lg border border-border bg-white p-5"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <CmsIcon name={operation.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-lg font-bold tracking-tight text-navy">
                  {operation.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {operation.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
