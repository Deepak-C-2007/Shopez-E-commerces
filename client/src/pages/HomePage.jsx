import React, { useState } from 'react';
import { Sparkles, RefreshCw, ShoppingBag } from 'lucide-react';
import HeroBanner from '../components/HeroBanner';
import ProductCard from '../components/ProductCard';
import ProductDetailsModal from '../components/ProductDetailsModal';
import { getApiUrl } from '../config/api';

export default function HomePage({ searchQuery, onQuickBuy, onOpenAdmin }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const categories = ['All', 'Electronics', 'Gaming', 'Fashion', 'Home & Living', 'Beauty & Wellness', 'Sports & Fitness'];

  // Curated 20 Product Catalog
  const fullCatalogFallback = [
    // Electronics
    { _id: 'p1', title: 'Quantum Neo Wireless Headphones', description: 'Active Noise Cancelling over-ear headphones with 40h battery life, spatial audio, and sleek frosted glass accents.', price: 249.99, originalPrice: 329.99, category: 'Electronics', image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80', rating: 4.9, numReviews: 48, countInStock: 25 },
    { _id: 'p2', title: 'Aura Glass Smartwatch Ultra', description: 'Next-gen AMOLED smart timepiece featuring health tracking, GPS, titanium bezel, and 50m water resistance.', price: 399.00, originalPrice: 499.00, category: 'Electronics', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80', rating: 4.8, numReviews: 32, countInStock: 18 },
    { _id: 'p3', title: 'Horizon Pro Mirrorless 4K Camera', description: '4K 60fps full-frame mirrorless camera with real-time eye autofocus and 5-axis optical image stabilization.', price: 1299.99, originalPrice: 1499.99, category: 'Electronics', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80', rating: 5.0, numReviews: 64, countInStock: 6 },
    { _id: 'p4', title: 'Prism Gold Wireless Earbuds Pro', description: 'True wireless ANC earbuds with 24-bit studio audio quality, wireless charging case, and IPX5 resistance.', price: 129.99, originalPrice: 169.99, category: 'Electronics', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80', rating: 4.8, numReviews: 35, countInStock: 28 },
    { _id: 'p5', title: '4K Cinema Short Throw Projector', description: 'Ultra short throw 4K laser projector capable of projecting up to 150 inches with built-in Harman Kardon speakers.', price: 899.00, originalPrice: 1199.00, category: 'Electronics', image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=800&auto=format&fit=crop&q=80', rating: 4.9, numReviews: 21, countInStock: 9 },
    // Gaming
    { _id: 'p6', title: 'Cyber Deck RGB Mechanical Keyboard', description: 'Hot-swappable RGB mechanical gaming keyboard with custom Gateron switches and translucent keycaps.', price: 159.50, originalPrice: 199.99, category: 'Gaming', image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80', rating: 4.7, numReviews: 29, countInStock: 14 },
    { _id: 'p7', title: 'Vortex Wireless Gaming Mouse', description: 'Ultra-lightweight 58g gaming mouse with 26k DPI sensor, zero latency wireless, and PTFE feet.', price: 79.99, originalPrice: 99.99, category: 'Gaming', image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80', rating: 4.8, numReviews: 37, countInStock: 22 },
    { _id: 'p8', title: 'OLED Curved Ultrawide Monitor', description: '34-inch 175Hz 0.03ms OLED curved gaming display with HDR True Black 400 and ambient backlighting.', price: 549.99, originalPrice: 699.99, category: 'Gaming', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80', rating: 4.9, numReviews: 50, countInStock: 11 },
    // Fashion
    { _id: 'p9', title: 'Minimalist Prism Leather Backpack', description: 'Crafted from premium full-grain Italian leather with dedicated 16-inch laptop compartment.', price: 189.00, originalPrice: 240.00, category: 'Fashion', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80', rating: 4.9, numReviews: 19, countInStock: 8 },
    { _id: 'p10', title: 'Vogue Silk Touch Designer Sunglasses', description: 'Polarized UV400 fashion sunglasses with handmade acetate frames and anti-glare scratch resistant coating.', price: 119.00, originalPrice: 159.00, category: 'Fashion', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80', rating: 4.7, numReviews: 41, countInStock: 22 },
    { _id: 'p11', title: 'Urban Phantom Chronograph Watch', description: 'Sleek matte black stainless steel watch with sapphire crystal lens and Japanese quartz movement.', price: 220.00, originalPrice: 280.00, category: 'Fashion', image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80', rating: 4.8, numReviews: 28, countInStock: 12 },
    { _id: 'p12', title: 'Pure Silk Luxury Sleep Set', description: '100% Mulberry silk pyjama loungewear set offering thermoregulating comfort and anti-friction feel.', price: 85.00, originalPrice: 110.00, category: 'Fashion', image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80', rating: 4.7, numReviews: 16, countInStock: 20 },
    // Home & Living
    { _id: 'p13', title: 'Lumina Smart Ambient Lamp', description: 'Color-changing LED ambient table lamp syncable with music and customizable via smartphone app.', price: 79.99, originalPrice: 99.99, category: 'Home & Living', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80', rating: 4.6, numReviews: 15, countInStock: 30 },
    { _id: 'p14', title: 'Sonic Glide Ergonomic Office Chair', description: 'Breathable mesh executive chair with dynamic lumbar support, 3D adjustable armrests, and recline control.', price: 349.99, originalPrice: 429.99, category: 'Home & Living', image: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=800&auto=format&fit=crop&q=80', rating: 4.8, numReviews: 53, countInStock: 10 },
    { _id: 'p15', title: 'Barista Touch Espresso Machine', description: 'Precision thermal espresso machine with integrated conical burr grinder and automatic steam wand.', price: 649.00, originalPrice: 799.00, category: 'Home & Living', image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=800&auto=format&fit=crop&q=80', rating: 4.9, numReviews: 38, countInStock: 7 },
    { _id: 'p16', title: 'Nitro Cold Brew Coffee Dispenser', description: 'Stainless steel home cold brew keg system infusing micro-bubbles for velvety smooth nitro coffee.', price: 139.00, originalPrice: 179.00, category: 'Home & Living', image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80', rating: 4.8, numReviews: 27, countInStock: 15 },
    // Beauty & Wellness
    { _id: 'p17', title: 'Botanical Elixir Facial Serum', description: 'Organic hyaluronic acid serum infused with vitamin C, rosehip oil, and botanical peptides.', price: 48.00, originalPrice: 65.00, category: 'Beauty & Wellness', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80', rating: 4.9, numReviews: 56, countInStock: 40 },
    { _id: 'p18', title: 'Sonic Glow Facial Cleansing Brush', description: 'Ultra-hygienic silicone facial brush with sonic vibrations to gently unclog pores and massage skin.', price: 69.99, originalPrice: 89.99, category: 'Beauty & Wellness', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80', rating: 4.7, numReviews: 31, countInStock: 25 },
    // Sports & Fitness
    { _id: 'p19', title: 'Zenith Non-Slip Eco Yoga Mat', description: 'Sustainable natural rubber yoga mat with alignment guidelines and ultra-dense cushioning.', price: 58.00, originalPrice: 75.00, category: 'Sports & Fitness', image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&auto=format&fit=crop&q=80', rating: 4.9, numReviews: 44, countInStock: 20 },
    { _id: 'p20', title: 'HyperPulse Muscle Massage Gun', description: 'Deep tissue percussion massage gun with 6 interchangeable heads and ultra-quiet motor.', price: 129.99, originalPrice: 179.99, category: 'Sports & Fitness', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80', rating: 4.8, numReviews: 61, countInStock: 16 }
  ];

  React.useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = '/api/products';
      if (selectedCategory !== 'All') url += `?category=${encodeURIComponent(selectedCategory)}`;
      const res = await fetch(getApiUrl(url));
      if (!res.ok) throw new Error('Failed to load products');
      const data = await res.json();
      if (data && data.length > 0) {
        setProducts(data);
      } else {
        throw new Error('Empty backend list, using fallback catalog');
      }
    } catch (error) {
      const filtered = selectedCategory === 'All' ? fullCatalogFallback : fullCatalogFallback.filter(p => p.category === selectedCategory);
      setProducts(filtered);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes((searchQuery || '').toLowerCase()) ||
    p.category.toLowerCase().includes((searchQuery || '').toLowerCase())
  );

  return (
    <div className="container" style={{ paddingBottom: '4rem' }}>

      {/* Hero Banner */}
      <HeroBanner onShopNowClick={() => {
        const el = document.getElementById('catalog-grid');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }} />

      {/* Catalog Header + Category Filter */}
      <div id="catalog-grid" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '2.5rem 0 1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111827', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Explore Catalog
            <span style={{ fontSize: '1rem', fontWeight: 600, color: '#6b7280', marginLeft: '0.3rem' }}>({filteredProducts.length} Items)</span>
          </h2>
          <p style={{ color: '#6b7280', fontSize: '0.88rem', marginTop: '0.2rem' }}>Showing products across 6 curated categories</p>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                border: selectedCategory === cat ? '1.5px solid #1d6ae5' : '1.5px solid #d1ddf7',
                background: selectedCategory === cat ? '#1d6ae5' : '#fff',
                color: selectedCategory === cat ? '#fff' : '#374151',
                transition: 'all 0.15s ease',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: '#e5eeff', marginBottom: '1.5rem' }} />

      {/* Product Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem 0' }}>
          <RefreshCw size={34} color="#1d6ae5" className="spin" style={{ margin: '0 auto 1rem', display: 'block' }} />
          <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Loading catalog items...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div style={{ padding: '4rem 2rem', textAlign: 'center', background: '#fff', border: '1.5px solid #e5eeff', borderRadius: '14px', margin: '2rem 0' }}>
          <ShoppingBag size={44} color="#d1ddf7" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#374151' }}>No products found</h3>
          <p style={{ color: '#6b7280', fontSize: '0.88rem' }}>Try refining your search terms or category filter.</p>
        </div>
      ) : (
        <div className="grid-products">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onViewDetails={(prod) => setSelectedProduct(prod)}
              onQuickBuy={(prod) => onQuickBuy(prod)}
            />
          ))}
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onBuyNow={(prod) => {
            setSelectedProduct(null);
            onQuickBuy(prod);
          }}
          onManageProduct={(prod) => {
            setSelectedProduct(null);
            if (onOpenAdmin) onOpenAdmin(prod);
          }}
        />
      )}

    </div>
  );
}
