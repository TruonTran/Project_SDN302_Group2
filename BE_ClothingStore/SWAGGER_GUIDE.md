# Swagger API Documentation Guide

## Giới Thiệu

Swagger UI được sử dụng để tài liệu hóa và kiểm thử API của ứng dụng. Bạn có thể truy cập tất cả các endpoint từ giao diện Swagger UI.

## Cách Truy Cập Swagger UI

1. **Khởi động server:**

   ```bash
   npm start
   ```

2. **Truy cập Swagger UI:**
   ```
   http://localhost:8000/api-docs
   ```

---

## API CARTS - Quản Lý Giỏ Hàng

### 1. GET /api/carts/:userId - Lấy giỏ hàng

**Mô tả:** Lấy thông tin giỏ hàng của người dùng

**URL:** `GET http://localhost:8000/api/carts/{userId}`

**Thông số:**

- `userId` (path param, required): ID của người dùng

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```

**Ví dụ cURL:**

```bash
curl -X GET "http://localhost:8000/api/carts/userId123" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response thành công (200):**

```json
{
  "success": true,
  "message": "Cart fetched successfully",
  "data": {
    "userId": "userId123",
    "items": [
      {
        "productId": {
          "_id": "productId1",
          "name": "Áo thun",
          "price": 100000
        },
        "variants": [
          {
            "variantId": "variant1",
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

### 2. POST /api/carts/:userId - Thêm sản phẩm vào giỏ

**Mô tả:** Thêm một sản phẩm vào giỏ hàng

**URL:** `POST http://localhost:8000/api/carts/{userId}`

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body:**

```json
{
  "items": {
    "productId": "productId1",
    "variants": {
      "variantId": "variant1",
      "size": "M",
      "color": "Đỏ",
      "quantity": 2
    }
  }
}
```

**Ví dụ cURL:**

```bash
curl -X POST "http://localhost:8000/api/carts/userId123" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "items": {
      "productId": "productId1",
      "variants": {
        "variantId": "variant1",
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
    "userId": "userId123",
    "items": [
      {
        "productId": "productId1",
        "variants": [
          {
            "variantId": "variant1",
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

### 3. PUT /api/carts/:userId - Cập nhật sản phẩm trong giỏ

**Mô tả:** Cập nhật số lượng hoặc thông tin sản phẩm trong giỏ hàng

**URL:** `PUT http://localhost:8000/api/carts/{userId}`

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body:**

```json
{
  "productId": "productId1",
  "variantId": "variant1",
  "quantity": 5
}
```

**Ví dụ cURL:**

```bash
curl -X PUT "http://localhost:8000/api/carts/userId123" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "productId1",
    "variantId": "variant1",
    "quantity": 5
  }'
```

**Response thành công (200):**

```json
{
  "success": true,
  "message": "Cart item updated successfully",
  "data": {
    "userId": "userId123",
    "items": [
      {
        "productId": "productId1",
        "variants": [
          {
            "variantId": "variant1",
            "size": "M",
            "color": "Đỏ",
            "quantity": 5
          }
        ]
      }
    ]
  }
}
```

---

### 4. DELETE /api/carts/:userId - Xóa sản phẩm khỏi giỏ

**Mô tả:** Xóa một sản phẩm cụ thể khỏi giỏ hàng

**URL:** `DELETE http://localhost:8000/api/carts/{userId}`

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body:**

```json
{
  "productId": "productId1",
  "variantId": "variant1"
}
```

**Ví dụ cURL:**

```bash
curl -X DELETE "http://localhost:8000/api/carts/userId123" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "productId1",
    "variantId": "variant1"
  }'
```

**Response thành công (200):**

```json
{
  "success": true,
  "message": "Item removed from cart successfully"
}
```

---

### 5. DELETE /api/carts/clear/:userId - Xóa toàn bộ giỏ hàng

**Mô tả:** Xóa tất cả các sản phẩm khỏi giỏ hàng (xóa rỗng giỏ)

**URL:** `DELETE http://localhost:8000/api/carts/clear/{userId}`

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```

**Ví dụ cURL:**

```bash
curl -X DELETE "http://localhost:8000/api/carts/clear/userId123" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response thành công (200):**

```json
{
  "success": true,
  "message": "Cart cleared successfully"
}
```

---

## API ORDERS - Quản Lý Đơn Hàng

### 1. POST /api/orders - Tạo đơn hàng

**Mô tả:** Tạo một đơn hàng mới với các sản phẩm được chỉ định

**URL:** `POST http://localhost:8000/api/orders`

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body:**

```json
{
  "userId": "userId123",
  "items": [
    {
      "productId": "productId1",
      "variant": [
        {
          "variantId": "variant1",
          "size": "M",
          "color": "Đỏ",
          "quantity": 2
        }
      ]
    }
  ],
  "shippingAddress": {
    "fullName": "Nguyễn Văn A",
    "phone": "0123456789",
    "address": "123 Đường ABC",
    "city": "Hà Nội",
    "district": "Quận 1",
    "ward": "Phường 1"
  },
  "note": "Giao hàng nhanh",
  "shippingCost": 30000
}
```

**Ví dụ cURL:**

```bash
curl -X POST "http://localhost:8000/api/orders" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "userId123",
    "items": [
      {
        "productId": "productId1",
        "variant": [
          {
            "variantId": "variant1",
            "size": "M",
            "color": "Đỏ",
            "quantity": 2
          }
        ]
      }
    ],
    "shippingAddress": {
      "fullName": "Nguyễn Văn A",
      "phone": "0123456789",
      "address": "123 Đường ABC",
      "city": "Hà Nội",
      "district": "Quận 1",
      "ward": "Phường 1"
    },
    "note": "Giao hàng nhanh",
    "shippingCost": 30000
  }'
```

