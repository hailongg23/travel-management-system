# Giai đoạn 1: Builder (Vẫn dùng Node để biên dịch mã nguồn)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Giai đoạn 2: Production (Chỉ dùng Nginx siêu nhẹ)
FROM nginx:alpine AS production

# Cài đặt wget cho Healthcheck (Nginx alpine không có sẵn wget bản đầy đủ)
RUN apk add --no-cache wget

# Xóa các file mặc định của Nginx
RUN rm -rf /usr/share/nginx/html/*

# Lấy thành phẩm từ Builder thả vào Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# [QUAN TRỌNG]: Cấu hình Nginx để React Router không bị lỗi 404 khi người dùng F5 trang
RUN echo "server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files \$uri \$uri/ /index.html; \
    } \
}" > /etc/nginx/conf.d/default.conf

# Nginx mặc định chạy bằng non-root user 'nginx' nên ta không cần tạo thêm
EXPOSE 80

# Healthcheck ping thẳng vào trang chủ
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

# Khởi động Nginx
CMD ["nginx", "-g", "daemon off;"]
