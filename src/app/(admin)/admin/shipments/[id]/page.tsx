import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdminPageHeader, ShipmentDetailShell } from "@/components/admin";
import { getAdminShipmentDetail } from "@/lib/queries/admin";

export const metadata: Metadata = {
  title: "Shipment Detail",
};

type ShipmentDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ShipmentDetailPage({
  params,
}: ShipmentDetailPageProps) {
  const { id } = await params;
  const shipment = await getAdminShipmentDetail(id);

  if (!shipment) {
    notFound();
  }

  return (
    <>
      <AdminPageHeader
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Shipments", href: "/admin/shipments" },
          { label: shipment.trackingNumber },
        ]}
        title={`Shipment ${shipment.trackingNumber}`}
        description="Inspect linked customer ownership, sender, recipient, addresses, payment, package details, label readiness, and the full customer-visible tracking timeline."
        status={{ label: "Shipment record", tone: "info" }}
        primaryAction={{
          label: "Public Tracking",
          href: `/track?tracking=${shipment.trackingNumber}`,
        }}
        secondaryAction={{ label: "All Shipments", href: "/admin/shipments" }}
      />

      <ShipmentDetailShell shipment={shipment} />
    </>
  );
}
