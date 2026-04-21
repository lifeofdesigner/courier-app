import Link from "next/link";
import type { ReactNode } from "react";

import { Container } from "@/components/layout/container";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PageAction } from "@/types/ui";

export type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: PageAction[];
  children?: ReactNode;
  align?: "left" | "center";
  className?: string;
};

export function PageHero({
  eyebrow,
  title,
  description,
  actions,
  children,
  align = "left",
  className,
}: PageHeroProps) {
  return (
    <section className={cn("border-b border-border bg-white", className)}>
      <Container className="py-12 sm:py-16 lg:py-20">
        <div
          className={cn(
            "max-w-4xl",
            align === "center" && "mx-auto text-center",
          )}
        >
          {eyebrow ? (
            <p className="mb-3 text-sm font-bold uppercase tracking-wide text-primary">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="text-4xl font-bold tracking-tight text-navy sm:text-5xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-5 text-lg leading-8 text-muted">{description}</p>
          ) : null}
          {actions?.length ? (
            <div
              className={cn(
                "mt-8 flex flex-col gap-3 sm:flex-row",
                align === "center" && "sm:justify-center",
              )}
            >
              {actions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className={buttonVariants({
                    variant: action.variant ?? "primary",
                    size: "lg",
                  })}
                >
                  {action.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
        {children ? <div className="mt-10">{children}</div> : null}
      </Container>
    </section>
  );
}
