# ROAMIO

ROAMIO là demo **AI Travel Companion**: một ứng dụng gợi ý địa điểm du lịch cá nhân hóa, lập kế hoạch hành trình, theo dõi check-in và tìm bạn đồng hành có cùng phong cách di chuyển.

Repo này gồm hai phần chính:

- `roamio-ui/`: frontend Next.js hiển thị dashboard tương tác.
- `backend/`: backend FastAPI chứa các module AI, dữ liệu mẫu và API gợi ý.

Ngoài ra repo còn có `PRESENTATION_NOTES.md`, notebook tài liệu môn học, SQL dump và một số file HTML demo bản đồ/thời tiết.

## Tính Năng Chính

- Gợi ý Top địa điểm theo sở thích, ngân sách, vị trí hiện tại và độ phù hợp với chuyến đi.
- Bản đồ trực quan, danh sách địa điểm, trạng thái check-in và điểm thưởng.
- Lập itinerary, đánh dấu hoàn thành, xem tiến độ chuyến đi.
- Tìm bạn đồng hành dựa trên sở thích, ngân sách, nhịp độ du lịch và hành vi tương đồng.
- Tab Data giải thích pipeline chấm điểm và nguồn dữ liệu.
- Backend AI độc lập có thể chạy API hoặc demo terminal.
- Frontend có seed fallback nên vẫn chạy được khi chưa cấu hình PostgreSQL.

## Kiến Trúc

```text
roamio/
  backend/
    app.py                  # FastAPI app
    demo_run.py             # Demo terminal cho pipeline AI
    ai/                     # Clustering, spatial search, recommenders, matching
    routes/                 # API routes
    data/                   # Dữ liệu JSON mẫu
    utils/                  # Loader và schema
  roamio-ui/
    src/app/                # Next.js App Router + API routes nội bộ
    src/components/roamio/  # UI dashboard ROAMIO
    src/lib/                # Seed data, scoring engine, database fallback
    src/services/api.ts     # Client gọi FastAPI backend
    database/               # PostgreSQL schema và seed
  map.html
  weather.html
  PRESENTATION_NOTES.md
```

## Luồng AI

```text
User profile + vị trí hiện tại
  -> K-Means phân cụm người dùng
  -> BallTree + Haversine lọc địa điểm gần
  -> Logistic Regression tính personal score
  -> Jaccard Similarity tính social score
  -> Hybrid scoring xếp hạng Top-K
  -> Gợi ý địa điểm + lý do giải thích
```

Các thuật toán đang chạy trong backend:

- `KMeans`: phân nhóm người dùng theo ngân sách, sở thích, pace, transport và lịch sử check-in.
- `BallTree` với Haversine: tìm địa điểm gần tọa độ hiện tại.
- `LogisticRegression`: dự đoán xác suất người dùng thích một địa điểm.
- `Jaccard Similarity`: đo độ giống nhau qua lịch sử check-in.
- Hybrid scoring: kết hợp `personal`, `cluster`, `social` và `distance`.
- User matching: dùng cosine similarity cho sở thích, cộng thêm budget và pace compatibility.

## Yêu Cầu

- Node.js 20+ khuyến nghị cho frontend Next.js.
- Python 3.10+ cho backend FastAPI.
- PostgreSQL là tùy chọn. Nếu không có database, frontend tự dùng seed data trong code.

## Chạy Nhanh Frontend

Từ thư mục root:

```powershell
npm install
npm run dev
```

Hoặc chạy trực tiếp trong frontend:

```powershell
cd roamio-ui
npm install
npm run dev
```

Mở:

```text
http://localhost:3000
```

Các script ở root:

```powershell
npm run dev          # chạy frontend
npm run build        # build frontend
npm run start        # start frontend production build
npm run backend:dev  # chạy FastAPI backend
npm run backend:demo # chạy demo AI terminal
```

## Chạy Backend AI

```powershell
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app:app --reload
```

Backend mặc định chạy tại:

```text
http://localhost:8000
```

