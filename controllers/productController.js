const mongoose = require('mongoose');
const Product = require('../models/productModel');

// Helper: Check for valid MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET /api/products
exports.getAll = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/products/:id
exports.getById = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid product ID.' });
  }

  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/products (Protected)
exports.create = async (req, res) => {
  const { name, price, description, category, quantity, inStock, supplier } = req.body;

  if (!name || price == null) {
    return res.status(400).json({ message: 'Name and price are required.' });
  }

  if (!req.user || !req.user._id) {
    return res.status(401).json({ message: 'Unauthorized. Please log in.' });
  }

  try {
    const product = new Product({
      name,
      price,
      description,
      category,
      quantity,
      inStock,
      supplier,
      createdBy: req.user._id
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error creating product:', error.message);
    res.status(400).json({ error: 'Failed to create product. ' + error.message });
  }
};

// PUT /api/products/:id (Protected)
exports.update = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid product ID format.' });
  }

  if ('price' in req.body && isNaN(Number(req.body.price))) {
    return res.status(400).json({ message: 'Price must be a number.' });
  }

  if ('quantity' in req.body && isNaN(Number(req.body.quantity))) {
    return res.status(400).json({ message: 'Quantity must be a number.' });
  }

  try {
    const updated = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    res.json(updated);
  } catch (error) {
    console.error('Error updating product:', error.message);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

// DELETE /api/products/:id (Protected)
exports.remove = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid product ID format.' });
  }

  try {
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Product not found.' });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
