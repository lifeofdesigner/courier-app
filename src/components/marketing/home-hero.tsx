"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  MoveRight,
  PackageCheck,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Container } from "@/components/layout/container";
import { CmsIcon } from "@/components/marketing/cms-icon";
import type { CmsImage, HeroSectionContent, HeroStat } from "@/types/cms";

export type HomeHeroProps = {
  content: HeroSectionContent;
};

type HeroSlide = {
  eyebrow: string;
  title: string;
  description: string;
  image: CmsImage;
  statusLabel: string;
  metric: HeroStat;
};

const fallbackImages: CmsImage[] = [
  {
    src: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1800&q=85",
    alt: "Freight truck moving along a highway at sunset",
  },
  {
    src: "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?auto=format&fit=crop&w=1800&q=85",
    alt: "Cargo containers stacked at a logistics terminal",
  },
  {
    src: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1800&q=85",
    alt: "Warehouse team preparing packages for dispatch",
  },
];

function fallbackMetric(index: number): HeroStat {
  return {
    label: ["Active lanes", "Tracking updates", "Delivery support"][index] ?? "Courier support",
    value: ["Air, road, freight", "Live milestones", "Operations team"][index] ?? "Ready",
    description:
      [
        "Mode-aware movement across the routes your shipment needs.",
        "Visible handoffs from pickup through final delivery.",
        "Help from people who understand courier exceptions.",
      ][index] ?? "Shipment support built around clear movement.",
  };
}

function buildSlides(content: HeroSectionContent): HeroSlide[] {
  const primaryImage = content.image ?? fallbackImages[0];
  const stats = content.stats.length > 0 ? content.stats : [
    fallbackMetric(0),
    fallbackMetric(1),
    fallbackMetric(2),
  ];

  return [
    {
      eyebrow: content.eyebrow,
      title: content.title,
      description: content.description,
      image: primaryImage,
      statusLabel: content.visual.statusLabel,
      metric: stats[0] ?? fallbackMetric(0),
    },
    {
      eyebrow: content.visual.eyebrow,
      title: "Live shipment visibility from pickup to delivery.",
      description: `${content.visual.title} is moving on ${content.visual.route}. Follow the same kind of checkpoints your customers expect from a modern courier partner.`,
      image: fallbackImages[1],
      statusLabel: content.visual.statusLabel,
      metric: stats[1] ?? fallbackMetric(1),
    },
    {
      eyebrow: "Logistics transportation",
      title: "The bridge between urgent pickups and confident proof.",
      description:
        "Coordinate courier, cargo, and freight movement with clear service choices, customer-ready tracking, and operations support at every handoff.",
      image: fallbackImages[2],
      statusLabel: "Dispatch ready",
      metric: stats[2] ?? fallbackMetric(2),
    },
  ];
}

