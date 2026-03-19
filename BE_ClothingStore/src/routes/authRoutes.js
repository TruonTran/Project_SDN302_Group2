const express = require("express");
const router = express.Router();
const {
  register,
  login,
  requestPasswordReset,
  requestRefreshToken,
  logout,
  resetPasswordWithOTP,
  verifyOTPRegister,
} = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Đăng ký tài khoản
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fullName, email, password]
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Nguyen Van A
 *               email:
 *                 type: string
 *                 example: nguyenvana@gmail.com
 *               password:
 *                 type: string
 *                 example: "123456"
 *               phone:
 *                 type: string
 *                 example: "0987654321"
 *               address:
 *                 type: string
 *                 example: 50 Tran Hung Dao, Can Tho
 *               gender:
 *                 type: string
 *                 enum: [male, female]
 *                 example: male
 *     responses:
 *       200:
 *         description: OTP đã gửi về email
 *       400:
 *         description: Email đã tồn tại hoặc dữ liệu không hợp lệ
 */
router.post("/register", register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Đăng nhập
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: nhuntq@gmail.com
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Đăng nhập thành công, trả về accessToken
 *       401:
 *         description: Sai email hoặc mật khẩu
 *       403:
 *         description: Tài khoản bị inactive
 */
router.post("/login", login);

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     tags: [Auth]
 *     summary: Lấy accessToken mới bằng refreshToken (cookie)
 *     responses:
 *       200:
 *         description: Trả về accessToken mới
 *       401:
 *         description: Không có refreshToken
 *       403:
 *         description: RefreshToken không hợp lệ hoặc hết hạn
 */
router.post("/refresh-token", requestRefreshToken);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Đăng xuất
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Đăng xuất thành công
 *       400:
 *         description: Không có refreshToken
 */
router.post("/logout", verifyToken, logout);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     tags: [Auth]
 *     summary: Gửi OTP về email để reset mật khẩu
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 example: nhuntq@gmail.com
 *     responses:
 *       200:
 *         description: OTP đã gửi về email
 *       404:
 *         description: Không tìm thấy tài khoản
 */
router.post("/forgot-password", requestPasswordReset);

/**
 * @swagger
 * /api/auth/verify-otp-reset:
 *   post:
 *     tags: [Auth]
 *     summary: Xác thực OTP và đặt lại mật khẩu
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp, newPassword]
 *             properties:
 *               email:
 *                 type: string
 *                 example: nhuntq@gmail.com
 *               otp:
 *                 type: string
 *                 example: "123456"
 *               newPassword:
 *                 type: string
 *                 example: newpass123
 *     responses:
 *       200:
 *         description: Đặt lại mật khẩu thành công
 *       400:
 *         description: OTP không hợp lệ hoặc hết hạn
 */
router.post("/verify-otp-reset", resetPasswordWithOTP);

/**
 * @swagger
 * /api/auth/verify-otp-register:
 *   post:
 *     tags: [Auth]
 *     summary: Xác thực OTP để hoàn tất đăng ký
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp]
 *             properties:
 *               email:
 *                 type: string
 *                 example: nguyenvana@gmail.com
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *       400:
 *         description: OTP không hợp lệ hoặc hết hạn
 */
router.post("/verify-otp-register", verifyOTPRegister);

module.exports = router;