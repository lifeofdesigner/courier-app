"use server";

import type { SupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { assertAdminAction } from "@/lib/auth/assert-admin-action";
import { sendStatusEmail } from "@/lib/email/send-status-email";
import { formDataToValues } from "@/lib/forms/preserve";
import { calculateBookingAmountDue } from "@/lib/queries/bookings";
import {
  findAdminCustomerByEmail,
  getAdminCustomerById,
  searchAdminCustomers,
} from "@/lib/queries/customers";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";
import type {
  AdminActionState,
  CustomerSearchActionState,
} from "@/types/admin";
import { paymentStatuses } from "@/types/payment";
import {
  getModeAwareServiceMeta,
  getShipmentStatusMeta,
  isModeAwareServiceTypeForMode,
  modeAwareServiceTypes,
  shipmentStatuses,
  transportModes,
  type ShipmentStatus,
} from "@/types/shipment";

const optionalEmailSchema = z
  .string()
  .trim()
  .optional()
  .refine((value) => !value || z.string().email().safeParse(value).success, {
    message: "Enter a valid email address.",
  });

const addressSchema = z.object({
  contactName: z.string().trim().min(1, "Enter a contact name."),
  companyName: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  email: optionalEmailSchema,
  line1: z.string().trim().min(1, "Enter an address line."),
  line2: z.string().trim().optional(),
  city: z.string().trim().min(1, "Enter a city."),
  stateRegion: z.string().trim().optional(),
  postalCode: z.string().trim().optional(),
  country: z.string().trim().min(1, "Enter a country."),
});

const createShipmentSchema = z
  .object({
    customerEmail: optionalEmailSchema,
    selectedCustomerId: z
      .string()
      .trim()
      .optional()
      .refine(
        (value) => !value || z.string().uuid().safeParse(value).success,
        {
          message: "Select a valid customer or continue without linking.",
        },
      ),
    unassignedCustomer: z.boolean(),
    senderName: z.string().trim().min(1, "Enter the sender name."),
    senderEmail: z.string().trim().email("Enter a valid sender email."),
    senderPhone: z.string().trim().optional(),
    recipientName: z.string().trim().min(1, "Enter the recipient name."),
    recipientEmail: optionalEmailSchema,
    recipientPhone: z.string().trim().optional(),
    serviceType: z.enum(modeAwareServiceTypes),
    transportMode: z.enum(transportModes),
    packageType: z.string().trim().min(1, "Enter a package type."),
    weightKg: z.coerce.number().positive("Weight must be greater than 0."),
    declaredValue: z.coerce
      .number()
      .min(0, "Declared value cannot be negative."),
    currency: z.string().trim().min(1, "Choose a currency."),
    pickupDate: z.string().trim().min(1, "Choose a pickup date."),
    pickupWindow: z.string().trim().min(1, "Choose a pickup window."),
    specialInstructions: z.string().trim().optional(),
    paymentStatus: z.enum(paymentStatuses),
    shipmentStatus: z.enum(shipmentStatuses),
    pickup: addressSchema,
    delivery: addressSchema,
  })
  .superRefine((data, context) => {
    if (!isModeAwareServiceTypeForMode(data.serviceType, data.transportMode)) {
      context.addIssue({
        code: "custom",
        path: ["serviceType"],
        message: "Choose a service type for the selected transport mode.",
      });
    }
  });

const shipmentStatusSchema = z
  .object({
    orderId: z.string().trim().min(1, "Select a shipment."),
    transportMode: z.enum(transportModes).optional(),
    serviceType: z.enum(modeAwareServiceTypes).optional(),
    status: z.enum(shipmentStatuses),
    label: z.string().trim().optional(),
    description: z.string().trim().optional(),
    locationName: z.string().trim().optional(),
    eventTime: z.string().trim().optional(),
  })
  .superRefine((data, context) => {
    if (
      data.serviceType &&
      data.transportMode &&
      !isModeAwareServiceTypeForMode(data.serviceType, data.transportMode)
    ) {
      context.addIssue({
        code: "custom",
        path: ["serviceType"],
        message: "Choose a service type for the selected transport mode.",
      });
    }
  });

function getString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

function getBoolean(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function optionalValue(value: string | undefined) {
  const normalized = value?.trim();

  return normalized && normalized.length > 0 ? normalized : null;
}

function validationState(
  error: z.ZodError,
  formData: FormData,
): AdminActionState {
  const fieldErrors: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const key = issue.path.join(".");
    fieldErrors[key] = [...(fieldErrors[key] ?? []), issue.message];
  }

  return {
    success: false,
    message: "Please review the highlighted fields.",
    fieldErrors,
    values: formDataToValues(formData),
  };
}

function getAddressInput(formData: FormData, prefix: "pickup" | "delivery") {
  return {
    contactName: getString(formData, `${prefix}.contactName`),
    companyName: getString(formData, `${prefix}.companyName`),
    phone: getString(formData, `${prefix}.phone`),
    email: getString(formData, `${prefix}.email`),
    line1: getString(formData, `${prefix}.line1`),
    line2: getString(formData, `${prefix}.line2`),
    city: getString(formData, `${prefix}.city`),
    stateRegion: getString(formData, `${prefix}.stateRegion`),
    postalCode: getString(formData, `${prefix}.postalCode`),
    country: getString(formData, `${prefix}.country`),
  };
}

function generateTrackingNumber() {
  const date = new Date();
  const dateStamp = [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0"),
  ].join("");
  const suffix = crypto.randomUUID().slice(0, 8).toUpperCase();

  return `AC${dateStamp}${suffix}`;
}

function estimatedDeliveryDate(
  pickupDate: string,
  serviceType: string,
  transportMode: string,
) {
  const date = new Date(`${pickupDate}T00:00:00.000Z`);
  const transitDays = getModeAwareServiceMeta(serviceType, {
    mode: transportMode,
  }).estimatedTransitDays;

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  date.setUTCDate(date.getUTCDate() + transitDays);

  return date.toISOString().slice(0, 10);
}

async function generateUniqueTrackingNumber(supabase: SupabaseClient) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const trackingNumber = generateTrackingNumber();
    const { data } = await supabase
      .from("orders")
      .select("id")
      .eq("tracking_number", trackingNumber)
      .maybeSingle();

    if (!data) {
      return trackingNumber;
    }
  }

  throw new Error("A unique tracking number could not be generated.");
}

