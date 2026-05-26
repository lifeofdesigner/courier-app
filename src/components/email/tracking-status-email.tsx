import { getShipmentStatusMeta } from "@/types/shipment";

export type TrackingStatusEmailProps = {
  trackingNumber: string;
  recipientName: string;
  status: string;
  label: string;
  description?: string | null;
  transportMode?: string | null;
  trackingUrl: string;
  siteName: string;
  themeColors: {
    primary: string;
    navy: string;
    text: string;
  };
};

export function TrackingStatusEmail({
  trackingNumber,
  recipientName,
  status,
  label,
  description,
  transportMode,
  trackingUrl,
  siteName,
  themeColors,
}: TrackingStatusEmailProps) {
  const statusMeta = getShipmentStatusMeta(status, { mode: transportMode });

  return (
    <div style={{ fontFamily: "Arial, sans-serif", color: themeColors.text }}>
      <h1 style={{ color: themeColors.navy }}>Shipment status updated</h1>
      <p>Hello,</p>
      <p>
        The shipment for {recipientName} is now marked as{" "}
        <strong>{statusMeta.label}</strong>.
      </p>
      <p>
        <strong>{label}</strong>
      </p>
      {description ? <p>{description}</p> : null}
      <p>Tracking number: {trackingNumber}</p>
      <p>
        <a
          href={trackingUrl}
          style={{ color: themeColors.primary, fontWeight: 700 }}
        >
          View tracking
        </a>
      </p>
      <p>{siteName}</p>
    </div>
  );
}
