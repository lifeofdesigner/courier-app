"use client";

import { CreditCard } from "lucide-react";
import { useState, useTransition } from "react";

import { useToast } from "@/components/ui/toast";
import type { StripeCheckoutResponse } from "@/types/payment";

export type CheckoutButtonProps = {
  bookingId: string;
  label?: string;
  className?: string;
};

const defaultClassName =
  "inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#FF6B2B] px-5 text-sm font-semibold text-white transition hover:bg-[#e85f22] focus:outline-none focus:ring-4 focus:ring-[#FF6B2B]/20 disabled:cursor-not-allowed disabled:opacity-60";

export function CheckoutButton({
  bookingId,
  label = "Pay now",
  className = defaultClassName,
}: CheckoutButtonProps) {
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function startCheckout() {
    setMessage("");
    startTransition(async () => {
      try {
        const response = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ bookingId }),
        });
        const payload = (await response.json()) as StripeCheckoutResponse;

        if (!payload.success || !payload.checkoutUrl) {
          const nextMessage = payload.message ?? "Checkout could not be started.";

          setMessage(nextMessage);
          toast({
            title: "Checkout failed",
            message: nextMessage,
            variant: "error",
          });
          return;
        }

        window.location.assign(payload.checkoutUrl);
      } catch {
        const nextMessage = "Checkout could not be started. Please try again.";

        setMessage(nextMessage);
        toast({
          title: "Checkout failed",
          message: nextMessage,
          variant: "error",
        });
      }
    });
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={startCheckout}
        disabled={isPending}
        className={className}
      >
        <CreditCard aria-hidden="true" className="h-4 w-4" />
        {isPending ? "Opening Stripe..." : label}
      </button>
      {message ? <p className="text-sm leading-6 text-amber-700">{message}</p> : null}
    </div>
  );
}
