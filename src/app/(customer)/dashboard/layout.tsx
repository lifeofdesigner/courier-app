import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function CustomerDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    redirect("/login?next=/dashboard");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/dashboard");
  }

  return children;
}
