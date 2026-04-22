import type { Metadata } from "next";

import { AdminPageHeader, CreateShipmentForm } from "@/components/admin";

export const metadata: Metadata = {
  title: "Create Shipment",
};

export default function CreateShipmentPage() {
  return (
    <>
      <AdminPageHeader
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Shipments", href: "/admin/shipments" },
          { label: "Create" },
        ]}
        title="Create Shipment"
        description="Search and link an existing customer, or create an unassigned manual shipment with mode-aware service and tracking options."
        status={{ label: "Manual intake", tone: "accent" }}
        secondaryAction={{ label: "All Shipments", href: "/admin/shipments" }}
      />

      <CreateShipmentForm />
    </>
  );
}
