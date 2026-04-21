import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/sections";

export const metadata: Metadata = {
  title: "Terms of Service",
};

export default function TermsOfServicePage() {
  return (
    <PlaceholderPage
      eyebrow="Terms of Service"
      title="Service terms for courier customers."
      description="This page provides a dedicated route for shipment terms, customer responsibilities, and future legal content."
      highlights={[
        "Terms route scaffolded",
        "Footer legal link resolves correctly",
        "Ready for final service terms before launch",
      ]}
      note="Formal terms should be reviewed and added before production launch. This scaffold keeps the legal navigation complete without adding backend behavior."
    />
  );
}
