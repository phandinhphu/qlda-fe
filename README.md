# 📋 Project Management System

Ứng dụng quản lý dự án giống Trello với đầy đủ tính năng quản lý công việc, chat nhóm và thông báo.

## 🎯 Tính năng chính

- **Quản lý dự án**: Tạo, sửa, xóa dự án và quản lý thành viên
- **Quản lý công việc**: Danh sách công việc (lists) và tasks với drag-and-drop
- **Phân công công việc**: Gán task cho thành viên, đánh dấu hoàn thành
- **Chat nhóm**: Chat realtime trong từng dự án
- **Thông báo**: Hệ thống thông báo khi có thay đổi
- **Authentication**: JWT authentication bảo mật

## 🛠️ Công nghệ sử dụng

**Frontend:**
- ✅ React 19 + Vite
- ✅ Tailwind CSS 4
- ✅ @hello-pangea/dnd (drag-and-drop)
- ✅ React Router 7
- ✅ Context API
- ✅ Framer Motion

**Backend:**
- ✅ Node.js + Express
- ✅ MongoDB + Mongoose
- ✅ JWT Authentication
- ✅ bcryptjs

## 🚀 Cài đặt và chạy

### Bước 1: Clone repository
```bash
git clone <repository-url>
cd qlda-fe
```

### Bước 2: Cài đặt Backend
```bash
cd server
npm install
```

### Bước 3: Tạo file .env trong thư mục server/
```env
MONGODB_URI=mongodb://localhost:27017/project_management
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
```

### Bước 4: Khởi tạo MongoDB
```bash
# Từ thư mục root
mongosh < init_mongo.js
```

### Bước 5: Chạy Backend
```bash
cd server
npm run dev
```
Backend chạy tại: http://localhost:5000

### Bước 6: Cài đặt Frontend
```bash
# Từ thư mục root
npm install
```

### Bước 7: Chạy Frontend
```bash
npm run dev
```
Frontend chạy tại: http://localhost:5173

### Hoặc chạy cả hai cùng lúc:
```bash
npm run dev:all
```

## 📸 Demo

### Login
- Email/Password authentication
- Register new users
- JWT token management

### Dashboard
- View all projects
- Create new project
- Delete project
- Navigate to project details

### Project Board (Trello-like)
- Multiple lists (To Do, In Progress, Done, etc.)
- Create/Delete lists
- Create tasks in each list
- **Drag-and-drop** tasks between lists
- Priority levels (Low, Medium, High)
- Task details and descriptions

## 📚 Tài liệu

- [Quick Start Guide](./QUICK_START.md) - Hướng dẫn nhanh
- [Setup Guide](./SETUP_GUIDE.md) - Hướng dẫn chi tiết
- [API Reference](./server/API_REFERENCE.md) - Tài liệu API
- [Backend README](./server/README.md) - Tài liệu backend

## 📁 Cấu trúc dự án

```
qlda-fe/
├── server/                 # Backend API
│   ├── config/            # Database config
│   ├── controllers/       # Business logic
│   ├── middlewares/       # Auth middleware
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API routes
│   └── server.js          # Entry point
├── src/                   # Frontend React
│   ├── components/        # React components
│   ├── pages/             # Pages
│   └── App.jsx
├── init_mongo.js          # MongoDB seed data
└── package.json
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Thông tin user hiện tại

### Projects
- `GET /api/projects` - Danh sách dự án
- `POST /api/projects` - Tạo dự án mới
- `PUT /api/projects/:id` - Cập nhật dự án
- `DELETE /api/projects/:id` - Xóa dự án
- `POST /api/projects/:id/members` - Thêm thành viên

### Lists & Tasks
- `GET /api/lists/:projectId` - Danh sách lists
- `POST /api/lists/:projectId` - Tạo list mới
- `GET /api/tasks/:id` - Chi tiết task
- `POST /api/tasks/:listId` - Tạo task mới
- `PUT /api/tasks/:id` - Cập nhật task

### Chat & Notifications
- `GET /api/chat/project/:projectId` - Danh sách chatrooms
- `GET /api/chat/:chatroomId/messages` - Lấy messages
- `GET /api/notifications` - Danh sách notifications

Xem chi tiết tại [API Reference](./server/API_REFERENCE.md)

## 🔐 Authentication

Tất cả API (trừ register/login) đều yêu cầu JWT token trong headers:

```
Authorization: Bearer <token>
```

## 📝 License

MIT License

## 👥 Contributors

Your Team

---

Để biết thêm chi tiết, xem [Setup Guide](./SETUP_GUIDE.md)
