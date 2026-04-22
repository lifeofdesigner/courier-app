"use client";

import { useEffect, useRef } from "react";

import { useToast, type ToastVariant } from "@/components/ui/toast";

type ActionToastState = {
  success?: boolean;
  message?: string;
};

export type ActionToastOptions = {
  successTitle?: string;
  errorTitle?: string;
  warningTitle?: string;
  variant?: ToastVariant;
};

export function useActionToast(
  state: ActionToastState | null | undefined,
  options: ActionToastOptions = {},
) {
  const { toast } = useToast();
  const previousStateRef = useRef<ActionToastState | null | undefined>(state);

  useEffect(() => {
    if (previousStateRef.current === state) {
      return;
    }

    previousStateRef.current = state;

    const message = state?.message?.trim();

    if (!message) {
      return;
    }

    const variant = options.variant ?? (state?.success ? "success" : "error");
    const title =
      variant === "success"
        ? options.successTitle
        : variant === "warning"
          ? options.warningTitle
          : options.errorTitle;

    toast({
      title,
      message,
      variant,
    });
  }, [options.errorTitle, options.successTitle, options.variant, options.warningTitle, state, toast]);
}