async function insertAddress({
  supabase,
  userId,
  label,
  addressType,
  address,
}: {
  supabase: SupabaseClient;
  userId: string | null;
  label: "Pickup" | "Delivery";
  addressType: "pickup" | "delivery";
  address: z.infer<typeof addressSchema>;
}) {
  const { data, error } = await supabase
    .from("addresses")
    .insert({
      user_id: userId,
      label,
      contact_name: address.contactName,
      company_name: optionalValue(address.companyName),
      phone: optionalValue(address.phone),
      email: optionalValue(address.email),
      line_1: address.line1,
      line_2: optionalValue(address.line2),
      city: address.city,
      state_region: optionalValue(address.stateRegion),
      postal_code: optionalValue(address.postalCode),
      country: address.country,
      address_type: addressType,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error(`${label} address could not be saved.`, error);
    throw new Error(`${label} address could not be saved.`);
  }

  return (data as { id: string }).id;
}

function getAdminMutationClient(fallbackClient: SupabaseClient) {
  try {
    return createSupabaseServiceRoleClient();
  } catch {
    return fallbackClient;
  }
}

export async function searchShipmentCustomersAction(
  query: string,
): Promise<CustomerSearchActionState> {
  const normalizedQuery = query.trim();

  if (normalizedQuery.length < 2) {
    return {
      success: true,
      message: "Type at least 2 characters to search customers.",
      results: [],
    };
  }

  try {
    const results = await searchAdminCustomers(normalizedQuery, 10);

    return {
      success: true,
      message:
        results.length > 0
          ? "Customers found."
          : "No matching customers found.",
      results,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Customer search is unavailable.",
      results: [],
    };
  }
}

function revalidateShipmentWorkspace(orderId?: string, trackingNumber?: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/shipments");
  revalidatePath("/admin/tracking-events");
  revalidatePath("/track");

  if (orderId) {
    revalidatePath(`/admin/shipments/${orderId}`);
  }

  if (trackingNumber) {
    revalidatePath(`/track?tracking=${trackingNumber}`);
  }
}

export async function createShipmentAction(
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

  const parsed = createShipmentSchema.safeParse({
    customerEmail: getString(formData, "customerEmail"),
    selectedCustomerId: getString(formData, "selectedCustomerId"),
    unassignedCustomer: getBoolean(formData, "unassignedCustomer"),
    senderName: getString(formData, "senderName"),
    senderEmail: getString(formData, "senderEmail"),
    senderPhone: getString(formData, "senderPhone"),
    recipientName: getString(formData, "recipientName"),
    recipientEmail: getString(formData, "recipientEmail"),
    recipientPhone: getString(formData, "recipientPhone"),
    serviceType: getString(formData, "serviceType"),
    transportMode: getString(formData, "transportMode"),
    packageType: getString(formData, "packageType"),
    weightKg: getString(formData, "weightKg"),
    declaredValue: getString(formData, "declaredValue"),
    currency: getString(formData, "currency"),
    pickupDate: getString(formData, "pickupDate"),
    pickupWindow: getString(formData, "pickupWindow"),
    specialInstructions: getString(formData, "specialInstructions"),
    paymentStatus: getString(formData, "paymentStatus"),
    shipmentStatus: getString(formData, "shipmentStatus"),
    pickup: getAddressInput(formData, "pickup"),
    delivery: getAddressInput(formData, "delivery"),
  });

  if (!parsed.success) {
    return validationState(parsed.error, formData);
  }

  try {
    const supabase = getAdminMutationClient(adminContext.supabase);
    const customerEmail = optionalValue(parsed.data.customerEmail);
    const selectedCustomerId = optionalValue(parsed.data.selectedCustomerId);
    const selectedCustomer = selectedCustomerId
      ? await getAdminCustomerById(selectedCustomerId)
      : null;

    if (selectedCustomerId && !selectedCustomer) {
      return {
        success: false,
        message: "Selected customer could not be found.",
        fieldErrors: {
          selectedCustomerId: ["Select a valid customer or clear selection."],
        },
        values: formDataToValues(formData),
      };
    }

    const fallbackCustomer = !selectedCustomer && customerEmail
      ? await findAdminCustomerByEmail(customerEmail)
      : null;
    const userId =
      parsed.data.unassignedCustomer
        ? null
        : selectedCustomer?.id ??
          fallbackCustomer?.id ??
          null;
    const now = new Date().toISOString();
    const amountDue = await calculateBookingAmountDue({
      quoteId: null,
      transportMode: parsed.data.transportMode,
      senderName: parsed.data.senderName,
      senderEmail: parsed.data.senderEmail,
      senderPhone: parsed.data.senderPhone,
      recipientName: parsed.data.recipientName,
      recipientEmail: parsed.data.recipientEmail,
      recipientPhone: parsed.data.recipientPhone,
      serviceType: parsed.data.serviceType,
      packageType: parsed.data.packageType,
      weightKg: parsed.data.weightKg,
      declaredValue: parsed.data.declaredValue,
      pickupDate: parsed.data.pickupDate,
      pickupWindow: parsed.data.pickupWindow,
      specialInstructions: parsed.data.specialInstructions,
      pickup: parsed.data.pickup,
      delivery: parsed.data.delivery,
    });
    const amountPaid =
      parsed.data.paymentStatus === "paid" ? amountDue : 0;

    const pickupAddressId = await insertAddress({
      supabase,
      userId,
      label: "Pickup",
      addressType: "pickup",
      address: parsed.data.pickup,
    });
    const deliveryAddressId = await insertAddress({
      supabase,
      userId,
      label: "Delivery",
      addressType: "delivery",
      address: parsed.data.delivery,
    });

    const { data: bookingData, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        user_id: userId,
        quote_id: null,
        pickup_address_id: pickupAddressId,
        delivery_address_id: deliveryAddressId,
        sender_name: parsed.data.senderName,
        sender_email: parsed.data.senderEmail,
        sender_phone: optionalValue(parsed.data.senderPhone),
        recipient_name: parsed.data.recipientName,
        recipient_email: optionalValue(parsed.data.recipientEmail),
        recipient_phone: optionalValue(parsed.data.recipientPhone),
        service_type: parsed.data.serviceType,
        transport_mode: parsed.data.transportMode,
        package_type: parsed.data.packageType,
        weight_kg: parsed.data.weightKg,
        declared_value: parsed.data.declaredValue,
        pickup_date: parsed.data.pickupDate,
        pickup_window: parsed.data.pickupWindow,
        special_instructions: optionalValue(parsed.data.specialInstructions),
        status: "confirmed",
        payment_status: parsed.data.paymentStatus,
        payment_provider:
          parsed.data.paymentStatus === "paid" ? "manual" : null,
        amount_due: amountDue,
        amount_paid: amountPaid,
        currency: parsed.data.currency,
        created_at: now,
        updated_at: now,
      })
      .select("id")
      .single();

    if (bookingError || !bookingData) {
      throw new Error("The linked booking could not be created.");
    }

    const bookingId = (bookingData as { id: string }).id;
    const labelUrl =
      parsed.data.paymentStatus === "paid" ? `/label/${bookingId}` : null;
    const labelGeneratedAt = labelUrl ? now : null;
    const trackingNumber = await generateUniqueTrackingNumber(supabase);
    const referenceCode = `ADM-${bookingId.slice(0, 8).toUpperCase()}`;
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        booking_id: bookingId,
        tracking_number: trackingNumber,
        reference_code: referenceCode,
        service_type: parsed.data.serviceType,
        package_type: parsed.data.packageType,
        transport_mode: parsed.data.transportMode,
        origin_country: parsed.data.pickup.country,
        origin_city: parsed.data.pickup.city,
        destination_country: parsed.data.delivery.country,
        destination_city: parsed.data.delivery.city,
        recipient_name: parsed.data.recipientName,
        recipient_phone: optionalValue(parsed.data.recipientPhone),
        sender_name: parsed.data.senderName,
        weight_kg: parsed.data.weightKg,
        declared_value: parsed.data.declaredValue,
        currency: parsed.data.currency,
        status: parsed.data.shipmentStatus,
        label_url: labelUrl,
        label_generated_at: labelGeneratedAt,
        estimated_delivery_date: estimatedDeliveryDate(
          parsed.data.pickupDate,
          parsed.data.serviceType,
          parsed.data.transportMode,
        ),
        created_at: now,
        updated_at: now,
      })
      .select("id")
      .single();

    if (orderError || !orderData) {
      throw new Error("The shipment order could not be created.");
    }

    const orderId = (orderData as { id: string }).id;

    if (labelUrl) {
      await supabase
        .from("bookings")
        .update({
          label_url: labelUrl,
          label_generated_at: labelGeneratedAt,
          updated_at: now,
        })
        .eq("id", bookingId);
    }

    const initialStatusMeta = getShipmentStatusMeta(parsed.data.shipmentStatus, {
      mode: parsed.data.transportMode,
    });

    await supabase.from("tracking_events").insert({
      order_id: orderId,
      status: parsed.data.shipmentStatus,
      label: initialStatusMeta.label,
      description: initialStatusMeta.description,
      location_name: "Operations team",
      event_time: now,
    });

    revalidateShipmentWorkspace(orderId, trackingNumber);

    return {
      success: true,
      message: `Shipment ${trackingNumber} created.`,
      createdShipmentId: orderId,
      createdTrackingNumber: trackingNumber,
      createdBookingId: bookingId,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "The shipment could not be created.",
      values: formDataToValues(formData),
    };
  }
}

