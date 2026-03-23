const express = require("express");
const router = express.Router();
const {
  getCartByUserId,
  addToCart,
  updateCart,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");
const { verifyToken } = require("../middleware/authMiddleware");

/**
 * @swagger
 * /api/carts:
 *   get:
 *     summary: Lấy giỏ hàng của người dùng hiện tại
 *     description: Lấy thông tin giỏ hàng dựa trên người dùng trong JWT token
 *     tags:
 *       - Giỏ Hàng
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy giỏ hàng thành công
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
 *                     userId:
 *                       type: string
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           productId:
 *                             type: string
 *                           variants:
 *                             type: array
 *       401:
 *         description: Chưa xác thực
 *       500:
 *         description: Lỗi khi lấy giỏ hàng
 */

/**
 * @swagger
 * /api/carts:
 *   post:
 *     summary: Thêm sản phẩm vào giỏ
 *     description: Thêm một sản phẩm mới vào giỏ hàng của người dùng hiện tại từ JWT token
 *     tags:
 *       - Giỏ Hàng
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
 *             properties:
 *               items:
 *                 type: object
 *                 required:
 *                   - productId
 *                   - variants
 *                 properties:
 *                   productId:
 *                     type: string
 *                     description: ID sản phẩm
 *                   variants:
 *                     type: object
 *                     required:
 *                       - variantId
 *                       - size
 *                       - color
 *                       - quantity
 *                     properties:
 *                       variantId:
 *                         type: string
 *                         description: ID biến thể
 *                       size:
 *                         type: string
 *                         description: Kích cỡ (S, M, L, XL, ...)
 *                       color:
 *                         type: string
 *                         description: Màu sắc
 *                       quantity:
 *                         type: integer
 *                         minimum: 1
 *                         description: Số lượng
 *     responses:
 *       201:
 *         description: Thêm sản phẩm vào giỏ thành công
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
 *       400:
 *         description: Thông số yêu cầu không hợp lệ
 *       401:
 *         description: Chưa xác thực
 *       500:
 *         description: Lỗi khi thêm sản phẩm vào giỏ
 */

/**
 * @swagger
 * /api/carts:
 *   put:
 *     summary: Cập nhật sản phẩm trong giỏ
 *     description: Cập nhật số lượng hoặc thông tin sản phẩm trong giỏ hàng của người dùng hiện tại
 *     tags:
 *       - Giỏ Hàng
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - variantId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 description: ID sản phẩm
 *               variantId:
 *                 type: string
 *                 description: ID biến thể
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 description: Số lượng mới
 *     responses:
 *       200:
 *         description: Cập nhật sản phẩm trong giỏ thành công
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
 *       400:
 *         description: Thông số yêu cầu không hợp lệ
 *       401:
 *         description: Chưa xác thực
 *       404:
 *         description: Sản phẩm không tìm thấy trong giỏ
 *       500:
 *         description: Lỗi khi cập nhật giỏ hàng
 */

/**
 * @swagger
 * /api/carts:
 *   delete:
 *     summary: Xóa sản phẩm khỏi giỏ
 *     description: Xóa một sản phẩm cụ thể khỏi giỏ hàng của người dùng hiện tại
 *     tags:
 *       - Giỏ Hàng
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - variantId
 *             properties:
 *               productId:
 *                 type: string
 *                 description: ID sản phẩm
 *               variantId:
 *                 type: string
 *                 description: ID biến thể
 *     responses:
 *       200:
 *         description: Xóa sản phẩm khỏi giỏ thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Thông số yêu cầu không hợp lệ
 *       401:
 *         description: Chưa xác thực
 *       404:
 *         description: Sản phẩm không tìm thấy trong giỏ
 *       500:
 *         description: Lỗi khi xóa sản phẩm khỏi giỏ
 */

/**
 * @swagger
 * /api/carts/clear:
 *   delete:
 *     summary: Xóa toàn bộ giỏ hàng
 *     description: Xóa tất cả các sản phẩm khỏi giỏ hàng của người dùng hiện tại
 *     tags:
 *       - Giỏ Hàng
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Xóa toàn bộ giỏ hàng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Chưa xác thực
 *       404:
 *         description: Giỏ hàng không tìm thấy
 *       500:
 *         description: Lỗi khi xóa giỏ hàng
 */

router.get("/", verifyToken, getCartByUserId);
router.post("/", verifyToken, addToCart);
router.put("/", verifyToken, updateCart);
router.delete("/", verifyToken, removeFromCart);
router.delete("/clear", verifyToken, clearCart);

module.exports = router;
