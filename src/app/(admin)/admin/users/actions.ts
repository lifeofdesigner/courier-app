"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { assertAdminAction } from "@/lib/auth/assert-admin-action";
import type { AdminActionState } from "@/types/admin";

const roleSchema = z.object({
  userId: z.string().trim().min(1, "Select a user."),
  role: z.enum(["customer", "admin"]),
});

function getString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

export async function updateUserRoleAction(
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

  const parsed = roleSchema.safeParse({
    userId: getString(formData, "userId"),
    role: getString(formData, "role"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please choose a valid role.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const { supabase, user } = adminContext;

    if (parsed.data.userId === user.id && parsed.data.role !== "admin") {
      return {
        success: false,
        message: "You cannot remove your own admin role in this phase.",
      };
    }

    const { error } = await supabase
      .from("users")
      .update({
        role: parsed.data.role,
        updated_at: new Date().toISOString(),
      })
      .eq("id", parsed.data.userId);

    if (error) {
      throw new Error("User role could not be updated.");
    }

    revalidatePath("/admin");
    revalidatePath("/admin/users");

    return {
      success: true,
      message: "User role updated.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "The user role could not be updated.",
    };
  }
}
