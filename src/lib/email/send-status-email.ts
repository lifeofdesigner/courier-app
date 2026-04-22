import { TrackingStatusEmail } from "@/components/email";
import { getSiteUrl } from "@/lib/env";
import {
  getResendFromEmail,
  getResendServerClient,
} from "@/lib/resend/server";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";

type StatusEmailOrderRow = {
  id: string;
  booking_id: string | null;
  tracking_number: string;
  recipient_name: string;
  transport_mode: string | null;
};

type StatusEmailBookingRow = {
  sender_email: string;
  recipient_email: string | null;
};

export async function sendStatusEmail({
  orderId,
  status,
  label,
  description,
}: {
  orderId: string;
  status: string;
  label: string;
  description?: string | null;
}) {
  const resend = getResendServerClient();
  const from = getResendFromEmail();

  if (!resend || !from) {
    return {
      sent: false,
      reason: "Resend is not configured.",
    };
  }

  let supabase;

  try {
    supabase = createSupabaseServiceRoleClient();
  } catch {
    return {
      sent: false,
      reason: "Supabase service role is not configured.",
    };
  }

  const { data: order } = await supabase
    .from("orders")
    .select("id, booking_id, tracking_number, recipient_name, transport_mode")
    .eq("id", orderId)
    .single();

  if (!order) {
    return {
      sent: false,
      reason: "Order was not found.",
    };
  }

  const typedOrder = order as StatusEmailOrderRow;

  if (!typedOrder.booking_id) {
    return {
      sent: false,
      reason: "Order is not linked to a booking.",
    };
  }

  const { data: booking } = await supabase
    .from("bookings")
    .select("sender_email, recipient_email")
    .eq("id", typedOrder.booking_id)
    .single();

  if (!booking) {
    return {
      sent: false,
      reason: "Booking was not found.",
    };
  }

  const typedBooking = booking as StatusEmailBookingRow;
  const recipients = [
    typedBooking.sender_email,
    typedBooking.recipient_email,
  ].filter(Boolean) as string[];

  try {
    await resend.emails.send({
      from,
      to: recipients,
      subject: `Shipment update: ${typedOrder.tracking_number}`,
      react: TrackingStatusEmail({
        trackingNumber: typedOrder.tracking_number,
        recipientName: typedOrder.recipient_name,
        status,
        label,
        description,
        transportMode: typedOrder.transport_mode,
        trackingUrl: `${getSiteUrl()}/track?tracking=${typedOrder.tracking_number}`,
      }),
    });

    return {
      sent: true,
    };
  } catch (error) {
    console.error("Status email could not be sent.", error);

    return {
      sent: false,
      reason: "Resend rejected the status email.",
    };
  }
}
