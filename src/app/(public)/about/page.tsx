import Link from "next/link";
import type { Metadata } from "next";
import {
  BadgeCheck,
  Clock3,
  Headphones,
  Route,
  ShieldCheck,
} from "lucide-react";

import {
  AboutStorySection,
  AboutValuesSection,
  SeoJsonLd,
} from "@/components/marketing";
import { createPageMetadata, getOrganizationJsonLd } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "About Atlas Courier",
  description:
    "Learn how Atlas Courier helps customers move important shipments with clear tracking, dependable pickup windows, and practical courier support.",
  path: "/about",
  keywords: [
    "about Atlas Courier",
    "courier company",
    "delivery operations",
    "business courier support",
  ],
});

const storyParagraphs = [
  "Atlas Courier is built for customers who need delivery to feel organized, not uncertain. Our public tools focus on the practical work of courier operations: clear pickup details, understandable tracking milestones, and support conversations that start with the shipment context already in view.",
  "The company serves households, growing teams, and operations-led businesses that depend on reliable handoffs. Whether the shipment is an urgent contract, a replacement part, a customer order, or a recurring branch transfer, the goal is the same: keep the movement clear from request to proof of delivery.",
  "This website gives customers a production-ready place to quote, book, track, and understand the service before deeper payment, email, and mapping integrations are added in future phases.",
] as const;

const stats = [
  { value: "Same day", label: "priority pickup conversations for urgent lanes" },
  { value: "End to end", label: "tracking visibility from dispatch to delivery" },
  { value: "Business first", label: "support for recurring and operational shipping" },
] as const;

const values = [
  {
    title: "Operational clarity",
    description:
      "Every shipment should have clear pickup, delivery, contact, and package details before it enters the courier workflow.",
    icon: Route,
  },
  {
    title: "Dependable timing",
    description:
      "Pickup windows and delivery expectations should be realistic, visible, and easy for customers to plan around.",
    icon: Clock3,
  },
  {
    title: "Responsible handling",
    description:
      "Package notes, declared value, recipient details, and special instructions deserve careful attention at each handoff.",
    icon: ShieldCheck,
  },
  {
    title: "Human support",
    description:
      "When customers need help, they should reach a team that understands routes, exceptions, handoffs, and urgency.",
    icon: Headphones,
  },
] as const;

const reasons = [
  "Straightforward quote and booking paths",
  "Tracking pages that make status easy to interpret",
  "Support copy shaped around real courier questions",
  "A customer dashboard foundation for repeat shipping",
] as const;

export default function AboutPage() {
  return (
    <main>
      <SeoJsonLd data={getOrganizationJsonLd()} />
      <section className="py-16 lg:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-wide text-[#FF6B2B]">
              About
            </p>
            <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight text-[#0B1C3A] lg:text-5xl">
              A courier company built for calm, accountable delivery.
            </h1>
            <p className="mt-4 text-base leading-8 text-slate-600">
              Atlas Courier combines customer-friendly booking tools with the
              operations detail courier teams need to keep pickups, transfers,
              and delivery confirmations moving cleanly.
            </p>
          </div>

          <div className="mt-12">
            <AboutStorySection
              eyebrow="Company story"
              title="Reliability starts with the handoff."
              paragraphs={[...storyParagraphs]}
              stats={[...stats]}
            />
          </div>

          <div className="mt-12">
            <AboutValuesSection
              title="The operating model is simple: clear details, careful movement, visible progress."
              description="Customers choose Atlas Courier because the service experience is practical. It asks for the right information, sets clear expectations, and keeps delivery status visible."
              values={[...values]}
            />
          </div>

          <section className="mt-12 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-[#FF6B2B]">
                  Why customers choose us
                </p>
                <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-[#0B1C3A]">
                  Courier support that respects the shipment and the schedule.
                </h2>
                <p className="mt-4 text-base leading-8 text-slate-600">
                  A good delivery partner reduces uncertainty. Atlas Courier
                  keeps the public experience focused on decisions customers
                  need to make now: service level, pickup timing, tracking, and
                  support.
                </p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/contact"
                    className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#FF6B2B] px-5 text-sm font-semibold text-white transition hover:bg-[#e85f22] focus:outline-none focus:ring-4 focus:ring-[#FF6B2B]/20"
                  >
                    Contact support
                  </Link>
                  <Link
                    href="/quote"
                    className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-[#0B1C3A] transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200"
                  >
                    Get a Quote
                  </Link>
                </div>
              </div>
              <ul className="grid gap-4">
                {reasons.map((reason) => (
                  <li
                    key={reason}
                    className="flex gap-3 rounded-[24px] border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-600"
                  >
                    <BadgeCheck
                      aria-hidden="true"
                      className="mt-1 h-5 w-5 shrink-0 text-[#FF6B2B]"
                    />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
