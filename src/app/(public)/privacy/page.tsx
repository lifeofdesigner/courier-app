import type { Metadata } from "next";

import { LegalContent, SeoJsonLd } from "@/components/marketing";
import { getPublicPageSettings } from "@/lib/queries/public-pages";
import { createPageMetadata, getOrganizationJsonLd } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Privacy Policy",
  description:
    "Review how customer information, account details, booking data, communications, and privacy contact options may be handled.",
  path: "/privacy",
});

function buildSections(siteName: string, email: string) {
  return [
  {
    title: "Overview",
    paragraphs: [
      `${siteName} may handle information connected to website visits, quote requests, bookings, customer accounts, support conversations, and shipment tracking.`,
      "This page gives customers a practical privacy summary. It should be reviewed by qualified counsel before launch in a specific jurisdiction.",
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
      `When you contact ${siteName}, we may use your contact details and message content to respond to your request and coordinate service support.`,
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
      `For privacy questions, contact ${siteName} at ${email}. Include enough detail for the team to identify the account, shipment, or request you are asking about.`,
    ],
  },
  ];
}

export default async function PrivacyPolicyPage() {
  const settings = await getPublicPageSettings();
  const siteName = settings.siteIdentity.siteName;
  const email = settings.companyContact.email;
  const sections = buildSections(siteName, email);

  return (
    <>
      <SeoJsonLd data={getOrganizationJsonLd()} />
      <LegalContent
        eyebrow="Privacy Policy"
        title="Privacy information for customers and shippers."
        description={`${siteName} provides this customer-facing summary for quote, booking, shipment tracking, account access, and support information.`}
        lastUpdated="April 21, 2026"
        sections={sections}
      />
    </>
  );
}
