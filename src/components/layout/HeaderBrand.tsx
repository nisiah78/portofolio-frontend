"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { profile } from "@/data/profile";
import { cn } from "@/lib/utils";

/**
 * Header brand that reacts to scroll: while the hero portrait is on screen it
 * shows the `~/handle` logo; once the portrait scrolls under the sticky header
 * the profile image shrinks into the header with the name + role beside it.
 */
export function HeaderBrand({ name, role }: { name: string; role: string }) {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const target = document.getElementById("hero-portrait");
    if (!target || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      ([entry]) => setCompact(!entry.isIntersecting),
      // shrink the root's top by the header height so the swap happens
      // right as the portrait slips under the sticky header
      { rootMargin: "-72px 0px 0px 0px", threshold: 0 },
    );
    io.observe(target);
    return () => io.disconnect();
  }, []);

  return (
    <div className="relative flex h-10 items-center">
      {/* default: terminal-style logo */}
      <Link
        href="#top"
        aria-hidden={compact}
        className={cn(
          "font-mono text-sm font-medium text-fg transition-all duration-300",
          compact ? "pointer-events-none -translate-y-1 opacity-0" : "translate-y-0 opacity-100",
        )}
      >
        <span className="text-accent">~/</span>
        {profile.handle}
      </Link>

      {/* on scroll: the profile image shrinks into the header with name + role */}
      <Link
        href="#top"
        aria-hidden={!compact}
        aria-label={`${name} — ${role}`}
        className={cn(
          "absolute left-0 flex items-center gap-2.5 transition-all duration-300 ease-out",
          compact
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-1 scale-[0.6] opacity-0",
        )}
      >
        <span className="relative size-9 shrink-0 overflow-hidden rounded-full border border-line">
          <Image
            src="/images/profile.png"
            alt={name}
            fill
            sizes="36px"
            className="object-cover"
          />
        </span>
        <span className="leading-tight">
          <span className="block whitespace-nowrap font-mono text-sm font-medium text-fg">
            {name}
          </span>
          <span className="block whitespace-nowrap font-mono text-[11px] text-muted">
            {role}
          </span>
        </span>
      </Link>
    </div>
  );
}
