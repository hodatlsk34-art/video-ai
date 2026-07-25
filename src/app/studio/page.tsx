"use client";

import { useEffect, useRef, useState } from "react";
import Nav from "@/components/Nav";

type Mode = "style" | "upscale" | "both";
type UploadState = "idle" | "uploading" | "done" | "error";

const modes: { id: Mode; label: string; desc: string }[] = [
  {
    id: "upscale",
    label: "Upscale",
    desc: "Tăng độ phân giải, khử nhiễu chi tiết",
  },
  {
    id: "style",
    label: "Style transfer",
    desc: "Áp phong cách hình ảnh mới lên video",
  },
  {
    id: "both",
    label: "Cả hai",
    desc: "Chạy nối tiếp hai pipeline",
  },
];

export default function Studio() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [uploadPct, setUploadPct] = useState(0);
  const [publicUrl, setPublicUrl] = useState<string | null>(null);
  const [manualUrl, setManualUrl] = useState("");
  const [mode, setMode] = useState<Mode>("upscale");
  const [confirmed, setConfirmed] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [progress, setProgress] = useState(0);
  const [err, setErr] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!jobId) return;
    const t = setInterval(async () => {
      const res = await fetch(`/api/status/${jobId}`);
      const data = await res.json();
      setStatus(data.status);
      setProgress(data.progress ?? 0);
      if (data.status === "done" || data.status === "error") clearInterval(t);
    }, 1200);
    return () => clearInterval(t);
  }, [jobId]);

  async function onFilePicked(f: File) {
    setFile(f);
    setPublicUrl(null);
    setErr(null);
    setUploadState("uploading");
    setUploadPct(0);

    try {
      const presignRes = await fetch("/api/upload/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: f.name,
          contentType: f.type,
          fileSize: f.size,
        }),
      });
      const presign = await presignRes.json();
      if (!presignRes.ok) throw new Error(presign.error ?? "Lỗi lấy URL upload");

      await putWithProgress(presign.uploadUrl, f, setUploadPct);

      setPublicUrl(presign.publicUrl);
      setUploadState("done");
    } catch (e) {
      setUploadState("error");
      setErr(e instanceof Error ? e.message : "Upload thất bại");
    }
  }

  async function submit() {
    setErr(null);
    if (!confirmed) {
      setErr("Bạn cần xác nhận quyền sử dụng video trước khi xử lý.");
      return;
    }
    const inputUrl = publicUrl || manualUrl;
    if (!inputUrl) {
      setErr("Tải video lên hoặc dán URL video trước.");
      return;
    }
    const res = await fetch("/api/process", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inputUrl, mode }),
    });
    const data = await res.json();
    if (data.jobId) {
      setJobId(data.jobId);
      setStatus("queued");
      setProgress(0);
    } else {
      setErr(data.error ?? "Có lỗi xảy ra");
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      <Nav />
      <div className="mx-auto max-w-3xl px-6 py-14">
        <p className="font-mono text-[11px] tracking-widest text-text-muted">
          STUDIO
        </p>
        <h1 className="font-display mt-2 text-3xl font-semibold">
          Tải video &amp; chọn pipeline
        </h1>

        {/* Upload */}
        <div
          onClick={() => fileRef.current?.click()}
          className="mt-8 cursor-pointer rounded-2xl border border-dashed border-border bg-surface/50 p-10 text-center transition hover:border-teal/60"
        >
          <input
            ref={fileRef}
            type="file"
            accept="video/mp4,video/quicktime,video/webm,video/x-matroska"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onFilePicked(f);
            }}
          />
          {!file && (
            <p className="font-mono text-[13px] text-text-muted">
              Nhấn để chọn video (.mp4, .mov, .webm, .mkv — tối đa 500MB)
            </p>
          )}
          {file && (
            <div className="text-left">
              <p className="font-mono text-[13px]">{file.name}</p>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                <div
                  className={`h-full transition-all ${
                    uploadState === "error" ? "bg-magenta" : "bg-teal"
                  }`}
                  style={{
                    width: `${uploadState === "done" ? 100 : uploadPct}%`,
                  }}
                />
              </div>
              <p className="font-mono mt-1 text-[11px] text-text-muted">
                {uploadState === "uploading" && `Đang tải lên… ${uploadPct}%`}
                {uploadState === "done" && "Tải lên xong · đã lưu trên R2"}
                {uploadState === "error" && "Upload lỗi — thử lại"}
              </p>
            </div>
          )}
        </div>

        <div className="mt-3 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="font-mono text-[11px] text-text-muted">
            HOẶC (nếu chưa cấu hình R2)
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <input
          value={manualUrl}
          onChange={(e) => setManualUrl(e.target.value)}
          placeholder="Dán URL video công khai bạn sở hữu quyền sử dụng"
          className="mt-3 w-full rounded-xl border border-border bg-surface px-4 py-3 text-[14px] outline-none focus:border-teal/60"
        />

        {/* Mode select */}
        <p className="font-mono mt-9 text-[11px] tracking-widest text-text-muted">
          PIPELINE XỬ LÝ
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {modes.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`rounded-xl border p-4 text-left transition ${
                mode === m.id
                  ? "border-teal bg-teal/5"
                  : "border-border hover:border-text-muted"
              }`}
            >
              <p className="font-display text-[15px] font-medium">{m.label}</p>
              <p className="mt-1 text-[12px] text-text-muted">{m.desc}</p>
            </button>
          ))}
        </div>

        {/* Confirmation */}
        <label className="mt-8 flex items-start gap-3 text-[13px] text-text-muted">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-0.5"
          />
          Tôi xác nhận tôi sở hữu hoặc có quyền sử dụng hợp pháp video này, và
          không tải lên nội dung vi phạm bản quyền của người khác.
        </label>

        {err && (
          <p className="mt-4 rounded-lg border border-magenta/40 bg-magenta/10 px-4 py-2 text-[13px] text-magenta">
            {err}
          </p>
        )}

        <button
          onClick={submit}
          disabled={
            status === "queued" ||
            status === "processing" ||
            uploadState === "uploading"
          }
          className="font-display mt-6 w-full rounded-full bg-teal py-3 text-[14px] font-medium text-[#05100d] transition hover:brightness-110 disabled:opacity-50"
        >
          {status === "processing" || status === "queued"
            ? "Đang xử lý…"
            : "Bắt đầu xử lý"}
        </button>

        {jobId && (
          <div className="mt-6 rounded-xl border border-border bg-surface p-5">
            <div className="flex items-center justify-between font-mono text-[12px] text-text-muted">
              <span>JOB {jobId.slice(0, 8)}</span>
              <span>{status.toUpperCase()}</span>
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
              <div
                className="h-full bg-teal transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            {status === "done" && (
              <p className="mt-3 text-[13px] text-teal">
                Hoàn tất — xem trong Thư viện.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function putWithProgress(
  url: string,
  file: File,
  onProgress: (pct: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };
    xhr.onload = () =>
      xhr.status >= 200 && xhr.status < 300
        ? resolve()
        : reject(new Error(`Upload thất bại (HTTP ${xhr.status})`));
    xhr.onerror = () => reject(new Error("Lỗi mạng khi upload"));
    xhr.send(file);
  });
}
