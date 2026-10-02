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

# Helper function to run drizzle-kit: use local npx if npm exists, otherwise fallback to Docker
define run_drizzle
	@if command -v npm >/dev/null 2>&1; then \
		cd frontend && npx drizzle-kit $(1); \
	else \
		docker run --rm --network dut-ai-web_internal \
			--env-file .env \
			-v $(CURDIR)/frontend:/app \
			$(2) \
			-w /app \
			-e POSTGRES_HOST=db \
			-e POSTGRES_PORT=5432 \
			node:20-alpine npx drizzle-kit $(1) --config drizzle.config.ts; \
	fi
endef

db-generate:
	@read -p "Enter migration name (optional, press Enter to default): " name; \
	if [ -n "$$name" ]; then \
		$(call run_drizzle,generate --name "$$name",); \
	else \
		$(call run_drizzle,generate,); \
	fi

db-migrate:
	$(call run_drizzle,migrate,)

db-push:
	$(call run_drizzle,push,)

db-studio:
	$(call run_drizzle,studio --port 4983 --host 0.0.0.0,-p 4983:4983)

build-be:
	docker compose up backend -d --build

build-fe:
	docker compose up frontend -d --build