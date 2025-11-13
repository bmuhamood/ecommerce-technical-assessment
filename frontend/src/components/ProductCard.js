/**
 * ProductCard Component
 * Displays individual product information
 */

import React from 'react';

const ProductCard = ({ product }) => {
  const {
    name,
    price,
    category,
    stock_status,
    description,
    image_url
  } = product;

  // Determine stock status class
  const stockClass = stock_status === 'In Stock' ? 'stock-in'
    : stock_status === 'Low Stock' ? 'stock-low'
    : 'stock-out';

  return (
    <div className="product-card">
      <div className="product-image">
        {image_url ? (
          <img src={image_url} alt={name} onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
          }} />
        ) : (
          <div className="placeholder-image">
            <span>📦</span>
          </div>
        )}
      </div>
      
      <div className="product-details">
        <div className="product-header">
          <h3 className="product-name">{name}</h3>
          <span className="product-category">{category}</span>
        </div>
        
        <p className="product-description">
          {description || 'No description available'}
        </p>
        
        <div className="product-footer">
          <div className="product-price">${parseFloat(price).toFixed(2)}</div>
          <span className={`stock-badge ${stockClass}`}>
            {stock_status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
