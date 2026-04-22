import type { ReactNode } from "react";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import type { AppUserProfile } from "@/types/auth";

export type AdminShellProps = {
  profile: AppUserProfile;
  children: ReactNode;
};

export function AdminShell({
  profile,
  children,
}: AdminShellProps) {
  return (
    <main className="min-h-screen bg-[#f6f7f9] text-slate-900">
      <AdminTopbar adminName={profile.fullName} />
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 px-4 py-5 sm:px-6 lg:flex-row lg:px-6 lg:py-6">
        <AdminSidebar />
        <div className="min-w-0 flex-1 space-y-6">
          {children}
        </div>
      </div>
    </main>
  );
}
