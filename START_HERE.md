# 🚀 START HERE - Hướng dẫn khởi động dự án

## ⚡ Quick Start (3 Bước)

### Bước 1: Cài đặt MongoDB
1. Tải và cài đặt MongoDB: https://www.mongodb.com/try/download/community
2. Khởi động MongoDB service
3. Import dữ liệu mẫu:
```bash
mongosh < init_mongo.js
```

### Bước 2: Cài đặt Backend
```bash
cd server
npm install

# Tạo file .env (nếu chưa có)
echo "MONGODB_URI=mongodb://localhost:27017/project_management" > .env
echo "JWT_SECRET=your-super-secret-jwt-key" >> .env
echo "PORT=5000" >> .env

# Chạy backend
npm run dev
```

Backend sẽ chạy tại: **http://localhost:5000**

### Bước 3: Cài đặt Frontend
```bash
# Từ thư mục root
cd ..
npm install
npm run dev
```

Frontend sẽ chạy tại: **http://localhost:5173**

## 🎯 Hoặc chạy cả hai cùng lúc:
```bash
npm run dev:all
```

---

## 📋 Tính năng đã hoàn thành

### ✅ Authentication
- Đăng ký tài khoản mới
- Đăng nhập với JWT
- Auto-login với token
- Logout

### ✅ Dashboard
- Hiển thị tất cả projects
- Tạo project mới
- Xóa project
- Điều hướng vào project chi tiết

### ✅ Project Board (Trello-like)
- **Drag-and-Drop**: Di chuyển task giữa các lists
- Tạo/Xóa lists
- Tạo/Xóa tasks
- Priority levels (Low/Medium/High)
- Giao diện hiện đại

### ✅ API Ready (Backend đã sẵn sàng)
- Chat rooms và messages
- Notifications
- Task details (steps, labels, comments)
- User management

---

## 🔐 Đăng nhập

### Tài khoản mẫu (sau khi import init_mongo.js):
```
Email: john@example.com
Password: hashed_password
```

**Hoặc đăng ký tài khoản mới:**
1. Click "Sign up" trên trang login
2. Điền thông tin
3. Tự động đăng nhập và vào Dashboard

---

## 🎨 Giao diện

- **Login Page**: Gradient background, form validation
- **Dashboard**: Grid layout, project cards
- **Project Board**: Trello-like kanban board với drag-and-drop
- **Modals**: Tạo project, list, task
- **Responsive**: Mobile-friendly

---

## 📁 Cấu trúc File

```
qlda-fe/
├── server/                    # Backend API
│   ├── controllers/          # Business logic
│   ├── models/               # Mongoose schemas
│   ├── routes/               # API routes
│   ├── middlewares/          # Auth middleware
│   └── server.js             # Entry point
├── src/                      # Frontend React
│   ├── components/           # Reusable components
│   ├── context/              # Auth context
│   ├── pages/                # Pages
│   ├── services/             # API service
│   └── App.jsx               # Main app
├── init_mongo.js             # MongoDB seed data
└── package.json
```

---

## 🧪 Test API

### Test với curl:
```bash
# Đăng ký
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'

# Đăng nhập
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Lấy projects (thay YOUR_TOKEN)
curl http://localhost:5000/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📚 Documentation

- [README.md](./README.md) - Tổng quan dự án
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Hướng dẫn setup chi tiết
- [QUICK_START.md](./QUICK_START.md) - Quick start guide
- [BACKEND_SUMMARY.md](./BACKEND_SUMMARY.md) - Backend summary
- [FRONTEND_SUMMARY.md](./FRONTEND_SUMMARY.md) - Frontend summary
- [server/API_REFERENCE.md](./server/API_REFERENCE.md) - API documentation

---

## 🎉 Đã sẵn sàng!

1. Start MongoDB
2. Start Backend: `cd server && npm run dev`
3. Start Frontend: `npm run dev`
4. Mở browser: http://localhost:5173
5. Đăng ký hoặc đăng nhập
6. Tạo project mới
7. Tạo lists và tasks
8. **Drag-and-drop tasks** giữa các lists!

---

## 🐛 Troubleshooting

### Lỗi MongoDB
- Kiểm tra MongoDB service đang chạy
- Kiểm tra connection string trong .env

### Lỗi CORS
- Đảm bảo backend đang chạy
- Backend có CORS enabled

### Lỗi port
- Backend: đổi PORT trong .env
- Frontend: Vite tự động đổi port

### Lỗi API
- Kiểm tra backend logs
- Kiểm tra network tab trong browser DevTools

---

## 🎊 Chúc bạn phát triển thành công!

**Hãy bắt đầu với:** `npm run dev:all`

