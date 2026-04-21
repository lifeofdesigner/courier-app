import { company } from "@/constants/site";

export type TrackingStatusEmailProps = {
  trackingNumber: string;
  recipientName: string;
  status: string;
  label: string;
  description?: string | null;
  trackingUrl: string;
};

export function TrackingStatusEmail({
  trackingNumber,
  recipientName,
  status,
  label,
  description,
  trackingUrl,
}: TrackingStatusEmailProps) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", color: "#0F172A" }}>
      <h1 style={{ color: "#0B1C3A" }}>Shipment status updated</h1>
      <p>Hello,</p>
      <p>
        The shipment for {recipientName} is now marked as{" "}
        <strong>{status.replaceAll("_", " ")}</strong>.
      </p>
      <p>
        <strong>{label}</strong>
      </p>
      {description ? <p>{description}</p> : null}
      <p>Tracking number: {trackingNumber}</p>
      <p>
        <a href={trackingUrl} style={{ color: "#FF6B2B", fontWeight: 700 }}>
          View tracking
        </a>
      </p>
      <p>{company.name}</p>
    </div>
  );
}
