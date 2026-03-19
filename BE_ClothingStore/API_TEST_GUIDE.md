# API Test Guide - Customer Features (BE)

## 1) Chuẩn bị

- Base URL: `http://localhost:5000/api`
- Chạy BE:
  - `cd BE_ClothingStore`
  - `npm install`
  - `npm start`

## 2) Đăng nhập lấy token

### Endpoint

- `POST /auth/login`

### Body mẫu

```json
{
  "email": "nhuntq@gmail.com",
  "password": "123456"
}
```

> Nếu tài khoản seed không đăng nhập được, hãy đăng ký user mới bằng API auth rồi login lại.

### Kết quả mong đợi

- Nhận `data.accessToken`
- Dùng token này cho các API bên dưới:
  - Header: `Authorization: Bearer <accessToken>`

---

## 3) Dữ liệu test nhanh

File dữ liệu mẫu: [db/customer_api_test_data.json](db/customer_api_test_data.json)

---

## 4) Cart Management APIs

## 4.1 View Cart

### Endpoint

- `GET /carts/:userId`

### Ví dụ

- `GET /carts/67d3273853148c78e247ab84`

### Kết quả mong đợi

- Trả về cart hiện tại của user
- Nếu chưa có cart, trả về cart rỗng (`items: []`)

---

## 4.2 Add to Cart

### Endpoint

- `POST /carts/:userId`

### Body mẫu

```json
{
  "items": {
    "productId": "67cde24b34dd98846323bfaa",
    "variants": {
      "size": "S",
      "color": "Red",
      "quantity": 2
    }
  }
}
```

### Kết quả mong đợi

- Item được thêm vào cart
- Nếu item + variant đã có thì tăng quantity
- Có check tồn kho

---

## 4.3 Update Cart

### Endpoint

- `PUT /carts/:userId`

### Body mẫu

```json
{
  "productId": "67cde24b34dd98846323bfaa",
  "variantId": "<variant_subdoc_id_trong_cart>",
  "quantity": 3
}
```

> `variantId` ở đây là `_id` của variant trong cart (lấy sau khi gọi View Cart/Add to Cart).

### Kết quả mong đợi

- Quantity được cập nhật
- Có check tồn kho

---

## 4.4 Remove item khỏi Cart (hỗ trợ thêm)

### Endpoint

- `DELETE /carts/:userId`

### Body mẫu

```json
{
  "productId": "67cde24b34dd98846323bfaa",
  "variantId": "<variant_subdoc_id_trong_cart>"
}
```

---

## 4.5 Clear Cart (hỗ trợ thêm)

### Endpoint

- `DELETE /carts/clear/:userId`

---

## 5) Create Order

### Endpoint

- `POST /orders`

### Body mẫu

```json
{
  "userId": "67d3273853148c78e247ab84",
  "items": [
    {
      "productId": "67cde24b34dd98846323bfaa",
      "variant": {
        "size": "S",
        "color": "Red",
        "quantity": 1
      }
    },
    {
      "productId": "67cde34a34dd98846323bfb2",
      "variant": {
        "size": "M",
        "color": "Black",
        "quantity": 1
      }
    }
  ],
  "shippingAddress": "21 Le Loi, Can Tho",
  "note": "Giao giờ hành chính",
  "shippingCost": 6
}
```

### Kết quả mong đợi

- Tạo order trạng thái `pending`
- `totalAmount = subtotal + shippingCost`
- Trừ stock tương ứng
- Tự remove các item đã mua khỏi cart

---

## 6) Checkout

### Endpoint

- `POST /orders/checkout`

### Body mẫu checkout toàn bộ cart

```json
{
  "shippingAddress": "21 Le Loi, Can Tho",
  "note": "Call before delivery",
  "shippingCost": 6
}
```

### Body mẫu checkout item được chọn

```json
{
  "shippingAddress": "21 Le Loi, Can Tho",
  "note": "Call before delivery",
  "shippingCost": 6,
  "selectedItems": [
    {
      "productId": "67cde24b34dd98846323bfaa",
      "variantId": "<variant_subdoc_id_trong_cart>"
    }
  ]
}
```

### Kết quả mong đợi

- Tạo order `pending`
- Trừ stock
- Xóa các item đã checkout khỏi cart

---

## 7) Danh sách endpoint đã thêm

- `GET /api/carts/:userId`
- `POST /api/carts/:userId`
- `PUT /api/carts/:userId`
- `DELETE /api/carts/:userId`
- `DELETE /api/carts/clear/:userId`
- `POST /api/orders`
- `POST /api/orders/checkout`

---

## 8) Lưu ý quyền truy cập

- Các API carts/orders đều yêu cầu login (`Bearer token`).
- User chỉ thao tác được dữ liệu của chính mình (trừ admin).
