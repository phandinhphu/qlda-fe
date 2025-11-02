# Quản Lý Dự Án - Frontend (QLDA Frontend)

## 📋 Mô Tả

Ứng dụng web frontend được xây dựng bằng React 19 và Vite để quản lý dự án. Ứng dụng hỗ trợ xác thực người dùng, quản lý dự án và các tính năng liên quan.

## 🏗️ Cấu Trúc Dự Án

```
qlda-fe/
├── public/                 # Tài nguyên tĩnh
│   └── vite.svg
├── src/
│   ├── __tests__/         # Thư mục test
│   │   ├── components/    # Test cho các components
│   │   ├── pages/         # Test cho các pages
│   │   ├── utils/         # Utilities cho testing
│   │   └── setup.js       # Setup cho test environment
│   ├── assets/            # Assets (images, icons, etc.)
│   ├── components/        # React components
│   │   ├── common/        # Components dùng chung (LoadingScreen, etc.)
│   │   ├── projects/      # Components liên quan đến dự án
│   │   │   ├── ProjectCard.jsx
│   │   │   ├── ProjectForm.jsx
│   │   │   ├── ProjectList.jsx
│   │   │   └── ProjectModal.jsx
│   │   ├── Spinner.jsx    # Component spinner
│   │   └── Toast.jsx      # Component toast notification
│   ├── contexts/          # React Context providers
│   │   └── auth/
│   │       ├── AuthProvider.jsx  # Provider quản lý authentication state
│   │       └── Context.js         # Auth context definition
│   ├── hooks/             # Custom React hooks
│   │   └── auth.js        # Hook sử dụng auth context (useAuth)
│   ├── layouts/           # Layout components
│   │   └── DefaultLayout/ # Layout mặc định cho các trang cần auth
│   │       ├── DefaultLayout.jsx
│   │       └── index.js
│   ├── pages/             # Page components (routes)
│   │   ├── Home.jsx       # Trang chủ
│   │   ├── Login.jsx      # Trang đăng nhập
│   │   ├── ProjectsPage.jsx # Trang danh sách dự án
│   │   └── Register.jsx   # Trang đăng ký
│   ├── routes/            # Routing configuration
│   │   ├── AppRouter.jsx  # Router chính của ứng dụng
│   │   ├── publicRoutes.jsx # Định nghĩa các routes công khai
│   │   └── RouteGuard.jsx # Component bảo vệ routes (kiểm tra auth)
│   ├── services/          # API service layer
│   │   ├── authServices.js    # Services cho authentication
│   │   └── projectService.js  # Services cho projects
│   ├── utils/             # Utility functions
│   │   ├── constants.js   # Các hằng số (API_URL, etc.)
│   │   └── httpRequest.js # Axios instance và HTTP methods
│   ├── App.jsx            # Component root của ứng dụng
│   ├── App.css            # Styles cho App component
│   ├── main.jsx           # Entry point của ứng dụng
│   └── index.css          # Global styles
├── .prettierrc            # Prettier configuration
├── eslint.config.js       # ESLint configuration
├── index.html             # HTML template
├── package.json           # Dependencies và scripts
├── vite.config.js         # Vite configuration
└── vitest.config.js       # Vitest configuration
```

## 🔄 Luồng Chạy Thực Tế

### 1. Khởi Động Ứng Dụng (Application Bootstrap)

```
main.jsx (Entry Point)
    ↓
    ├── Tạo React root và render App component
    ├── Áp dụng StrictMode để phát hiện lỗi
    └── Import global CSS (index.css)
```

**Chi tiết:**
- `main.jsx` là điểm khởi đầu của ứng dụng
- Sử dụng `createRoot` từ React 19 để tạo root
- `StrictMode` giúp phát hiện các vấn đề tiềm ẩn trong development

### 2. App Component (App.jsx)

```
App Component
    ↓
    ├── Bọc toàn bộ ứng dụng trong AuthProvider
    │   └── Cung cấp authentication context cho toàn bộ app
    └── Render AppRouters (định tuyến chính)
```

**Chi tiết:**
- `App.jsx` là component gốc, bọc toàn bộ ứng dụng trong `AuthProvider`
- `AuthProvider` quản lý state xác thực (user, loading, etc.)
- `AppRouters` xử lý routing cho toàn bộ ứng dụng

### 3. Authentication Flow (AuthProvider)

