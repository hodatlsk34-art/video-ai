import { NextRequest, NextResponse } from "next/server";
import { createJob, updateJob, type JobMode } from "@/lib/jobs";
import { replicate, MODELS } from "@/lib/replicate";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const inputUrl: string | undefined = body?.inputUrl;
  const mode: JobMode | undefined = body?.mode;

  if (!inputUrl || !mode) {
    return NextResponse.json(
      { error: "Thiếu inputUrl hoặc mode" },
      { status: 400 }
    );
  }

  const job = createJob(mode, inputUrl);

  // Chạy nền, không chặn response — client sẽ poll /api/status/[id]
  runJob(job.id, inputUrl, mode).catch((err) => {
    updateJob(job.id, { status: "error", error: String(err) });
  });

  return NextResponse.json({ jobId: job.id });
}

async function runJob(id: string, inputUrl: string, mode: JobMode) {
  updateJob(id, { status: "processing", progress: 10 });

  if (!replicate) {
    // Chưa cấu hình REPLICATE_API_TOKEN — chạy giả lập để demo UI/UX.
    await simulate(id);
    return;
  }

  try {
    if (mode === "upscale" || mode === "both") {
      updateJob(id, { progress: 30 });
      await replicate.run(MODELS.upscale as `${string}/${string}`, {
        input: { video: inputUrl },
      });
    }
    if (mode === "style" || mode === "both") {
      updateJob(id, { progress: 65 });
      await replicate.run(MODELS.style as `${string}/${string}`, {
        input: { video: inputUrl },
      });
    }
    // TODO: thay bằng URL kết quả thật trả về từ Replicate.
    updateJob(id, { status: "done", progress: 100, resultUrl: inputUrl });
  } catch (err) {
    updateJob(id, { status: "error", error: String(err) });
  }
}

async function simulate(id: string) {
  for (const p of [30, 55, 80]) {
    await new Promise((r) => setTimeout(r, 900));
    updateJob(id, { progress: p });
  }
  await new Promise((r) => setTimeout(r, 900));
  updateJob(id, { status: "done", progress: 100 });
}
