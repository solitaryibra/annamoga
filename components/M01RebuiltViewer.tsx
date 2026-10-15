"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import type { FaceDesign3D } from "./Head3DViewer";

function gaussian(x: number, y: number, cx: number, cy: number, sx: number, sy: number) {
  return Math.exp(-(((x - cx) / sx) ** 2 + ((y - cy) / sy) ** 2) * 1.6);
}

function M01Head({ design }: { design: FaceDesign3D }) {
  const shape = useMemo(() => {
    const g = new THREE.SphereGeometry(1, 128, 96);
    const pos = g.getAttribute("position") as THREE.BufferAttribute;
    const width = (design.face - 50) / 50;
    const jaw = (design.jaw - 50) / 50;
    const chin = (design.chin - 50) / 50;
    const nose = (design.nose - 50) / 50;
    const eyeGap = (design.eyes - 50) / 50;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
      const lower = THREE.MathUtils.smoothstep(-y, -0.08, 0.9);
      const tip = THREE.MathUtils.smoothstep(-y, 0.57, 0.95);
      const broad = 0.75 + width * 0.085 - lower * (0.095 - jaw * 0.09) - tip * (0.105 - chin * 0.05);
      const xx = x * broad;
      const yy = y * 1.17;
      let zz = z * (0.77 + 0.045 * (1 - lower));
      // Model the face as deformations of ONE continuous surface.
      // Keep displacement on the outward-facing side of the head only.
      if (z > 0) {
        const e = 0.285 + eyeGap * 0.048;
        const ax = Math.abs(xx);
        const noseBridge = 0.18 * gaussian(xx, yy, 0, -0.02, 0.15, 0.51);
        const noseTip = (0.19 + nose * 0.085) * gaussian(xx, yy, 0, -0.29, 0.16 + nose * 0.028, 0.15);
        const cheek = 0.055 * gaussian(ax, yy, 0.38, -0.14, 0.24, 0.24);
        const upperLid = 0.044 * gaussian(ax, yy, e, 0.235, 0.20, 0.068);
        const lowerLid = 0.04 * gaussian(ax, yy, e, 0.085, 0.20, 0.07);
        const socket = -0.052 * gaussian(ax, yy, e, 0.16, 0.18, 0.11);
        const lips = 0.064 * gaussian(xx, yy, 0, -0.54, 0.28, 0.075);
        const chinBulge = 0.047 * gaussian(xx, yy, 0, -0.83, 0.25, 0.14);
        zz += (noseBridge + noseTip + cheek + upperLid + lowerLid + socket + lips + chinBulge)
          * THREE.MathUtils.smoothstep(z, 0.06, 0.5);
      }
      pos.setXYZ(i, xx, yy, zz);
    }
    g.computeVertexNormals();
    return g;
  }, [design.face, design.jaw, design.chin, design.nose, design.eyes]);

  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color: design.skin, roughness: 0.88, metalness: 0,
  }), [design.skin]);

  const eyeGap = 0.285 + ((design.eyes - 50) / 50) * 0.048;
  return (
    <group>
      <mesh geometry={shape} material={material} />
      <mesh material={material} position={[0, -1.22, -0.06]} scale={[0.26, 0.42, 0.26]}>
        <cylinderGeometry args={[1, 1.13, 1, 48]} />
      </mesh>
      {[-1, 1].map(side => (
        <group key={side}>
          <mesh material={material} position={[side * 0.738, -0.16, -0.03]} scale={[0.13, 0.245, 0.10]} rotation={[0, 0, side * -0.12]}>
            <sphereGeometry args={[1, 48, 32]} />
          </mesh>
          <mesh position={[side * 0.803, -0.16, 0.055]} scale={[0.028, 0.145, 0.019]}>
            <sphereGeometry args={[1, 32, 24]} />
            <meshStandardMaterial color="#986a54" roughness={1} />
          </mesh>
          <mesh position={[side * eyeGap, 0.157, 0.727]} scale={[0.142, 0.054, 0.035]}>
            <sphereGeometry args={[1, 32, 20]} />
            <meshStandardMaterial color="#f7f3eb" roughness={0.6} />
          </mesh>
          <mesh position={[side * eyeGap, 0.156, 0.759]} scale={[0.050, 0.050, 0.016]}>
            <sphereGeometry args={[1, 24, 20]} />
            <meshStandardMaterial color="#6d665b" roughness={0.4} />
          </mesh>
          <mesh position={[side * eyeGap, 0.156, 0.772]} scale={[0.024, 0.03, 0.011]}>
            <sphereGeometry args={[1, 24, 16]} />
            <meshStandardMaterial color="#231e1d" />
          </mesh>
          <mesh position={[side * eyeGap, 0.315, 0.707]} rotation={[0, 0, -side * 0.09]} scale={[0.18, 0.025, 0.026]}>
            <sphereGeometry args={[1, 32, 12]} />
            <meshStandardMaterial color="#5a4036" roughness={1} />
          </mesh>
          <mesh position={[side * 0.1, -0.322, 0.93 + (design.nose - 50) * 0.001]} scale={[0.033, 0.021, 0.011]}>
            <sphereGeometry args={[1, 20, 12]} />
            <meshStandardMaterial color="#674238" />
          </mesh>
        </group>
      ))}
      <mesh position={[0, -0.52, 0.696]} scale={[0.21, 0.011, 0.017]}>
        <sphereGeometry args={[1, 28, 12]} />
        <meshStandardMaterial color="#985e57" roughness={1} />
      </mesh>
    </group>
  );
}

export default function M01RebuiltViewer({ design }: { design: FaceDesign3D }) {
  return (
    <div style={{ width: "100%", height: 410, touchAction: "pan-y" }}>
      <Canvas camera={{ position: [0, 0, 3.7], fov: 40 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={1.6} />
        <directionalLight position={[2.5, 4, 4]} intensity={2.3} />
        <directionalLight position={[-2, 1, -3]} intensity={0.85} />
        <M01Head design={design} />
        <OrbitControls enablePan={false} enableDamping minDistance={2.45} maxDistance={6}
          minPolarAngle={0.45} maxPolarAngle={2.5} target={[0, -0.05, 0]} />
      </Canvas>
    </div>
  );
}
