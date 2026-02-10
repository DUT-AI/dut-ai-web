# Project Structure: Next.js Frontend + Wagtail Headless CMS Backend

Thiết lập cấu trúc dự án fullstack sử dụng **Next.js** cho frontend và **Wagtail CMS (Python)** cho backend, quản lý dependencies bằng **uv**. Cả hai service được container hóa với Docker Compose cho môi trường phát triển.

## Proposed Structure

```
dut-ai-web/
├── frontend/                    # Next.js application
│   ├── public/
│   ├── src/
│   │   ├── app/                 # App Router (Next.js 15)
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── globals.css
│   │   ├── components/          # Reusable components
│   │   ├── lib/                 # Utilities, API clients
│   │   └── types/               # TypeScript types
│   ├── next.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   └── .env.local.example
│
├── backend/                     # Wagtail CMS application
│   ├── config/                  # Django/Wagtail project settings
│   │   ├── __init__.py
│   │   ├── settings/
│   │   │   ├── __init__.py
│   │   │   ├── base.py          # Common settings
│   │   │   ├── dev.py           # Development overrides
│   │   │   └── production.py    # Production overrides
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── home/                    # Home app (default Wagtail)
│   │   ├── models.py
│   │   ├── migrations/
│   │   └── templates/
│   ├── api/                     # Headless API endpoints (DRF)
│   │   ├── __init__.py
│   │   ├── serializers.py
│   │   └── views.py
│   ├── manage.py
│   ├── pyproject.toml           # uv project config
│   └── .env.example
│
├── docker/                      # Docker configuration
│   ├── frontend.Dockerfile
│   └── backend.Dockerfile
│
├── docker-compose.yml           # Dev environment orchestration
├── .gitignore
├── .env.example                 # Root env template
└── README.md
```

## User Review Required

> [!IMPORTANT]
> - **Next.js version**: Sẽ sử dụng Next.js 15 với App Router. Bạn muốn dùng version khác không?
> - **Database**: Mặc định Wagtail dùng PostgreSQL. Docker Compose sẽ bao gồm PostgreSQL container. OK không?
> - **Wagtail API mode**: Sẽ cấu hình Wagtail ở chế độ headless với REST API (`wagtail.api.v2`). Bạn có muốn thêm GraphQL (qua `wagtail-grapple`) không?

## Proposed Changes

### Frontend (Next.js)

#### [NEW] `frontend/` directory

- Khởi tạo bằng `npx -y create-next-app@latest` với TypeScript, ESLint, App Router
- Cấu hình `next.config.ts` để kết nối backend API
- Tạo base layout và trang chủ mẫu
- Thêm `.env.local.example` với `NEXT_PUBLIC_API_URL`

---

### Backend (Wagtail / Django)

#### [NEW] `backend/` directory

- Khởi tạo project bằng `uv init` và cài đặt Wagtail
- Tạo Wagtail project với `wagtail start config .`
- Tách settings thành `base.py`, `dev.py`, `production.py`
- Tạo app `api/` cho REST API endpoints
- Cấu hình `wagtail.api.v2` cho headless mode
- Cấu hình CORS cho phép frontend truy cập

---

### Docker & DevOps

#### [NEW] `docker-compose.yml`

- **db**: PostgreSQL 16 container
- **backend**: Wagtail dev server (port 8000)
- **frontend**: Next.js dev server (port 3000)

#### [NEW] `docker/frontend.Dockerfile` & `docker/backend.Dockerfile`

- Frontend: Node 20 Alpine base image
- Backend: Python 3.12 + uv base image

#### [NEW] `.gitignore`, `.env.example`, `README.md`

- Gitignore cho cả Python, Node.js, và Docker
- README với hướng dẫn setup

## Verification Plan

### Automated Tests
1. **Backend**: Chạy `uv run python manage.py check` để verify Wagtail config
2. **Frontend**: Chạy `npm run build` để verify Next.js builds thành công
3. **Docker**: Chạy `docker compose up --build` để verify tất cả services khởi động

### Manual Verification
1. Truy cập `http://localhost:3000` → Next.js trang chủ hiển thị
2. Truy cập `http://localhost:8000/admin/` → Wagtail admin panel
3. Truy cập `http://localhost:8000/api/v2/pages/` → Wagtail API trả về JSON
