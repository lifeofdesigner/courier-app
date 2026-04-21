import { NextResponse } from "next/server";

import { hasStripeServerEnv } from "@/lib/env";
import {
  getBookingForPayment,
  updateBookingAfterCheckoutCreation,
} from "@/lib/queries/payments";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createCheckoutSessionForBooking } from "@/lib/stripe/checkout";
import type { StripeCheckoutResponse } from "@/types/payment";

export const runtime = "nodejs";

function jsonResponse(body: StripeCheckoutResponse, status = 200) {
  return NextResponse.json(body, { status });
}

export async function POST(request: Request) {
  if (!hasStripeServerEnv()) {
    return jsonResponse(
      {
        success: false,
        message:
          "Stripe is not configured yet. Add STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET to enable checkout.",
      },
      503,
    );
  }

  let body: { bookingId?: unknown };

  try {
    body = (await request.json()) as { bookingId?: unknown };
  } catch {
    return jsonResponse(
      {
        success: false,
        message: "Send a valid JSON body with a bookingId.",
      },
      400,
    );
  }

  const bookingId =
    typeof body.bookingId === "string" ? body.bookingId.trim() : "";

  if (!bookingId) {
    return jsonResponse(
      {
        success: false,
        message: "A booking ID is required to start payment.",
      },
      400,
    );
  }

  try {
    const [booking, supabase] = await Promise.all([
      getBookingForPayment(bookingId),
      createSupabaseServerClient(),
    ]);

    if (!booking) {
      return jsonResponse(
        {
          success: false,
          message: "Booking was not found.",
        },
        404,
      );
    }

    const {
      data: { user },
    } = supabase
      ? await supabase.auth.getUser()
      : { data: { user: null } };

    if (booking.userId && booking.userId !== user?.id) {
      return jsonResponse(
        {
          success: false,
          message: "Sign in with the account that owns this booking.",
        },
        403,
      );
    }

    if (booking.paymentStatus === "paid") {
      return jsonResponse(
        {
          success: false,
          message: "This booking is already paid.",
        },
        409,
      );
    }

    if (booking.amountDue <= 0) {
      return jsonResponse(
        {
          success: false,
          message: "This booking does not have a payable amount yet.",
        },
        409,
      );
    }

    const session = await createCheckoutSessionForBooking(booking);

    await updateBookingAfterCheckoutCreation({
      bookingId,
      sessionId: session.id,
    });

    if (!session.url) {
      return jsonResponse(
        {
          success: false,
          message: "Stripe did not return a checkout URL.",
        },
        502,
      );
    }

    return jsonResponse({
      success: true,
      checkoutUrl: session.url,
    });
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Checkout could not be started right now.",
      },
      500,
    );
  }
}
