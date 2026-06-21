# Solar System Explorer — Bản Kế Hoạch Tham Chiếu Duy Nhất (Hợp nhất nguyên trạng v3 & v4)

Tài liệu này là bản hợp nhất toàn bộ nội dung của phiên bản v3 và v4 mà KHÔNG LƯỢC BỎ bất kỳ chi tiết, đoạn code, hay bảng biểu nào để làm 1 tài liệu tham chiếu duy nhất.

---

## PHẦN 1: MÔ HÌNH QUỸ ĐẠO THỰC TẾ (Nội dung từ v3)

> Bối cảnh thay đổi: dự án này giờ là **làm mới hoàn toàn** (không cần đọc/tận dụng code 2D cũ), mục tiêu là **demo năng lực WebGL/R3F**, với quỹ đạo mô phỏng bám sát số liệu thiên văn thật theo 3 quyết định đã chốt:
> 1. Khoảng cách quỹ đạo = tỷ lệ thật. Kích thước hành tinh = phóng to riêng để nhìn được.
> 2. Tốc độ quay quỹ đạo = tính đúng theo định luật Kepler (T² ∝ a³).
> 3. Có slider cho người dùng chỉnh tốc độ thời gian mô phỏng.

Phần này **thay thế** mục G (Dữ liệu hành tinh) và bổ sung thêm cho mục E/K của bản v2.

### 1. Insight quan trọng: Kepler giúp đơn giản hoá data

Vì dùng đúng `T² ∝ a³` (giả định quỹ đạo tròn, đủ tốt cho mục đích demo — độ lệch elip thật của các hành tinh rất nhỏ trừ Sao Thủy/Sao Hỏa), ta **không cần lưu sẵn period (năm)** cho từng hành tinh. Chỉ cần lưu `semiMajorAxisAU` (bán trục lớn, đơn vị AU) — period tự suy ra bằng code:

```
T (năm) = a^1.5   (a tính bằng AU)
```

→ Data hành tinh gọn lại chỉ còn 2 thông số vật lý thật cần thiết: **bán trục lớn (AU)** và **bán kính thật (km)**. Kiểm chứng nhanh, sai số gần như 0 so với số liệu NASA thật:

| Hành tinh | a (AU) | T tính = a^1.5 (năm) | T thật (năm) |
|---|---|---|---|
| Mercury | 0.39 | 0.243 | 0.241 |
| Venus | 0.72 | 0.611 | 0.615 |
| Earth | 1.00 | 1.000 | 1.000 |
| Mars | 1.52 | 1.874 | 1.881 |
| Jupiter | 5.20 | 11.86 | 11.86 |
| Saturn | 9.58 | 29.66 | 29.46 |
| Uranus | 19.18 | 83.97 | 84.01 |
| Neptune | 30.07 | 164.9 | 164.8 |

### 2. Data hành tinh (đầy đủ, dùng số liệu thật)

```js
// lib/planetsData.js
export const AU_TO_SCENE_UNITS = 8;     // 1 AU = 8 đơn vị scene
export const SECONDS_PER_EARTH_YEAR = 20; // tại timeScale = 1: Earth quay hết 1 vòng trong 20s thật

export const SUN = {
  id: "sun",
  label: "Mặt Trời",
  realRadiusKm: 696000,
};

export const PLANETS = [
  { id: "mercury", label: "Sao Thủy",  semiMajorAxisAU: 0.39, realRadiusKm: 2440,  texture: "/textures/mercury_2k.jpg" },
  { id: "venus",   label: "Sao Kim",   semiMajorAxisAU: 0.72, realRadiusKm: 6052,  texture: "/textures/venus_2k.jpg" },
  { id: "earth",   label: "Trái Đất",  semiMajorAxisAU: 1.00, realRadiusKm: 6371,  texture: "/textures/earth_2k.jpg", hasAPOD: true },
  { id: "mars",    label: "Sao Hỏa",   semiMajorAxisAU: 1.52, realRadiusKm: 3390,  texture: "/textures/mars_2k.jpg", hasMarsRover: true },
  { id: "jupiter", label: "Sao Mộc",   semiMajorAxisAU: 5.20, realRadiusKm: 69911, texture: "/textures/jupiter_2k.jpg" },
  { id: "saturn",  label: "Sao Thổ",   semiMajorAxisAU: 9.58, realRadiusKm: 58232, texture: "/textures/saturn_2k.jpg", hasRing: true },
  { id: "uranus",  label: "Sao Thiên Vương", semiMajorAxisAU: 19.18, realRadiusKm: 25362, texture: "/textures/uranus_2k.jpg" },
  { id: "neptune", label: "Sao Hải Vương", semiMajorAxisAU: 30.07, realRadiusKm: 24622, texture: "/textures/neptune_2k.jpg" },
];
```

