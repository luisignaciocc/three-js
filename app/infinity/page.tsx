"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

import Figure8Particles from "./components/figure-8-particles";
import FloatingParticles from "./components/floating-particles";

const _ = () => {
  return (
    <div className="h-full inset-0">
      <Canvas camera={{ position: [0, 0, 2], fov: 75 }}>
        <color attach="background" args={["black"]} />
        <fog attach="fog" args={["#000000", 2, 3]} />
        <Figure8Particles />
        <FloatingParticles />
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default _;
