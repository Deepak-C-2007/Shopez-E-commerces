import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck, Package, Users, DollarSign, Plus, Trash2, Edit3, X,
  Eye, RefreshCw, BarChart2, TrendingUp, CheckCircle, Clock, AlertCircle,
  LayoutGrid, List
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { getApiUrl } from '../config/api';

/* ── Table styles ── */
const TH = { padding: '0.7rem 1rem', fontWeight: 700, fontSize: '0.78rem', color: '#6b7280', background: '#f8faff', textAlign: 'left', borderBottom: '1.5px solid #e5eeff', whiteSpace: 'nowrap' };
const TD = { padding: '0.75rem 1rem', fontSize: '0.86rem', color: '#374151', verticalAlign: 'middle', borderBottom: '1px solid #f0f4ff' };

/* ── Status badge ── */
function StatusBadge({ status }) {
  const map = {
    Delivered:  { bg: '#d1fae5', color: '#059669', border: '#a7f3d0', icon: <CheckCircle size={11} /> },
    Shipped:    { bg: '#dbeafe', color: '#1d6ae5', border: '#bfdbfe', icon: <TrendingUp size={11} /> },
    Processing: { bg: '#fef3c7', color: '#d97706', border: '#fde68a', icon: <Clock size={11} /> },
    Cancelled:  { bg: '#fee2e2', color: '#dc2626', border: '#fca5a5', icon: <AlertCircle size={11} /> },
  };
  const s = map[status] || map.Processing;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.2rem 0.65rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
      {s.icon} {status || 'Processing'}
    </span>
  );
}

const BLANK_FORM = {
  title: '', description: '', price: '', originalPrice: '',
  category: 'Electronics', image: '', countInStock: '15', isFeatured: false
};

const CATEGORIES = ['Electronics', 'Gaming', 'Fashion', 'Home & Living', 'Beauty & Wellness', 'Sports & Fitness'];

