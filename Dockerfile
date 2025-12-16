# Dockerfile otimizado para Coolify - Vale Apps
# Multi-stage build para máxima eficiência

# ===== STAGE 1: Builder =====
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app

# Copiar arquivos de dependências
COPY package.json package-lock.json ./

# Instalar todas as dependências (incluindo dev) para o build
RUN npm ci --include=dev && npm cache clean --force

# Copiar código fonte
COPY . .

# Fazer build da aplicação
RUN npm run build

# ===== STAGE 2: Runner (Produção) =====
FROM node:20-alpine AS runner
WORKDIR /app

# Criar usuário não-root para segurança
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nuxtjs

# Instalar apenas dependências de produção
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copiar apenas arquivos necessários para produção
COPY --from=builder --chown=nuxtjs:nodejs /app/.output ./.output
# Garantir que arquivos estáticos estão disponíveis
COPY --from=builder --chown=nuxtjs:nodejs /app/public ./.output/public

# Configurações de ambiente otimizadas para Coolify
ENV NODE_ENV=production
ENV NITRO_PORT=3000
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PRESET=node-server
ENV PORT=3000
ENV HOST=0.0.0.0

# Otimizações de performance
ENV NODE_OPTIONS="--max-old-space-size=1024"
ENV UV_THREADPOOL_SIZE=4

# Configurações de segurança
USER nuxtjs

# Expor porta
EXPOSE 3000

# Comando otimizado para produção
CMD ["sh", "-c", "node .output/server/index.mjs"]