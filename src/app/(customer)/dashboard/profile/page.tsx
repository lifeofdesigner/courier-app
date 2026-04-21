import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/sections";

export const metadata: Metadata = {
  title: "Profile",
};

export default function ProfilePage() {
  return (
    <PlaceholderPage
      eyebrow="Profile"
      title="Customer account and shipping preferences."
      description="This page is structured for contact details, saved addresses, company information, and notification preferences."
      highlights={[
        "Customer profile route scaffolded",
        "Ready for saved addresses and contact records",
        "Prepared for account settings integration",
      ]}
    />
  );
}
