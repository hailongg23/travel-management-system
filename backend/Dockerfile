# Giai đoạn 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci && npm cache clean --force
COPY . .
RUN npm run build

# Giai đoạn 2: Production
FROM node:20-alpine AS production

RUN apk add --no-cache dumb-init wget
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

WORKDIR /app
COPY package*.json ./

# [SỬA]: Dùng cú pháp chuẩn của npm v8+ trở lên
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist

USER nestjs
EXPOSE 3001

# [LƯU Ý]: Đảm bảo code NestJS của bạn có route /health, nếu không hãy đổi URL dưới đây
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider https://api.hailong.online/api/health || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main.js"]
