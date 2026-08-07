import React from 'react';
import { ArrowRight, ShieldCheck, Truck, Tag } from 'lucide-react';

export default function HeroBanner({ onShopNowClick }) {
  return (
    <div
      style={{
        margin: '2rem 0',
        padding: '3rem 2.5rem',
        borderRadius: '16px',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #1d6ae5 0%, #2563eb 60%, #1e40af 100%)',
        border: '1px solid #1557c7'
      }}
    >
      {/* Subtle decorative circle */}
      <div style={{
        position: 'absolute',
        top: '-60px',
        right: '-60px',
        width: '280px',
        height: '280px',
        background: 'rgba(255,255,255,0.07)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-80px',
        left: '40%',
        width: '220px',
        height: '220px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        {/* Left Content */}
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'rgba(255,255,255,0.18)',
            border: '1px solid rgba(255,255,255,0.3)',
            color: '#fff',
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            fontSize: '0.74rem',
            fontWeight: 700,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            marginBottom: '1.2rem'
          }}>
            <Tag size={12} /> Curated Shopping Experience
          </div>

          <h2 style={{ fontSize: '2.6rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '1rem', color: '#fff', letterSpacing: '-0.5px' }}>
            Shop Smarter with <span style={{ color: '#bfdbfe' }}>ShopEZ</span>
          </h2>

          <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: '1rem', lineHeight: 1.65, marginBottom: '1.8rem', maxWidth: '520px' }}>
            Discover top-rated electronics, fashion, home essentials, and more — all in one place with fast delivery and easy returns.
          </p>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={onShopNowClick}
              style={{
                background: '#fff',
                color: '#1d6ae5',
                border: 'none',
                borderRadius: '9px',
                padding: '0.85rem 1.8rem',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                transition: 'box-shadow 0.18s ease, transform 0.14s ease',
                fontFamily: 'Inter, sans-serif'
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 22px rgba(0,0,0,0.22)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Shop Now <ArrowRight size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'rgba(255,255,255,0.85)', fontSize: '0.84rem', fontWeight: 500 }}>
                <Truck size={15} color="#bfdbfe" /> Free Delivery
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'rgba(255,255,255,0.85)', fontSize: '0.84rem', fontWeight: 500 }}>
                <ShieldCheck size={15} color="#bfdbfe" /> 2-Year Warranty
              </div>
            </div>
          </div>
        </div>

        {/* Right — Featured Product Card */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
          <div style={{
            width: '100%',
            maxWidth: '340px',
            height: '250px',
            borderRadius: '14px',
            overflow: 'hidden',
            position: 'relative',
            boxShadow: '0 16px 40px rgba(0,0,0,0.28)',
            border: '2px solid rgba(255,255,255,0.25)'
          }}>
            <img
              src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80"
              alt="Quantum Neo Headphones"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80';
              }}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute',
              bottom: 0,
              inset: 'auto 0 0 0',
              background: 'linear-gradient(to top, rgba(10,15,40,0.88), transparent)',
              padding: '1rem 1.1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end'
            }}>
              <div>
                <span style={{ display: 'inline-block', background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '0.1rem 0.5rem', borderRadius: '999px', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.2rem' }}>Featured</span>
                <h4 style={{ fontSize: '0.95rem', color: '#fff', fontWeight: 700 }}>Quantum Neo Headphones</h4>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#bfdbfe' }}>$249.99</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
