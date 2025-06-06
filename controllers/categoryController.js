const mongoose = require('mongoose');
const Category = require('../models/categoryModel');

// Helper: Validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET /api/categories - Get all categories
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

// POST /api/categories - Create a new category
exports.createCategory = async (req, res, next) => {
  try {
    const { categoryName, description } = req.body;

    if (!categoryName || categoryName.trim() === '') {
      return res.status(400).json({ message: 'Category name is required.' });
    }

    const category = new Category({ categoryName, description });
    const savedCategory = await category.save();

    res.status(201).json(savedCategory);
  } catch (error) {
    next(error);
  }
};

// PUT /api/categories/:id - Update a category
exports.updateCategory = async (req, res, next) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid category ID.' });
  }

  try {
    const { categoryName, description } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { categoryName, description },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    res.json(updatedCategory);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/categories/:id - Delete a category
exports.deleteCategory = async (req, res, next) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid category ID.' });
  }

  try {
    const deleted = await Category.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    res.json({ message: 'Category deleted.' });
  } catch (error) {
    next(error);
  }
};
