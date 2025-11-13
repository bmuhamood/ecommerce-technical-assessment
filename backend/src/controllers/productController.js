/**
 * Product Controller
 * Handles HTTP requests for product operations
 */

const Product = require('../models/Product');

/**
 * GET /api/products
 * Get all products with optional filtering and pagination
 */
const getAllProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      stock,
      sortBy,
      sortOrder
    } = req.query;

    // Validate pagination parameters
    const validPage = Math.max(1, parseInt(page));
    const validLimit = Math.min(50, Math.max(1, parseInt(limit))); // Max 50 items per page

    const options = {
      page: validPage,
      limit: validLimit,
      category,
      stock,
      sortBy,
      sortOrder
    };

    const result = await Product.getAll(options);

    res.status(200).json({
      success: true,
      data: result.products,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/products/:id
 * Get single product by ID
 */
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid product ID'
      });
    }

    const product = await Product.getById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/products
 * Create new product
 */
const createProduct = async (req, res, next) => {
  try {
    const productData = req.body;

    // Validate required fields
    const { name, price, category, stock_status } = productData;

    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Product name is required'
      });
    }

    if (!price || isNaN(price) || price < 0) {
      return res.status(400).json({
        success: false,
        error: 'Valid price is required'
      });
    }

    if (!category || category.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Category is required'
      });
    }

    const validStockStatuses = ['In Stock', 'Out of Stock', 'Low Stock', 'Discontinued'];
    if (!stock_status || !validStockStatuses.includes(stock_status)) {
      return res.status(400).json({
        success: false,
        error: `Stock status must be one of: ${validStockStatuses.join(', ')}`
      });
    }

    const newProduct = await Product.create(productData);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: newProduct
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/products/:id
 * Update existing product
 */
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const productData = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid product ID'
      });
    }

    // Validate price if provided
    if (productData.price !== undefined && (isNaN(productData.price) || productData.price < 0)) {
      return res.status(400).json({
        success: false,
        error: 'Price must be a positive number'
      });
    }

    // Validate stock status if provided
    if (productData.stock_status) {
      const validStockStatuses = ['In Stock', 'Out of Stock', 'Low Stock', 'Discontinued'];
      if (!validStockStatuses.includes(productData.stock_status)) {
        return res.status(400).json({
          success: false,
          error: `Stock status must be one of: ${validStockStatuses.join(', ')}`
        });
      }
    }

    const updatedProduct = await Product.update(id, productData);

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    next(error);
  }
};

/**
 * DELETE /api/products/:id
 * Delete product
 */
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid product ID'
      });
    }

    await Product.delete(id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    next(error);
  }
};

/**
 * GET /api/products/categories
 * Get all product categories
 */
const getCategories = async (req, res, next) => {
  try {
    const categories = await Product.getCategories();

    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories
};
