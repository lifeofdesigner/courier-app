import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CmsIcon } from "@/components/marketing/cms-icon";
import { Container } from "@/components/layout";
import { Card, SectionHeading } from "@/components/ui";
import { buttonVariants } from "@/components/ui/button";
import type { ServicePreviewSectionContent } from "@/types/cms";

export type ServicePreviewProps = {
  content: ServicePreviewSectionContent;
};

export function ServicePreview({ content }: ServicePreviewProps) {
  return (
    <section className="bg-white py-16 sm:py-20">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow={content.eyebrow}
            title={content.title}
            description={content.description}
          />
          <Link
            href={content.cta.href}
            aria-label={content.cta.ariaLabel}
            className={buttonVariants({ variant: "outline" })}
          >
            {content.cta.label}
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {content.items.map((service) => (
            <Card key={service.title} className="p-6">
              {service.image ? (
                <div
                  role="img"
                  aria-label={service.image.alt}
                  className="mb-5 h-32 rounded-lg bg-cover bg-center"
                  style={{ backgroundImage: `url(${service.image.src})` }}
                />
              ) : (
                <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <CmsIcon name={service.icon} className="h-5 w-5" />
                </span>
              )}
              <h3 className="mt-5 text-xl font-bold tracking-tight text-navy">
                {service.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted">
                {service.description}
              </p>
              <Link
                href={service.href}
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary transition-colors hover:text-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                {content.cta.label}
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
