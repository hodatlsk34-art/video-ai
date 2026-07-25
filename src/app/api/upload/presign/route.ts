import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2, R2_BUCKET, publicUrlFor } from "@/lib/storage";

const MAX_SIZE_BYTES = 500 * 1024 * 1024; // 500MB — chỉnh theo nhu cầu
const ALLOWED_TYPES = ["video/mp4", "video/quicktime", "video/webm", "video/x-matroska"];

export async function POST(req: NextRequest) {
  if (!r2) {
    return NextResponse.json(
      {
        error:
          "Chưa cấu hình R2 (thiếu R2_ACCOUNT_ID và các biến liên quan trong .env.local).",
      },
      { status: 501 }
    );
  }

  const body = await req.json().catch(() => null);
  const fileName: string | undefined = body?.fileName;
  const contentType: string | undefined = body?.contentType;
  const fileSize: number | undefined = body?.fileSize;

  if (!fileName || !contentType) {
    return NextResponse.json(
      { error: "Thiếu fileName hoặc contentType" },
      { status: 400 }
    );
  }
  if (!ALLOWED_TYPES.includes(contentType)) {
    return NextResponse.json(
      { error: "Định dạng video không được hỗ trợ (chỉ mp4/mov/webm/mkv)" },
      { status: 415 }
    );
  }
  if (fileSize && fileSize > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: "Video vượt quá 500MB" },
      { status: 413 }
    );
  }

  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const key = `uploads/${crypto.randomUUID()}-${safeName}`;

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    ContentType: contentType,
  });

  // URL có hiệu lực 10 phút để client PUT trực tiếp file lên R2 —
  // video không đi qua server Next.js, tránh giới hạn kích thước request.
  const uploadUrl = await getSignedUrl(r2, command, { expiresIn: 600 });

  return NextResponse.json({ uploadUrl, publicUrl: publicUrlFor(key), key });
}
