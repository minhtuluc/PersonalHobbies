"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

const getApodUrl = (key) => `https://api.nasa.gov/planetary/apod?api_key=${key}&thumbs=true`;
const getMarsUrl = () => `https://images-api.nasa.gov/search?q=mars%20rover%20curiosity%20surface&media_type=image`;

const getDonkiUrl = (key) => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 30);
  const formatDate = (d) => d.toISOString().split('T')[0];
  return `https://api.nasa.gov/DONKI/FLR?startDate=${formatDate(start)}&endDate=${formatDate(end)}&api_key=${key}`;
};

const swrOptions = {
  revalidateOnFocus: false,
  revalidateIfStale: false,
  dedupingInterval: 3600000,
};

export function NASAPreloader() {
  const apiKey = process.env.NEXT_PUBLIC_NASA_API_KEY || 'DEMO_KEY';
  useSWR(getApodUrl(apiKey), fetcher, swrOptions);
  useSWR(getMarsUrl(), fetcher, swrOptions);
  useSWR(getDonkiUrl(apiKey), fetcher, swrOptions);
  return null;
}

function BasePlanetInfo({ planet }) {
  const period = planet.semiMajorAxisAU ? Math.pow(planet.semiMajorAxisAU, 1.5).toFixed(2) : null;
  return (
    <>
      <div className="hologram-panel__title">{planet.label.toUpperCase()}</div>
      {planet.type && (
        <div className="hologram-panel__row">
          <span>Loại sao</span>
          <span>{planet.type}</span>
        </div>
      )}
      <div className="hologram-panel__row">
        <span>Bán kính</span>
        <span>{planet.realRadiusKm.toLocaleString()} km</span>
      </div>
      {planet.mass && (
        <div className="hologram-panel__row">
          <span>Khối lượng</span>
          <span>{planet.mass}</span>
        </div>
      )}
      {planet.temp && (
        <div className="hologram-panel__row">
          <span>Nhiệt độ</span>
          <span>{planet.temp}</span>
        </div>
      )}
      {planet.gravity && (
        <div className="hologram-panel__row">
          <span>Trọng lực</span>
          <span>{planet.gravity}</span>
        </div>
      )}
      {planet.moons !== undefined && (
        <div className="hologram-panel__row">
          <span>Mặt Trăng</span>
          <span>{planet.moons}</span>
        </div>
      )}
      {planet.dayLength && (
        <div className="hologram-panel__row">
          <span>Độ dài 1 ngày</span>
          <span>{planet.dayLength}</span>
        </div>
      )}
      {period && (
        <div className="hologram-panel__row">
          <span>Chu kỳ quỹ đạo</span>
          <span>{period} năm Trái Đất</span>
        </div>
      )}
      {planet.semiMajorAxisAU && (
        <div className="hologram-panel__row">
          <span>K.cách đến Mặt Trời</span>
          <span>{planet.semiMajorAxisAU} AU</span>
        </div>
      )}
    </>
  );
}

function EarthPanel({ planet }) {
  const apiKey = process.env.NEXT_PUBLIC_NASA_API_KEY || 'DEMO_KEY';
  const { data, error } = useSWR(getApodUrl(apiKey), fetcher, swrOptions);
  
  if (error) return <div className="hologram-panel__error">Lỗi API: Không thể tải ảnh.</div>;
  
  return (
    <div className="hologram-panel" style={{ position: "absolute", top: "10%", right: "5%", zIndex: 10 }}>
      <BasePlanetInfo planet={planet} />
      <div style={{ margin: "12px 0", height: "1px", background: "var(--holo-border-glow)" }} />
      <div className="hologram-panel__title" style={{ fontSize: "14px" }}>TRẠM QUAN SÁT — APOD</div>
      {data ? (
        <>
          <img src={data.thumbnail_url || data.url} alt="APOD" className="hologram-panel__image" />
          <div className="hologram-panel__row" style={{ marginTop: "8px" }}>
            <span>Trái Đất</span>
            <span>{data.date}</span>
          </div>
        </>
      ) : (
        <div style={{ padding: "20px 0", textAlign: "center", color: "var(--holo-text-dim)" }}>Đang kết nối API...</div>
      )}
    </div>
  );
}

function MarsPanel({ planet }) {
  const { data, error } = useSWR(getMarsUrl(), fetcher, swrOptions);
  
  if (error) return <div className="hologram-panel__error">Lỗi API: Mất tín hiệu Rover.</div>;
  
  const photoUrl = data?.collection?.items?.[0]?.links?.[0]?.href;

  return (
    <div className="hologram-panel" style={{ position: "absolute", top: "10%", right: "5%", zIndex: 10 }}>
      <BasePlanetInfo planet={planet} />
      <div style={{ margin: "12px 0", height: "1px", background: "var(--holo-border-glow)" }} />
      <div className="hologram-panel__title" style={{ fontSize: "14px" }}>MARS ROVER FEED</div>
      {photoUrl ? (
        <>
          <img src={photoUrl} alt="Rover" className="hologram-panel__image" />
          <div className="hologram-panel__row" style={{ marginTop: "8px" }}>
            <span>Tín hiệu từ</span>
            <span>Curiosity</span>
          </div>
        </>
      ) : (
        <div style={{ padding: "20px 0", textAlign: "center", color: "var(--holo-text-dim)" }}>Đang kết nối API...</div>
      )}
    </div>
  );
}

