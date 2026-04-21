"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { assertAdminAction } from "@/lib/auth/assert-admin-action";
import { uploadCmsAsset } from "@/lib/storage/cms-assets";
import type { AdminActionState } from "@/types/admin";

type CmsUploadState = AdminActionState & {
  publicUrl?: string;
  path?: string;
};

const cmsSectionSchema = z.object({
  section: z.string().trim().min(1, "Enter a section."),
  key: z.string().trim().min(1, "Enter a key."),
  payload: z.string().trim().min(2, "Enter a JSON payload."),
});

const toggleSchema = z.object({
  id: z.string().trim().min(1, "Select a CMS row."),
  published: z.enum(["true", "false"]),
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

export async function upsertCmsSectionAction(
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

  const parsed = cmsSectionSchema.safeParse({
    section: getString(formData, "section"),
    key: getString(formData, "key"),
    payload: getString(formData, "payload"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please review the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
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
    };
  }

  try {
    const { supabase, profile } = adminContext;
    const { error } = await supabase
      .from("cms_content")
      .upsert(
        {
          section: parsed.data.section,
          key: parsed.data.key,
          value: payload.data,
          updated_by: profile.id,
        },
        {
          onConflict: "section,key",
        },
      );

    if (error) {
      throw new Error("CMS section could not be saved.");
    }

    revalidatePath("/");
    revalidatePath("/admin/cms");

    return {
      success: true,
      message: "CMS section saved.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "CMS section could not be saved.",
    };
  }
}

export async function toggleCmsPublishAction(
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

  const parsed = toggleSchema.safeParse({
    id: getString(formData, "id"),
    published: getString(formData, "published"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "CMS publish state could not be changed.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const { supabase, profile } = adminContext;
    const { error } = await supabase
      .from("cms_content")
      .update({
        published: parsed.data.published !== "true",
        updated_by: profile.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", parsed.data.id);

    if (error) {
      throw new Error("Publish state could not be changed.");
    }

    revalidatePath("/");
    revalidatePath("/admin/cms");

    return {
      success: true,
      message: "Publish state updated.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Publish state could not be changed.",
    };
  }
}

export async function uploadCmsAssetAction(
  _previousState: CmsUploadState,
  formData: FormData,
): Promise<CmsUploadState> {
  try {
    await assertAdminAction();
    const folder = getString(formData, "folder") || "homepage/general";
    const file = formData.get("file");

    if (!(file instanceof File) || file.size === 0) {
      return {
        success: false,
        message: "Choose an image file to upload.",
      };
    }

    if (!file.type.startsWith("image/")) {
      return {
        success: false,
        message: "Only image uploads are supported for CMS assets.",
      };
    }

    const uploaded = await uploadCmsAsset({
      file,
      folder,
    });

    revalidatePath("/admin/cms");

    return {
      success: true,
      message: "CMS asset uploaded.",
      publicUrl: uploaded.publicUrl,
      path: uploaded.path,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "CMS asset could not be uploaded.",
    };
  }
}
