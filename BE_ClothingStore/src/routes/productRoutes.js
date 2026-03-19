const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const {
  verifyToken,
  adminMiddleware,
  optionalVerifyToken,
} = require("../middleware/authMiddleware");

/**
 * @swagger
 * /api/products:
 *   get:
 *     tags: [Products]
 *     summary: Danh sách sản phẩm (public; admin có thể gửi Bearer để lọc thêm)
 *     parameters:
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
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, draft]
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           example: 67cddf7234dd98846323bf7f
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     products:
 *                       type: array
 *                     pagination:
 *                       type: object
 */
router.get("/", optionalVerifyToken, productController.getAllProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Chi tiết sản phẩm theo id (public)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Không tìm thấy sản phẩm
 */
router.get("/:id", optionalVerifyToken, productController.getProductById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     tags: [Products]
 *     summary: Tạo sản phẩm (Admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, description, price, category, variants]
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               price: { type: number }
 *               discountPrice: { type: number }
 *               category: { type: string }
 *               images:
 *                 type: array
 *                 items: { type: string }
 *               status:
 *                 type: string
 *                 enum: [active, inactive, draft]
 *               variants:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [size, color, stock]
 *                   properties:
 *                     size: { type: string }
 *                     color: { type: string }
 *                     stock: { type: number }
 *     responses:
 *       201:
 *         description: Tạo thành công
 *       400:
 *         description: Validate lỗi
 */
router.post("/", verifyToken, adminMiddleware, productController.createProduct);


/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     tags: [Products]
 *     summary: Cập nhật sản phẩm (Admin)
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
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       400:
 *         description: Validate lỗi
 *       404:
 *         description: Không tìm thấy sản phẩm
 */
router.put(
  "/:id",
  verifyToken,
  adminMiddleware,
  productController.updateProduct
);

/**
 * @swagger
 * /api/products/{id}/status:
 *   patch:
 *     tags: [Products]
 *     summary: Cập nhật trạng thái sản phẩm (Admin)
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
 *                 enum: [active, inactive, draft]
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       400:
 *         description: status không hợp lệ
 *       404:
 *         description: Không tìm thấy sản phẩm
 */
router.patch(
  "/:id/status",
  verifyToken,
  adminMiddleware,
  productController.updateProductStatus
);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     tags: [Products]
 *     summary: Xóa sản phẩm (Admin)
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
 *         description: Xóa thành công
 *       400:
 *         description: ID không hợp lệ
 *       404:
 *         description: Không tìm thấy sản phẩm
 */
router.delete(
  "/:id",
  verifyToken,
  adminMiddleware,
  productController.deleteProduct
);

module.exports = router;
