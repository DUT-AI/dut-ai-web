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
	cd backend && uv run python manage.py runserver 0.0.0.0:8001

api-fastapi:
	cd backend_fastapi && uv run uvicorn app.main:app --host 0.0.0.0 --port 8002 --reload

frontend:
	cd frontend && npm run dev

setup:
	cd backend && uv sync
	cd frontend && npm install
	cd backend && uv run python manage.py migrate


migrate-fastapi:
	cd backend_fastapi && uv run python init_db.py
