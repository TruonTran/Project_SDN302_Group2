const express = require("express");
const router = express.Router();

const { createOrder, checkout } = require("../controllers/orderController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/", verifyToken, createOrder);
router.post("/checkout", verifyToken, checkout);

module.exports = router;
