"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabasePublicEnv } from "@/lib/env";

export function createSupabaseBrowserClient(): SupabaseClient | null {
  const env = getSupabasePublicEnv();

  if (!env) {
    return null;
  }

  return createBrowserClient(env.url, env.anonKey);
}
