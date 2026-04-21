import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { requireSupabaseServiceRoleEnv } from "@/lib/env";

let serviceRoleClient: SupabaseClient | null = null;

export function createSupabaseServiceRoleClient(): SupabaseClient {
  if (!serviceRoleClient) {
    const env = requireSupabaseServiceRoleEnv();

    serviceRoleClient = createClient(env.url, env.serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return serviceRoleClient;
}
