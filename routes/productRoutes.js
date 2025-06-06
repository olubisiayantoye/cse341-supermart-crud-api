const express = require('express');
const { body } = require('express-validator');
const productController = require('../controllers/productController');
const { ensureAuthenticated } = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management and CRUD operations
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: A list of products
 */
router.get('/', ensureAuthenticated, productController.getAll);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product ID
 *     responses:
 *       200:
 *         description: Product data
 *       404:
 *         description: Product not found
 */
router.get('/:id', ensureAuthenticated, productController.getById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     security:
 *       - bearerAuth: []
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               quantity:
 *                 type: number
 *               inStock:
 *                 type: boolean
 *               supplier:
 *                 type: string
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Bad request
 */
router.post(
  '/',
  ensureAuthenticated,
  body('name').notEmpty().withMessage('Name cannot be empty'),
  body('description').notEmpty().withMessage('Cannot be empty'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('category').notEmpty().withMessage('Cannot be empty'),
  body('quantity').isNumeric().withMessage('quantity must be a number'),
  body('inStock').isBoolean().withMessage('True or False'),
  body('supplier').notEmpty().withMessage('Name is required'),
  productController.create
);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               quantity:
 *                 type: number
 *               inStock:
 *                 type: boolean
 *               supplier:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Product not found
 */
router.put('/:id',
  ensureAuthenticated,
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('description').optional().notEmpty().withMessage('Cannot be empty'),
  body('price').optional().isNumeric().withMessage('Price must be a number'),
  body('category').optional().notEmpty().withMessage('Cannot be empty'),
  body('quantity').isNumeric().withMessage('quantity must be a number'),
  body('inStock').isBoolean().withMessage('True or False'),
  body('supplier').notEmpty().withMessage('Name is required'),
  productController.update
);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */
router.delete('/:id', ensureAuthenticated, productController.remove);

module.exports = router;
