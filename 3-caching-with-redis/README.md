# Caching with Redis: The 3-Layer Demo
# (EN: Caching with Redis: The 3-Layer Demo)

Dự án minh họa 3 phương pháp caching thực tế trong NestJS, tương ứng với 3 tầng của kiến trúc ứng dụng.
(EN: This project demonstrates 3 practical caching methods in NestJS, corresponding to 3 layers of the application architecture.)

---

## 🛠️ 1. Thiết lập (Setup)

### 1.1 Khởi chạy Services (Docker) (EN: Run Services)
```bash
# Khởi chạy database và redis riêng biệt (EN: Run services separately)
docker compose -f .docker/postgresql.yaml up -d
docker compose -f .docker/redis.yaml up -d
```

### 1.2 Cài đặt & Chạy ứng dụng (EN: Install & Run)
```bash
# Cài đặt (EN: Install)
npm install --legacy-peer-deps

# Chạy ở mode development (EN: Run in dev mode)
npm run start:dev
```

Khi gọi API, terminal sẽ in log thời gian theo format:
`[TIME] <METHOD> <URL> <STATUS_CODE> <durationMs>ms`
(EN: Each request prints timing logs in terminal with the format above.)

---

## 🏗️ 2. Ba Tầng Caching (The 3 Caching Layers)

Dự án được thiết kế để bạn có thể quan sát luồng cache thông qua 3 endpoints chuyên biệt:
(EN: The project is designed for you to observe the cache flow through 3 specialized endpoints:)

### 2.1 Tầng Tiếp nhận (Response Layer)
- **Endpoint:** `GET /cats/response-layer`
- **Cơ chế (Mechanism):** Dùng `CacheInterceptor` (NestJS) (EN: Use NestJS CacheInterceptor).
- **Tác dụng (Effect):** Cache toàn bộ HTTP Response dựa trên URL/Key. Trả kết quả cực nhanh ngay tại controller entry point.
- (EN: Auto-caches the entire HTTP Response based on URL/Key. Returns results instantly at the controller entry point.)
- **Clear cache endpoint:** `DELETE /cats/response-layer/cache` để xóa key `cats_res_layer` và demo lại miss/hit.
- (EN: Use `DELETE /cats/response-layer/cache` to clear key `cats_res_layer` and replay miss/hit behavior.)

### 2.2 Tầng Nghiệp vụ (Logic Layer)
- **Endpoint:** `GET /cats/logic-layer`
- **Cơ chế (Mechanism):** Manual Caching (`get`/`set`) qua `CACHE_MANAGER` (EN: Manual caching via CACHE_MANAGER).
- **Tác dụng (Effect):** Cache kết quả của các logic nặng (ví dụ: tính toán phức tạp, gọi API bên thứ 3) mà không ảnh hưởng tới toàn bộ response.
- (EN: Manually caches results of heavy logic (e.g., complex calculations, 3rd party API calls) without impacting the entire response.)
- **Clear cache endpoint:** `DELETE /cats/logic-layer/cache` để xóa key `cats_logic_layer_cache` và thử lại luồng miss/hit.
- (EN: Use `DELETE /cats/logic-layer/cache` to clear key `cats_logic_layer_cache` and replay miss/hit.)

### 2.3 Tầng Dữ liệu (DB Query Layer)
- **Endpoint:** `GET /cats/db-layer`
- **Seed endpoint:** `POST /cats/seed?count=1000` để tạo nhanh dữ liệu mẫu trước khi đo cache.
- (EN: Use `POST /cats/seed?count=1000` to quickly generate sample records before cache benchmarking.)
- **Cơ chế (Mechanism):** TypeORM Query Cache (EN: TypeORM Query Cache).
- **Tác dụng (Effect):** Cache kết quả của câu lệnh SQL. Giảm tải cho PostgreSQL bằng cách tránh thực thi lại cùng một query.
- (EN: Caches the results of SQL statements. Reduces PostgreSQL load by avoiding redundant query execution.)
- **Clear cache endpoint:** `DELETE /cats/db-layer/cache` để xóa key `cats_db_layer_cache` và thử lại luồng miss/hit.
- (EN: Use `DELETE /cats/db-layer/cache` to clear key `cats_db_layer_cache` and replay miss/hit.)

---

## 🔄 3. Luồng hệ thống (System Flow)

Dữ liệu di chuyển qua các tầng cache theo thứ tự ưu tiên từ ngoài vào trong:
(EN: Data moves through cache layers in priority order from top to bottom:)

```
Client (Postman/Browser)
  │
[Layer 3] Response Cache (Controller)  <── Fast Response if Hit!
  │
[Layer 2] Logic Cache (Service)        <── Fast Calculation if Hit!
  │
[Layer 1] Query Cache (TypeORM/Redis)  <── Fast Query if Hit!
  │
PostgreSQL Database                    <── Final Destination (Slowest)
```

---

## 📡 4. Kiểm tra kết quả (How to Test)

Quan sát log trong Terminal để thấy sự khác biệt về luồng xử lý:
(EN: Observe logs in the Terminal to see the difference in processing flow:)

1. **Response Layer flow:** Gọi `GET /cats/response-layer` 2 lần để thấy miss/hit, sau đó gọi `DELETE /cats/response-layer/cache` để reset cache.
2. **Logic Layer flow:** Gọi `GET /cats/logic-layer` 2 lần, sau đó gọi `DELETE /cats/logic-layer/cache` để reset và thử lại.
3. **DB Layer flow:** Gọi `GET /cats/db-layer` 2 lần, sau đó gọi `DELETE /cats/db-layer/cache` để reset và thử lại.
4. **Timing log check:** So sánh `<durationMs>` giữa lần 1 và lần 2 để xác nhận hiệu ứng cache hit.

---

## 📚 5. Tài liệu tham khảo (References)

- [NestJS Cache Manager](https://docs.nestjs.com/techniques/caching)
- [TypeORM Query Caching](https://typeorm.io/caching)
- [Keyv Multi-tier Storage](https://keyv.org/)
