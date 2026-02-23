# ---------- deps ----------
    FROM node:20-alpine AS deps
    WORKDIR /app
    COPY package*.json ./
    RUN npm ci
    
    # ---------- build ----------
    FROM deps AS build
    WORKDIR /app
    
    COPY tsconfig*.json nest-cli.json ./
    COPY prisma ./prisma
    COPY src ./src
    
    # IMPORTANTE: genera Prisma Client con tu schema
    RUN npx prisma generate
    
    # Compila Nest
    RUN npm run build
    
    # ---------- runner ----------
    FROM node:20-alpine AS runner
    WORKDIR /app
    ENV NODE_ENV=development
    
    # OJO: copia node_modules desde build (ya tiene .prisma generado)
    COPY --from=build /app/node_modules ./node_modules
    COPY --from=build /app/dist ./dist
    COPY --from=build /app/prisma ./prisma
    COPY package*.json ./
    
    EXPOSE 3000
    CMD sh -c "npx prisma migrate deploy && node dist/main.js"
    