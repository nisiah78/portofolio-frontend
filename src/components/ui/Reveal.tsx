"use client";

import { useEffect, useRef } from "react";

/**
 * Fade-and-lift a block into view on scroll.
 * Content renders visible by default; the hidden state is only armed once JS
 * runs (via [data-anim]), so a no-JS visit still sees everything.
 */
export function Reveal({
  children,
  className,
  style,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.setAttribute("data-anim", "");
    const show = () => el.setAttribute("data-shown", "");

    if (!("IntersectionObserver" in window)) {
      show();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            show();
            io.disconnect();
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -5% 0px" },
    );
    io.observe(el);

    // Safety net: never leave content stuck hidden (throttled/offscreen tabs).
    const fallback = window.setTimeout(show, 1800);

    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  return (
    <div ref={ref} id={id} data-reveal="" className={className} style={style}>
      {children}
    </div>
  );
}
