"use client";

import { useEffect, useState } from "react";
import { CalendarCheck, Languages, ShieldCheck } from "lucide-react";
import { SearchForm } from "./SearchForm";

const SLIDES = [
  "/assets/banner.png",
  "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=1920&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1609188076864-c35269136b09?w=1920&q=80&auto=format&fit=crop",
];

interface BannerSliderProps {
  cardTitle: string;
  cardSubtitle: string;
  titleMain: string;
  titleSub: string;
  eyebrow: string;
  chips: string[];
  metrics: { value: string; label: string }[];
  stripItems: string[];
}

export default function BannerSlider({
  cardTitle,
  cardSubtitle,
  titleMain,
  titleSub,
  eyebrow,
  chips,
  metrics,
  stripItems,
}: BannerSliderProps) {
  const [active, setActive] = useState(0);
  const stripIcons = [CalendarCheck, ShieldCheck, Languages];

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slideIndicators = (
    <div className="flex items-center gap-2">
      {SLIDES.map((_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`Go to slide ${i + 1}`}
          onClick={() => setActive(i)}
          className={`rounded-full transition-all duration-300 ${
            active === i
              ? "w-5 h-2 bg-white"
              : "w-2 h-2 bg-white/50 hover:bg-white/75"
          }`}
        />
      ))}
    </div>
  );

  return (
    <section className="flex flex-col bg-background">
      <div className="relative min-h-[520px] overflow-hidden sm:min-h-[620px] lg:min-h-[calc(100svh-72px)]">
        {/* Crossfading slides */}
        {SLIDES.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0 scale-105 bg-cover bg-[center_28%] bg-no-repeat transition-all duration-1000"
            style={{
              backgroundImage: `url("${src}")`,
              opacity: active === i ? 1 : 0,
              transform: active === i ? "scale(1.02)" : "scale(1.07)",
            }}
          />
        ))}

        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/62 to-slate-950/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/28" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background via-background/65 to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[520px] max-w-7xl items-end px-4 pb-8 pt-16 sm:min-h-[620px] sm:px-6 lg:min-h-[calc(100svh-72px)] lg:items-center lg:px-10 lg:py-12">
          <div className="grid w-full items-center gap-8 lg:grid-cols-[minmax(0,1fr)_430px] xl:gap-14">
            <div className="max-w-3xl animate-fade-up text-white">
              <p className="mb-5 inline-flex rounded-md border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-bold uppercase tracking-widest text-white/88 shadow-sm backdrop-blur-md">
                {eyebrow}
              </p>
              <h1 className="max-w-4xl text-4xl font-extrabold leading-[1.04] tracking-normal sm:text-5xl lg:text-6xl xl:text-7xl">
                {titleMain}
              </h1>
              <p className="mt-5 max-w-2xl text-base font-medium leading-7 text-white/80 sm:text-xl sm:leading-8">
                {titleSub}
              </p>
              <div className="mt-7 flex flex-wrap gap-2.5 text-sm font-semibold text-white/90">
                {chips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-md border border-white/18 bg-white/10 px-3.5 py-2 backdrop-blur-md"
                  >
                    {chip}
                  </span>
                ))}
              </div>

              <div className="mt-8 grid max-w-2xl grid-cols-3 divide-x divide-white/16 rounded-lg border border-white/16 bg-white/10 shadow-2xl backdrop-blur-md">
                {metrics.map((metric) => (
                  <div key={metric.label} className="px-4 py-4">
                    <strong className="block text-2xl font-extrabold text-white sm:text-3xl">
                      {metric.value}
                    </strong>
                    <span className="mt-1 block text-xs font-medium leading-5 text-white/68 sm:text-sm">
                      {metric.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden animate-fade-up animation-delay-200 lg:block">
              <div className="rounded-xl border border-white/18 bg-white/14 p-2 shadow-[0_24px_80px_rgba(2,6,23,0.35)] backdrop-blur-xl">
                <SearchForm
                  className="bg-white/98! dark:bg-card/98! border-white/50! shadow-none"
                  headingTitle={cardTitle}
                  headingSubtitle={cardSubtitle}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Slide indicators — desktop: bottom-center */}
        <div className="absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 lg:flex">
          {slideIndicators}
        </div>
      </div>

      {/* Mobile: search card below the slider */}
      <div className="border-b bg-background px-4 py-5 lg:hidden">
        <div className="-mt-14 relative z-20">
          <div className="rounded-xl border bg-background p-2 shadow-2xl">
            <SearchForm
              className="w-full! border-0! shadow-none"
              headingTitle={cardTitle}
              headingSubtitle={cardSubtitle}
            />
          </div>
        </div>
        <div className="mt-4 flex justify-center">
          <div className="flex items-center gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setActive(i)}
                className={`rounded-full transition-all duration-300 ${
                  active === i
                    ? "h-2 w-5 bg-primary"
                    : "h-2 w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="shrink-0 border-y bg-card px-4 py-4 sm:px-6 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-3 text-sm font-semibold text-muted-foreground sm:grid-cols-3">
          {stripItems.map((item, index) => {
            const Icon = stripIcons[index] ?? ShieldCheck;
            return (
              <span key={item} className="flex items-center gap-2 rounded-md bg-background px-4 py-3">
                <Icon className="h-4 w-4 text-primary" />
                {item}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}
