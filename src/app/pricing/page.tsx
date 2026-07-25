import Nav from "@/components/Nav";

const tiers = [
  {
    name: "Nghiên cứu",
    price: "Miễn phí",
    desc: "Video dưới 30s, độ phân giải xuất tối đa 720p",
    features: ["5 job/tháng", "Hàng đợi tiêu chuẩn", "Không lưu trữ lâu dài"],
  },
  {
    name: "Studio",
    price: "Theo giây xử lý",
    desc: "Tính phí trực tiếp theo compute GPU thực tế (Replicate)",
    features: ["Không giới hạn job", "Xuất tối đa 4K", "Lưu trữ 30 ngày"],
  },
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-bg">
      <Nav />
      <div className="mx-auto max-w-4xl px-6 py-14">
        <p className="font-mono text-[11px] tracking-widest text-text-muted">
          BẢNG GIÁ
        </p>
        <h1 className="font-display mt-2 text-3xl font-semibold">
          Trả theo mức sử dụng GPU
        </h1>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {tiers.map((t) => (
            <div key={t.name} className="rounded-2xl border border-border bg-surface p-7">
              <p className="font-display text-lg font-medium">{t.name}</p>
              <p className="mt-1 text-teal font-mono text-[13px]">{t.price}</p>
              <p className="mt-3 text-[13px] text-text-muted">{t.desc}</p>
              <ul className="mt-5 space-y-2">
                {t.features.map((f) => (
                  <li key={f} className="text-[13px] text-text-muted before:content-['—_'] before:text-teal">
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
