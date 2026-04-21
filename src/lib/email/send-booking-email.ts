import { BookingConfirmationEmail } from "@/components/email";
import { getSiteUrl } from "@/lib/env";
import {
  getResendFromEmail,
  getResendServerClient,
} from "@/lib/resend/server";
import type { BookingRecord } from "@/types/booking";

export async function sendBookingEmail(booking: BookingRecord) {
  const resend = getResendServerClient();
  const from = getResendFromEmail();

  if (!resend || !from) {
    return {
      sent: false,
      reason: "Resend is not configured.",
    };
  }

  try {
    await resend.emails.send({
      from,
      to: booking.senderEmail,
      subject: `Booking received: ${booking.id}`,
      react: BookingConfirmationEmail({
        bookingId: booking.id,
        senderName: booking.senderName,
        recipientName: booking.recipientName,
        serviceType: booking.serviceType,
        pickupDate: booking.pickupDate,
        pickupWindow: booking.pickupWindow,
        amountDue: booking.amountDue,
        currency: booking.currency,
        paymentUrl: `${getSiteUrl()}/book/cancel?bookingId=${booking.id}`,
      }),
    });

    return {
      sent: true,
    };
  } catch (error) {
    console.error("Booking email could not be sent.", error);

    return {
      sent: false,
      reason: "Resend rejected the booking email.",
    };
  }
}