export default function AdminDashboard() {
  const { user, token, isAdmin } = useAuth();

  const [activeTab, setActiveTab]         = useState('products');
  const [productsView, setProductsView]   = useState('grid'); // 'grid' | 'table'
  const [products, setProducts]           = useState([]);
  const [orders, setOrders]               = useState([]);
  const [usersList, setUsersList]         = useState([]);
  const [loading, setLoading]             = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editProduct, setEditProduct]     = useState(null);
  const [viewProduct, setViewProduct]     = useState(null);
  const [formData, setFormData]           = useState(BLANK_FORM);

  useEffect(() => {
    if (token && isAdmin) loadAdminData();
  }, [token, isAdmin]);

  /* ── Data fetching ── */
  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [prodRes, ordRes, userRes] = await Promise.all([
        fetch(getApiUrl('/api/products')),
        fetch(getApiUrl('/api/orders'),      { headers: { Authorization: `Bearer ${token}` } }),
        fetch(getApiUrl('/api/users/users'), { headers: { Authorization: `Bearer ${token}` } })
      ]);
      if (prodRes.ok) setProducts(await prodRes.json());
      if (ordRes.ok)  setOrders(await ordRes.json());
      if (userRes.ok) setUsersList(await userRes.json());
    } catch {
      console.warn('Admin data fetch error — demo mode');
    } finally {
      setLoading(false);
    }
  };

  /* ── Product CRUD ── */
  const openAdd = () => {
    setEditProduct(null);
    setFormData(BLANK_FORM);
    setShowFormModal(true);
  };

  const openEdit = (p) => {
    setEditProduct(p);
    setFormData({
      title: p.title, description: p.description,
      price: p.price.toString(), originalPrice: (p.originalPrice || p.price).toString(),
      category: p.category, image: p.image,
      countInStock: p.countInStock.toString(), isFeatured: p.isFeatured || false
    });
    setShowFormModal(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const url    = editProduct ? `/api/products/${editProduct._id}` : '/api/products';
      const method = editProduct ? 'PUT' : 'POST';
      const res = await fetch(getApiUrl(url), {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Operation failed');
      setShowFormModal(false);
      setEditProduct(null);
      loadAdminData();
    } catch (err) {
      alert(`Save error: ${err.message}`);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return;
    try {
      const res = await fetch(getApiUrl(`/api/products/${id}`), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setProducts(prev => prev.filter(p => p._id !== id));
      else alert('Failed to delete product');
    } catch (err) {
      alert('Delete error: ' + err.message);
    }
  };

  /* ── Order management ── */
  const handleOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(getApiUrl(`/api/orders/${orderId}/status`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ orderStatus: newStatus })
      });
      if (res.ok) setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
    } catch (err) {
      alert('Status update error: ' + err.message);
    }
  };

  /* ── User management ── */
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Remove this user account?')) return;
    try {
      const res = await fetch(getApiUrl(`/api/users/users/${userId}`), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setUsersList(prev => prev.filter(u => u._id !== userId));
      else alert((await res.json()).message);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleRole = async (userId) => {
    try {
      const res = await fetch(getApiUrl(`/api/users/users/${userId}/role`), {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsersList(prev => prev.map(u => u._id === userId ? { ...u, role: data.user.role } : u));
      }
    } catch (err) {
      alert(err.message);
    }
  };

  /* ── Access guard ── */
  if (!isAdmin) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <div style={{ maxWidth: '480px', margin: '0 auto', background: '#fff', border: '1.5px solid #fca5a5', borderRadius: '14px', padding: '3rem', boxShadow: '0 4px 16px rgba(220,38,38,0.08)' }}>
          <ShieldCheck size={46} color="#dc2626" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.5rem', color: '#111827', marginBottom: '0.5rem' }}>Access Restricted</h2>
          <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
            You must be logged in as an Administrator to view this panel.
          </p>
        </div>
      </div>
    );
  }

  const totalRevenue   = orders.reduce((s, o) => s + (o.totalPrice || 0), 0);
  const pendingCount   = orders.filter(o => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled').length;

  /* ── Tab button ── */
  const Tab = ({ id, label, count }) => (
    <button
      onClick={() => setActiveTab(id)}
      style={{
        background: 'none', border: 'none', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
        padding: '0.65rem 0.6rem',
        color: activeTab === id ? '#1d6ae5' : '#6b7280',
        borderBottom: activeTab === id ? '2.5px solid #1d6ae5' : '2.5px solid transparent',
        transition: 'all 0.15s ease', fontFamily: 'Inter, sans-serif',
        display: 'flex', alignItems: 'center', gap: '0.4rem'
      }}
    >
      {label}
      <span style={{ fontSize: '0.74rem', fontWeight: 600, background: activeTab === id ? '#eff6ff' : '#f3f4f6', color: activeTab === id ? '#1d6ae5' : '#9ca3af', padding: '0.05rem 0.45rem', borderRadius: '999px' }}>
        {count}
      </span>
    </button>
  );

  return (
    <div className="container" style={{ padding: '2rem 0 4rem' }}>

      {/* ── Page Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
            <ShieldCheck size={22} color="#1d6ae5" />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827' }}>Admin Dashboard</h2>
          </div>
          <p style={{ color: '#6b7280', fontSize: '0.84rem' }}>
            Welcome back, <strong style={{ color: '#111827' }}>{user.name}</strong> · {user.email}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button
            onClick={loadAdminData}
            style={{ background: '#f1f5fd', border: '1.5px solid #d1ddf7', color: '#374151', padding: '0.55rem 0.9rem', borderRadius: '9px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, fontSize: '0.84rem', fontFamily: 'Inter, sans-serif' }}
          >
            <RefreshCw size={15} /> Refresh
          </button>
          <button onClick={openAdd} className="glass-btn-primary" style={{ borderRadius: '9px', padding: '0.55rem 1.1rem', fontSize: '0.88rem' }}>
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      {/* ── Metric Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(185px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
        {[
          { label: 'Total Revenue',    value: `$${totalRevenue.toFixed(2)}`, icon: <DollarSign size={18} />, color: '#059669', bg: '#d1fae5', border: '#a7f3d0' },
          { label: 'Total Orders',     value: orders.length,                  icon: <Package size={18} />,    color: '#1d6ae5', bg: '#dbeafe', border: '#bfdbfe' },
          { label: 'Pending Orders',   value: pendingCount,                   icon: <Clock size={18} />,      color: '#d97706', bg: '#fef3c7', border: '#fde68a' },
          { label: 'Products Listed',  value: products.length,                icon: <BarChart2 size={18} />,  color: '#7c3aed', bg: '#ede9fe', border: '#c4b5fd' },
          { label: 'Registered Users', value: usersList.length,               icon: <Users size={18} />,     color: '#0891b2', bg: '#e0f2fe', border: '#7dd3fc' },
        ].map(m => (
          <div key={m.label} style={{ background: '#fff', border: `1.5px solid ${m.border}`, borderRadius: '12px', padding: '1.1rem 1.2rem', boxShadow: '0 1px 6px rgba(29,106,229,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.65rem' }}>
              <span style={{ fontSize: '0.77rem', fontWeight: 600, color: '#6b7280' }}>{m.label}</span>
              <div style={{ background: m.bg, padding: '0.3rem', borderRadius: '7px', color: m.color, display: 'flex' }}>{m.icon}</div>
            </div>
            <div style={{ fontSize: '1.7rem', fontWeight: 800, color: m.color, lineHeight: 1 }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: 'flex', gap: '0.25rem', borderBottom: '1.5px solid #e5eeff', marginBottom: '1.5rem' }}>
        <Tab id="products" label="Manage Products" count={products.length} />
        <Tab id="orders"   label="Orders"          count={orders.length} />
        <Tab id="users"    label="Users"           count={usersList.length} />
      </div>

      {/* ═══════════════════════════════════════
          PRODUCTS TAB
          ═══════════════════════════════════════ */}
      {activeTab === 'products' && (
        <>
          {/* View toggle: Grid / Table */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.1rem' }}>
            <p style={{ color: '#6b7280', fontSize: '0.84rem' }}>
              {products.length} products in catalog — click <strong>Edit</strong> or <strong>Delete</strong> to manage
            </p>
            <div style={{ display: 'flex', border: '1.5px solid #d1ddf7', borderRadius: '9px', overflow: 'hidden' }}>
              <button
                onClick={() => setProductsView('grid')}
                title="Card Grid View"
                style={{ padding: '0.4rem 0.75rem', background: productsView === 'grid' ? '#1d6ae5' : '#fff', color: productsView === 'grid' ? '#fff' : '#6b7280', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600, fontSize: '0.8rem', fontFamily: 'Inter, sans-serif', borderRight: '1px solid #d1ddf7' }}
              >
                <LayoutGrid size={14} /> Grid
              </button>
              <button
                onClick={() => setProductsView('table')}
                title="Table View"
                style={{ padding: '0.4rem 0.75rem', background: productsView === 'table' ? '#1d6ae5' : '#fff', color: productsView === 'table' ? '#fff' : '#6b7280', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600, fontSize: '0.8rem', fontFamily: 'Inter, sans-serif' }}
              >
                <List size={14} /> Table
              </button>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>
              <RefreshCw size={28} color="#1d6ae5" className="spin" style={{ margin: '0 auto 0.75rem', display: 'block' }} />
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', background: '#fff', border: '1.5px solid #e5eeff', borderRadius: '12px', color: '#6b7280' }}>
              <Package size={40} color="#d1ddf7" style={{ margin: '0 auto 0.75rem' }} />
              <p>No products yet. Click <strong>Add Product</strong> to get started.</p>
            </div>
          ) : productsView === 'grid' ? (
            /* ── CARD GRID with adminMode ── */
            <div className="grid-products">
              {products.map(p => (
                <ProductCard
                  key={p._id}
                  product={p}
                  adminMode={true}
                  onViewDetails={(prod) => setViewProduct(prod)}
                  onAdminEdit={(prod) => openEdit(prod)}
                  onAdminDelete={(id) => handleDeleteProduct(id)}
                />
              ))}
            </div>
          ) : (
            /* ── TABLE VIEW ── */
            <div style={{ background: '#fff', border: '1.5px solid #d1ddf7', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(29,106,229,0.05)' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={TH}>Product</th>
                      <th style={TH}>Category</th>
                      <th style={TH}>Price</th>
                      <th style={TH}>Stock</th>
                      <th style={{ ...TH, textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p._id}
                        onMouseEnter={e => e.currentTarget.style.background = '#fafbff'}
                        onMouseLeave={e => e.currentTarget.style.background = ''}
                      >
                        <td style={{ ...TD, display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <img src={p.image} alt={p.title}
                            style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover', border: '1.5px solid #e5eeff', flexShrink: 0 }}
                            onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=60'; }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.88rem', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                            <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>ID: {p._id}</div>
                          </div>
                        </td>
                        <td style={TD}><span className="glass-pill">{p.category}</span></td>
                        <td style={TD}>
                          <div style={{ fontWeight: 700, color: '#1d6ae5' }}>${p.price.toFixed(2)}</div>
                          {p.originalPrice > p.price && <div style={{ fontSize: '0.74rem', color: '#9ca3af', textDecoration: 'line-through' }}>${p.originalPrice.toFixed(2)}</div>}
                        </td>
                        <td style={TD}>
                          <span style={{ fontWeight: 600, color: p.countInStock < 5 ? '#dc2626' : p.countInStock < 10 ? '#d97706' : '#059669' }}>
                            {p.countInStock} units
                          </span>
                        </td>
                        <td style={{ ...TD, textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
                            <button onClick={() => setViewProduct(p)} title="View" style={{ background: '#f8faff', border: '1.5px solid #e5eeff', color: '#6b7280', cursor: 'pointer', borderRadius: '7px', padding: '0.35rem 0.55rem', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.78rem', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>
                              <Eye size={13} /> View
                            </button>
                            <button onClick={() => openEdit(p)} title="Edit" style={{ background: '#eff6ff', border: '1.5px solid #bfdbfe', color: '#1d6ae5', cursor: 'pointer', borderRadius: '7px', padding: '0.35rem 0.55rem', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.78rem', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>
                              <Edit3 size={13} /> Edit
                            </button>
                            <button onClick={() => handleDeleteProduct(p._id)} title="Delete" style={{ background: '#fee2e2', border: '1.5px solid #fca5a5', color: '#dc2626', cursor: 'pointer', borderRadius: '7px', padding: '0.35rem 0.55rem', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.78rem', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>
                              <Trash2 size={13} /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* ═══════════════════════════════════════
          ORDERS TAB
          ═══════════════════════════════════════ */}
      {activeTab === 'orders' && (
        <div style={{ background: '#fff', border: '1.5px solid #d1ddf7', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(29,106,229,0.05)' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
              <RefreshCw size={28} color="#1d6ae5" className="spin" style={{ margin: '0 auto 0.75rem', display: 'block' }} />Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
              <Package size={36} color="#d1ddf7" style={{ margin: '0 auto 0.75rem' }} /><p>No orders found.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={TH}>Order ID</th>
                    <th style={TH}>Customer</th>
                    <th style={TH}>Items</th>
                    <th style={TH}>Date</th>
                    <th style={TH}>Total</th>
                    <th style={TH}>Status</th>
                    <th style={{ ...TH, textAlign: 'center' }}>Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o._id}
                      onMouseEnter={e => e.currentTarget.style.background = '#fafbff'}
                      onMouseLeave={e => e.currentTarget.style.background = ''}
                    >
                      <td style={{ ...TD, fontWeight: 700, color: '#1d6ae5', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                        #{String(o._id).slice(-8).toUpperCase()}
                      </td>
                      <td style={TD}>{o.user?.name || o.shippingAddress?.fullName || 'Customer'}</td>
                      <td style={{ ...TD, color: '#6b7280' }}>{(o.orderItems || []).length} item(s)</td>
                      <td style={{ ...TD, color: '#9ca3af', fontSize: '0.82rem' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                      <td style={{ ...TD, fontWeight: 700, color: '#111827' }}>${(o.totalPrice || 0).toFixed(2)}</td>
                      <td style={TD}><StatusBadge status={o.orderStatus} /></td>
                      <td style={{ ...TD, textAlign: 'center' }}>
                        <select
                          value={o.orderStatus || 'Processing'}
                          onChange={e => handleOrderStatus(o._id, e.target.value)}
                          style={{ padding: '0.3rem 0.6rem', border: '1.5px solid #d1ddf7', borderRadius: '7px', fontSize: '0.8rem', background: '#fff', color: '#374151', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════
          USERS TAB
          ═══════════════════════════════════════ */}
      {activeTab === 'users' && (
        <div style={{ background: '#fff', border: '1.5px solid #d1ddf7', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(29,106,229,0.05)' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
              <RefreshCw size={28} color="#1d6ae5" className="spin" style={{ margin: '0 auto 0.75rem', display: 'block' }} />Loading users...
            </div>
          ) : usersList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
              <Users size={36} color="#d1ddf7" style={{ margin: '0 auto 0.75rem' }} /><p>No users found.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={TH}>User</th>
                    <th style={TH}>Email</th>
                    <th style={TH}>Role</th>
                    <th style={{ ...TH, textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map(u => (
                    <tr key={u._id}
                      onMouseEnter={e => e.currentTarget.style.background = '#fafbff'}
                      onMouseLeave={e => e.currentTarget.style.background = ''}
                    >
                      <td style={{ ...TD, display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <img
                          src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                          alt={u.name}
                          style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #e5eeff', flexShrink: 0 }}
                        />
                        <span style={{ fontWeight: 600, color: '#111827' }}>{u.name}</span>
                      </td>
                      <td style={{ ...TD, color: '#6b7280' }}>{u.email}</td>
                      <td style={TD}>
                        <span style={{
                          display: 'inline-block', padding: '0.2rem 0.65rem', borderRadius: '999px',
                          fontSize: '0.75rem', fontWeight: 700,
                          background: u.role === 'admin' ? '#eff6ff' : '#f3f4f6',
                          color:      u.role === 'admin' ? '#1d6ae5' : '#6b7280',
                          border:    `1px solid ${u.role === 'admin' ? '#bfdbfe' : '#d1d5db'}`
                        }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ ...TD, textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
                          <button onClick={() => handleToggleRole(u._id)}
                            style={{ background: '#f1f5fd', border: '1.5px solid #d1ddf7', color: '#374151', padding: '0.3rem 0.7rem', borderRadius: '7px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>
                            Toggle Role
                          </button>
                          <button onClick={() => handleDeleteUser(u._id)}
                            style={{ background: '#fee2e2', border: '1.5px solid #fca5a5', color: '#dc2626', padding: '0.3rem 0.55rem', borderRadius: '7px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.78rem', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>
                            <Trash2 size={13} /> Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════
          ADD / EDIT PRODUCT MODAL
          ═══════════════════════════════════════════════════ */}
      {showFormModal && (
        <div className="modal-overlay" onClick={() => setShowFormModal(false)}>
          <div
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: '560px', width: '100%', background: '#fff', border: '1.5px solid #d1ddf7', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(29,106,229,0.14)' }}
          >
            {/* Header */}
            <div style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid #e5eeff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8faff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {editProduct ? <Edit3 size={18} color="#1d6ae5" /> : <Plus size={18} color="#1d6ae5" />}
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827' }}>
                  {editProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
              </div>
              <button onClick={() => setShowFormModal(false)}
                style={{ background: '#fff', border: '1.5px solid #d1ddf7', color: '#374151', cursor: 'pointer', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveProduct} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.35rem' }}>Product Title *</label>
                <input type="text" required placeholder="e.g. Wireless Noise-Cancelling Headphones" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="glass-input" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.35rem' }}>Price ($) *</label>
                  <input type="number" step="0.01" min="0" required value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="glass-input" placeholder="0.00" />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.35rem' }}>Original Price ($)</label>
                  <input type="number" step="0.01" min="0" value={formData.originalPrice} onChange={e => setFormData({ ...formData, originalPrice: e.target.value })} className="glass-input" placeholder="0.00" />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.35rem' }}>Stock Units *</label>
                  <input type="number" min="0" required value={formData.countInStock} onChange={e => setFormData({ ...formData, countInStock: e.target.value })} className="glass-input" placeholder="0" />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.35rem' }}>Category *</label>
                <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="glass-input">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.35rem' }}>Image URL *</label>
                <input type="url" required placeholder="https://images.unsplash.com/..." value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} className="glass-input" />
                {formData.image && (
                  <img src={formData.image} alt="Preview"
                    style={{ marginTop: '0.5rem', width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '1.5px solid #e5eeff' }}
                    onError={e => { e.currentTarget.style.display = 'none'; }} />
                )}
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.35rem' }}>Description *</label>
                <textarea required rows={3} placeholder="Describe this product..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="glass-input" style={{ resize: 'vertical' }} />
              </div>

              <div style={{ display: 'flex', gap: '0.65rem', paddingTop: '0.25rem' }}>
                <button type="button" onClick={() => setShowFormModal(false)} className="glass-btn-secondary" style={{ flex: 1, padding: '0.8rem' }}>Cancel</button>
                <button type="submit" className="glass-btn-primary" style={{ flex: 2, padding: '0.8rem' }}>
                  {editProduct ? 'Save Changes' : 'Add Product to Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════
          PRODUCT VIEW MODAL (read-only details, no shopping)
          ═══════════════════════════════════════════════════ */}
      {viewProduct && (
        <div className="modal-overlay" onClick={() => setViewProduct(null)}>
          <div
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: '680px', width: '100%', background: '#fff', border: '1.5px solid #d1ddf7', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(29,106,229,0.14)' }}
          >
            {/* Header */}
            <div style={{ padding: '1.1rem 1.5rem', borderBottom: '1px solid #e5eeff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8faff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Eye size={17} color="#1d6ae5" />
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827' }}>Product Details</h3>
                <span style={{ fontSize: '0.72rem', color: '#9ca3af', fontFamily: 'monospace' }}>ID: {viewProduct._id}</span>
              </div>
              <button onClick={() => setViewProduct(null)}
                style={{ background: '#fff', border: '1.5px solid #d1ddf7', color: '#374151', cursor: 'pointer', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', minHeight: '300px' }}>
              {/* Image */}
              <div style={{ background: '#f8faff', borderRight: '1px solid #e5eeff', overflow: 'hidden' }}>
                <img src={viewProduct.image} alt={viewProduct.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '260px' }}
                  onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=70'; }} />
              </div>

              {/* Info — management only */}
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                <span className="glass-pill" style={{ marginBottom: '0.65rem', alignSelf: 'flex-start' }}>{viewProduct.category}</span>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', color: '#111827', lineHeight: 1.3 }}>{viewProduct.title}</h2>
                <p style={{ color: '#6b7280', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1.1rem', flex: 1 }}>{viewProduct.description}</p>

                {/* Info grid — no buy action */}
                <div style={{ background: '#f8faff', border: '1.5px solid #e5eeff', borderRadius: '10px', padding: '0.9rem 1rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.84rem' }}>
                    <div>
                      <div style={{ color: '#9ca3af', fontSize: '0.72rem', fontWeight: 600, marginBottom: '0.15rem' }}>SALE PRICE</div>
                      <div style={{ fontWeight: 800, color: '#1d6ae5', fontSize: '1.1rem' }}>${viewProduct.price.toFixed(2)}</div>
                    </div>
                    {viewProduct.originalPrice > viewProduct.price && (
                      <div>
                        <div style={{ color: '#9ca3af', fontSize: '0.72rem', fontWeight: 600, marginBottom: '0.15rem' }}>ORIGINAL PRICE</div>
                        <div style={{ fontWeight: 600, color: '#9ca3af', textDecoration: 'line-through' }}>${viewProduct.originalPrice.toFixed(2)}</div>
                      </div>
                    )}
                    <div>
                      <div style={{ color: '#9ca3af', fontSize: '0.72rem', fontWeight: 600, marginBottom: '0.15rem' }}>STOCK</div>
                      <div style={{ fontWeight: 700, color: viewProduct.countInStock < 5 ? '#dc2626' : '#059669' }}>{viewProduct.countInStock} units</div>
                    </div>
                    <div>
                      <div style={{ color: '#9ca3af', fontSize: '0.72rem', fontWeight: 600, marginBottom: '0.15rem' }}>RATING</div>
                      <div style={{ fontWeight: 700, color: '#d97706' }}>★ {viewProduct.rating || '—'} ({viewProduct.numReviews || 0})</div>
                    </div>
                  </div>
                </div>

                {/* Management actions ONLY — no cart/buy */}
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <button
                    onClick={() => { setViewProduct(null); openEdit(viewProduct); }}
                    className="glass-btn-primary"
                    style={{ flex: 1, padding: '0.7rem', fontSize: '0.85rem' }}
                  >
                    <Edit3 size={14} /> Edit Product
                  </button>
                  <button
                    onClick={() => { setViewProduct(null); handleDeleteProduct(viewProduct._id); }}
                    style={{ flex: 1, padding: '0.7rem', background: '#fee2e2', border: '1.5px solid #fca5a5', color: '#dc2626', borderRadius: '9px', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', fontSize: '0.85rem', fontFamily: 'Inter, sans-serif' }}
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
