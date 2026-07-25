// In-memory job store — chỉ dùng cho demo/MVP.
// PRODUCTION: thay bằng Redis (BullMQ) hoặc DB (Postgres) để job sống qua các lần
// restart server và scale được nhiều instance.

export type JobMode = "style" | "upscale" | "both";
export type JobStatus = "queued" | "processing" | "done" | "error";

export interface Job {
  id: string;
  mode: JobMode;
  status: JobStatus;
  progress: number; // 0-100
  inputUrl: string;
  resultUrl?: string;
  error?: string;
  createdAt: number;
}

const store = new Map<string, Job>();

export function createJob(mode: JobMode, inputUrl: string): Job {
  const id = crypto.randomUUID();
  const job: Job = {
    id,
    mode,
    status: "queued",
    progress: 0,
    inputUrl,
    createdAt: Date.now(),
  };
  store.set(id, job);
  return job;
}

export function getJob(id: string): Job | undefined {
  return store.get(id);
}

export function updateJob(id: string, patch: Partial<Job>) {
  const job = store.get(id);
  if (!job) return;
  store.set(id, { ...job, ...patch });
}

export function listJobs(): Job[] {
  return Array.from(store.values()).sort((a, b) => b.createdAt - a.createdAt);
}
