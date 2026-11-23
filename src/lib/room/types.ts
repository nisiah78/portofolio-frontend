import type * as THREE from "three";

export type Weather = "auto" | "clear" | "cloudy" | "rain";
export type RoomMode = "hero" | "tour";
/** Tour stops in keyboard order (1-6). Kept free of three.js so UI code can import it cheaply. */
export const STATION_IDS = ["entry", "desk", "cert", "infra", "windows", "terrace"] as const;
export type StationId = (typeof STATION_IDS)[number];
export type PickId = "stack" | "ai" | "infra" | "cert" | "cup" | "plant" | "chair";

export type FrameHook = (dt: number, t: number) => void;

export interface RoomState {
  hour: number;
  weather: Weather;
  cloud: number;
  day: number;
  time: number;
  sinE: number;
}

export interface TourEvents {
  change: StationId;
  pick: PickId;
  mode: boolean;
}

export interface Tour {
  readonly stations: readonly StationId[];
  current: StationId;
  active: boolean;
  on<K extends keyof TourEvents>(event: K, fn: (arg: TourEvents[K]) => void): void;
  enter(): void;
  exit(): void;
  goTo(id: StationId): void;
  /** Attaches drag / pick / wheel / arrow-key input to the canvas. */
  bind(canvas: HTMLCanvasElement): void;
  /** Hero parallax driven from the page (the canvas sits behind the UI). */
  pointerFromWindow(ev: PointerEvent): void;
}

export interface RoomStats {
  fps: number;
  frameMs: number;
  calls: number;
  triangles: number;
  dpr: number;
  meshes: { before: number; after: number };
}

export interface Room {
  canvas: HTMLCanvasElement;
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  heroCam: { pos: THREE.Vector3; target: THREE.Vector3 };
  hemi: THREE.HemisphereLight;
  sun: THREE.DirectionalLight;
  moonLight: THREE.DirectionalLight;
  lamp: THREE.PointLight;
  screenGlow: THREE.PointLight;
  state: RoomState;
  frameHooks: FrameHook[];
  pointerN: { x: number; y: number; sx: number; sy: number };
  mode: RoomMode;
  heroOffset: number;
  curOff: number | null;
  tourFov: number;
  viewW: number;
  viewH: number;
  reducedMotion: boolean;
  /** Aborted on destroy — every DOM listener the scene adds is tied to it. */
  signal: AbortSignal;
  pickables: THREE.Object3D[];
  pickRoots: THREE.Object3D[];
  ceilMat?: THREE.MeshStandardMaterial;
  motes?: THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>;
  onTime: ((st: RoomState) => void) | null;
  tour: Tour;
  applyTime(h: number): void;
  setWeather(w: Weather): void;
  setHour(h: number, animate?: boolean): void;
  resize(): void;
  setPaused(paused: boolean): void;
  destroy(): void;
  /** Resolves once shaders are compiled and the render loop has started. */
  ready: Promise<void>;
  stats(): RoomStats;
}
