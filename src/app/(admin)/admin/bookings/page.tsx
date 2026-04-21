import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/sections";

export const metadata: Metadata = {
  title: "Manage Bookings",
};

export default function ManageBookingsPage() {
  return (
    <PlaceholderPage
      eyebrow="Admin bookings"
      title="Manage pickup bookings."
      description="This route is prepared for dispatch teams to review pickup requests, confirm windows, and assign collection work."
      highlights={[
        "Admin bookings route scaffolded",
        "Ready for pickup queue management",
        "Prepared for dispatcher assignment logic",
      ]}
      note="Pickup confirmation, dispatch assignment, and operational alerts are reserved for future backend integration."
    />
  );
}