**Response thành công (201):**

```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "_id": "orderId1",
    "userId": "userId123",
    "items": [
      {
        "productId": "productId1",
        "variant": [
          {
            "size": "M",
            "color": "Đỏ",
            "quantity": 2,
            "price": 100000
          }
        ]
      }
    ],
    "status": "pending",
    "totalPrice": 230000,
    "shippingAddress": {
      "fullName": "Nguyễn Văn A",
      "phone": "0123456789",
      "address": "123 Đường ABC",
      "city": "Hà Nội",
      "district": "Quận 1",
      "ward": "Phường 1"
    },
    "createdAt": "2026-03-23T10:30:00Z"
  }
}
```

---

### 2. POST /api/orders/checkout - Thanh toán từ giỏ hàng

**Mô tả:** Tạo đơn hàng trực tiếp từ các sản phẩm trong giỏ hàng của người dùng

**URL:** `POST http://localhost:8000/api/orders/checkout`

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body:**

```json
{
  "userId": "userId123",
  "shippingAddress": {
    "fullName": "Nguyễn Văn A",
    "phone": "0123456789",
    "address": "123 Đường ABC",
    "city": "Hà Nội",
    "district": "Quận 1",
    "ward": "Phường 1"
  },
  "note": "Giao hàng nhanh",
  "shippingCost": 30000
}
```

**Ví dụ cURL:**

```bash
curl -X POST "http://localhost:8000/api/orders/checkout" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "userId123",
    "shippingAddress": {
      "fullName": "Nguyễn Văn A",
      "phone": "0123456789",
      "address": "123 Đường ABC",
      "city": "Hà Nội",
      "district": "Quận 1",
      "ward": "Phường 1"
    },
    "note": "Giao hàng nhanh",
    "shippingCost": 30000
  }'
```

**Response thành công (201):**

```json
{
  "success": true,
  "message": "Order created from cart successfully",
  "data": {
    "_id": "orderId1",
    "userId": "userId123",
    "items": [
      {
        "productId": "productId1",
        "variant": [
          {
            "size": "M",
            "color": "Đỏ",
            "quantity": 2,
            "price": 100000
          }
        ]
      }
    ],
    "status": "pending",
    "totalPrice": 230000,
    "shippingAddress": {
      "fullName": "Nguyễn Văn A",
      "phone": "0123456789",
      "address": "123 Đường ABC",
      "city": "Hà Nội",
      "district": "Quận 1",
      "ward": "Phường 1"
    },
    "createdAt": "2026-03-23T10:30:00Z"
  }
}
```

---

## Hướng Dẫn Sử Dụng Swagger UI

### Bước 1: Truy Cập Swagger UI

- Mở trình duyệt và truy cập: `http://localhost:8000/api-docs`

### Bước 2: Xem Danh Sách API

- Tất cả các endpoint sẽ được hiển thị trong giao diện
- Nhóm các endpoint theo từng tag (Carts, Orders, Products, etc.)

### Bước 3: Kiểm Thử API

1. Nhấp vào endpoint muốn kiểm thử
2. Nhấp nút "Try it out"
3. Điền các thông số:
   - Path parameters (vd: userId)
   - Query parameters (nếu có)
   - Headers (vd: Authorization token)
   - Request body (nếu là POST/PUT/DELETE)
4. Nhấp "Execute"
5. Xem response trong phần "Response"

### Bước 4: Đăng Nhập Với Bearer Token

- Nhấp vào nút "Authorize" ở trên cùng
- Nhập JWT token ở dạng: `Bearer <your_jwt_token>`
- Nhấp "Authorize" để lưu token
- Token này sẽ được tự động thêm vào tất cả các request

---

## Các HTTP Status Codes

| Status Code | Mô Tả                                    |
| ----------- | ---------------------------------------- |
| 200         | OK - Request thành công                  |
| 201         | Created - Tài nguyên được tạo thành công |
| 400         | Bad Request - Thông số không hợp lệ      |
| 401         | Unauthorized - Cần xác thực (JWT token)  |
| 403         | Forbidden - Không có quyền truy cập      |
| 404         | Not Found - Tài nguyên không tồn tại     |
| 500         | Internal Server Error - Lỗi server       |

---

## Lỗi Thường Gặp & Cách Khắc Phục

### 1. Lỗi 401 Unauthorized

**Nguyên nhân:** JWT token không hợp lệ hoặc không được gửi
**Cách khắc phục:**

- Đảm bảo bạn đã đăng nhập trước đó
- Thêm header `Authorization: Bearer <token>`
- Sử dụng nút "Authorize" trong Swagger UI

### 2. Lỗi 400 Bad Request

**Nguyên nhân:** Thông số request không đúng
**Cách khắc phục:**

- Kiểm tra các trường required
- Đảm bảo định dạng dữ liệu đúng
- Xem lại ví dụ request

### 3. Lỗi 500 Internal Server Error

**Nguyên nhân:** Lỗi server
**Cách khắc phục:**

- Kiểm tra console server
- Đảm bảo database kết nối đúng
- Kiểm tra các dependency đã cài đặt

---

## Thông Tin Hữu Ích

- **Base URL:** `http://localhost:8000`
- **Swagger UI:** `http://localhost:8000/api-docs`
- **API Prefix:** `/api`
- **Authentication:** Bearer Token (JWT)
- **Content-Type:** `application/json`

Chúc bạn sử dụng API thành công! 🚀
