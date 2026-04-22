"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { assertAdminAction } from "@/lib/auth/assert-admin-action";
import { sendStatusEmail } from "@/lib/email/send-status-email";
import type { AdminActionState } from "@/types/admin";
import { shipmentStatuses, transportModes } from "@/types/shipment";

const trackingEventSchema = z.object({
  orderId: z.string().trim().min(1, "Select a shipment."),
  transportMode: z.enum(transportModes).optional(),
  status: z.enum(shipmentStatuses),
  label: z.string().trim().min(1, "Enter an event label."),
  description: z.string().trim().optional(),
  locationName: z.string().trim().optional(),
  eventTime: z.string().trim().min(1, "Choose an event time."),
});

function getString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

function optionalValue(value: string | undefined) {
  const normalized = value?.trim();

  return normalized && normalized.length > 0 ? normalized : null;
}

function validationState(error: z.ZodError): AdminActionState {
  return {
    success: false,
    message: "Please review the highlighted fields.",
    fieldErrors: error.flatten().fieldErrors,
  };
}

export async function createTrackingEventAction(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  let adminContext: Awaited<ReturnType<typeof assertAdminAction>>;

  try {
    adminContext = await assertAdminAction();
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Admin access is required.",
    };
  }

  const parsed = trackingEventSchema.safeParse({
    orderId: getString(formData, "orderId"),
    transportMode: getString(formData, "transportMode") || undefined,
    status: getString(formData, "status"),
    label: getString(formData, "label"),
    description: getString(formData, "description"),
    locationName: getString(formData, "locationName"),
    eventTime: getString(formData, "eventTime"),
  });

  if (!parsed.success) {
    return validationState(parsed.error);
  }

  try {
    const { supabase } = adminContext;
    const eventTime = new Date(parsed.data.eventTime).toISOString();

    const { error: eventError } = await supabase
      .from("tracking_events")
      .insert({
        order_id: parsed.data.orderId,
        status: parsed.data.status,
        label: parsed.data.label,
        description: optionalValue(parsed.data.description),
        location_name: optionalValue(parsed.data.locationName),
        event_time: eventTime,
      });

    if (eventError) {
      throw new Error("Tracking event could not be created.");
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .update({
        status: parsed.data.status,
        ...(parsed.data.transportMode
          ? { transport_mode: parsed.data.transportMode }
          : {}),
        updated_at: new Date().toISOString(),
      })
      .eq("id", parsed.data.orderId)
      .select("id, booking_id, tracking_number")
      .single();

    if (orderError || !order) {
      throw new Error("Tracking event saved, but shipment status sync failed.");
    }

    const typedOrder = order as {
      booking_id: string | null;
      tracking_number: string;
    };

    if (parsed.data.transportMode && typedOrder.booking_id) {
      await supabase
        .from("bookings")
        .update({
          transport_mode: parsed.data.transportMode,
          updated_at: new Date().toISOString(),
        })
        .eq("id", typedOrder.booking_id);
    }

    await sendStatusEmail({
      orderId: parsed.data.orderId,
      status: parsed.data.status,
      label: parsed.data.label,
      description: optionalValue(parsed.data.description),
    });

    revalidatePath("/admin");
    revalidatePath("/admin/shipments");
    revalidatePath(`/admin/shipments/${parsed.data.orderId}`);
    revalidatePath("/admin/tracking-events");
    revalidatePath("/track");
    revalidatePath(`/track?tracking=${typedOrder.tracking_number}`);

    return {
      success: true,
      message: "Tracking event saved and shipment status synced.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "The tracking event could not be saved.",
    };
  }
}
