import { S3Client } from "@aws-sdk/client-s3";

// Cloudflare R2 — tương thích API S3, không tính phí egress (phù hợp vì
// video tải về nhiều lần từ Replicate + người dùng).
// Cần 4 biến môi trường, xem README / .env.example.

export const R2_BUCKET = process.env.R2_BUCKET_NAME ?? "";

export const r2 = process.env.R2_ACCOUNT_ID
  ? new S3Client({
      region: "auto",
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID ?? "",
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? "",
      },
    })
  : null;

// URL công khai để đọc file sau khi upload — hoặc domain tuỳ chỉnh đã gắn
// cho bucket (R2 custom domain / r2.dev public bucket URL).
export function publicUrlFor(key: string): string {
  const base = process.env.R2_PUBLIC_URL?.replace(/\/$/, "");
  return `${base}/${key}`;
}
