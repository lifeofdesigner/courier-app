import Link from "next/link";
import { PackageCheck } from "lucide-react";

import { company } from "@/constants/site";
import { cn } from "@/lib/utils";

export type LogoProps = {
  variant?: "default" | "inverse";
};

export function Logo({ variant = "default" }: LogoProps) {
  const isInverse = variant === "inverse";

  return (
    <Link
      href="/"
      aria-label={`${company.name} home`}
      className="inline-flex items-center gap-3 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
        <PackageCheck aria-hidden="true" className="h-5 w-5" />
      </span>
      <span className="leading-tight">
        <span
          className={cn(
            "block text-lg font-extrabold tracking-tight",
            isInverse ? "text-white" : "text-navy",
          )}
        >
          {company.name}
        </span>
        <span
          className={cn(
            "block text-xs font-bold uppercase tracking-wide",
            isInverse ? "text-slate-300" : "text-muted",
          )}
        >
          Logistics
        </span>
      </span>
    </Link>
  );
}
