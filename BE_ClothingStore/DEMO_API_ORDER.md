# Hướng Dẫn Demo API - Thứ Tự Chi Tiết

## 📋 Tóm Tắt Quy Trình Demo

```
1. Xác thực (Login) → Lấy JWT Token
   ↓
2. Lấy giỏ hàng hiện tại
   ↓
3. Thêm sản phẩm vào giỏ
   ↓
4. Xem giỏ hàng (kiểm tra)
   ↓
5. Cập nhật số lượng sản phẩm
   ↓
6. Xem lại giỏ hàng
   ↓
7. Tạo đơn hàng từ giỏ (Checkout)
   ↓
8. Xóa giỏ hàng
```

---

## 🔑 BƯỚC 1: Xác Thực (Login)

**Mục đích:** Lấy JWT token để sử dụng cho các API khác

**Endpoint:** `POST /api/auth/login`

**Request:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**cURL:**

```bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**Response thành công (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "USER_ID_123",
      "email": "user@example.com",
      "name": "Nguyễn Văn A",
      "isAdmin": false
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJVU0VSX0lEXzEyMyIsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsImlzQWRtaW4iOmZhbHNlfQ.xyz..."
  }
}
```

**💾 Lưu lại:**

- `USER_ID` = `USER_ID_123`
- `JWT_TOKEN` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

## 🛒 BƯỚC 2: Lấy Giỏ Hàng Hiện Tại

**Mục đích:** Kiểm tra giỏ hàng có những sản phẩm nào

**Endpoint:** `GET /api/carts/:userId`

**URL:** `http://localhost:8000/api/carts/USER_ID_123`

**Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**cURL:**

```bash
curl -X GET "http://localhost:8000/api/carts/USER_ID_123" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (giỏ trống ban đầu):**

```json
{
  "success": true,
  "message": "Cart fetched successfully",
  "data": {
    "userId": "USER_ID_123",
    "items": []
  }
}
```

---

## ➕ BƯỚC 3: Thêm Sản Phẩm Vào Giỏ (Lần 1)

**Mục đích:** Thêm sản phẩm thứ 1 vào giỏ

**Endpoint:** `POST /api/carts/:userId`

**URL:** `http://localhost:8000/api/carts/USER_ID_123`

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body:**

```json
{
  "items": {
    "productId": "PROD_001",
    "variants": {
      "variantId": "VAR_001",
      "size": "M",
      "color": "Đỏ",
      "quantity": 2
    }
  }
}
```

**cURL:**

```bash
curl -X POST "http://localhost:8000/api/carts/USER_ID_123" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "items": {
      "productId": "PROD_001",
      "variants": {
        "variantId": "VAR_001",
        "size": "M",
        "color": "Đỏ",
        "quantity": 2
      }
    }
  }'
```

**Response thành công (201):**

```json
{
  "success": true,
  "message": "Product added to cart successfully",
  "data": {
    "userId": "USER_ID_123",
    "items": [
      {
        "productId": "PROD_001",
        "variants": [
          {
            "variantId": "VAR_001",
            "size": "M",
            "color": "Đỏ",
            "quantity": 2
          }
        ]
      }
    ]
  }
}
```

---

## ➕ BƯỚC 4: Thêm Sản Phẩm Vào Giỏ (Lần 2)

**Mục đích:** Thêm sản phẩm thứ 2 vào giỏ

**Endpoint:** `POST /api/carts/:userId`

**Request Body:**

```json
{
  "items": {
    "productId": "PROD_002",
    "variants": {
      "variantId": "VAR_002",
      "size": "L",
      "color": "Xanh",
      "quantity": 1
    }
  }
}
```

**cURL:**

```bash
curl -X POST "http://localhost:8000/api/carts/USER_ID_123" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "items": {
      "productId": "PROD_002",
      "variants": {
        "variantId": "VAR_002",
        "size": "L",
        "color": "Xanh",
        "quantity": 1
      }
    }
  }'
```

**Response:**

```json
{
  "success": true,
  "message": "Product added to cart successfully",
  "data": {
    "userId": "USER_ID_123",
    "items": [
      {
        "productId": "PROD_001",
        "variants": [
          {
            "variantId": "VAR_001",
            "size": "M",
            "color": "Đỏ",
            "quantity": 2
          }
        ]
      },
      {
        "productId": "PROD_002",
        "variants": [
          {
            "variantId": "VAR_002",
            "size": "L",
            "color": "Xanh",
            "quantity": 1
          }
        ]
      }
    ]
  }
}
```

