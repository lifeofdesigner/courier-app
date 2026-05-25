"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { assertAdminAction } from "@/lib/auth/assert-admin-action";
import { formDataToValues } from "@/lib/forms/preserve";
import type { AdminActionState } from "@/types/admin";

const settingSchema = z.object({
  formType: z.enum([
    "companyContact",
    "supportHours",
    "socialLinks",
    "footerNotice",
  ]),
});

function getString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

function getOptionalString(formData: FormData, key: string) {
  const value = getString(formData, key).trim();

  return value.length > 0 ? value : "";
}

function getSettingPayload(formType: z.infer<typeof settingSchema>["formType"], formData: FormData) {
  switch (formType) {
    case "companyContact":
      return {
        key: "company_contact",
        value: {
          email: getString(formData, "email").trim(),
          phone: getString(formData, "phone").trim(),
          address: getString(formData, "address").trim(),
        },
      };
    case "supportHours":
      return {
        key: "support_hours",
        value: {
          label: getString(formData, "label").trim(),
        },
      };
    case "socialLinks":
      return {
        key: "social_links",
        value: {
          x: getOptionalString(formData, "x"),
          facebook: getOptionalString(formData, "facebook"),
          linkedin: getOptionalString(formData, "linkedin"),
        },
      };
    case "footerNotice":
      return {
        key: "footer_notice",
        value: {
          text: getString(formData, "text").trim(),
        },
      };
  }
}

export async function saveFriendlySiteSettingAction(
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

  const parsed = settingSchema.safeParse({
    formType: getString(formData, "formType"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "This settings form could not be saved.",
      fieldErrors: parsed.error.flatten().fieldErrors,
      values: formDataToValues(formData),
    };
  }

  try {
    const { supabase, profile } = adminContext;
    const payload = getSettingPayload(parsed.data.formType, formData);
    const { error } = await supabase.from("site_settings").upsert(
      {
        key: payload.key,
        value: payload.value,
        updated_by: profile.id,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "key",
      },
    );

    if (error) {
      throw new Error("Site setting could not be saved.");
    }

    revalidatePath("/admin");
    revalidatePath("/admin/settings");
    revalidatePath("/", "layout");
    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/book");
    revalidatePath("/contact");
    revalidatePath("/faq");
    revalidatePath("/quote");
    revalidatePath("/services");
    revalidatePath("/track");

    return {
      success: true,
      message: "Settings saved.",
    };
  } catch {
    return {
      success: false,
      message: "Settings could not be saved.",
      values: formDataToValues(formData),
    };
  }
}
