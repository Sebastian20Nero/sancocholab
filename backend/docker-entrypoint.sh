#!/bin/sh
set -e

echo "Starting backend container..."
echo "Running Prisma client generation..."
npx prisma generate

echo "Running Prisma migrations (deploy)..."
npx prisma migrate deploy

if [ "${PRISMA_RUN_SEED:-false}" = "true" ]; then
  echo "PRISMA_RUN_SEED=true -> running seed..."
  npx prisma db seed
fi

echo "Starting NestJS app..."
exec node dist/main.js
