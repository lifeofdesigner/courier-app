"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

type NavLinkProps = Omit<ComponentPropsWithoutRef<typeof Link>, "href"> & {
  href: string;
  activeClassName?: string;
  inactiveClassName?: string;
  exact?: boolean;
};

export function isActiveRoute(pathname: string, href: string, exact = false) {
  if (href === "/") {
    return pathname === "/";
  }

  if (exact) {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLink({
  href,
  className,
  activeClassName,
  inactiveClassName,
  exact,
  ...props
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive = isActiveRoute(pathname, href, exact);

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(className, isActive ? activeClassName : inactiveClassName)}
      {...props}
    />
  );
}
