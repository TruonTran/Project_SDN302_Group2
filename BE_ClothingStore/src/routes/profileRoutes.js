const express = require("express");
const router = express.Router();
const { getProfile, updateProfile, updateAvatar, deleteAvatar, changePassword } = require("../controllers/profileController");
const { verifyToken } = require("../middleware/authMiddleware");
const { uploadAvatar } = require("../middleware/uploadMiddleware");

router.use(verifyToken);

router.get("/", getProfile);
router.put("/", uploadAvatar.single("avatar"), updateProfile);
router.put("/avatar", uploadAvatar.single("avatar"), updateAvatar);
router.delete("/avatar", deleteAvatar);
router.put("/change-password", changePassword);

router.use((error, req, res, next) => {
    if (error instanceof Error) {
        return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
});

module.exports = router;