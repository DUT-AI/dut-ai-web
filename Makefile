# Makefile for DUT-AI Web

.PHONY: help api frontend migrate setup

help:
	@echo "Available commands:"
	@echo "  make api       - Start backend API server (with reload)"
	@echo "  make frontend  - Start frontend dev server"
	@echo "  make setup     - Install dependencies and run migrations"
	@echo "  make db        - Start PostgreSQL database (Docker)"
	@echo "  make stop      - Stop all services"
	@echo "  make migrate   - Run Django database migrations"
	@echo "  make migrate-fastapi - Run FastAPI database table creation"

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
	cd backend && uv run python manage.py migrate

migrate-revision:
	@read -p "Enter migration message: " msg; \
	cd backend && uv run alembic revision --autogenerate -m "$$msg"

migrate-upgrade:
	cd backend && uv run alembic upgrade head

migrate-downgrade:
	@read -p "Enter revision to downgrade to (e.g., -1): " rev; \
	cd backend && uv run alembic downgrade "$$rev"
