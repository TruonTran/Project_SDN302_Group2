const Product = require("../models/Product");


// GET ALL PRODUCTS
exports.getAllProducts = async (req, res) => {
    try {
        const { status, limit } = req.query;

        let filter = {};

        if (status) {
            filter.status = status;
        }

        const products = await Product.find(filter)
            .populate("category")
            .limit(limit ? parseInt(limit) : 0)
            .sort({ createdAt: -1 });

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// GET PRODUCT BY ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("category");

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// CREATE PRODUCT
exports.createProduct = async (req, res) => {
    try {
        const product = new Product(req.body);

        const savedProduct = await product.save();

        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// UPDATE PRODUCT
exports.updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// UPDATE STATUS
exports.updateProductStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// DELETE PRODUCT (hard delete)
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};