---

## 👁️ BƯỚC 5: Lấy Giỏ Hàng (Kiểm Tra)

**Mục đích:** Xem giỏ hàng hiện tại có những gì

**Endpoint:** `GET /api/carts/:userId`

**cURL:**

```bash
curl -X GET "http://localhost:8000/api/carts/USER_ID_123" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response:**

```json
{
  "success": true,
  "message": "Cart fetched successfully",
  "data": {
    "userId": "USER_ID_123",
    "items": [
      {
        "productId": {
          "_id": "PROD_001",
          "name": "Áo thun nam",
          "price": 150000,
          "discountPrice": 120000
        },
        "variants": [
          {
            "variantId": "VAR_001",
            "size": "M",
            "color": "Đỏ",
            "quantity": 2
          }
        ]
      },
      {
        "productId": {
          "_id": "PROD_002",
          "name": "Quần jean nam",
          "price": 300000,
          "discountPrice": 250000
        },
        "variants": [
          {
            "variantId": "VAR_002",
            "size": "L",
            "color": "Xanh",
            "quantity": 1
          }
        ]
      }
    ]
  }
}
```

---

## ✏️ BƯỚC 6: Cập Nhật Số Lượng Sản Phẩm

**Mục đích:** Thay đổi số lượng sản phẩm (ví dụ: từ 2 thành 3)

**Endpoint:** `PUT /api/carts/:userId`

**Request Body:**

```json
{
  "productId": "PROD_001",
  "variantId": "VAR_001",
  "quantity": 3
}
```

**cURL:**

```bash
curl -X PUT "http://localhost:8000/api/carts/USER_ID_123" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "PROD_001",
    "variantId": "VAR_001",
    "quantity": 3
  }'
```

**Response:**

```json
{
  "success": true,
  "message": "Cart item updated successfully",
  "data": {
    "userId": "USER_ID_123",
    "items": [
      {
        "productId": "PROD_001",
        "variants": [
          {
            "variantId": "VAR_001",
            "size": "M",
            "color": "Đỏ",
            "quantity": 3
          }
        ]
      },
      {
        "productId": "PROD_002",
        "variants": [
          {
            "variantId": "VAR_002",
            "size": "L",
            "color": "Xanh",
            "quantity": 1
          }
        ]
      }
    ]
  }
}
```

---

## 🗑️ BƯỚC 7: Xóa Một Sản Phẩm Khỏi Giỏ

**Mục đích:** Xóa sản phẩm thứ 2 (hoặc sản phẩm khác)

**Endpoint:** `DELETE /api/carts/:userId`

**Request Body:**

```json
{
  "productId": "PROD_002",
  "variantId": "VAR_002"
}
```

**cURL:**

```bash
curl -X DELETE "http://localhost:8000/api/carts/USER_ID_123" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "PROD_002",
    "variantId": "VAR_002"
  }'
```

**Response:**

```json
{
  "success": true,
  "message": "Item removed from cart successfully"
}
```

---

## 💳 BƯỚC 8: Tạo Đơn Hàng (Thanh Toán - Checkout)

**Mục đích:** Tạo đơn hàng từ các sản phẩm trong giỏ

**Endpoint:** `POST /api/orders/checkout`

**Request Body:**

```json
{
  "userId": "USER_ID_123",
  "shippingAddress": {
    "fullName": "Nguyễn Văn A",
    "phone": "0912345678",
    "address": "123 Đường Lê Lợi",
    "city": "Hà Nội",
    "district": "Quận 1",
    "ward": "Phường 1"
  },
  "note": "Giao hàng vào buổi sáng",
  "shippingCost": 30000
}
```

**cURL:**

```bash
curl -X POST "http://localhost:8000/api/orders/checkout" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID_123",
    "shippingAddress": {
      "fullName": "Nguyễn Văn A",
      "phone": "0912345678",
      "address": "123 Đường Lê Lợi",
      "city": "Hà Nội",
      "district": "Quận 1",
      "ward": "Phường 1"
    },
    "note": "Giao hàng vào buổi sáng",
    "shippingCost": 30000
  }'
