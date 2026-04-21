"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { assertAdminAction } from "@/lib/auth/assert-admin-action";
import { sendStatusEmail } from "@/lib/email/send-status-email";
import type { AdminActionState } from "@/types/admin";

const trackingEventSchema = z.object({
  orderId: z.string().trim().min(1, "Select a shipment."),
  status: z.string().trim().min(1, "Select a status."),
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

    const { error: orderError } = await supabase
      .from("orders")
      .update({
        status: parsed.data.status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", parsed.data.orderId);

    if (orderError) {
      throw new Error("Tracking event saved, but shipment status sync failed.");
    }

    await sendStatusEmail({
      orderId: parsed.data.orderId,
      status: parsed.data.status,
      label: parsed.data.label,
      description: optionalValue(parsed.data.description),
    });

    revalidatePath("/admin");
    revalidatePath("/admin/shipments");
    revalidatePath("/admin/tracking-events");
    revalidatePath("/track");

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
