import type { Metadata } from "next";
import { CircleDollarSign, FileText, Layers3, UsersRound } from "lucide-react";

import {
  AdminPageHeader,
  AdminSectionCard,
  AdminStatCard,
  QuotesTable,
} from "@/components/admin";
import { getAdminQuotes } from "@/lib/queries/admin";

export const metadata: Metadata = {
  title: "Manage Quotes",
};

function formatMoney(value: number, currency = "USD") {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function ManageQuotesPage() {
  const quotes = await getAdminQuotes(100);
  const customerQuotes = quotes.filter((quote) => quote.userId).length;
  const serviceCount = new Set(quotes.map((quote) => quote.serviceType)).size;
  const highestQuote =
    quotes.length > 0
      ? quotes.reduce((highest, quote) =>
          quote.total > highest.total ? quote : highest,
        )
      : null;

  return (
    <>
      <AdminPageHeader
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Quotes" },
        ]}
        title="Quote Review"
        description="Review recent customer quote calculations for service demand, follow-up, and booking support."
        status={{ label: "Read only", tone: "neutral" }}
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          title="Total quotes"
          value={quotes.length}
          helperText="Recent quote calculations loaded."
          icon={<FileText aria-hidden="true" className="h-5 w-5" />}
        />
        <AdminStatCard
          title="Customer quotes"
          value={customerQuotes}
          helperText="Quotes tied to authenticated users."
          tone="success"
          icon={<UsersRound aria-hidden="true" className="h-5 w-5" />}
        />
        <AdminStatCard
          title="Service mix"
          value={serviceCount}
          helperText="Distinct service types represented."
          tone="info"
          icon={<Layers3 aria-hidden="true" className="h-5 w-5" />}
        />
        <AdminStatCard
          title="Highest quote"
          value={
            highestQuote
              ? formatMoney(highestQuote.total, highestQuote.currency)
              : "$0"
          }
          helperText="Largest recent quote total."
          tone="warning"
          icon={<CircleDollarSign aria-hidden="true" className="h-5 w-5" />}
        />
      </div>

      <AdminSectionCard
        id="quote-pipeline"
        title="Quote pipeline"
        description="Read-only operational list for this phase."
      >
        <QuotesTable quotes={quotes} />
      </AdminSectionCard>
    </>
  );
}
