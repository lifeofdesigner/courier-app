export type SupabasePublicEnv = {
  url: string;
  anonKey: string;
};

const LOCAL_SITE_URL = "http://localhost:3000";

function normalizeEnvValue(value: string | undefined) {
  const normalized = value?.trim();

  return normalized && normalized.length > 0 ? normalized : undefined;
}

export function getSupabasePublicEnv(): SupabasePublicEnv | null {
  const url = normalizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const anonKey = normalizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (!url || !anonKey) {
    return null;
  }

  return {
    url,
    anonKey,
  };
}

export function hasSupabasePublicEnv() {
  return getSupabasePublicEnv() !== null;
}

export function requireSupabasePublicEnv(): SupabasePublicEnv {
  const env = getSupabasePublicEnv();

  if (!env) {
    throw new Error(
      "Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required.",
    );
  }

  return env;
}

export function getSiteUrl() {
  const configuredUrl = normalizeEnvValue(process.env.NEXT_PUBLIC_SITE_URL);
  const vercelUrl = normalizeEnvValue(process.env.VERCEL_URL);

  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, "");
  }

  if (vercelUrl) {
    return `https://${vercelUrl}`.replace(/\/$/, "");
  }

  return LOCAL_SITE_URL;
}
