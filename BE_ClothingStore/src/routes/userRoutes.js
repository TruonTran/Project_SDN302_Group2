const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateStatusUser,
  changePassword,
  updateUser,
} = require("../controllers/userController");
const { uploadAvatar } = require("../middleware/uploadMiddleware");
const {
  verifyToken,
  adminMiddleware,
  canModifyUser,
} = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management APIs
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by full name, phone, or email
 *     responses:
 *       200:
 *         description: User list retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("/", verifyToken, adminMiddleware, getAllUsers);

/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       404:
 *         description: User not found
 */
router.get("/:userId", verifyToken, canModifyUser, getUserById);

/**
 * @swagger
 * /users/{userId}:
 *   put:
 *     summary: Update user information
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: User not found
 */
router.put(
  "/:userId",
  verifyToken,
  canModifyUser,
  uploadAvatar.single("avatar"),
  updateUser
);

/**
 * @swagger
 * /users/{userId}/status:
 *   put:
 *     summary: Update user status (active/inactive)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *               password:
 *                 type: string
 *                 description: Required if user is not admin
 *     responses:
 *       200:
 *         description: User status updated successfully
 *       400:
 *         description: Invalid status or password
 *       404:
 *         description: User not found
 */
router.put("/:userId/status", verifyToken, canModifyUser, updateStatusUser);

/**
 * @swagger
 * /users/{userId}/change-password:
 *   put:
 *     summary: Change user password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Incorrect old password
 *       404:
 *         description: User not found
 */
router.put(
  "/:userId/change-password",
  verifyToken,
  canModifyUser,
  changePassword
);

/**
 * Global Error Handler
 */
router.use((error, req, res, next) => {
  if (error instanceof Error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
  next();
});

module.exports = router;