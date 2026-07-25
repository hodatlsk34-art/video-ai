# Reframe — Video AI Research Tool

Web app nghiên cứu style transfer & upscale video bằng AI, cho video người dùng **tự tải lên** (không tải/xử lý lại video của người khác mà chưa có quyền).

## Chạy local

```bash
npm install
cp .env.example .env.local   # điền REPLICATE_API_TOKEN
npm run dev
```

Không có `REPLICATE_API_TOKEN` → app vẫn chạy được, job sẽ giả lập tiến trình để bạn test UI.

## Biến môi trường

| Biến | Mô tả |
|---|---|
| `REPLICATE_API_TOKEN` | Lấy tại https://replicate.com/account/api-tokens |
| `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL` | Cloudflare R2 — xem hướng dẫn trong `.env.example` |

Chưa cấu hình R2 → Studio vẫn dùng được qua ô "dán URL video" thủ công.

## Kiến trúc hiện tại (MVP)

- **Frontend**: Next.js App Router + Tailwind v4
- **Upload**: client upload trực tiếp lên Cloudflare R2 qua presigned URL (`/api/upload/presign`) — video không đi qua server Next.js, không giới hạn bởi kích thước request API route
- **Xử lý AI**: gọi qua Replicate API (`src/lib/replicate.ts`), model đặt trong `MODELS` — cần ghim version hash thật trước khi lên production (xem comment trong file)
- **Job queue**: in-memory (`src/lib/jobs.ts`) — chỉ để demo

## Việc cần làm trước khi lên production

1. **Queue**: thay in-memory job store bằng Redis + BullMQ để job không mất khi restart server, chạy được nhiều instance
2. **Auth**: thêm đăng nhập (NextAuth/Clerk) để gắn job/file R2 với user, quản lý thư viện cá nhân, giới hạn quota theo user
3. **Model version**: chốt version hash cụ thể của model Replicate (tránh model bị thay đổi ngầm)
4. **Dọn dẹp R2**: thêm lifecycle rule tự xoá file trong bucket sau N ngày (video gốc + kết quả) để tránh phình chi phí lưu trữ
5. **Giới hạn & xác nhận quyền sở hữu**: đã có checkbox xác nhận ở Studio + giới hạn 500MB/định dạng ở API upload — nên log lại xác nhận (kèm timestamp/IP) để tuân thủ bản quyền
6. **Deploy**: Vercel (frontend + API routes nhẹ) hoặc tách riêng worker xử lý video sang server có GPU/queue riêng nếu job nặng

## Cấu trúc trang

- `/` — Trang chủ, demo so sánh trước/sau
- `/studio` — Upload video, chọn pipeline (upscale / style transfer / cả hai), theo dõi tiến trình
- `/library` — Video đã xử lý
- `/pricing` — Bảng giá theo compute
