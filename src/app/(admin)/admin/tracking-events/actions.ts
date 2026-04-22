"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { assertAdminAction } from "@/lib/auth/assert-admin-action";
import { sendStatusEmail } from "@/lib/email/send-status-email";
import { formDataToValues } from "@/lib/forms/preserve";
import type { AdminActionState } from "@/types/admin";
import {
  getShipmentStatusMeta,
  shipmentStatuses,
  transportModes,
} from "@/types/shipment";

const trackingEventSchema = z.object({
  orderId: z.string().trim().min(1, "Select a shipment."),
  transportMode: z.enum(transportModes).optional(),
  status: z.enum(shipmentStatuses),
  label: z.string().trim().optional(),
  description: z.string().trim().optional(),
  locationName: z.string().trim().optional(),
  eventTime: z
    .string()
    .trim()
    .min(1, "Choose an event time.")
    .refine((value) => !Number.isNaN(new Date(value).getTime()), {
      message: "Choose a valid event time.",
    }),
});

const updateTrackingEventSchema = trackingEventSchema.extend({
  eventId: z.string().trim().min(1, "Select a tracking event."),
});

function getString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

function optionalValue(value: string | undefined) {
  const normalized = value?.trim();

  return normalized && normalized.length > 0 ? normalized : null;
}

function validationState(
  error: z.ZodError,
  formData: FormData,
): AdminActionState {
  return {
    success: false,
    message: "Please review the highlighted fields.",
    fieldErrors: error.flatten().fieldErrors,
    values: formDataToValues(formData),
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
      values: formDataToValues(formData),
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
    return validationState(parsed.error, formData);
  }

  try {
    const { supabase } = adminContext;
    const eventTime = new Date(parsed.data.eventTime).toISOString();
    const statusMeta = getShipmentStatusMeta(parsed.data.status, {
      mode: parsed.data.transportMode,
    });
    const label = optionalValue(parsed.data.label) ?? statusMeta.label;
    const description =
      optionalValue(parsed.data.description) ?? statusMeta.description;

    const { error: eventError } = await supabase
      .from("tracking_events")
      .insert({
        order_id: parsed.data.orderId,
        status: parsed.data.status,
        label,
        description,
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
      label,
      description,
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
      values: formDataToValues(formData),
    };
  }
}

export async function updateTrackingEventAction(
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
      values: formDataToValues(formData),
    };
  }

  const parsed = updateTrackingEventSchema.safeParse({
    eventId: getString(formData, "eventId"),
    orderId: getString(formData, "orderId"),
    transportMode: getString(formData, "transportMode") || undefined,
    status: getString(formData, "status"),
    label: getString(formData, "label"),
    description: getString(formData, "description"),
    locationName: getString(formData, "locationName"),
    eventTime: getString(formData, "eventTime"),
  });

  if (!parsed.success) {
    return validationState(parsed.error, formData);
  }

  try {
    const { supabase } = adminContext;
    const eventTime = new Date(parsed.data.eventTime).toISOString();
    const statusMeta = getShipmentStatusMeta(parsed.data.status, {
      mode: parsed.data.transportMode,
    });
    const label = optionalValue(parsed.data.label) ?? statusMeta.label;
    const description =
      optionalValue(parsed.data.description) ?? statusMeta.description;
    const { data: event, error: eventError } = await supabase
      .from("tracking_events")
      .update({
        status: parsed.data.status,
        label,
        description,
        location_name: optionalValue(parsed.data.locationName),
        event_time: eventTime,
      })
      .eq("id", parsed.data.eventId)
      .eq("order_id", parsed.data.orderId)
      .select("id")
      .single();

    if (eventError || !event) {
      throw new Error("Tracking event could not be updated.");
    }

    const { data: latestEvent } = await supabase
      .from("tracking_events")
      .select("status")
      .eq("order_id", parsed.data.orderId)
      .order("event_time", { ascending: false })
      .limit(1)
      .maybeSingle();
    const nextShipmentStatus =
      (latestEvent as { status?: string } | null)?.status ?? parsed.data.status;
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .update({
        status: nextShipmentStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", parsed.data.orderId)
      .select("id, tracking_number")
      .single();

    if (orderError || !order) {
      throw new Error("Tracking event updated, but shipment status sync failed.");
    }

    const typedOrder = order as {
      id: string;
      tracking_number: string;
    };

    revalidatePath("/admin");
    revalidatePath("/admin/shipments");
    revalidatePath(`/admin/shipments/${parsed.data.orderId}`);
    revalidatePath("/admin/tracking-events");
    revalidatePath("/track");
    revalidatePath(`/track?tracking=${typedOrder.tracking_number}`);
    revalidatePath(`/track/print?tracking=${typedOrder.tracking_number}`);

    return {
      success: true,
      message: "Tracking event updated and shipment status refreshed.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "The tracking event could not be updated.",
      values: formDataToValues(formData),
    };
  }
}