```
AuthProvider khởi tạo
    ↓
    ├── useState: user = null, loading = true
    └── useEffect: Gọi getCurrentUser()
        ↓
        ├── Nếu có user: setUser(user), setLoading(false)
        ├── Nếu không có: setUser(null), setLoading(false)
        └── Hiển thị LoadingScreen trong khi loading = true
```

**Các method trong AuthProvider:**
- `handleLogin(username, password)` → Gọi `authServices.login()`
- `handleLogout()` → Gọi `authServices.logout()` và `setUser(null)`
- `handleRegister(userData)` → Gọi `authServices.register()`
- `handleSaveUser(userData)` → Cập nhật user trong state
- `handleUpdateUser(updatedUser)` → Cập nhật thông tin user

**Context cung cấp:**
```javascript
{
    user: User object hoặc null,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
    updateUser: handleUpdateUser,
    saveUser: handleSaveUser
}
```

### 4. Routing Flow (AppRouter.jsx)

```
AppRouter
    ↓
    ├── Sử dụng BrowserRouter từ react-router-dom
    └── Map qua publicRoutes để tạo Routes
        ↓
        ├── Mỗi route được bọc trong RouteGuard
        │   └── Kiểm tra requiresAuth
        │       ├── requiresAuth = true → Kiểm tra user có đăng nhập?
        │       │   ├── Có user → Cho phép truy cập
        │       │   └── Không có → Redirect về /login
        │       └── requiresAuth = false → Kiểm tra user có đăng nhập?
        │           ├── Có user → Redirect về /
        │           └── Không có → Cho phép truy cập
        └── Áp dụng Layout (nếu có)
            └── Render route.component
```

**Routes được định nghĩa trong publicRoutes.jsx:**
```javascript
[
    { path: '/login', component: LoginPage, layout: null, requiresAuth: false },
    { path: '/register', component: RegisterPage, layout: null, requiresAuth: false },
    { path: '/', component: HomePage, layout: DefaultLayout, requiresAuth: true },
    { path: '/projects', component: ProjectsPage, layout: DefaultLayout, requiresAuth: true }
]
```

### 5. HTTP Request Flow (Services → httpRequest)

```
Component/Page cần gọi API
    ↓
    ├── Gọi function từ services/ (ví dụ: authServices.login())
    ↓
    ├── Service function gọi httpRequest method (get, post, put, del)
    ↓
    ├── httpRequest sử dụng axios instance (QLDARequest)
    │   ├── baseURL: API_URL/api hoặc http://localhost:5000/api
    │   ├── withCredentials: true (gửi cookies)
    │   └── headers: Content-Type: application/json
    ↓
    ├── Request interceptor (nếu có)
    ├── Response interceptor
    │   ├── Success → Trả về response
    │   └── Error → Promise.reject(error)
    ↓
    └── Service function trả về data hoặc throw error
```

**Ví dụ luồng đăng nhập:**
```
User nhập email/password trong Login.jsx
    ↓
Login.jsx gọi handleLogin từ useAuth()
    ↓
AuthProvider.handleLogin() gọi authServices.login(email, password)
    ↓
authServices.login() gọi httpRequest.post('/auth/login', { email, password })
    ↓
QLDARequest (axios) gửi POST request đến /api/auth/login
    ↓
Backend xử lý và trả về response (set cookie)
    ↓
authServices.login() không trả về gì (chỉ throw error nếu có)
    ↓
AuthProvider.handleLogin() thành công → Không throw error
    ↓
Login.jsx có thể redirect hoặc cập nhật UI
```

### 6. Protected Route Flow (RouteGuard.jsx)

```
User truy cập route có requiresAuth = true
    ↓
RouteGuard được render
    ↓
├── Sử dụng useAuth() để lấy user từ context
    ↓
├── Nếu requiresAuth = true và !user
│   └── Navigate to="/login" replace → Redirect về trang login
    ↓
├── Nếu requiresAuth = false và user tồn tại
│   └── Navigate to="/" replace → Redirect về trang chủ
    ↓
└── Nếu điều kiện hợp lệ
    └── Render children (route component)
```

### 7. Page Component Flow

```
Route được match
    ↓
├── RouteGuard kiểm tra và cho phép truy cập
    ↓
├── Layout được áp dụng (nếu có)
│   └── DefaultLayout bọc children trong div.default-layout
    ↓
└── Page Component được render
    ├── Có thể sử dụng useAuth() để lấy user, login, logout, etc.
    ├── Có thể gọi services để fetch data
    ├── Render UI với data từ state hoặc API
    └── User tương tác → Trigger events → Cập nhật state/API
```

