/**
 * Product Model
 * Database operations for products
 */

const db = require('../config/database');

class Product {
  /**
   * Get all products with pagination and filtering
   */
  static async getAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      category = null,
      stock = null,
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = options;

    const offset = (page - 1) * limit;
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    // Add filters
    if (category) {
      query += ` AND category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    if (stock) {
      query += ` AND stock_status = $${paramIndex}`;
      params.push(stock);
      paramIndex++;
    }

    // Add sorting
    const validSortFields = ['name', 'price', 'category', 'created_at'];
    const validSortOrders = ['ASC', 'DESC'];
    
    if (validSortFields.includes(sortBy) && validSortOrders.includes(sortOrder.toUpperCase())) {
      query += ` ORDER BY ${sortBy} ${sortOrder}`;
    } else {
      query += ' ORDER BY created_at DESC';
    }

    // Add pagination
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) FROM products WHERE 1=1';
    const countParams = [];
    
    if (category) {
      countQuery += ' AND category = $1';
      countParams.push(category);
    }
    if (stock) {
      countQuery += ` AND stock_status = $${countParams.length + 1}`;
      countParams.push(stock);
    }

    try {
      const [productsResult, countResult] = await Promise.all([
        db.query(query, params),
        db.query(countQuery, countParams)
      ]);

      const total = parseInt(countResult.rows[0].count);
      const totalPages = Math.ceil(total / limit);

      return {
        products: productsResult.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages
        }
      };
    } catch (error) {
      throw new Error(`Error fetching products: ${error.message}`);
    }
  }

  /**
   * Get product by ID
   */
  static async getById(id) {
    const query = 'SELECT * FROM products WHERE id = $1';
    
    try {
      const result = await db.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Error fetching product: ${error.message}`);
    }
  }

  /**
   * Create new product
   */
  static async create(productData) {
    const {
      name,
      price,
      category,
      stock_status,
      description = '',
      image_url = ''
    } = productData;

    // Validation
    if (!name || !price || !category || !stock_status) {
      throw new Error('Missing required fields: name, price, category, stock_status');
    }

    if (price < 0) {
      throw new Error('Price cannot be negative');
    }

    const query = `
      INSERT INTO products (name, price, category, stock_status, description, image_url)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const params = [name, price, category, stock_status, description, image_url];

    try {
      const result = await db.query(query, params);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error creating product: ${error.message}`);
    }
  }

  /**
   * Update product
   */
  static async update(id, productData) {
    const {
      name,
      price,
      category,
      stock_status,
      description,
      image_url
    } = productData;

    // Build dynamic update query
    const updates = [];
    const params = [];
    let paramIndex = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramIndex}`);
      params.push(name);
      paramIndex++;
    }
    if (price !== undefined) {
      if (price < 0) throw new Error('Price cannot be negative');
      updates.push(`price = $${paramIndex}`);
      params.push(price);
      paramIndex++;
    }
    if (category !== undefined) {
      updates.push(`category = $${paramIndex}`);
      params.push(category);
      paramIndex++;
    }
    if (stock_status !== undefined) {
      updates.push(`stock_status = $${paramIndex}`);
      params.push(stock_status);
      paramIndex++;
    }
    if (description !== undefined) {
      updates.push(`description = $${paramIndex}`);
      params.push(description);
      paramIndex++;
    }
    if (image_url !== undefined) {
      updates.push(`image_url = $${paramIndex}`);
      params.push(image_url);
      paramIndex++;
    }

    if (updates.length === 0) {
      throw new Error('No fields to update');
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    params.push(id);

    const query = `
      UPDATE products
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    try {
      const result = await db.query(query, params);
      
      if (result.rows.length === 0) {
        throw new Error('Product not found');
      }
      
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error updating product: ${error.message}`);
    }
  }

  /**
   * Delete product
   */
  static async delete(id) {
    const query = 'DELETE FROM products WHERE id = $1 RETURNING *';

    try {
      const result = await db.query(query, [id]);
      
      if (result.rows.length === 0) {
        throw new Error('Product not found');
      }
      
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error deleting product: ${error.message}`);
    }
  }

  /**
   * Get all categories
   */
  static async getCategories() {
    const query = 'SELECT DISTINCT category FROM products ORDER BY category';
    
    try {
      const result = await db.query(query);
      return result.rows.map(row => row.category);
    } catch (error) {
      throw new Error(`Error fetching categories: ${error.message}`);
    }
  }
}

module.exports = Product;
