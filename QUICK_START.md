# 🚀 Quick Start Guide

## Bước 1: Cài đặt Backend Dependencies

```bash
cd server
npm install
```

## Bước 2: Tạo file .env

Tạo file `.env` trong thư mục `server/` với nội dung:

```env
MONGODB_URI=mongodb://localhost:27017/project_management
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
```

## Bước 3: Khởi tạo MongoDB với dữ liệu mẫu

```bash
# Từ thư mục root
mongosh < init_mongo.js
```

## Bước 4: Chạy Backend

```bash
cd server
npm run dev
```

Backend sẽ chạy tại: http://localhost:5000

## Bước 5: Cài đặt Frontend Dependencies (nếu cần)

```bash
# Từ thư mục root
npm install
```

## Bước 6: Chạy Frontend

```bash
npm run dev
```

Frontend sẽ chạy tại: http://localhost:5173

## Hoặc chạy cả hai cùng lúc:

```bash
npm run dev:all
```

---

## 📁 Cấu trúc Backend

```
server/
├── config/          # Database connection
├── controllers/     # Business logic
│   ├── authController.js
│   ├── projectController.js
│   ├── listController.js
│   ├── taskController.js
│   ├── chatController.js
│   └── notificationController.js
├── middlewares/     # Auth middleware
├── models/          # Mongoose schemas
│   ├── User.js
│   ├── Project.js
│   ├── List.js
│   ├── Task.js
│   ├── Chatroom.js
│   ├── Chatmessage.js
│   └── Notification.js
├── routes/          # API routes
│   ├── authRoutes.js
│   ├── projectRoutes.js
│   ├── listRoutes.js
│   ├── taskRoutes.js
│   ├── chatRoutes.js
│   └── notificationRoutes.js
├── server.js        # Entry point
└── package.json
```

## 🧪 Test API

Bạn có thể sử dụng Postman hoặc curl để test API:

### Test đăng ký
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'
```

### Test đăng nhập
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"hashed_password"}'
```

### Test lấy danh sách dự án
```bash
curl http://localhost:5000/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 📝 Lưu ý

1. Đảm bảo MongoDB đang chạy trước khi start backend
2. Token JWT được trả về sau khi đăng nhập/đăng ký thành công
3. Tất cả các API (trừ register/login) đều yêu cầu token trong headers
4. Dữ liệu mẫu trong `init_mongo.js` sẽ tạo 2 users và 1 project

## ✅ Checklist

- [ ] MongoDB đang chạy
- [ ] Backend dependencies đã cài đặt
- [ ] File .env đã được tạo
- [ ] Dữ liệu mẫu đã được import vào MongoDB
- [ ] Backend đang chạy trên port 5000
- [ ] Frontend đang chạy trên port 5173

## 🔗 Hữu ích

- [API Reference](./server/API_REFERENCE.md) - Chi tiết về tất cả endpoints
- [Setup Guide](./SETUP_GUIDE.md) - Hướng dẫn setup chi tiết
- [Backend README](./server/README.md) - Tài liệu backend

