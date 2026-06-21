"use client";

import { useState } from "react";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then(res => res.json());

const swrOptions = {
  revalidateOnFocus: false,
  dedupingInterval: 3600000, // 1 hour to prevent 429 Too Many Requests
};

function LaunchCard({ launch }) {
  const date = new Date(launch.net).toLocaleString();
  const provider = launch.launch_service_provider?.name || "Unknown Provider";
  const rocket = launch.rocket?.configuration?.full_name || "Unknown Rocket";
  const pad = launch.pad?.location?.name || "Unknown Location";
  
  // Status IDs: 1 = Go, 2 = TBD, 3 = Success, 4 = Failed, 6 = In Flight, 8 = TBC
  const statusColor = launch.status?.id === 3 ? "#00ffcc" : 
                      (launch.status?.id === 1 ? "#ffcc00" : 
                      (launch.status?.id === 4 ? "#ff3366" : "var(--holo-text-dim)"));
  
  return (
    <div style={{
      display: "flex", gap: "20px", padding: "20px", marginBottom: "20px",
      background: "rgba(10, 25, 47, 0.6)", border: "1px solid var(--holo-border)",
      borderRadius: "8px", backdropFilter: "blur(4px)",
      boxShadow: "inset 0 0 10px rgba(0, 229, 255, 0.05)"
    }}>
      {launch.image && (
        <div style={{ width: "160px", height: "160px", flexShrink: 0, borderRadius: "6px", overflow: "hidden", border: "1px solid var(--holo-border-glow)" }}>
          <img src={launch.image} alt={rocket} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      )}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <h3 style={{ margin: 0, color: "var(--holo-primary)", fontSize: "18px", letterSpacing: "1px" }}>
            {launch.name}
          </h3>
          <span style={{ fontSize: "12px", color: statusColor, border: `1px solid ${statusColor}`, padding: "4px 8px", borderRadius: "4px", whiteSpace: "nowrap", fontWeight: "bold", letterSpacing: "1px" }}>
            {launch.status?.name.toUpperCase()}
          </span>
        </div>
        <div style={{ fontSize: "14px", color: "var(--holo-text)", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ color: "var(--holo-accent)", width: "100px" }}>TỔ CHỨC:</span> 
          <span style={{ fontWeight: "bold" }}>{provider}</span>
        </div>
        <div style={{ fontSize: "14px", color: "var(--holo-text)", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ color: "var(--holo-accent)", width: "100px" }}>TÊN LỬA:</span> 
          <span>{rocket}</span>
        </div>
        <div style={{ fontSize: "14px", color: "var(--holo-text)", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ color: "var(--holo-accent)", width: "100px" }}>THỜI GIAN:</span> 
          <span>{date}</span>
        </div>
        <div style={{ fontSize: "14px", color: "var(--holo-text)", display: "flex", alignItems: "flex-start", gap: "8px" }}>
          <span style={{ color: "var(--holo-accent)", width: "100px", flexShrink: 0 }}>ĐỊA ĐIỂM:</span> 
          <span>{pad}</span>
        </div>
        {launch.mission?.description && (
          <div style={{ fontSize: "13px", color: "var(--holo-text-dim)", marginTop: "8px", lineHeight: "1.5", fontStyle: "italic", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {launch.mission.description}
          </div>
        )}
      </div>
    </div>
  );
}

export default function LaunchDashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState("upcoming");

  const { data: upcomingData, error: upErr } = useSWR(isOpen ? "https://lldev.thespacedevs.com/2.2.0/launch/upcoming/?limit=4" : null, fetcher, swrOptions);
  const { data: previousData, error: prevErr } = useSWR(isOpen ? "https://lldev.thespacedevs.com/2.2.0/launch/previous/?limit=4" : null, fetcher, swrOptions);

  return (
    <>
      <style>{`
        .holo-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .holo-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 229, 255, 0.05);
          border-radius: 4px;
        }
        .holo-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 229, 255, 0.3);
          border-radius: 4px;
        }
        .holo-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 229, 255, 0.6);
        }
        .no-scanlines::after {
          display: none !important;
        }
      `}</style>
      
      {/* Toggle Button */}
      <button 
        className="button-secondary"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "absolute", bottom: "24px", right: "24px", zIndex: 100,
          background: isOpen ? "rgba(0, 229, 255, 0.15)" : "rgba(10, 25, 47, 0.7)", 
          borderColor: "var(--holo-border)",
          color: "var(--holo-accent)",
          padding: "8px 24px",
          fontSize: "14px", fontWeight: "600", letterSpacing: "1px",
          fontFamily: "var(--font-rajdhani), sans-serif",
          backdropFilter: "blur(8px)",
          boxShadow: isOpen ? "0 0 15px rgba(0, 229, 255, 0.3)" : "none",
          textTransform: "uppercase"
        }}
      >
        Lịch Phóng
      </button>

      {/* Hologram Modal */}
      {isOpen && (
        <div className="hologram-panel" style={{
          position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          width: "90%", maxWidth: "900px", height: "85%", maxHeight: "800px",
          zIndex: 1000, display: "flex", flexDirection: "column",
          padding: "32px",
          background: "rgba(10, 25, 47, 0.85)", 
          boxShadow: "0 0 40px rgba(0, 229, 255, 0.15), inset 0 0 20px rgba(0, 229, 255, 0.1)"
        }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--holo-border)", paddingBottom: "20px", marginBottom: "32px" }}>
            <h2 style={{ margin: 0, color: "var(--holo-accent)", letterSpacing: "3px", fontSize: "28px" }}>
              TRẠM THEO DÕI VŨ TRỤ
            </h2>
            <button onClick={() => setIsOpen(false)} style={{ background: "transparent", border: "none", color: "var(--holo-accent)", fontSize: "28px", cursor: "pointer", opacity: 0.7 }}>✕</button>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: "20px", marginBottom: "32px" }}>
            <button 
              onClick={() => setTab("upcoming")}
              style={{
                background: tab === "upcoming" ? "rgba(0, 229, 255, 0.2)" : "transparent",
                border: "1px solid var(--holo-accent)", color: "var(--holo-accent)",
                padding: "10px 32px", borderRadius: "6px", cursor: "pointer",
                fontWeight: "bold", letterSpacing: "2px", fontSize: "15px",
                transition: "all 0.2s ease"
              }}
            >
              SẮP PHÓNG
            </button>
            <button 
              onClick={() => setTab("previous")}
              style={{
                background: tab === "previous" ? "rgba(0, 229, 255, 0.2)" : "transparent",
                border: "1px solid var(--holo-accent)", color: "var(--holo-accent)",
                padding: "10px 32px", borderRadius: "6px", cursor: "pointer",
                fontWeight: "bold", letterSpacing: "2px", fontSize: "15px",
                transition: "all 0.2s ease"
              }}
            >
              ĐÃ PHÓNG
            </button>
          </div>

          {/* Content Area */}
          <div 
            className="holo-scrollbar" 
            style={{ flex: 1, overflowY: "auto", paddingRight: "16px", pointerEvents: "auto" }}
            onWheel={(e) => e.stopPropagation()} // Ngăn OrbitControls ăn mất sự kiện cuộn chuột
          >
            {tab === "upcoming" && (
              upErr ? <div className="hologram-panel__error">Lỗi kết nối API. Quá số lần gọi (15/giờ) hoặc máy chủ từ chối.</div> :
              upcomingData ? upcomingData.results.map(launch => <LaunchCard key={launch.id} launch={launch} />) : 
              <div style={{ textAlign: "center", marginTop: "60px", color: "var(--holo-text-dim)", fontSize: "18px", letterSpacing: "1px" }}>📡 Đang phân tích tín hiệu vệ tinh...</div>
            )}
            
            {tab === "previous" && (
              prevErr ? <div className="hologram-panel__error">Lỗi kết nối API. Quá số lần gọi (15/giờ) hoặc máy chủ từ chối.</div> :
              previousData ? previousData.results.map(launch => <LaunchCard key={launch.id} launch={launch} />) : 
              <div style={{ textAlign: "center", marginTop: "60px", color: "var(--holo-text-dim)", fontSize: "18px", letterSpacing: "1px" }}>📡 Đang truy xuất hồ sơ vũ trụ...</div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
