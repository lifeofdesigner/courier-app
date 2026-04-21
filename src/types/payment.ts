export type PaymentStatus =
  | "unpaid"
  | "checkout_created"
  | "paid"
  | "payment_failed"
  | "refunded";

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
