import { ShipmentActionsCard } from "@/components/admin/shipment-actions-card";
import { ShipmentAddressCard } from "@/components/admin/shipment-address-card";
import { ShipmentOverviewCard } from "@/components/admin/shipment-overview-card";
import { ShipmentPackageCard } from "@/components/admin/shipment-package-card";
import { ShipmentPaymentCard } from "@/components/admin/shipment-payment-card";
import { ShipmentTimelineCard } from "@/components/admin/shipment-timeline-card";
import type { AdminShipmentDetail } from "@/types/admin";

export type ShipmentDetailShellProps = {
  shipment: AdminShipmentDetail;
};

export function ShipmentDetailShell({ shipment }: ShipmentDetailShellProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
      <div className="space-y-6">
        <ShipmentOverviewCard shipment={shipment} />
        <div className="grid gap-6 lg:grid-cols-2">
          <ShipmentAddressCard
            title="Sender / pickup"
            personName={shipment.senderName}
            email={shipment.senderEmail}
            phone={shipment.senderPhone}
            address={shipment.pickupAddress}
          />
          <ShipmentAddressCard
            title="Recipient / delivery"
            personName={shipment.recipientName}
            email={shipment.recipientEmail}
            phone={shipment.recipientPhone}
            address={shipment.deliveryAddress}
          />
        </div>
        <ShipmentTimelineCard shipment={shipment} />
      </div>
      <aside className="space-y-6">
        <ShipmentActionsCard shipment={shipment} />
        <ShipmentPackageCard shipment={shipment} />
        <ShipmentPaymentCard shipment={shipment} />
      </aside>
    </div>
  );
}
