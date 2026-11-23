"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { certification } from "@/data/profile";
import type { Dictionary } from "@/i18n/dictionaries";
import type { PickId, Room, RoomState, StationId } from "@/lib/room/types";

export type OfficeDict = Dictionary["office"];
type InfoId = Exclude<PickId, "cert">;

interface OfficeTourValue {
  t: OfficeDict;
  /** True once a WebGL scene is mounted — the tour button stays hidden otherwise. */
  ready: boolean;
  tour: boolean;
  station: StationId;
  info: InfoId | null;
  clock: string;
  enterTour: () => void;
  exitTour: () => void;
  goTo: (id: StationId) => void;
  closeInfo: () => void;
  /** Called by the scene with its room on mount and `null` on unmount. */
  register: (room: Room | null) => void;
}

const OfficeTourContext = createContext<OfficeTourValue | null>(null);

export function useOfficeTour() {
  const ctx = useContext(OfficeTourContext);
  if (!ctx) throw new Error("useOfficeTour must be used inside <OfficeTourProvider>");
  return ctx;
}

function skyWord(st: RoomState, t: OfficeDict) {
  if (st.day < 0.08) return t.sky.night;
  if (st.day < 0.6 && Math.abs(st.sinE) < 0.22) return st.hour < 12 ? t.sky.dawn : t.sky.dusk;
  if (st.weather === "rain") return t.sky.rain;
  return st.weather === "cloudy" ? t.sky.cloudy : t.sky.clear;
}

function clockLabel(st: RoomState, t: OfficeDict) {
  const hh = Math.floor((((st.hour % 24) + 24) % 24));
  const mm = (Math.round((((st.hour % 1) + 1) % 1) * 4) % 4) * 15;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")} · ${skyWord(st, t)}`;
}

export function OfficeTourProvider({ t, children }: { t: OfficeDict; children: React.ReactNode }) {
  const roomRef = useRef<Room | null>(null);
  const tRef = useRef(t);
  const [ready, setReady] = useState(false);
  const [tour, setTour] = useState(false);
  const [station, setStation] = useState<StationId>("entry");
  const [info, setInfo] = useState<InfoId | null>(null);
  const [clock, setClock] = useState("");

  useEffect(() => {
    tRef.current = t;
    if (roomRef.current) setClock(clockLabel(roomRef.current.state, t));
  }, [t]);

  const register = useCallback((room: Room | null) => {
    roomRef.current = room;
    setReady(!!room);
    if (!room) {
      setTour(false);
      return;
    }
    let lastTick = 0;
    room.onTime = (st) => {
      const now = performance.now();
      if (now - lastTick < 220) return;
      lastTick = now;
      setClock(clockLabel(st, tRef.current));
    };
    setClock(clockLabel(room.state, tRef.current));
    room.tour.on("change", (id) => {
      setStation(id);
      setInfo(null);
    });
    room.tour.on("pick", (id) => {
      if (id === "cert") {
        window.open(certification.href, "_blank", "noopener");
        return;
      }
      setInfo(id);
    });
    room.tour.on("mode", (on) => {
      setTour(on);
      setInfo(null);
    });
  }, []);

  // The whole page reacts to the tour through one root attribute (header, hero copy, scroll lock).
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.tour = tour ? "on" : "off";
    if (!tour) return;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = prev;
    };
  }, [tour]);

  const enterTour = useCallback(() => {
    const room = roomRef.current;
    if (!room) return;
    window.scrollTo({ top: 0, behavior: "instant" });
    room.tour.enter();
    window.setTimeout(() => room.canvas.focus({ preventScroll: true }), 400);
  }, []);
  const exitTour = useCallback(() => roomRef.current?.tour.exit(), []);
  const goTo = useCallback((id: StationId) => roomRef.current?.tour.goTo(id), []);
  const closeInfo = useCallback(() => setInfo(null), []);

  const value = useMemo(
    () => ({ t, ready, tour, station, info, clock, enterTour, exitTour, goTo, closeInfo, register }),
    [t, ready, tour, station, info, clock, enterTour, exitTour, goTo, closeInfo, register],
  );

  return <OfficeTourContext.Provider value={value}>{children}</OfficeTourContext.Provider>;
}
