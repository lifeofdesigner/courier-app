import { BookingConfirmationEmail } from "@/components/email";
import { getSiteUrl } from "@/lib/env";
import { getPublicPageSettings } from "@/lib/queries/public-pages";
import {
  getResendFromEmail,
  getResendServerClient,
} from "@/lib/resend/server";
import type { BookingRecord } from "@/types/booking";
import {
  formatModeAwareServiceType,
  getTransportModeMeta,
  getTransportModePublicCopy,
} from "@/types/shipment";

export async function sendBookingEmail(booking: BookingRecord) {
  const resend = getResendServerClient();
  const from = getResendFromEmail();

  if (!resend || !from) {
    return {
      sent: false,
      reason: "Resend is not configured.",
    };
  }

  const transportMode = getTransportModeMeta(booking.transportMode);
  const settings = await getPublicPageSettings();
  const modeCopy = getTransportModePublicCopy(booking.transportMode);
  const serviceType = formatModeAwareServiceType(
    booking.serviceType,
    booking.transportMode,
  );

  try {
    await resend.emails.send({
      from,
      to: booking.senderEmail,
      subject: `${modeCopy.bookingReceivedTitle}: ${booking.id}`,
      react: BookingConfirmationEmail({
        bookingId: booking.id,
        senderName: booking.senderName,
        recipientName: booking.recipientName,
        heading: modeCopy.bookingReceivedTitle,
        transportMode: transportMode.label,
        serviceType,
        pickupDate: booking.pickupDate,
        pickupWindow: booking.pickupWindow,
        amountDue: booking.amountDue,
        currency: booking.currency,
        paymentUrl: `${getSiteUrl()}/book/cancel?bookingId=${booking.id}`,
        siteName: settings.siteIdentity.siteName,
        themeColors: settings.themeColors,
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
