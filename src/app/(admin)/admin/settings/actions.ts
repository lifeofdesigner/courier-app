"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { assertAdminAction } from "@/lib/auth/assert-admin-action";
import { formDataToValues } from "@/lib/forms/preserve";
import type { AdminActionState } from "@/types/admin";

const settingSchema = z.object({
  key: z.string().trim().min(1, "Enter a setting key."),
  payload: z.string().trim().min(2, "Enter a JSON value."),
});

function getString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

function parseJsonPayload(payload: string) {
  try {
    return {
      data: JSON.parse(payload) as unknown,
      error: null,
    };
  } catch {
    return {
      data: null,
      error: "Enter valid JSON.",
    };
  }
}

export async function upsertSiteSettingAction(
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
    key: getString(formData, "key"),
    payload: getString(formData, "payload"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please review the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
      values: formDataToValues(formData),
    };
  }

  const payload = parseJsonPayload(parsed.data.payload);

  if (payload.error) {
    return {
      success: false,
      message: payload.error,
      fieldErrors: {
        payload: [payload.error],
      },
      values: formDataToValues(formData),
    };
  }

  try {
    const { supabase, profile } = adminContext;
    const { error } = await supabase.from("site_settings").upsert(
      {
        key: parsed.data.key,
        value: payload.data,
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
    revalidatePath("/");

    return {
      success: true,
      message: "Site setting saved.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Site setting could not be saved.",
      values: formDataToValues(formData),
    };
  }
}
