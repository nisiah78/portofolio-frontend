/* Shared helpers for the office scene. */
import * as THREE from "three";

export const C = (h: THREE.ColorRepresentation) => new THREE.Color(h);
export const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));
export const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

export function radialTex(stops: [number, string][], size = 128) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  const h = c.width / 2;
  const gr = g.createRadialGradient(h, h, 0, h, h, h);
  stops.forEach((s) => gr.addColorStop(s[0], s[1]));
  g.fillStyle = gr;
  g.fillRect(0, 0, c.width, c.width);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function noiseTex(base: string, speck: string[], n: number, size = 128) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  g.fillStyle = base;
  g.fillRect(0, 0, c.width, c.height);
  for (let i = 0; i < n; i++) {
    g.fillStyle = speck[i % speck.length];
    g.fillRect(Math.random() * c.width, Math.random() * c.height, 1 + Math.random() * 2, 1 + Math.random() * 3);
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
