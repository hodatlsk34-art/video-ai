import Link from "next/link";
import Nav from "@/components/Nav";
import CompareSlider from "@/components/CompareSlider";

const steps = [
  {
    tag: "01 · TẢI LÊN",
    title: "Video của chính bạn",
    body: "Kéo thả file .mp4/.mov. Chỉ chấp nhận video bạn sở hữu hoặc có quyền sử dụng — hệ thống yêu cầu xác nhận quyền trước khi xử lý.",
  },
  {
    tag: "02 · XỬ LÝ",
    title: "Style transfer & upscale",
    body: "Chọn một hoặc cả hai pipeline. Job được đẩy vào hàng đợi GPU, chạy song song, không chặn giao diện.",
  },
  {
    tag: "03 · TẢI VỀ",
    title: "Xem trước & xuất file",
    body: "So sánh trước/sau ngay trong trình duyệt, chọn độ phân giải xuất và tải về hoặc lưu vào thư viện.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-bg">
      <Nav />

      <section className="mx-auto max-w-6xl px-6 pt-16 pb-10 md:pt-24">
        <div className="grid gap-12 md:grid-cols-[1.1fr_1fr] md:items-center">
          <div>
            <p className="font-mono mb-5 text-[12px] tracking-widest text-text-muted">
              CÔNG CỤ NGHIÊN CỨU AI VIDEO
            </p>
            <h1 className="font-display text-4xl font-semibold leading-[1.08] tracking-tight md:text-6xl">
              Tái tạo video
              <br />
              bằng <span className="text-teal">chính</span> khung hình{" "}
              <span className="text-magenta">của bạn</span>.
            </h1>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-text-muted">
              Reframe là môi trường thử nghiệm style transfer và upscale video
              bằng AI — dành cho video do bạn tải lên. Không xử lý nội dung
              tải xuống từ nền tảng khác mà bạn không sở hữu quyền.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/studio"
                className="rounded-full bg-teal px-6 py-3 text-[14px] font-medium text-[#05100d] transition hover:brightness-110"
              >
                Mở Studio
              </Link>
              <Link
                href="#quy-trinh"
                className="rounded-full border border-border px-6 py-3 text-[14px] font-medium text-text transition hover:border-text-muted"
              >
                Xem quy trình
              </Link>
            </div>
          </div>

          <div>
            <CompareSlider />
            <p className="font-mono mt-3 text-center text-[11px] text-text-muted">
              KÉO THANH ĐỂ SO SÁNH · DEMO MINH HOẠ
            </p>
          </div>
        </div>
      </section>

      <section id="quy-trinh" className="border-t border-border bg-surface/40">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="font-display text-2xl font-semibold md:text-3xl">
            Quy trình ba bước
          </h2>
          <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.tag} className="bg-bg p-7">
                <p className="font-mono text-[11px] text-teal">{s.tag}</p>
                <h3 className="font-display mt-3 text-lg font-medium">
                  {s.title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-text-muted">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="rounded-2xl border border-border bg-surface p-7">
            <p className="font-mono text-[11px] text-magenta">
              CAM KẾT BẢN QUYỀN
            </p>
            <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-text-muted">
              Bạn xác nhận quyền sở hữu hoặc quyền sử dụng hợp pháp cho mỗi
              video tải lên. Reframe không hỗ trợ tải xuống hay xử lý lại nội
              dung từ YouTube hoặc nền tảng khác khi chưa có sự cho phép của
              chủ sở hữu.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-6xl px-6 text-[12px] text-text-muted">
          © {new Date().getFullYear()} Reframe — bản nghiên cứu nội bộ.
        </div>
      </footer>
    </div>
  );
}
