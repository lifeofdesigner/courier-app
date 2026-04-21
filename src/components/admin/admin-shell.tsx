import type { ReactNode } from "react";

import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import type { AppUserProfile } from "@/types/auth";

export type AdminShellProps = {
  profile: AppUserProfile;
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    href: string;
  };
  children: ReactNode;
};

export function AdminShell({
  profile,
  title,
  description,
  primaryAction,
  children,
}: AdminShellProps) {
  return (
    <main className="bg-slate-50">
      <section className="py-10 lg:py-12">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
            <AdminSidebar />
            <div className="min-w-0 space-y-6">
              <AdminHeader
                title={title}
                description={description}
                adminName={profile.fullName}
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
