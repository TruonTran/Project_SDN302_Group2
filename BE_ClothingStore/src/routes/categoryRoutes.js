const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/categoryController");
const { verifyToken, adminMiddleware } = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "65f1a2b3c4d5e6f7g8h9"
 *         name:
 *           type: string
 *           example: "Hoodie"
 *         gender:
 *           type: array
 *           items:
 *             type: string
 *             enum: [Men, Women]
 *           example: ["Men"]
 *         status:
 *           type: string
 *           enum: [active, inactive]
 *           example: active
 *         createdAt:
 *           type: string
 *           example: "2026-03-23T10:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           example: "2026-03-23T10:00:00.000Z"
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories (Token admin)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("/", verifyToken, adminMiddleware, categoryController.getAllCategories);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create new category (Token admin)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - gender
 *             properties:
 *               name:
 *                 type: string
 *                 example: "T-Shirt"
 *               gender:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [Men, Women]
 *                 example: ["Men"]
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *                 example: active
 *     responses:
 *       201:
 *         description: Category created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post("/", verifyToken, adminMiddleware, categoryController.createCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update category (Token admin)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "65f1a2b3c4d5e6f7g8h9"
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Hoodie"
 *               gender:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [Men, Women]
 *                 example: ["Women"]
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *                 example: inactive
 *     responses:
 *       200:
 *         description: Updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 */
router.put("/:id", verifyToken, adminMiddleware, categoryController.updateCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "65f1a2b3c4d5e6f7g8h9"
 *     responses:
 *       200:
 *         description: Deleted successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 */
router.delete("/:id", verifyToken, adminMiddleware, categoryController.deleteCategory);

/**
 * @swagger
 * /api/categories/{id}/status:
 *   put:
 *     summary: Update category status
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "65f1a2b3c4d5e6f7g8h9"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *                 example: inactive
 *     responses:
 *       200:
 *         description: Status updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Category status updated
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       400:
 *         description: Invalid status
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 */
router.put("/:id/status", verifyToken, adminMiddleware, categoryController.updateCategoryStatus);

module.exports = router;