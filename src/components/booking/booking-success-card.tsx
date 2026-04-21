import { CheckCircle2 } from "lucide-react";

import type { BookingRecord } from "@/types/booking";

export type BookingSuccessCardProps = {
  booking: BookingRecord;
};

export function BookingSuccessCard({ booking }: BookingSuccessCardProps) {
  return (
    <div className="rounded-[28px] border border-emerald-200 bg-emerald-50 p-6 text-emerald-800 shadow-sm">
      <CheckCircle2 aria-hidden="true" className="h-8 w-8" />
      <h2 className="mt-4 text-xl font-bold tracking-tight">
        Booking request received
      </h2>
      <p className="mt-3 text-sm leading-7">
        Reference <span className="font-bold">{booking.id}</span> is now marked
        as {booking.status}. The operations team can review and confirm it from
        the database.
      </p>
    </div>
  );
}
