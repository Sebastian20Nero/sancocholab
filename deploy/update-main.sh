#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_DIR"

if [[ ! -f ".env" ]]; then
  echo "No existe .env en la raiz. Copia .env.example a .env antes de desplegar."
  exit 1
fi

echo "==> Actualizando rama main"
git fetch origin main
git checkout main
git pull --ff-only origin main

echo "==> Reconstruyendo y levantando servicios"
docker compose --env-file .env -f deploy/docker-compose.server.yml up -d --build

echo "==> Estado actual"
docker compose --env-file .env -f deploy/docker-compose.server.yml ps

echo
echo "Frontend: http://$(hostname -I | awk '{print $1}'):${WEB_PORT:-80}"
echo "API local: http://127.0.0.1:${API_PORT:-3000}/docs"
