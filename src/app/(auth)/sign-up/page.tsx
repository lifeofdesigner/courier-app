import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function SignUpPage() {
  return (
    <main>
      <PageHero
        eyebrow="Create account"
        title="Open a customer account."
        description="This route is ready for customer registration, profile setup, and shipment history once authentication is connected."
        align="center"
      />
      <Container className="py-14 sm:py-16" size="sm">
        <Card>
          <CardHeader>
            <CardTitle>Account details</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid gap-5">
              <Input label="Full name" name="name" placeholder="Jane Smith" />
              <Input label="Company" name="company" placeholder="Optional" />
              <Input label="Email" name="email" type="email" placeholder="you@example.com" />
              <Input label="Password" name="password" type="password" />
              <Button type="submit" size="lg" isFullWidth>
                Create account
              </Button>
            </form>
            <p className="mt-5 text-sm text-muted">
              Already have an account?{" "}
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
