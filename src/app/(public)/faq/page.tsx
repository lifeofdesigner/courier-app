import Link from "next/link";
import type { Metadata } from "next";

import { FAQList, SeoJsonLd, type FAQGroup } from "@/components/marketing";
import {
  createPageMetadata,
  getFaqPageJsonLd,
  getOrganizationJsonLd,
} from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Courier FAQ",
  description:
    "Find answers about Atlas Courier pickups, tracking, quotes, customs details, business shipping, and customer support.",
  path: "/faq",
  keywords: [
    "courier FAQ",
    "delivery questions",
    "shipment tracking help",
    "courier quote questions",
  ],
});

const faqGroups = [
  {
    title: "Shipping process",
    items: [
      {
        question: "What information do I need to book a pickup?",
        answer:
          "You need the pickup address, delivery address, sender and recipient contact details, package count, estimated weight, preferred pickup date, and any access or handling notes.",
      },
      {
        question: "Can I request same-day delivery?",
        answer:
          "Same-day delivery depends on route capacity, pickup timing, destination distance, and package readiness. Request a quote with your timing details so the right service can be reviewed.",
      },
      {
        question: "Do you handle recurring business pickups?",
        answer:
          "Yes. The service model supports recurring pickup conversations for teams shipping customer orders, branch transfers, samples, and operational parcels on a regular cadence.",
      },
    ],
  },
  {
    title: "Tracking",
    items: [
      {
        question: "Can I track a shipment without an account?",
        answer:
          "Yes. Use the public tracking page with the tracking number from your booking or shipment confirmation.",
      },
      {
        question: "What should tracking milestones show?",
        answer:
          "Tracking milestones should show the current shipment stage, recent movement, delivery route context where available, and whether the parcel is still on schedule.",
      },
      {
        question: "What if my tracking number is not found?",
        answer:
          "Check the number for typos and try again. Newly created shipments may take a short time to appear after booking or dispatch processing.",
      },
    ],
  },
  {
    title: "Quotes and booking",
    items: [
      {
        question: "What affects my courier quote?",
        answer:
          "Quotes are shaped by service speed, distance, package size, declared value, delivery lane complexity, and special handling requirements.",
      },
      {
        question: "Can I get a quote before creating an account?",
        answer:
          "Yes. The public quote flow is available before account sign-in so customers can estimate service options before booking.",
      },
      {
        question: "Does a quote guarantee final availability?",
        answer:
          "A quote helps estimate cost and service level. Final pickup availability can still depend on route capacity, accurate shipment details, and operational cutoff times.",
      },
    ],
  },
  {
    title: "Customs and international shipments",
    items: [
      {
        question: "What customs details should I prepare?",
        answer:
          "Prepare clear goods descriptions, declared values, country of origin details where relevant, recipient contact information, and supporting commercial documents.",
      },
      {
        question: "Can Atlas Courier advise on customs paperwork?",
        answer:
          "Atlas Courier can help customers understand the practical information usually needed for international courier movement, but formal customs or legal advice should come from a qualified specialist.",
      },
    ],
  },
  {
    title: "Support",
    items: [
      {
        question: "When should I contact support?",
        answer:
          "Contact support for pickup coordination, tracking questions, incorrect shipment details, delivery exceptions, quote questions, or recurring business shipping needs.",
      },
      {
        question: "What should I include in a support message?",
        answer:
          "Include your tracking number or quote reference, shipment route, contact details, preferred outcome, and any time-sensitive constraints.",
      },
    ],
  },
] satisfies FAQGroup[];

const faqJsonLdItems = faqGroups.flatMap((group) => group.items);

export default function FAQPage() {
  return (
    <main>
      <SeoJsonLd data={[getOrganizationJsonLd(), getFaqPageJsonLd(faqJsonLdItems)]} />
      <section className="py-16 lg:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-wide text-[#FF6B2B]">
              FAQ
            </p>
            <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight text-[#0B1C3A] lg:text-5xl">
              Straight answers for common courier questions.
            </h1>
            <p className="mt-4 text-base leading-8 text-slate-600">
              Find practical guidance on pickups, tracking, quotes, customs
              details, and support before you hand over a shipment.
            </p>
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-[0.72fr_0.28fr] lg:items-start">
            <FAQList groups={faqGroups} />
            <aside className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
              <h2 className="font-heading text-xl font-bold tracking-tight text-[#0B1C3A]">
                Still need help?
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Contact support with your shipment reference, route, pickup
                timing, and the question you need answered.
              </p>
              <Link
                href="/contact"
                className="mt-5 inline-flex h-12 items-center justify-center rounded-2xl bg-[#FF6B2B] px-5 text-sm font-semibold text-white transition hover:bg-[#e85f22] focus:outline-none focus:ring-4 focus:ring-[#FF6B2B]/20"
              >
                Contact support
              </Link>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
