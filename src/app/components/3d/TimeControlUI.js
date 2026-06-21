"use client";

import { useSceneStore } from "../../../lib/store";

const SPEEDS = [0, 0.5, 1, 2, 5, 10, 20, 50, 100];

export default function TimeControlUI() {
  const { timeScale, setTimeScale } = useSceneStore();
  
  // Find closest index if somehow timeScale doesn't match exactly
  let currentIndex = SPEEDS.indexOf(timeScale);
  if (currentIndex === -1) currentIndex = 2; // default to 1x

  return (
    <div className="time-control">
      <input
        type="range"
        min={0}
        max={SPEEDS.length - 1}
        step={1}
        value={currentIndex}
        onChange={(e) => setTimeScale(SPEEDS[Number(e.target.value)])}
      />
      <span className="time-control__value">
        {timeScale}x <span className="hidden-mobile" style={{ color: "var(--holo-text-dim)", fontWeight: "normal", fontSize: "10px" }}>— Earth: {timeScale === 0 ? "Dừng" : `${(60 / timeScale).toFixed(1)}s/v`}</span>
      </span>
    </div>
  );
}
