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
  Textarea,
} from "@/components/ui";

export const metadata: Metadata = {
  title: "Book Pickup",
};

export default function BookPickupPage() {
  return (
    <main>
      <PageHero
        eyebrow="Book pickup"
        title="Schedule a pickup with clear collection details."
        description="Set up the customer-facing pickup form structure before availability, dispatch, and shipment creation are connected."
      />
      <Container className="py-14 sm:py-16" size="lg">
        <Card>
          <CardHeader>
            <CardTitle>Pickup information</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid gap-5 md:grid-cols-2">
              <Input label="Contact name" name="contactName" placeholder="Jane Smith" />
              <Input label="Phone number" name="phone" placeholder="+1 (555) 010-2048" />
              <div className="md:col-span-2">
                <Input
                  label="Pickup address"
                  name="pickupAddress"
                  placeholder="1200 Commerce Way"
                />
              </div>
              <Input label="Preferred date" name="pickupDate" type="date" />
              <Select
                label="Pickup window"
                name="pickupWindow"
                placeholder="Select a window"
                options={[
                  { label: "Morning, 8 AM-12 PM", value: "morning" },
                  { label: "Afternoon, 12 PM-4 PM", value: "afternoon" },
                  { label: "Evening, 4 PM-7 PM", value: "evening" },
                ]}
              />
              <div className="md:col-span-2">
                <Textarea
                  label="Pickup notes"
                  name="notes"
                  placeholder="Suite number, loading dock, or handoff instructions"
                />
              </div>
              <div className="md:col-span-2">
                <Button type="submit" size="lg">
                  Prepare pickup request
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </Container>
    </main>
  );
}
