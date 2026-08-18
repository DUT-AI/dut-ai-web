# Makefile for DUT-AI Web

.PHONY: help api frontend db stop setup db-generate db-migrate db-push db-studio build-be build-fe

help:
	@echo "Available commands:"
	@echo "  make api         - Start backend API server (with reload)"
	@echo "  make frontend    - Start frontend Next.js dev server"
	@echo "  make setup       - Install dependencies for backend and frontend"
	@echo "  make db          - Start PostgreSQL database (Docker)"
	@echo "  make stop        - Stop all services"
	@echo "  make db-generate - Generate SQL migration files (Drizzle Kit)"
	@echo "  make db-migrate  - Apply migrations to database (Drizzle Kit)"
	@echo "  make db-push     - Push schema changes directly to DB (Dev mode)"
	@echo "  make db-studio   - Open Drizzle Studio (Database Web UI)"

db:
	docker compose up -d db

stop:
	docker compose down

api:
	cd backend && uv run uvicorn app.main:app --host 0.0.0.0 --port 8031 --reload

frontend:
	cd frontend && npm run dev

setup:
	cd backend && uv sync
	cd frontend && npm install

db-generate:
	@read -p "Enter migration name (optional, press Enter to default): " name; \
	if [ -n "$$name" ]; then \
		cd frontend && npx drizzle-kit generate --name "$$name"; \
	else \
		cd frontend && npx drizzle-kit generate; \
	fi

db-migrate:
	cd frontend && npx drizzle-kit migrate

db-push:
	cd frontend && npx drizzle-kit push

db-studio:
	cd frontend && npx drizzle-kit studio

# Aliases for backward compatibility
db-revision: db-generate
db-up: db-migrate

build-be:
	docker compose up backend -d --build

build-fe:
	docker compose up frontend -d --build