Các endpoint chính:

- `GET /`: thông tin tổng quan backend.
- `GET /api/users`: danh sách user mẫu.
- `GET /api/places`: danh sách địa điểm mẫu.
- `POST /api/recommendations`: gợi ý địa điểm cho một user.
- `POST /api/matches`: tìm bạn đồng hành phù hợp.
- `GET /api/explain`: mô tả ngắn pipeline AI.

Ví dụ request gợi ý:

```json
{
  "user_id": "u001",
  "latitude": 35.6618,
  "longitude": 139.7041,
  "top_k": 5
}
```

## Demo Terminal

```powershell
cd backend
python demo_run.py
```

Script này in ra:

- user demo và cluster AI;
- Top 5 địa điểm gợi ý;
- điểm thành phần `personal`, `cluster`, `social`, `distance`;
- Top 5 bạn đồng hành phù hợp;
- lý do ngắn cho từng kết quả.

## Cấu Hình Database Cho Frontend

Frontend có thể đọc PostgreSQL nếu khai báo biến môi trường trong `roamio-ui/.env.local`:

```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/roamio
DATABASE_SSL=false
```

File mẫu nằm ở:

```text
roamio-ui/.env.example
```

Schema và seed:

```text
roamio-ui/database/schema.sql
roamio-ui/database/seed.sql
```

Nếu `DATABASE_URL` không tồn tại hoặc query lỗi, app tự fallback về seed data trong `roamio-ui/src/lib/roamio-data.ts`.

## Frontend Dashboard

Giao diện chính có 4 tab:

- **Command**: bản đồ, form sở thích, thời tiết, gợi ý địa điểm và check-in.
- **Plan**: itinerary, tiến độ chuyến đi và review scoring.
- **Social**: bạn đồng hành phù hợp, leaderboard và thông tin cộng đồng.
- **Data**: nguồn dữ liệu, trạng thái database và giải thích cách tính điểm.

Frontend cũng có API routes nội bộ trong `roamio-ui/src/app/api/` để xử lý session demo, danh sách địa điểm, social và trip data.

## Triển Khai

Repo có cấu hình Vercel ở `vercel.json`, build từ `roamio-ui/package.json` bằng `@vercel/next`.

`.vercelignore` đã loại các file không cần deploy như:

- `node_modules`
- `.next`
- log
- zip
- notebook/docx
- SQL dump
- các HTML demo rời

## Dữ Liệu Mẫu

Backend dùng các file JSON:

- `backend/data/sample_users.json`
- `backend/data/sample_places.json`
- `backend/data/sample_checkins.json`

Frontend dùng seed TypeScript:

- `roamio-ui/src/lib/roamio-data.ts`

SQL schema/seed phục vụ Postgres:

- `roamio-ui/database/schema.sql`
- `roamio-ui/database/seed.sql`

## Giới Hạn Hiện Tại

- Dữ liệu đang là synthetic/demo data, chưa phải dữ liệu production.
- Logistic Regression được huấn luyện từ nhãn tạo trong demo, chưa từ feedback thật.
- Backend Python chưa có auth production hoặc persistent write flow hoàn chỉnh.
- Frontend ưu tiên trải nghiệm demo và có fallback local; việc đồng bộ hoàn toàn với FastAPI có thể mở rộng thêm.
- SQL dump lớn được giữ trong repo cho mục đích tham khảo/dữ liệu, nhưng không dùng trực tiếp khi chạy mặc định.

## Hướng Phát Triển

- Kết nối toàn bộ flow frontend với FastAPI backend thay vì chỉ dùng local engine/fallback.
- Thêm dữ liệu thật về địa điểm, review, check-in và feedback người dùng.
- Nâng cấp mô hình gợi ý khi có dữ liệu lớn hơn, ví dụ LightGBM hoặc ranking model.
- Thêm route planning, itinerary generation và tối ưu lịch trình theo thời gian thực.
- Bổ sung auth, user profile persistence và hệ thống review/check-in production.
