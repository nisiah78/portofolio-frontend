/* Renderer, sky, exterior, lighting, time & weather — ported from docs/v2/room-env.js. */
import * as THREE from "three";
import { buildInterior } from "./interior";
import { mergeStatic } from "./optimize";
import { createTour } from "./tour";
import type { Room, RoomState, Weather } from "./types";
import { C, clamp, noiseTex, radialTex, smooth } from "./util";

const PAL = {
  nightTop: C("#050a1c"),
  nightHor: C("#141c3e"),
  dayTop: C("#2f7fd8"),
  dayHor: C("#bfe0f4"),
  twiTop: C("#4b5b97"),
  twiHor: C("#ff8f52"),
  grey: C("#9aa4b0"),
};

export interface RoomOptions {
  hour?: number;
  weather?: Weather;
  reducedMotion?: boolean;
}

/** Builds the whole office scene on `canvas` and starts its render loop. */
export function createRoom(canvas: HTMLCanvasElement, opts: RoomOptions = {}): Room {
  const abort = new AbortController();
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
  /* Adaptive resolution: start at the best tier, step down while the GPU can't keep up. */
  const dpr = window.devicePixelRatio || 1;
  const qualityTiers = [...new Set([Math.min(dpr, 1.6), Math.min(dpr, 1.25), 1])];
  let tier = 0;
  renderer.setPixelRatio(qualityTiers[tier]);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  // Everything that casts a shadow is static: the shadow map is only re-rendered when the sun moves.
  renderer.shadowMap.autoUpdate = false;
  renderer.shadowMap.needsUpdate = true;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xbfe0f4, 16, 90);
  const fog = scene.fog as THREE.Fog;
  const camera = new THREE.PerspectiveCamera(46, 1.6, 0.05, 300);
  const heroCam = { pos: new THREE.Vector3(1.38, 1.5, 1.52), target: new THREE.Vector3(-0.5, 0.95, -0.85) };
  camera.position.copy(heroCam.pos);

  /* lights */
  const hemi = new THREE.HemisphereLight(0xbfe0f4, 0x7a6a58, 0.9);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xfff1d8, 3);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  const sc = sun.shadow.camera;
  sc.left = -4; sc.right = 4; sc.top = 4; sc.bottom = -4; sc.near = 1; sc.far = 40;
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.03;
  sun.shadow.radius = 4;
  scene.add(sun);
  scene.add(sun.target);
  const moonLight = new THREE.DirectionalLight(0x8fa8ff, 0.0);
  moonLight.position.set(0.5, 8, 9);
  scene.add(moonLight);
  const lamp = new THREE.PointLight(0xffd9a8, 0, 0, 2);
  lamp.position.set(0, 2.35, -0.1);
  scene.add(lamp);
  const screenGlow = new THREE.PointLight(0x86b4ff, 1.4, 0, 2);
  screenGlow.position.set(0.45, 1.15, -0.95);
  scene.add(screenGlow);

  const state: RoomState = { hour: 13, weather: opts.weather ?? "auto", cloud: 0.3, day: 1, time: 0, sinE: 1 };
  let raf = 0;
  let paused = false;
  let destroyed = false;
  let tween: { from: number; to: number; t: number; dur: number } | null = null;

  const room = {
    canvas, renderer, scene, camera, heroCam, hemi, sun, moonLight, lamp, screenGlow, state,
    frameHooks: [],
    pointerN: { x: 0, y: 0, sx: 0, sy: 0 },
    mode: "hero",
    heroOffset: 0.14,
    curOff: null,
    tourFov: 70,
    viewW: 0,
    viewH: 0,
    reducedMotion: !!opts.reducedMotion,
    signal: abort.signal,
    pickables: [],
    pickRoots: [],
    onTime: null,
  } as unknown as Room;

  /* ---------------- sky ---------------- */
  const skyU = {
    top: { value: C("#2f7fd8") },
    hor: { value: C("#bfe0f4") },
    sunDir: { value: new THREE.Vector3(0, 1, 0) },
    sunCol: { value: C("#fff1d8") },
    glow: { value: 0.5 },
  };
  const skyMesh = new THREE.Mesh(
    new THREE.SphereGeometry(150, 32, 16),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      uniforms: skyU,
      vertexShader:
        "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }",
      fragmentShader:
        "uniform vec3 top; uniform vec3 hor; uniform vec3 sunDir; uniform vec3 sunCol; uniform float glow; varying vec3 vP;" +
        "void main(){ float h = clamp(vP.y,0.0,1.0); vec3 c = mix(hor, top, pow(h,0.55));" +
        " float s = max(dot(normalize(vP), normalize(sunDir)),0.0); c += sunCol * (pow(s,24.0)*0.45 + pow(s,400.0)*1.4) * glow;" +
        " if(vP.y<0.0) c = hor*0.85; gl_FragColor = vec4(c,1.0);\n#include <colorspace_fragment>\n}",
    }),
  );
  skyMesh.renderOrder = -10;
  scene.add(skyMesh);
  const sunSprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: radialTex([[0, "rgba(255,250,235,1)"], [0.18, "rgba(255,240,200,0.95)"], [0.4, "rgba(255,210,150,0.25)"], [1, "rgba(255,200,120,0)"]], 256),
      depthWrite: false, fog: false, transparent: true,
    }),
  );
  sunSprite.scale.set(46, 46, 1);
  scene.add(sunSprite);
  const moonSprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: radialTex([[0, "rgba(240,244,255,1)"], [0.16, "rgba(225,232,255,0.95)"], [0.22, "rgba(180,200,255,0.3)"], [1, "rgba(150,170,255,0)"]], 256),
      depthWrite: false, fog: false, transparent: true,
    }),
  );
  moonSprite.scale.set(22, 22, 1);
  scene.add(moonSprite);
  const sp = new Float32Array(900 * 3);
  for (let i = 0; i < 900; i++) {
    const u = Math.random() * Math.PI * 2, v = Math.acos(Math.random() * 0.92 + 0.04);
    sp[i * 3] = 140 * Math.sin(v) * Math.cos(u);
    sp[i * 3 + 1] = 140 * Math.cos(v);
    sp[i * 3 + 2] = 140 * Math.sin(v) * Math.sin(u);
  }
  const sg = new THREE.BufferGeometry();
  sg.setAttribute("position", new THREE.BufferAttribute(sp, 3));
  const stars = new THREE.Points(
    sg,
    new THREE.PointsMaterial({ color: 0xffffff, size: 1.6, sizeAttenuation: false, transparent: true, opacity: 0, depthWrite: false, fog: false }),
  );
  scene.add(stars);
  const ct = radialTex([[0, "rgba(255,255,255,0.95)"], [0.5, "rgba(255,255,255,0.55)"], [1, "rgba(255,255,255,0)"]], 128);
  const clouds: THREE.Sprite[] = [];
  for (let k = 0; k < 14; k++) {
    const m = new THREE.Sprite(new THREE.SpriteMaterial({ map: ct, transparent: true, depthWrite: false, fog: false, opacity: 0.8 }));
    const ang = Math.random() * Math.PI * 2, rad = 60 + Math.random() * 60;
    m.position.set(Math.cos(ang) * rad, 20 + Math.random() * 38, Math.sin(ang) * rad);
    const s = 26 + Math.random() * 40;
    m.scale.set(s * 1.8, s * 0.7, 1);
    m.userData.sp = 0.4 + Math.random() * 0.8;
    m.userData.base = 0.35 + Math.random() * 0.65;
    scene.add(m);
    clouds.push(m);
  }
  const rp = new Float32Array(700 * 6);
  for (let r = 0; r < 700; r++) {
    const x = -7 + Math.random() * 14, y = Math.random() * 9, z = 1.9 + Math.random() * 7;
    rp.set([x, y, z, x - 0.02, y - 0.35, z], r * 6);
  }
  const rg = new THREE.BufferGeometry();
  rg.setAttribute("position", new THREE.BufferAttribute(rp, 3));
  const rain = new THREE.LineSegments(rg, new THREE.LineBasicMaterial({ color: 0xcfe0ff, transparent: true, opacity: 0.0, fog: false }));
  rain.frustumCulled = false;
  scene.add(rain);

  /* ---------------- exterior (terrace, parapet, hills & houses) ---------------- */
  {
    const conc = noiseTex("#b4afa5", ["#a29d93", "#c4bfb5", "#9a958b"], 900, 128);
    conc.repeat.set(6, 4);
    const terr = new THREE.Mesh(new THREE.BoxGeometry(7, 0.2, 3.4), new THREE.MeshStandardMaterial({ map: conc, roughness: 0.95 }));
    terr.position.set(0, -0.11, 3.6);
    terr.receiveShadow = true;
    scene.add(terr);
    const grass = noiseTex("#4f9a35", ["#3f8a2b", "#63b044", "#2f7a22", "#78c050"], 2600, 128);
    grass.repeat.set(5, 3);
    const gp = new THREE.Mesh(new THREE.BoxGeometry(3.3, 0.04, 1.7), new THREE.MeshStandardMaterial({ map: grass, roughness: 1 }));
    gp.position.set(0.2, -0.0, 3.55);
    gp.receiveShadow = true;
    scene.add(gp);
    const wallM = new THREE.MeshStandardMaterial({ color: 0xf1ede6, roughness: 0.9 });
    const par = new THREE.Mesh(new THREE.BoxGeometry(7, 1.0, 0.18), wallM);
    par.position.set(0, 0.4, 5.3);
    par.castShadow = par.receiveShadow = true;
    scene.add(par);
    const parL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.0, 3.4), wallM);
    parL.position.set(-3.5, 0.4, 3.6);
    parL.castShadow = parL.receiveShadow = true;
    scene.add(parL);
    const parR = parL.clone();
    parR.position.x = 3.5;
    scene.add(parR);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.MeshStandardMaterial({ color: 0x6f8a52, roughness: 1 }));
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -9;
    scene.add(ground);
    const N = 170;
    const bodyG = new THREE.BoxGeometry(1, 1, 1), roofG = new THREE.ConeGeometry(0.78, 0.55, 4);
    roofG.rotateY(Math.PI / 4);
    const bodies = new THREE.InstancedMesh(bodyG, new THREE.MeshStandardMaterial({ roughness: 0.95 }), N);
    const roofs = new THREE.InstancedMesh(roofG, new THREE.MeshStandardMaterial({ roughness: 0.9 }), N);
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), p = new THREE.Vector3(), s = new THREE.Vector3(), col = new THREE.Color();
    const bodyCols = ["#efe6d6", "#e7d3b5", "#d9b99a", "#f2f0ea", "#cfa98a", "#e9dcc4"];
    const roofCols = ["#b8452c", "#c9552f", "#a63d28", "#2f6c96", "#c25a35"];
    let seed = 7;
    const rnd = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    for (let i = 0; i < N; i++) {
      const ang = (rnd() - 0.5) * 2.6, dist = 28 + rnd() * 70;
      const x = Math.sin(ang) * dist, z = 8 + Math.cos(ang) * dist * 0.9;
      const y = -9 + (dist - 26) * 0.12 + rnd() * 3, w = 2.2 + rnd() * 2.4, h = 2 + rnd() * 2.6, d = 2.2 + rnd() * 2;
      q.setFromEuler(new THREE.Euler(0, rnd() * 0.5, 0));
      p.set(x, y + h / 2, z); s.set(w, h, d); m4.compose(p, q, s); bodies.setMatrixAt(i, m4);
      bodies.setColorAt(i, col.set(bodyCols[(rnd() * bodyCols.length) | 0]));
      p.set(x, y + h + 0.27 * Math.max(w, d) * 0.7, z); s.set(w * 1.18, Math.max(w, d) * 0.55, d * 1.18); m4.compose(p, q, s); roofs.setMatrixAt(i, m4);
      roofs.setColorAt(i, col.set(roofCols[(rnd() * roofCols.length) | 0]));
    }
    scene.add(bodies);
    scene.add(roofs);
    const tg = new THREE.IcosahedronGeometry(1.4, 1);
    const tm = new THREE.MeshStandardMaterial({ color: 0x3f7a35, roughness: 1, flatShading: true });
    const trees = new THREE.InstancedMesh(tg, tm, 90);
    for (let j = 0; j < 90; j++) {
      const a2 = (rnd() - 0.5) * 2.8, d2 = 14 + rnd() * 80;
      p.set(Math.sin(a2) * d2, -9 + (d2 - 20) * 0.12 + 1.2 + rnd(), 7 + Math.cos(a2) * d2 * 0.9);
      const sc2 = 0.8 + rnd() * 1.6;
      s.set(sc2, sc2 * (0.9 + rnd() * 0.5), sc2); q.identity(); m4.compose(p, q, s); trees.setMatrixAt(j, m4);
    }
    scene.add(trees);
  }

  /* ---------------- time of day & weather ---------------- */
  const tmpA = new THREE.Color(), tmpB = new THREE.Color();
  function weatherCloud() {
    const w = state.weather;
    if (w === "cloudy") return 0.85;
    if (w === "rain") return 1;
    if (w === "clear") return 0.12;
    return 0.32;
  }
  room.applyTime = (h) => {
    state.hour = h;
    const a = (Math.PI * (h - 6)) / 12, e = 1.22 * Math.sin(a), sinE = Math.sin(e), cosE = Math.cos(e);
    const dir = new THREE.Vector3(Math.cos(a) * cosE, sinE, Math.sin(a) * cosE).normalize();
    state.sinE = sinE;
    const dayF = smooth(-0.06, 0.2, sinE), twi = Math.exp(-Math.pow((sinE - 0.03) / 0.17, 2)), cl = weatherCloud();
    state.day = dayF;
    state.cloud = cl;
    const top = tmpA.copy(PAL.nightTop).lerp(PAL.dayTop, dayF).lerp(PAL.twiTop, twi * 0.6);
    const hor = tmpB.copy(PAL.nightHor).lerp(PAL.dayHor, dayF).lerp(PAL.twiHor, twi * 0.85);
    const grey = PAL.grey.clone().multiplyScalar(0.25 + 0.75 * dayF);
    top.lerp(grey, cl * 0.65);
    hor.lerp(grey, cl * 0.55);
    skyU.top.value.copy(top);
    skyU.hor.value.copy(hor);
    skyU.sunDir.value.copy(dir);
    const sunCol = C("#fff3dc").lerp(C("#ff9d55"), clamp(twi * 1.2, 0, 1));
    skyU.sunCol.value.copy(sunCol);
    skyU.glow.value = (0.2 + 0.8 * dayF) * (1 - cl * 0.8);
    fog.color.copy(hor);
    fog.near = 18 - cl * 8;
    fog.far = 95 - cl * 40;
    sun.position.copy(dir.clone().multiplyScalar(18));
    renderer.shadowMap.needsUpdate = true;
    sun.target.position.set(0, 0.6, 0.5);
    sun.target.updateMatrixWorld();
    sun.color.copy(sunCol);
    sun.intensity = 3.4 * smooth(0.0, 0.14, sinE) * (1 - cl * 0.82);
    hemi.color.copy(hor).lerp(C("#ffffff"), 0.6);
    hemi.groundColor.set("#6e5f50");
    hemi.intensity = 0.07 + 1.35 * dayF * (1 + 0.25 * cl);
    moonLight.intensity = 0.55 * (1 - dayF) * (1 - cl * 0.6);
    lamp.intensity = 2.4 * (1 - smooth(0.0, 0.25, sinE));
    screenGlow.intensity = 0.6 + 0.9 * (1 - dayF);
    renderer.toneMappingExposure = 1.1 + 0.15 * (1 - dayF);
    sunSprite.position.copy(dir).multiplyScalar(120);
    sunSprite.material.opacity = smooth(-0.1, 0.05, sinE) * (1 - cl * 0.85);
    const md = new THREE.Vector3(-Math.cos(a) * 0.9 - 0.2, Math.max(0.25, -sinE * 1.1 + 0.3), -Math.sin(a) * 0.5 + 0.8).normalize();
    moonSprite.position.copy(md).multiplyScalar(120);
    moonSprite.material.opacity = (1 - dayF) * (1 - cl * 0.8);
    stars.material.opacity = (1 - smooth(-0.08, 0.1, sinE)) * (1 - cl * 0.9);
    rain.material.opacity = state.weather === "rain" ? 0.38 : 0;
    const cc = C("#ffffff").lerp(C("#ff9a6a"), twi * 0.7).multiplyScalar(0.2 + 0.8 * dayF + 0.08);
    for (const c of clouds) {
      c.material.color.copy(cc).lerp(C("#8892a0"), cl * 0.5 * dayF);
      c.userData.vis = clamp(cl * 1.3 - (1 - c.userData.base) * 0.55 + 0.05, 0, 1);
      c.material.opacity = c.userData.vis * (0.25 + 0.7 * (dayF + twi * 0.6));
    }
    if (room.ceilMat) room.ceilMat.emissive.setScalar(0.04 + 0.3 * dayF);
    room.onTime?.(state);
  };

  room.setWeather = (w) => {
    state.weather = w || "auto";
    room.applyTime(state.hour);
  };
  room.setHour = (h, animate) => {
    if (!animate || room.reducedMotion) {
      tween = null;
      room.applyTime(h);
      return;
    }
    tween = { from: state.hour, to: h, t: 0, dur: 1.7 };
  };
  function tweenStep(dt: number) {
    const tw = tween!;
    tw.t += dt;
    let k = clamp(tw.t / tw.dur, 0, 1);
    k = k * k * (3 - 2 * k);
    room.applyTime(tw.from + (tw.to - tw.from) * k);
    if (tw.t >= tw.dur) tween = null;
  }
  function envFrame(dt: number) {
    for (const c of clouds) {
      c.position.x += c.userData.sp * dt * 0.8;
      if (c.position.x > 130) c.position.x = -130;
    }
    if (rain.material.opacity > 0) {
      const a = rain.geometry.attributes.position as THREE.BufferAttribute;
      const arr = a.array as Float32Array;
      for (let r = 0; r < arr.length; r += 6) {
        const dy = 14 * dt;
        arr[r + 1] -= dy;
        arr[r + 4] -= dy;
        if (arr[r + 4] < -1) {
          arr[r + 1] += 10;
          arr[r + 4] += 10;
        }
      }
      a.needsUpdate = true;
    }
    if (room.motes) room.motes.material.opacity = 0.55 * clamp(sun.intensity / 3, 0, 1);
  }

  function heroCamFrame(dt: number) {
    const p = room.pointerN;
    const b = heroCam;
    if (room.reducedMotion) {
      camera.position.copy(b.pos);
      camera.lookAt(b.target);
      return;
    }
    p.sx += (p.x - p.sx) * Math.min(1, dt * 3.2);
    p.sy += (p.y - p.sy) * Math.min(1, dt * 3.2);
    const t = state.time;
    camera.position.set(
      b.pos.x + p.sx * 0.28 + Math.sin(t * 0.3) * 0.015,
      b.pos.y - p.sy * 0.1 + Math.sin(t * 0.4) * 0.008,
      b.pos.z - p.sx * 0.06,
    );
    camera.lookAt(b.target.x + p.sx * 0.35, b.target.y + p.sy * 0.14, b.target.z);
  }

  /* Hero view is shifted right on wide screens so the room sits beside the copy. */
  function applyOffset(off: number) {
    room.curOff = off;
    if (!room.viewW) return;
    if (off > 0.001 && room.viewW > 900) camera.setViewOffset(room.viewW, room.viewH, -room.viewW * off, 0, room.viewW, room.viewH);
    else camera.clearViewOffset();
  }

  room.resize = () => {
    const parent = canvas.parentElement;
    const w = canvas.clientWidth || parent?.clientWidth || 1280;
    const h = canvas.clientHeight || parent?.clientHeight || 800;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    room.viewW = w;
    room.viewH = h;
    if (room.mode === "hero") applyOffset(w > 900 ? room.heroOffset : 0);
    else camera.clearViewOffset();
    camera.fov = room.mode === "hero" ? (w < 700 ? 74 : 60) : room.tourFov || 70;
    camera.updateProjectionMatrix();
  };

  let last = performance.now();
  let frameEma = 16.7;
  let started = false;

  /* Frame pacing watchdog: average rAF interval over ~1.5 s windows. Sustained slow windows
     drop a resolution tier; a long run of healthy ones (8 windows) climbs back, at most twice. */
  let winStart = 0, winFrames = 0, slowWins = 0, goodWins = 0, upgrades = 0, prevTick = 0;
  function watchQuality(now: number) {
    if (prevTick && now - prevTick > 250) {
      // tab switch, pause or a one-off hitch: start a fresh window
      winStart = now;
      winFrames = 0;
    }
    prevTick = now;
    if (!winStart) winStart = now;
    winFrames++;
    const span = now - winStart;
    if (span < 1500) return;
    const avg = span / winFrames;
    winStart = now;
    winFrames = 0;
    if (avg > 1000 / 45) {
      goodWins = 0;
      if (++slowWins >= 2 && tier < qualityTiers.length - 1) {
        slowWins = 0;
        setTier(tier + 1);
      }
    } else {
      slowWins = 0;
      if (avg < 1000 / 57 && ++goodWins >= 8 && tier > 0 && upgrades < 2) {
        goodWins = 0;
        upgrades++;
        setTier(tier - 1);
      }
    }
  }
  function setTier(next: number) {
    tier = next;
    renderer.setPixelRatio(qualityTiers[tier]);
    room.resize();
  }

  function loop(now: number) {
    raf = 0;
    if (destroyed || paused) return;
    raf = requestAnimationFrame(loop);
    watchQuality(now);
    frameEma += (Math.min(now - last, 250) - frameEma) * 0.1;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    state.time += dt;
    if (tween) tweenStep(dt);
    envFrame(dt);
    for (const hook of room.frameHooks) hook(dt, state.time);
    if (room.mode === "hero") heroCamFrame(dt);
    renderer.render(scene, camera);
  }

  room.setPaused = (p) => {
    if (destroyed || p === paused) return;
    paused = p;
    if (!p && !raf && started) {
      last = performance.now();
      raf = requestAnimationFrame(loop);
    }
  };

  room.destroy = () => {
    if (destroyed) return;
    destroyed = true;
    cancelAnimationFrame(raf);
    abort.abort();
    const textures = new Set<THREE.Texture>();
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      mesh.geometry?.dispose();
      const mats = mesh.material ? (Array.isArray(mesh.material) ? mesh.material : [mesh.material]) : [];
      for (const m of mats) {
        for (const v of Object.values(m)) if (v instanceof THREE.Texture) textures.add(v);
        m.dispose();
      }
    });
    textures.forEach((t) => t.dispose());
    renderer.dispose();
    renderer.forceContextLoss();
  };

  buildInterior(room);
  const batch = mergeStatic(scene);
  room.tour = createTour(room, applyOffset);
  room.applyTime(opts.hour ?? 13);
  room.resize();

  room.stats = () => ({
    fps: Math.round(1000 / frameEma),
    frameMs: Math.round(frameEma * 10) / 10,
    calls: renderer.info.render.calls,
    triangles: renderer.info.render.triangles,
    dpr: qualityTiers[tier],
    meshes: batch,
  });
  // The canvas box changes on window resize and when the tour pins it full-screen.
  const ro = new ResizeObserver(() => room.resize());
  ro.observe(canvas);
  abort.signal.addEventListener("abort", () => ro.disconnect());
  /* Compile every shader off the critical path (KHR_parallel_shader_compile when available),
     then start rendering: no first-frame freeze, and the canvas can fade in on a finished image. */
  room.ready = renderer
    .compileAsync(scene, camera)
    .catch(() => undefined)
    .then(() => {
      if (destroyed) return;
      started = true;
      last = performance.now();
      if (!paused && !raf) raf = requestAnimationFrame(loop);
    });
  return room;
}
