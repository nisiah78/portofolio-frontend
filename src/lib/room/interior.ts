/* The office: walls, desk, screens, chair, curtains, frame — ported from docs/v2/room-interior.js. */
import * as THREE from "three";
import { noiseTex } from "./util";
import type { PickId, Room } from "./types";

type ScreenKind = "code" | "term" | "dash" | "cam" | "black";
interface Screen {
  g: CanvasRenderingContext2D;
  t: THREE.CanvasTexture;
  kind: ScreenKind;
  acc: number;
  seed: number;
}

const CODE = [
  "final class ProjectController",
  "  #[Route('/api/projects')]",
  "  public function list(): Response",
  "    return $this->json($repo->all());",
  "export async function getStack() {",
  '  const res = await fetch("/api/stack");',
  "  return res.json() as Promise<Stack[]>;",
  "const agent = claude.architect({",
  "  tools: [search, files, deploy],",
  "  review: true,",
  "});",
  'await agent.run("ship the feature");',
  "# pytest -q  ·  42 passed",
  "composer require symfony/messenger",
  "npm run build  ✓  1.2s",
];

function plankTex() {
  const c = document.createElement("canvas");
  c.width = c.height = 512;
  const g = c.getContext("2d")!;
  const cols = ["#4b3626", "#54402d", "#43301f", "#5a4531", "#4e3a29"];
  for (let r = 0; r < 4; r++) {
    const off = (r % 2) * 128;
    for (let i = -1; i < 3; i++) {
      g.fillStyle = cols[(r * 3 + i + 5) % cols.length];
      g.fillRect(i * 256 + off, r * 128, 256, 128);
      for (let n = 0; n < 40; n++) {
        g.fillStyle = "rgba(0,0,0," + Math.random() * 0.07 + ")";
        g.fillRect(i * 256 + off + Math.random() * 256, r * 128 + Math.random() * 128, 40 + Math.random() * 90, 1);
      }
      g.fillStyle = "rgba(0,0,0,0.5)";
      g.fillRect(i * 256 + off, r * 128, 2, 128);
    }
    g.fillStyle = "rgba(0,0,0,0.5)";
    g.fillRect(0, r * 128, 512, 2);
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function oakTex() {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 128;
  const g = c.getContext("2d")!;
  g.fillStyle = "#b98a58";
  g.fillRect(0, 0, 256, 128);
  for (let i = 0; i < 90; i++) {
    g.fillStyle = "rgba(" + ((90 + Math.random() * 40) | 0) + ",60,30," + Math.random() * 0.18 + ")";
    g.fillRect(0, Math.random() * 128, 256, 1 + Math.random() * 2);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

function drawScreen(s: Screen, t: number) {
  const g = s.g, W = 512, H = 288;
  if (s.kind === "code") {
    g.fillStyle = "#10141c"; g.fillRect(0, 0, W, H);
    g.fillStyle = "#1b2230"; g.fillRect(0, 0, W, 22);
    ["#ff6b5e", "#ffc04d", "#4cd964"].forEach((c, i) => { g.fillStyle = c; g.beginPath(); g.arc(14 + i * 16, 11, 4, 0, 7); g.fill(); });
    g.font = "13px monospace";
    const sc = (t * 14) % (CODE.length * 20);
    for (let i = -1; i < 16; i++) {
      const idx = (Math.floor(sc / 20) + i + CODE.length * 4) % CODE.length, y = 40 + i * 20 - (sc % 20);
      g.fillStyle = "#4a5468"; g.fillText(String(idx + 1).padStart(2, "0"), 12, y);
      const ln = CODE[idx];
      g.fillStyle = /^(final|export|const|await)/.test(ln.trim()) ? "#ff9d5c" : ln.indexOf("//") > -1 || ln[0] === "#" ? "#6b7a90" : "#cfe0ff";
      g.fillText(ln, 42, y);
    }
    if (Math.floor(t * 2) % 2) { g.fillStyle = "#ff9d5c"; g.fillRect(180, H - 28, 8, 14); }
  } else if (s.kind === "term") {
    g.fillStyle = "#0c1118"; g.fillRect(0, 0, W, H); g.font = "14px monospace";
    const lines = ["$ claude --architect", "> reading repository…", "> plan: 4 steps", "> editing src/Service/Billing.php", "> running tests … ok", "> opening pull request #128"];
    const n = Math.min(lines.length, 1 + Math.floor((t * 0.9) % (lines.length + 3)));
    for (let j = 0; j < n; j++) { g.fillStyle = j === 0 ? "#ffb27a" : "#8ff0b4"; g.fillText(lines[j], 14, 30 + j * 24); }
  } else if (s.kind === "dash") {
    g.fillStyle = "#f2f4f8"; g.fillRect(0, 0, W, H); g.fillStyle = "#ffffff"; g.fillRect(16, 16, 230, 120); g.fillRect(262, 16, 234, 120); g.fillRect(16, 152, 480, 120);
    g.strokeStyle = "#ff7a2f"; g.lineWidth = 3; g.beginPath();
    for (let x = 0; x <= 200; x += 8) { const y = 100 - 30 * Math.sin(x * 0.04 + t * 0.8) - x * 0.1; if (x) g.lineTo(28 + x, y); else g.moveTo(28 + x, y); }
    g.stroke();
    g.fillStyle = "#3b6cff"; for (let b = 0; b < 8; b++) { const hh = 30 + 40 * Math.abs(Math.sin(b + t * 0.6)); g.fillRect(276 + b * 28, 120 - hh, 18, hh); }
    g.fillStyle = "#d7dce6"; for (let r2 = 0; r2 < 5; r2++) g.fillRect(30, 170 + r2 * 20, 200 + 180 * Math.abs(Math.sin(r2 * 1.7 + t * 0.2)), 8);
  } else if (s.kind === "cam") {
    g.fillStyle = "#05090c"; g.fillRect(0, 0, W, H); g.fillStyle = "#10201a";
    for (let q = 0; q < 4; q++) g.fillRect(16 + (q % 2) * 248, 16 + Math.floor(q / 2) * 136, 232, 120);
    g.fillStyle = "#3ddc84"; g.font = "12px monospace";
    g.fillText("NODE-01  ● online", 26, 34); g.fillText("NODE-02  ● online", 274, 34); g.fillText("ROUTER   ● 1 Gbps", 26, 170);
  } else {
    g.fillStyle = "#0a0d12"; g.fillRect(0, 0, W, H);
    const gr = g.createLinearGradient(0, 0, W, H);
    gr.addColorStop(0, "rgba(255,90,60," + (0.25 + 0.1 * Math.sin(t)) + ")"); gr.addColorStop(1, "rgba(60,90,255,0.2)");
    g.fillStyle = gr; g.fillRect(0, 0, W, H);
  }
  s.t.needsUpdate = true;
}

function wave(mesh: THREE.Mesh, amp: number, freq: number) {
  const a = mesh.geometry.attributes.position as THREE.BufferAttribute;
  const ar = a.array as Float32Array;
  for (let i = 0; i < ar.length; i += 3) ar[i + 2] += Math.sin(ar[i] * freq) * amp;
  a.needsUpdate = true;
  mesh.geometry.computeVertexNormals();
}

export function buildInterior(R: Room) {
  const scene = R.scene;
  const mats: Record<string, THREE.MeshStandardMaterial> = {};
  function M(color: string, rough?: number, metal?: number, extra?: THREE.MeshStandardMaterialParameters) {
    const k = color + "|" + rough + "|" + metal + (extra ? JSON.stringify(extra) : "");
    if (!mats[k]) mats[k] = new THREE.MeshStandardMaterial({ color, roughness: rough == null ? 0.8 : rough, metalness: metal || 0, ...extra });
    return mats[k];
  }
  function box(w: number, h: number, d: number, mat: THREE.Material, x: number, y: number, z: number, parent?: THREE.Object3D, shadow?: boolean) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z);
    if (shadow !== false) { m.castShadow = true; m.receiveShadow = true; }
    (parent || scene).add(m);
    return m;
  }
  function cyl(rt: number, rb: number, h: number, mat: THREE.Material, x: number, y: number, z: number, parent?: THREE.Object3D, seg?: number) {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg || 20), mat);
    m.position.set(x, y, z);
    m.castShadow = m.receiveShadow = true;
    (parent || scene).add(m);
    return m;
  }
  function wallWithHoles(w: number, h: number, holes: number[][], mat: THREE.Material) {
    const s = new THREE.Shape();
    s.moveTo(0, 0); s.lineTo(w, 0); s.lineTo(w, h); s.lineTo(0, h); s.lineTo(0, 0);
    holes.forEach((o) => {
      const p = new THREE.Path();
      p.moveTo(o[0], o[2]); p.lineTo(o[0], o[3]); p.lineTo(o[1], o[3]); p.lineTo(o[1], o[2]); p.lineTo(o[0], o[2]);
      s.holes.push(p);
    });
    const m = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: 0.2, bevelEnabled: false }), mat);
    m.castShadow = m.receiveShadow = true;
    return m;
  }

  /* ---- animated screens ---- */
  const screens: Screen[] = [];
  function screenTex(kind: ScreenKind) {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 288;
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    const s: Screen = { g: c.getContext("2d")!, t, kind, acc: 0, seed: Math.random() * 100 };
    drawScreen(s, 0);
    screens.push(s);
    return t;
  }
  R.frameHooks.push((dt, t) => {
    for (const s of screens) {
      s.acc += dt;
      if (s.acc > 0.12) { s.acc = 0; drawScreen(s, t + s.seed); }
    }
  });
  function pickable(o: THREE.Object3D, id: PickId) {
    o.userData.pick = id;
    R.pickables.push(o);
  }
  function monitor(w: number, h: number, x: number, y: number, z: number, ry: number, kind: ScreenKind, id: PickId | null) {
    const g = new THREE.Group();
    g.position.set(x, y, z);
    g.rotation.y = ry || 0;
    box(w + 0.03, h + 0.03, 0.035, M("#0d0f12", 0.4, 0.3), 0, h / 2 + 0.12, 0, g);
    const scr = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: screenTex(kind), toneMapped: false }));
    scr.position.set(0, h / 2 + 0.12, 0.019);
    g.add(scr);
    cyl(0.012, 0.012, 0.11, M("#2b2e33", 0.5, 0.6), 0, 0.06, -0.01, g);
    box(0.22, 0.01, 0.16, M("#1c1e22", 0.5, 0.5), 0, 0.005, 0, g);
    scene.add(g);
    if (id) pickable(scr, id);
    return g;
  }
  function laptop(x: number, y: number, z: number, ry: number, kind: ScreenKind, color: string, id: PickId | null) {
    const g = new THREE.Group();
    g.position.set(x, y, z);
    g.rotation.y = ry;
    box(0.34, 0.02, 0.23, M(color, 0.55, 0.2), 0, 0.01, 0, g);
    box(0.28, 0.003, 0.09, M("#0a0b0d", 0.8), 0, 0.022, 0.03, g, false);
    const lid = new THREE.Group();
    lid.position.set(0, 0.02, -0.11);
    lid.rotation.x = -0.28;
    g.add(lid);
    box(0.34, 0.22, 0.012, M(color, 0.5, 0.2), 0, 0.11, 0, lid);
    const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.31, 0.19), new THREE.MeshBasicMaterial({ map: screenTex(kind), toneMapped: false }));
    scr.position.set(0, 0.11, 0.0075);
    lid.add(scr);
    scene.add(g);
    if (id) pickable(scr, id);
    return g;
  }

  const wallW = M("#f1eee8", 0.95), taupe = M("#8f7e6c", 0.97), trim = M("#f6f4ef", 0.7);
  const floorT = plankTex();
  floorT.repeat.set(2.6, 2.9);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(3, 3.4), new THREE.MeshStandardMaterial({ map: floorT, roughness: 0.55 }));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);
  R.ceilMat = new THREE.MeshStandardMaterial({ color: 0xf4f2ee, roughness: 1 });
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(3, 3.4), R.ceilMat);
  ceil.rotation.x = Math.PI / 2;
  ceil.position.y = 2.6;
  scene.add(ceil);
  box(0.5, 0.02, 0.5, new THREE.MeshBasicMaterial({ color: 0xfff2d8 }), 0, 2.585, -0.1, scene, false);

  /* walls */
  box(3.4, 2.6, 0.2, taupe, 0, 1.3, -1.8, scene);
  const west = wallWithHoles(3.4, 2.6, [[1.7 + 0.55 - 0.17, 1.7 + 0.55 + 0.17, 0.95, 2.35], [1.7 + 0.05 - 0.17, 1.7 + 0.05 + 0.17, 0.95, 2.35]], wallW);
  west.rotation.y = Math.PI / 2;
  west.position.set(-1.7, 0, 1.7);
  scene.add(west);
  const east = wallWithHoles(3.4, 2.6, [[0.25, 1.35, 1.0, 2.15]], wallW);
  east.rotation.y = -Math.PI / 2;
  east.position.set(1.7, 0, -1.7);
  scene.add(east);
  const south = wallWithHoles(3.4, 2.6, [[1.0, 2.7, 0, 2.2]], wallW);
  south.position.set(-1.7, 0, 1.7);
  scene.add(south);
  box(3, 0.08, 0.02, trim, 0, 0.04, -1.69, scene, false);
  box(0.02, 0.08, 3.4, trim, -1.49, 0.04, 0, scene, false);
  box(0.02, 0.08, 3.4, trim, 1.49, 0.04, 0, scene, false);

  /* red-framed tall windows (west) */
  [-0.55, -0.05].forEach((z) => {
    const fr = M("#b23a1e", 0.6);
    box(0.06, 1.4, 0.05, fr, -1.49, 1.65, z - 0.17, scene); box(0.06, 1.4, 0.05, fr, -1.49, 1.65, z + 0.17, scene);
    box(0.06, 0.05, 0.39, fr, -1.49, 0.95, z, scene); box(0.06, 0.05, 0.39, fr, -1.49, 2.35, z, scene);
    const gl = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 1.4), new THREE.MeshStandardMaterial({ color: 0x9fc0d8, transparent: true, opacity: 0.12, roughness: 0.05, metalness: 0.1 }));
    gl.rotation.y = Math.PI / 2;
    gl.position.set(-1.49, 1.65, z);
    scene.add(gl);
  });

  /* east black window + grey curtain */
  const blk = M("#14161a", 0.5, 0.3);
  box(0.07, 0.06, 1.14, blk, 1.49, 1.0, -0.85, scene); box(0.07, 0.06, 1.14, blk, 1.49, 2.15, -0.85, scene);
  box(0.07, 1.15, 0.06, blk, 1.49, 1.575, -1.42, scene); box(0.07, 1.15, 0.06, blk, 1.49, 1.575, -0.28, scene); box(0.05, 1.12, 0.04, blk, 1.49, 1.575, -0.85, scene);
  const eg = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.12), new THREE.MeshStandardMaterial({ color: 0x9fc0d8, transparent: true, opacity: 0.1, roughness: 0.05 }));
  eg.rotation.y = -Math.PI / 2;
  eg.position.set(1.49, 1.575, -0.85);
  scene.add(eg);
  const gc = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 1.35, 12, 1), new THREE.MeshStandardMaterial({ color: 0x8b8594, roughness: 1, side: THREE.DoubleSide }));
  wave(gc, 0.035, 10);
  gc.rotation.y = -Math.PI / 2;
  gc.position.set(1.43, 1.5, -0.35);
  gc.castShadow = true;
  scene.add(gc);
  box(0.03, 0.03, 1.5, M("#ccc", 0.4, 0.8), 1.46, 2.2, -0.85, scene, false);

  /* sliding glass door (south) */
  box(1.72, 0.06, 0.08, blk, 0.15, 2.2, 1.7, scene); box(1.72, 0.04, 0.08, blk, 0.15, 0.02, 1.7, scene);
  box(0.06, 2.2, 0.08, blk, -0.7, 1.1, 1.7, scene); box(0.06, 2.2, 0.08, blk, 1.0, 1.1, 1.7, scene);
  box(0.05, 2.2, 0.08, blk, 0.2, 1.1, 1.69, scene);
  const dg = new THREE.Mesh(new THREE.PlaneGeometry(0.78, 2.15), new THREE.MeshStandardMaterial({ color: 0xa8c8dc, transparent: true, opacity: 0.1, roughness: 0.05 }));
  dg.position.set(0.6, 1.1, 1.69);
  scene.add(dg);
  box(0.03, 0.18, 0.04, M("#2a2a2a", 0.4, 0.8), 0.28, 1.0, 1.62, scene);

  /* curtains: olive (fixed), sheer (moving) */
  const olive = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 2.3, 14, 1), new THREE.MeshStandardMaterial({ color: 0x8c8a3e, roughness: 1, side: THREE.DoubleSide }));
  wave(olive, 0.05, 12);
  olive.position.set(-0.93, 1.2, 1.55);
  olive.castShadow = true;
  scene.add(olive);
  const sheer = new THREE.Mesh(
    new THREE.PlaneGeometry(0.8, 2.25, 14, 8),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, transparent: true, opacity: 0.55, side: THREE.DoubleSide, depthWrite: false }),
  );
  sheer.position.set(-0.28, 1.2, 1.6);
  scene.add(sheer);
  const sheerPos = sheer.geometry.attributes.position as THREE.BufferAttribute;
  const sp0 = (sheerPos.array as Float32Array).slice();
  R.frameHooks.push((_dt, t) => {
    if (R.reducedMotion) return;
    const ar = sheerPos.array as Float32Array;
    for (let i = 0; i < ar.length; i += 3) {
      const u = (sp0[i] + 0.4) / 0.8, v = (sp0[i + 1] + 1.125) / 2.25;
      ar[i + 2] = sp0[i + 2] + Math.sin(t * 1.6 + u * 5 + v * 2) * 0.05 * (0.4 + (1 - v)) - (1 - v) * 0.08 * Math.sin(t * 0.8);
    }
    sheerPos.needsUpdate = true;
    sheer.geometry.computeVertexNormals();
  });
  box(1.5, 0.025, 0.025, M("#222", 0.4, 0.8), -0.1, 2.38, 1.55, scene, false);

  /* desk (L along north wall) */
  const oak = new THREE.MeshStandardMaterial({ map: oakTex(), roughness: 0.6 }), white = M("#f4f3ef", 0.5);
  box(2.25, 0.04, 0.72, oak, 0.4, 0.74, -1.4, scene);
  box(0.04, 0.72, 0.68, oak, -0.7, 0.36, -1.4, scene); box(0.04, 0.72, 0.68, oak, 1.46, 0.36, -1.4, scene);
  box(1.0, 0.5, 0.03, white, 0.45, 0.46, -1.07, scene); box(0.7, 0.2, 0.5, M("#d9a76a", 0.7), 1.1, 0.5, -1.45, scene);
  box(2.2, 0.03, 0.04, oak, 0.4, 0.21, -1.7, scene);
  /* drawer unit + gaming laptop wing */
  box(0.5, 0.64, 0.55, M("#c9a070", 0.7), 1.2, 0.32, -1.38, scene);
  /* screens */
  monitor(0.62, 0.36, 0.25, 0.76, -1.5, -0.08, "code", "stack");
  monitor(0.5, 0.29, 0.92, 0.76, -1.48, -0.42, "dash", "stack");
  laptop(-0.38, 0.76, -1.22, 0.55, "term", "#15171b", "ai");
  laptop(1.28, 0.76, -1.34, -0.35, "black", "#101114", null);
  box(0.34, 0.012, 0.11, M("#9aa0a8", 0.4, 0.5), -0.05, 0.775, -1.12, scene);
  box(0.06, 0.03, 0.1, M("#111", 0.4), 0.7, 0.775, -1.2, scene);
  cyl(0.045, 0.04, 0.09, M("#f3f3f0", 0.5), 0.52, 0.8, -1.25, scene);
  const th = cyl(0.04, 0.04, 0.26, M("#1d5fa8", 0.35, 0.6), 1.12, 0.89, -1.62, scene);
  th.userData.pick = "cup";
  cyl(0.032, 0.036, 0.22, M("#9fc4e8", 0.1, 0, { transparent: true, opacity: 0.7 }), 1.43, 0.87, -1.2, scene);
  cyl(0.013, 0.013, 0.04, M("#2f7fd8", 0.4), 1.43, 1.0, -1.2, scene);
  const pot = cyl(0.06, 0.045, 0.1, M("#f2f0ec", 0.8), 1.33, 0.81, -1.55, scene);
  pot.userData.pick = "plant";
  for (let i = 0; i < 9; i++) {
    const lf = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 6), M("#7fa68a", 0.9));
    lf.position.set(1.33 + (Math.random() - 0.5) * 0.12, 0.9 + Math.random() * 0.07, -1.55 + (Math.random() - 0.5) * 0.12);
    lf.scale.set(1, 0.7, 1);
    lf.castShadow = true;
    scene.add(lf);
  }
  const hp = new THREE.Mesh(new THREE.TorusGeometry(0.085, 0.012, 8, 20, Math.PI * 1.15), M("#d9d4cc", 0.7));
  hp.position.set(0.55, 0.9, -1.38);
  hp.rotation.set(0.2, 0.3, 3.4);
  hp.castShadow = true;
  scene.add(hp);

  /* shelf stand with network gear + small monitor (west wall) */
  const sx = -1.3, sz = 0.45, wood = M("#c58f57", 0.7), metal = M("#16181b", 0.5, 0.6);
  [[-0.22, -0.16], [0.22, -0.16], [-0.22, 0.16], [0.22, 0.16]].forEach((p) => { box(0.025, 1.2, 0.025, metal, sx + p[1], 0.6, sz + p[0], scene); });
  [0.35, 0.78, 1.2].forEach((y) => { box(0.36, 0.03, 0.52, wood, sx, y, sz, scene); });
  const rt = box(0.2, 0.05, 0.14, M("#0a0a0a", 0.5), sx, 0.82, sz, scene);
  const leds: THREE.Mesh[] = [];
  for (let l = 0; l < 4; l++) {
    const led = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.008, 0.004), new THREE.MeshBasicMaterial({ color: l % 2 ? 0xffc23d : 0x3ddc84 }));
    led.position.set(sx + 0.09, 0.82 + (l % 2) * 0.014 - 0.007, sz - 0.1 + l * 0.04 - 0.02);
    led.rotation.y = Math.PI / 2;
    scene.add(led);
    leds.push(led);
  }
  pickable(rt, "infra");
  box(0.12, 0.1, 0.1, M("#222", 0.5), sx, 0.43, sz + 0.1, scene);
  monitor(0.46, 0.27, sx + 0.02, 1.215, sz, Math.PI / 2 - 0.12, "cam", "infra");

  /* floor cables */
  const cm = M("#0c0c0d", 0.6);
  const curves = [
    [[-1.2, 0.01, 0.4], [-0.9, 0.01, 0.2], [-0.6, 0.01, 0.55], [-0.4, 0.01, 0.1], [-0.2, 0.01, -0.5], [0.0, 0.3, -1.0]],
    [[-1.2, 0.01, 0.5], [-0.8, 0.01, 0.9], [-0.35, 0.01, 0.65], [-0.1, 0.01, 0.2]],
    [[-1.15, 0.01, 0.35], [-0.95, 0.01, 0.0], [-0.7, 0.01, -0.3], [-0.5, 0.01, -0.9]],
    [[-1.1, 0.01, 0.6], [-0.7, 0.01, 1.1], [-0.2, 0.01, 0.95]],
  ];
  curves.forEach((pts) => {
    const cv = new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(p[0], p[1], p[2])));
    const tube = new THREE.Mesh(new THREE.TubeGeometry(cv, 30, 0.007, 5), cm);
    tube.castShadow = true;
    scene.add(tube);
  });
  const rug = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.025, 0.52), new THREE.MeshStandardMaterial({ map: noiseTex("#d8cdb8", ["#c8bba3", "#e6dcc8"], 900, 64), roughness: 1 }));
  rug.position.set(-0.6, 0.013, 1.05);
  rug.rotation.y = 0.2;
  rug.receiveShadow = true;
  scene.add(rug);
  const cush = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 10), new THREE.MeshStandardMaterial({ map: noiseTex("#c9772f", ["#b8651f", "#dd9448", "#e9b070"], 1200, 64), roughness: 1 }));
  cush.scale.set(1.2, 0.35, 0.9);
  cush.position.set(-1.05, 0.1, 1.18);
  cush.rotation.y = 0.4;
  cush.castShadow = cush.receiveShadow = true;
  scene.add(cush);

  /* gaming chair */
  const chair = new THREE.Group();
  {
    const g = chair;
    g.position.set(1.0, 0, -0.45);
    g.rotation.y = Math.PI - 0.9;
    const cb = M("#15161a", 0.6), red = M("#c4161c", 0.55);
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      const leg = box(0.34, 0.035, 0.05, cb, Math.cos(a) * 0.17, 0.07, Math.sin(a) * 0.17, g);
      leg.rotation.y = -a;
      cyl(0.025, 0.025, 0.03, cb, Math.cos(a) * 0.33, 0.03, Math.sin(a) * 0.33, g, 10);
    }
    cyl(0.03, 0.03, 0.3, M("#777", 0.3, 0.8), 0, 0.25, 0, g, 10);
    box(0.5, 0.09, 0.5, cb, 0, 0.45, 0, g); box(0.5, 0.012, 0.08, red, 0, 0.5, 0.13, g, false);
    const back = new THREE.Group();
    back.position.set(0, 0.7, 0.24);
    back.rotation.x = 0.18;
    g.add(back);
    box(0.46, 0.68, 0.1, cb, 0, 0.1, 0, back); box(0.12, 0.62, 0.105, red, -0.2, 0.08, 0, back, false); box(0.12, 0.62, 0.105, red, 0.2, 0.08, 0, back, false);
    box(0.28, 0.2, 0.11, cb, 0, 0.5, 0, back);
    cyl(0.04, 0.04, 0.112, red, 0, 0.5, 0, back, 16).rotation.x = Math.PI / 2;
    [-0.3, 0.3].forEach((x) => { box(0.03, 0.2, 0.03, cb, x, 0.58, 0.02, g); box(0.07, 0.03, 0.3, red, x, 0.69, -0.04, g); });
    scene.add(g);
    g.userData.pick = "chair";
  }

  /* certification frame on the north wall */
  {
    const c = document.createElement("canvas");
    c.width = 780;
    c.height = 560;
    const g = c.getContext("2d")!;
    g.fillStyle = "#f7f2e8"; g.fillRect(0, 0, 780, 560);
    g.strokeStyle = "#c9b48a"; g.lineWidth = 3; g.strokeRect(34, 34, 712, 492); g.lineWidth = 1; g.strokeRect(44, 44, 692, 472);
    g.fillStyle = "#d96b2b"; g.beginPath();
    for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2, r = i % 2 ? 56 : 66; g.lineTo(390 + Math.cos(a) * r, 130 + Math.sin(a) * r); }
    g.fill();
    g.fillStyle = "#f7f2e8"; g.beginPath(); g.arc(390, 130, 38, 0, 7); g.fill();
    g.strokeStyle = "#d96b2b"; g.lineWidth = 6; g.beginPath(); g.moveTo(372, 132); g.lineTo(386, 146); g.lineTo(412, 114); g.stroke();
    g.textAlign = "center"; g.fillStyle = "#6a5f4e"; g.font = "600 20px Inter, Arial, sans-serif"; g.fillText("ANTHROPIC  ·  CERTIFICATION", 390, 228);
    g.fillStyle = "#1d1a15"; g.font = "700 46px Georgia, serif"; g.fillText("Claude Certified", 390, 292); g.fillText("Architect — Foundations", 390, 346);
    g.fillStyle = "#8a7d66"; g.font = "22px Arial"; g.fillText("awarded to", 390, 400);
    g.fillStyle = "#1d1a15"; g.font = "italic 36px Georgia, serif"; g.fillText("Nomena Nisiah", 390, 448);
    g.fillStyle = "#d96b2b"; g.font = "600 18px Arial"; g.fillText("VERIFIED ON CREDLY  ↗", 390, 494);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    const grp = new THREE.Group();
    grp.position.set(0.3, 1.9, -1.69);
    const fwood = new THREE.MeshStandardMaterial({ map: oakTex(), roughness: 0.55, color: 0xcaa271 });
    const fw = 0.8, fh = 0.58, b = 0.045;
    box(fw + b * 2, b, 0.04, fwood, 0, fh / 2 + b / 2, 0, grp); box(fw + b * 2, b, 0.04, fwood, 0, -fh / 2 - b / 2, 0, grp);
    box(b, fh, 0.04, fwood, -fw / 2 - b / 2, 0, 0, grp); box(b, fh, 0.04, fwood, fw / 2 + b / 2, 0, 0, grp);
    const pic = new THREE.Mesh(new THREE.PlaneGeometry(fw, fh), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.6, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: 0.0 }));
    pic.position.z = 0.012;
    grp.add(pic);
    pickable(pic, "cert");
    scene.add(grp);
  }

  R.pickRoots = R.pickables.concat([th, pot, chair]);

  /* dust motes in the light */
  const mp = new Float32Array(70 * 3), mv: number[] = [];
  for (let d = 0; d < 70; d++) {
    mp[d * 3] = -0.8 + Math.random() * 1.8;
    mp[d * 3 + 1] = 0.3 + Math.random() * 1.8;
    mp[d * 3 + 2] = 0.2 + Math.random() * 1.4;
    mv.push(Math.random() * 6);
  }
  const mg = new THREE.BufferGeometry();
  mg.setAttribute("position", new THREE.BufferAttribute(mp, 3));
  R.motes = new THREE.Points(mg, new THREE.PointsMaterial({ color: 0xfff4d6, size: 2.2, sizeAttenuation: false, transparent: true, opacity: 0, depthWrite: false }));
  scene.add(R.motes);
  R.frameHooks.push((_dt, t) => {
    const a = mg.attributes.position as THREE.BufferAttribute;
    const ar = a.array as Float32Array;
    for (let i = 0; i < 70; i++) {
      ar[i * 3 + 1] += Math.sin(t * 0.3 + mv[i]) * 0.0007;
      ar[i * 3] += Math.cos(t * 0.2 + mv[i]) * 0.0006;
    }
    a.needsUpdate = true;
    for (let l = 0; l < leds.length; l++) leds[l].visible = Math.sin(t * (3 + l * 1.3) + l) > -0.4;
  });
}
