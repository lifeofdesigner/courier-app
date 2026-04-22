import Link from "next/link";
import Image from "next/image";
import { PackageCheck } from "lucide-react";

import { company } from "@/constants/site";
import { cn } from "@/lib/utils";
import type { CmsImage } from "@/types/cms";

export type LogoProps = {
  variant?: "default" | "inverse";
  siteName?: string;
  logo?: CmsImage | null;
};

export function Logo({ variant = "default", siteName, logo }: LogoProps) {
  const isInverse = variant === "inverse";
  const displayName = siteName || company.name;

  return (
    <Link
      href="/"
      aria-label={`${displayName} home`}
      className="inline-flex items-center gap-3 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
        {logo ? (
          <span className="relative h-8 w-8 overflow-hidden rounded-lg">
            <Image
              src={logo.src}
              alt={logo.alt}
              fill
              sizes="44px"
              className="object-contain"
              unoptimized
            />
          </span>
        ) : (
          <PackageCheck aria-hidden="true" className="h-5 w-5" />
        )}
      </span>
      <span className="leading-tight">
        <span
          className={cn(
            "block text-lg font-extrabold tracking-tight",
            isInverse ? "text-white" : "text-navy",
          )}
        >
          {displayName}
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
