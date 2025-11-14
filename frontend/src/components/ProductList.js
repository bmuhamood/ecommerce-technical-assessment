/**
 * ProductList Component - High Performance + Modern UI
 */

import React, { memo, useMemo } from "react";
import ProductCard from "./ProductCard";

// Memoized ProductCard (prevents unnecessary re-renders)
const MemoProductCard = memo(function MemoProductCard({ product }) {
  return <ProductCard product={product} />;
});

const ProductList = ({ products, isLoading }) => {
  // PREPARE MEMOIZED PRODUCT LIST (even if not used)
  const memoizedProducts = useMemo(() => {
    if (!products) return [];
    return products.map((product) => (
      <MemoProductCard key={product.id} product={product} />
    ));
  }, [products]);

  /* ------------------------------------------------
     1. LOADING SKELETON
  ------------------------------------------------ */
  if (isLoading) {
    return (
      <div className="product-grid-modern">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="product-card-skeleton">
            <div className="skeleton-image"></div>

            <div className="skeleton-content">
              <div className="skeleton-line skeleton-title"></div>
              <div className="skeleton-line skeleton-description"></div>
              <div className="skeleton-line skeleton-description short"></div>

              <div className="skeleton-footer">
                <div className="skeleton-line skeleton-price"></div>
                <div className="skeleton-line skeleton-badge"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  /* ------------------------------------------------
     2. EMPTY STATE
  ------------------------------------------------ */
  if (!products || products.length === 0) {
    return (
      <div className="empty-state-modern">
        <div className="empty-icon">
          <svg width="130" height="130" viewBox="0 0 200 200" fill="none">
            <circle cx="100" cy="100" r="80" fill="#F3F4F6" />
            <path
              d="M70 90h60M70 110h40M70 130h50"
              stroke="#9CA3AF"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <h3 className="empty-title">No Products Found</h3>
        <p className="empty-desc">
          We couldn't find anything based on your filters.  
          Try adjusting your search.
        </p>

        <button
          className="btn-primary-modern"
          onClick={() => window.location.reload()}
        >
          Refresh
        </button>
      </div>
    );
  }

  /* ------------------------------------------------
     3. MAIN RENDER
  ------------------------------------------------ */
  return (
    <div className="products-container-modern">
      {/* Results Summary */}
      <div className="results-summary">
        <p className="results-count">
          <span className="count-number">{products.length}</span>
          {products.length === 1 ? " Product" : " Products"} Found
        </p>

        <div className="view-options">
          <button className="view-btn active" aria-label="Grid View">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="product-grid-modern">
        {memoizedProducts}
      </div>
    </div>
  );
};

export default ProductList;
