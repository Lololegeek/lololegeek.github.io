"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import * as THREE from "three";
import { stats } from "@/lib/stats";

const weeks = stats.github.weeks;
const peak = Math.max(1, ...weeks.flat());
const STEP = 1.18;

function Bars({ reduce }: { reduce: boolean }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const group = useRef<THREE.Group>(null);
  const progress = useRef(reduce ? 1 : 0);
  const cells = useMemo(
    () => weeks.flatMap((w, x) => w.map((c, z) => ({ x, z, h: 0.12 + (c / peak) * 9, on: c > 0 }))),
    [],
  );
  const tmp = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);

  useLayoutEffect(() => {
    cells.forEach((c, i) => {
      color.set(c.on ? "#e9e9ea" : "#4a4a4c");
      mesh.current!.setColorAt(i, color);
    });
    mesh.current!.instanceColor!.needsUpdate = true;
  }, [cells, color]);

  useFrame((_, dt) => {
    if (!mesh.current || !group.current) return;
    if (progress.current < 1) progress.current = Math.min(1, progress.current + dt * 0.55);
    const p = 1 - Math.pow(1 - progress.current, 4);
    cells.forEach((c, i) => {
      const local = Math.min(1, Math.max(0, p * 1.6 - (c.x / weeks.length) * 0.6));
      const h = c.h * local + 0.02;
      tmp.position.set((c.x - weeks.length / 2) * STEP, h / 2, (c.z - 3) * STEP);
      tmp.scale.set(1, h, 1);
      tmp.updateMatrix();
      mesh.current!.setMatrixAt(i, tmp.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
    if (!reduce) group.current.rotation.y += dt * 0.04;
  });

  return (
    <group ref={group} rotation={[0, -0.5, 0]}>
      <instancedMesh ref={mesh} args={[undefined, undefined, cells.length]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.85} />
      </instancedMesh>
    </group>
  );
}

export default function Skyline({ active, reduce }: { active: boolean; reduce: boolean }) {
  return (
    <Canvas frameloop={active ? "always" : "never"} dpr={[1, 2]} gl={{ antialias: true }} aria-hidden>
      <color attach="background" args={["#1b1b1c"]} />
      <OrthographicCamera makeDefault position={[40, 34, 40]} zoom={11} onUpdate={(c) => c.lookAt(0, 2, 0)} />
      <ambientLight intensity={0.75} />
      <directionalLight position={[20, 40, 10]} intensity={1.6} />
      <directionalLight position={[-30, 10, -20]} intensity={0.35} />
      <Bars reduce={reduce} />
    </Canvas>
  );
}
