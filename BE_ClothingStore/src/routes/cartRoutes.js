const express = require("express");
const router = express.Router();
const {
  getCartByUserId,
  addToCart,
  updateCart,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");
const { verifyToken, canModifyUser } = require("../middleware/authMiddleware");

router.get("/:userId", verifyToken, canModifyUser, getCartByUserId);
router.post("/:userId", verifyToken, canModifyUser, addToCart);
router.put("/:userId", verifyToken, canModifyUser, updateCart);
router.delete("/:userId", verifyToken, canModifyUser, removeFromCart);
router.delete("/clear/:userId", verifyToken, canModifyUser, clearCart);

module.exports = router;
