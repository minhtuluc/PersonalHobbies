"use client";

import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture, Line } from "@react-three/drei";
import * as THREE from "three";
import useSWR from "swr";

const issFetcher = (url) => fetch(url).then(res => res.json());

function ISSMarker({ earthRadiusScene }) {
  const meshRef = useRef();

  const { data } = useSWR("/api/iss-now", issFetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: false,
  });

  useFrame(() => {
    if (useSceneStore.getState().selectedPlanet?.id === "iss" && meshRef.current) {
      const worldPos = new THREE.Vector3();
      meshRef.current.getWorldPosition(worldPos);
      useSceneStore.getState().cameraTargetPos.copy(worldPos);
    }
  });

  if (!data?.iss_position) return null;

  const lat = parseFloat(data.iss_position.latitude);
  const lon = parseFloat(data.iss_position.longitude);

  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  // ISS bay cách mặt đất khoảng 400km (Trái Đất ~6371km)
  const orbitRadius = earthRadiusScene * 1.06;

  const x = -(orbitRadius * Math.sin(phi) * Math.cos(theta));
  const z = (orbitRadius * Math.sin(phi) * Math.sin(theta));
  const y = (orbitRadius * Math.cos(phi));

  return (
    <mesh
      ref={meshRef}
      position={[x, y, z]}
      onClick={(e) => {
        e.stopPropagation();
        useSceneStore.getState().setSelectedPlanet({ id: "iss" });
      }}
      onPointerOver={(e) => (document.body.style.cursor = 'pointer')}
      onPointerOut={(e) => (document.body.style.cursor = 'auto')}
    >
      <sphereGeometry args={[earthRadiusScene * 0.03, 16, 16]} />
      <meshBasicMaterial color="#00ffcc" />
      <pointLight distance={earthRadiusScene * 3} intensity={0.5} color="#00ffcc" />
    </mesh>
  );
}
import { getAngularSpeedRadPerSec } from "../../../lib/orbitalScale";
import { useSceneStore } from "../../../lib/store";

export default function Planet({ planet, orbitRadiusScene, radiusScene, ...props }) {
  const meshRef = useRef();

  // Random initial angle for aesthetics
  const [initialAngle] = useState(() => Math.random() * Math.PI * 2);
  const angleRef = useRef(initialAngle);

  const baseSpeed = getAngularSpeedRadPerSec(planet.semiMajorAxisAU);

  const texUrls = [];
  if (planet.texture) texUrls.push(planet.texture);
  if (planet.ringTexture) texUrls.push(planet.ringTexture);

  const loadedTex = useTexture(texUrls);
  const map = planet.texture ? loadedTex[0] : null;
  const ringMap = planet.ringTexture ? loadedTex[planet.texture ? 1 : 0] : null;

  const ringGeo = useMemo(() => {
    if (planet.id !== "saturn") return null;
    const innerRadius = radiusScene * 1.2;
    const outerRadius = radiusScene * 2.2;
    const geometry = new THREE.RingGeometry(innerRadius, outerRadius, 64);

    // Sửa lại UV mapping để texture áp theo chiều dọc/ngang của bán kính
    const pos = geometry.attributes.position;
    const v3 = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v3.fromBufferAttribute(pos, i);
      const radius = v3.length();
      // map bán kính vào trục X (U) của ảnh, trục Y (V) để 0 hoặc 1 tuỳ hướng
      const normalizedRadius = (radius - innerRadius) / (outerRadius - innerRadius);
      // Ảnh texture ring thường là dải ngang (x: 0->1), hoặc dải dọc (y: 0->1)
      geometry.attributes.uv.setXY(i, normalizedRadius, 1);
    }
    return geometry;
  }, [planet.id, radiusScene]);

  useFrame((_, delta) => {
    // get timescale directly to avoid re-rendering
    const timeScale = useSceneStore.getState().timeScale;
    angleRef.current += baseSpeed * timeScale * delta;

    const x = Math.cos(angleRef.current) * orbitRadiusScene;
    const z = Math.sin(angleRef.current) * orbitRadiusScene;

    if (meshRef.current) {
      meshRef.current.position.set(x, 0, z);
      // Axial rotation (spin)
      meshRef.current.rotation.y += (planet.spinSpeed || 0.01) * timeScale * delta;

      // Nếu hành tinh này đang được chọn, cập nhật toạ độ tâm điểm cho Camera
      if (useSceneStore.getState().selectedPlanet?.id === planet.id) {
        useSceneStore.getState().cameraTargetPos.set(x, 0, z);
      }
    }
  });

  return (
    <group {...props}>
      {/* Orbit Ring */}
      <Line
        points={Array.from({ length: 129 }).map((_, i) => {
          const angle = (i / 128) * Math.PI * 2;
          return [Math.cos(angle) * orbitRadiusScene, 0, Math.sin(angle) * orbitRadiusScene];
        })}
        color={planet.fallbackColor}
        lineWidth={1.5} // Screen-space thickness
        transparent
        opacity={0.35}
      />

      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          useSceneStore.getState().setSelectedPlanet(planet);
        }}
        onPointerOver={(e) => (document.body.style.cursor = 'pointer')}
        onPointerOut={(e) => (document.body.style.cursor = 'auto')}
      >
        <sphereGeometry args={[radiusScene, 32, 32]} />
        <meshStandardMaterial
          color={planet.fallbackColor}
          map={map}
          roughness={0.7}
          metalness={0.1}
        />

        {/* Saturn Ring */}
        {planet.id === "saturn" && ringGeo && (
          <mesh rotation={[Math.PI / 2.5, 0, 0]} geometry={ringGeo}>
            <meshStandardMaterial
              color={ringMap ? "#ffffff" : "#e3d3a4"}
              map={ringMap}
              transparent
              opacity={ringMap ? 0.9 : 0.7}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}

        {/* Trạm vũ trụ ISS cho Trái Đất */}
        {planet.id === "earth" && <ISSMarker earthRadiusScene={radiusScene} />}
      </mesh>
    </group>
  );
}
