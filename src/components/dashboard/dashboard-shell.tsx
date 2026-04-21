import type { ReactNode } from "react";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import type { AppUserProfile } from "@/types/auth";

export type DashboardShellProps = {
  profile: AppUserProfile | null;
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    href: string;
  };
  children: ReactNode;
};

export function DashboardShell({
  profile,
  title,
  description,
  primaryAction,
  children,
}: DashboardShellProps) {
  return (
    <main className="bg-slate-50">
      <section className="py-10 lg:py-12">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
            <DashboardSidebar />
            <div className="min-w-0 space-y-6">
              <DashboardHeader
                title={title}
                description={description}
                userName={profile?.fullName}
                primaryAction={primaryAction}
              />
              {children}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
