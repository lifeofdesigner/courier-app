import Link from "next/link";
import type { Metadata } from "next";
import {
  BadgeCheck,
  Boxes,
  Clock3,
  FileCheck2,
  Globe2,
  PackageCheck,
  Route,
  Truck,
} from "lucide-react";

import {
  SeoJsonLd,
  ServiceDetailGrid,
  ServiceLaneSection,
} from "@/components/marketing";
import { createPageMetadata, getOrganizationJsonLd } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Courier Services",
  description:
    "Explore same-day courier, economy delivery, business shipping, tracking, proof of delivery, and customs-aware courier support from Atlas Courier.",
  path: "/services",
  keywords: [
    "courier services",
    "same-day courier",
    "business shipping",
    "economy delivery",
    "proof of delivery",
  ],
});

const services = [
  {
    title: "Express delivery",
    description:
      "Priority courier handling for urgent documents, retail orders, replacement parts, and time-sensitive business parcels.",
    icon: Clock3,
    bullets: [
      "Same-day and next-flight style routing where available",
      "Clear pickup windows and delivery expectations",
      "Live tracking milestones for shipment visibility",
    ],
  },
  {
    title: "Economy delivery",
    description:
      "Reliable scheduled delivery for parcels that need dependable handling without express urgency.",
    icon: PackageCheck,
    bullets: [
      "Planned collection windows for predictable shipping",
      "Cost-aware service selection for routine lanes",
      "Delivery updates from pickup through completion",
    ],
  },
  {
    title: "Business shipping",
    description:
      "Courier support for teams sending customer orders, branch transfers, samples, documents, and recurring shipment batches.",
    icon: Boxes,
    bullets: [
      "Support for multi-piece and recurring pickups",
      "Operational notes for reception, loading bays, and access",
      "Quote and booking flows built for repeat use",
    ],
  },
  {
    title: "International support",
    description:
      "Cross-border courier planning with practical customs information and cleaner documentation handoffs.",
    icon: Globe2,
    bullets: [
      "Customs detail prompts for international shipments",
      "Recipient and delivery contact readiness checks",
      "Support for commercial paperwork conversations",
    ],
  },
] as const;

const workflowSteps = [
  {
    title: "Request a quote",
    description:
      "Share pickup, destination, package, timing, and value details so the right service level can be estimated before booking.",
  },
  {
    title: "Book the pickup",
    description:
      "Confirm collection details, contact information, pickup date, and any access notes that help dispatch avoid avoidable delays.",
  },
  {
    title: "Track the movement",
    description:
      "Follow shipment milestones as the parcel moves from pickup through transit, final-mile routing, and delivery.",
  },
  {
    title: "Close with proof",
    description:
      "Delivery completion can be supported with recipient details, timestamps, and proof of delivery records when available.",
  },
] as const;

const supportHighlights = [
  {
    title: "Proof of delivery",
    description:
      "Give senders and internal teams a clean delivery close-out record when a shipment is completed.",
    icon: FileCheck2,
  },
  {
    title: "Tracking visibility",
    description:
      "Use clear milestones instead of vague status updates so customers understand what happened and what comes next.",
    icon: Route,
  },
  {
    title: "Handling discipline",
    description:
      "Keep package notes, delivery contacts, declared value, and service expectations connected to the shipment.",
    icon: BadgeCheck,
  },
  {
    title: "Pickup coordination",
    description:
      "Plan driver handoffs around reception, loading access, business hours, and recipient availability.",
    icon: Truck,
  },
] as const;

export default function ServicesPage() {
  return (
    <main>
      <SeoJsonLd data={getOrganizationJsonLd()} />
      <section className="py-16 lg:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-wide text-[#FF6B2B]">
              Services
            </p>
            <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight text-[#0B1C3A] lg:text-5xl">
              Courier services built around clear delivery expectations.
            </h1>
            <p className="mt-4 text-base leading-8 text-slate-600">
              Atlas Courier supports urgent local delivery, planned economy
              movement, recurring business pickups, and international shipment
              conversations with practical operations detail at every handoff.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/quote"
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#FF6B2B] px-5 text-sm font-semibold text-white transition hover:bg-[#e85f22] focus:outline-none focus:ring-4 focus:ring-[#FF6B2B]/20"
              >
                Get a Quote
              </Link>
              <Link
                href="/book"
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-[#0B1C3A] transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200"
              >
                Book Pickup
              </Link>
            </div>
          </div>

          <div className="mt-12">
            <ServiceDetailGrid services={[...services]} />
          </div>

          <div className="mt-12">
            <ServiceLaneSection
              title="From pickup request to delivery confirmation."
              description="The service experience is designed to keep shippers, recipients, and operations teams aligned before the parcel moves and after delivery is complete."
              steps={[...workflowSteps]}
            />
          </div>

          <section className="mt-12">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-wide text-[#FF6B2B]">
                Service support
              </p>
              <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-[#0B1C3A]">
                Details that reduce delivery friction.
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-600">
                Strong courier service is more than speed. It is the ability to
                plan pickups, explain status clearly, and resolve practical
                questions before they become missed deliveries.
              </p>
            </div>
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {supportHighlights.map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.title}
                    className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <Icon
                      aria-hidden="true"
                      className="h-6 w-6 text-[#FF6B2B]"
                    />
                    <h3 className="mt-5 font-heading text-xl font-bold tracking-tight text-[#0B1C3A]">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {item.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
