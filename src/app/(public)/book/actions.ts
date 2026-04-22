"use server";

import { z } from "zod";

import { sendBookingEmail } from "@/lib/email/send-booking-email";
import {
  formDataToValues,
  type PreservedFormValues,
} from "@/lib/forms/preserve";
import { insertBookingRequest } from "@/lib/queries/bookings";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { BookingRecord } from "@/types/booking";
import {
  getModeAwareServiceMeta,
  isModeAwareServiceTypeForMode,
  modeAwareServiceTypes,
  normalizeModeAwareServiceType,
  normalizeTransportMode,
  transportModes,
} from "@/types/shipment";

export type BookingActionState = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
  values?: PreservedFormValues;
  booking?: BookingRecord;
};

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

const bookingSchema = z
  .object({
    quoteId: z.string().trim().optional(),
    transportMode: z.enum(transportModes, {
      message: "Choose a transport mode.",
    }),
    senderName: z.string().trim().min(1, "Enter the sender name."),
    senderEmail: z.string().trim().email("Enter a valid sender email."),
    senderPhone: z.string().trim().optional(),
    recipientName: z.string().trim().min(1, "Enter the recipient name."),
    recipientEmail: optionalEmailSchema,
    recipientPhone: z.string().trim().optional(),
    serviceType: z.enum(modeAwareServiceTypes, {
      message: "Choose a service type.",
    }),
    packageType: z.string().trim().min(1, "Enter package or cargo details."),
    weightKg: z.coerce.number().positive("Weight must be greater than 0."),
    declaredValue: z.coerce
      .number()
      .min(0, "Declared value cannot be negative."),
    pickupDate: z.string().trim().min(1, "Choose a pickup date."),
    pickupWindow: z.string().trim().min(1, "Choose a pickup window."),
    specialInstructions: z.string().trim().optional(),
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

function getString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

function mapFieldErrors(
  error: z.ZodError,
): Record<string, string[]> | undefined {
  const errors: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const key = issue.path.join(".");
    errors[key] = [...(errors[key] ?? []), issue.message];
  }

  return errors;
}

export async function createBookingAction(
  _previousState: BookingActionState,
  formData: FormData,
): Promise<BookingActionState> {
  const parsed = bookingSchema.safeParse({
    quoteId: getString(formData, "quoteId"),
    transportMode: getString(formData, "transportMode"),
    senderName: getString(formData, "senderName"),
    senderEmail: getString(formData, "senderEmail"),
    senderPhone: getString(formData, "senderPhone"),
    recipientName: getString(formData, "recipientName"),
    recipientEmail: getString(formData, "recipientEmail"),
    recipientPhone: getString(formData, "recipientPhone"),
    serviceType: getString(formData, "serviceType"),
    packageType: getString(formData, "packageType"),
    weightKg: getString(formData, "weightKg"),
    declaredValue: getString(formData, "declaredValue"),
    pickupDate: getString(formData, "pickupDate"),
    pickupWindow: getString(formData, "pickupWindow"),
    specialInstructions: getString(formData, "specialInstructions"),
    pickup: {
      contactName: getString(formData, "pickup.contactName"),
      companyName: getString(formData, "pickup.companyName"),
      phone: getString(formData, "pickup.phone"),
      email: getString(formData, "pickup.email"),
      line1: getString(formData, "pickup.line1"),
      line2: getString(formData, "pickup.line2"),
      city: getString(formData, "pickup.city"),
      stateRegion: getString(formData, "pickup.stateRegion"),
      postalCode: getString(formData, "pickup.postalCode"),
      country: getString(formData, "pickup.country"),
    },
    delivery: {
      contactName: getString(formData, "delivery.contactName"),
      companyName: getString(formData, "delivery.companyName"),
      phone: getString(formData, "delivery.phone"),
      email: getString(formData, "delivery.email"),
      line1: getString(formData, "delivery.line1"),
      line2: getString(formData, "delivery.line2"),
      city: getString(formData, "delivery.city"),
      stateRegion: getString(formData, "delivery.stateRegion"),
      postalCode: getString(formData, "delivery.postalCode"),
      country: getString(formData, "delivery.country"),
    },
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please review the highlighted fields.",
      fieldErrors: mapFieldErrors(parsed.error),
      values: formDataToValues(formData),
    };
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      success: false,
      message:
        "Supabase is not configured yet. Add the public Supabase environment variables before submitting bookings.",
      values: formDataToValues(formData),
    };
  }

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const transportMode = normalizeTransportMode(parsed.data.transportMode);
    const serviceType = normalizeModeAwareServiceType(parsed.data.serviceType, {
      mode: transportMode,
    });
    const bookingInput = {
      ...parsed.data,
      transportMode,
      serviceType,
    };
    const booking = await insertBookingRequest({
      input: bookingInput,
      userId: user?.id ?? null,
    });
    await sendBookingEmail(booking);
    const serviceMeta = getModeAwareServiceMeta(serviceType, {
      mode: transportMode,
    });

    return {
      success: true,
      message: `${serviceMeta.label} booking request submitted.`,
      booking,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "The pickup request could not be submitted right now.",
      values: formDataToValues(formData),
    };
  }
}
