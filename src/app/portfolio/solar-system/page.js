"use client";

import Link from "next/link";
import Scene3D from "../../components/3d/Scene3D";
import HologramPanel, { NASAPreloader } from "../../components/3d/HologramPanel";
import TimeControlUI from "../../components/3d/TimeControlUI";
import LaunchDashboard from "../../components/3d/LaunchDashboard";
import { useSceneStore } from "../../../lib/store";

export default function SolarSystemPage() {
  const selectedPlanet = useSceneStore((state) => state.selectedPlanet);
  const setSelectedPlanet = useSceneStore((state) => state.setSelectedPlanet);

  return (
    <div 
      className="main-content" 
      style={{ backgroundColor: "#000000", minHeight: "100vh", position: "relative", overflow: "hidden" }}
    >
      <style>{`
        .footer-classic { display: none !important; }
        body, html { overflow: hidden !important; touch-action: none !important; }
      `}</style>
      
      <NASAPreloader />

      {/* Container cho Canvas 3D */}
      <div style={{ width: "100%", height: "calc(100vh - 44px)", position: "relative" }}>
        
        {/* Render 3D Scene */}
        <Scene3D />
        
        {/* Overlay: UI Controls */}
        <TimeControlUI />

        {/* Overlay: Hologram Info Panel */}
        <HologramPanel planet={selectedPlanet} />
        
        {/* Overlay: Launch Dashboard */}
        <LaunchDashboard />
        
        {/* Tiêu đề & Nút quay lại */}
        <div style={{ position: "absolute", top: "24px", left: "24px", display: "flex", flexDirection: "column", gap: "12px", zIndex: 10, pointerEvents: "none" }}>
          <Link 
            href="/portfolio" 
            className="button-secondary" 
            style={{ 
              pointerEvents: "auto",
              alignSelf: "flex-start", 
              color: "#ffffff", 
              borderColor: "rgba(255,255,255,0.3)", 
              fontSize: "12px", 
              padding: "6px 12px",
              backgroundColor: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(10px)"
            }}
          >
            ← Trở lại Portfolio
          </Link>
          <div>
            <h1 className="display-lg" style={{ color: "#ffffff", fontSize: "24px", marginBottom: "4px" }}>
              Mô phỏng Hệ Mặt Trời 3D
            </h1>
            <p className="caption" style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>
              Tỉ lệ thực tế (định luật Kepler). Click vào các hành tinh để xem thông tin.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