> **Ghi chú khoảng cách**: với `AU_TO_SCENE_UNITS = 8`, Sao Thủy ở scene-unit ~3.1, Sao Hải Vương ở ~240. Đây là chênh lệch ~77 lần — **chấp nhận được vì đúng tỷ lệ thật**, nhưng kéo theo vài hệ quả kỹ thuật ở mục 4 (camera, depth buffer, ánh sáng).

### 3. Module tính toán tỷ lệ (orbitalScale.js)

```js
// lib/orbitalScale.js
import { AU_TO_SCENE_UNITS, SECONDS_PER_EARTH_YEAR } from "./planetsData";

// Khoảng cách: tỷ lệ thật tuyến tính
export function getOrbitRadiusScene(semiMajorAxisAU) {
  return semiMajorAxisAU * AU_TO_SCENE_UNITS;
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
  const desired = 2.6;
  const safetyMargin = 0.6; // để vẫn nhìn thấy khoảng trống quỹ đạo Sao Thủy
  return Math.min(desired, mercuryOrbitScene - safetyMargin);
}

// Kepler: T (năm) = a^1.5  → góc quay mỗi giây thực (rad/s) tại timeScale = 1
export function getAngularSpeedRadPerSec(semiMajorAxisAU) {
  const periodYears = Math.pow(semiMajorAxisAU, 1.5);
  const periodSeconds = periodYears * SECONDS_PER_EARTH_YEAR;
  return (2 * Math.PI) / periodSeconds;
}
```

### 4. Hệ quả kỹ thuật của việc dùng tỷ lệ thật (PHẦN BẮT BUỘC PHẢI XỬ LÝ)

Dùng đúng tỷ lệ thật cho khoảng cách tạo ra chênh lệch lớn về độ lớn số (scale range), gây 3 vấn đề kỹ thuật điển hình của renderer 3D — đúng kiểu vấn đề mà 1 "demo năng lực WebGL" nên xử lý đẹp để chứng tỏ hiểu sâu:

#### 4.1. Z-fighting / depth precision ở khoảng cách lớn
```js
// Scene3D.js — khi tạo renderer/canvas
<Canvas
  gl={{ logarithmicDepthBuffer: true, antialias: true }}
  camera={{ near: 0.1, far: 3000, fov: 50 }}
>
```
`logarithmicDepthBuffer: true` giúp giữ độ chính xác depth-test khi scene có vật ở cả khoảng cách 3 và 240 đơn vị cùng lúc — nếu không bật, các đối tượng xa dễ bị "xuyên" sai lớp (z-fighting).

#### 4.2. Ánh sáng tắt dần ở hành tinh xa (decay thật sẽ làm Hải Vương đen)
Point light có decay vật lý thật (`decay=2`, inverse-square) sẽ làm Sao Hải Vương ở 240 unit gần như tối đen — đúng vật lý nhưng xấu cho demo. Giải pháp:
```js
<pointLight position={[0,0,0]} intensity={400} decay={1} distance={0}/>
// decay={1} (giảm dần chậm hơn thật) + intensity cao, kèm tone mapping ACES để không bị cháy sáng gần Mặt Trời
```
Cấu hình tone mapping ở Canvas: `gl={{ toneMapping: THREE.ACESFilmicToneMapping }}`.

