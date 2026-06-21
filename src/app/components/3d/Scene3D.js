import React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import { PLANETS, SUN } from "../../../lib/planetsData";
import { getOrbitRadiusScene, getPlanetSceneRadius, getSunSceneRadius } from "../../../lib/orbitalScale";
import { useSceneStore } from "../../../lib/store";
import Planet from "./Planet";
import Sun from "./Sun";
import { useTexture } from "@react-three/drei";

function Skybox() {
  const texture = useTexture("/textures/8k_stars_milky_way.jpg");
  return (
    <mesh>
      <sphereGeometry args={[1000, 64, 64]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} toneMapped={false} />
    </mesh>
  );
}

function CameraController() {
  const controlsRef = React.useRef();

  useFrame(() => {
    if (controlsRef.current) {
      const storeState = useSceneStore.getState();
      const selected = storeState.selectedPlanet;
      const targetPos = storeState.cameraTargetPos;
      
      if (!selected) {
        targetPos.set(0, 0, 0);
      }
      
      // Mượt mà trượt (lerp) tâm điểm zoom về phía mục tiêu
      controlsRef.current.target.lerp(targetPos, 0.1);
      controlsRef.current.update();
    }
  });

  return <OrbitControls ref={controlsRef} makeDefault minDistance={2} maxDistance={400} />;
}

export default function Scene3D() {
  // Mercury is the first planet, index 0
  const mercury = PLANETS.find(p => p.id === "mercury");
  const sunRadiusScene = getSunSceneRadius(mercury.semiMajorAxisAU);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas
        onPointerMissed={() => useSceneStore.getState().setSelectedPlanet(null)}
        gl={{ 
          logarithmicDepthBuffer: true, 
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
        camera={{ position: [0, 20, 40], near: 0.1, far: 3000, fov: 50 }}
      >
        <color attach="background" args={["#000000"]} />
        <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        {/* Ambient light for baseline visibility (very dim) */}
        <ambientLight intensity={0.4} />

        <Sun planet={SUN} radiusScene={sunRadiusScene} />

        <React.Suspense fallback={null}>
          <Skybox />
          {PLANETS.map((planet) => {
            const orbitRadiusScene = getOrbitRadiusScene(planet.semiMajorAxisAU);
            const radiusScene = getPlanetSceneRadius(planet.realRadiusKm);
            return (
              <Planet 
                key={planet.id} 
                planet={planet} 
                orbitRadiusScene={orbitRadiusScene} 
                radiusScene={radiusScene} 
              />
            );
          })}
        </React.Suspense>

        <CameraController />
      </Canvas>
    </div>
  );
}
