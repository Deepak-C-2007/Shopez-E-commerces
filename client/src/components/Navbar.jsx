import React, { useState } from 'react';
import { ShoppingBag, Search, User, ShieldCheck, LogOut, ShoppingCart, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar({ onOpenAuth, currentTab, setCurrentTab, searchQuery, setSearchQuery, isAdminMode }) {
  const { user, isAdmin, logout } = useAuth();
  const { totalCount, setIsCartOpen } = useCart();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="glass-nav">
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '68px' }}>

        {/* Brand Logo */}
        <div
          onClick={() => setCurrentTab('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', flexShrink: 0 }}
        >
          <div style={{
            background: '#1d6ae5',
            padding: '0.5rem',
            borderRadius: '10px',
            display: 'flex',
            boxShadow: '0 2px 8px rgba(29,106,229,0.25)'
          }}>
            <ShoppingBag size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111827', lineHeight: 1 }}>
              Shop<span style={{ color: '#1d6ae5' }}>EZ</span>
            </h1>
            <span style={{ fontSize: '0.62rem', color: '#6b7280', letterSpacing: '1px', textTransform: 'uppercase' }}>
              {isAdminMode ? 'Admin Console' : 'Effortless Shopping'}
            </span>
          </div>
        </div>

        {/* Search Bar — hidden in admin mode */}
        {!isAdminMode && (
          <div style={{ flex: '0 1 400px', position: 'relative' }}>
            <Search size={17} color="#9ca3af" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              type="text"
              placeholder="Search products, brands, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input"
              style={{ paddingLeft: '2.6rem', borderRadius: '9999px', fontSize: '0.87rem', background: '#f1f5fd' }}
            />
          </div>
        )}

        {/* Admin mode breadcrumb */}
        {isAdminMode && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.84rem' }}>
            <LayoutDashboard size={15} color="#1d6ae5" />
            <span>Admin Dashboard</span>
            <span style={{ color: '#d1ddf7' }}>·</span>
            <button
              onClick={() => setCurrentTab('home')}
              style={{ background: 'none', border: 'none', color: '#1d6ae5', cursor: 'pointer', fontSize: '0.84rem', fontWeight: 600, padding: 0 }}
            >
              ← Back to Store
            </button>
          </div>
        )}

        {/* Navigation Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>

          {/* Catalog link — hidden in admin mode */}
          {!isAdminMode && (
            <button
              onClick={() => setCurrentTab('home')}
              style={{
                background: 'none',
                border: 'none',
                color: currentTab === 'home' ? '#1d6ae5' : '#6b7280',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '0.9rem',
                padding: '0.4rem 0.6rem',
                borderRadius: '6px',
                transition: 'color 0.15s ease'
              }}
            >
              Catalog
            </button>
          )}

          {/* Admin Portal button */}
          {isAdmin && (
            <button
              onClick={() => setCurrentTab('admin')}
              style={{
                background: currentTab === 'admin' ? '#1d6ae5' : '#e8f0fe',
                border: '1.5px solid #b3cdf7',
                color: currentTab === 'admin' ? '#fff' : '#1d6ae5',
                padding: '0.45rem 0.9rem',
                borderRadius: '9999px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.83rem',
                transition: 'all 0.15s ease'
              }}
            >
              <ShieldCheck size={15} /> Admin Portal
            </button>
          )}

          {/* Cart Button — completely hidden in admin mode */}
          {!isAdminMode && (
            <button
              onClick={() => setIsCartOpen(true)}
              style={{
                position: 'relative',
                background: '#f1f5fd',
                border: '1.5px solid #d1ddf7',
                color: '#374151',
                padding: '0.45rem 0.9rem',
                borderRadius: '9999px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.87rem',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#1d6ae5'; e.currentTarget.style.color = '#1d6ae5'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#d1ddf7'; e.currentTarget.style.color = '#374151'; }}
            >
              <ShoppingCart size={18} color="#1d6ae5" />
              <span>Cart</span>
              {totalCount > 0 && (
                <span className="badge-glow" style={{ position: 'absolute', top: '-5px', right: '-5px', fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                  {totalCount}
                </span>
              )}
            </button>
          )}

          {/* Auth / User Dropdown */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                style={{
                  background: '#f1f5fd',
                  border: '1.5px solid #d1ddf7',
                  padding: '0.35rem 0.75rem 0.35rem 0.45rem',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.15s ease'
                }}
              >
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={user.name}
                  style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #b3cdf7' }}
                />
                <span style={{ fontSize: '0.87rem', fontWeight: 600, color: '#374151' }}>{user.name.split(' ')[0]}</span>
              </button>

              {showDropdown && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '210px',
                    background: '#fff',
                    border: '1.5px solid #d1ddf7',
                    borderRadius: '12px',
                    boxShadow: '0 8px 24px rgba(29,106,229,0.12)',
                    padding: '0.4rem',
                    zIndex: 200,
                    animation: 'fadeIn 0.15s ease'
                  }}
                >
                  {/* My Profile — shown only outside admin */}
                  {!isAdminMode && (
                    <button
                      onClick={() => { setCurrentTab('profile'); setShowDropdown(false); }}
                      style={{ width: '100%', textAlign: 'left', padding: '0.65rem 0.9rem', background: 'none', border: 'none', color: '#374151', cursor: 'pointer', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.55rem', fontSize: '0.88rem', fontWeight: 600 }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f1f5fd'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                      <User size={15} color="#1d6ae5" /> My Profile & Orders
                    </button>
                  )}

                  {isAdmin && (
                    <button
                      onClick={() => { setCurrentTab('admin'); setShowDropdown(false); }}
                      style={{ width: '100%', textAlign: 'left', padding: '0.65rem 0.9rem', background: 'none', border: 'none', color: '#374151', cursor: 'pointer', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.55rem', fontSize: '0.88rem', fontWeight: 600 }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f1f5fd'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                      <ShieldCheck size={15} color="#1d6ae5" /> Admin Dashboard
                    </button>
                  )}

                  <div style={{ height: '1px', background: '#e5eeff', margin: '0.35rem 0.5rem' }} />

                  <button
                    onClick={() => { logout(); setShowDropdown(false); }}
                    style={{ width: '100%', textAlign: 'left', padding: '0.65rem 0.9rem', background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.55rem', fontSize: '0.88rem', fontWeight: 600 }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fee2e2'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="glass-btn-primary"
              style={{ padding: '0.5rem 1.1rem', borderRadius: '9999px', fontSize: '0.88rem' }}
            >
              <User size={16} /> Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
