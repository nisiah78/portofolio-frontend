"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, localeNames, type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();

  const hrefFor = (target: Locale) => {
    const segments = pathname.split("/");
    segments[1] = target; // first path segment is always the locale
    return segments.join("/") || `/${target}`;
  };

  return (
    <div className="pointer-events-none fixed inset-y-0 left-3 z-40 flex items-center sm:left-4">
      <div
        role="group"
        aria-label="Language"
        className={cn(
          "pointer-events-auto flex flex-col gap-1 rounded-full border border-line bg-surface/90 p-1",
          "shadow-[0_12px_30px_-12px_rgba(0,0,0,0.5)] backdrop-blur-md",
        )}
      >
        {locales.map((l) => (
          <Link
            key={l}
            href={hrefFor(l)}
            aria-current={l === locale ? "true" : undefined}
            className={cn(
              "rounded-full px-2 py-1.5 text-center font-mono text-[11px] font-medium transition-colors",
              l === locale ? "bg-accent text-bg" : "text-muted hover:text-accent",
            )}
          >
            {localeNames[l]}
          </Link>
        ))}
      </div>
    </div>
  );
}
