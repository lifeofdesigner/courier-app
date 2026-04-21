"use server";

import { z } from "zod";

import { calculateQuoteBreakdown } from "@/lib/calculations/quotes";
import { getPricingRules, insertQuoteRecord } from "@/lib/queries/quotes";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { QuoteBreakdown, QuoteRecord } from "@/types/quote";

export type QuoteActionState = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
  quote?: QuoteRecord;
  breakdown?: QuoteBreakdown;
};

const quoteSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name."),
  email: z.string().trim().email("Enter a valid email address."),
  originCountry: z.string().trim().min(1, "Enter the origin country."),
  originCity: z.string().trim().min(1, "Enter the origin city."),
  destinationCountry: z
    .string()
    .trim()
    .min(1, "Enter the destination country."),
  destinationCity: z.string().trim().min(1, "Enter the destination city."),
  serviceType: z.enum(["Express", "Economy"], {
    message: "Choose a service type.",
  }),
  packageType: z.string().trim().min(1, "Enter a package type."),
  weightKg: z.coerce.number().positive("Weight must be greater than 0."),
  declaredValue: z.coerce
    .number()
    .min(0, "Declared value cannot be negative."),
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
    };
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      success: false,
      message:
        "Supabase is not configured yet. Add the public Supabase environment variables before calculating quotes.",
    };
  }

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const pricingRules = await getPricingRules({
      serviceType: parsed.data.serviceType,
    });
    const breakdown = calculateQuoteBreakdown(parsed.data, pricingRules);
    const quote = await insertQuoteRecord({
      input: parsed.data,
      breakdown,
      userId: user?.id ?? null,
    });

    return {
      success: true,
      message: "Quote calculated and saved.",
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
    };
  }
}
