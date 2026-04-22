"use server";

import { z } from "zod";

import { calculateQuoteBreakdown } from "@/lib/calculations/quotes";
import {
  formDataToValues,
  type PreservedFormValues,
} from "@/lib/forms/preserve";
import { getPricingRules, insertQuoteRecord } from "@/lib/queries/quotes";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { QuoteBreakdown, QuoteRecord } from "@/types/quote";
import {
  getModeAwareServiceMeta,
  getPricingServiceTypeForModeAwareService,
  isModeAwareServiceTypeForMode,
  modeAwareServiceTypes,
  normalizeModeAwareServiceType,
  normalizeTransportMode,
  transportModes,
} from "@/types/shipment";

export type QuoteActionState = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
  values?: PreservedFormValues;
  quote?: QuoteRecord;
  breakdown?: QuoteBreakdown;
};

const quoteSchema = z
  .object({
    fullName: z.string().trim().min(2, "Enter your full name."),
    email: z.string().trim().email("Enter a valid email address."),
    transportMode: z.enum(transportModes, {
      message: "Choose a transport mode.",
    }),
    originCountry: z.string().trim().min(1, "Enter the origin country."),
    originCity: z.string().trim().min(1, "Enter the origin city."),
    destinationCountry: z
      .string()
      .trim()
      .min(1, "Enter the destination country."),
    destinationCity: z.string().trim().min(1, "Enter the destination city."),
    serviceType: z.enum(modeAwareServiceTypes, {
      message: "Choose a service type.",
    }),
    packageType: z.string().trim().min(1, "Enter package or cargo details."),
    weightKg: z.coerce.number().positive("Weight must be greater than 0."),
    declaredValue: z.coerce
      .number()
      .min(0, "Declared value cannot be negative."),
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

export async function calculateQuoteAction(
  _previousState: QuoteActionState,
  formData: FormData,
): Promise<QuoteActionState> {
  const parsed = quoteSchema.safeParse({
    fullName: getString(formData, "fullName"),
    email: getString(formData, "email"),
    transportMode: getString(formData, "transportMode"),
    originCountry: getString(formData, "originCountry"),
    originCity: getString(formData, "originCity"),
    destinationCountry: getString(formData, "destinationCountry"),
    destinationCity: getString(formData, "destinationCity"),
    serviceType: getString(formData, "serviceType"),
    packageType: getString(formData, "packageType"),
    weightKg: getString(formData, "weightKg"),
    declaredValue: getString(formData, "declaredValue"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please review the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
      values: formDataToValues(formData),
    };
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      success: false,
      message:
        "Supabase is not configured yet. Add the public Supabase environment variables before calculating quotes.",
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
    const quoteInput = {
      ...parsed.data,
      transportMode,
      serviceType,
    };
    const pricingServiceType = getPricingServiceTypeForModeAwareService(
      serviceType,
      transportMode,
    );
    const pricingRules = await getPricingRules({
      serviceType: pricingServiceType,
    });
    const breakdown = calculateQuoteBreakdown(quoteInput, pricingRules);
    const quote = await insertQuoteRecord({
      input: quoteInput,
      breakdown,
      userId: user?.id ?? null,
    });
    const serviceMeta = getModeAwareServiceMeta(serviceType, {
      mode: transportMode,
    });

    return {
      success: true,
      message: `${serviceMeta.label} quote calculated and saved.`,
      quote,
      breakdown,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "The quote could not be calculated right now.",
      values: formDataToValues(formData),
    };
  }
}
