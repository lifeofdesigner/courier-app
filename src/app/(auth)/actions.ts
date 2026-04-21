"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { getSiteUrl } from "@/lib/env";
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

function sanitizeNextPath(nextPath: string | undefined) {
  if (!nextPath || !nextPath.startsWith("/") || nextPath.startsWith("//")) {
    return "/dashboard";
  }

  return nextPath;
}

function validationState(error: z.ZodError): AuthActionState {
  return {
    success: false,
    message: "Please review the highlighted fields.",
    fieldErrors: error.flatten().fieldErrors,
  };
}

function missingSupabaseState(): AuthActionState {
  return {
    success: false,
    message:
      "Supabase is not configured yet. Add the public Supabase environment variables before using authentication.",
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
    return validationState(parsed.error);
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return missingSupabaseState();
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
    };
  }

  redirect(sanitizeNextPath(parsed.data.next));
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
    return validationState(parsed.error);
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return missingSupabaseState();
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
    return validationState(parsed.error);
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return missingSupabaseState();
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
    };
  }

  return {
    success: true,
    message:
      "If an account exists for that email, a password reset link will arrive shortly.",
  };
}
