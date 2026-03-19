const express = require("express");
const router = express.Router();
const { verifyToken, adminMiddleware } = require("../middleware/authMiddleware");
const {
    adminGetAllOrders,
    adminSearchOrders,
    getOrderList,
    getOrderDetail,
    adminUpdateOrderStatus,
} = require("../controllers/orderManagementController");

/**
 * @swagger
 * /api/orders/admin:
 *   get:
 *     tags: [Orders]
 *     summary: Lấy tất cả đơn hàng (Admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách tất cả đơn hàng
 *       403:
 *         description: Admin only
 */
router.get("/admin", verifyToken, adminMiddleware, adminGetAllOrders);

/**
 * @swagger
 * /api/orders/admin/search:
 *   get:
 *     tags: [Orders]
 *     summary: Tìm kiếm đơn hàng (Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: orderId
 *         schema:
 *           type: string
 *         description: Mongo _id của order
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, in_progress, done, cancelled]
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *         description: ISO date (example 2025-01-01)
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *         description: ISO date
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Tìm theo shippingAddress hoặc note
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Tham số không hợp lệ
 *       403:
 *         description: Admin only
 */
router.get(
  "/admin/search",
  verifyToken,
  adminMiddleware,
  adminSearchOrders
);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   patch:
 *     tags: [Orders]
 *     summary: Cập nhật trạng thái đơn hàng (Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, done, cancelled]
 *                 example: in_progress
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       400:
 *         description: Invalid status
 *       404:
 *         description: Order not found
 */
router.patch("/:id/status", verifyToken, adminMiddleware, adminUpdateOrderStatus);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     tags: [Orders]
 *     summary: Lấy danh sách đơn hàng của user hiện tại
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách đơn hàng
 */
router.get("/", verifyToken, getOrderList);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     tags: [Orders]
 *     summary: Lấy chi tiết đơn hàng
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chi tiết đơn hàng
 *       403:
 *         description: Not allowed
 *       404:
 *         description: Order not found
 */
router.get("/:id", verifyToken, getOrderDetail);

module.exports = router;