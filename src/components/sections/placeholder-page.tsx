import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageHero } from "@/components/ui/page-hero";
import type { PageAction } from "@/types/ui";

export type PlaceholderPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryAction?: PageAction;
  secondaryAction?: PageAction;
  highlights?: string[];
  note?: string;
};

export function PlaceholderPage({
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
  highlights = [
    "Route scaffolded for Phase 1",
    "Reusable layout and UI components in place",
    "Ready for Supabase-backed workflows in the next phase",
  ],
  note = "This screen establishes the page structure, spacing, and copy direction for the MVP. Data handling, authentication, and operational workflows will be connected in a later phase.",
}: PlaceholderPageProps) {
  const actions = [primaryAction, secondaryAction].filter(
    Boolean,
  ) as PageAction[];

  return (
    <main>
      <PageHero
        eyebrow={eyebrow}
        title={title}
        description={description}
        actions={actions}
      />
      <Container className="py-12 sm:py-16 lg:py-20" size="lg">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.7fr]">
          <Card>
            <CardHeader>
              <Badge tone="primary">MVP foundation</Badge>
              <CardTitle>Designed for the next build phase</CardTitle>
              <CardDescription>{note}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/quote"
                  className={buttonVariants({ variant: "primary" })}
                >
                  Get a quote
                </Link>
                <Link
                  href="/track"
                  className={buttonVariants({ variant: "outline" })}
                >
                  Track shipment
                </Link>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Page readiness</CardTitle>
              <CardDescription>
                The route is present, styled, and ready for production logic.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-slate-700"
                  >
                    {highlight}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </Container>
    </main>
  );
}
