import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/sections";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPolicyPage() {
  return (
    <PlaceholderPage
      eyebrow="Privacy Policy"
      title="Privacy information for customers and shippers."
      description="This page provides a dedicated route for customer privacy information and future legal content."
      highlights={[
        "Privacy policy route scaffolded",
        "Footer legal link resolves correctly",
        "Ready for final legal copy before launch",
      ]}
      note="Formal privacy language should be reviewed and added before production launch. This scaffold keeps the legal navigation complete without adding backend behavior."
    />
  );
}
