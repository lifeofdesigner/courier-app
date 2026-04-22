import type { Metadata } from "next";
import { CalendarCheck, CreditCard, PackageCheck, WalletCards } from "lucide-react";

import {
  AdminPageHeader,
  AdminSectionCard,
  AdminStatCard,
  BookingsTable,
} from "@/components/admin";
import { getAdminBookings } from "@/lib/queries/admin";

export const metadata: Metadata = {
  title: "Manage Bookings",
};

export default async function ManageBookingsPage() {
  const bookings = await getAdminBookings(100);
  const paidBookings = bookings.filter(
    (booking) => booking.paymentStatus === "paid",
  ).length;
  const checkoutCreated = bookings.filter(
    (booking) => booking.paymentStatus === "checkout_created",
  ).length;
  const unpaidBookings = bookings.filter(
    (booking) => booking.paymentStatus === "unpaid",
  ).length;

  return (
    <>
      <AdminPageHeader
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Bookings" },
        ]}
        title="Pickup Bookings"
        description="Review pickup requests submitted by customers and guests with payment status, Stripe session visibility, and label readiness."
        status={{ label: "Payment aware", tone: "accent" }}
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          title="Total bookings"
          value={bookings.length}
          helperText="Pickup requests loaded for review."
          icon={<CalendarCheck aria-hidden="true" className="h-5 w-5" />}
        />
        <AdminStatCard
          title="Paid"
          value={paidBookings}
          helperText="Ready for fulfillment or label access."
          tone="success"
          icon={<PackageCheck aria-hidden="true" className="h-5 w-5" />}
        />
        <AdminStatCard
          title="Checkout started"
          value={checkoutCreated}
          helperText="Stripe sessions created but not completed."
          tone="info"
          icon={<CreditCard aria-hidden="true" className="h-5 w-5" />}
        />
        <AdminStatCard
          title="Unpaid"
          value={unpaidBookings}
          helperText="Awaiting customer payment action."
          tone="warning"
          icon={<WalletCards aria-hidden="true" className="h-5 w-5" />}
        />
      </div>

      <AdminSectionCard
        id="payment-review"
        title="Booking queue"
        description="Payment-aware operations queue for submitted pickup requests."
      >
        <BookingsTable bookings={bookings} />
      </AdminSectionCard>
    </>
  );
}