```

**Response thành công (201):**

```json
{
  "success": true,
  "message": "Order created from cart successfully",
  "data": {
    "_id": "ORDER_001",
    "userId": "USER_ID_123",
    "items": [
      {
        "productId": "PROD_001",
        "variant": [
          {
            "size": "M",
            "color": "Đỏ",
            "quantity": 3,
            "price": 120000
          }
        ]
      }
    ],
    "shippingAddress": {
      "fullName": "Nguyễn Văn A",
      "phone": "0912345678",
      "address": "123 Đường Lê Lợi",
      "city": "Hà Nội",
      "district": "Quận 1",
      "ward": "Phường 1"
    },
    "status": "pending",
    "subTotal": 360000,
    "shippingCost": 30000,
    "totalPrice": 390000,
    "note": "Giao hàng vào buổi sáng",
    "createdAt": "2026-03-23T10:30:00Z"
  }
}
```

---

## 🧹 BƯỚC 9: Xóa Toàn Bộ Giỏ Hàng (Sau Khi Thanh Toán)

**Mục đích:** Xóa rỗng giỏ hàng

**Endpoint:** `DELETE /api/carts/clear/:userId`

**cURL:**

```bash
curl -X DELETE "http://localhost:8000/api/carts/clear/USER_ID_123" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response:**

```json
{
  "success": true,
  "message": "Cart cleared successfully"
}
```

---

## 📊 Bảng Tóm Tắt Dữ Liệu Mẫu

| ID       | Tên Sản Phẩm  | Giá Gốc | Giá Giảm | Kích Cỡ | Màu  | SL  |
| -------- | ------------- | ------- | -------- | ------- | ---- | --- |
| PROD_001 | Áo thun nam   | 150,000 | 120,000  | M       | Đỏ   | 3   |
| PROD_002 | Quần jean nam | 300,000 | 250,000  | L       | Xanh | 1   |

### Thông Tin Giao Hàng:

- **Tên:** Nguyễn Văn A
- **SĐT:** 0912345678
- **Địa chỉ:** 123 Đường Lê Lợi, P.1, Q.1, Hà Nội
- **Phí vận chuyển:** 30,000 VND

### Tính Toán Giá:

```
Sản phẩm 1: 120,000 × 3 = 360,000 VND
Sản phẩm 2: 250,000 × 1 = 250,000 VND (đã xóa)
─────────────────────────────
Cộng tiền hàng: 360,000 VND
Phí vận chuyển: 30,000 VND
─────────────────────────────
Tổng cộng: 390,000 VND
```

---

## 🎯 Cách Sử Dụng Swagger UI Để Demo

### Bước 1: Truy cập Swagger

```
http://localhost:8000/api-docs
```

### Bước 2: Đăng nhập

1. Click nút **Authorize** (góc trên phải)
2. Nhập: `Bearer <JWT_TOKEN>`
3. Click **Authorize**

### Bước 3: Demo từng API

1. Mở từng endpoint
2. Click **Try it out**
3. Điền dữ liệu
4. Click **Execute**
5. Xem Response

---

## ⚠️ Lưu Ý Quan Trọng

### 1. **JWT Token**

- Token có thời hạn sử dụng
- Nếu hết hiệu lực, cần login lại

### 2. **User ID**

- Phải khớp với user ID trong token
- Không thể thao tác giỏ hàng của người khác (ngoại trừ admin)

### 3. **Product ID & Variant ID**

- Phải tồn tại trong database
- Kiểm tra API Product trước khi thêm vào giỏ

### 4. **Số Lượng (Quantity)**

- Phải lớn hơn 0
- Không được vượt quá stock của sản phẩm

### 5. **Thứ Tự Demo**

- Luôn login trước
- Thêm hàng trước khi thanh toán
- Thanh toán trước khi xóa giỏ

---

## 🚀 Quick Start Script

Nếu muốn chạy tất cả lệnh cùng lúc, bạn có thể tạo file `.sh`:

```bash
#!/bin/bash

# 1. Login
TOKEN=$(curl -s -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}' \
  | jq -r '.data.token')

USER_ID="USER_ID_123"

# 2. Lấy giỏ hàng
curl -X GET "http://localhost:8000/api/carts/$USER_ID" \
  -H "Authorization: Bearer $TOKEN"

# 3. Thêm sản phẩm 1
curl -X POST "http://localhost:8000/api/carts/$USER_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"items":{"productId":"PROD_001","variants":{"variantId":"VAR_001","size":"M","color":"Đỏ","quantity":2}}}'

# ... và tiếp tục các lệnh khác
```

Chúc bạn demo thành công! 🎉
