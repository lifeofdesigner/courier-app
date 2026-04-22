"use client";

import { useEffect, useRef } from "react";

import { useToast, type ToastInput } from "@/components/ui/toast";

export function ToastOnMount({ title, message, variant }: ToastInput) {
  const { toast } = useToast();
  const hasShownRef = useRef(false);

  useEffect(() => {
    if (hasShownRef.current) {
      return;
    }

    hasShownRef.current = true;

    toast({
      title,
      message,
      variant,
    });
  }, [message, title, toast, variant]);

  return null;
}
