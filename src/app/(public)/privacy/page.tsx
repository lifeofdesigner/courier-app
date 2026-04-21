import type { Metadata } from "next";

import { LegalContent, SeoJsonLd } from "@/components/marketing";
import { company } from "@/constants/site";
import { createPageMetadata, getOrganizationJsonLd } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Privacy Policy",
  description:
    "Review how Atlas Courier describes customer information, account details, booking data, communications, and privacy contact options.",
  path: "/privacy",
});

const sections = [
  {
    title: "Overview",
    paragraphs: [
      "This privacy policy explains, at a general level, how Atlas Courier handles information connected to website visits, quote requests, bookings, customer accounts, support conversations, and shipment tracking.",
      "This page is written as production-ready website content, but it should still be reviewed by qualified counsel before launch in a specific jurisdiction.",
    ],
  },
  {
    title: "Information we may collect",
    paragraphs: [
      "We may collect information you provide when requesting a quote, booking a pickup, creating an account, contacting support, or tracking a shipment.",
      "This may include names, email addresses, phone numbers, pickup and delivery addresses, package details, shipment references, account profile information, and support message content.",
    ],
  },
  {
    title: "How information is used",
    paragraphs: [
      "Customer and shipment information is used to provide courier services, prepare quotes, coordinate pickups, support tracking, respond to support requests, improve service quality, and protect the website from misuse.",
      "We do not claim payment processing, automated marketing email delivery, or mapping integrations in this phase unless those services are added separately.",
    ],
  },
  {
    title: "Account and shipment records",
    paragraphs: [
      "If you create an account, profile and address information may be stored so you can manage shipments, quotes, and booking details more efficiently.",
      "Shipment and tracking records may be retained for operational history, customer support, dispute handling, and internal reporting.",
    ],
  },
  {
    title: "Communications",
    paragraphs: [
      "When you contact Atlas Courier, we may use your contact details and message content to respond to your request and coordinate service support.",
      "Future email notification features may use service providers, but this phase does not implement an outbound email provider.",
    ],
  },
  {
    title: "Cookies and website data",
    paragraphs: [
      "The website may use essential cookies or similar browser storage to support authentication, session continuity, security, and normal website operation.",
      "Analytics, advertising, or advanced personalization cookies should be described here if they are added later.",
    ],
  },
  {
    title: "Privacy questions",
    paragraphs: [
      `For privacy questions, contact ${company.name} at ${company.email}. Include enough detail for the team to identify the account, shipment, or request you are asking about.`,
    ],
  },
] as const;

export default function PrivacyPolicyPage() {
  return (
    <>
      <SeoJsonLd data={getOrganizationJsonLd()} />
      <LegalContent
        eyebrow="Privacy Policy"
        title="Privacy information for customers and shippers."
        description="A clear summary of the information Atlas Courier may handle while providing quotes, bookings, shipment tracking, account access, and support."
        lastUpdated="April 21, 2026"
        sections={[...sections]}
      />
    </>
  );
}