#### 4.3. Camera & OrbitControls phải hỗ trợ dải zoom rất rộng
```js
<OrbitControls makeDefault minDistance={2} maxDistance={400} />
```
Và cân nhắc: camera mặc định nên đặt ở vị trí nhìn được nhóm hành tinh trong (Mercury→Mars) rõ, có nút "Xem toàn hệ" để tự động lùi xa đủ thấy Hải Vương (dùng lại cơ chế `useCameraLockOn` đã thiết kế ở v2, target = gốc tọa độ, offset xa hơn).

### 5. Time-scale slider (mới)

Mở rộng store đã thiết kế ở v2:

```js
// lib/store.js
export const useSceneStore = create((set) => ({
  // ...giữ các field cũ (selectedPlanet, cameraTarget...)
  timeScale: 1,              // 1 = tốc độ chuẩn (Earth = 20s/vòng)
  setTimeScale: (v) => set({ timeScale: v }),
}));
```

Áp dụng trong loop quay hành tinh:

```js
// Planet.js
import { useFrame } from "@react-three/fiber";
import { getAngularSpeedRadPerSec } from "../lib/orbitalScale";
import { useSceneStore } from "../lib/store";

function Planet({ semiMajorAxisAU, orbitRadiusScene, ...props }) {
  const angleRef = useRef(Math.random() * Math.PI * 2); // lệch pha ngẫu nhiên cho đẹp mắt
  const baseSpeed = getAngularSpeedRadPerSec(semiMajorAxisAU);

  useFrame((_, delta) => {
    const timeScale = useSceneStore.getState().timeScale; // đọc trực tiếp, tránh re-render
    angleRef.current += baseSpeed * timeScale * delta;
    const x = Math.cos(angleRef.current) * orbitRadiusScene;
    const z = Math.sin(angleRef.current) * orbitRadiusScene;
    meshRef.current.position.set(x, 0, z);
  });
  // ...
}
```

> Lưu ý hiệu năng: đọc `useSceneStore.getState()` trực tiếp trong `useFrame` (không subscribe qua hook) để tránh re-render React mỗi frame — chỉ cần giá trị tại thời điểm tính, không cần component re-render theo `timeScale`.

#### UI Slider (đặt trong overlay HTML, không phải trong Canvas)
```jsx
// components/TimeControlUI.js — render NGOÀI <Canvas>, là 1 lớp HTML overlay thường
<input
  type="range" min={0} max={50} step={1}
  value={timeScale}
  onChange={(e) => setTimeScale(Number(e.target.value))}
/>
<span>{timeScale}x — Earth: {(20 / Math.max(timeScale,0.01)).toFixed(1)}s/vòng</span>
```
Gợi ý range: 0–50x là đủ để thấy rõ hiệu ứng "hành tinh xa quay chậm hơn nhiều" (ở 1x phải chờ Sao Hải Vương quay hết vòng mất 164.9×20s ≈ 55 phút — cần slider tăng tốc để demo trong thời gian ngắn).

### 6. Cập nhật Roadmap (bỏ phần liên quan code cũ)

Vì không cần tận dụng gì từ bản 2D, roadmap ở v2 bỏ bước "đọc code cũ", thay bằng:

