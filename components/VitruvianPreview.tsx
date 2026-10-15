"use client";

import { Component, Suspense, useMemo, useEffect, type ReactNode, type ErrorInfo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { FaceDesign3D } from "./Head3DViewer";
import Head3DViewer from "./Head3DViewer";

// Trial source: VitruvianGodot, CC0 character assets. Remote CDN only for testing.
// A validated model should eventually be checked into our own asset hosting.
const HEAD_URL = "https://cdn.jsdelivr.net/gh/ibrews/VitruvianGodot@main/godot_project/vitruvian_head.glb";

function VitruvianModel({ design }: { design: FaceDesign3D }) {
  const gltf = useGLTF(HEAD_URL);
  const model = useMemo(() => {
    const scene = gltf.scene.clone(true);
    const bounds = new THREE.Box3().setFromObject(scene);
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());
    const largest = Math.max(size.x, size.y, size.z);
    if (!Number.isFinite(largest) || largest < 0.0001) throw new Error("Invalid GLB bounds");
    // Recenter the head; normalize dimensions rather than assuming export units.
    const factor = 2.4 / largest;
    scene.position.copy(center).multiplyScalar(-factor);
    scene.scale.setScalar(factor);
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.frustumCulled = false;
        object.geometry = object.geometry.clone();
        object.userData.originalPositions = new Float32Array(object.geometry.getAttribute("position").array);
        object.geometry.computeBoundingBox();
        object.userData.originalBounds = object.geometry.boundingBox!.clone();
      }
    });
    const wrapper = new THREE.Group();
    wrapper.add(scene);
    return wrapper;
  }, [gltf.scene]);

  useEffect(() => {
    const meshes: THREE.Mesh[] = [];
    model.traverse((object) => {
      if (object instanceof THREE.Mesh && object.geometry?.getAttribute("position")) meshes.push(object);
    });
    const main = meshes.sort((a, b) => b.geometry.getAttribute("position").count - a.geometry.getAttribute("position").count)[0];
    if (!main) return;
    const geo = main.geometry;
    const box = main.userData.originalBounds as THREE.Box3;
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const positions = geo.getAttribute("position") as THREE.BufferAttribute;
    const original = main.userData.originalPositions as Float32Array;
    const face = (design.face - 50) / 50;
    const jaw = (design.jaw - 50) / 50;
    const chin = (design.chin - 50) / 50;
    const nose = (design.nose - 50) / 50;
    const eyes = (design.eyes - 50) / 50;
    const hx = Math.max(size.x / 2, 0.001), hy = Math.max(size.y / 2, 0.001);
    const hz = Math.max(size.z / 2, 0.001);
    for (let i = 0; i < positions.count; i++) {
      const x = original[3*i], y = original[3*i+1], z = original[3*i+2];
      const nx = (x - center.x) / hx, ny = (y - center.y) / hy;
      const nz = (z - center.z) / hz;
      const lower = 1 - THREE.MathUtils.smoothstep(ny, -0.6, 0.3);
      const tip = 1 - THREE.MathUtils.smoothstep(ny, -0.95, -0.55);
      const centre = Math.exp(-Math.pow(nx / 0.26, 2));
      const middle = Math.exp(-Math.pow(ny / 0.35, 2));
      const eyeZone = Math.exp(-Math.pow((ny - 0.22) / 0.18, 2)) *
        Math.exp(-Math.pow((Math.abs(nx) - 0.39) / 0.22, 2));
      const width = 1 + 0.12*face + 0.12*jaw*lower - 0.06*chin*tip;
      const dx = Math.sign(nx)*eyes*eyeZone*hx*0.09 + nx*nose*centre*middle*hx*0.035;
      const dz = nose*centre*middle*Math.max(0,nz)*hz*0.10;
      positions.setXYZ(i, x*width+dx, y, z+dz);
    }
    positions.needsUpdate = true;
    geo.computeVertexNormals();
    geo.computeBoundingSphere();
  }, [model, design.face, design.jaw, design.chin, design.nose, design.eyes]);
  return <primitive object={model} />;
}

class LoadBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Vitruvian model failed to load", error, info.componentStack);
  }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

function Scene({ design }: { design: FaceDesign3D }) {
  return (
    <div style={{ width: "100%", height: 410, touchAction: "pan-y" }}>
      <Canvas camera={{ position: [0, 0.05, 4.0], fov: 39 }} dpr={[1, 1.6]} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={1.9} />
        <directionalLight position={[2, 3, 5]} intensity={2.5} />
        <directionalLight position={[-3, 2, -2]} intensity={1.3} />
        <VitruvianModel design={design} />
        <OrbitControls enableDamping enablePan={false} minDistance={2.1} maxDistance={7} />
      </Canvas>
    </div>
  );
}

export default function VitruvianPreview({ design }: { design: FaceDesign3D }) {
  return (
    <LoadBoundary fallback={
      <div>
        <p role="alert" style={{ padding: "8px 15px", color: "#9f1239", fontSize: 13 }}>
          Vitruvian could not be downloaded. The original prototype is shown instead.
        </p>
        <Head3DViewer design={design} />
      </div>
    }>
      <Suspense fallback={
        <div role="status" style={{ height: 410, display: "grid", placeItems: "center" }}>
          Loading Vitruvian 3D head…
        </div>
      }>
        <Scene design={design} />
      </Suspense>
    </LoadBoundary>
  );
}
