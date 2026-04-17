# Travel Management System

Hệ thống quản lý du lịch full-stack với React + NestJS

## Mô tả

Travel System là ứng dụng web quản lý tour du lịch và đặt booking với các tính năng bảo mật cao.

## Công nghệ sử dụng

### Backend
- **Framework**: NestJS + TypeScript
- **Database**: MongoDB + Mongoose
- **Cache**: Redis
- **Authentication**: JWT với refresh token
- **Email**: Nodemailer + Handlebars templates

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **HTTP Client**: Axios

### DevOps
- **Containerization**: Docker + Docker Compose

## Tính năng chính

### 🔐 Authentication & Security
- JWT system với access/refresh token
- Session management với Redis
- Rate limiting và audit logging
- Password reset flow

### 👤 User Management
- Đăng ký/đăng nhập
- Quản lý profile
- Cài đặt bảo mật

### 🏖️ Tour Management
- CRUD tours (Admin)
- Tìm kiếm và filter tours
- Upload images

### 📋 Booking System
- Quy trình booking 4 bước
- Quản lý travelers
- Tính toán giá (người lớn/trẻ em)
- Hủy booking với lý do

### 📧 Email Service
- Xác nhận booking
- Thông báo hủy
- Reset password
- Security alerts

### 🎛️ Admin Dashboard
- Thống kê booking
- Quản lý tours
- Quản lý bookings

## Cài đặt nhanh

### Với Docker (Khuyến nghị)

```bash
# Clone repository
git clone https://github.com/nguyenhung204/travel-system.git
cd travel-system

# Cấu hình environment
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Khởi chạy
docker-compose up -d

# Seed dữ liệu mẫu
docker-compose exec backend npm run seed
```

### Truy cập ứng dụng
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## Scripts chính

```bash
# Backend
npm run start:dev      # Development server
npm run build          # Build production
npm run seed           # Seed database

# Frontend
npm run dev            # Development server
npm run build          # Build production

# Docker
docker-compose up -d            # Start all services
docker-compose down             # Stop all services
docker-compose logs -f backend  # View logs
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/profile` - Lấy profile
- `PUT /api/auth/change-password` - Đổi mật khẩu

### Tours
- `GET /api/tours` - Danh sách tours
- `POST /api/tours` - Tạo tour (Admin)
- `PUT /api/tours/:id` - Cập nhật tour (Admin)
- `DELETE /api/tours/:id` - Xóa tour (Admin)

### Bookings
- `GET /api/bookings/my-bookings` - Booking của user
- `POST /api/bookings` - Tạo booking mới
- `PUT /api/bookings/:id/cancel` - Hủy booking
- `GET /api/bookings/stats` - Thống kê (Admin)

## Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/travel_system
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-jwt-secret
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001
```

## Troubleshooting

```bash
# Check services status
docker-compose ps

# View logs
docker-compose logs mongodb
docker-compose logs redis
docker-compose logs backend

# Restart service
docker-compose restart backend

# Reset database
docker-compose down -v
docker-compose up -d
```


