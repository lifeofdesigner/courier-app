import type { ReactNode } from "react";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import type { AppUserProfile } from "@/types/auth";

export type AdminShellProps = {
  profile: AppUserProfile;
  children: ReactNode;
};

export function AdminShell({ profile, children }: AdminShellProps) {
  return (
    <main className="min-h-screen bg-[#f6f7f9] text-slate-900">
      <AdminTopbar adminName={profile.fullName} />
      <div className="mx-auto flex w-full max-w-[1600px] gap-6 px-6 py-6 max-lg:flex-col max-sm:px-4 max-sm:py-5">
        <AdminSidebar />
        <div className="min-w-0 flex-1 space-y-6">{children}</div>
      </div>
    </main>
  );
}
