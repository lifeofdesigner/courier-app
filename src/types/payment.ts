export type PaymentStatus =
  | "unpaid"
  | "checkout_created"
  | "paid"
  | "payment_failed"
  | "refunded";

export const paymentStatuses = [
  "unpaid",
  "checkout_created",
  "paid",
  "payment_failed",
  "refunded",
] as const satisfies readonly PaymentStatus[];

export function normalizePaymentStatus(status: string): PaymentStatus {
  return paymentStatuses.includes(status as PaymentStatus)
    ? (status as PaymentStatus)
    : "unpaid";
}

export function formatPaymentStatus(status: string) {
  return status
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

export interface StripeCheckoutResponse {
  success: boolean;
  checkoutUrl?: string;
  message?: string;
}

export interface PaymentSummary {
  bookingId: string;
  paymentStatus: PaymentStatus;
  amountDue: number;
  amountPaid: number;
  currency: string;
  stripeCheckoutSessionId: string | null;
  stripePaymentIntentId: string | null;
}
