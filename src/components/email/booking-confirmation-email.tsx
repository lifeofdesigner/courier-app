import { company } from "@/constants/site";

export type BookingConfirmationEmailProps = {
  bookingId: string;
  senderName: string;
  recipientName: string;
  serviceType: string;
  pickupDate: string;
  pickupWindow: string | null;
  amountDue: number;
  currency: string;
  paymentUrl?: string;
};

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function BookingConfirmationEmail({
  bookingId,
  senderName,
  recipientName,
  serviceType,
  pickupDate,
  pickupWindow,
  amountDue,
  currency,
  paymentUrl,
}: BookingConfirmationEmailProps) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", color: "#0F172A" }}>
      <h1 style={{ color: "#0B1C3A" }}>Booking request received</h1>
      <p>Hello {senderName},</p>
      <p>
        We received your {serviceType.toLowerCase()} courier booking for{" "}
        {recipientName}. Your booking reference is <strong>{bookingId}</strong>.
      </p>
      <ul>
        <li>Pickup date: {formatDate(pickupDate)}</li>
        <li>Pickup window: {pickupWindow ?? "To be confirmed"}</li>
        <li>Amount due: {formatMoney(amountDue, currency)}</li>
      </ul>
      <p>
        The next step is payment. Once payment is confirmed securely by Stripe,
        we will create the shipment record and make the printable label
        available.
      </p>
      {paymentUrl ? (
        <p>
          <a href={paymentUrl} style={{ color: "#FF6B2B", fontWeight: 700 }}>
            Continue to payment
          </a>
        </p>
      ) : null}
      <p>Thank you for choosing {company.name}.</p>
    </div>
  );
}
