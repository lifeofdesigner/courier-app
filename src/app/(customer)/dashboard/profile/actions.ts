"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  formDataToValues,
  type PreservedFormValues,
} from "@/lib/forms/preserve";
import {
  createSavedAddress,
  updateCurrentUserProfile,
} from "@/lib/queries/addresses";

export type DashboardActionState = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
  values?: PreservedFormValues;
};

const profileSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name."),
  phone: z.string().trim().optional(),
});

const addressSchema = z.object({
  label: z.string().trim().optional(),
  contactName: z.string().trim().min(1, "Enter a contact name."),
  companyName: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  email: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || z.string().email().safeParse(value).success, {
      message: "Enter a valid email address.",
    }),
  line1: z.string().trim().min(1, "Enter an address line."),
  line2: z.string().trim().optional(),
  city: z.string().trim().min(1, "Enter a city."),
  stateRegion: z.string().trim().optional(),
  postalCode: z.string().trim().optional(),
  country: z.string().trim().min(1, "Enter a country."),
});

function getString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

function validationState(
  error: z.ZodError,
  formData: FormData,
): DashboardActionState {
  return {
    success: false,
    message: "Please review the highlighted fields.",
    fieldErrors: error.flatten().fieldErrors,
    values: formDataToValues(formData),
  };
}

export async function updateProfileAction(
  _previousState: DashboardActionState,
  formData: FormData,
): Promise<DashboardActionState> {
  const parsed = profileSchema.safeParse({
    fullName: getString(formData, "fullName"),
    phone: getString(formData, "phone"),
  });

  if (!parsed.success) {
    return validationState(parsed.error, formData);
  }

  try {
    await updateCurrentUserProfile(parsed.data);
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/profile");

    return {
      success: true,
      message: "Profile details updated.",
    };
  } catch {
    return {
      success: false,
      message: "Your profile could not be updated. Please try again.",
      values: formDataToValues(formData),
    };
  }
}

export async function createAddressAction(
  _previousState: DashboardActionState,
  formData: FormData,
): Promise<DashboardActionState> {
  const parsed = addressSchema.safeParse({
    label: getString(formData, "label"),
    contactName: getString(formData, "contactName"),
    companyName: getString(formData, "companyName"),
    phone: getString(formData, "phone"),
    email: getString(formData, "email"),
    line1: getString(formData, "line1"),
    line2: getString(formData, "line2"),
    city: getString(formData, "city"),
    stateRegion: getString(formData, "stateRegion"),
    postalCode: getString(formData, "postalCode"),
    country: getString(formData, "country"),
  });

  if (!parsed.success) {
    return validationState(parsed.error, formData);
  }

  try {
    await createSavedAddress(parsed.data);
    revalidatePath("/dashboard/profile");

    return {
      success: true,
      message: "Address saved to your address book.",
    };
  } catch {
    return {
      success: false,
      message: "The address could not be saved. Please try again.",
      values: formDataToValues(formData),
    };
  }
}
