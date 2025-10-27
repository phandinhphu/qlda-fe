# Hướng dẫn Setup Project Management System

## 📋 Tổng quan
Ứng dụng quản lý dự án giống Trello với Frontend React + Backend Node.js/Express + MongoDB

## 🚀 BƯỚC 1: Cài đặt MongoDB

### Windows:
1. Tải MongoDB Community Edition từ: https://www.mongodb.com/try/download/community
2. Cài đặt MongoDB
3. Khởi động MongoDB service
4. Tạo database bằng cách chạy file `init_mongo.js`:
```bash
mongosh < init_mongo.js
```

## 🚀 BƯỚC 2: Setup Backend

1. **Di chuyển vào thư mục server:**
```bash
cd server
```

2. **Cài đặt dependencies:**
```bash
npm install
```

3. **Tạo file `.env` trong thư mục server:**
```env
MONGODB_URI=mongodb://localhost:27017/project_management
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
```

4. **Chạy backend server:**
```bash
npm run dev
```

Backend sẽ chạy tại: http://localhost:5000

## 🚀 BƯỚC 3: Setup Frontend

1. **Quay về thư mục gốc và cài đặt dependencies (nếu chưa có):**
```bash
cd ..
npm install
```

2. **Chạy frontend:**
```bash
npm run dev
```

Frontend sẽ chạy tại: http://localhost:5173

## 🚀 BƯỚC 4: Chạy cả Frontend và Backend cùng lúc

Ở thư mục gốc, chạy:
```bash
npm run dev:all
```

## 📁 Cấu trúc thư mục

```
project-root/
├── server/                 # Backend (Node.js + Express)
│   ├── config/            # Database config
│   ├── controllers/        # Business logic
│   ├── middlewares/       # Auth middleware
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API routes
│   ├── server.js          # Entry point
│   └── package.json
├── src/                   # Frontend (React)
│   ├── components/
│   ├── pages/
│   ├── App.jsx
│   └── main.jsx
├── init_mongo.js          # MongoDB seed data
└── package.json
```

## 🔑 API Endpoints chính

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Lấy thông tin user hiện tại

### Projects
- `GET /api/projects` - Lấy danh sách dự án
- `POST /api/projects` - Tạo dự án mới
- `PUT /api/projects/:id` - Cập nhật dự án
- `DELETE /api/projects/:id` - Xóa dự án
- `POST /api/projects/:id/members` - Thêm thành viên
- `DELETE /api/projects/:id/members/:memberId` - Xóa thành viên

### Lists
- `GET /api/lists/:projectId` - Lấy danh sách lists của project
- `POST /api/lists/:projectId` - Tạo list mới
- `PUT /api/lists/:id` - Cập nhật list
- `DELETE /api/lists/:id` - Xóa list

### Tasks
- `GET /api/tasks/:id` - Lấy chi tiết task
- `POST /api/tasks/:listId` - Tạo task mới
- `PUT /api/tasks/:id` - Cập nhật task
- `DELETE /api/tasks/:id` - Xóa task
- `POST /api/tasks/:id/steps` - Thêm step
- `POST /api/tasks/:id/labels` - Thêm label
- `POST /api/tasks/:id/comments` - Thêm comment

### Chat & Notifications
- `GET /api/chat/project/:projectId` - Lấy danh sách chatrooms
- `POST /api/chat/project/:projectId` - Tạo chatroom
- `GET /api/chat/:chatroomId/messages` - Lấy messages
- `POST /api/chat/:chatroomId/messages` - Gửi message
- `GET /api/notifications` - Lấy notifications
- `PUT /api/notifications/:id/read` - Đánh dấu đã đọc

## 🎯 EPIC 1: Quản lý dự án
✅ Hiển thị danh sách dự án  
✅ Tạo dự án mới  
✅ Sửa thông tin dự án  
✅ Xóa dự án  
✅ Thêm/xóa thành viên  

## 🎯 EPIC 2: Phân công công việc
✅ Hiển thị danh sách công việc (lists)  
✅ Tạo/sửa/xóa lists  
✅ Tạo/sửa/xóa tasks  
✅ Đánh dấu hoàn thành  
✅ Gán công việc cho thành viên  
✅ Thêm steps, labels, comments, files  

## 🎯 EPIC 3: Quản lý tài khoản
✅ Đăng ký tài khoản mới  
✅ Đăng nhập (JWT)  
✅ Xem/sửa hồ sơ người dùng  
✅ Quên mật khẩu (placeholder)  

## 🔒 JWT Authentication
- Token được lưu trong localStorage
- Headers: `Authorization: Bearer <token>`
- Token hết hạn sau 7 ngày

## 📝 Lưu ý

1. Đảm bảo MongoDB đang chạy trước khi start backend
2. Backend chạy ở cổng 5000
3. Frontend chạy ở cổng 5173 (hoặc cổng khác nếu 5173 đã bị dùng)
4. Dữ liệu mẫu trong `init_mongo.js` sẽ tạo 2 user và 1 project mẫu

## 🐛 Troubleshooting

**Lỗi kết nối MongoDB:**
- Kiểm tra MongoDB service đang chạy
- Kiểm tra MONGODB_URI trong file .env

**Lỗi module not found:**
- Chạy `npm install` lại trong cả thư mục root và server

**Lỗi CORS:**
- Đảm bảo backend có cors enabled
- Kiểm tra API URL trong frontend

## 🎉 Bước tiếp theo: Frontend Development

Backend đã hoàn tất! Bây giờ bạn có thể bắt đầu xây dựng React frontend với các API này.

Hãy tạo:
1. Auth pages (Login, Register)
2. Dashboard (hiển thị projects)
3. Project details (boards với drag-and-drop)
4. Task cards với các action (edit, assign, comment)
5. Chat component
6. Notifications component

