import { NextResponse, type NextRequest } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

function safeRedirectPath(nextPath: string | null) {
  if (!nextPath || !nextPath.startsWith("/") || nextPath.startsWith("//")) {
    return "/dashboard";
  }

  return nextPath;
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const nextPath = safeRedirectPath(requestUrl.searchParams.get("next"));

  if (!code) {
    return NextResponse.redirect(new URL("/login", requestUrl.origin));
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return NextResponse.redirect(
      new URL(
        "/login?message=Supabase%20is%20not%20configured%20yet",
        requestUrl.origin,
      ),
    );
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(new URL("/login", requestUrl.origin));
  }

  return NextResponse.redirect(new URL(nextPath, requestUrl.origin));
}
