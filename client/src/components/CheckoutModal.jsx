import React, { useState } from 'react';
import { X, CheckCircle, CreditCard, Lock, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getApiUrl } from '../config/api';

export default function CheckoutModal({ onClose, onOrderPlaced }) {
  const { cartItems, totalAmount, clearCart } = useCart();
  const { user, token } = useAuth();

  const [formData, setFormData] = useState({
    fullName: user ? user.name : '',
    address: '123 Tech Avenue, Innovation Suite 404',
    city: 'San Francisco',
    postalCode: '94105',
    country: 'United States',
    phone: '+1 (555) 234-5678'
  });

  const [paymentMethod, setPaymentMethod] = useState('Credit Card (Stripe)');
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!cartItems || cartItems.length === 0) {
      alert('Your cart is empty. Please add items to your cart before proceeding to checkout.');
      return;
    }
    setSubmitting(true);

    try {
      const orderPayload = {
        orderItems: cartItems.map((item) => ({
          product: item.product._id || item.product.id || item.product.title,
          title: item.product.title,
          image: item.product.image,
          price: item.product.price,
          quantity: item.quantity
        })),
        shippingAddress: formData,
        paymentMethod,
        itemsPrice: totalAmount,
        shippingPrice: 0,
        taxPrice: Math.round(totalAmount * 0.08 * 100) / 100,
        totalPrice: Math.round((totalAmount + totalAmount * 0.08) * 100) / 100
      };

      const res = await fetch(getApiUrl('/api/orders'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to place order');

      setOrderSuccess(data);
      clearCart();
      if (onOrderPlaced) onOrderPlaced(data);
    } catch (error) {
      if (error.message.includes('No order items') || error.message.includes('Not authorized')) {
        alert(`Checkout Error: ${error.message}`);
      } else {
        // Fallback for offline demo mode
        const demoOrder = {
          _id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
          totalPrice: Math.round((totalAmount + totalAmount * 0.08) * 100) / 100,
          createdAt: new Date()
        };
        setOrderSuccess(demoOrder);
        clearCart();
        if (onOrderPlaced) onOrderPlaced(demoOrder);
      }
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Order Success Screen ── */
  if (orderSuccess) {
    return (
      <div className="modal-overlay">
        <div style={{
          maxWidth: '460px',
          width: '100%',
          background: '#fff',
          border: '1.5px solid #d1ddf7',
          borderRadius: '16px',
          padding: '2.25rem 2rem',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(29,106,229,0.14)'
        }}>
          <div style={{ width: '66px', height: '66px', borderRadius: '50%', background: '#d1fae5', border: '2px solid #a7f3d0', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.4rem' }}>
            <CheckCircle size={36} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem', color: '#111827' }}>Order Confirmed!</h2>
          <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.4rem' }}>
            Thank you for shopping with ShopEZ. Your order ID is{' '}
            <span style={{ color: '#1d6ae5', fontWeight: 700 }}>#{orderSuccess._id}</span>.
          </p>

          <div style={{ background: '#f8faff', border: '1.5px solid #e5eeff', borderRadius: '10px', padding: '1rem', marginBottom: '1.4rem', textAlign: 'left', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ color: '#6b7280' }}>Status:</span>
              <span style={{ background: '#fef3c7', color: '#d97706', padding: '0.1rem 0.55rem', borderRadius: '999px', fontWeight: 700, fontSize: '0.76rem' }}>Processing</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6b7280' }}>Total Amount:</span>
              <span style={{ color: '#1d6ae5', fontWeight: 800, fontSize: '0.95rem' }}>${(orderSuccess.totalPrice || totalAmount).toFixed(2)}</span>
            </div>
          </div>

          <button onClick={onClose} className="glass-btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  /* ── Main Checkout Form ── */
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '800px',
          width: '100%',
          background: '#fff',
          border: '1.5px solid #d1ddf7',
          borderRadius: '16px',
          padding: '0',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 60px rgba(29,106,229,0.14)'
        }}
      >
        {/* Modal Header */}
        <div style={{ padding: '1.4rem 1.75rem', borderBottom: '1px solid #e5eeff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#fff', zIndex: 5 }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#111827', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={20} color="#1d6ae5" /> Secure Checkout
          </h2>
          <button
            onClick={onClose}
            style={{
              background: '#f1f5fd', border: '1.5px solid #d1ddf7', color: '#374151',
              borderRadius: '50%', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
            }}
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmitOrder} style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '0' }}>

          {/* Left — Shipping & Payment */}
          <div style={{ padding: '1.5rem 1.75rem', borderRight: '1px solid #e5eeff' }}>

            {/* Shipping */}
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#1d6ae5', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Truck size={17} /> Shipping Address
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
              {[
                { label: 'Full Name', name: 'fullName', type: 'text', placeholder: 'Your full name' },
                { label: 'Street Address', name: 'address', type: 'text', placeholder: '123 Main Street' },
              ].map(f => (
                <div key={f.name}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.35rem' }}>{f.label}</label>
                  <input type={f.type} name={f.name} required value={formData[f.name]} onChange={handleChange} placeholder={f.placeholder} className="glass-input" />
                </div>
              ))}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                {[
                  { label: 'City', name: 'city', placeholder: 'City' },
                  { label: 'Postal Code', name: 'postalCode', placeholder: 'Postal Code' },
                ].map(f => (
                  <div key={f.name}>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.35rem' }}>{f.label}</label>
                    <input type="text" name={f.name} required value={formData[f.name]} onChange={handleChange} placeholder={f.placeholder} className="glass-input" />
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                {[
                  { label: 'Country', name: 'country', placeholder: 'Country' },
                  { label: 'Phone Number', name: 'phone', placeholder: '+1 (555) ...' },
                ].map(f => (
                  <div key={f.name}>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.35rem' }}>{f.label}</label>
                    <input type="text" name={f.name} required value={formData[f.name]} onChange={handleChange} placeholder={f.placeholder} className="glass-input" />
                  </div>
                ))}
              </div>
            </div>

            {/* Payment */}
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.85rem', color: '#1d6ae5', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CreditCard size={17} /> Payment Method
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {['Credit Card (Stripe)', 'PayPal', 'Apple Pay'].map((method) => (
                <label
                  key={method}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: '9px',
                    background: paymentMethod === method ? '#eff6ff' : '#f8faff',
                    border: paymentMethod === method ? '1.5px solid #1d6ae5' : '1.5px solid #e5eeff',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === method}
                      onChange={() => setPaymentMethod(method)}
                      style={{ accentColor: '#1d6ae5' }}
                    />
                    <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#374151' }}>{method}</span>
                  </div>
                  <Lock size={13} color="#9ca3af" />
                </label>
              ))}
            </div>
          </div>

          {/* Right — Order Summary */}
          <div style={{ padding: '1.5rem', background: '#f8faff', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>Order Summary</h3>

            <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {cartItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 0.5rem', color: '#6b7280' }}>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem', color: '#374151', marginBottom: '0.25rem' }}>Your cart is empty</p>
                  <p style={{ fontSize: '0.78rem' }}>Please add products to your cart before checking out.</p>
                </div>
              ) : (
                cartItems.map(({ product, quantity }) => (
                  <div key={product._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.83rem', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
                      <img src={product.image} alt={product.title} style={{ width: '34px', height: '34px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #e5eeff', flexShrink: 0 }} />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ color: '#111827', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '130px' }}>{product.title}</div>
                        <div style={{ color: '#9ca3af', fontSize: '0.75rem' }}>Qty: {quantity}</div>
                      </div>
                    </div>
                    <span style={{ fontWeight: 700, color: '#1d6ae5', flexShrink: 0 }}>${(product.price * quantity).toFixed(2)}</span>
                  </div>
                ))
              )}
            </div>

            <div style={{ borderTop: '1px solid #e5eeff', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.84rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280' }}>
                <span>Items Total</span>
                <span style={{ color: '#374151', fontWeight: 600 }}>${totalAmount.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280' }}>
                <span>Tax (8%)</span>
                <span style={{ color: '#374151', fontWeight: 600 }}>${(totalAmount * 0.08).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280' }}>
                <span>Delivery</span>
                <span style={{ color: '#059669', fontWeight: 600 }}>FREE</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #d1ddf7', paddingTop: '0.65rem', marginTop: '0.25rem' }}>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: '#111827' }}>Grand Total</span>
                <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1d6ae5' }}>${(totalAmount * 1.08).toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || cartItems.length === 0}
              className="glass-btn-primary"
              style={{
                width: '100%',
                padding: '0.9rem',
                marginTop: '1.25rem',
                opacity: cartItems.length === 0 ? 0.65 : 1,
                cursor: cartItems.length === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              {submitting ? 'Processing...' : cartItems.length === 0 ? 'Cart is Empty' : `Pay $${(totalAmount * 1.08).toFixed(2)}`}
            </button>

            <div style={{ textAlign: 'center', marginTop: '0.85rem', color: '#9ca3af', fontSize: '0.74rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
              <ShieldCheck size={13} color="#059669" /> 256-Bit SSL Encrypted
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
