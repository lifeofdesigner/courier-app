"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { assertAdminAction } from "@/lib/auth/assert-admin-action";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";
import type { CreateUserActionState } from "@/types/admin";

const createUserSchema = z
  .object({
    fullName: z.string().trim().min(1, "Enter a full name."),
    phone: z.string().trim().optional(),
    email: z.string().trim().email("Enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(1, "Confirm the password."),
    role: z.enum(["customer", "admin"], {
      message: "Choose a valid role.",
    }),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords must match.",
  });

function getString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

function safeCreateUserError(message?: string) {
  const normalizedMessage = message?.toLowerCase() ?? "";

  if (
    normalizedMessage.includes("already") ||
    normalizedMessage.includes("registered") ||
    normalizedMessage.includes("exists")
  ) {
    return "A user with this email address already exists.";
  }

  if (normalizedMessage.includes("password")) {
    return "The password does not meet the authentication requirements.";
  }

  return "The user account could not be created right now.";
}

export async function createAdminUserAction(
  _previousState: CreateUserActionState,
  formData: FormData,
): Promise<CreateUserActionState> {
  try {
    await assertAdminAction();
  } catch {
    return {
      success: false,
      message: "Admin access is required to create users.",
    };
  }

  const parsed = createUserSchema.safeParse({
    fullName: getString(formData, "fullName"),
    phone: getString(formData, "phone"),
    email: getString(formData, "email"),
    password: getString(formData, "password"),
    confirmPassword: getString(formData, "confirmPassword"),
    role: getString(formData, "role"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please review the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { fullName, phone, email, password, role } = parsed.data;
  let serviceRoleClient: ReturnType<typeof createSupabaseServiceRoleClient>;

  try {
    serviceRoleClient = createSupabaseServiceRoleClient();
  } catch {
    return {
      success: false,
      message:
        "Supabase service-role configuration is required to create users.",
    };
  }

  const normalizedPhone = phone && phone.length > 0 ? phone : null;

  const { data, error: createError } =
    await serviceRoleClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        phone: normalizedPhone,
      },
    });

  const createdUser = data.user;

  if (createError || !createdUser) {
    return {
      success: false,
      message: safeCreateUserError(createError?.message),
    };
  }

  const { error: profileError } = await serviceRoleClient
    .from("users")
    .update({
      full_name: fullName,
      phone: normalizedPhone,
      role,
      updated_at: new Date().toISOString(),
    })
    .eq("id", createdUser.id)
    .select()
    .single();

  if (profileError) {
    return {
      success: false,
      message:
        "The auth user was created, but the public profile role could not be updated.",
    };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/users");
  revalidatePath("/admin/users/create");

  return {
    success: true,
    message: "User account created.",
    createdUserId: createdUser.id,
    createdEmail: email,
    createdRole: role,
  };
}
