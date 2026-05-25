import type { Metadata } from "next";

import { LegalContent, SeoJsonLd } from "@/components/marketing";
import { getPublicPageSettings } from "@/lib/queries/public-pages";
import { createPageMetadata, getOrganizationJsonLd } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Terms of Service",
  description:
    "Review general service terms covering quotes, bookings, customer responsibilities, shipment restrictions, liability, and support.",
  path: "/terms",
});

function buildSections(siteName: string, email: string) {
  return [
  {
    title: "Using the service",
    paragraphs: [
      `These terms describe general expectations for using ${siteName} website tools, requesting quotes, booking pickups, tracking shipments, and contacting support.`,
      "They are intended as practical template terms for a courier website and should be reviewed by qualified counsel before production launch in a specific jurisdiction.",
    ],
  },
  {
    title: "Quotes and bookings",
    paragraphs: [
      "Quotes are based on the shipment details provided, including service level, package size, weight, route, timing, declared value, and handling requirements.",
      "A quote may not guarantee final service availability. Pickup acceptance can depend on route capacity, accurate details, operational cutoff times, and shipment eligibility.",
    ],
  },
  {
    title: "Customer responsibilities",
    paragraphs: [
      "Customers are responsible for providing accurate pickup, delivery, package, contact, and customs information where applicable.",
      "Packages should be prepared, labeled, and available at the confirmed pickup location during the agreed pickup window.",
    ],
    bullets: [
      "Use accurate recipient and sender contact details.",
      "Package items appropriately for courier handling.",
      "Disclose fragile, high-value, restricted, or time-sensitive contents.",
      "Provide access notes for reception, loading bays, security desks, or delivery constraints.",
    ],
  },
  {
    title: "Prohibited and restricted shipments",
    paragraphs: [
      "Some goods may be prohibited, restricted, or require additional review before transport. This can include hazardous materials, illegal goods, controlled substances, cash equivalents, perishables, live goods, and items requiring special permits.",
      `${siteName} may refuse, pause, or cancel a shipment if the shipment appears unsafe, unlawful, misdeclared, or unsuitable for the selected service.`,
    ],
  },
  {
    title: "Delivery, tracking, and proof",
    paragraphs: [
      "Tracking information is provided to help customers understand shipment progress. Updates may depend on operational scans, route events, carrier handoffs, or system availability.",
      "Proof of delivery may include delivery timestamp, recipient details, delivery notes, or other confirmation records when available.",
    ],
  },
  {
    title: "Liability and service limits",
    paragraphs: [
      "Courier services can be affected by weather, traffic, access issues, inaccurate shipment details, customs review, recipient availability, and other conditions outside normal operational control.",
      "Any liability limits, claims windows, insurance options, exclusions, or refund policies should be confirmed in final legal terms before production launch.",
    ],
  },
  {
    title: "Support",
    paragraphs: [
      `For service questions, shipment issues, or account support, contact ${siteName} at ${email}. Include your tracking number, quote reference, or booking details where available.`,
    ],
  },
  ];
}

export default async function TermsOfServicePage() {
  const settings = await getPublicPageSettings();
  const siteName = settings.siteIdentity.siteName;
  const email = settings.companyContact.email;
  const sections = buildSections(siteName, email);

  return (
    <>
      <SeoJsonLd data={getOrganizationJsonLd()} />
      <LegalContent
        eyebrow="Terms of Service"
        title="Service terms for courier customers."
        description={`General terms for using ${siteName} website tools, requesting quotes, booking pickups, and coordinating shipments.`}
        lastUpdated="April 21, 2026"
        sections={sections}
      />
    </>
  );
}
