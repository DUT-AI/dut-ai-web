# Kế Hoạch Triển Khai Kiến Trúc Hybrid (Next.js Main Backend + FastAPI AI Microservice)

Kế hoạch này vạch ra lộ trình từng bước để tái cấu trúc `dut-ai-web` sang mô hình **Hybrid Architecture**:
- **Next.js 15 (App Router + Drizzle ORM / Server Actions)**: Trở thành Core Web Server & Fullstack Platform (quản lý Database PostgreSQL trực tiếp, Public Web UI, và Admin Dashboard hiện đại bằng React).
- **FastAPI (AI Microservice)**: Tinh gọn từ một monolithic backend thành một service AI chuyên trách (xử lý RAG, Vector Search, AI Chatbot, OCR/Document AI, LangChain/LlamaIndex, Background Tasks).

---

## 1. Tổng Quan Kiến Trúc Mục Tiêu (Target Architecture)

```
[ Trình duyệt / Người dùng ]
           │
           ▼
┌─────────────────────────────────────────────────────────────┐
│                   NEXT.JS 15 (FULLSTACK)                    │
│  - Public Web (Server Components, SSR/SSG/ISR, SEO)         │
│  - Admin Dashboard (React 19 + Shadcn UI + Server Actions)  │
│  - Drizzle ORM (Type-safe DB Client trực tiếp)              │
│  - NextAuth / Auth.js (Bảo mật phiên Admin / Users)         │
│  - Media Service (Upload trực tiếp lên MinIO/S3)            │
└──────────────┬───────────────────────────────┬──────────────┘
               │ (Query trực tiếp)             │ (Internal HTTP / API Key)
               ▼                               ▼
┌──────────────────────────────┐  ┌───────────────────────────┐
│     POSTGRESQL DATABASE      │  │   FASTAPI AI MICROSERVICE │
│ - Users, Projects, Blogs     │  │ - RAG / Vector Embeddings │
│ - Events, Posts, Keywords    │  │ - DUT AI Chatbot & Agent  │
│ - pgvector (Tùy chọn cho AI) │◄─┤ - Document / PDF Analysis │
└──────────────────────────────┘  └───────────────────────────┘
```

---

## 2. Lộ Trình Triển Khai Từng Giai Đoạn (Phased Roadmap)

### Giai đoạn 1: Thiết lập Database Layer trực tiếp trên Next.js (Drizzle ORM)
> **Mục tiêu:** Cho phép Next.js đọc/ghi trực tiếp vào PostgreSQL hiện tại với 100% Type-safety, không làm mất dữ liệu đã có.

* **Cài đặt thư viện Drizzle ORM & Postgres driver:**
  * `drizzle-orm`, `drizzle-kit`, `postgres` (hoặc `@neondatabase/serverless` / `pg`).
* **Định nghĩa Drizzle Schema (`frontend/lib/db/schema.ts`):**
  * Chuyển đổi tương ứng các bảng từ SQLAlchemy:
    * `users` (id, name, email, role_name, avatar_url, discord_id, status, ...)
    * `projects`, `project_members` (1-N quan hệ với users)
    * `blogs`, `blog_authors`, `blog_keywords` (N-N quan hệ)
    * `keywords` (keyword_name, number_blog_contain)
    * `public_events` (title, description, events_date, location, tags, ...)
    * `posts` (title, summary, img_urls, hashtag, events_date, ...)
    * `introductions` (content, order)
* **Introspection / Test Kết nối:**
  * Trỏ Drizzle tới PostgreSQL container để kiểm tra tính tương thích với dữ liệu sẵn có trong DB dump (`dut-ai-web_db_dump.sql`).

---

### Giai đoạn 2: Refactor Frontend Public Web (Loại bỏ REST Proxy Overhead)
> **Mục tiêu:** Chuyển các hàm trong `frontend/app/api-client.ts` và `frontend/lib/api.ts` từ `fetch(http://backend:8002/...)` sang Server Component Data Fetching trực tiếp từ Database.

* **Thay thế hàm truy vấn:**
  * `getProjects()`, `getHomePageData()`, `getBlogs()`, `getMembers()`, `getPublicEvents()`, `getPosts()` sẽ query trực tiếp qua Drizzle ORM.
  * Tận dụng Next.js cache (`unstable_cache` hoặc React `cache()`) thay cho `revalidate` của `fetch`.
* **Loại bỏ các proxy routes không cần thiết** trong `frontend/app/api/...`.
* **Đo lường hiệu năng:** Giảm thời gian phản hồi (TTFB) của trang từ hàng trăm ms xuống còn vài ms do không qua trung gian REST HTTP.

---

### Giai đoạn 3: Xây dựng Admin Dashboard trong Next.js (Thay thế `admin_v2`)
> **Mục tiêu:** Chuyển đổi toàn bộ tính năng quản trị từ Jinja2 templates trong FastAPI sang React UI chuyên nghiệp.

* **Authentication & Authorization:**
  * Cài đặt `next-auth` (hoặc `lucia` / session cookies bảo mật) để bảo vệ route `/admin`.
  * Hỗ trợ đăng nhập cho Admin/Ban chủ nhiệm CLB.
