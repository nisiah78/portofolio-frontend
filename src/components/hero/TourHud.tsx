"use client";

import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { STATION_IDS } from "@/lib/room/types";
import { useOfficeTour } from "./OfficeTourProvider";

const hudBtn =
  "nn-hud-glass pointer-events-auto flex h-11 items-center gap-2 rounded-[10px] px-4 font-mono text-sm font-medium text-fg transition-colors hover:border-accent";

/** Overlay shown while touring the 3D office: exit, clock, stops, info card and hints. */
export function TourHud() {
  const { t, tour, station, info, clock, exitTour, goTo, closeInfo } = useOfficeTour();

  return (
    <div className="nn-hud" aria-hidden={!tour} inert={!tour}>
      <div className="absolute left-5 top-5">
        <button type="button" onClick={exitTour} className={hudBtn}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M19 12H5m7 7-7-7 7-7" />
          </svg>
          {t.exit}
        </button>
      </div>

      <div className="absolute right-5 top-5 flex items-center gap-2.5">
        {clock && (
          <div aria-label={t.clockLabel} className="nn-hud-glass pointer-events-auto flex h-11 items-center rounded-[10px] px-3 font-mono text-[12.5px] text-muted">
            {clock}
          </div>
        )}
        <div className="pointer-events-auto">
          <ThemeToggle />
        </div>
      </div>

      {info && (
        <section
          aria-live="polite"
          className="nn-hud-glass pointer-events-auto absolute bottom-[92px] left-5 flex w-[min(360px,calc(100%-40px))] flex-col gap-2 rounded-[14px] p-[18px] pr-12"
        >
          <button
            type="button"
            onClick={closeInfo}
            aria-label={t.close}
            className="absolute right-2 top-2 flex size-11 items-center justify-center rounded-[10px] text-muted hover:bg-fg/10 hover:text-fg"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
          <h3 className="text-xl font-bold tracking-tight text-fg">{t.info[info][0]}</h3>
          <p className="text-[14.5px] leading-relaxed text-muted">{t.info[info][1]}</p>
        </section>
      )}

      <div className="nn-hud-glass pointer-events-auto absolute bottom-[92px] right-5 hidden w-[250px] rounded-[14px] px-4 py-3.5 font-mono text-[13px] leading-relaxed text-muted min-[980px]:block">
        <b className="font-semibold text-accent">{t.hintDrag}</b> {t.hintDragTxt}
        <br />
        <b className="font-semibold text-accent">{t.hintWheel}</b> {t.hintWheelTxt}
        <br />
        <b className="font-semibold text-accent">{t.hintRing}</b> {t.hintRingTxt}
      </div>

      <nav
        aria-label={t.stationsLabel}
        className="nn-hud-glass pointer-events-auto absolute bottom-[22px] left-1/2 flex w-max max-w-[calc(100%-32px)] -translate-x-1/2 flex-wrap justify-center gap-1.5 rounded-[14px] p-1.5"
      >
        {STATION_IDS.map((id, i) => {
          const current = station === id;
          return (
            <button
              key={id}
              type="button"
              aria-current={current}
              onClick={() => goTo(id)}
              className={
                current
                  ? "flex min-h-11 items-center gap-2 rounded-[9px] bg-accent px-3.5 text-[13.5px] font-semibold text-bg"
                  : "flex min-h-11 items-center gap-2 rounded-[9px] px-3.5 text-[13.5px] text-muted hover:bg-fg/10 hover:text-fg"
              }
            >
              <kbd className="font-mono text-[11px] opacity-75">{i + 1}</kbd>
              <span className="hidden min-[620px]:inline">{t.st[id]}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
