import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartDrawer({ onProceedToCheckout }) {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, clearCart, totalAmount } = useCart();

  if (!isCartOpen) return null;

  return (
    <>
      <div className="drawer-overlay" onClick={() => setIsCartOpen(false)} />
      <div className="cart-drawer">

        {/* Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e5eeff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
            <ShoppingBag size={20} color="#1d6ae5" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827' }}>Shopping Cart</h3>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            style={{ background: '#f1f5fd', border: '1.5px solid #d1ddf7', color: '#374151', cursor: 'pointer', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s ease' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#dbeafe'; e.currentTarget.style.borderColor = '#1d6ae5'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#f1f5fd'; e.currentTarget.style.borderColor = '#d1ddf7'; }}
          >
            <X size={17} />
          </button>
        </div>

        {/* Cart Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem', background: '#f8faff' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
              <div style={{ background: '#f1f5fd', borderRadius: '50%', width: '72px', height: '72px', margin: '0 auto 1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid #d1ddf7' }}>
                <ShoppingBag size={34} color="#93c5fd" />
              </div>
              <h4 style={{ fontSize: '1rem', marginBottom: '0.4rem', color: '#374151', fontWeight: 700 }}>Your cart is empty</h4>
              <p style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Looks like you haven't added any products yet.</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="glass-btn-primary"
                style={{ fontSize: '0.87rem' }}
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {cartItems.map(({ product, quantity }) => (
                <div
                  key={product._id}
                  style={{
                    padding: '0.9rem',
                    display: 'flex',
                    gap: '0.9rem',
                    alignItems: 'center',
                    background: '#fff',
                    border: '1.5px solid #e5eeff',
                    borderRadius: '10px',
                    boxShadow: '0 1px 4px rgba(29,106,229,0.06)'
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80';
                    }}
                    style={{ width: '62px', height: '62px', borderRadius: '8px', objectFit: 'cover', border: '1.5px solid #e5eeff', flexShrink: 0 }}
                  />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.2rem', color: '#111827' }}>{product.title}</h4>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1d6ae5' }}>${product.price.toFixed(2)}</span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginTop: '0.45rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #d1ddf7', borderRadius: '7px', overflow: 'hidden', background: '#f1f5fd' }}>
                        <button
                          onClick={() => updateQuantity(product._id, quantity - 1)}
                          style={{ padding: '0.2rem 0.55rem', background: 'none', border: 'none', color: '#374151', cursor: 'pointer', fontWeight: 700, fontSize: '1rem', lineHeight: 1 }}
                        >
                          −
                        </button>
                        <span style={{ padding: '0 0.5rem', fontSize: '0.84rem', fontWeight: 700, color: '#111827', borderLeft: '1px solid #d1ddf7', borderRight: '1px solid #d1ddf7' }}>{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product._id, quantity + 1)}
                          style={{ padding: '0.2rem 0.55rem', background: 'none', border: 'none', color: '#374151', cursor: 'pointer', fontWeight: 700, fontSize: '1rem', lineHeight: 1 }}
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(product._id)}
                        style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', padding: '0.2rem', display: 'flex', alignItems: 'center' }}
                        title="Remove"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={clearCart}
                style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: '0.82rem', cursor: 'pointer', textAlign: 'right', marginTop: '0.25rem', fontWeight: 600 }}
              >
                Clear Cart
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid #e5eeff', background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#6b7280', fontSize: '0.88rem' }}>
              <span>Subtotal</span>
              <span style={{ color: '#111827', fontWeight: 700 }}>${totalAmount.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: '#6b7280', fontSize: '0.88rem' }}>
              <span>Shipping</span>
              <span style={{ color: '#059669', fontWeight: 700 }}>FREE</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', paddingTop: '0.75rem', borderTop: '1px dashed #d1ddf7' }}>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: '#111827' }}>Total</span>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1d6ae5' }}>${totalAmount.toFixed(2)}</span>
            </div>

            <button
              onClick={() => {
                setIsCartOpen(false);
                onProceedToCheckout();
              }}
              className="glass-btn-primary"
              style={{ width: '100%', padding: '0.85rem' }}
            >
              Checkout Now <ArrowRight size={17} />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
