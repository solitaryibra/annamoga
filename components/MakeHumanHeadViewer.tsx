"use client";

import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { useMemo } from "react";
import * as THREE from "three";
import { mergeVertices } from "three/addons/utils/BufferGeometryUtils.js";

// The extracted OBJ ends in irregular open triangles below the jaw.
// Clip that boundary to a consistent plane before smoothing its normals.
function trimLowerBoundary(source: THREE.BufferGeometry, minimumY = 6.35) {
  const raw = source.index ? source.toNonIndexed() : source;
  const position = raw.getAttribute("position");
  const vertices: number[] = [];
  const clip = (triangle: THREE.Vector3[]) => {
    const result: THREE.Vector3[] = [];
    for (let k = 0; k < triangle.length; k++) {
      const start = triangle[k];
      const end = triangle[(k + 1) % triangle.length];
      const a = start.y >= minimumY;
      const b = end.y >= minimumY;
      if (a) result.push(start);
      if (a !== b) {
        const t = (minimumY - start.y) / (end.y - start.y);
        result.push(start.clone().lerp(end, t));
      }
    }
    return result;
  };
  for (let i = 0; i + 2 < position.count; i += 3) {
    const triangle = [0, 1, 2].map(j => new THREE.Vector3().fromBufferAttribute(position, i + j));
    const polygon = clip(triangle);
    for (let j = 1; j + 1 < polygon.length; j++) {
      for (const v of [polygon[0], polygon[j], polygon[j + 1]]) vertices.push(v.x, v.y, v.z);
    }
  }
  const trimmed = new THREE.BufferGeometry();
  trimmed.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  return trimmed;
}

import type { FaceDesign3D } from "./Head3DViewer";

function RealHead({ design }: { design: FaceDesign3D }) {
  const obj = useLoader(OBJLoader, "/models/makehuman-m01-head.obj");
  const face = (design.face - 50) / 50;
  const jaw = (design.jaw - 50) / 50;
  const chin = (design.chin - 50) / 50;
  const nose = (design.nose - 50) / 50;
  const eyes = (design.eyes - 50) / 50;

  const geometry = useMemo(() => {
    let source: THREE.BufferGeometry | undefined;
    obj.traverse((o) => {
      if (o instanceof THREE.Mesh && !source) source = o.geometry;
    });
    if (!source) return null;
    const g = trimLowerBoundary(source as THREE.BufferGeometry);
    const pos = g.getAttribute("position") as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      const y = pos.getY(i);
      let z = pos.getZ(i);
      const lower = THREE.MathUtils.smoothstep(7.4 - y, 0, 1.3);
      const jawBand = THREE.MathUtils.smoothstep(7.25 - y, 0.05, 0.9);
      const noseZone = Math.exp(-Math.pow(x / 0.34, 2) - Math.pow((y - 7.38) / 0.4, 2));
      const eyeZone = Math.exp(-Math.pow((y - 7.75) / 0.19, 2)) * Math.exp(-Math.pow((Math.abs(x) - 0.35) / 0.25, 2));
      x *= 1 + face * 0.095 + jaw * jawBand * 0.13 - chin * lower * 0.055;
      x += Math.sign(x) * eyes * eyeZone * 0.055;
      z += nose * noseZone * 0.07 * Math.max(0, z);
      pos.setXYZ(i, x, y - 7.19 - chin * lower * 0.04, z - 0.4);
    }
    // OBJLoader expands faces into separate triangles. Weld shared positions
    // so computeVertexNormals gives smooth shading rather than flat facets.
    const smooth = mergeVertices(g, 1e-4);
    smooth.computeVertexNormals();
    g.dispose();
    return smooth;
  }, [obj, face, jaw, chin, nose, eyes]);

  if (!geometry) return null;
  return (
    <mesh geometry={geometry} rotation={[0, 0, 0]} scale={0.87}>
      <meshStandardMaterial color={design.skin} roughness={0.85} metalness={0} side={THREE.DoubleSide} />
    </mesh>
  );
}

export default function MakeHumanHeadViewer({ design }: { design: FaceDesign3D }) {
  return (
    <div style={{ height: 410, width: "100%", touchAction: "pan-y" }}>
      <Canvas camera={{ position: [0, 0.15, 4.4], fov: 39 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={1.6} />
        <directionalLight position={[2, 3, 5]} intensity={2.5} />
        <directionalLight position={[-3, 2, -2]} intensity={1} />
        <RealHead design={design} />
        <OrbitControls enablePan={false} enableDamping minDistance={2.6} maxDistance={6} minPolarAngle={0.55} maxPolarAngle={2.35} target={[0, 0.15, 0]} />
      </Canvas>
    </div>
  );
}
