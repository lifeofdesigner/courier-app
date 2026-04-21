import { Resend } from "resend";

import { getResendEnv } from "@/lib/env";

let resendClient: Resend | null = null;

export function getResendServerClient() {
  const env = getResendEnv();

  if (!env) {
    return null;
  }

  if (!resendClient) {
    resendClient = new Resend(env.apiKey);
  }

  return resendClient;
}

export function getResendFromEmail() {
  return getResendEnv()?.fromEmail ?? null;
}
