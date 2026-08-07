import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';

function AppContent() {
  const [currentTab, setCurrentTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const { user } = useAuth();
  const { addToCart } = useCart();

  const handleQuickBuy = (product) => {
    if (product) {
      addToCart(product, 1);
    }
    if (!user) {
      setShowAuthModal(true);
    } else {
      setShowCheckoutModal(true);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8faff' }}>

      {/* Navbar */}
      <Navbar
        onOpenAuth={() => setShowAuthModal(true)}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isAdminMode={currentTab === 'admin'}
      />

      {/* Main Content */}
      <main style={{ flex: 1 }}>
        {currentTab === 'home' && (
          <HomePage
            searchQuery={searchQuery}
            onQuickBuy={handleQuickBuy}
            onOpenAdmin={() => setCurrentTab('admin')}
          />
        )}

        {currentTab === 'profile' && (
          <ProfilePage />
        )}

        {currentTab === 'admin' && (
          <AdminDashboard />
        )}
      </main>

      {/* Cart Drawer — hidden in admin mode */}
      {currentTab !== 'admin' && (
        <CartDrawer
          onProceedToCheckout={() => {
            if (!user) {
              setShowAuthModal(true);
            } else {
              setShowCheckoutModal(true);
            }
          }}
        />
      )}

      {/* Checkout Modal — hidden in admin mode */}
      {showCheckoutModal && currentTab !== 'admin' && (
        <CheckoutModal
          onClose={() => setShowCheckoutModal(false)}
          onOrderPlaced={() => {
            setCurrentTab('profile');
          }}
        />
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="modal-overlay" onClick={() => setShowAuthModal(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: '440px' }}>
            <AuthPage onSuccess={() => setShowAuthModal(false)} />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{ background: '#fff', borderTop: '1px solid #e5eeff', padding: '1.5rem 0', marginTop: 'auto' }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
          <p style={{ color: '#6b7280', fontSize: '0.84rem' }}>
            © 2026 <strong style={{ color: '#111827' }}>ShopEZ Inc.</strong> — Professional E-Commerce Platform. All rights reserved.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', fontSize: '0.78rem', color: '#9ca3af' }}>
            <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
            <span style={{ cursor: 'pointer' }}>Terms of Service</span>
            <span style={{ cursor: 'pointer' }}>Support & Helpdesk</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
