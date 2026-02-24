# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Passo crítico: copiar os arquivos de dependência explicitamente
COPY package.json package-lock.json ./

# Instalação rigorosa
RUN npm ci

# Copia o restante do código
COPY . .

# Build do Nuxt
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS runner

WORKDIR /app

# Usuário não-root para segurança
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nuxtjs

# Copia apenas o necessário para execução
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package.json ./package.json

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

USER nuxtjs

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]