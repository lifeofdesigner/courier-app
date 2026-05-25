"use client";

import { useMemo, useState } from "react";

import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { UserRoleForm } from "@/components/admin/user-role-form";
import type { AdminUserRow } from "@/types/admin";

export type UsersTableProps = {
  users: AdminUserRow[];
};

const inputClassName =
  "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[#b0825f] focus:ring-4 focus:ring-[#b0825f]/15";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function UsersTable({ users }: UsersTableProps) {
  const [query, setQuery] = useState("");

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return users.filter((user) =>
      [user.fullName ?? "", user.phone ?? "", user.role]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [query, users]);

  if (users.length === 0) {
    return (
      <AdminEmptyState
        title="No users found"
        description="Customer and staff accounts will appear here after sign-up or admin creation."
      />
    );
  }

  return (
    <div className="space-y-5">
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className={inputClassName}
        placeholder="Search name, phone, or access level"
      />
      <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px]">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              <tr>
                <th className="px-4 py-4">User</th>
                <th className="px-4 py-4">Phone</th>
                <th className="px-4 py-4">Role</th>
                <th className="px-4 py-4">Created</th>
                <th className="px-4 py-4">Updated</th>
                <th className="px-4 py-4">Role update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-4 py-4 text-sm text-slate-700">
                    <p className="font-semibold text-[#2b1d16]">
                      {user.fullName ?? "Unnamed user"}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">
                    {user.phone ?? "Not set"}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">
                    {formatDate(user.updatedAt)}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">
                    <UserRoleForm user={user} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
