import type { Metadata } from "next";

import { Container } from "@/components/layout";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  PageHero,
  Select,
} from "@/components/ui";

export const metadata: Metadata = {
  title: "Get Quote",
};

export default function GetQuotePage() {
  return (
    <main>
      <PageHero
        eyebrow="Get quote"
        title="Estimate the best courier option before you book."
        description="Capture the core shipment details needed for pricing, service selection, and pickup planning in the next phase."
      />
      <Container className="py-14 sm:py-16" size="lg">
        <Card>
          <CardHeader>
            <CardTitle>Quote request details</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid gap-5 md:grid-cols-2">
              <Input label="Origin postal code" name="originPostalCode" placeholder="07102" />
              <Input
                label="Destination postal code"
                name="destinationPostalCode"
                placeholder="60601"
              />
              <Select
                label="Service level"
                name="serviceLevel"
                placeholder="Select a service"
                options={[
                  { label: "Same-day courier", value: "same_day" },
                  { label: "Next-day delivery", value: "next_day" },
                  { label: "Standard ground", value: "standard" },
                  { label: "International courier", value: "international" },
                ]}
              />
              <Input label="Package weight" name="weight" placeholder="10 lb" />
              <div className="md:col-span-2">
                <Button type="submit" size="lg">
                  Prepare quote request
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </Container>
    </main>
  );
}
