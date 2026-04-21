import "server-only";

import { createHash, createHmac, timingSafeEqual } from "crypto";
import { cookies, headers } from "next/headers";

import {
  getDeveloperBootstrapEnv,
  getSupabaseServiceRoleEnv,
  type DeveloperBootstrapEnv,
} from "@/lib/env";

const BOOTSTRAP_ACCESS_COOKIE = "atlas_bootstrap_access";
const BOOTSTRAP_ACCESS_MAX_AGE_SECONDS = 60 * 60;

export type BootstrapAccessReason =
  | "allowed"
  | "disabled"
  | "missing-secret"
  | "missing-service-role"
  | "local-only"
  | "missing-cookie"
  | "invalid-cookie"
  | "invalid-secret";

export type BootstrapAccessStatus = {
  allowed: boolean;
  reason: BootstrapAccessReason;
  message: string;
  unavailable?: boolean;
};

export class BootstrapAccessError extends Error {
  status: BootstrapAccessStatus;

  constructor(status: BootstrapAccessStatus) {
    super(status.message);
    this.name = "BootstrapAccessError";
    this.status = status;
  }
}

function hashValue(value: string) {
  return createHash("sha256").update(value).digest();
}

function safeStringEqual(left: string, right: string) {
  return timingSafeEqual(hashValue(left), hashValue(right));
}

function signCookiePayload(secret: string, payload: string) {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

function createCookieValue(secret: string) {
  const issuedAt = Date.now().toString();
  const payload = `v1.${issuedAt}`;
  const signature = signCookiePayload(secret, payload);

  return `${payload}.${signature}`;
}

function isValidCookieValue(value: string | undefined, secret: string) {
  if (!value) {
    return false;
  }

  const parts = value.split(".");

  if (parts.length !== 3 || parts[0] !== "v1") {
    return false;
  }

  const issuedAt = Number(parts[1]);

  if (!Number.isFinite(issuedAt)) {
    return false;
  }

  const ageMs = Date.now() - issuedAt;

  if (ageMs < 0 || ageMs > BOOTSTRAP_ACCESS_MAX_AGE_SECONDS * 1000) {
    return false;
  }

  const payload = `${parts[0]}.${parts[1]}`;
  const expectedSignature = signCookiePayload(secret, payload);
  const signatureBuffer = Buffer.from(parts[2], "hex");
  const expectedSignatureBuffer = Buffer.from(expectedSignature, "hex");

  if (signatureBuffer.length !== expectedSignatureBuffer.length) {
    return false;
  }

  return timingSafeEqual(signatureBuffer, expectedSignatureBuffer);
}

async function isLocalOrDevelopmentRequest() {
  if (process.env.NODE_ENV !== "production") {
    return true;
  }

  const headersList = await headers();
  const host = headersList.get("host")?.toLowerCase() ?? "";

  return (
    host.startsWith("localhost") ||
    host.startsWith("127.0.0.1") ||
    host.startsWith("[::1]")
  );
}

async function getBootstrapConfigurationFailure(
  env: DeveloperBootstrapEnv,
): Promise<BootstrapAccessStatus | null> {
  if (!env.enabled) {
    return {
      allowed: false,
      reason: "disabled",
      message: "Developer bootstrap is unavailable.",
      unavailable: true,
    };
  }

  if (!env.secret) {
    return {
      allowed: false,
      reason: "missing-secret",
      message: "Developer bootstrap is not configured.",
      unavailable: true,
    };
  }

  if (!getSupabaseServiceRoleEnv()) {
    return {
      allowed: false,
      reason: "missing-service-role",
      message: "Developer bootstrap is not configured.",
      unavailable: true,
    };
  }

  if (env.localOnly && !(await isLocalOrDevelopmentRequest())) {
    return {
      allowed: false,
      reason: "local-only",
      message: "Developer bootstrap is unavailable from this environment.",
      unavailable: true,
    };
  }

  return null;
}

export async function getBootstrapAccessStatus(): Promise<BootstrapAccessStatus> {
  const env = getDeveloperBootstrapEnv();
  const configurationFailure = await getBootstrapConfigurationFailure(env);

  if (configurationFailure) {
    return configurationFailure;
  }

  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(BOOTSTRAP_ACCESS_COOKIE)?.value;

  if (!cookieValue) {
    return {
      allowed: false,
      reason: "missing-cookie",
      message: "Enter the developer bootstrap secret to continue.",
    };
  }

  if (!isValidCookieValue(cookieValue, env.secret as string)) {
    return {
      allowed: false,
      reason: "invalid-cookie",
      message: "Bootstrap access has expired. Enter the secret again.",
    };
  }

  return {
    allowed: true,
    reason: "allowed",
    message: "Developer bootstrap access verified.",
  };
}

export async function grantBootstrapAccess(
  submittedSecret: string,
): Promise<BootstrapAccessStatus> {
  const env = getDeveloperBootstrapEnv();
  const configurationFailure = await getBootstrapConfigurationFailure(env);

  if (configurationFailure) {
    return configurationFailure;
  }

  if (!safeStringEqual(submittedSecret, env.secret as string)) {
    return {
      allowed: false,
      reason: "invalid-secret",
      message: "Bootstrap access could not be verified.",
    };
  }

  const cookieStore = await cookies();

  cookieStore.set(BOOTSTRAP_ACCESS_COOKIE, createCookieValue(env.secret as string), {
    httpOnly: true,
    maxAge: BOOTSTRAP_ACCESS_MAX_AGE_SECONDS,
    path: "/developer/bootstrap-users",
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  return {
    allowed: true,
    reason: "allowed",
    message: "Developer bootstrap access verified.",
  };
}

export async function requireBootstrapAccess() {
  const status = await getBootstrapAccessStatus();

  if (!status.allowed) {
    throw new BootstrapAccessError(status);
  }

  return status;
}
