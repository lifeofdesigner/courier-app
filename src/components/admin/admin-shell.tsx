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
  maxWidthClassName?: string;
  children: ReactNode;
};

export function AdminShell({
  profile,
  title,
  description,
  primaryAction,
  maxWidthClassName = "max-w-7xl",
  children,
}: AdminShellProps) {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="py-10 lg:py-12">
        <div className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${maxWidthClassName}`}>
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
