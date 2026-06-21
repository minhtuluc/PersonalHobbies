import Link from "next/link";

export const metadata = {
  title: "Portfolio - Minh Tú Luc",
  description: "Trưng bày các dự án, sản phẩm phần mềm và demo công nghệ cá nhân.",
};

const projects = [
  {
    id: 1,
    title: "EcoStore - Ứng dụng E-commerce",
    tagline: "Kiến trúc hệ thống thương mại điện tử hiệu năng cao.",
    description: "Thiết kế kiến trúc hệ thống phân tán với Next.js App Router và Prisma ORM. Triển khai thuật toán tối ưu hóa render tĩnh (SSG) kết hợp tích hợp gateway thanh toán Stripe an toàn, đạt hiệu suất tải trang phân vị 95th (P95) dưới 1.2s.",
    tech: ["Next.js", "PostgreSQL", "Prisma", "Stripe"],
    link: "https://github.com/minhtuluc/ecostore",
    isInternal: false,
    icon: "🛍️"
  },
  {
    id: 2,
    title: "SpaceExplorer - Game HTML5",
    tagline: "Động cơ mô phỏng vật lý 2D trực tuyến thời gian thực.",
    description: "Xây dựng vòng lặp game (Game Loop) hiệu năng cao sử dụng Phaser3. Thiết kế cơ chế đồng bộ hóa trạng thái (State Synchronization) thời gian thực thông qua WebSockets (Socket.io) giảm thiểu độ trễ mạng (network latency).",
    tech: ["HTML5 Canvas", "Phaser3", "NodeJS", "Socket.io"],
    link: "https://github.com/minhtuluc/space-explorer",
    isInternal: false,
    icon: "🚀"
  },
  {
    id: 3,
    title: "AssistantAI - Chatbot thông minh",
    tagline: "Tích hợp mô hình ngôn ngữ lớn qua kiến trúc Edge Computing.",
    description: "Thiết kế kiến trúc Serverless Edge nhằm tối ưu hóa quá trình stream luồng dữ liệu (SSE) trực tiếp từ Gemini API. Đảm bảo độ trễ phản hồi (Time To First Byte - TTFB) ở mức tối thiểu cho trải nghiệm tương tác tự nhiên.",
    tech: ["Next.js", "Edge Runtime", "Gemini API", "SSE"],
    link: "https://github.com/minhtuluc/assistant-ai",
    isInternal: false,
    icon: "🤖"
  },
  {
    id: 4,
    title: "Hologram Solar System 3D",
    tagline: "Hệ thống trạm theo dõi vũ trụ 3D tích hợp dữ liệu thời gian thực.",
    description: "Xây dựng môi trường không gian 3D tương tác với Three.js và React Three Fiber. Tích hợp trực tiếp dữ liệu từ NASA, Open-Notify và The Space Devs để tracking toạ độ ISS, danh sách phi hành gia và lịch phóng tàu vũ trụ.",
    tech: ["Three.js", "React Three Fiber", "Zustand", "SWR"],
    link: "/portfolio/solar-system",
    isInternal: true,
    icon: "🌌"
  },
  {
    id: 5,
    title: "Smart Greeter - Trợ lý IoT thông minh",
    tagline: "Kiến trúc hệ thống IoT đa luồng tích hợp cảm biến kết hợp (Sensor Fusion).",
    description: "Kỹ nghệ hóa thiết bị SoC ESP32-S3 sử dụng FreeRTOS. Tổ chức các luồng ưu tiên độc lập (Preemptive Multitasking) nhằm song song hóa việc giải mã đa phương tiện (I2S Audio & TFT Animated GIF) mà không gây tắc nghẽn (bottleneck). Thuật toán phân tích radar LD2410C tối ưu hóa quản lý năng lượng tĩnh.",
    tech: ["ESP32-S3", "FreeRTOS", "TFT_eSPI", "I2S", "C/C++"],
    link: "https://github.com/minhtuluc/smart-greeter",
    isInternal: false,
    icon: "📟"
  },
  {
    id: 6,
    title: "OmniMart WebClient",
    tagline: "Tái cấu trúc kiến trúc UI/UX hướng tới hiệu năng tải nhận thức (Perceived Performance).",
    description: "Tiến hành phân tích và tái thiết kế giao diện bằng hệ thống Vanilla CSS kiểm soát cao. Triển khai mô hình phản hồi thị giác phi đồng bộ (Framer Motion Toasts) và cơ chế tải tuần tự mô phỏng (Shimmer Skeletons), liên kết chặt chẽ với hạ tầng dữ liệu Supabase thông qua kiến trúc hướng sự kiện.",
    tech: ["React", "Framer Motion", "Supabase", "Vanilla CSS"],
    link: "https://github.com/minhtuluc/OmniMartDeploy",
    isInternal: false,
    icon: "🛒"
  },
  {
    id: 7,
    title: "Java Swing Employee Management",
    tagline: "Kiến trúc ứng dụng Client-Server hạng nhẹ tập trung vào tối ưu vùng nhớ.",
    description: "Thực hiện quyết định thiết kế cốt lõi: loại bỏ các thư viện UI tùy biến (FlatLaf) để áp dụng Native System Look & Feel. Điều này giúp giảm thiểu đáng kể chi phí render đồ họa và vùng nhớ Heap. Thiết kế kiến trúc phần mềm chuẩn MVC cho cơ chế CRUD phân quyền qua giao tiếp JDBC MySQL.",
    tech: ["Java Swing", "JDBC", "MySQL", "Software Architecture"],
    link: "https://github.com/minhtuluc/JavaEmpManagement",
    isInternal: false,
    icon: "🖥️"
  },
  {
    id: 8,
    title: "Low Budget Snake - C++ Console Game",
    tagline: "Kiến trúc vòng lặp game (Game Loop) tối giản trên môi trường Terminal.",
    description: "Kỹ nghệ hóa phiên bản kinh điển của tựa game Rắn săn mồi bằng C++ thuần. Tập trung vào việc thiết kế cấu trúc dữ liệu tuyến tính (Linked List / Queue) để tối ưu hóa quản lý bộ nhớ và xử lý thao tác điều khiển không đồng bộ trên giao diện dòng lệnh.",
    tech: ["C++", "Data Structures", "Algorithms", "Game Loop"],
    link: "https://github.com/minhtuluc/LowBudgetSnake",
    isInternal: false,
    icon: "🐍"
  }
];

