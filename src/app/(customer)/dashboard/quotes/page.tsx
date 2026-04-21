import type { Metadata } from "next";

import { DashboardShell, QuoteTable } from "@/components/dashboard";
import {
  getCurrentDashboardContext,
  getDashboardQuotes,
} from "@/lib/queries/dashboard";

export const metadata: Metadata = {
  title: "My Quotes",
};

export default async function MyQuotesPage() {
  const [context, quotes] = await Promise.all([
    getCurrentDashboardContext(),
    getDashboardQuotes(),
  ]);

  return (
    <DashboardShell
      profile={context.profile}
      title="My quotes"
      description="Review saved quote calculations, delivery lanes, totals, and booking actions."
      primaryAction={{ label: "Request a quote", href: "/quote" }}
    >
      <QuoteTable quotes={quotes} />
    </DashboardShell>
  );
}
