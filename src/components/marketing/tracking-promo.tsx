import { Search } from "lucide-react";

import { Container } from "@/components/layout";
import { Button, Card, Input } from "@/components/ui";
import type { TrackingPromoContent } from "@/types/cms";

export type TrackingPromoProps = {
  content: TrackingPromoContent;
};

export function TrackingPromo({ content }: TrackingPromoProps) {
  return (
    <section className="bg-background py-10">
      <Container>
        <Card className="p-5 sm:p-6">
          <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-primary">
                {content.eyebrow}
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-navy">
                {content.title}
              </h2>
              {content.description ? (
                <p className="mt-3 text-sm leading-6 text-muted">
                  {content.description}
                </p>
              ) : null}
            </div>
            <form
              action={content.actionHref}
              className="grid gap-3 sm:grid-cols-[1fr_auto]"
            >
              <Input
                aria-label={content.inputLabel}
                name="trackingNumber"
                placeholder={content.inputPlaceholder}
                helperText={content.helperText}
              />
              <Button type="submit" size="lg" className="sm:mt-0">
                <Search aria-hidden="true" className="h-4 w-4" />
                {content.submitLabel}
              </Button>
            </form>
          </div>
        </Card>
      </Container>
    </section>
  );
}