function SunPanel({ planet }) {
  const apiKey = process.env.NEXT_PUBLIC_NASA_API_KEY || 'DEMO_KEY';
  const { data, error } = useSWR(getDonkiUrl(apiKey), fetcher, swrOptions);

  if (error) return <div className="hologram-panel__error">Lỗi API: Không kết nối được vệ tinh thời tiết.</div>;

  const latestFlare = data && data.length > 0 ? data[data.length - 1] : null;

  return (
    <div className="hologram-panel" style={{ position: "absolute", top: "10%", right: "5%", zIndex: 10 }}>
      <BasePlanetInfo planet={planet} />
      <div style={{ margin: "12px 0", height: "1px", background: "var(--holo-border-glow)" }} />
      <div className="hologram-panel__title" style={{ fontSize: "14px" }}>SPACE WEATHER — SUN</div>
      {latestFlare ? (
        <>
          <div className="hologram-panel__row" style={{ marginTop: "8px", color: "var(--holo-accent)", fontWeight: "bold", textShadow: "0 0 10px var(--holo-accent)" }}>
            <span>Solar Flare Class</span>
            <span>{latestFlare.classType}</span>
          </div>
          <div className="hologram-panel__row">
            <span>Bắt đầu</span>
            <span>{new Date(latestFlare.beginTime).toLocaleString()}</span>
          </div>
          <div className="hologram-panel__row">
            <span>Đỉnh điểm</span>
            <span>{new Date(latestFlare.peakTime).toLocaleString()}</span>
          </div>
          <div className="hologram-panel__row">
            <span>Khu vực</span>
            <span>AR {latestFlare.activeRegionNum || "N/A"}</span>
          </div>
        </>
      ) : data ? (
         <div style={{ padding: "20px 0", textAlign: "center", color: "var(--holo-text-dim)" }}>Ổn định (30 ngày qua).</div>
      ) : (
        <div style={{ padding: "20px 0", textAlign: "center", color: "var(--holo-text-dim)" }}>Đang phân tích dữ liệu...</div>
      )}
    </div>
  );
}

function ISSPanel() {
  const { data: posData, error: posError } = useSWR("http://api.open-notify.org/iss-now.json", fetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: false,
  });
  
  const { data: astrosData } = useSWR("http://api.open-notify.org/astros.json", fetcher, swrOptions);

  if (posError) return <div className="hologram-panel__error">Lỗi API: Không thể bắt tín hiệu ISS.</div>;

  const issCrew = astrosData?.people?.filter(p => p.craft === 'ISS') || [];
  const crewNames = issCrew.map(p => p.name).join(", ");

  return (
    <div className="hologram-panel" style={{ position: "absolute", top: "10%", right: "5%", zIndex: 10, width: "320px" }}>
      <div className="hologram-panel__title">INTERNATIONAL SPACE STATION</div>
      
      <div className="hologram-panel__row">
        <span>Phi hành đoàn</span>
        <span>{issCrew.length > 0 ? `${issCrew.length} người` : "Đang tải..."}</span>
      </div>
      
      {issCrew.length > 0 && (
        <div style={{ fontSize: "12px", color: "var(--holo-text)", marginBottom: "8px", lineHeight: "1.4", fontStyle: "italic", opacity: 0.8 }}>
          {crewNames}
        </div>
      )}
      <div className="hologram-panel__row">
        <span>Khối lượng</span>
        <span>~420 tấn</span>
      </div>
      <div className="hologram-panel__row">
        <span>Năm phóng</span>
        <span>1998</span>
      </div>
      <div className="hologram-panel__row">
        <span>Kích thước</span>
        <span>109m × 73m</span>
      </div>

      <div style={{ margin: "12px 0", height: "1px", background: "var(--holo-border-glow)" }} />
      <div className="hologram-panel__title" style={{ fontSize: "14px" }}>REAL-TIME TRACKING</div>

      {posData?.iss_position ? (
        <>
          <div className="hologram-panel__row" style={{ marginTop: "8px" }}>
            <span>Vĩ độ (Lat)</span>
            <span>{posData.iss_position.latitude}°</span>
          </div>
          <div className="hologram-panel__row">
            <span>Kinh độ (Lon)</span>
            <span>{posData.iss_position.longitude}°</span>
          </div>
          <div className="hologram-panel__row">
            <span>Độ cao</span>
            <span>~400 km</span>
          </div>
          <div className="hologram-panel__row">
            <span>Tốc độ</span>
            <span>28,000 km/h</span>
          </div>
        </>
      ) : (
        <div style={{ padding: "20px 0", textAlign: "center", color: "var(--holo-text-dim)" }}>Đang định vị...</div>
      )}
    </div>
  );
}

export default function HologramPanel({ planet }) {
  if (!planet) return null;

  if (planet.id === "iss") return <ISSPanel />;
  if (planet.id === "sun") return <SunPanel planet={planet} />;
  if (planet.id === "earth") return <EarthPanel planet={planet} />;
  if (planet.id === "mars") return <MarsPanel planet={planet} />;

  return (
    <div className="hologram-panel" style={{ position: "absolute", top: "10%", right: "5%", zIndex: 10 }}>
      <BasePlanetInfo planet={planet} />
    </div>
  );
}
