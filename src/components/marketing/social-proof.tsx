import { Quote } from "lucide-react";

import { Container } from "@/components/layout";
import { Card, SectionHeading } from "@/components/ui";
import type { SocialProofContent } from "@/types/cms";

export type SocialProofProps = {
  content: SocialProofContent;
};

export function SocialProof({ content }: SocialProofProps) {
  if (content.items.length === 0) {
    return null;
  }

  return (
    <section className="bg-background py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow={content.eyebrow}
          title={content.title}
          description={content.description}
          align="center"
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {content.items.map((testimonial) => (
            <Card
              key={`${testimonial.authorName}-${testimonial.companyName}`}
              className="p-6"
            >
              <Quote aria-hidden="true" className="h-6 w-6 text-primary" />
              <blockquote className="mt-4 text-base leading-7 text-navy">
                {testimonial.quote}
              </blockquote>
              <div className="mt-6 flex items-center gap-3">
                {testimonial.image ? (
                  <div
                    role="img"
                    aria-label={testimonial.image.alt}
                    className="h-11 w-11 rounded-full bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${testimonial.image.src})`,
                    }}
                  />
                ) : (
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {testimonial.authorName
                      .split(" ")
                      .map((namePart) => namePart[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                )}
                <div>
                  <p className="text-sm font-bold text-navy">
                    {testimonial.authorName}
                  </p>
                  <p className="text-sm text-muted">
                    {testimonial.authorTitle}, {testimonial.companyName}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
