import type { SupabaseClient, User } from "@supabase/supabase-js";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AppUserProfile } from "@/types/auth";

export type CurrentAuthState = {
  user: User | null;
  profileRole: AppUserProfile["role"] | null;
};

function isAppUserRole(role: unknown): role is AppUserProfile["role"] {
  return role === "customer" || role === "admin";
}

type ProfileRow = {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: AppUserProfile["role"];
  created_at: string;
  updated_at: string;
};

function mapProfile(row: ProfileRow): AppUserProfile {
  return {
    id: row.id,
    fullName: row.full_name,
    phone: row.phone,
    role: row.role,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getUserProfileById(
  supabase: SupabaseClient,
  userId: string,
): Promise<AppUserProfile | null> {
  const { data, error } = await supabase
    .from("users")
    .select("id, full_name, phone, role, created_at, updated_at")
    .eq("id", userId)
    .single();

  if (error || !data || !isAppUserRole(data.role)) {
    return null;
  }

  return mapProfile(data as ProfileRow);
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

  const profile = await getUserProfileById(supabase, user.id);

  if (!profile) {
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

  return profile;
}
