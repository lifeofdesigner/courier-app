import type { Metadata } from "next";

import { AdminSectionCard, AdminShell, BookingsTable } from "@/components/admin";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getAdminBookings } from "@/lib/queries/admin";

export const metadata: Metadata = {
  title: "Manage Bookings",
};

export default async function ManageBookingsPage() {
  const [admin, bookings] = await Promise.all([
    requireAdmin(),
    getAdminBookings(100),
  ]);

  return (
    <AdminShell
      profile={admin.profile}
      title="Pickup bookings"
      description="Review pickup requests submitted by customers and guests with payment status, Stripe session visibility, and label readiness."
    >
      <AdminSectionCard
        title="Booking queue"
        description="Payment-aware operations queue for submitted pickup requests."
      >
        <BookingsTable bookings={bookings} />
      </AdminSectionCard>
    </AdminShell>
  );
}
