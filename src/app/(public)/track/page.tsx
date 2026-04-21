import type { Metadata } from "next";

import { Container } from "@/components/layout";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Track Shipment",
};

export default function TrackShipmentPage() {
  return (
    <main>
      <PageHero
        eyebrow="Track shipment"
        title="Know where your shipment stands."
        description="Enter a tracking number to prepare for real-time shipment updates once tracking data is connected."
      />
      <Container className="py-14 sm:py-16" size="lg">
        <Card>
          <CardHeader>
            <CardTitle>Shipment lookup</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
              <Input
                label="Tracking number"
                name="trackingNumber"
                placeholder="Example: AX2048000123"
                helperText="Tracking results will be connected in the Supabase phase."
              />
              <Button type="submit" size="lg">
                Track shipment
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>
    </main>
  );
}
