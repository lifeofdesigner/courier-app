import { PaymentConfirmationEmail } from "@/components/email";
import { getSiteUrl } from "@/lib/env";
import type { PaymentFulfillmentResult } from "@/lib/queries/payments";
import { getPublicPageSettings } from "@/lib/queries/public-pages";
import {
  getResendFromEmail,
  getResendServerClient,
} from "@/lib/resend/server";

export async function sendPaymentEmail(result: PaymentFulfillmentResult) {
  const resend = getResendServerClient();
  const from = getResendFromEmail();

  if (!resend || !from) {
    return {
      sent: false,
      reason: "Resend is not configured.",
    };
  }

  const recipients = [
    result.booking.senderEmail,
    result.booking.recipientEmail,
  ].filter(Boolean) as string[];
  const labelUrl = result.order.labelUrl
    ? `${getSiteUrl()}${result.order.labelUrl}`
    : null;
  const settings = await getPublicPageSettings();

  try {
    await resend.emails.send({
      from,
      to: recipients,
      subject: `Payment confirmed: ${result.booking.id}`,
      react: PaymentConfirmationEmail({
        bookingId: result.booking.id,
        senderName: result.booking.senderName,
        recipientName: result.booking.recipientName,
        amountPaid: result.booking.amountPaid,
        currency: result.booking.currency,
        trackingNumber: result.order.trackingNumber,
        labelUrl,
        siteName: settings.siteIdentity.siteName,
        themeColors: settings.themeColors,
      }),
    });

    return {
      sent: true,
    };
  } catch (error) {
    console.error("Payment email could not be sent.", error);

    return {
      sent: false,
      reason: "Resend rejected the payment email.",
    };
  }
}
