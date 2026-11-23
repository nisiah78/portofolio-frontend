/* Mouse-driven visit: drag to look, click rings to walk, click objects, wheel to zoom.
   Ported from docs/v2/room-tour.js. */
import * as THREE from "three";
import { STATION_IDS, type PickId, type Room, type StationId, type Tour, type TourEvents } from "./types";

const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
const ease = (k: number) => k * k * (3 - 2 * k);

function lookAngles(eye: THREE.Vector3, tgt: THREE.Vector3) {
  const dx = tgt.x - eye.x, dy = tgt.y - eye.y, dz = tgt.z - eye.z;
  return { yaw: Math.atan2(-dx, -dz), pitch: Math.atan2(dy, Math.hypot(dx, dz)) };
}

interface Station { id: StationId; eye: THREE.Vector3; yaw: number; pitch: number }
function st(id: StationId, eye: THREE.Vector3, tgt: THREE.Vector3): Station {
  const a = lookAngles(eye, tgt);
  return { id, eye, yaw: a.yaw, pitch: a.pitch };
}

const STATIONS: Station[] = [
  st("entry", V(0.95, 1.62, 1.15), V(0.2, 1.0, -1.4)),
  st("desk", V(0.4, 1.36, -0.15), V(0.4, 1.05, -1.5)),
  st("cert", V(0.3, 1.62, -0.55), V(0.3, 1.9, -1.69)),
  st("infra", V(-0.45, 1.5, 1.0), V(-1.3, 1.0, 0.45)),
  st("windows", V(0.2, 1.6, 0.5), V(-1.5, 1.65, -0.3)),
  st("terrace", V(0.25, 1.62, 3.9), V(0.1, 1.2, -1.0)),
];

interface Tween {
  t: number; dur: number;
  fp: THREE.Vector3; tp: THREE.Vector3;
  fy: number; dy: number; fpi: number; dpi: number;
  ff: number; tf: number; fo: number; to: number;
  done?: () => void; walk: boolean;
}

