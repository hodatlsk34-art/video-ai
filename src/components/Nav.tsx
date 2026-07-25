import Link from "next/link";

const links = [
  { href: "/studio", label: "Studio" },
  { href: "/library", label: "Thư viện" },
  { href: "/pricing", label: "Bảng giá" },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-bg/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display text-lg font-semibold tracking-tight">
            re<span className="text-teal">frame</span>
          </span>
          <span className="font-mono text-[10px] text-text-muted border border-border rounded-full px-2 py-0.5">
            RESEARCH BUILD
          </span>
        </Link>
        <nav className="hidden gap-8 font-mono text-[13px] text-text-muted md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="transition hover:text-text">
              {l.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/studio"
          className="rounded-full bg-teal px-4 py-2 text-[13px] font-medium text-[#05100d] transition hover:brightness-110"
        >
          Bắt đầu xử lý
        </Link>
      </div>
    </header>
  );
}
