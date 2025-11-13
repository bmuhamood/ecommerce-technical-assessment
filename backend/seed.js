/**
 * Database Seed Script
 * Populates database with sample data for testing
 */

const { pool } = require('./src/config/database');
const bcrypt = require('bcrypt');

const seedData = async () => {
  const client = await pool.connect();

  try {
    console.log('🌱 Starting database seeding...');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await client.query(`
      INSERT INTO users (email, password_hash, role)
      VALUES ('admin@example.com', $1, 'admin')
      ON CONFLICT (email) DO NOTHING;
    `, [hashedPassword]);
    console.log('✅ Admin user created (email: admin@example.com, password: admin123)');

    // Sample products
    const products = [
      {
        name: 'Wireless Mouse',
        price: 29.99,
        category: 'Electronics',
        stock_status: 'In Stock',
        description: 'Ergonomic wireless mouse with 2.4GHz connectivity',
        image_url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46'
      },
      {
        name: 'Mechanical Keyboard',
        price: 89.99,
        category: 'Electronics',
        stock_status: 'In Stock',
        description: 'RGB mechanical keyboard with Cherry MX switches',
        image_url: 'https://images.unsplash.com/photo-1595225476474-87563907a212'
      },
      {
        name: 'USB-C Hub',
        price: 45.50,
        category: 'Electronics',
        stock_status: 'Low Stock',
        description: '7-in-1 USB-C hub with HDMI and USB 3.0 ports',
        image_url: 'https://images.unsplash.com/photo-1625948515291-69613efd103f'
      },
      {
        name: 'Laptop Stand',
        price: 34.99,
        category: 'Accessories',
        stock_status: 'In Stock',
        description: 'Adjustable aluminum laptop stand',
        image_url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45'
      },
      {
        name: 'Webcam HD',
        price: 79.99,
        category: 'Electronics',
        stock_status: 'In Stock',
        description: '1080p HD webcam with auto-focus',
        image_url: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04'
      },
      {
        name: 'Desk Lamp LED',
        price: 42.00,
        category: 'Accessories',
        stock_status: 'In Stock',
        description: 'Adjustable LED desk lamp with USB charging',
        image_url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c'
      },
      {
        name: 'Noise Cancelling Headphones',
        price: 199.99,
        category: 'Audio',
        stock_status: 'In Stock',
        description: 'Premium wireless headphones with active noise cancellation',
        image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e'
      },
      {
        name: 'Portable SSD 1TB',
        price: 129.99,
        category: 'Storage',
        stock_status: 'In Stock',
        description: 'Ultra-fast portable SSD with USB-C',
        image_url: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b'
      },
      {
        name: 'Monitor 27 inch',
        price: 299.99,
        category: 'Electronics',
        stock_status: 'Low Stock',
        description: '4K UHD monitor with IPS panel',
        image_url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf'
      },
      {
        name: 'Ergonomic Chair',
        price: 349.99,
        category: 'Furniture',
        stock_status: 'In Stock',
        description: 'Premium ergonomic office chair with lumbar support',
        image_url: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8'
      },
      {
        name: 'Cable Organizer Kit',
        price: 15.99,
        category: 'Accessories',
        stock_status: 'In Stock',
        description: 'Complete cable management solution',
        image_url: 'https://images.unsplash.com/photo-1622372738946-62e02505feb3'
      },
      {
        name: 'External DVD Drive',
        price: 24.99,
        category: 'Storage',
        stock_status: 'Out of Stock',
        description: 'USB 3.0 external DVD writer',
        image_url: 'https://images.unsplash.com/photo-1531492746076-161ca9bcad58'
      },
      {
        name: 'Wireless Charger',
        price: 19.99,
        category: 'Accessories',
        stock_status: 'In Stock',
        description: 'Fast wireless charging pad for smartphones',
        image_url: 'https://images.unsplash.com/photo-1591290619762-27800ea5e641'
      },
      {
        name: 'Bluetooth Speaker',
        price: 59.99,
        category: 'Audio',
        stock_status: 'In Stock',
        description: 'Portable waterproof Bluetooth speaker',
        image_url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1'
      },
      {
        name: 'Smart Watch',
        price: 249.99,
        category: 'Wearables',
        stock_status: 'In Stock',
        description: 'Fitness tracking smartwatch with heart rate monitor',
        image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'
      }
    ];

    for (const product of products) {
      await client.query(`
        INSERT INTO products (name, price, category, stock_status, description, image_url)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT DO NOTHING;
      `, [product.name, product.price, product.category, product.stock_status, product.description, product.image_url]);
    }

    console.log(`✅ ${products.length} sample products inserted`);
    console.log('✨ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

// Run seeding
seedData().catch((error) => {
  console.error('Seeding error:', error);
  process.exit(1);
});
