import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock3,
  MapPin,
  PackageCheck,
  ShieldCheck,
  Truck,
} from "lucide-react";

import { Container } from "@/components/layout";
import { Badge, Button, Card, Input, SectionHeading } from "@/components/ui";
import { buttonVariants } from "@/components/ui/button";
import { ctaLabels, servicesPreview, trustSignals } from "@/constants/site";

const heroStats = [
  { label: "Pickup windows", value: "Same day" },
  { label: "Tracking visibility", value: "End to end" },
  { label: "Support coverage", value: "Business hours" },
] as const;

export default function HomePage() {
  return (
    <main>
      <section className="border-b border-border bg-white">
        <Container className="grid gap-12 py-14 sm:py-18 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-20">
          <div>
            <Badge tone="primary">Courier services built for clarity</Badge>
            <h1 className="mt-5 max-w-4xl text-4xl font-bold tracking-tight text-navy sm:text-5xl lg:text-6xl">
              Ship with confidence from pickup to proof of delivery.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
              Atlas Courier helps businesses and individuals book pickups,
              compare delivery options, and follow shipments through a clean,
              dependable courier experience.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/quote"
                className={buttonVariants({ variant: "primary", size: "lg" })}
              >
                {ctaLabels.quote}
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
              <Link
                href="/book"
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                {ctaLabels.book}
              </Link>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {heroStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg border border-border bg-background px-4 py-3"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-sm font-bold text-navy">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-background p-4 shadow-sm">
            <div className="rounded-lg border border-border bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
                <div>
                  <p className="text-sm font-bold text-navy">
                    Shipment AX-2048
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    Newark, NJ to Chicago, IL
                  </p>
                </div>
                <Badge tone="success">On schedule</Badge>
              </div>
              <div className="mt-6 space-y-5">
                {[
                  {
                    icon: PackageCheck,
                    title: "Pickup confirmed",
                    meta: "9:15 AM",
                    active: true,
                  },
                  {
                    icon: Truck,
                    title: "In transit",
                    meta: "12:40 PM",
                    active: true,
                  },
                  {
                    icon: MapPin,
                    title: "Destination facility",
                    meta: "Expected today",
                    active: false,
                  },
                ].map((event) => {
                  const Icon = event.icon;

                  return (
                    <div key={event.title} className="flex gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <Icon aria-hidden="true" className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-navy">
                          {event.title}
                        </p>
                        <p className="text-sm text-muted">{event.meta}</p>
                      </div>
                      {event.active ? (
                        <CheckCircle2
                          aria-hidden="true"
                          className="mt-1 h-4 w-4 text-emerald-600"
                        />
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-background py-10">
        <Container>
          <Card className="p-5 sm:p-6">
            <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-primary">
                  Track a shipment
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-navy">
                  Get a clear shipment status in seconds.
                </h2>
              </div>
              <form action="/track" className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <Input
                  aria-label="Tracking number"
                  name="trackingNumber"
                  placeholder="Enter tracking number"
                />
                <Button type="submit" size="lg">
                  {ctaLabels.track}
                </Button>
              </form>
            </div>
          </Card>
        </Container>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <Container>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Services"
              title="Courier options for everyday and urgent delivery needs."
              description="Start with the core services customers expect from a modern courier company, without clutter or complicated choices."
            />
            <Link
              href="/services"
              className={buttonVariants({ variant: "outline" })}
            >
              View services
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {servicesPreview.map((service, index) => {
              const icons = [Clock3, Truck, Building2] as const;
              const Icon = icons[index];

              return (
                <Card key={service.title} className="p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-xl font-bold tracking-tight text-navy">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted">
                    {service.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="bg-navy py-14 text-white sm:py-16">
        <Container className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-primary">
              Quote before you ship
            </p>
            <h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
              Compare courier options and plan pickup details before booking.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              The MVP quote flow is scaffolded for shipment details, service
              selection, and pricing review in the next phase.
            </p>
          </div>
          <Link
            href="/quote"
            className={buttonVariants({
              variant: "primary",
              size: "lg",
              className: "bg-white text-navy hover:bg-slate-100",
            })}
          >
            {ctaLabels.quote}
          </Link>
        </Container>
      </section>

      <section className="bg-background py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Why customers choose us"
            title="Trust-building details for repeat shipping."
            description="The interface is designed around the practical questions customers have every time they hand over a package."
            align="center"
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {trustSignals.map((signal) => (
              <div
                key={signal}
                className="flex gap-3 rounded-lg border border-border bg-white p-5 shadow-sm"
              >
                <ShieldCheck
                  aria-hidden="true"
                  className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                />
                <p className="font-semibold text-navy">{signal}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <Container>
          <div className="rounded-xl border border-border bg-background p-8 sm:p-10 lg:flex lg:items-center lg:justify-between lg:gap-10">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-primary">
                Ready to move a shipment?
              </p>
              <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-navy sm:text-4xl">
                Book a pickup or request a quote from the same clean workflow.
              </h2>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:mt-0">
              <Link
                href="/book"
                className={buttonVariants({ variant: "primary", size: "lg" })}
              >
                {ctaLabels.book}
              </Link>
              <Link
                href="/contact"
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                Talk to support
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
