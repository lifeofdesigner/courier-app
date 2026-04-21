"use client";

import Link from "next/link";

import type { CreateUserActionState } from "@/types/admin";

export type BootstrapSuccessCardProps = {
  state: CreateUserActionState;
};

export function BootstrapSuccessCard({ state }: BootstrapSuccessCardProps) {
  return (
    <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 p-5 text-emerald-900">
      <h2 className="font-heading text-2xl font-bold tracking-tight">
        Bootstrap user created
      </h2>
      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="font-semibold">Email</dt>
          <dd className="mt-1 break-words">{state.createdEmail}</dd>
        </div>
        <div>
          <dt className="font-semibold">Assigned role</dt>
          <dd className="mt-1 capitalize">{state.createdRole}</dd>
        </div>
      </dl>
      <p className="mt-4 text-sm leading-6">
        The account is confirmed and can sign in immediately for local testing.
      </p>
      <Link
        href="/developer/bootstrap-users"
        className="mt-5 inline-flex h-11 items-center justify-center rounded-2xl border border-emerald-300 bg-white px-5 text-sm font-semibold text-emerald-900 transition hover:border-emerald-400 hover:bg-emerald-100 focus:outline-none focus:ring-4 focus:ring-emerald-200"
      >
        Create another user
      </Link>
    </div>
  );
}
