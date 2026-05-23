#!/bin/bash
set -e

echo "=== Resume AI Backend Starting ==="
echo "PORT: ${PORT:-8000}"
echo "Running database migrations..."

alembic upgrade head

echo "Migrations complete. Starting uvicorn on port ${PORT:-8000}..."

exec uvicorn app.main:app \
  --host 0.0.0.0 \
  --port "${PORT:-8000}" \
  --log-level info \
  --workers 1
