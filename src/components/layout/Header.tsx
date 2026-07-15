"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Briefcase,
  History,
  Layers,
  Mail,
  Sparkles,
  User,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { LimelightNav, type LimelightNavItem } from "@/components/ui/limelight-nav";
import { profile } from "@/data/profile";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

const SECTION_ICONS = {
  about: User,
  stack: Layers,
  work: Briefcase,
  history: History,
  services: Sparkles,
  contact: Mail,
} as const;

const SECTION_IDS = ["about", "stack", "work", "history", "services", "contact"] as const;

function capitalizeLabel(label: string) {
  if (!label) return label;
  return label.charAt(0).toUpperCase() + label.slice(1);
}

/** Section whose top has last crossed the sticky probe line. */
function sectionIndexFromScroll(probeY: number): number {
  let current = 0;
  for (let i = 0; i < SECTION_IDS.length; i++) {
    const el = document.getElementById(SECTION_IDS[i]);
    if (!el) continue;
    if (el.getBoundingClientRect().top <= probeY) current = i;
  }

  const doc = document.documentElement;
  const nearBottom =
    window.innerHeight + window.scrollY >= doc.scrollHeight - 8;
  if (nearBottom) current = SECTION_IDS.length - 1;

  return current;
}

export function Header({
  dict,
  onSearchClick,
}: {
  dict: Dictionary;
  onSearchClick: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const lockUntilRef = useRef(0);
  const rafRef = useRef(0);

  const nav = SECTION_IDS.map((key) => ({
    href: `#${key}`,
    id: key,
    label: capitalizeLabel(dict.nav[key]),
    key,
  }));

  const syncActive = useCallback(() => {
    if (Date.now() < lockUntilRef.current) return;
    // Probe just below the sticky header so tall sections (e.g. Stack) don't steal neighbors.
    setActiveIndex(sectionIndexFromScroll(96));
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 48);
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(syncActive);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", syncActive);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", syncActive);
      cancelAnimationFrame(rafRef.current);
    };
  }, [syncActive]);

  function goTo(index: number, href: string) {
    setActiveIndex(index);
    // Ignore scroll-spy while smooth-scroll settles.
    lockUntilRef.current = Date.now() + 900;
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  }

  const limelightItems: LimelightNavItem[] = nav.map((item, index) => {
    const IconCmp = SECTION_ICONS[item.key];
    return {
      id: item.key,
      label: item.label,
      icon: <IconCmp strokeWidth={2} />,
      onClick: () => goTo(index, item.href),
    };
  });

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-[background,border-color,box-shadow] duration-300",
        scrolled
          ? "border-b border-transparent bg-transparent"
          : "border-b border-line backdrop-blur-md",
      )}
      style={
        scrolled
          ? undefined
          : {
              background:
                "linear-gradient(to bottom right, var(--header-bg) 55%, var(--header-tint))",
            }
      }
    >
      {/* ── Top: Cursor Windows title bar ──────────────────────────────── */}
      <div
        className={cn(
          "transition-all duration-300",
          scrolled
            ? "pointer-events-none absolute inset-x-0 top-0 -translate-y-2 opacity-0"
            : "relative translate-y-0 opacity-100",
        )}
        aria-hidden={scrolled}
      >
        <Container className="grid h-11 grid-cols-[1fr_minmax(0,360px)_1fr] items-center gap-3">
          {/* Left: avatar + menu bar (Cursor Windows style) */}
          <div className="flex min-w-0 items-center gap-1.5">
            <Link
              href="#top"
              aria-label={`${profile.name} — home`}
              className="relative size-7 shrink-0 overflow-hidden rounded-full border border-line"
            >
              <Image
                src="/images/profile.png"
                alt={profile.name}
                fill
                sizes="28px"
                className="object-cover"
              />
            </Link>

            <nav
              className="flex min-w-0 items-center gap-px overflow-x-auto"
              aria-label="Primary"
            >
              {nav.map((item, i) => {
                const isActive = activeIndex === i;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      goTo(i, item.href);
                    }}
                    className={cn(
                      "shrink-0 rounded-[4px] px-2 py-[3px] text-[12.5px] leading-none transition-colors",
                      isActive
                        ? "bg-fg/8 text-fg"
                        : "text-muted hover:bg-fg/6 hover:text-fg",
                    )}
                  >
                    {item.label}
                  </a>
                );
              })}
            </nav>
          </div>

          {/* Center: Command Center / stack-search trigger */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={onSearchClick}
              aria-haspopup="dialog"
              aria-label="Search experience by stack"
              className={cn(
                "flex h-7 w-full max-w-[360px] items-center gap-2 rounded-md border border-line/80",
                "bg-fg/4 px-2.5 shadow-[inset_0_1px_0_#ffffff06] transition-colors",
                "hover:border-accent/50 hover:bg-fg/6",
              )}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-3.5 shrink-0 text-faint"
                aria-hidden
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <span className="min-w-0 flex-1 truncate text-center font-mono text-[12px]">
                <span className="text-muted">{profile.handle}</span>
                <span className="text-faint"> — </span>
                <span className="text-fg/70">portfolio</span>
              </span>
              <kbd className="hidden shrink-0 rounded border border-line bg-surface/80 px-1 py-px font-mono text-[10px] text-faint sm:inline">
                Ctrl+K
              </kbd>
            </button>
          </div>

          {/* Right: window actions */}
          <div className="flex items-center justify-end gap-2">
            <ThemeToggle />
          </div>
        </Container>
      </div>

      {/* ── Scrolled: Limelight sticky nav ──────────────────────────────── */}
      <div
        className={cn(
          "transition-all duration-300",
          scrolled
            ? "relative translate-y-0 opacity-100"
            : "pointer-events-none absolute inset-x-0 top-0 translate-y-2 opacity-0",
        )}
        aria-hidden={!scrolled}
      >
        <Container className="flex items-center justify-center gap-3 py-3">
          <LimelightNav
            visible={scrolled}
            className="border-line/80 bg-surface/90 shadow-[0_20px_50px_-28px_#000] backdrop-blur-md"
            items={limelightItems}
            activeIndex={activeIndex}
            onTabChange={setActiveIndex}
          />
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </Container>
      </div>
    </header>
  );
}
