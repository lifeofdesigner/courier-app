"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import {
  grantBootstrapAccess,
  requireBootstrapAccess,
} from "@/lib/developer/require-bootstrap-access";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";
import type { CreateUserActionState } from "@/types/admin";
import type { BootstrapAccessActionState } from "@/types/auth";

const bootstrapSecretSchema = z.object({
  secret: z.string().trim().min(1, "Enter the bootstrap secret."),
});

const createBootstrapUserSchema = z
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

export async function unlockBootstrapAccessAction(
  _previousState: BootstrapAccessActionState,
  formData: FormData,
): Promise<BootstrapAccessActionState> {
  const parsed = bootstrapSecretSchema.safeParse({
    secret: getString(formData, "secret"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.flatten().fieldErrors.secret?.[0] ?? "Try again.",
    };
  }

  const status = await grantBootstrapAccess(parsed.data.secret);

  if (!status.allowed) {
    return {
      success: false,
      message: status.message,
    };
  }

  redirect("/developer/bootstrap-users");
}

export async function createBootstrapUserAction(
  _previousState: CreateUserActionState,
  formData: FormData,
): Promise<CreateUserActionState> {
  try {
    await requireBootstrapAccess();
  } catch {
    return {
      success: false,
      message: "Developer bootstrap access is required to create users.",
    };
  }

  const parsed = createBootstrapUserSchema.safeParse({
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
  const normalizedPhone = phone && phone.length > 0 ? phone : null;
  let serviceRoleClient: ReturnType<typeof createSupabaseServiceRoleClient>;

  try {
    serviceRoleClient = createSupabaseServiceRoleClient();
  } catch {
    return {
      success: false,
      message:
        "Supabase service-role configuration is required to create bootstrap users.",
    };
  }

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

  const serverSupabase = serviceRoleClient;
  const { error: profileError } = await serverSupabase
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

  return {
    success: true,
    message: "Bootstrap user account created.",
    createdUserId: createdUser.id,
    createdEmail: email,
    createdRole: role,
  };
}
