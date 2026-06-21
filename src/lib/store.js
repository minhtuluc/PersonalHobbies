import { create } from "zustand";
import * as THREE from "three";

export const useSceneStore = create((set) => ({
  timeScale: 1,              // 1 = tốc độ chuẩn (Earth = 20s/vòng)
  setTimeScale: (v) => set({ timeScale: v }),
  selectedPlanet: null,
  setSelectedPlanet: (planet) => set({ selectedPlanet: planet }),
  cameraTarget: [0, 0, 0],
  setCameraTarget: (pos) => set({ cameraTarget: pos }),
  cameraTargetPos: new THREE.Vector3(0, 0, 0),
}));
