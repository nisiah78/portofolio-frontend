"use client";

import { useEffect, useRef, useState } from "react";
import { history } from "@/data/history";
import type { Locale } from "@/i18n/config";
import { HISTORY_FOCUS_EVENT, type HistoryFocusDetail } from "@/lib/events";
import { cn } from "@/lib/utils";

// Oldest entries fade out; the most recent stays fully bright.
const AGE_OPACITY = [
  "opacity-100",
  "opacity-90",
  "opacity-80",
  "opacity-70",
  "opacity-60",
  "opacity-50",
  "opacity-40",
];

const NOW_LABEL: Record<Locale, string> = {
  en: "now",
  fr: "actuel",
  de: "aktuell",
};

export function HistoryTimeline({ locale }: { locale: Locale }) {
  const [pinned, setPinned] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const olRef = useRef<HTMLOListElement>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const active = hovered ?? pinned;
  const entries = history[locale];

  // Staggered scroll reveal, driven by DOM attributes (see globals.css [data-history]).
  useEffect(() => {
    const el = olRef.current;
    if (!el) return;
    el.setAttribute("data-anim", "");
    const reveal = () => el.setAttribute("data-shown", "");
    if (!("IntersectionObserver" in window)) {
      reveal();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            reveal();
            io.disconnect();
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Selecting a result in the stack-search modal pins that entry and scrolls it into view.
  useEffect(() => {
    function onFocus(e: Event) {
      const idx = (e as CustomEvent<HistoryFocusDetail>).detail?.index;
      if (typeof idx !== "number" || idx < 0 || idx >= entries.length) return;
      setPinned(idx);
      setHovered(null);
      itemRefs.current[idx]?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    window.addEventListener(HISTORY_FOCUS_EVENT, onFocus);
    return () => window.removeEventListener(HISTORY_FOCUS_EVENT, onFocus);
  }, [entries.length]);

  return (
    <ol ref={olRef} data-history className="relative" onMouseLeave={() => setHovered(null)}>
      {/* dotted timeline, fading with age: crisp at the top, dissolving toward the bottom */}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-2 left-[5px] top-2 w-px"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, var(--line) 0 3px, transparent 3px 9px)",
          maskImage: "linear-gradient(to bottom, #000 0%, #000 42%, transparent 96%)",
          WebkitMaskImage: "linear-gradient(to bottom, #000 0%, #000 42%, transparent 96%)",
        }}
      />

      {entries.map((entry, i) => {
        const isActive = active === i;
        const isCurrent = i === 0;
        const dim = isActive ? "opacity-100" : AGE_OPACITY[Math.min(i, AGE_OPACITY.length - 1)];
        return (
          <li
            key={`${entry.period}-${entry.org}`}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className="nn-tl-item group relative pb-6 last:pb-0"
            // stagger: each experience rises in, one after another
            style={{ transitionDelay: `${i * 90}ms` }}
          >
            <button
              type="button"
              onMouseEnter={() => setHovered(i)}
              onFocus={() => setHovered(i)}
              onClick={() => setPinned(i)}
              aria-expanded={isActive}
              className="flex origin-left items-start gap-5 text-left transition-transform duration-300 ease-out hover:scale-[1.20] focus-visible:scale-[1.2] md:w-[260px]"
            >
              <span
                className={cn(
                  "relative z-10 mt-1.5 size-2.5 shrink-0 rounded-full ring-4 ring-bg transition-[opacity,background-color] duration-300 group-hover:opacity-100",
                  dim,
                  isCurrent
                    ? "animate-[nn-pulse_1.8s_ease-in-out_infinite] bg-accent"
                    : isActive
                      ? "bg-accent"
                      : "bg-muted",
                )}
              />
              <span className={cn("transition-opacity duration-300 group-hover:opacity-100", dim)}>
                <span className="flex items-center gap-2 font-mono text-xs text-muted">
                  {entry.period}
                  {isCurrent && (
                    <span className="rounded-full bg-accent-soft px-1.5 py-0.5 text-[10px] font-medium text-accent">
                      {NOW_LABEL[locale]}
                    </span>
                  )}
                </span>
                <span className="mt-1 block font-medium text-fg">{entry.role}</span>
                <span className="block text-sm text-muted">{entry.org}</span>
              </span>
            </button>

            {isActive && (
              <div className="nn-pop relative z-20 mt-3 w-full rounded-xl border border-line bg-white p-4 text-center shadow-[0_28px_70px_-20px_rgba(0,0,0,0.65)] md:absolute md:left-[300px] md:top-0 md:mt-0 md:w-[380px] md:text-left">
                {/* speech-bubble tail pointing back to the timeline */}
                <span
                  className="absolute -top-1.5 left-6 size-3 rotate-45 border-l border-t border-line bg-white md:-left-1.5 md:top-5 md:border-b md:border-l md:border-r-0 md:border-t-0"
                  aria-hidden
                />
                <div className="font-mono text-[11px] text-neutral-500">{entry.period}</div>
                <div className="mt-0.5 font-semibold text-neutral-900">
                  {entry.role} <span className="text-neutral-400">·</span> {entry.org}
                </div>
                <p className="mt-2 text-sm leading-6 text-neutral-700">{entry.summary}</p>
                <ul className="mt-2.5 space-y-1.5">
                  {entry.highlights.map((h) => (
                    <li
                      key={h}
                      className="flex justify-center gap-2 text-[13px] leading-5 text-neutral-700 md:justify-start"
                    >
                      <span className="mt-0.5 text-accent">▹</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex flex-wrap justify-center gap-1.5 md:justify-start">
                  {entry.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded border border-neutral-200 bg-neutral-50 px-1.5 py-0.5 font-mono text-[10.5px] text-neutral-600"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
