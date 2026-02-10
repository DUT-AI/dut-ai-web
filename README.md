# DUT-AI Web

Fullstack web application sử dụng **Next.js** (Frontend) và **Wagtail CMS** (Backend - Headless Mode).

## Tech Stack

| Layer    | Technology         | Version |
| -------- | ------------------ | ------- |
| Frontend | Next.js (React)    | 15      |
| Backend  | Wagtail (Django)   | 6.x     |
| Database | PostgreSQL         | 16      |
| Package  | uv (Python), npm   | -       |
| DevOps   | Docker Compose     | -       |

## Project Structure

```
dut-ai-web/
├── frontend/          # Next.js application
├── backend/           # Wagtail CMS application
├── docker/            # Dockerfiles
├── docs/              # Documentation
├── docker-compose.yml
├── .env.example
└── README.md
```

## Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) & Docker Compose
- [Node.js 20+](https://nodejs.org/) (for local frontend dev)
- [Python 3.12+](https://www.python.org/) & [uv](https://docs.astral.sh/uv/) (for local backend dev)

### Quick Start (Docker)

```bash
# 1. Clone & setup environment
cp .env.example .env

# 2. Start all services
docker compose up --build

# 3. Access the applications
# Frontend: http://localhost:3000
# Backend Admin: http://localhost:8000/admin/
# Wagtail API: http://localhost:8000/api/v2/pages/
```

### Local Development

#### Backend (Wagtail)

```bash
cd backend

# Install dependencies
uv sync

# Run migrations
uv run python manage.py migrate

# Create superuser
uv run python manage.py createsuperuser

# Start dev server
uv run python manage.py runserver
```

#### Frontend (Next.js)

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

## Environment Variables

Xem file [`.env.example`](.env.example) để biết tất cả các biến môi trường cần thiết.
