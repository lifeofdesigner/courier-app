import type { User } from "@supabase/supabase-js";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AppUserProfile } from "@/types/auth";

type ProfileRow = {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: "customer" | "admin";
  created_at: string;
  updated_at: string;
};

export class AdminActionError extends Error {
  constructor(message = "Admin access is required for this action.") {
    super(message);
    this.name = "AdminActionError";
  }
}

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

export async function assertAdminAction() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    throw new AdminActionError(
      "Supabase is not configured, so admin actions are unavailable.",
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new AdminActionError("Sign in as an admin to continue.");
  }

  const { data, error } = await supabase
    .from("users")
    .select("id, full_name, phone, role, created_at, updated_at")
    .eq("id", user.id)
    .single();

  if (error || !data || (data as ProfileRow).role !== "admin") {
    throw new AdminActionError("Only admins can perform this action.");
  }

  return {
    supabase,
    user: user as User,
    profile: mapProfile(data as ProfileRow),
  };
}
