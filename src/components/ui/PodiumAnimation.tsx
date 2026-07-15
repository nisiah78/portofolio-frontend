"use client";

import { useEffect, useRef } from "react";

/**
 * Ranking podium next to the contact title: the three blocks (2nd · 1st · 3rd)
 * rise in one by one. Driven by a DOM attribute so no state is set inside the effect.
 */
export function PodiumAnimation() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const start = () => el.setAttribute("data-play", "");
    if (!("IntersectionObserver" in window)) {
      start();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            start();
            io.disconnect();
          }
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-podium
      className="flex select-none items-end gap-1.5"
      aria-label="Ranking podium — 1st place"
      role="img"
    >
      <div
        className="nn-bar flex h-12 w-9 items-center justify-center rounded-md border border-line bg-surface font-mono text-sm font-bold text-muted"
        style={{ animationDelay: "0.35s" }}
      >
        2
      </div>

      <div
        className="nn-bar flex h-16 w-9 items-center justify-center rounded-md bg-accent font-mono text-sm font-bold text-bg"
        style={{ animationDelay: "0.1s" }}
      >
        1
      </div>

      <div
        className="nn-bar flex h-9 w-9 items-center justify-center rounded-md border border-line bg-surface font-mono text-sm font-bold text-faint"
        style={{ animationDelay: "0.6s" }}
      >
        3
      </div>
    </div>
  );
}
