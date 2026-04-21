import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/sections";

export const metadata: Metadata = {
  title: "CMS",
};

export default function CMSPage() {
  return (
    <PlaceholderPage
      eyebrow="Admin CMS"
      title="Manage customer-facing content."
      description="This route is reserved for service pages, FAQ content, homepage copy, and support information managed by admin users."
      highlights={[
        "CMS route scaffolded",
        "Ready for editable content models",
        "Prepared for public page publishing states",
      ]}
      note="CMS forms, publishing workflow, and content persistence are intentionally deferred until the data layer is designed."
    />
  );
}
