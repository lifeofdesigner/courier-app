import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/sections";

export const metadata: Metadata = {
  title: "Manage Quotes",
};

export default function ManageQuotesPage() {
  return (
    <PlaceholderPage
      eyebrow="Admin quotes"
      title="Review and manage customer quote requests."
      description="This route will support quote review, service selection, pricing status, and follow-up actions for booking conversion."
      highlights={[
        "Admin quotes route scaffolded",
        "Ready for quote status workflows",
        "Prepared for customer communication history",
      ]}
      note="Pricing rules, quote approvals, and customer notifications are intentionally not implemented in Phase 1."
    />
  );
}