export async function updateShipmentStatusAction(
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

  const parsed = shipmentStatusSchema.safeParse({
    orderId: getString(formData, "orderId"),
    transportMode: getString(formData, "transportMode") || undefined,
    serviceType: getString(formData, "serviceType") || undefined,
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
    const eventTime = parsed.data.eventTime
      ? new Date(parsed.data.eventTime).toISOString()
      : new Date().toISOString();
    const statusMeta = getShipmentStatusMeta(parsed.data.status, {
      mode: parsed.data.transportMode,
    });
    const label = optionalValue(parsed.data.label) ?? statusMeta.label;
    const description =
      optionalValue(parsed.data.description) ??
      statusMeta.description;

    const now = new Date().toISOString();
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .update({
        status: parsed.data.status,
        ...(parsed.data.transportMode
          ? { transport_mode: parsed.data.transportMode }
          : {}),
        ...(parsed.data.serviceType
          ? { service_type: parsed.data.serviceType }
          : {}),
        updated_at: now,
      })
      .eq("id", parsed.data.orderId)
      .select("id, booking_id, tracking_number")
      .single();

    if (orderError || !order) {
      throw new Error("Shipment status could not be updated.");
    }

    const typedOrder = order as {
      booking_id: string | null;
      tracking_number: string;
    };

    if (
      typedOrder.booking_id &&
      (parsed.data.transportMode || parsed.data.serviceType)
    ) {
      await supabase
        .from("bookings")
        .update({
          ...(parsed.data.transportMode
            ? { transport_mode: parsed.data.transportMode }
            : {}),
          ...(parsed.data.serviceType
            ? { service_type: parsed.data.serviceType }
            : {}),
          updated_at: now,
        })
        .eq("id", typedOrder.booking_id);
    }

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

    await sendStatusEmail({
      orderId: parsed.data.orderId,
      status: parsed.data.status,
      label,
      description,
    });

    const trackingNumber = typedOrder.tracking_number;
    revalidateShipmentWorkspace(parsed.data.orderId, trackingNumber);

    return {
      success: true,
      message: "Shipment status updated and timeline event saved.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "The shipment update could not be saved.",
      values: formDataToValues(formData),
    };
  }
}

export async function updateShipmentStatusOnlyAction(
  previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const status = getString(formData, "status") as ShipmentStatus;
  const transportMode = getString(formData, "transportMode");
  const serviceType = getString(formData, "serviceType");
  const statusMeta = getShipmentStatusMeta(status, {
    mode: transportMode,
  });
  const nextFormData = new FormData();

  nextFormData.set("orderId", getString(formData, "orderId"));
  nextFormData.set("transportMode", transportMode);
  nextFormData.set("serviceType", serviceType);
  nextFormData.set("status", status);
  nextFormData.set("label", statusMeta.label);
  nextFormData.set("description", statusMeta.description);
  nextFormData.set("locationName", "Operations team");

  return updateShipmentStatusAction(previousState, nextFormData);
}