1. Setup Next.js client component trống + Canvas + OrbitControls + `logarithmicDepthBuffer`.
2. Implement `orbitalScale.js` + test độc lập bằng console.log (không cần render gì) — verify bảng Kepler ở mục 1 khớp.
3. Render Mặt Trời + 8 hành tinh ở đúng vị trí ban đầu (chưa quay) — verify khoảng cách tương đối đúng tỷ lệ bằng mắt.
4. Thêm orbit animation theo `useFrame` + Kepler speed — verify Sao Thủy quay rõ rệt nhanh hơn Sao Hải Vương.
5. Thêm `timeScale` store + slider UI — verify chỉnh slider đổi tốc độ ngay, không giật.
6. Thêm camera lock-on + zustand `selectedPlanet` (theo thiết kế v2 mục F).
7. Thêm Hologram panel + 3 API tích hợp (theo v2 mục H/I/J) — phần này giữ nguyên không đổi so với v2.
8. Tinh chỉnh ánh sáng/tone-mapping/bloom theo mục 4.2 ở trên.
9. Performance pass + test trên mobile.

### 7. Việc cần làm tiếp để plan "đủ tham số giao agent"

Theo đánh giá lượt trước, phần Data (mục 2) giờ đã đủ đầy cho 8 hành tinh thật. Còn thiếu để hoàn toàn agent-ready:
- Spec UI chính xác (màu, font) cho Hologram + slider — chưa chốt.
- Xác nhận asset texture: agent tự tải từ solarsystemscope.com hay bạn cung cấp sẵn file?
- Pin version cụ thể cho `three`/`@react-three/fiber`/`@react-three/drei`.

---

## PHẦN 2: UI SPEC, ASSET STRATEGY, PINNED VERSIONS (Nội dung từ v4)

### 1. UI Spec — Hologram Panel & Time Slider

Phong cách đã chốt từ đầu: "màn hình nổi Hologram". Spec cụ thể dưới đây để agent không tự đoán màu/font.

#### 1.1 Design tokens (CSS variables — đặt ở file global hoặc trong component)

```css
:root {
  --holo-bg: rgba(8, 20, 28, 0.55);           /* nền kính mờ, ngả xanh đen */
  --holo-border: rgba(0, 229, 255, 0.65);     /* viền cyan phát sáng */
  --holo-border-glow: rgba(0, 229, 255, 0.35);
  --holo-accent: #00e5ff;                     /* cyan chính — text nổi bật, số liệu */
  --holo-accent-secondary: #7df9ff;           /* cyan nhạt hơn — label phụ */
  --holo-text: #d6f6ff;                       /* text thường, hơi ánh xanh, không dùng trắng tinh */
  --holo-text-dim: rgba(214, 246, 255, 0.55);
  --holo-warn: #ff8a3d;                       /* dùng cho trạng thái lỗi/API fail */
  --holo-radius: 10px;
  --holo-font-display: "Orbitron", sans-serif;   /* tiêu đề, số đếm ngược — cảm giác sci-fi */
  --holo-font-mono: "JetBrains Mono", "Space Mono", monospace; /* số liệu, label — cảm giác HUD */
}
```

> Cả 2 font đều có sẵn miễn phí trên Google Fonts, agent tự `@import` hoặc dùng `next/font/google`.

#### 1.2 HologramPanel — cấu trúc & style cụ thể

```css
.hologram-panel {
  width: 260px;
  padding: 14px 16px;
  background: var(--holo-bg);
  border: 1px solid var(--holo-border);
  border-radius: var(--holo-radius);
  backdrop-filter: blur(8px);
  box-shadow:
    0 0 12px var(--holo-border-glow),
    inset 0 0 18px rgba(0, 229, 255, 0.08);
  color: var(--holo-text);
  font-family: var(--holo-font-mono);
  font-size: 12.5px;
  line-height: 1.5;
  position: relative;
  overflow: hidden;
}

/* Hiệu ứng "scan line" quét ngang lặp lại — tăng cảm giác hologram, chi phí GPU gần như 0 */
.hologram-panel::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(0, 229, 255, 0.06) 50%,
    transparent 100%
  );
  background-size: 100% 6px;
  animation: holo-scan 3.5s linear infinite;
  pointer-events: none;
}
@keyframes holo-scan {
  from { background-position-y: 0; }
  to   { background-position-y: 200px; }
}

.hologram-panel__title {
  font-family: var(--holo-font-display);
  font-size: 14px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--holo-accent);
  margin-bottom: 8px;
  border-bottom: 1px solid var(--holo-border-glow);
  padding-bottom: 6px;
}

.hologram-panel__row {
  display: flex;
  justify-content: space-between;
  color: var(--holo-text-dim);
}
.hologram-panel__row span:last-child {
  color: var(--holo-accent-secondary);
}

.hologram-panel__error {
  color: var(--holo-warn);
  font-size: 11px;
}

.hologram-panel__image {
  width: 100%;
  border-radius: 6px;
  margin-top: 8px;
  filter: saturate(1.05) contrast(1.05);
  border: 1px solid var(--holo-border-glow);
}
```

