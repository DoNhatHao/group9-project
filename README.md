# 🚀 GROUP 9 PROJECT - USER MANAGEMENT WITH AUTHENTICATION

## 📋 Mô tả dự án
Ứng dụng web quản lý người dùng với các tính năng authentication và user management đầy đủ.

## 🛠 Công nghệ sử dụng
- **Backend:** Node.js, Express.js, MongoDB, JWT, bcrypt
- **Frontend:** React.js, Axios
- **Database:** MongoDB Atlas

## 📁 Cấu trúc dự án
```
group9-project/
├── backend/
│   └── backend/
│       ├── controllers/
│       │   ├── authController.js    # Authentication logic
│       │   └── userController.js    # User CRUD logic
│       ├── models/
│       │   └── User.js              # User schema
│       ├── routes/
│       │   ├── auth.js              # Auth routes
│       │   └── user.js              # User routes
│       ├── .env                     # Environment variables
│       ├── server.js                # Server entry point
│       └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── SignUp.jsx           # Sign up form
    │   │   ├── Login.jsx            # Login form
    │   │   ├── Dashboard.jsx        # User dashboard
    │   │   ├── Auth.css             # Auth styling
    │   │   └── Dashboard.css        # Dashboard styling
    │   ├── api.js                   # API service
    │   ├── App.js                   # Main app component
    │   └── index.js
    └── package.json
```

---

## 🚀 HƯỚNG DẪN CÀI ĐẶT VÀ CHẠY

### Bước 1: Clone repository
```bash
git clone https://github.com/DoNhatHao/group9-project.git
cd group9-project
```

### Bước 2: Cài đặt Backend
```bash
cd backend/backend
npm install
```

### Bước 3: Cấu hình môi trường (.env)
Tạo file `.env` trong thư mục `backend/backend/`:
```env
PORT=3001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
```

### Bước 4: Khởi động Backend
```bash
npm start
```
Backend sẽ chạy tại: `http://localhost:3001`

### Bước 5: Cài đặt Frontend (Terminal mới)
```bash
cd frontend
npm install
```

### Bước 6: Khởi động Frontend
```bash
npm start
```
Frontend sẽ chạy tại: `http://localhost:3000`

---

## 📌 HOẠT ĐỘNG 1: AUTHENTICATION CƠ BẢN

### ✅ Các chức năng đã hoàn thành:

#### 🔐 Backend API (Sinh viên 1)
1. **POST /api/auth/signup** - Đăng ký tài khoản
   - Kiểm tra email trùng
   - Mã hóa mật khẩu bằng bcrypt
   - Trả về JWT token

2. **POST /api/auth/login** - Đăng nhập
   - Xác thực email/password
   - Trả về JWT token

3. **POST /api/auth/logout** - Đăng xuất
   - Xóa token phía client

#### 🎨 Frontend UI (Sinh viên 2)
1. **SignUp Component** - Form đăng ký
   - Input: Name, Email, Password, Confirm Password
   - Validation
   - Error/Success messages

2. **Login Component** - Form đăng nhập
   - Input: Email, Password
   - Validation
   - Error/Success messages

3. **Dashboard Component** - Trang chính sau đăng nhập
   - Hiển thị thông tin user
   - Avatar placeholder
   - Nút logout

#### 🗄️ Database Schema
```javascript
User Schema:
- name: String (required)
- email: String (required, unique)
- password: String (required, hashed)
- role: String (user/admin)
- avatar: String
- resetPasswordToken: String
- resetPasswordExpire: Date
- timestamps: createdAt, updatedAt
```

---

## 🧪 TESTING

### Test Backend với Postman
Xem file: `TESTING_ACTIVITY1.md` để biết chi tiết

### Test Frontend
1. Mở browser tại `http://localhost:3000`
2. Test form Sign Up
3. Test form Login
4. Kiểm tra Dashboard
5. Test Logout

---

## 📸 SCREENSHOTS YÊU CẦU

### Backend (Postman):
- ✅ POST /api/auth/signup (201)
- ❌ POST /api/auth/signup với email trùng (400)
- ✅ POST /api/auth/login (200)
- ❌ POST /api/auth/login với password sai (401)
- ✅ POST /api/auth/logout (200)

### Frontend (Browser):
- ✅ Sign Up form
- ✅ Success message sau sign up
- ✅ Login form
- ✅ Dashboard sau login
- ✅ JWT token trong localStorage

---

## 🌿 GIT WORKFLOW

### Các nhánh:
- `main` - Nhánh chính, stable code
- `backend` - Development backend
- `backend-auth` - Authentication API
- `frontend` - Development frontend
- `frontend-auth` - Authentication UI

### Quy trình làm việc:
1. Tạo nhánh feature từ `main`
2. Develop và test
3. Commit với message rõ ràng
4. Push lên GitHub
5. Tạo Pull Request
6. Review code
7. Merge vào `main`

### Commit messages:
```bash
git commit -m "Backend: Add authentication with JWT and bcrypt"
git commit -m "Frontend: Add Login and SignUp components"
git commit -m "Database: Update User schema with role and password"
```

---

## 👥 PHÂN CÔNG NHÓM

### Sinh viên 1 - Backend Developer
- [x] API Authentication (signup, login, logout)
- [ ] API Profile Management (GET, PUT)
- [ ] API User Management (Admin)
- [ ] API Reset Password
- [ ] API Upload Avatar

### Sinh viên 2 - Frontend Developer
- [x] UI Authentication (SignUp, Login)
- [x] Dashboard component
- [ ] Profile page
- [ ] Admin panel
- [ ] Forgot Password flow

### Sinh viên 3 - Database & Git Manager
- [x] User schema setup
- [ ] Test data seeding
- [ ] Pull Request review
- [ ] Git merge management
- [ ] Testing documentation

---

## 🔜 NEXT ACTIVITIES

### Hoạt động 2: Profile Management
- API: GET /api/profile, PUT /api/profile
- UI: Profile page, Edit form

### Hoạt động 3: User Management (Admin)
- API: GET /api/users, DELETE /api/users/:id
- UI: Admin dashboard, User list
- Middleware: RBAC (Role-Based Access Control)

### Hoạt động 4: Advanced Features
- Forgot Password
- Reset Password
- Avatar Upload (Cloudinary)

### Hoạt động 5: Final Integration
- Merge all features
- Complete testing
- Documentation
- Video demo

---

## 📝 NOTES

### Dependencies Backend:
```json
{
  "express": "^4.18.2",
  "mongoose": "^8.19.2",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.2",
  "dotenv": "^16.3.1",
  "cors": "^2.8.5",
  "nodemon": "^3.0.1"
}
```

### Dependencies Frontend:
```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "axios": "^1.12.2"
}
```

---

## 🐛 TROUBLESHOOTING

### Lỗi kết nối MongoDB
- Kiểm tra MONGODB_URI trong file .env
- Kiểm tra IP whitelist trên MongoDB Atlas
- Kiểm tra username/password

### Lỗi CORS
- Đảm bảo cors được enable trong server.js
- Kiểm tra baseURL trong api.js

### Lỗi JWT
- Kiểm tra JWT_SECRET trong .env
- Kiểm tra token được lưu trong localStorage

---

## 📞 CONTACT

- **Repository:** https://github.com/DoNhatHao/group9-project
- **Issues:** https://github.com/DoNhatHao/group9-project/issues

---

## 📄 LICENSE

This project is for educational purposes - Group 9 University Project.

---

**Last Updated:** October 27, 2025
**Version:** 1.0 - Activity 1 Completed ✅
