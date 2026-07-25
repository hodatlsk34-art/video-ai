"use client";

import { useCallback, useRef, useState } from "react";

export default function CompareSlider() {
  const [pos, setPos] = useState(50);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const update = useCallback((clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, pct)));
  }, []);

  return (
    <div
      ref={trackRef}
      className="group relative aspect-video w-full select-none overflow-hidden rounded-2xl border border-border"
      onMouseDown={(e) => {
        dragging.current = true;
        update(e.clientX);
      }}
      onMouseMove={(e) => dragging.current && update(e.clientX)}
      onMouseUp={() => (dragging.current = false)}
      onMouseLeave={() => (dragging.current = false)}
      onTouchStart={(e) => update(e.touches[0].clientX)}
      onTouchMove={(e) => update(e.touches[0].clientX)}
      role="slider"
      aria-label="So sánh video gốc và video đã xử lý AI"
      aria-valuenow={Math.round(pos)}
      aria-valuemin={0}
      aria-valuemax={100}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 5));
        if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 5));
      }}
    >
      {/* AFTER layer (full) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#1c3b36_0%,#0a0d12_55%)]">
        <div
          className="absolute inset-0 opacity-90"
          style={{
            backgroundImage:
              "repeating-linear-gradient(115deg, rgba(71,224,194,0.10) 0px, rgba(71,224,194,0.10) 2px, transparent 2px, transparent 14px)",
          }}
        />
        <span className="font-mono absolute right-4 top-4 rounded-full border border-teal/40 bg-teal/10 px-3 py-1 text-[11px] text-teal">
          SAU · 4K UPSCALE + STYLE
        </span>
      </div>

      {/* BEFORE layer (clipped) */}
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,#2a2130_0%,#0a0d12_55%)]"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(255,92,138,0.08) 0px, rgba(255,92,138,0.08) 1px, transparent 1px, transparent 6px)",
          }}
        />
        <span className="font-mono absolute left-4 top-4 rounded-full border border-magenta/40 bg-magenta/10 px-3 py-1 text-[11px] text-magenta">
          TRƯỚC · GỐC 480P
        </span>
      </div>

      {/* handle */}
      <div
        className="absolute top-0 bottom-0 w-px bg-text/60"
        style={{ left: `${pos}%` }}
      >
        <div className="absolute top-1/2 left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-text/40 bg-surface text-[11px] font-mono">
          ⇔
        </div>
      </div>
    </div>
  );
}
