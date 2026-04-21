import type { Metadata } from "next";
import { Clock3, Globe2, PackageCheck, Truck } from "lucide-react";

import { Container } from "@/components/layout";
import { Card, PageHero, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Services",
};

const services = [
  {
    title: "Same-day courier",
    description:
      "Urgent local delivery for contracts, parts, retail orders, and business-critical parcels.",
    icon: Clock3,
  },
  {
    title: "Next-day delivery",
    description:
      "Reliable regional service when customers need a clear commitment without same-day urgency.",
    icon: PackageCheck,
  },
  {
    title: "Scheduled pickup",
    description:
      "One-time and recurring pickup planning for teams that ship on a predictable cadence.",
    icon: Truck,
  },
  {
    title: "International courier",
    description:
      "A foundation for cross-border shipment requests, customs details, and service selection.",
    icon: Globe2,
  },
] as const;

export default function ServicesPage() {
  return (
    <main>
      <PageHero
        eyebrow="Services"
        title="Courier services with clear expectations."
        description="The service catalog keeps customer choices simple while leaving room for operational detail in the next phase."
      />
      <Container className="py-14 sm:py-16">
        <SectionHeading
          title="Service foundations"
          description="Each service card is ready for pricing rules, zones, service levels, and booking flows."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <Card key={service.title} className="p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </span>
                <h2 className="mt-5 text-xl font-bold tracking-tight text-navy">
                  {service.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-muted">
                  {service.description}
                </p>
              </Card>
            );
          })}
        </div>
      </Container>
    </main>
  );
}
