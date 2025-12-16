# Dockerfile otimizado para Coolify - Vale Apps
# Multi-stage build para máxima eficiência

# ===== STAGE 1: Dependencies =====
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copiar apenas arquivos de dependências para cache otimizado
COPY package.json package-lock.json ./
RUN npm ci --only=production && npm cache clean --force

# ===== STAGE 2: Builder =====
FROM node:18-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copiar dependências do stage anterior
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Instalar dependências de desenvolvimento e fazer build
RUN npm ci && npm run build

# ===== STAGE 3: Runner (Produção) =====
FROM node:18-alpine AS runner
WORKDIR /app

# Criar usuário não-root para segurança
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nuxtjs

# Copiar apenas arquivos necessários para produção
COPY --from=builder --chown=nuxtjs:nodejs /app/.output ./.output
COPY --from=builder --chown=nuxtjs:nodejs /app/public ./public
COPY --from=builder --chown=nuxtjs:nodejs /app/package.json ./package.json

# Configurações de ambiente otimizadas para Coolify
ENV NODE_ENV=production
ENV NITRO_PORT=3000
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PRESET=node-server

# Otimizações de performance
ENV NODE_OPTIONS="--max-old-space-size=1024"
ENV UV_THREADPOOL_SIZE=4

# Configurações de segurança
USER nuxtjs

# Health check para Coolify
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Expor porta
EXPOSE 3000

# Comando otimizado para produção
CMD ["node", ".output/server/index.mjs"]