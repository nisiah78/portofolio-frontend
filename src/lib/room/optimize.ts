/* Static-geometry batching: the office is ~140 small meshes, i.e. ~140 draw calls per frame.
   Everything that never moves and isn't clickable is baked into world space and merged per
   material, which cuts draw calls (and per-object CPU work) several-fold with an identical image. */
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

/** Where a static mesh may be merged into, or null if it must stay as it is.
    Parts of a clickable group (e.g. the chair) merge inside that group, so picking still works. */
function containerFor(mesh: THREE.Mesh, scene: THREE.Scene): THREE.Object3D | null {
  const mat = mesh.material;
  if (Array.isArray(mat) || mat.transparent || !(mesh.geometry instanceof THREE.BufferGeometry)) return null;
  if ((mesh as THREE.InstancedMesh).isInstancedMesh || mesh.renderOrder !== 0) return null;
  if (mesh.userData.pick) return null;
  let container: THREE.Object3D = scene;
  for (let o: THREE.Object3D | null = mesh; o; o = o.parent) {
    if (o.userData.dynamic) return null;
    if (o !== mesh && o.userData.pick && container === scene) container = o;
  }
  return container;
}

export function mergeStatic(scene: THREE.Scene): { before: number; after: number } {
  scene.updateMatrixWorld(true);
  const groups = new Map<string, { container: THREE.Object3D; meshes: THREE.Mesh[] }>();
  let before = 0;
  scene.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    before++;
    const container = containerFor(mesh, scene);
    if (!container) return;
    const mat = mesh.material as THREE.Material;
    const key = `${container.uuid}|${mat.uuid}|${mesh.castShadow ? 1 : 0}${mesh.receiveShadow ? 1 : 0}`;
    const entry = groups.get(key);
    if (entry) entry.meshes.push(mesh);
    else groups.set(key, { container, meshes: [mesh] });
  });

  let merged = 0;
  const toLocal = new THREE.Matrix4();
  for (const { container, meshes: list } of groups.values()) {
    if (list.length < 2) continue;
    toLocal.copy(container.matrixWorld).invert();
    const geos = list.map((m) => {
      const g = m.geometry.index ? m.geometry.toNonIndexed() : m.geometry.clone();
      for (const name of Object.keys(g.attributes)) {
        if (name !== "position" && name !== "normal" && name !== "uv") g.deleteAttribute(name);
      }
      return g.applyMatrix4(new THREE.Matrix4().multiplyMatrices(toLocal, m.matrixWorld));
    });
    const geo = mergeGeometries(geos, false);
    geos.forEach((g) => g.dispose());
    if (!geo) continue; // incompatible attributes: leave these meshes as they are
    const first = list[0];
    const batch = new THREE.Mesh(geo, first.material);
    batch.castShadow = first.castShadow;
    batch.receiveShadow = first.receiveShadow;
    batch.matrixAutoUpdate = false;
    container.add(batch);
    for (const m of list) m.removeFromParent();
    merged += list.length - 1;
  }
  return { before, after: before - merged };
}
