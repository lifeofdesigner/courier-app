import type { Metadata } from "next";

import { AuthShell, LoginForm } from "@/components/auth";

export const metadata: Metadata = {
  title: "Login",
};

type LoginPageProps = {
  searchParams: Promise<{
    next?: string;
    message?: string;
  }>;
};

function safeNextPath(nextPath: string | undefined) {
  if (!nextPath || !nextPath.startsWith("/") || nextPath.startsWith("//")) {
    return "/dashboard";
  }

  return nextPath;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <AuthShell
      eyebrow="Customer access"
      title="Sign in to manage shipments."
      description="Access your quotes, pickup requests, and shipment activity from one secure customer dashboard."
    >
      <LoginForm
        nextPath={safeNextPath(params.next)}
        message={params.message}
      />
    </AuthShell>
  );
}