Quy tắc bố cục nội dung theo loại hành tinh (đúng theo plan gốc):
- **Earth** → title "TRẠM QUAN SÁT — APOD", ảnh APOD + caption ngày, dùng `.hologram-panel__image`.
- **Mars** → title "MARS ROVER FEED", ảnh rover gần nhất + tên rover/sol.
- **Mọi hành tinh khác** (không có API riêng) → chỉ hiện thông số vật lý: bán kính thật (km), khoảng cách (AU), chu kỳ quỹ đạo tính được — dùng `.hologram-panel__row` lặp lại.
- **Bất kỳ panel nào** khi API lỗi → thay nội dung bằng `.hologram-panel__error` + text ngắn, **không để trống**.

#### 1.3 Time Slider — overlay HTML (ngoài Canvas, góc dưới màn hình)

```css
.time-control {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  background: var(--holo-bg);
  border: 1px solid var(--holo-border);
  border-radius: 999px;     /* pill shape — khác panel để phân biệt vai trò "control" vs "info" */
  backdrop-filter: blur(8px);
  font-family: var(--holo-font-mono);
  font-size: 12px;
  color: var(--holo-text);
}

.time-control input[type="range"] {
  width: 160px;
  accent-color: var(--holo-accent);  /* track/thumb theo màu cyan, browser hỗ trợ native */
}

.time-control__value {
  min-width: 70px;
  text-align: right;
  color: var(--holo-accent);
  font-weight: 600;
}
```

Layout: pill nằm giữa, cố định dưới màn hình — không che hành tinh, không che HologramPanel (panel luôn ở 1/3 trên màn hình nhờ offset Y trong code R3F).

#### 1.4 Responsive (mobile)
- `.hologram-panel`: `width: 260px` → đổi thành `width: min(78vw, 260px)` để không vượt khung trên điện thoại.
- `.time-control`: trên mobile thu input range xuống `width: 110px`, ẩn `__value` chi tiết giây/vòng, chỉ hiện số "x".

### 2. Chiến lược Asset cho Agent (tự tìm trước, có cơ chế override sau)

Vì bạn sẽ **để agent tự tìm texture trước**, và **tự feed file khác vào nếu không ổn**, plan cần 2 việc: (a) hướng dẫn agent tìm đúng nguồn hợp lệ, (b) thiết kế code sao cho việc bạn thay file sau này **không cần sửa code**, chỉ cần đúng tên file/kích thước.

#### 2.1 Hướng dẫn tìm asset cho agent
- Ưu tiên nguồn: **solarsystemscope.com/textures** (license free for personal & commercial, có ghi rõ trên trang), hoặc NASA Visible Earth / NASA 3D Resources (public domain).
- Agent cần xác nhận: ảnh là **texture dạng equirectangular** (tỷ lệ 2:1, ví dụ 2048×1024) — không phải ảnh chụp thường, nếu lấy sai loại ảnh, sphere sẽ bị méo ở 2 cực.
- Không lấy texture có watermark, logo, hoặc text đè lên.
- Nếu không tìm được nguồn rõ license → agent dùng **placeholder màu đơn sắc** (theo màu trung bình thật của hành tinh, liệt kê ở 2.3) thay vì chặn cả task lại.

