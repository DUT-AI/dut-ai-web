FROM python:3.12-slim AS base

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# ---------------------
# Dependencies stage
# ---------------------
FROM base AS deps

COPY pyproject.toml uv.lock* ./
RUN uv sync --frozen --no-dev 2>/dev/null || uv sync --no-dev

# ---------------------
# Production stage
# ---------------------
FROM base AS production

# Create non-root user
RUN groupadd --gid 1000 appuser && \
    useradd --uid 1000 --gid appuser --shell /bin/bash --create-home appuser

# Copy dependencies from deps stage
COPY --from=deps /app/.venv /app/.venv

# Copy project source
COPY . .

# Collect static files
RUN uv run python manage.py collectstatic --noinput 2>/dev/null || true

# Set ownership
RUN chown -R appuser:appuser /app

USER appuser

EXPOSE 8000

# Production server with gunicorn
CMD ["uv", "run", "gunicorn", "config.wsgi:application", \
     "--bind", "0.0.0.0:8000", \
     "--workers", "4", \
     "--timeout", "120", \
     "--access-logfile", "-", \
     "--error-logfile", "-"]
