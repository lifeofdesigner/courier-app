import { company } from "@/constants/site";

export type PaymentConfirmationEmailProps = {
  bookingId: string;
  senderName: string;
  recipientName: string;
  amountPaid: number;
  currency: string;
  trackingNumber?: string | null;
  labelUrl?: string | null;
};

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
  }).format(value);
}

export function PaymentConfirmationEmail({
  bookingId,
  senderName,
  recipientName,
  amountPaid,
  currency,
  trackingNumber,
  labelUrl,
}: PaymentConfirmationEmailProps) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", color: "#0F172A" }}>
      <h1 style={{ color: "#0B1C3A" }}>Payment confirmed</h1>
      <p>Hello {senderName},</p>
      <p>
        Your payment for booking <strong>{bookingId}</strong> has been
        confirmed. We are preparing the shipment for {recipientName}.
      </p>
      <ul>
        <li>Amount paid: {formatMoney(amountPaid, currency)}</li>
        {trackingNumber ? <li>Tracking number: {trackingNumber}</li> : null}
      </ul>
      {labelUrl ? (
        <p>
          Your printable shipping label is ready:{" "}
          <a href={labelUrl} style={{ color: "#FF6B2B", fontWeight: 700 }}>
            open label
          </a>
        </p>
      ) : null}
      <p>
        You can track the shipment once operations begins scanning it through
        the {company.name} network.
      </p>
    </div>
  );
}