* **Xây dựng module Admin (`frontend/app/admin/...`):**
  * Layout Admin Dashboard (Sidebar, Header, Breadcrumbs) sử dụng Shadcn UI + Lucide Icons.
  * Quản lý **Blogs & Bài viết**: Editor Markdown / WYSIWYG, gán tác giả, từ khóa SEO.
  * Quản lý **Dự án (Projects)** & Phân quyền thành viên tham gia.
  * Quản lý **Sự kiện (Public Events & Posts)**.
  * Quản lý **Thành viên (Users)**.
* **Xử lý Media Upload:**
  * Tạo Server Action hoặc Route Handler `POST /api/upload` để đẩy file lên MinIO / Cloud S3, trả về public URL.

---

### Giai đoạn 4: Tinh gọn Backend FastAPI thành "AI Microservice"
> **Mục tiêu:** Xóa bỏ code thừa (CRUD web, SQLAdmin, Jinja2 templates) trong FastAPI, biến nó thành AI Engine chuyên trách.

* **Dọn dẹp code:**
  * Xóa bỏ module `app/admin_v2`, `app/templates`, `app/static`, `sqladmin`.
  * Xóa bỏ các API CRUD cơ bản (`/api/v1/projects`, `/api/v1/users`, `/api/v1/introductions`, v.v.).
* **Định hình các AI Endpoints trọng tâm (`backend/app/ai/...`):**
  * `POST /api/ai/chat`: Endpoint streaming phản hồi chatbot cho DUT AI Club (OpenAI / Anthropic / Local LLM / Ollama).
  * `POST /api/ai/rag/query`: Tra cứu tài liệu, nội quy, dự án CLB bằng Vector Search.
  * `POST /api/ai/summarize`: Tự động tóm tắt bài viết / trích xuất keywords bằng AI.
  * `POST /api/ai/document/ocr`: Xử lý phân tích file / hình ảnh tài liệu.
* **Bảo mật giao tiếp giữa Next.js và FastAPI:**
  * Thiết lập `AI_SERVICE_API_KEY` trong `.env`. Next.js khi gọi sang FastAPI sẽ kèm header `X-API-Key` để xác thực an toàn.

---

### Giai đoạn 5: Cập nhật Docker Compose & CI/CD
> **Mục tiêu:** Đóng gói hệ thống nhẹ hơn, khởi động nhanh hơn.

* **Cập nhật `docker-compose.yml`:**
  * `db`: PostgreSQL 16 (có thể thêm extension `pgvector` nếu dùng RAG trực tiếp trên DB).
  * `frontend`: Next.js 15 (đảm nhận Web + Admin + Main DB connection).
  * `ai-service` (FastAPI): Nhẹ hơn nhiều, chỉ chạy môi trường Python cho AI pipelines.
  * `minio`: Lưu trữ media assets.

---

## 3. Bảng Phân Chia Trách Nhiệm Giữa 2 Service

| Thành phần / Nghiệp vụ | Next.js 15 (Main Backend) | FastAPI (AI Microservice) |
| :--- | :---: | :---: |
| **Giao diện Web Public (SSR/SSG)** | ✅ Chịu trách nhiệm | ❌ Không tham gia |
| **Quản trị Admin Panel (CRUD)** | ✅ Chịu trách nhiệm | ❌ Không tham gia |
| **Xác thực Admin / Phân quyền** | ✅ NextAuth / Server Auth | ❌ Xác thực qua API Key nội bộ |
| **Truy vấn DB Postgres (Projects, Blogs, Users)** | ✅ Drizzle ORM | ❌ (Chỉ đọc Vector nếu cần RAG) |
| **Upload file / Quản lý ảnh** | ✅ Server Actions | ❌ |
| **Chatbot Streaming (DUT AI Chat)** | ❌ Gọi proxy sang FastAPI | ✅ Xử lý Prompt, LLM, Memory |
| **RAG / Embeddings / Vector Search** | ❌ | ✅ LangChain / LlamaIndex / Python |
| **Background AI Jobs & Data Processing**| ❌ | ✅ Celery / Python Async Workers |

---

## 4. Kế Hoạch Xác Minh & Kiểm Thử (Verification Plan)

### Automated Tests:
1. **Drizzle Schema & Migrations:** Chạy `npx drizzle-kit check` và `npx drizzle-kit generate` để đảm bảo schema khớp hoàn toàn với PostgreSQL hiện hữu.
2. **Next.js Build:** Chạy `npm run build` hoặc `yarn build` trên `frontend` để kiểm tra TypeScript types và build SSR.
3. **FastAPI AI Service Healthcheck:** Chạy test suite `pytest` kiểm tra các API AI và auth middleware.

### Manual Verification:
1. **Dữ liệu hiển thị:** Kiểm tra HomePage, trang `/projects`, `/about`, `/blog`, `/events` hiển thị đúng dữ liệu từ DB PostgreSQL thông qua Drizzle.
2. **Admin Operations:** Thử tạo mới 1 Blog, 1 Project, upload ảnh và kiểm tra dữ liệu được lưu đúng vào Postgres/MinIO.
3. **AI Integration:** Gửi request thử nghiệm từ Next.js sang FastAPI AI endpoint và nhận stream phản hồi thành công.
