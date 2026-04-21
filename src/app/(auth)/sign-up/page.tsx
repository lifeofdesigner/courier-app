import type { Metadata } from "next";

import { AuthShell, SignUpForm } from "@/components/auth";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function SignUpPage() {
  return (
    <AuthShell
      eyebrow="Create account"
      title="Open a customer account."
      description="Create an account for saved quotes, pickup requests, and customer-owned shipment records."
    >
      <SignUpForm />
    </AuthShell>
  );
}
