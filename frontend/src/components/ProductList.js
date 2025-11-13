/**
 * ProductList Component
 * Displays a grid of products
 */

import React from 'react';
import ProductCard from './ProductCard';

const ProductList = ({ products }) => {
  if (!products || products.length === 0) {
    return (
      <div className="empty-state">
        <p>📦 No products found</p>
        <p className="empty-state-subtitle">Try adjusting your filters or add new products</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