#### 2.2 Naming convention cố định (để bạn dễ thay sau, không cần sửa code)

```
public/textures/
  sun_color.jpg
  mercury_color.jpg
  venus_color.jpg
  earth_color.jpg
  earth_normal.jpg        (optional — chỉ Earth cần normal map theo plan gốc)
  mars_color.jpg
  jupiter_color.jpg
  saturn_color.jpg
  saturn_ring.png         (alpha PNG riêng cho vành đai)
  uranus_color.jpg
  neptune_color.jpg
```

Code load texture **luôn tham chiếu đúng các tên này** (qua `planetsData.js`), không hardcode tên file ngẫu nhiên mà agent tự đặt — nhờ vậy bạn chỉ cần kéo file mới đè lên đúng tên, không động vào code.

#### 2.3 Placeholder fallback (màu trung bình thật — agent dùng khi chưa có texture tốt)

| Hành tinh | Hex màu fallback |
|---|---|
| Sun | `#fff4d6` |
| Mercury | `#9c9c97` |
| Venus | `#e8d4a0` |
| Earth | `#3a6ea5` |
| Mars | `#b3552c` |
| Jupiter | `#d8ae7e` |
| Saturn | `#e3d3a4` |
| Uranus | `#a9d8e0` |
| Neptune | `#3454a6` |

```js
// Planet.js — fallback an toàn nếu texture load lỗi/chưa có
<meshStandardMaterial
  color={planet.fallbackColor}
  map={texture ?? null}
/>
```

> Cách này giúp **agent luôn ra được kết quả render được ngay**, không bị block vì thiếu asset đẹp — và khi bạn feed texture thật vào đúng tên file, kết quả tự nâng cấp mà không cần đụng code.

### 3. Khuyến nghị Pin Version (đã kiểm tra version hiện hành)

Đã tra cứu version mới nhất tại thời điểm hiện tại. Khuyến nghị **không** dùng các bản mới nhất tuyệt đối của `@react-three/fiber`/`drei` nếu chúng đang ở pha chuyển major version lớn (R3F v10 đi kèm thay đổi nội bộ khá lớn — đổi `state.gl` thành `state.renderer`, thêm WebGPU/TSL) — rủi ro vài API/cú pháp trong plan này (vd `useThree`, `<Html>`) lệch theo bản rất mới chưa ổn định rộng rãi.

```json
{
  "dependencies": {
    "three": "^0.184.0",
    "@react-three/fiber": "^9.6.1",
    "@react-three/drei": "^10.7.7",
    "@react-three/postprocessing": "^2.19.1",
    "postprocessing": "^6.36.4",
    "zustand": "^5.0.3",
    "satellite.js": "^5.0.0",
    "axios": "^1.7.9",
    "swr": "^2.2.5"
  }
}
```

Lý do chọn dải version này:
- `@react-three/fiber@9.x` là bản ổn định pair với **React 19** (R3F v8 chỉ dành cho React 18) — kiểm tra `react`/`react-dom` trong `package.json` hiện tại của bạn đang ở major nào trước khi cài, vì fiber v8 vs v9 **không thể lẫn**.
- `@react-three/drei@10.x` là bản ổn định khớp với fiber v9 (drei v11 đi cùng fiber v10 alpha — chưa nên dùng cho dự án cần chạy ổn định ngay).
- `postprocessing@6.x` là peer dependency bắt buộc đi cùng `@react-three/postprocessing@2.x` — agent cần cài cả 2, thiếu 1 trong 2 sẽ lỗi runtime.

> **Lưu ý cho agent**: trước khi `npm install`, chạy `npm view @react-three/fiber versions` và `npm view @react-three/drei peerDependencies` để xác nhận version trên thật khớp với version `react` đang có trong project — vì ecosystem R3F cập nhật khá nhanh, số liệu trên có thể đã nhích lên vài bản patch tại thời điểm agent thực thi.
