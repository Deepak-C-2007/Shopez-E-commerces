import React from 'react';
import { Star, ShoppingCart, ArrowRight, Edit3, Trash2, Eye, Settings } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

/**
 * ProductCard
 * - Customer mode → shows Add to Cart + Buy Now buttons
 * - Admin mode    → removes shopping buttons and shows Manage Product button
 */
export default function ProductCard({
  product,
  onViewDetails,
  onQuickBuy,
  // ── Admin-mode props ──
  adminMode = false,
  onAdminEdit,
  onAdminDelete,
}) {
  const { addToCart } = useCart();
  const { isAdmin: authIsAdmin } = useAuth();

  const isUserAdmin = adminMode || authIsAdmin;

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <div
      className="glass-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        padding: '0',
        background: '#fff',
      }}
    >
      {/* Category & Discount badge */}
      <div style={{ position: 'absolute', top: '0.9rem', left: '0.9rem', right: '0.9rem', display: 'flex', justifyContent: 'space-between', zIndex: 10 }}>
        <span className="glass-pill">{product.category}</span>
        {discountPercent && <span className="badge-discount">-{discountPercent}%</span>}
      </div>

      {/* Product Image */}
      <div
        onClick={() => onViewDetails && onViewDetails(product)}
        style={{
          width: '100%',
          height: '200px',
          overflow: 'hidden',
          cursor: onViewDetails ? 'pointer' : 'default',
          background: '#f8faff',
          borderBottom: '1px solid #e5eeff',
          flexShrink: 0,
        }}
      >
        <img
          src={product.image}
          alt={product.title}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80';
          }}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />
      </div>

      {/* Card Body */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1rem 1.1rem' }}>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.45rem' }}>
          <Star size={13} color="#f59e0b" fill="#f59e0b" />
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#92400e' }}>{product.rating || 4.8}</span>
          <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>({product.numReviews || 12} reviews)</span>
        </div>

        {/* Title */}
        <h3
          onClick={() => onViewDetails && onViewDetails(product)}
          style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.4rem', cursor: onViewDetails ? 'pointer' : 'default', lineHeight: 1.35, color: '#111827' }}
        >
          {product.title}
        </h3>

        {/* Description */}
        <p style={{
          fontSize: '0.82rem', color: '#6b7280', lineHeight: 1.5, marginBottom: '1rem',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {product.description}
        </p>

        {/* ── Bottom Section ── */}
        <div style={{ marginTop: 'auto', paddingTop: '0.85rem', borderTop: '1px solid #e5eeff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>

          {/* Price */}
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.45rem' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1d6ae5' }}>
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice > product.price && (
                <span style={{ fontSize: '0.8rem', color: '#9ca3af', textDecoration: 'line-through' }}>
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            {/* Stock indicator — shown in admin mode */}
            {isUserAdmin && (
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: product.countInStock < 5 ? '#dc2626' : product.countInStock < 10 ? '#d97706' : '#059669', marginTop: '0.1rem' }}>
                {product.countInStock < 5
                  ? `⚠ Low stock (${product.countInStock})`
                  : `✓ ${product.countInStock} in stock`}
              </div>
            )}
          </div>

          {/* ════════════════════════════════════════════════════════
              ADMIN USER  →  Manage Product (or View/Edit/Delete in grid)
              CUSTOMER    →  Add to Cart + Buy Now
              ════════════════════════════════════════════════════════ */}
          {adminMode && (onAdminEdit || onAdminDelete) ? (
            /* Inside Admin Dashboard Grid View */
            <div style={{ display: 'flex', gap: '0.35rem', flexShrink: 0 }}>
              <button
                onClick={() => onViewDetails && onViewDetails(product)}
                title="View Details"
                style={{
                  padding: '0.45rem 0.6rem', borderRadius: '8px', border: '1.5px solid #e5eeff', background: '#f8faff', color: '#6b7280', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.76rem', fontWeight: 600, fontFamily: 'Inter, sans-serif'
                }}
              >
                <Eye size={13} />
              </button>
              <button
                onClick={() => onAdminEdit && onAdminEdit(product)}
                title="Edit Product"
                style={{
                  padding: '0.45rem 0.7rem', borderRadius: '8px', border: '1.5px solid #bfdbfe', background: '#eff6ff', color: '#1d6ae5', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.78rem', fontWeight: 700, fontFamily: 'Inter, sans-serif'
                }}
              >
                <Edit3 size={13} /> Edit
              </button>
              <button
                onClick={() => onAdminDelete && onAdminDelete(product._id)}
                title="Delete Product"
                style={{
                  padding: '0.45rem 0.7rem', borderRadius: '8px', border: '1.5px solid #fca5a5', background: '#fee2e2', color: '#dc2626', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.78rem', fontWeight: 700, fontFamily: 'Inter, sans-serif'
                }}
              >
                <Trash2 size={13} /> Delete
              </button>
            </div>
          ) : isUserAdmin ? (
            /* Admin viewing product card on catalog page */
            <button
              onClick={() => onViewDetails && onViewDetails(product)}
              className="glass-btn-primary"
              style={{ padding: '0.5rem 0.9rem', borderRadius: '8px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Settings size={14} /> Manage Product
            </button>
          ) : (
            /* Customer Mode: Add to Cart + Buy Now */
            <div style={{ display: 'flex', gap: '0.45rem', flexShrink: 0 }}>
              <button
                onClick={() => addToCart(product, 1)}
                title="Add to Cart"
                style={{
                  padding: '0.5rem', borderRadius: '8px', border: '1.5px solid #d1ddf7', background: '#f1f5fd', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#dbeafe'; e.currentTarget.style.borderColor = '#1d6ae5'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#f1f5fd'; e.currentTarget.style.borderColor = '#d1ddf7'; }}
              >
                <ShoppingCart size={17} color="#1d6ae5" />
              </button>

              <button
                onClick={() => {
                  addToCart(product, 1);
                  if (onQuickBuy) onQuickBuy(product);
                }}
                className="glass-btn-primary"
                style={{ padding: '0.5rem 0.9rem', borderRadius: '8px', fontSize: '0.82rem' }}
              >
                Buy Now <ArrowRight size={13} />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
