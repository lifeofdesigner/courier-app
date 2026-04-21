import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/sections";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <PlaceholderPage
      eyebrow="About"
      title="A courier brand built around reliability."
      description="Atlas Courier presents a professional, straightforward company story focused on dependable delivery, operational discipline, and customer support."
      highlights={[
        "Company overview route scaffolded",
        "Trust-focused copy direction established",
        "Ready for CMS-managed company content",
      ]}
    />
  );
}
