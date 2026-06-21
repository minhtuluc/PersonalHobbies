import { AU_TO_SCENE_UNITS, SECONDS_PER_EARTH_YEAR } from "./planetsData";

// Khoảng cách: sử dụng phép chiếu luỹ thừa (power scale) để giãn các hành tinh gần và nén các hành tinh xa
// Bậc 0.45 giúp khoảng cách giữa các hành tinh đồng đều và dễ quan sát hơn
const ORBIT_SCALE_FACTOR = 25;
export function getOrbitRadiusScene(semiMajorAxisAU) {
  return Math.pow(semiMajorAxisAU, 0.45) * ORBIT_SCALE_FACTOR;
}

// Kích thước: nén log để các hành tinh đều nhìn thấy được nhưng vẫn giữ thứ tự to-nhỏ
const MIN_REAL_KM = 2440;   // Mercury — hành tinh nhỏ nhất trong set
const MAX_REAL_KM = 69911;  // Jupiter — lớn nhất
const MIN_SCENE_R = 0.32;
const MAX_SCENE_R = 2.0;

export function getPlanetSceneRadius(realRadiusKm) {
  const t =
    (Math.log(realRadiusKm) - Math.log(MIN_REAL_KM)) /
    (Math.log(MAX_REAL_KM) - Math.log(MIN_REAL_KM));
  return MIN_SCENE_R + t * (MAX_SCENE_R - MIN_SCENE_R);
}

// Mặt Trời: phóng to riêng nhưng PHẢI nhỏ hơn quỹ đạo Sao Thủy để không "nuốt" hành tinh đầu tiên
export function getSunSceneRadius(mercurySemiMajorAxisAU) {
  const mercuryOrbitScene = getOrbitRadiusScene(mercurySemiMajorAxisAU);
  const desired = 4.5;
  const safetyMargin = 1.5; // để vẫn nhìn thấy khoảng trống quỹ đạo Sao Thủy
  return Math.min(desired, mercuryOrbitScene - safetyMargin);
}

// Kepler: T (năm) = a^1.5  → góc quay mỗi giây thực (rad/s) tại timeScale = 1
export function getAngularSpeedRadPerSec(semiMajorAxisAU) {
  const periodYears = Math.pow(semiMajorAxisAU, 1.5);
  const periodSeconds = periodYears * SECONDS_PER_EARTH_YEAR;
  return (2 * Math.PI) / periodSeconds;
}
