"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { getSiteUrl } from "@/lib/env";
import { formDataToValues } from "@/lib/forms/preserve";
import { getUserProfileById } from "@/lib/queries/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AuthActionState } from "@/types/auth";

const emailSchema = z.string().trim().email("Enter a valid email address.");
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.");

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Enter your password."),
  next: z.string().optional(),
});

const signUpSchema = z
  .object({
    fullName: z.string().trim().min(2, "Enter your full name."),
    phone: z.string().trim().optional(),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match.",
    path: ["confirmPassword"],
  });

const forgotPasswordSchema = z.object({
  email: emailSchema,
});

function getString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

function sanitizeCustomerNextPath(nextPath: string | undefined) {
  if (!nextPath || !nextPath.startsWith("/") || nextPath.startsWith("//")) {
    return "/dashboard";
  }

  if (nextPath === "/admin" || nextPath.startsWith("/admin/")) {
    return "/dashboard";
  }

  if (nextPath === "/developer" || nextPath.startsWith("/developer/")) {
    return "/dashboard";
  }

  return nextPath;
}

function validationState(
  error: z.ZodError,
  formData: FormData,
): AuthActionState {
  return {
    success: false,
    message: "Please review the highlighted fields.",
    fieldErrors: error.flatten().fieldErrors,
    values: formDataToValues(formData),
  };
}

function missingSupabaseState(formData: FormData): AuthActionState {
  return {
    success: false,
    message:
      "Supabase is not configured yet. Add the public Supabase environment variables before using authentication.",
    values: formDataToValues(formData),
  };
}

export async function loginAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({
    email: getString(formData, "email"),
    password: getString(formData, "password"),
    next: getString(formData, "next"),
  });

  if (!parsed.success) {
    return validationState(parsed.error, formData);
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return missingSupabaseState(formData);
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return {
      success: false,
      message:
        "We could not sign you in with those details. Check your email and password, then try again.",
      values: formDataToValues(formData),
    };
  }

  redirect(sanitizeCustomerNextPath(parsed.data.next));
}

export async function adminLoginAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({
    email: getString(formData, "email"),
    password: getString(formData, "password"),
  });

  if (!parsed.success) {
    return validationState(parsed.error, formData);
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return missingSupabaseState(formData);
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return {
      success: false,
      message:
        "We could not sign you in with those admin credentials. Check the details, then try again.",
      values: formDataToValues(formData),
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: "We could not verify this admin session. Please try again.",
      values: formDataToValues(formData),
    };
  }

  const profile = await getUserProfileById(supabase, user.id);

  if (profile?.role !== "admin") {
    await supabase.auth.signOut();

    return {
      success: false,
      message:
        "This account does not have admin access. Use customer sign-in for dashboard access.",
      values: formDataToValues(formData),
    };
  }

  redirect("/admin");
}

export async function signUpAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = signUpSchema.safeParse({
    fullName: getString(formData, "fullName"),
    phone: getString(formData, "phone"),
    email: getString(formData, "email"),
    password: getString(formData, "password"),
    confirmPassword: getString(formData, "confirmPassword"),
  });

  if (!parsed.success) {
    return validationState(parsed.error, formData);
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return missingSupabaseState(formData);
  }

  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.fullName,
        phone: parsed.data.phone ?? "",
      },
      emailRedirectTo: `${getSiteUrl()}/auth/callback`,
    },
  });

  if (error) {
    return {
      success: false,
      message:
        "We could not create the account right now. Please check the details and try again.",
      values: formDataToValues(formData),
    };
  }

  return {
    success: true,
    message:
      "Account created. If email confirmation is enabled, check your inbox to finish signing in.",
    redirectTo: "/login",
  };
}

export async function forgotPasswordAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = forgotPasswordSchema.safeParse({
    email: getString(formData, "email"),
  });

  if (!parsed.success) {
    return validationState(parsed.error, formData);
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return missingSupabaseState(formData);
  }

  const { error } = await supabase.auth.resetPasswordForEmail(
    parsed.data.email,
    {
      redirectTo: `${getSiteUrl()}/auth/callback?next=/login`,
    },
  );

  if (error) {
    return {
      success: false,
      message:
        "We could not prepare a reset email right now. Please try again shortly.",
      values: formDataToValues(formData),
    };
  }

  return {
    success: true,
    message:
      "If an account exists for that email, a password reset link will arrive shortly.",
  };
}
