"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

import { Container } from "@/components/layout/container";
import { CmsIcon } from "@/components/marketing/cms-icon";
import type { HomepageModeCode, HomepageQuoteCtaContent } from "@/types/cms";

export type ModeQuoteCtaProps = {
  content: HomepageQuoteCtaContent;
};

const iconByMode: Record<HomepageModeCode, "air" | "truck" | "warehouse"> = {
  air: "air",
  road: "truck",
  freight: "warehouse",
};

export function ModeQuoteCta({ content }: ModeQuoteCtaProps) {
  const [selectedMode, setSelectedMode] = useState<HomepageModeCode>(
    content.modes[0]?.mode ?? "road",
  );
  const selected =
    content.modes.find((mode) => mode.mode === selectedMode) ??
    content.modes[0];

  if (!selected) {
    return null;
  }

  return (
    <section className="bg-background py-16 sm:py-20">
      <Container>
        <div className="grid gap-8 rounded-lg border border-border bg-white p-6 shadow-sm lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:p-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">
              {content.eyebrow}
            </p>
            <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-navy sm:text-4xl">
              {content.title}
            </h2>
            <p className="mt-4 text-base leading-8 text-muted">
              {content.description}
            </p>
          </div>

          <div>
            <div className="grid gap-3 md:grid-cols-3">
              {content.modes.map((mode) => {
                const isSelected = mode.mode === selectedMode;

                return (
                  <button
                    key={mode.mode}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSelectedMode(mode.mode)}
                    className={`border p-4 text-left transition ${
                      isSelected
                        ? "border-primary bg-primary/10 ring-2 ring-primary/10"
                        : "border-border bg-white hover:border-primary hover:bg-primary/10"
                    }`}
                  >
                    <span className="flex h-10 w-10 items-center justify-center bg-primary/10 text-primary">
                      <CmsIcon
                        name={iconByMode[mode.mode]}
                        className="h-5 w-5"
                      />
                    </span>
                    <span className="mt-4 block text-sm font-bold text-navy">
                      {mode.title}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 border border-border bg-background p-5">
              <p className="font-heading text-xl font-bold text-navy">
                {selected.title}
              </p>
              <p className="mt-2 text-sm leading-7 text-muted">
                {selected.description}
              </p>
              <Link
                href={selected.href}
                className="mt-5 inline-flex h-11 items-center justify-center gap-2 bg-primary px-5 text-sm font-bold text-white transition hover:brightness-95 focus:outline-none focus:ring-4 focus:ring-primary/20"
              >
                Start this quote
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
