import { useFrame } from "@react-three/fiber";
import React, { useMemo, useRef } from "react";
import * as THREE from "three";

const FLOATING_PARTICLE_COUNT = 100;
const SCENE_SIZE = 5;

const FloatingParticles: React.FC = () => {
  const instancedMesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const positions = useMemo(
    () =>
      new Array(FLOATING_PARTICLE_COUNT)
        .fill(0)
        .map(
          () =>
            new THREE.Vector3(
              (Math.random() - 0.5) * SCENE_SIZE,
              (Math.random() - 0.5) * SCENE_SIZE,
              (Math.random() - 0.5) * SCENE_SIZE,
            ),
        ),
    [],
  );

  const velocities = useMemo(
    () =>
      new Array(FLOATING_PARTICLE_COUNT)
        .fill(0)
        .map(
          () =>
            new THREE.Vector3(
              (Math.random() - 0.5) * 0.01,
              (Math.random() - 0.5) * 0.01,
              (Math.random() - 0.5) * 0.01,
            ),
        ),
    [],
  );

  useFrame((_state, _delta) => {
    if (instancedMesh.current) {
      for (let i = 0; i < FLOATING_PARTICLE_COUNT; i++) {
        positions[i].add(velocities[i]);

        ["x", "y", "z"].forEach((value) => {
          const axis = value as "x" | "y" | "z";
          if (Math.abs(positions[i][axis]) > SCENE_SIZE / 2) {
            positions[i][axis] =
              (Math.sign(positions[i][axis]) * SCENE_SIZE) / 2;
            velocities[i][axis] *= -1;
          }
        });

        velocities[i].add(
          new THREE.Vector3(
            (Math.random() - 0.5) * 0.0001,
            (Math.random() - 0.5) * 0.0001,
            (Math.random() - 0.5) * 0.0001,
          ),
        );

        dummy.position.copy(positions[i]);
        dummy.scale.setScalar(0.01);
        dummy.updateMatrix();
        instancedMesh.current.setMatrixAt(i, dummy.matrix);
      }
      instancedMesh.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh
      ref={instancedMesh}
      args={[undefined, undefined, FLOATING_PARTICLE_COUNT]}
    >
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color="#ffffff" />
    </instancedMesh>
  );
};

export default FloatingParticles;
