"use client";

import { useEffect, useState } from "react";
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
}

export default function BannerSlider({
  cardTitle,
  cardSubtitle,
  titleMain,
  titleSub,
}: BannerSliderProps) {
  const [active, setActive] = useState(0);

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
    <section className="flex flex-col md:min-h-[calc(100svh-64px)]">

      {/* ── Image zone ────────────────────────────────────────────── */}
      {/* Mobile: fixed aspect ratio / Desktop: flex-1 fills viewport */}
      <div className="relative h-56 sm:h-72 md:flex-1 md:min-h-[400px] overflow-hidden">
        {/* Crossfading slides */}
        {SLIDES.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
            style={{
              backgroundImage: `url("${src}")`,
              opacity: active === i ? 1 : 0,
            }}
          />
        ))}

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent" />
        {/* Bottom fade into blue strip — desktop only */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-primary/70 to-transparent hidden md:block" />

        {/* Search card — desktop only, vertically centered */}
        <div className="hidden md:flex absolute inset-0 z-10 items-center px-10 lg:px-16">
          <div className="w-[380px] lg:w-[410px]">
            <SearchForm
              className="bg-white! dark:bg-card! shadow-2xl border-0!"
              headingTitle={cardTitle}
              headingSubtitle={cardSubtitle}
            />
          </div>
        </div>

        {/* Slide indicators — desktop: bottom-center, above blue fade */}
        <div className="hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
          {slideIndicators}
        </div>
      </div>

      {/* ── Mobile: search card below the slider ─────────────────── */}
      <div className="md:hidden px-4 py-5 bg-background border-b">
        <SearchForm
          className="w-full!"
          headingTitle={cardTitle}
          headingSubtitle={cardSubtitle}
        />
        {/* Slide indicators — mobile: below card */}
        <div className="flex justify-center mt-4">
          {/* Re-render dots with dark variant for light bg */}
          <div className="flex items-center gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setActive(i)}
                className={`rounded-full transition-all duration-300 ${
                  active === i
                    ? "w-5 h-2 bg-primary"
                    : "w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Blue text strip ───────────────────────────────────────── */}
      <div className="shrink-0 bg-primary px-5 sm:px-10 lg:px-16 py-6 md:py-8">
        <h1 className="text-white font-extrabold text-2xl sm:text-3xl lg:text-5xl leading-tight tracking-tight drop-shadow-sm">
          {titleMain}
        </h1>
        <h2 className="text-white/80 font-semibold text-sm sm:text-lg lg:text-2xl mt-1.5">
          {titleSub}
        </h2>
      </div>
    </section>
  );
}