export function HomeHero({ content }: HomeHeroProps) {
  const slides = useMemo(() => buildSlides(content), [content]);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = slides[activeIndex] ?? slides[0];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % slides.length);
    }, 6500);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  function goToPreviousSlide() {
    setActiveIndex((index) => (index - 1 + slides.length) % slides.length);
  }

  function goToNextSlide() {
    setActiveIndex((index) => (index + 1) % slides.length);
  }

  return (
    <section className="relative isolate overflow-hidden bg-[#06142b] text-white">
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={`${slide.title}-${slide.image.src}`}
            aria-hidden={index !== activeIndex}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              index === activeIndex ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url(${slide.image.src})` }}
          />
        ))}
        <div className="absolute inset-0 bg-[#06142b]/70" />
        <div className="absolute inset-y-0 left-0 w-full bg-[#06142b]/85 lg:w-[52%]" />
      </div>

      <Container className="relative z-10 flex min-h-[calc(100vh-7.5rem)] flex-col justify-center py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.55fr)] lg:items-end">
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#FF6B2B]">
              {activeSlide.eyebrow}
            </p>
            <h1 className="mt-5 max-w-4xl font-heading text-4xl font-extrabold leading-[1.05] text-white sm:text-5xl lg:text-6xl xl:text-7xl">
              {activeSlide.title}
            </h1>
            <div className="mt-7 flex max-w-2xl gap-4">
              <span className="mt-3 hidden h-px w-24 bg-white/45 sm:block" />
              <p className="text-base font-semibold leading-8 text-slate-100 sm:text-lg">
                {activeSlide.description}
              </p>
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href={content.primaryCta.href}
                aria-label={content.primaryCta.ariaLabel}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#FF6B2B] px-6 text-sm font-bold text-white transition hover:bg-[#e85f22] focus:outline-none focus:ring-4 focus:ring-[#FF6B2B]/25"
              >
                {content.primaryCta.label}
                <MoveRight aria-hidden="true" className="h-4 w-4" />
              </Link>
              <Link
                href={content.secondaryCta.href}
                aria-label={content.secondaryCta.ariaLabel}
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/25 bg-white/10 px-6 text-sm font-bold text-white transition hover:bg-white/20 focus:outline-none focus:ring-4 focus:ring-white/20"
              >
                {content.secondaryCta.label}
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-3">
              <button
                type="button"
                onClick={goToPreviousSlide}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FF6B2B] text-white transition hover:bg-[#e85f22] focus:outline-none focus:ring-4 focus:ring-[#FF6B2B]/25"
                aria-label="Show previous hero slide"
              >
                <ArrowLeft aria-hidden="true" className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={goToNextSlide}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FF6B2B] text-white transition hover:bg-[#e85f22] focus:outline-none focus:ring-4 focus:ring-[#FF6B2B]/25"
                aria-label="Show next hero slide"
              >
                <ArrowRight aria-hidden="true" className="h-5 w-5" />
              </button>
              <div className="ml-2 flex gap-2">
                {slides.map((slide, index) => (
                  <button
                    key={`${slide.title}-dot`}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={`h-2.5 rounded-full transition-all ${
                      index === activeIndex
                        ? "w-8 bg-[#FF6B2B]"
                        : "w-2.5 bg-white/45 hover:bg-white/70"
                    }`}
                    aria-label={`Show hero slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/15 bg-white/95 p-5 text-[#0B1C3A] shadow-2xl shadow-black/25 backdrop-blur">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#FF6B2B]">
                  {content.visual.eyebrow}
                </p>
                <p className="mt-2 font-heading text-lg font-bold">
                  {content.visual.title}
                </p>
                <p className="mt-1 text-sm font-medium text-slate-600">
                  {content.visual.route}
                </p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
                {activeSlide.statusLabel}
              </span>
            </div>

            <div className="space-y-4 pt-5">
              {content.visual.items.map((event) => (
                <div key={`${event.title}-${event.meta}`} className="flex gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-[#FF6B2B]">
                    <CmsIcon name={event.icon} className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-black">{event.title}</p>
                    <p className="text-sm font-semibold text-slate-500">
                      {event.meta}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-600">
                      {event.description}
                    </p>
                  </div>
                  {event.isComplete ? (
                    <CheckCircle2
                      aria-hidden="true"
                      className="mt-1 h-4 w-4 shrink-0 text-emerald-600"
                    />
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          {content.stats.map((stat) => (
            <div
              key={`${stat.label}-${stat.value}`}
              className="border border-white/15 bg-white/10 p-4 backdrop-blur"
            >
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-300">
                {stat.label}
              </p>
              <p className="mt-2 text-xl font-black text-white">{stat.value}</p>
              {stat.description ? (
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {stat.description}
                </p>
              ) : null}
            </div>
          ))}
        </div>

        <div className="pointer-events-none absolute bottom-10 right-5 hidden max-w-xs items-center gap-3 rounded-full bg-white px-6 py-4 text-[#0B1C3A] shadow-2xl shadow-black/20 xl:flex">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-50 text-[#FF6B2B]">
            <PackageCheck aria-hidden="true" className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-lg font-black text-[#FF6B2B]">
              {activeSlide.metric.value}
            </span>
            <span className="block text-sm font-bold">
              {activeSlide.metric.label}
            </span>
          </span>
        </div>
      </Container>
    </section>
  );
}
