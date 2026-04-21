import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AppUserProfile } from "@/types/auth";

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

  if (error || !data) {
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