## 🛠️ Công Nghệ Sử Dụng

### Core
- **React 19.1.1**: UI library
- **React Router DOM 7.9.1**: Client-side routing
- **Vite**: Build tool và dev server (sử dụng rolldown-vite)

### Styling
- **Tailwind CSS 4.1.13**: Utility-first CSS framework
- **Framer Motion 12.23.16**: Animation library

### HTTP Client
- **Axios 1.9.0**: HTTP client cho API calls

### UI Components & Libraries
- **Radix UI**: Component primitives (Progress, Slot, Tabs)
- **Lucide React**: Icon library
- **React Toastify**: Toast notifications
- **@hello-pangea/dnd**: Drag and drop functionality

### Testing
- **Vitest**: Test framework
- **Testing Library**: Testing utilities
- **jsdom**: DOM environment cho testing

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Husky**: Git hooks
- **lint-staged**: Pre-commit linting

## 📝 Scripts

```bash
npm run dev          # Chạy development server
npm run build        # Build production
npm run preview      # Preview production build
npm run lint         # Chạy ESLint
npm run test         # Chạy tests với Vitest
npm run test:ui      # Chạy tests với UI
npm run test:run     # Chạy tests một lần
npm run test:coverage # Chạy tests với coverage report
```

## 🌐 Environment Variables

Tạo file `.env` trong thư mục `qlda-fe/`:
```
VITE_API_URL=http://localhost:5000
```

Nếu không có `VITE_API_URL`, ứng dụng sẽ sử dụng `http://localhost:5000/api` làm mặc định.

## 🔐 Authentication Flow Chi Tiết

### Đăng Nhập (Login)
1. User truy cập `/login`
2. `RouteGuard` kiểm tra: nếu đã đăng nhập → redirect về `/`
3. User nhập email/password và submit
4. `Login.jsx` gọi `login()` từ `useAuth()`
5. `AuthProvider.handleLogin()` gọi `authServices.login()`
6. Request được gửi đến `/api/auth/login` với cookies
7. Nếu thành công: backend set cookie, user có thể sử dụng app
8. `AuthProvider` có thể cập nhật user state nếu cần

### Lấy Thông Tin User Hiện Tại
- Khi app khởi động, `AuthProvider` tự động gọi `getCurrentUser()`
- Request đến `/api/auth/me` để lấy thông tin user từ session cookie
- Nếu có user → set vào state, nếu không → `user = null`

### Đăng Xuất (Logout)
1. User click logout
2. Gọi `logout()` từ `useAuth()`
3. `AuthProvider.handleLogout()` gọi `authServices.logout()`
4. Request đến `/api/auth/logout` để xóa session
5. `setUser(null)` để clear state
6. `RouteGuard` sẽ redirect về `/login` khi truy cập protected routes

## 📦 Build và Deploy

1. **Build production:**
   ```bash
   npm run build
   ```
   Output sẽ được tạo trong thư mục `dist/`

2. **Preview build:**
   ```bash
   npm run preview
   ```

3. **Deploy:**
   - Copy nội dung trong `dist/` lên web server (Nginx, Apache, etc.)
   - Đảm bảo server được cấu hình để serve static files
   - Cấu hình proxy cho API requests nếu cần

## 🧪 Testing

Ứng dụng sử dụng Vitest và Testing Library cho unit tests và integration tests. Các test files được đặt trong `src/__tests__/`.

Chạy tests:
```bash
npm run test        # Watch mode
npm run test:run    # Chạy một lần
npm run test:coverage # Với coverage report
```

## 📌 Lưu Ý Quan Trọng

1. **Cookies/Session**: Ứng dụng sử dụng `withCredentials: true` trong axios để gửi cookies, đảm bảo backend hỗ trợ CORS với credentials.

2. **Lazy Loading**: Các page components được lazy load để tối ưu performance:
   ```javascript
   const LoginPage = lazy(() => import('../pages/Login'));
   ```

3. **Context API**: Authentication state được quản lý bằng React Context để chia sẻ state toàn cục.

4. **Route Protection**: Tất cả routes cần authentication được bảo vệ bởi `RouteGuard`.

5. **Error Handling**: Services layer xử lý errors và throw Error với message phù hợp cho UI layer.