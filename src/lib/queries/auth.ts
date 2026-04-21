import type { User } from "@supabase/supabase-js";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AppUserProfile } from "@/types/auth";

export type CurrentAuthState = {
  user: User | null;
  profileRole: AppUserProfile["role"] | null;
};

function isAppUserRole(role: unknown): role is AppUserProfile["role"] {
  return role === "customer" || role === "admin";
}

export async function getCurrentAuthState(): Promise<CurrentAuthState> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return { user: null, profileRole: null };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { user: null, profileRole: null };
  }

  const { data, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !data || !isAppUserRole(data.role)) {
    return { user, profileRole: null };
  }

  return { user, profileRole: data.role };
}

export async function getCurrentUserProfile(): Promise<AppUserProfile | null> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("users")
    .select("id, full_name, phone, role, created_at, updated_at")
    .eq("id", user.id)
    .single();

  if (error || !data || !isAppUserRole(data.role)) {
    return {
      id: user.id,
      fullName:
        typeof user.user_metadata.full_name === "string"
          ? user.user_metadata.full_name
          : null,
      phone:
        typeof user.user_metadata.phone === "string"
          ? user.user_metadata.phone
          : null,
      role: "customer",
      createdAt: user.created_at,
      updatedAt: user.updated_at ?? user.created_at,
    };
  }

  return {
    id: data.id,
    fullName: data.full_name,
    phone: data.phone,
    role: data.role,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}
