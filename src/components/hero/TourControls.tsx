"use client";

import { cn } from "@/lib/utils";
import { useOfficeTour } from "./OfficeTourProvider";

function CubeIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}

function SunIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2m-7.07-2.93 1.41-1.41m11.32-11.32 1.41-1.41M2 12h2m16 0h2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41" />
    </svg>
  );
}

/** "Visit my 3D office" — pulses in the accent colour; collapses to its icon on small screens. */
export function TourButton({ compact = false, className }: { compact?: boolean; className?: string }) {
  const { t, ready, enterTour } = useOfficeTour();
  if (!ready) return null;
  return (
    <button
      type="button"
      onClick={enterTour}
      aria-label={t.tour}
      title={t.tour}
      className={cn(
        "nn-tour-btn flex h-7 shrink-0 items-center justify-center gap-1.5 rounded-md bg-accent font-mono text-[12px] font-semibold text-accent-ink transition-transform hover:-translate-y-px",
        compact ? "w-9 rounded-full h-9" : "w-7 min-[1100px]:w-auto min-[1100px]:px-2.5",
        className,
      )}
    >
      <CubeIcon size={compact ? 16 : 14} />
      {!compact && <span className="hidden whitespace-nowrap min-[1100px]:inline">{t.tour}</span>}
    </button>
  );
}

/** Office time + weather, as rendered by the scene. */
export function OfficeClock({ className }: { className?: string }) {
  const { t, ready, clock } = useOfficeTour();
  if (!ready || !clock) return null;
  return (
    <div
      aria-label={t.clockLabel}
      className={cn(
        "flex h-7 items-center gap-1.5 whitespace-nowrap rounded-md border border-line/80 px-2 font-mono text-[11.5px] text-muted",
        className,
      )}
    >
      <span className="text-accent">
        <SunIcon />
      </span>
      {clock}
    </div>
  );
}
