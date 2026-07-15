"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { services } from "@/data/services";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

const ROTATE_MS = 3800;

export function ServicesCarousel({
  titles,
  locale,
}: {
  titles: Dictionary["services"];
  locale: Locale;
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setActive((i) => (i + 1) % services.length), ROTATE_MS);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <div className="flex flex-col gap-3 md:h-[420px] md:flex-row">
      {services.map((service, i) => {
        const isActive = i === active;
        return (
          <button
            key={service.key}
            type="button"
            aria-expanded={isActive}
            onMouseEnter={() => {
              setActive(i);
              setPaused(true);
            }}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => {
              setActive(i);
              setPaused(true);
            }}
            onBlur={() => setPaused(false)}
            onClick={() => {
              setActive(i);
              setPaused(true);
            }}
            className={cn(
              "group relative min-h-[220px] overflow-hidden rounded-xl border text-left transition-all duration-500 ease-out md:min-h-0",
              isActive ? "border-accent/60 md:flex-[6]" : "border-line md:flex-[1]",
            )}
          >
            <Image
              src={service.image}
              alt={service.alt}
              fill
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-cover"
            />
            {/* dark gradient overlay (theme-independent), keeps text readable */}
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(180deg, rgba(8,9,11,0.1) 15%, rgba(8,9,11,0.92))",
              }}
            />

            {/* collapsed vertical label (desktop only, when not active) */}
            <span
              className={cn(
                "absolute left-1/2 top-5 hidden -translate-x-1/2 whitespace-nowrap font-mono text-xs tracking-[0.14em] text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.7)] md:block",
                isActive && "md:hidden",
              )}
            >
              {service.mini}
            </span>

            {/* expanded content: always on mobile, only when active on desktop */}
            <div
              className={cn(
                "absolute inset-x-0 bottom-0 p-5 transition-opacity duration-500 sm:p-6",
                isActive ? "opacity-100" : "opacity-100 md:opacity-0",
              )}
            >
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-black/85 px-2.5 py-1.5 font-mono text-[12px] shadow-sm">
                <span>
                  <span className="text-accent">~/nomena-nisiah</span>
                  <span className="text-neutral-500">$</span>
                  <span className="text-neutral-100"> ./{service.mini}</span>
                </span>
                <span
                  aria-hidden
                  className="inline-block h-[13px] w-[7px] animate-[nn-blink_1.1s_step-end_infinite] bg-accent"
                />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">{titles[service.key]}</h3>
              <p className="max-w-md text-sm leading-6 text-neutral-300">{service.description[locale]}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
