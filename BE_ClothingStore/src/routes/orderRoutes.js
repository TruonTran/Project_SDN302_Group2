const express = require("express");
const router = express.Router();

const { createOrder, checkout } = require("../controllers/orderController");
const { verifyToken } = require("../middleware/authMiddleware");

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Tạo đơn hàng mới
 *     description: Tạo một đơn hàng mới với các sản phẩm được chỉ định hoặc từ giỏ hàng
 *     tags:
 *       - Đơn Hàng
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *               - shippingAddress
 *             properties:
 *               userId:
 *                 type: string
 *                 description: (Tùy chọn) ID người dùng (nếu không cung cấp sẽ dùng người dùng hiện tại)
 *               items:
 *                 type: array
 *                 description: Danh sách các sản phẩm trong đơn hàng
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                   properties:
 *                     productId:
 *                       type: string
 *                       description: ID sản phẩm
 *                     variant:
 *                       type: array
 *                       items:
 *                         type: object
 *                         required:
 *                           - variantId
 *                           - size
 *                           - color
 *                           - quantity
 *                         properties:
 *                           variantId:
 *                             type: string
 *                             description: ID biến thể
 *                           size:
 *                             type: string
 *                             description: Kích cỡ
 *                           color:
 *                             type: string
 *                             description: Màu sắc
 *                           quantity:
 *                             type: integer
 *                             minimum: 1
 *                             description: Số lượng
 *               shippingAddress:
 *                 type: object
 *                 required:
 *                   - fullName
 *                   - phone
 *                   - address
 *                   - city
 *                   - district
 *                   - ward
 *                 properties:
 *                   fullName:
 *                     type: string
 *                     description: Tên đầy đủ người nhận
 *                   phone:
 *                     type: string
 *                     description: Số điện thoại
 *                   address:
 *                     type: string
 *                     description: Địa chỉ
 *                   city:
 *                     type: string
 *                     description: Tỉnh/Thành phố
 *                   district:
 *                     type: string
 *                     description: Quận/Huyện
 *                   ward:
 *                     type: string
 *                     description: Phường/Xã
 *               note:
 *                 type: string
 *                 description: (Tùy chọn) Ghi chú đơn hàng
 *               shippingCost:
 *                 type: number
 *                 description: (Tùy chọn) Phí vận chuyển (mặc định 0)
 *     responses:
 *       201:
 *         description: Tạo đơn hàng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: ID đơn hàng
 *                     userId:
 *                       type: string
 *                     items:
 *                       type: array
 *                     status:
 *                       type: string
 *                     totalPrice:
 *                       type: number
 *       400:
 *         description: Thông số yêu cầu không hợp lệ
 *       401:
 *         description: Chưa xác thực
 *       403:
 *         description: Không được phép - Không thể tạo đơn hàng cho người dùng khác
 *       500:
 *         description: Lỗi khi tạo đơn hàng
 */

/**
 * @swagger
 * /api/orders/checkout:
 *   post:
 *     summary: Thanh toán - Tạo đơn hàng từ giỏ hàng
 *     description: Tạo đơn hàng trực tiếp từ các sản phẩm trong giỏ hàng của người dùng
 *     tags:
 *       - Đơn Hàng
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - shippingAddress
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID người dùng (chủ sở hữu giỏ hàng)
 *               shippingAddress:
 *                 type: object
 *                 required:
 *                   - fullName
 *                   - phone
 *                   - address
 *                   - city
 *                   - district
 *                   - ward
 *                 properties:
 *                   fullName:
 *                     type: string
 *                     description: Tên đầy đủ người nhận
 *                   phone:
 *                     type: string
 *                     description: Số điện thoại
 *                   address:
 *                     type: string
 *                     description: Địa chỉ
 *                   city:
 *                     type: string
 *                     description: Tỉnh/Thành phố
 *                   district:
 *                     type: string
 *                     description: Quận/Huyện
 *                   ward:
 *                     type: string
 *                     description: Phường/Xã
 *               note:
 *                 type: string
 *                 description: (Tùy chọn) Ghi chú đơn hàng
 *               shippingCost:
 *                 type: number
 *                 description: (Tùy chọn) Phí vận chuyển (mặc định 0)
 *     responses:
 *       201:
 *         description: Tạo đơn hàng từ giỏ hàng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: ID đơn hàng
 *                     userId:
 *                       type: string
 *                     items:
 *                       type: array
 *                     status:
 *                       type: string
 *                     totalPrice:
 *                       type: number
 *       400:
 *         description: Thông số yêu cầu không hợp lệ hoặc giỏ hàng trống
 *       401:
 *         description: Chưa xác thực
 *       403:
 *         description: Không được phép - Không thể thanh toán cho người dùng khác
 *       500:
 *         description: Lỗi khi thanh toán
 */

router.post("/", verifyToken, createOrder);
router.post("/checkout", verifyToken, checkout);

module.exports = router;
