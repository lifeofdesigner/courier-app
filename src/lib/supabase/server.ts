import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import {
  getSupabasePublicEnv,
  requireSupabaseServiceRoleEnv,
} from "@/lib/env";

export async function createSupabaseServerClient(): Promise<SupabaseClient | null> {
  const env = getSupabasePublicEnv();

  if (!env) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components can read cookies, while Route Handlers and Actions can write them.
        }
      },
    },
  });
}

export function createSupabaseServiceRoleClient(): SupabaseClient {
  const env = requireSupabaseServiceRoleEnv();

  return createClient(env.url, env.serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
