# 🚀 GROUP 9 PROJECT - USER MANAGEMENT SYSTEM

Ứng dụng web quản lý người dùng full-stack với authentication, profile management và admin dashboard.

---

## 👥 THÀNH VIÊN NHÓM

| Họ Tên | MSSV | Vai Trò | Công Việc |
|--------|------|---------|-----------|
| **Đỗ Nhật Hào** | 224168 | Backend Developer | RESTful API, JWT Authentication, MongoDB, Deploy backend lên Render.com |
| **Nguyễn Hoàng Anh Kiệt** | 226117 | Frontend Developer | React UI/UX, Components, Routing, API Integration, Responsive Design |
| **Trần Chí Linh** | 221880 | Database Manager | MongoDB Schema, Database Connection, Testing, Documentation |

---

## 🛠️ CÔNG NGHỆ

**Backend:** Node.js, Express.js, MongoDB, JWT, bcrypt, Multer  
**Frontend:** React.js, React Router, Axios, React Hot Toast  
**Database:** MongoDB Atlas  
**Deployment:** Render.com

---

## 🌐 DEPLOYMENT

**Backend API:** https://group9-project.onrender.com  
**Status:** ✅ Live  
**Version:** 2.0.0

---

## ✨ TÍNH NĂNG

### 🔐 Authentication
- Đăng ký, Đăng nhập, Đăng xuất
- JWT Token Authentication
- Quên mật khẩu & Reset password
- Protected Routes

### 👤 Profile Management
- Xem và chỉnh sửa thông tin cá nhân
- Đổi mật khẩu
- Upload avatar
- Xóa tài khoản

### 👑 Admin Dashboard
- Quản lý danh sách users
- Thêm, sửa, xóa users
- Thống kê người dùng
- Role-Based Access Control (RBAC)

---

## 🚀 HƯỚNG DẪN CÀI ĐẶT

### Backend
```bash
cd backend
npm install

# Tạo file .env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d

npm start
```

### Frontend
```bash
cd frontend
npm install

# Tạo file .env
REACT_APP_API_URL=https://group9-project.onrender.com

npm start
```

---

## 🔌 API ENDPOINTS

### Authentication (`/api/auth`)
- `POST /signup` - Đăng ký
- `POST /login` - Đăng nhập
- `POST /logout` - Đăng xuất
- `GET /me` - Lấy thông tin user
- `POST /forgot-password` - Quên mật khẩu
- `POST /reset-password/:token` - Reset mật khẩu

### Profile (`/api/profile`)
- `GET /` - Lấy profile
- `PUT /` - Cập nhật profile
- `PUT /password` - Đổi mật khẩu
- `POST /avatar` - Upload avatar
- `DELETE /` - Xóa tài khoản

### Admin (`/api/admin`) - Yêu cầu Admin Role
- `GET /users` - Danh sách users
- `POST /users` - Tạo user
- `GET /users/:id` - Chi tiết user
- `PUT /users/:id` - Cập nhật user
- `DELETE /users/:id` - Xóa user
- `GET /stats` - Thống kê

---

## 📂 CẤU TRÚC DỰ ÁN

```
group9-project/
├── backend/
│   ├── controllers/      # Business logic
│   ├── models/           # Database schemas
│   ├── routes/           # API routes
│   ├── middlewares/      # Auth, Upload
│   └── server.js
│
└── frontend/
    └── src/
        ├── components/   # UI Components
        ├── pages/        # Pages
        ├── services/     # API calls
        ├── context/      # Auth Context
        └── App.js
```

---

## 🧪 TEST API

```bash
# Test Backend
curl https://group9-project.onrender.com/

# Test Signup
curl -X POST https://group9-project.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"123456"}'
```

---

## 📝 LƯU Ý

- File `.env` không được commit (đã có trong `.gitignore`)
- Restart React server sau khi thay đổi `.env`
- Render.com có cold start (~30s cho request đầu tiên)
- Password được hash với bcrypt (salt rounds: 10)
- JWT token hết hạn sau 30 ngày

---

## 📞 LIÊN HỆ

**Repository:** https://github.com/DoNhatHao/group9-project  
**Team:** Đỗ Nhật Hào, Nguyễn Hoàng Anh Kiệt, Trần Chí Linh

---

**Version:** 2.0.0 | **Updated:** November 1, 2025 | **Status:** ✅ Production Ready
