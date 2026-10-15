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
        object.material = (Array.isArray(object.material) ? object.material.map(m => m.clone()) : object.material.clone());
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
    // The Vitruvian GLB contains eyes, a mouth interior and the real skin mesh.
    // Never assume the largest mesh is the face; select the VitSkin material.
    const isSkin = (mesh: THREE.Mesh) => {
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      return materials.some(m => /vitskin|skin|face/i.test(m.name)) ||
        /cm_vitruvian|head/i.test(mesh.name);
    };
    const skinMeshes = meshes.filter(isSkin);
    // A visual failure is preferable to silently deforming teeth or eyes.
    const targetMeshes = skinMeshes.length ? skinMeshes : meshes.filter(m =>
      (m.geometry.getAttribute("position").count > 5000) &&
      !/eye|teeth|mouth|tongue|lash/i.test(m.name)
    );
    const face = (design.face - 50) / 50;
    const jaw = (design.jaw - 50) / 50;
    const chin = (design.chin - 50) / 50;
    const nose = (design.nose - 50) / 50;
    const eyes = (design.eyes - 50) / 50;
    for (const mesh of targetMeshes) {
      const geo = mesh.geometry;
      const box = mesh.userData.originalBounds as THREE.Box3;
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const pos = geo.getAttribute("position") as THREE.BufferAttribute;
      const original = mesh.userData.originalPositions as Float32Array;
      const hx = Math.max(size.x / 2, 0.001), hy = Math.max(size.y / 2, 0.001);
      const hz = Math.max(size.z / 2, 0.001);
      for (let i = 0; i < pos.count; i++) {
        const x = original[3*i], y = original[3*i+1], z = original[3*i+2];
        const nx = (x-center.x)/hx, ny = (y-center.y)/hy, nz = (z-center.z)/hz;
        const low = 1 - THREE.MathUtils.smoothstep(ny, -0.6, 0.3);
        const tip = 1 - THREE.MathUtils.smoothstep(ny, -0.95, -0.55);
        const noseArea = Math.exp(-Math.pow(nx/0.26, 2)-Math.pow(ny/0.32,2));
        const eyesArea = Math.exp(-Math.pow((ny-0.20)/0.2,2)) *
          Math.exp(-Math.pow((Math.abs(nx)-0.35)/0.24,2));
        // Larger bounded deformations make the test visibly responsive.
        const newX = x + (x-center.x)*(0.24*face + 0.23*jaw*low - 0.15*chin*tip)
          + Math.sign(nx)*eyes*eyesArea*hx*0.15
          + nx*nose*noseArea*hx*0.12;
        const newZ = z + nose*noseArea*Math.max(0,nz)*hz*0.22;
        pos.setXYZ(i,newX,y,newZ);
      }
      pos.needsUpdate = true;
      geo.computeVertexNormals();
      geo.computeBoundingSphere();
    }
    // Apply selected color ONLY to skin materials, preserving eyes/mouth.
    for (const mesh of meshes) {
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const material of mats) {
        if (!(material instanceof THREE.MeshStandardMaterial)) continue;
        if (/vitskin|skin|face/i.test(material.name)) {
          material.color.set(design.skin);
          material.map = null; // external GLB doesn't bundle the full skin textures
          material.needsUpdate = true;
        }
      }
    }
  }, [model, design.face, design.jaw, design.chin, design.nose, design.eyes, design.skin]);
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