export default function PortfolioPage() {
  return (
    <div className="main-content">


      {/* Hero Section */}
      <section className="product-tile product-tile-dark">
        <div className="tile-content">
          <span className="tagline" style={{ color: "var(--color-primary-on-dark)", marginBottom: "var(--spacing-xs)" }}>
            Sản phẩm & Nghiên cứu
          </span>
          <h1 className="hero-display" style={{ color: "var(--color-body-on-dark)", marginBottom: "var(--spacing-sm)" }}>
            Ý tưởng thành sản phẩm.
          </h1>
          <p className="lead" style={{ color: "var(--color-body-muted)", maxWidth: "600px", margin: "0 auto", fontWeight: "300" }}>
            Trưng bày các dự án mã nguồn mở, sản phẩm thực tế và các demo thử nghiệm công nghệ của tôi.
          </p>
        </div>
      </section>

      {/* Grid of Projects */}
      <section id="projects" style={{ backgroundColor: "var(--color-canvas)" }}>
        <div className="grid-container">
          <h2 className="display-md" style={{ color: "var(--color-ink)", marginBottom: "var(--spacing-lg)" }}>
            Dự án đã thực hiện
          </h2>
          
          <div className="card-grid">
            {projects.map((project) => (
              <div key={project.id} className="store-card">
                <div className="card-image-box">
                  <span style={{ fontSize: "32px" }}>
                    {project.icon || "📁"}
                  </span>
                </div>
                <div className="caption" style={{ color: "var(--color-primary)", fontWeight: "600", marginBottom: "var(--spacing-xxs)" }}>
                  {project.tagline}
                </div>
                <h3 className="card-title">{project.title}</h3>
                <p className="card-desc">{project.description}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "var(--spacing-md)" }}>
                  {project.tech.map((t) => (
                    <span 
                      key={t} 
                      className="caption" 
                      style={{ 
                        backgroundColor: "var(--color-canvas-parchment)", 
                        color: "var(--color-ink-muted-80)", 
                        padding: "2px 8px", 
                        borderRadius: "var(--radius-xs)",
                        fontSize: "11px"
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
                {project.isInternal ? (
                  <Link 
                    href={project.link} 
                    className="button-primary"
                    style={{ alignSelf: "flex-start", marginTop: "auto", width: "100%", textDecoration: "none", textAlign: "center" }}
                  >
                    Xem mô phỏng
                  </Link>
                ) : (
                  <a 
                    href={project.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="button-primary"
                    style={{ alignSelf: "flex-start", marginTop: "auto", width: "100%", textDecoration: "none", textAlign: "center" }}
                  >
                    Chi tiết dự án
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
