import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/sections";

export const metadata: Metadata = {
  title: "My Quotes",
};

export default function MyQuotesPage() {
  return (
    <PlaceholderPage
      eyebrow="My quotes"
      title="Quote requests and pricing decisions."
      description="Customers will use this route to review saved quote requests, selected service levels, and follow-up booking actions."
      highlights={[
        "Customer quote list route scaffolded",
        "Ready for quote statuses and service levels",
        "Prepared for future booking conversion flows",
      ]}
    />
  );
}
