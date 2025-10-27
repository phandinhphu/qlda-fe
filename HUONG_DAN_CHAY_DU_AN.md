# 🚀 HƯỚNG DẪN CHẠY DỰ ÁN QUẢN LÝ DỰ ÁN

## ⚙️ YÊU CẦU HỆ THỐNG

1. **Node.js** (v16+) - Download tại: https://nodejs.org/
2. **MongoDB** - Download tại: https://www.mongodb.com/try/download/community
3. **Git** (nếu cần)

---

## 📝 BƯỚC 1: TẠO FILE .ENV

Tạo file `.env` trong thư mục `server/` với nội dung sau:

```env
MONGODB_URI=mongodb://localhost:27017/project_management
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
```

**Cách tạo trong Windows:**
1. Mở Notepad
2. Copy nội dung ở trên vào
3. Lưu file với tên `.env` (không có phần mở rộng)
4. Đặt file này vào thư mục `server/`

---

## 📦 BƯỚC 2: CÀI ĐẶT DEPENDENCIES

### 2.1. Cài đặt Backend
```bash
cd server
npm install
```

### 2.2. Cài đặt Frontend
```bash
# Quay lại thư mục gốc
cd ..
npm install
```

---

## 🗄️ BƯỚC 3: KHỞI TẠO MONGODB

### 3.1. Khởi động MongoDB
- Mở **MongoDB Compass** hoặc
- Khởi động MongoDB service trong Services

### 3.2. Import dữ liệu mẫu
```bash
# Từ thư mục root (qlda-fe)
mongosh < server/init_mongo.js
```

Hoặc nếu dùng MongoDB Compass, connect tới `mongodb://localhost:27017`

---

## ▶️ BƯỚC 4: CHẠY DỰ ÁN

### CÁCH 1: Chạy cả Backend và Frontend cùng lúc (KHUYẾN NGHỊ)

```bash
# Từ thư mục gốc
npm run dev:all
```

Lệnh này sẽ tự động chạy:
- Backend tại: http://localhost:5000
- Frontend tại: http://localhost:5173

---

### CÁCH 2: Chạy riêng từng phần

#### Terminal 1 - Chạy Backend:
```bash
cd server
npm run dev
```

#### Terminal 2 - Chạy Frontend:
```bash
# Từ thư mục gốc
npm run dev
```

---

## 🌐 TRUY CẬP ỨNG DỤNG

1. **Frontend**: http://localhost:5173
2. **Backend API**: http://localhost:5000

---

## 🔐 ĐĂNG NHẬP

Sau khi import dữ liệu mẫu, bạn có thể đăng nhập với:

**Email:** john@example.com  
**Password:** hashed_password

HOẶC **Đăng ký tài khoản mới** ngay trên giao diện đăng nhập.

---

## 📋 DANH SÁCH SCRIPTS

### Frontend (từ thư mục gốc):
- `npm run dev` - Chạy development server
- `npm run build` - Build production
- `npm run lint` - Chạy ESLint
- `npm run dev:all` - Chạy cả Backend + Frontend

### Backend (từ thư mục server):
- `npm run dev` - Chạy với nodemon (auto-reload)
- `npm start` - Chạy production

---

## 🐛 XỬ LÝ LỖI

### Lỗi "Cannot find module"
```bash
# Xóa node_modules và cài lại
rm -rf node_modules package-lock.json
npm install
```

### Lỗi MongoDB connection
- Kiểm tra MongoDB đang chạy
- Kiểm tra MONGODB_URI trong file .env

### Lỗi port đã được sử dụng
- Backend: Đổi PORT trong file .env
- Frontend: Vite sẽ tự động tìm port khác

### Lỗi "mongosh is not recognized"
- Cài đặt MongoDB Shell
- Hoặc dùng MongoDB Compass để import data

---

## 📁 CẤU TRÚC DỰ ÁN

```
qlda-fe/
├── server/              # Backend (Node.js + Express + MongoDB)
│   ├── .env            # ⚠️ CẦN TẠO FILE NÀY
│   ├── init_mongo.js   # Dữ liệu mẫu
│   ├── server.js       # Entry point
│   ├── controllers/    # Business logic
│   ├── models/         # MongoDB schemas
│   ├── routes/         # API routes
│   └── middlewares/    # Authentication
│
├── src/                # Frontend (React)
│   ├── pages/          # Pages
│   ├── components/     # React components
│   ├── context/        # Auth context
│   └── services/       # API service
│
└── package.json        # Frontend dependencies
```

---

## 🎯 TÍNH NĂNG ĐÃ CÓ

✅ **Authentication**: Đăng ký, đăng nhập, JWT  
✅ **Dashboard**: Quản lý projects  
✅ **Project Board**: Drag-and-drop tasks (kiểu Trello)  
✅ **Lists & Tasks**: Tạo, sửa, xóa lists và tasks  
✅ **Priority Levels**: Low, Medium, High  
✅ **API Ready**: Backend đầy đủ cho Chat, Notifications  

---

## 📚 TÀI LIỆU THÊM

- [START_HERE.md](./START_HERE.md) - Hướng dẫn bắt đầu
- [QUICK_START.md](./QUICK_START.md) - Quick start guide
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Setup chi tiết
- [server/API_REFERENCE.md](./server/API_REFERENCE.md) - API documentation

---

## ✅ CHECKLIST

Trước khi chạy, đảm bảo:

- [ ] MongoDB đã được cài đặt và đang chạy
- [ ] Node.js đã được cài đặt
- [ ] File `.env` đã được tạo trong `server/`
- [ ] Đã chạy `npm install` cho cả frontend và backend
- [ ] Đã import dữ liệu mẫu bằng `mongosh < server/init_mongo.js`

---

## 🎉 SẴN SÀNG!

Sau khi hoàn tất các bước trên:
1. Chạy `npm run dev:all`
2. Mở browser: http://localhost:5173
3. Đăng nhập hoặc đăng ký
4. Bắt đầu sử dụng!

**Chúc bạn phát triển thành công!** 🚀