export function createTour(R: Room, applyOffset: (off: number) => void): Tour {
  const cbs: { [K in keyof TourEvents]: ((a: TourEvents[K]) => void)[] } = { change: [], pick: [], mode: [] };
  let yaw = 0, pitch = 0, tYaw = 0, tPitch = 0, fov = 70, tFov = 70;
  let tw: Tween | null = null;
  const rings: THREE.Mesh[] = [];
  let drag: { x: number; y: number; moved: number } | null = null;
  let hoverId: string | null = null;
  const ray = new THREE.Raycaster(), mouse = new THREE.Vector2();

  function emit<K extends keyof TourEvents>(k: K, a: TourEvents[K]) {
    cbs[k].forEach((f) => f(a));
  }
  const dur = (d: number) => (R.reducedMotion ? Math.min(d, 0.35) : d);

  function buildRings() {
    if (rings.length) return;
    STATIONS.forEach((s) => {
      const m = new THREE.Mesh(
        new THREE.RingGeometry(0.16, 0.22, 40),
        new THREE.MeshBasicMaterial({ color: 0xff8a3d, transparent: true, opacity: 0.85, side: THREE.DoubleSide, depthWrite: false, fog: false }),
      );
      const dot = new THREE.Mesh(
        new THREE.CircleGeometry(0.07, 24),
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9, side: THREE.DoubleSide, depthWrite: false }),
      );
      m.add(dot);
      m.rotation.x = -Math.PI / 2;
      m.position.set(s.eye.x, s.id === "terrace" ? 0.045 : 0.02, s.eye.z);
      m.userData.station = s.id;
      dot.userData.station = s.id;
      m.visible = false;
      R.scene.add(m);
      rings.push(m);
    });
    R.frameHooks.push((_dt, t) => {
      for (let i = 0; i < rings.length; i++) {
        const k = 1 + Math.sin(t * 3 + i) * 0.07;
        rings[i].scale.set(k, k, k);
      }
    });
  }
  function showRings() {
    rings.forEach((r) => { r.visible = tour.active && !tw && r.userData.station !== tour.current; });
  }

  function startTween(toPos: THREE.Vector3, toYaw: number, toPitch: number, d: number, toFov: number, fromOff: number, toOff: number, done?: () => void) {
    const e = new THREE.Euler().setFromQuaternion(R.camera.quaternion, "YXZ");
    const inTour = tour.active || R.mode === "tour";
    const fy = inTour ? yaw : e.y, fp = inTour ? pitch : e.x;
    let dy = toYaw - fy;
    while (dy > Math.PI) dy -= 2 * Math.PI;
    while (dy < -Math.PI) dy += 2 * Math.PI;
    tw = {
      t: 0, dur: dur(d), fp: R.camera.position.clone(), tp: toPos.clone(),
      fy, dy, fpi: fp, dpi: toPitch - fp, ff: R.camera.fov, tf: toFov, fo: fromOff, to: toOff,
      done, walk: d > 1 && !R.reducedMotion,
    };
    showRings();
  }

  R.frameHooks.push((dt) => {
    if (R.mode !== "tour") return;
    const cam = R.camera;
    if (tw) {
      tw.t += dt;
      const k = ease(Math.min(1, tw.t / tw.dur));
      cam.position.lerpVectors(tw.fp, tw.tp, k);
      cam.position.y += Math.sin(k * Math.PI) * (tw.walk ? 0.035 * Math.sin(tw.t * 9) : 0);
      yaw = tw.fy + tw.dy * k; pitch = tw.fpi + tw.dpi * k; tYaw = yaw; tPitch = pitch;
      fov = cam.fov = tw.ff + (tw.tf - tw.ff) * k; tFov = tw.tf;
      applyOffset(tw.fo + (tw.to - tw.fo) * k);
      cam.rotation.set(pitch, yaw, 0, "YXZ");
      if (tw.t >= tw.dur) {
        const d = tw.done;
        tw = null;
        showRings();
        d?.();
      }
      cam.updateProjectionMatrix();
      return;
    }
    yaw += (tYaw - yaw) * Math.min(1, dt * 12);
    pitch += (tPitch - pitch) * Math.min(1, dt * 12);
    if (Math.abs(tFov - fov) > 0.01) {
      fov += (tFov - fov) * Math.min(1, dt * 8);
      cam.fov = fov;
      cam.updateProjectionMatrix();
    }
    cam.rotation.set(pitch, yaw, 0, "YXZ");
  });

  function setCurrent(id: StationId) {
    tour.current = id;
    emit("change", id);
    showRings();
  }

  /* ----- pointer input (attached to the canvas only) ----- */
  function ndc(ev: PointerEvent) {
    const r = R.canvas.getBoundingClientRect();
    mouse.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
  }
  function pickAt(ev: PointerEvent): { type: "station"; id: StationId } | { type: "obj"; id: PickId } | null {
    ndc(ev);
    ray.setFromCamera(mouse, R.camera);
    const h = ray.intersectObjects(rings.filter((r) => r.visible), true);
    if (h.length) return { type: "station", id: h[0].object.userData.station };
    const hits = ray.intersectObjects(R.pickRoots, true);
    for (const hit of hits) {
      let o: THREE.Object3D | null = hit.object;
      while (o) {
        if (o.userData?.pick) return { type: "obj", id: o.userData.pick };
        o = o.parent;
      }
    }
    return null;
  }

  const tour: Tour = {
    stations: STATION_IDS,
    current: "entry",
    active: false,
    on(k, f) {
      cbs[k].push(f);
    },
    enter() {
      if (tour.active) return;
      buildRings();
      tour.active = true;
      R.mode = "tour";
      R.tourFov = 70;
      const s = STATIONS[0];
      tour.current = "entry";
      startTween(s.eye, s.yaw, s.pitch, 1.9, 70, R.curOff ?? R.heroOffset, 0, () => { tYaw = yaw; tPitch = pitch; });
      emit("mode", true);
      emit("change", "entry");
    },
    exit() {
      if (!tour.active) return;
      const b = R.heroCam, a = lookAngles(b.pos, b.target);
      rings.forEach((r) => { r.visible = false; });
      emit("mode", false);
      startTween(b.pos, a.yaw, a.pitch, 1.6, R.viewW < 700 ? 74 : 60, 0, R.viewW > 900 ? R.heroOffset : 0, () => {
        tour.active = false;
        R.mode = "hero";
        R.pointerN.sx = R.pointerN.sy = 0;
        R.resize();
      });
    },
    goTo(id) {
      const s = STATIONS.find((x) => x.id === id);
      if (!s || !tour.active) return;
      const d = R.camera.position.distanceTo(s.eye);
      setCurrent(id);
      rings.forEach((r) => { r.visible = false; });
      startTween(s.eye, s.yaw, s.pitch, Math.max(0.9, Math.min(2.2, d * 0.7)), 70, 0, 0, () => { tYaw = yaw; tPitch = pitch; showRings(); });
    },
    bind(cv) {
      const opt = { signal: R.signal };
      cv.addEventListener("pointerdown", (ev) => {
        if (!tour.active || tw) return;
        drag = { x: ev.clientX, y: ev.clientY, moved: 0 };
        try { cv.setPointerCapture(ev.pointerId); } catch { /* pointer already released */ }
        cv.style.cursor = "grabbing";
      }, opt);
      cv.addEventListener("pointermove", (ev) => {
        if (!tour.active) return;
        if (drag) {
          const dx = ev.clientX - drag.x, dy = ev.clientY - drag.y;
          drag.moved += Math.abs(dx) + Math.abs(dy);
          drag.x = ev.clientX;
          drag.y = ev.clientY;
          const sens = 0.0034 * (fov / 70);
          tYaw += dx * sens;
          tPitch = Math.max(-1.1, Math.min(1.1, tPitch + dy * sens));
        } else if (!tw) {
          const p = pickAt(ev), id = p ? p.type + ":" + p.id : null;
          if (id !== hoverId) { hoverId = id; cv.style.cursor = id ? "pointer" : "grab"; }
        }
      }, opt);
      cv.addEventListener("pointerup", (ev) => {
        if (!tour.active) return;
        const was = drag;
        drag = null;
        cv.style.cursor = "grab";
        if (was && was.moved < 6 && !tw) {
          const p = pickAt(ev);
          if (p?.type === "station") tour.goTo(p.id);
          else if (p) emit("pick", p.id);
        }
      }, opt);
      cv.addEventListener("wheel", (ev) => {
        if (!tour.active) return;
        ev.preventDefault();
        tFov = Math.max(34, Math.min(85, tFov + ev.deltaY * 0.04));
      }, { passive: false, signal: R.signal });
      /* keyboard works page-wide while touring (the HUD buttons may hold focus) */
      window.addEventListener("keydown", (ev) => {
        if (!tour.active || ev.ctrlKey || ev.metaKey || ev.altKey) return;
        const t = ev.target as HTMLElement | null;
        if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
        if (ev.key === "Escape") tour.exit();
        else if (ev.key === "ArrowLeft") tYaw += 0.12;
        else if (ev.key === "ArrowRight") tYaw -= 0.12;
        else if (ev.key === "ArrowUp") tPitch = Math.min(1.1, tPitch + 0.08);
        else if (ev.key === "ArrowDown") tPitch = Math.max(-1.1, tPitch - 0.08);
        else if (/^[1-6]$/.test(ev.key)) tour.goTo(STATIONS[+ev.key - 1].id);
        else return;
        ev.preventDefault();
      }, opt);
    },
    pointerFromWindow(ev) {
      if (R.mode !== "hero") return;
      R.pointerN.x = (ev.clientX / window.innerWidth) * 2 - 1;
      R.pointerN.y = (ev.clientY / window.innerHeight) * 2 - 1;
    },
  };
  return tour;
}
