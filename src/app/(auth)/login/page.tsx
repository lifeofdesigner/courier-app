import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <main>
      <PageHero
        eyebrow="Customer access"
        title="Sign in to manage shipments."
        description="The authentication view is scaffolded for Supabase Auth integration in the next phase."
        align="center"
      />
      <Container className="py-14 sm:py-16" size="sm">
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid gap-5">
              <Input label="Email" name="email" type="email" placeholder="you@example.com" />
              <Input label="Password" name="password" type="password" />
              <Button type="submit" size="lg" isFullWidth>
                Sign in
              </Button>
            </form>
            <div className="mt-5 flex flex-col gap-2 text-sm text-muted sm:flex-row sm:justify-between">
              <Link href="/forgot-password" className="font-semibold text-primary">
                Forgot password?
              </Link>
              <Link href="/sign-up" className="font-semibold text-primary">
                Create an account
              </Link>
            </div>
          </CardContent>
        </Card>
      </Container>
    </main>
  );
}
