const express = require("express");
const router = express.Router();
const { getProfile, updateProfile, updateAvatar, deleteAvatar, changePassword } = require("../controllers/profileController");
const { verifyToken } = require("../middleware/authMiddleware");
const { uploadAvatar } = require("../middleware/uploadMiddleware");

router.use(verifyToken);

/**
 * @swagger
 * /api/profile:
 *   get:
 *     tags: [Profile]
 *     summary: Lấy thông tin profile của user đang đăng nhập
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thông tin profile
 *       404:
 *         description: User not found
 */
router.get("/", getProfile);

/**
 * @swagger
 * /api/profile:
 *   put:
 *     tags: [Profile]
 *     summary: Cập nhật thông tin profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Nguyen Thi Quynh Nhu
 *               phone:
 *                 type: string
 *                 example: "0987654321"
 *               address:
 *                 type: string
 *                 example: 50 Tran Hung Dao, Can Tho
 *               gender:
 *                 type: string
 *                 enum: [male, female]
 *                 example: female
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
router.put("/", uploadAvatar.single("avatar"), updateProfile);

/**
 * @swagger
 * /api/profile/avatar:
 *   put:
 *     tags: [Profile]
 *     summary: Chỉ thay avatar
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [avatar]
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Thay avatar thành công
 *       400:
 *         description: Không có file hoặc sai định dạng
 */
router.put("/avatar", uploadAvatar.single("avatar"), updateAvatar);

/**
 * @swagger
 * /api/profile/avatar:
 *   delete:
 *     tags: [Profile]
 *     summary: Xóa avatar
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Xóa avatar thành công
 *       400:
 *         description: Không có avatar để xóa
 */
router.delete("/avatar", deleteAvatar);

/**
 * @swagger
 * /api/profile/change-password:
 *   put:
 *     tags: [Profile]
 *     summary: Đổi mật khẩu
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [oldPassword, newPassword]
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: "123456"
 *               newPassword:
 *                 type: string
 *                 example: newpass123
 *               confirmPassword:
 *                 type: string
 *                 example: newpass123
 *     responses:
 *       200:
 *         description: Đổi mật khẩu thành công
 *       400:
 *         description: Sai mật khẩu cũ hoặc dữ liệu không hợp lệ
 */
router.put("/change-password", changePassword);

router.use((error, req, res, next) => {
    if (error instanceof Error) {
        return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
});

module.exports = router;