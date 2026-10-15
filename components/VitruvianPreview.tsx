"use client";

import { Component, Suspense, useMemo, type ReactNode, type ErrorInfo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { FaceDesign3D } from "./Head3DViewer";
import Head3DViewer from "./Head3DViewer";

// Trial source: VitruvianGodot, CC0 character assets. Remote CDN only for testing.
// A validated model should eventually be checked into our own asset hosting.
const HEAD_URL = "https://cdn.jsdelivr.net/gh/ibrews/VitruvianGodot@main/godot_project/vitruvian_head.glb";

function VitruvianModel() {
  const gltf = useGLTF(HEAD_URL);
  const model = useMemo(() => {
    const scene = gltf.scene.clone(true);
    const bounds = new THREE.Box3().setFromObject(scene);
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());
    const largest = Math.max(size.x, size.y, size.z);
    if (!Number.isFinite(largest) || largest < 0.0001) throw new Error("Invalid GLB bounds");
    // Recenter the head; normalize dimensions rather than assuming export units.
    scene.position.sub(center);
    scene.scale.setScalar(2.4 / largest);
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.frustumCulled = false;
      }
    });
    const wrapper = new THREE.Group();
    wrapper.add(scene);
    return wrapper;
  }, [gltf.scene]);
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

function Scene() {
  return (
    <div style={{ width: "100%", height: 410, touchAction: "pan-y" }}>
      <Canvas camera={{ position: [0, 0.05, 4.0], fov: 39 }} dpr={[1, 1.6]} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={1.9} />
        <directionalLight position={[2, 3, 5]} intensity={2.5} />
        <directionalLight position={[-3, 2, -2]} intensity={1.3} />
        <VitruvianModel />
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
        <Scene />
      </Suspense>
    </LoadBoundary>
  );
}
