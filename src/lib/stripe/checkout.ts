import { getSiteUrl } from "@/lib/env";
import { getStripeServerClient } from "@/lib/stripe/server";
import type { PaymentBooking } from "@/lib/queries/payments";
import {
  formatModeAwareServiceType,
  getTransportModeMeta,
} from "@/types/shipment";

function toStripeAmount(amount: number) {
  return Math.round(amount * 100);
}

export async function createCheckoutSessionForBooking(booking: PaymentBooking) {
  const stripe = getStripeServerClient();
  const siteUrl = getSiteUrl();
  const bookingAmount = toStripeAmount(booking.amountDue);
  const currency = (booking.currency || "EUR").toLowerCase();
  const transportMode = getTransportModeMeta(booking.transportMode);
  const serviceType = formatModeAwareServiceType(
    booking.serviceType,
    booking.transportMode,
  );
  const metadata = {
    bookingId: booking.id,
    userId: booking.userId ?? "",
  };

  return stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: booking.senderEmail,
    client_reference_id: booking.id,
    success_url: `${siteUrl}/book/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/book/cancel?bookingId=${booking.id}`,
    metadata,
    payment_intent_data: {
      metadata,
    },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency,
          unit_amount: bookingAmount,
          product_data: {
            name: `${serviceType} ${transportMode.label.toLowerCase()} booking`,
            description: `Booking ${booking.id} for ${booking.recipientName}`,
          },
        },
      },
    ],
  });
}
