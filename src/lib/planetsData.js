export const AU_TO_SCENE_UNITS = 8;     // 1 AU = 8 đơn vị scene
export const SECONDS_PER_EARTH_YEAR = 60; // tại timeScale = 1: Earth quay hết 1 vòng trong 60s thật

export const SUN = {
  id: "sun",
  label: "Mặt Trời",
  realRadiusKm: 696340,
  fallbackColor: "#fff6d9",
  texture: "/textures/2k_sun.jpg",
  mass: "1.989 × 10³⁰ kg",
  temp: "5,500 °C",
  gravity: "274 m/s²",
  type: "Sao lùn vàng (G2V)"
};

export const PLANETS = [
  { id: "mercury", label: "Sao Thủy",  semiMajorAxisAU: 0.39, realRadiusKm: 2440,  fallbackColor: "#9c9c97", texture: "/textures/2k_mercury.jpg", spinSpeed: 0.01, mass: "3.30 × 10²³ kg", temp: "-173°C tới 427°C", gravity: "3.7 m/s²", moons: 0, dayLength: "58.6 ngày Trái Đất" },
  { id: "venus",   label: "Sao Kim",   semiMajorAxisAU: 0.72, realRadiusKm: 6052,  fallbackColor: "#e8d4a0", texture: "/textures/2k_venus_atmosphere.jpg", spinSpeed: -0.005, mass: "4.87 × 10²⁴ kg", temp: "462 °C", gravity: "8.87 m/s²", moons: 0, dayLength: "243 ngày Trái Đất" },
  { id: "earth",   label: "Trái Đất",  semiMajorAxisAU: 1.00, realRadiusKm: 6371,  fallbackColor: "#3a6ea5", texture: "/textures/2k_earth_daymap.jpg", hasAPOD: true, spinSpeed: 0.05, mass: "5.97 × 10²⁴ kg", temp: "15 °C", gravity: "9.8 m/s²", moons: 1, dayLength: "24 giờ" },
  { id: "mars",    label: "Sao Hỏa",   semiMajorAxisAU: 1.52, realRadiusKm: 3390,  fallbackColor: "#b3552c", texture: "/textures/2k_mars.jpg", hasMarsRover: true, spinSpeed: 0.05, mass: "6.42 × 10²³ kg", temp: "-60 °C", gravity: "3.71 m/s²", moons: 2, dayLength: "24h 37m" },
  { id: "jupiter", label: "Sao Mộc",   semiMajorAxisAU: 5.20, realRadiusKm: 69911, fallbackColor: "#d8ae7e", texture: "/textures/2k_jupiter.jpg", spinSpeed: 0.12, mass: "1.90 × 10²⁷ kg", temp: "-108 °C", gravity: "24.79 m/s²", moons: 95, dayLength: "9h 56m" },
  { id: "saturn",  label: "Sao Thổ",   semiMajorAxisAU: 9.58, realRadiusKm: 58232, fallbackColor: "#e3d3a4", texture: "/textures/2k_saturn.jpg", ringTexture: "/textures/2k_saturn_ring_alpha.png", hasRing: true, spinSpeed: 0.11, mass: "5.68 × 10²⁶ kg", temp: "-139 °C", gravity: "10.44 m/s²", moons: 146, dayLength: "10h 34m" },
  { id: "uranus",  label: "Sao Thiên Vương", semiMajorAxisAU: 19.18, realRadiusKm: 25362, fallbackColor: "#a9d8e0", texture: "/textures/2k_uranus.jpg", spinSpeed: -0.07, mass: "8.68 × 10²⁵ kg", temp: "-195 °C", gravity: "8.87 m/s²", moons: 28, dayLength: "17h 14m" },
  { id: "neptune", label: "Sao Hải Vương", semiMajorAxisAU: 30.07, realRadiusKm: 24622, fallbackColor: "#3454a6", texture: "/textures/2k_neptune.jpg", spinSpeed: 0.07, mass: "1.02 × 10²⁶ kg", temp: "-200 °C", gravity: "11.15 m/s²", moons: 16, dayLength: "16h 6m" },
];
