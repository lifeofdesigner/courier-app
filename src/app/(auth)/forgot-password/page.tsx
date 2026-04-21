import type { Metadata } from "next";

import { AuthShell, ForgotPasswordForm } from "@/components/auth";

export const metadata: Metadata = {
  title: "Forgot Password",
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Reset account access."
      description="Enter your email and we will send reset instructions if an account exists."
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
