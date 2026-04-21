import { DEFAULT_SITE_URL } from "@/constants/site";

export type SupabasePublicEnv = {
  url: string;
  anonKey: string;
};

export type SupabaseServiceRoleEnv = SupabasePublicEnv & {
  serviceRoleKey: string;
};

export type StripeServerEnv = {
  secretKey: string;
  webhookSecret: string;
};

export type StripePublicEnv = {
  publishableKey: string;
};

export type ResendEnv = {
  apiKey: string;
  fromEmail: string;
};

export type LaunchEnvStatus = {
  key: string;
  label: string;
  configured: boolean;
  requiredFor: "core app" | "payments" | "emails" | "production URL";
};

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

export function getSupabaseServiceRoleEnv(): SupabaseServiceRoleEnv | null {
  const publicEnv = getSupabasePublicEnv();
  const serviceRoleKey = normalizeEnvValue(process.env.SUPABASE_SERVICE_ROLE_KEY);

  if (!publicEnv || !serviceRoleKey) {
    return null;
  }

  return {
    ...publicEnv,
    serviceRoleKey,
  };
}

export function requireSupabaseServiceRoleEnv(): SupabaseServiceRoleEnv {
  const env = getSupabaseServiceRoleEnv();

  if (!env) {
    throw new Error(
      "Missing Supabase service role configuration. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY for trusted server-side payment and label operations.",
    );
  }

  return env;
}

export function getStripeServerEnv(): StripeServerEnv | null {
  const secretKey = normalizeEnvValue(process.env.STRIPE_SECRET_KEY);
  const webhookSecret = normalizeEnvValue(process.env.STRIPE_WEBHOOK_SECRET);

  if (!secretKey || !webhookSecret) {
    return null;
  }

  return {
    secretKey,
    webhookSecret,
  };
}

export function requireStripeServerEnv(): StripeServerEnv {
  const env = getStripeServerEnv();

  if (!env) {
    throw new Error(
      "Missing Stripe environment variables: STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET are required for payments.",
    );
  }

  return env;
}

export function hasStripeServerEnv() {
  return getStripeServerEnv() !== null;
}

export function getStripePublicEnv(): StripePublicEnv | null {
  const publishableKey = normalizeEnvValue(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  );

  if (!publishableKey) {
    return null;
  }

  return {
    publishableKey,
  };
}

export function getResendEnv(): ResendEnv | null {
  const apiKey = normalizeEnvValue(process.env.RESEND_API_KEY);
  const fromEmail = normalizeEnvValue(process.env.RESEND_FROM_EMAIL);

  if (!apiKey || !fromEmail) {
    return null;
  }

  return {
    apiKey,
    fromEmail,
  };
}

export function getLaunchEnvStatus(): LaunchEnvStatus[] {
  return [
    {
      key: "NEXT_PUBLIC_SUPABASE_URL",
      label: "Supabase URL",
      configured: Boolean(normalizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL)),
      requiredFor: "core app",
    },
    {
      key: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      label: "Supabase anon key",
      configured: Boolean(
        normalizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      ),
      requiredFor: "core app",
    },
    {
      key: "SUPABASE_SERVICE_ROLE_KEY",
      label: "Supabase service role key",
      configured: Boolean(normalizeEnvValue(process.env.SUPABASE_SERVICE_ROLE_KEY)),
      requiredFor: "payments",
    },
    {
      key: "STRIPE_SECRET_KEY",
      label: "Stripe secret key",
      configured: Boolean(normalizeEnvValue(process.env.STRIPE_SECRET_KEY)),
      requiredFor: "payments",
    },
    {
      key: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
      label: "Stripe publishable key",
      configured: Boolean(
        normalizeEnvValue(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY),
      ),
      requiredFor: "payments",
    },
    {
      key: "STRIPE_WEBHOOK_SECRET",
      label: "Stripe webhook secret",
      configured: Boolean(normalizeEnvValue(process.env.STRIPE_WEBHOOK_SECRET)),
      requiredFor: "payments",
    },
    {
      key: "RESEND_API_KEY",
      label: "Resend API key",
      configured: Boolean(normalizeEnvValue(process.env.RESEND_API_KEY)),
      requiredFor: "emails",
    },
    {
      key: "RESEND_FROM_EMAIL",
      label: "Resend from email",
      configured: Boolean(normalizeEnvValue(process.env.RESEND_FROM_EMAIL)),
      requiredFor: "emails",
    },
    {
      key: "NEXT_PUBLIC_SITE_URL",
      label: "Public site URL",
      configured: Boolean(normalizeEnvValue(process.env.NEXT_PUBLIC_SITE_URL)),
      requiredFor: "production URL",
    },
  ];
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

  return DEFAULT_SITE_URL;
}
