/**
 * Main App Component
 * eCommerce Product Module Frontend
 */

import React, { useState, useEffect } from 'react';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import LoginForm from './components/LoginForm';
import { getProducts, createProduct } from './services/api';
import './styles/App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [filters, setFilters] = useState({
    category: '',
    stock: ''
  });

  // Check if user is authenticated on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, [pagination.page, filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = {
        page: pagination.page,
        limit: pagination.limit,
        ...(filters.category && { category: filters.category }),
        ...(filters.stock && { stock: filters.stock })
      };

      const response = await getProducts(queryParams);
      
      if (response.success) {
        setProducts(response.data);
        setPagination(prev => ({
          ...prev,
          ...response.pagination
        }));
      }
    } catch (err) {
      setError('Failed to load products. Please try again later.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (productData) => {
    try {
      const response = await createProduct(productData);
      
      if (response.success) {
        setShowAddForm(false);
        fetchProducts(); // Refresh product list
        alert('Product added successfully!');
      }
    } catch (err) {
      if (err.message.includes('401') || err.message.includes('403')) {
        alert('Please login to add products');
        setIsAuthenticated(false);
        localStorage.removeItem('token');
      } else {
        alert('Failed to add product. Please try again.');
      }
      console.error('Error adding product:', err);
    }
  };

  const handleLogin = (token, user) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    setShowLoginForm(false);
    alert(`Welcome, ${user.email}!`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setShowAddForm(false);
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page on filter
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="container">
          <div className="header-left">
            <h1>🛒 eCommerce Product Catalog</h1>
            <nav className="main-nav">
              <button 
                className={`nav-link ${!showLoginForm && !showAddForm ? 'active' : ''}`}
                onClick={() => {
                  setShowLoginForm(false);
                  setShowAddForm(false);
                }}
              >
                🏠 Home
              </button>
              <button className="nav-link">
                📦 Products
              </button>
              <button className="nav-link">
                ℹ️ About
              </button>
            </nav>
          </div>
          <div className="header-actions">
            {isAuthenticated ? (
              <>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowAddForm(!showAddForm)}
                >
                  {showAddForm ? '✕ Cancel' : '+ Add Product'}
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => setShowLoginForm(!showLoginForm)}
              >
                {showLoginForm ? '✕ Cancel' : '🔒 Admin Login'}
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="container">
        {/* Login Form */}
        {showLoginForm && !isAuthenticated && (
          <div className="form-section">
            <LoginForm onLogin={handleLogin} />
          </div>
        )}

        {/* Add Product Form */}
        {showAddForm && isAuthenticated && (
          <div className="form-section">
            <ProductForm
              onSubmit={handleAddProduct}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        )}

        {/* Filters */}
        {!showLoginForm && !showAddForm && (
          <div className="filters-section">
            <div className="filter-group">
              <label htmlFor="category-filter">Category:</label>
              <select
                id="category-filter"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Accessories">Accessories</option>
                <option value="Audio">Audio</option>
                <option value="Storage">Storage</option>
                <option value="Furniture">Furniture</option>
                <option value="Wearables">Wearables</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="stock-filter">Stock Status:</label>
              <select
                id="stock-filter"
                value={filters.stock}
                onChange={(e) => handleFilterChange('stock', e.target.value)}
              >
                <option value="">All Stock Status</option>
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>
          </div>
        )}

        {/* Product List */}
        {!showLoginForm && !showAddForm && (error ? (
          <div className="error-message">
            <p>{error}</p>
            <button className="btn btn-primary" onClick={fetchProducts}>
              Try Again
            </button>
          </div>
        ) : (
          <>
            <ProductList products={products} isLoading={loading} />
            
            {/* Pagination */}
            {!loading && pagination.totalPages > 1 && (
              <div className="pagination">
                <button
                  className="btn btn-secondary"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  ← Previous
                </button>
                
                <span className="pagination-info">
                  Page {pagination.page} of {pagination.totalPages}
                  {' '}({pagination.total} products)
                </span>
                
                <button
                  className="btn btn-secondary"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        ))}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="container">
          <p>© 2025 eCommerce Product Module | Built for Dream Come True Group</p>
        </div>
      </footer>
    </div>
  );
}

export default App;