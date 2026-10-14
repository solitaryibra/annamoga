"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

export type FaceDesign3D = {
  preset: string;
  face: number;
  jaw: number;
  chin: number;
  nose: number;
  eyes: number;
  skin: string;
};

function CharacterHead({ design }: { design: FaceDesign3D }) {
  const faceFactor = (design.face - 50) / 100;
  const jawFactor = (design.jaw - 50) / 100;
  const chinFactor = (design.chin - 50) / 100;
  const noseFactor = (design.nose - 50) / 100;
  const eyeFactor = (design.eyes - 50) / 100;
  const eyeSpacing = 0.285 + eyeFactor * 0.16;
  const headGeometry = useMemo(() => {
    const geometry = new THREE.SphereGeometry(1, 64, 48);
    const positions = geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = positions.getZ(i);
      const lower = THREE.MathUtils.smoothstep(-y, 0.06, 0.95);
      const chin = THREE.MathUtils.smoothstep(-y, 0.48, 0.98);
      const newX = x * (0.76 + faceFactor * 0.24 + lower * (-0.18 + jawFactor * 0.37) - chin * (0.18 - chinFactor * 0.2));
      const newY = y * 1.14 - chin * (0.02 + chinFactor * 0.09);
      const newZ = z * (0.78 + (1 - lower) * 0.045);
      positions.setXYZ(i, newX, newY, newZ);
    }
    geometry.computeVertexNormals();
    return geometry;
  }, [faceFactor, jawFactor, chinFactor]);

  const skinMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: design.skin, roughness: 0.85, metalness: 0,
  }), [design.skin]);

  return (
    <group position={[0, -0.03, 0]}>
      <mesh geometry={headGeometry} material={skinMaterial} />
      <mesh position={[0, -1.17, -0.07]} material={skinMaterial}>
        <cylinderGeometry args={[0.25, 0.3, 0.5, 36]} />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh position={[side * (0.76 + faceFactor * 0.18), -0.13, -0.05]} rotation={[0, 0, side * -0.13]} scale={[0.16, 0.26, 0.115]} material={skinMaterial}>
            <sphereGeometry args={[1, 24, 24]} />
          </mesh>
          <mesh position={[side * eyeSpacing, 0.14, 0.672]} scale={[0.185, 0.11, 0.105]}>
            <sphereGeometry args={[1, 32, 24]} />
            <meshStandardMaterial color="#f7f5ef" roughness={0.55} />
          </mesh>
          <mesh position={[side * eyeSpacing, 0.14, 0.759]} scale={[0.071, 0.077, 0.045]}>
            <sphereGeometry args={[1, 24, 24]} />
            <meshStandardMaterial color="#59483e" roughness={0.35} />
          </mesh>
          <mesh position={[side * eyeSpacing, 0.14, 0.799]} scale={[0.036, 0.043, 0.015]}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color="#17191b" roughness={0.15} />
          </mesh>
          <mesh position={[side * eyeSpacing, 0.31, 0.704]} rotation={[0, 0, side * -0.12]} scale={[0.21, 0.036, 0.065]}>
            <sphereGeometry args={[1, 24, 12]} />
            <meshStandardMaterial color="#5d4033" roughness={1} />
          </mesh>
          <mesh position={[side * (0.1 + noseFactor * 0.065), -0.24, 0.83 + noseFactor * 0.07]} scale={[0.13 + noseFactor * 0.035, 0.085, 0.14]}>
            <sphereGeometry args={[1, 24, 16]} />
            <primitive object={skinMaterial} attach="material" />
          </mesh>
        </group>
      ))}
      <mesh position={[0, -0.075, 0.79 + noseFactor * 0.1]} scale={[0.11 + noseFactor * 0.12, 0.33, 0.16]}>
        <sphereGeometry args={[1, 32, 20]} />
        <primitive object={skinMaterial} attach="material" />
      </mesh>
      <mesh position={[0, -0.46, 0.69]} scale={[0.23, 0.038, 0.055]}>
        <sphereGeometry args={[1, 28, 12]} />
        <meshStandardMaterial color="#a66f68" roughness={0.95} />
      </mesh>
    </group>
  );
}

export default function Head3DViewer({ design }: { design: FaceDesign3D }) {
  return (
    <div style={{ height: 410, width: "100%", touchAction: "pan-y", position: "relative" }}>
      <Canvas camera={{ position: [0, 0, 3.8], fov: 39 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={1.7} />
        <directionalLight position={[2, 3, 4]} intensity={2.2} />
        <directionalLight position={[-3, 1, -3]} intensity={1.1} />
        <CharacterHead design={design} />
        <OrbitControls
          enablePan={false}
          enableDamping
          minDistance={2.6}
          maxDistance={6}
          minPolarAngle={0.55}
          maxPolarAngle={2.35}
          target={[0, -0.05, 0]}
        />
      </Canvas>
    </div>
  );
}
