import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Forgot Password",
};

export default function ForgotPasswordPage() {
  return (
    <main>
      <PageHero
        eyebrow="Account recovery"
        title="Reset account access."
        description="A clean recovery screen is ready for Supabase password reset email handling in the next phase."
        align="center"
      />
      <Container className="py-14 sm:py-16" size="sm">
        <Card>
          <CardHeader>
            <CardTitle>Password reset</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid gap-5">
              <Input label="Email" name="email" type="email" placeholder="you@example.com" />
              <Button type="submit" size="lg" isFullWidth>
                Prepare reset email
              </Button>
            </form>
            <p className="mt-5 text-sm text-muted">
              Remembered your password?{" "}
              <Link href="/login" className="font-semibold text-primary">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </Container>
    </main>
  );
}
