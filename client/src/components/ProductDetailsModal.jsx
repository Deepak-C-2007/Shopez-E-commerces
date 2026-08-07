import React, { useState } from 'react';
import { X, Star, ShoppingCart, ArrowRight, Shield, RefreshCw, Truck, Settings, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function ProductDetailsModal({ product, onClose, onBuyNow, onManageProduct, adminMode }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { isAdmin: authIsAdmin } = useAuth();

  const isUserAdmin = adminMode || authIsAdmin;

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose();
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    onClose();
    if (onBuyNow) onBuyNow(product);
  };

  const handleManage = () => {
    onClose();
    if (onManageProduct) {
      onManageProduct(product);
    }
  };

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '740px',
          background: '#fff',
          border: '1.5px solid #d1ddf7',
          borderRadius: '16px',
          padding: '0',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(29,106,229,0.16)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: '#f1f5fd',
            border: '1.5px solid #d1ddf7',
            color: '#374151',
            borderRadius: '50%',
            width: '34px',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#dbeafe'; e.currentTarget.style.borderColor = '#1d6ae5'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#f1f5fd'; e.currentTarget.style.borderColor = '#d1ddf7'; }}
        >
          <X size={16} />
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', minHeight: '380px' }}>
          {/* Image */}
          <div style={{ width: '100%', height: '100%', minHeight: '360px', overflow: 'hidden', background: '#f8faff', borderRight: '1px solid #e5eeff' }}>
            <img
              src={product.image}
              alt={product.title}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80';
              }}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Info */}
          <div style={{ padding: '1.75rem 1.5rem', display: 'flex', flexDirection: 'column' }}>
            <span className="glass-pill" style={{ marginBottom: '0.65rem', alignSelf: 'flex-start' }}>{product.category}</span>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, marginBottom: '0.5rem', color: '#111827', lineHeight: 1.25 }}>{product.title}</h2>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.9rem' }}>
              <Star size={15} color="#f59e0b" fill="#f59e0b" />
              <span style={{ fontWeight: 700, color: '#92400e', fontSize: '0.88rem' }}>{product.rating}</span>
              <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>({product.numReviews} reviews)</span>
            </div>

            <p style={{ color: '#6b7280', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.25rem', flex: 1 }}>
              {product.description}
            </p>

            {/* Pricing */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.7rem', marginBottom: '1.1rem' }}>
              <span style={{ fontSize: '1.7rem', fontWeight: 800, color: '#1d6ae5' }}>${product.price.toFixed(2)}</span>
              {product.originalPrice > product.price && (
                <span style={{ fontSize: '0.95rem', color: '#9ca3af', textDecoration: 'line-through' }}>
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
              {discountPercent && (
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff', background: '#dc2626', padding: '0.15rem 0.5rem', borderRadius: '999px' }}>
                  -{discountPercent}%
                </span>
              )}
            </div>

            <div style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 600, marginBottom: '1.25rem' }}>
              ✓ In Stock ({product.countInStock || 15} available)
            </div>

            {/* Quantity Selector - Only for Non-Admin users */}
            {!isUserAdmin ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#374151', fontWeight: 700 }}>Quantity:</span>
                <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #d1ddf7', borderRadius: '8px', overflow: 'hidden', background: '#f8faff' }}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{ padding: '0.4rem 0.75rem', background: 'none', border: 'none', color: '#374151', cursor: 'pointer', fontWeight: 700, fontSize: '1.1rem', borderRight: '1px solid #d1ddf7' }}
                  >
                    −
                  </button>
                  <span style={{ padding: '0 0.85rem', fontWeight: 800, color: '#111827', fontSize: '0.95rem' }}>{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    style={{ padding: '0.4rem 0.75rem', background: 'none', border: 'none', color: '#374151', cursor: 'pointer', fontWeight: 700, fontSize: '1.1rem', borderLeft: '1px solid #d1ddf7' }}
                  >
                    +
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ fontSize: '0.82rem', color: '#1d6ae5', marginBottom: '1.25rem', padding: '0.5rem 0.75rem', background: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
                <ShieldCheck size={16} />
                <span>Admin View — Shopping features disabled</span>
              </div>
            )}

            {/* Action Buttons: Add to Cart & Buy Now for Customers vs Manage Product for Admin */}
            {!isUserAdmin ? (
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.1rem' }}>
                <button
                  onClick={handleAddToCart}
                  className="glass-btn-secondary"
                  style={{ flex: 1, padding: '0.8rem' }}
                >
                  <ShoppingCart size={16} /> Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="glass-btn-primary"
                  style={{ flex: 1, padding: '0.8rem' }}
                >
                  Buy Now <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              <div style={{ marginBottom: '1.1rem' }}>
                <button
                  onClick={handleManage}
                  className="glass-btn-primary"
                  style={{ width: '100%', padding: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.92rem', fontWeight: 700 }}
                >
                  <Settings size={18} /> Manage Product
                </button>
              </div>
            )}

            {/* Trust badges */}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.9rem', borderTop: '1px solid #e5eeff', fontSize: '0.76rem', color: '#6b7280' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Truck size={13} color="#1d6ae5" /> Free Delivery</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Shield size={13} color="#1d6ae5" /> Secure Checkout</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><RefreshCw size={13} color="#1d6ae5" /> 30-Day Returns</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
