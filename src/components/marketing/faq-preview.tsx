import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/layout";
import { SectionHeading } from "@/components/ui";
import { buttonVariants } from "@/components/ui/button";
import type { FAQPreviewSectionContent } from "@/types/cms";

export type FAQPreviewProps = {
  content: FAQPreviewSectionContent;
};

export function FAQPreview({ content }: FAQPreviewProps) {
  if (content.items.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-16 sm:py-20">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow={content.eyebrow}
            title={content.title}
            description={content.description}
          />
          {content.cta ? (
            <Link
              href={content.cta.href}
              aria-label={content.cta.ariaLabel}
              className={buttonVariants({ variant: "outline" })}
            >
              {content.cta.label}
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          ) : null}
        </div>
        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {content.items.map((item) => (
            <div
              key={item.question}
              className="rounded-lg border border-border bg-background p-5"
            >
              <h3 className="text-lg font-bold tracking-tight text-navy">
                {item.question}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted">{item.answer}</p>
              {item.href && content.cta ? (
                <Link
                  href={item.href}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary transition-colors hover:text-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                >
                  {content.cta.label}
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              ) : null}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
