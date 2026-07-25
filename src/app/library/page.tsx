import Nav from "@/components/Nav";

export default function Library() {
  return (
    <div className="min-h-screen bg-bg">
      <Nav />
      <div className="mx-auto max-w-4xl px-6 py-14">
        <p className="font-mono text-[11px] tracking-widest text-text-muted">
          THƯ VIỆN
        </p>
        <h1 className="font-display mt-2 text-3xl font-semibold">
          Video đã xử lý
        </h1>
        <div className="mt-10 rounded-2xl border border-dashed border-border p-14 text-center">
          <p className="text-[14px] text-text-muted">
            Chưa có video nào. Xử lý video đầu tiên trong Studio để xem tại đây.
          </p>
        </div>
      </div>
    </div>
  );
}
