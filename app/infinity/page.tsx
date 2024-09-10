"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

import Figure8Particles from "./_Figure8Particles";
import FloatingParticles from "./_FloatingParticles";
import Overlay from "./_Overlay";

const _ = () => {
  return (
    <div className="fixed inset-0">
      <div className="fixed top-0 left-0 right-0 bottom-0">
        <Canvas camera={{ position: [0, 0, 2], fov: 75 }}>
          <color attach="background" args={["black"]} />
          <fog attach="fog" args={["#000000", 2, 3]} />
          <Figure8Particles />
          <FloatingParticles />
          <OrbitControls />
        </Canvas>
      </div>
      <Overlay />
    </div>
  );
};

export default _;
