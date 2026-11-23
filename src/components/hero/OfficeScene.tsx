"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { createRoom } from "@/lib/room/env";
import type { Room } from "@/lib/room/types";
import { useOfficeTour } from "./OfficeTourProvider";

const isDayHour = (h: number) => h >= 6.3 && h < 18;

/** The theme drives the scene's clock: real time when it matches, otherwise a fixed day / night hour. */
function hourFor(theme: string | undefined, real: number) {
  if (theme === "light") return isDayHour(real) ? real : 13;
  return isDayHour(real) ? 22.5 : real;
}

/** Probe once so a browser without WebGL quietly keeps the gradient backdrop (no three.js errors). */
function hasWebGL() {
  try {
    const gl = document.createElement("canvas").getContext("webgl2");
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    return !!gl;
  } catch {
    return false;
  }
}

function currentHour() {
  const d = new Date();
  return d.getHours() + d.getMinutes() / 60;
}

/**
 * Full-bleed WebGL office behind the hero. Loaded client-side only (see OfficeSceneLazy);
 * if WebGL is unavailable nothing is mounted and the hero's gradient backdrop shows instead.
 */
export default function OfficeScene() {
  const hostRef = useRef<HTMLDivElement>(null);
  const roomRef = useRef<Room | null>(null);
  const realHour = useRef(0);
  const { resolvedTheme } = useTheme();
  const themeRef = useRef(resolvedTheme);
  const { register, t } = useOfficeTour();
  const labelRef = useRef(t.canvasLabel);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !hasWebGL()) return;
    // A fresh canvas per mount: a WebGL context lost on unmount can't be reused (StrictMode remounts).
    const cv = document.createElement("canvas");
    cv.className = "nn-stage";
    cv.tabIndex = 0;
    cv.setAttribute("role", "img");
    cv.setAttribute("aria-label", labelRef.current);
    host.appendChild(cv);

    realHour.current = currentHour();
    let room: Room;
    try {
      room = createRoom(cv, {
        hour: hourFor(themeRef.current, realHour.current),
        reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      });
    } catch (err) {
      console.warn("3D office unavailable", err);
      cv.remove();
      return;
    }
    roomRef.current = room;
    room.tour.bind(cv);
    register(room);

    window.addEventListener("pointermove", (e) => room.tour.pointerFromWindow(e), { signal: room.signal });

    // Only render while the hero is on screen and the tab is visible.
    let onScreen = true;
    const sync = () => room.setPaused(!onScreen || document.hidden);
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });
    io.observe(cv);
    document.addEventListener("visibilitychange", sync, { signal: room.signal });

    return () => {
      io.disconnect();
      register(null);
      room.destroy();
      roomRef.current = null;
      cv.remove();
    };
  }, [register]);

  useEffect(() => {
    themeRef.current = resolvedTheme;
    roomRef.current?.setHour(hourFor(resolvedTheme, realHour.current), true);
  }, [resolvedTheme]);

  useEffect(() => {
    labelRef.current = t.canvasLabel;
    hostRef.current?.querySelector("canvas")?.setAttribute("aria-label", t.canvasLabel);
  }, [t.canvasLabel]);

  return <div ref={hostRef} className="nn-scene-host absolute inset-0" />;
}
