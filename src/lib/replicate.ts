import Replicate from "replicate";

// Cần biến môi trường REPLICATE_API_TOKEN (xem README).
// Lấy token tại: https://replicate.com/account/api-tokens
export const replicate = process.env.REPLICATE_API_TOKEN
  ? new Replicate({ auth: process.env.REPLICATE_API_TOKEN })
  : null;

// Model refs. Không ghim version hash ở đây vì hash đổi theo thời gian —
// Replicate tự phân giải "owner/model" sang version mới nhất.
// PRODUCTION: nên ghim version cụ thể để tránh model bị cập nhật ngầm.
// Lấy version mới nhất bằng: `await replicate.models.get(owner, name)`
// rồi dùng field `latest_version.id`, sau đó gọi
// `replicate.run(\`${owner}/${name}:${versionId}\`, {...})`.
export const MODELS = {
  // Real-ESRGAN Video Upscaler — A100, ~$0.23/lần chạy, ~3 phút cho video
  // ngắn (thời gian/giá tăng theo độ dài & độ phân giải input).
  upscale: "lucataco/real-esrgan-video",
  // AnimateDiff — A100, ~$0.10/lần chạy, ~75 giây.
  style: "lucataco/animate-diff",
} as const;
