const Category = require("../models/categoryModel");

// GET ALL
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE
exports.createCategory = async (req, res) => {
  try {
    const { name, gender, status } = req.body;

    const newCategory = new Category({
      name,
      gender,
      status,
    });

    const savedCategory = await newCategory.save();

    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// UPDATE
exports.updateCategory = async (req, res) => {
  try {
    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE
exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};