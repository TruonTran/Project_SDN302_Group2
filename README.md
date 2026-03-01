# 🛍️ Unistyle Clothing Store

Unistyle Clothing Store là website bán quần áo được xây dựng theo mô hình Fullstack:

- **Frontend:** ReactJS
- **Backend:** NodeJS + Express
- **Database:** MongoDB

---

# 🚀 Yêu cầu hệ thống

Trước khi chạy project, cần cài đặt:

- NodeJS (>= 18)
- MongoDB (Local hoặc MongoDB Atlas)
- npm hoặc yarn

Kiểm tra phiên bản:

```bash
node -v
npm -v
```

---

# 📦 Cài đặt Backend

## Bước 1: Di chuyển vào thư mục Backend

```bash
cd BE_ClothingStore
```

## Bước 2: Cài đặt dependencies

```bash
npm install
```

## Chạy server

```bash
npm start (npm run start)
```

Hoặc nếu dùng nodemon:

```bash
npm run dev
```

Backend sẽ chạy tại:

```
http://localhost:8000
```
---

# 💻 Cài đặt Frontend

## Bước 1: Di chuyển vào thư mục Frontend

```bash
cd FE_Clothing_Store
```

## Bước 2: Cài đặt dependencies

```bash
npm install
```

## Bước 3: Chạy project

```bash
npm start
```

Frontend sẽ chạy tại:

```
http://localhost:3000
```

---

# 🔗 Kết nối Frontend với Backend

Kiểm tra file:

```
FE/src/utils/constant.js
```

Đảm bảo API_BASE_URL đúng:

```js
export const API_BASE_URL = "http://localhost:8000/api";
```

---

# 🧪 Chạy thử hệ thống

1. Khởi động MongoDB
2. Chạy Backend (port 8000)
3. Chạy Frontend (port 3000)
4. Truy cập: http://localhost:3000

---

# ⚠️ Lưu ý

- Backend phải chạy trước Frontend
- MongoDB phải đang hoạt động
- Nếu lỗi CORS, kiểm tra cấu hình `cors` trong server
- Nếu không load được API, kiểm tra lại `API_BASE_URL`

---

# 👨‍💻 Tác giả
Group 2 _SDN302
Nguyễn Tấn 
Lê Văn Nguyễn
Trương Ngọc Trân
Quách Khánh Duy
Thành An