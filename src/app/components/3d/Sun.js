"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useSceneStore } from "../../../lib/store";

export default function Sun({ planet, radiusScene, ...props }) {
  const meshRef = useRef();

  // Load texture if available
  const textures = useTexture(
    planet.texture ? [planet.texture] : [],
    (loaded) => { }, // onLoad
    () => { } // onError
  );

  const map = textures.length > 0 ? textures[0] : null;

  useFrame((_, delta) => {
    const timeScale = useSceneStore.getState().timeScale;
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.05 * timeScale * delta;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={[0, 0, 0]}
      {...props}
      onClick={(e) => {
        e.stopPropagation();
        useSceneStore.getState().setSelectedPlanet(planet);
      }}
      onPointerOver={(e) => (document.body.style.cursor = 'pointer')}
      onPointerOut={(e) => (document.body.style.cursor = 'auto')}
    >
      <sphereGeometry args={[radiusScene, 32, 32]} />
      {/* MeshBasicMaterial is used so it isn't affected by its own light */}
      <meshBasicMaterial
        color={new THREE.Color(planet.fallbackColor).multiplyScalar(2.5)}
        map={map}
        toneMapped={false}
      />
      {/* Center point light representing the Sun's illumination */}
      <pointLight
        position={[0, 0, 0]}
        intensity={300}
        decay={1}
        distance={0}
      />
    </mesh>
  );
}
