import Stripe from "stripe";

import { requireStripeServerEnv } from "@/lib/env";

let stripeClient: Stripe | null = null;

export function getStripeServerClient() {
  if (!stripeClient) {
    stripeClient = new Stripe(requireStripeServerEnv().secretKey);
  }

  return stripeClient;
}

export function getStripeWebhookSecret() {
  return requireStripeServerEnv().webhookSecret;
}
