import type { Metadata } from "next";
import { Mail, Phone } from "lucide-react";

import { Container } from "@/components/layout";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  PageHero,
  Textarea,
} from "@/components/ui";
import { company } from "@/constants/site";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <main>
      <PageHero
        eyebrow="Contact"
        title="Reach the courier support team."
        description="Give customers a clear place to ask about tracking, pickup planning, quotes, and shipment support."
      />
      <Container className="grid gap-6 py-14 sm:py-16 lg:grid-cols-[0.7fr_1fr]" size="lg">
        <Card className="p-6">
          <h2 className="text-xl font-bold tracking-tight text-navy">
            Support details
          </h2>
          <div className="mt-6 space-y-4 text-sm text-slate-700">
            <p className="flex gap-3">
              <Phone aria-hidden="true" className="mt-0.5 h-4 w-4 text-primary" />
              {company.phone}
            </p>
            <p className="flex gap-3">
              <Mail aria-hidden="true" className="mt-0.5 h-4 w-4 text-primary" />
              {company.email}
            </p>
          </div>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Send a message</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid gap-5">
              <div className="grid gap-5 md:grid-cols-2">
                <Input label="Name" name="name" placeholder="Jane Smith" />
                <Input label="Email" name="email" type="email" placeholder="jane@example.com" />
              </div>
              <Input
                label="Tracking number"
                name="trackingNumber"
                placeholder="Optional"
              />
              <Textarea
                label="How can we help?"
                name="message"
                placeholder="Tell us about the shipment or service you need."
              />
              <Button type="submit" size="lg">
                Prepare message
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>
    </main>
  );
}
