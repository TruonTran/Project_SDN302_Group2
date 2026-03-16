const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/categoryController");
const { verifyToken, adminMiddleware } = require("../middleware/authMiddleware");

router.get("/", verifyToken, adminMiddleware, categoryController.getAllCategories);
router.post("/", verifyToken, adminMiddleware, categoryController.createCategory);
router.put("/:id", verifyToken, adminMiddleware, categoryController.updateCategory);
router.delete("/:id", verifyToken, adminMiddleware, categoryController.deleteCategory);

router.put("/:id/status",verifyToken, adminMiddleware,categoryController.updateCategoryStatus);

module.exports = router;