"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";
import type {
  HomepageScrollEffect,
  HomepageTextEffect,
} from "@/types/cms";

export type MotionSectionProps = {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  scrollEffect: HomepageScrollEffect;
  textEffect: HomepageTextEffect;
};

type MotionStyle = CSSProperties & {
  "--motion-delay"?: string;
};

export function MotionSection({
  children,
  className,
  delayMs = 0,
  scrollEffect,
  textEffect,
}: MotionSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const hasEffects = scrollEffect !== "none" || textEffect !== "none";

  useEffect(() => {
    const element = sectionRef.current;

    if (!element) {
      return;
    }

    const reveal = () => {
      element.dataset.motionVisible = "true";
    };

    element.dataset.motionReady = "true";

    if (!hasEffects) {
      reveal();
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      reveal();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (entry?.isIntersecting) {
          reveal();
          observer.disconnect();
        }
      },
      {
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.16,
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [hasEffects, scrollEffect, textEffect]);

  return (
    <div
      ref={sectionRef}
      className={cn("motion-section", className)}
      data-motion-ready="false"
      data-motion-visible={hasEffects ? "false" : "true"}
      data-scroll-effect={scrollEffect}
      data-text-effect={textEffect}
      style={{ "--motion-delay": `${delayMs}ms` } as MotionStyle}
    >
      {children}
    </div>
  );
}
