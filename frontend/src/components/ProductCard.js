/**
 * ProductCard Component - Modern UI
 * Copy this ENTIRE file and replace your ProductCard.js
 */

import React, { useState } from 'react';

const ProductCard = ({ product }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const {
    name,
    price,
    category,
    stock_status,
    description,
    image_url
  } = product;

  // Determine stock status styling
  const getStockConfig = (status) => {
    const configs = {
      'In Stock': { 
        class: 'stock-in', 
        icon: '✓', 
        color: '#10b981',
        bg: '#ecfdf5' 
      },
      'Low Stock': { 
        class: 'stock-low', 
        icon: '⚠', 
        color: '#f59e0b',
        bg: '#fef3c7' 
      },
      'Out of Stock': { 
        class: 'stock-out', 
        icon: '✕', 
        color: '#ef4444',
        bg: '#fee2e2' 
      }
    };
    return configs[status] || configs['Out of Stock'];
  };

  const stockConfig = getStockConfig(stock_status);

  // Category icon mapping
  const getCategoryIcon = (cat) => {
    const icons = {
      'Electronics': '💻',
      'Clothing': '👕',
      'Home': '🏠',
      'Sports': '⚽',
      'Books': '📚',
      'Food': '🍕',
      'Toys': '🎮',
      'Beauty': '💄',
      'Accessories': '👜',
      'Audio': '🎧',
      'Storage': '💾',
      'Furniture': '🛋️',
      'Wearables': '⌚'
    };
    return icons[cat] || '📦';
  };

  return (
    <div className="product-card-modern">
      {/* Featured Badge for Low Stock */}
      {stock_status === 'Low Stock' && (
        <div className="featured-badge">
          <span>⚡ Limited Stock</span>
        </div>
      )}

      {/* Product Image Container */}
      <div className="product-image-modern">
        <div className="image-wrapper">
          {image_url ? (
            <>
              {!imageLoaded && (
                <div className="image-skeleton">
                  <div className="skeleton-shimmer"></div>
                </div>
              )}
              <img 
                src={image_url} 
                alt={name}
                className={imageLoaded ? 'loaded' : 'loading'}
                onLoad={() => setImageLoaded(true)}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x300/667eea/ffffff?text=' + encodeURIComponent(name);
                  setImageLoaded(true);
                }} 
              />
            </>
          ) : (
            <div className="placeholder-image-modern">
              <div className="placeholder-icon">{getCategoryIcon(category)}</div>
              <span className="placeholder-text">No Image</span>
            </div>
          )}
        </div>

        {/* Quick View Overlay */}
        <div className="image-overlay">
          <button className="quick-view-btn" aria-label="Quick view">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            Quick View
          </button>
        </div>
      </div>
      
      {/* Product Details */}
      <div className="product-details-modern">
        {/* Category Tag */}
        <div className="product-meta">
          <span className="category-tag">
            <span className="category-icon">{getCategoryIcon(category)}</span>
            {category}
          </span>
        </div>

        {/* Product Name */}
        <h3 className="product-name-modern" title={name}>
          {name}
        </h3>
        
        {/* Description */}
        <p className="product-description-modern">
          {description?.substring(0, 80) || 'Premium quality product with excellent features'}
          {description && description.length > 80 && '...'}
        </p>
        
        {/* Footer with Price and Stock */}
        <div className="product-footer-modern">
          <div className="price-section">
            <span className="price-label">Price</span>
            <div className="product-price-modern">
              <span className="currency">$</span>
              <span className="amount">{parseFloat(price).toFixed(2)}</span>
            </div>
          </div>
          
          <div className="stock-section">
            <span 
              className={`stock-badge-modern ${stockConfig.class}`}
              style={{
                '--stock-color': stockConfig.color,
                '--stock-bg': stockConfig.bg
              }}
            >
              <span className="stock-icon">{stockConfig.icon}</span>
              <span className="stock-text">{stock_status}</span>
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button className="add-to-cart-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1"/>
            <circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;