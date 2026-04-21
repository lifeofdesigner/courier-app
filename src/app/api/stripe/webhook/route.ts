import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { sendPaymentEmail } from "@/lib/email/send-payment-email";
import {
  createOrderAfterSuccessfulPaymentIfMissing,
  markBookingPaid,
  markBookingPaymentFailed,
} from "@/lib/queries/payments";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import {
  getStripeServerClient,
  getStripeWebhookSecret,
} from "@/lib/stripe/server";

export const runtime = "nodejs";

function getPaymentIntentId(session: Stripe.Checkout.Session) {
  const paymentIntent = session.payment_intent;

  if (!paymentIntent) {
    return null;
  }

  return typeof paymentIntent === "string" ? paymentIntent : paymentIntent.id;
}

function getAmountPaid(session: Stripe.Checkout.Session) {
  if (typeof session.amount_total === "number") {
    return session.amount_total / 100;
  }

  return 0;
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const bookingId = session.metadata?.bookingId;

  if (!bookingId) {
    throw new Error("Stripe checkout session is missing bookingId metadata.");
  }

  const supabase = createSupabaseServiceRoleClient();
  const amountPaid = getAmountPaid(session);
  const paymentIntentId = getPaymentIntentId(session);
  const { error } = await markBookingPaid({
    bookingId,
    sessionId: session.id,
    paymentIntentId,
    amountPaid,
    supabase,
  });

  if (error) {
    throw new Error("Booking payment state could not be updated.");
  }

  const fulfillment = await createOrderAfterSuccessfulPaymentIfMissing({
    bookingId,
    supabase,
  });

  await sendPaymentEmail(fulfillment);
}

async function handleCheckoutExpired(session: Stripe.Checkout.Session) {
  const bookingId = session.metadata?.bookingId;

  if (!bookingId) {
    return;
  }

  const supabase = createSupabaseServiceRoleClient();
  await markBookingPaymentFailed({
    bookingId,
    supabase,
  });
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  const bookingId = paymentIntent.metadata?.bookingId;

  if (!bookingId) {
    return;
  }

  const supabase = createSupabaseServiceRoleClient();
  await markBookingPaymentFailed({
    bookingId,
    supabase,
  });
}

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      {
        received: false,
        message: "Missing Stripe signature.",
      },
      { status: 400 },
    );
  }

  const rawBody = await request.text();
  let event: Stripe.Event;

  try {
    event = getStripeServerClient().webhooks.constructEvent(
      rawBody,
      signature,
      getStripeWebhookSecret(),
    );
  } catch (error) {
    return NextResponse.json(
      {
        received: false,
        message:
          error instanceof Error
            ? `Webhook signature verification failed: ${error.message}`
            : "Webhook signature verification failed.",
      },
      { status: 400 },
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(
          event.data.object as Stripe.Checkout.Session,
        );
        break;
      case "checkout.session.expired":
        await handleCheckoutExpired(event.data.object as Stripe.Checkout.Session);
        break;
      case "payment_intent.payment_failed":
        await handlePaymentIntentFailed(
          event.data.object as Stripe.PaymentIntent,
        );
        break;
      default:
        break;
    }

    return NextResponse.json({
      received: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        received: false,
        message:
          error instanceof Error
            ? error.message
            : "Webhook event could not be processed.",
      },
      { status: 500 },
    );
  }
}
