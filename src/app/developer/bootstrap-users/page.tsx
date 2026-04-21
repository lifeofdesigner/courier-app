import type { Metadata } from "next";

import { BootstrapAccessForm, BootstrapUserForm } from "@/components/developer";
import { getBootstrapAccessStatus } from "@/lib/developer/require-bootstrap-access";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Developer Bootstrap Users",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DeveloperBootstrapUsersPage() {
  const accessStatus = await getBootstrapAccessStatus();

  return (
    <main className="bg-slate-50">
      <section className="py-16 lg:py-20">
        <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-[#FF6B2B]">
              Developer only
            </p>
            <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight text-[#0B1C3A] sm:text-4xl">
              Bootstrap customer and admin users
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Private server-protected tooling for creating confirmed Supabase
              users during setup and local verification.
            </p>
          </div>

          <div className="mt-8">
            {accessStatus.unavailable ? (
              <div className="rounded-[24px] border border-amber-200 bg-amber-50 p-5 text-amber-900">
                <h2 className="font-heading text-2xl font-bold tracking-tight">
                  Bootstrap unavailable
                </h2>
                <p className="mt-2 text-sm leading-7">{accessStatus.message}</p>
              </div>
            ) : accessStatus.allowed ? (
              <BootstrapUserForm />
            ) : (
              <BootstrapAccessForm />
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
