const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// GET ALL
router.get("/", productController.getAllProducts);

// GET BY ID
router.get("/:id", productController.getProductById);

// CREATE
router.post("/", productController.createProduct);

// UPDATE
router.put("/:id", productController.updateProduct);

// UPDATE STATUS
router.patch("/:id/status", productController.updateProductStatus);

// DELETE
router.delete("/:id", productController.deleteProduct);

module.exports = router;