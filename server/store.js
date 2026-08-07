// In-Memory Data Store for ShopEZ
// Used when MongoDB server is offline or for fallback persistence.

const initialProducts = [
  { _id: 'p1', title: 'Quantum Neo Wireless Headphones', description: 'Active Noise Cancelling over-ear headphones with 40h battery life, spatial audio, and sleek frosted glass accents.', price: 249.99, originalPrice: 329.99, category: 'Electronics', image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80', rating: 4.9, numReviews: 48, countInStock: 25, isFeatured: true },
  { _id: 'p2', title: 'Aura Glass Smartwatch Ultra', description: 'Next-gen AMOLED smart timepiece featuring health tracking, GPS, titanium bezel, and 50m water resistance.', price: 399.00, originalPrice: 499.00, category: 'Electronics', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80', rating: 4.8, numReviews: 32, countInStock: 18, isFeatured: true },
  { _id: 'p3', title: 'Horizon Pro Mirrorless 4K Camera', description: '4K 60fps full-frame mirrorless camera with real-time eye autofocus and 5-axis optical image stabilization.', price: 1299.99, originalPrice: 1499.99, category: 'Electronics', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80', rating: 5.0, numReviews: 64, countInStock: 6, isFeatured: false },
  { _id: 'p4', title: 'Prism Gold Wireless Earbuds Pro', description: 'True wireless ANC earbuds with 24-bit studio audio quality, wireless charging case, and IPX5 resistance.', price: 129.99, originalPrice: 169.99, category: 'Electronics', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80', rating: 4.8, numReviews: 35, countInStock: 28, isFeatured: false },
  { _id: 'p5', title: '4K Cinema Short Throw Projector', description: 'Ultra short throw 4K laser projector capable of projecting up to 150 inches with built-in Harman Kardon speakers.', price: 899.00, originalPrice: 1199.00, category: 'Electronics', image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=800&auto=format&fit=crop&q=80', rating: 4.9, numReviews: 21, countInStock: 9, isFeatured: false },
  { _id: 'p6', title: 'Cyber Deck RGB Mechanical Keyboard', description: 'Hot-swappable RGB mechanical gaming keyboard with custom Gateron switches and translucent keycaps.', price: 159.50, originalPrice: 199.99, category: 'Gaming', image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80', rating: 4.7, numReviews: 29, countInStock: 14, isFeatured: true },
  { _id: 'p7', title: 'Vortex Wireless Gaming Mouse', description: 'Ultra-lightweight 58g gaming mouse with 26k DPI sensor, zero latency wireless, and PTFE feet.', price: 79.99, originalPrice: 99.99, category: 'Gaming', image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80', rating: 4.8, numReviews: 37, countInStock: 22, isFeatured: false },
  { _id: 'p8', title: 'OLED Curved Ultrawide Monitor', description: '34-inch 175Hz 0.03ms OLED curved gaming display with HDR True Black 400 and ambient backlighting.', price: 549.99, originalPrice: 699.99, category: 'Gaming', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80', rating: 4.9, numReviews: 50, countInStock: 11, isFeatured: false },
  { _id: 'p9', title: 'Minimalist Prism Leather Backpack', description: 'Crafted from premium full-grain Italian leather with dedicated 16-inch laptop compartment.', price: 189.00, originalPrice: 240.00, category: 'Fashion', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80', rating: 4.9, numReviews: 19, countInStock: 8, isFeatured: false },
  { _id: 'p10', title: 'Vogue Silk Touch Designer Sunglasses', description: 'Polarized UV400 fashion sunglasses with handmade acetate frames and anti-glare scratch resistant coating.', price: 119.00, originalPrice: 159.00, category: 'Fashion', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80', rating: 4.7, numReviews: 41, countInStock: 22, isFeatured: false },
  { _id: 'p11', title: 'Urban Phantom Chronograph Watch', description: 'Sleek matte black stainless steel watch with sapphire crystal lens and Japanese quartz movement.', price: 220.00, originalPrice: 280.00, category: 'Fashion', image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80', rating: 4.8, numReviews: 28, countInStock: 12, isFeatured: true },
  { _id: 'p12', title: 'Pure Silk Luxury Sleep Set', description: '100% Mulberry silk pyjama loungewear set offering thermoregulating comfort and anti-friction feel.', price: 85.00, originalPrice: 110.00, category: 'Fashion', image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80', rating: 4.7, numReviews: 16, countInStock: 20, isFeatured: false },
  { _id: 'p13', title: 'Lumina Smart Ambient Lamp', description: 'Color-changing LED ambient table lamp syncable with music and customizable via smartphone app.', price: 79.99, originalPrice: 99.99, category: 'Home & Living', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80', rating: 4.6, numReviews: 15, countInStock: 30, isFeatured: false },
  { _id: 'p14', title: 'Sonic Glide Ergonomic Office Chair', description: 'Breathable mesh executive chair with dynamic lumbar support, 3D adjustable armrests, and recline control.', price: 349.99, originalPrice: 429.99, category: 'Home & Living', image: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=800&auto=format&fit=crop&q=80', rating: 4.8, numReviews: 53, countInStock: 10, isFeatured: true },
  { _id: 'p15', title: 'Barista Touch Espresso Machine', description: 'Precision thermal espresso machine with integrated conical burr grinder and automatic steam wand.', price: 649.00, originalPrice: 799.00, category: 'Home & Living', image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=800&auto=format&fit=crop&q=80', rating: 4.9, numReviews: 38, countInStock: 7, isFeatured: false },
  { _id: 'p16', title: 'Nitro Cold Brew Coffee Dispenser', description: 'Stainless steel home cold brew keg system infusing micro-bubbles for velvety smooth nitro coffee.', price: 139.00, originalPrice: 179.00, category: 'Home & Living', image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80', rating: 4.8, numReviews: 27, countInStock: 15, isFeatured: false },
  { _id: 'p17', title: 'Botanical Elixir Facial Serum', description: 'Organic hyaluronic acid serum infused with vitamin C, rosehip oil, and botanical peptides.', price: 48.00, originalPrice: 65.00, category: 'Beauty & Wellness', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80', rating: 4.9, numReviews: 56, countInStock: 40, isFeatured: false },
  { _id: 'p18', title: 'Sonic Glow Facial Cleansing Brush', description: 'Ultra-hygienic silicone facial brush with sonic vibrations to gently unclog pores and massage skin.', price: 69.99, originalPrice: 89.99, category: 'Beauty & Wellness', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80', rating: 4.7, numReviews: 31, countInStock: 25, isFeatured: false },
  { _id: 'p19', title: 'Zenith Non-Slip Eco Yoga Mat', description: 'Sustainable natural rubber yoga mat with alignment guidelines and ultra-dense cushioning.', price: 58.00, originalPrice: 75.00, category: 'Sports & Fitness', image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&auto=format&fit=crop&q=80', rating: 4.9, numReviews: 44, countInStock: 20, isFeatured: false },
  { _id: 'p20', title: 'HyperPulse Muscle Massage Gun', description: 'Deep tissue percussion massage gun with 6 interchangeable heads and ultra-quiet motor.', price: 129.99, originalPrice: 179.99, category: 'Sports & Fitness', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80', rating: 4.8, numReviews: 61, countInStock: 16, isFeatured: false }
];

const initialUsers = [
  {
    _id: 'admin_fixed_654321',
    name: 'ShopEZ Admin',
    email: 'admin@gmail.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date('2026-01-01')
  },
  {
    _id: 'usr_user_1',
    name: 'Sarah Connor',
    email: 'sarah@example.com',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date('2026-01-15')
  },
  {
    _id: 'usr_user_2',
    name: 'Alex Rivera',
    email: 'alex@example.com',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date('2026-01-20')
  }
];

const initialOrders = [
  {
    _id: 'ORD-982143',
    user: { _id: 'usr_user_1', name: 'Sarah Connor', email: 'sarah@example.com' },
    orderItems: [
      {
        product: 'p1',
        title: 'Quantum Neo Wireless Headphones',
        image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
        price: 249.99,
        quantity: 1
      }
    ],
    shippingAddress: { fullName: 'Sarah Connor', address: '123 Tech Ave', city: 'San Francisco', postalCode: '94105', country: 'USA' },
    paymentMethod: 'Credit Card (Stripe)',
    totalPrice: 269.99,
    isPaid: true,
    paidAt: new Date(),
    orderStatus: 'Delivered',
    createdAt: new Date('2026-02-01')
  },
  {
    _id: 'ORD-449120',
    user: { _id: 'usr_user_2', name: 'Alex Rivera', email: 'alex@example.com' },
    orderItems: [
      {
        product: 'p2',
        title: 'Aura Glass Smartwatch Ultra',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
        price: 399.00,
        quantity: 1
      }
    ],
    shippingAddress: { fullName: 'Alex Rivera', address: '456 Innovation Way', city: 'San Jose', postalCode: '95110', country: 'USA' },
    paymentMethod: 'PayPal',
    totalPrice: 430.92,
    isPaid: true,
    paidAt: new Date(),
    orderStatus: 'Processing',
    createdAt: new Date('2026-02-01')
  }
];

class Store {
  constructor() {
    this.products = [...initialProducts];
    this.users = [...initialUsers];
    this.orders = [...initialOrders];
  }

  // ── Products ──
  getProducts(category, search) {
    let list = [...this.products];
    if (category && category !== 'All') {
      list = list.filter(p => p.category === category);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    return list;
  }

  getProductById(id) {
    return this.products.find(p => p._id === id);
  }

  createProduct(data) {
    const newProduct = {
      _id: 'prod_' + Date.now(),
      title: data.title,
      description: data.description,
      price: Number(data.price),
      originalPrice: data.originalPrice ? Number(data.originalPrice) : Number(data.price) * 1.25,
      category: data.category,
      image: data.image,
      countInStock: data.countInStock !== undefined ? Number(data.countInStock) : 15,
      isFeatured: !!data.isFeatured,
      rating: 5.0,
      numReviews: 1,
      createdAt: new Date()
    };
    this.products.unshift(newProduct);
    return newProduct;
  }

  updateProduct(id, data) {
    const idx = this.products.findIndex(p => p._id === id);
    if (idx !== -1) {
      this.products[idx] = {
        ...this.products[idx],
        ...data,
        price: data.price !== undefined ? Number(data.price) : this.products[idx].price,
        countInStock: data.countInStock !== undefined ? Number(data.countInStock) : this.products[idx].countInStock,
      };
      return this.products[idx];
    }
    return null;
  }

  deleteProduct(id) {
    const len = this.products.length;
    this.products = this.products.filter(p => p._id !== id);
    return this.products.length < len;
  }

  // ── Users ──
  getUsers() {
    return this.users.map(({ password, ...u }) => u);
  }

  getUserByEmail(email) {
    const clean = (email || '').toLowerCase().trim();
    return this.users.find(u => u.email.toLowerCase() === clean);
  }

  createUser(name, email, role = 'user') {
    const clean = (email || '').toLowerCase().trim();
    let existing = this.getUserByEmail(clean);
    if (existing) return existing;

    const newUser = {
      _id: 'usr_' + Date.now(),
      name,
      email: clean,
      role: clean === 'admin@gmail.com' ? 'admin' : role,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date()
    };
    this.users.unshift(newUser);
    return newUser;
  }

  deleteUser(id) {
    const u = this.users.find(x => x._id === id);
    if (u && u.email === 'admin@gmail.com') return false;
    const len = this.users.length;
    this.users = this.users.filter(x => x._id !== id);
    return this.users.length < len;
  }

  toggleUserRole(id) {
    const u = this.users.find(x => x._id === id);
    if (!u) return null;
    if (u.email === 'admin@gmail.com') return u;
    u.role = u.role === 'admin' ? 'user' : 'admin';
    return u;
  }

  // ── Orders ──
  getOrders() {
    return this.orders;
  }

  getUserOrders(userId) {
    return this.orders.filter(o => o.user && (o.user._id === userId || o.user === userId));
  }

  createOrder(userId, userInfo, orderData) {
    const newOrder = {
      _id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
      user: {
        _id: userId || 'usr_guest',
        name: userInfo?.name || orderData.shippingAddress?.fullName || 'Customer',
        email: userInfo?.email || 'customer@example.com'
      },
      orderItems: orderData.orderItems || [],
      shippingAddress: orderData.shippingAddress || {},
      paymentMethod: orderData.paymentMethod || 'Credit Card',
      totalPrice: Number(orderData.totalPrice || 0),
      isPaid: true,
      paidAt: new Date(),
      orderStatus: 'Processing',
      createdAt: new Date()
    };
    this.orders.unshift(newOrder);
    return newOrder;
  }

  updateOrderStatus(orderId, newStatus) {
    const o = this.orders.find(x => x._id === orderId);
    if (o) {
      o.orderStatus = newStatus;
      if (newStatus === 'Delivered') {
        o.isDelivered = true;
        o.deliveredAt = new Date();
      }
      return o;
    }
    return null;
  }
}

const memoryStore = new Store();
module.exports = memoryStore;
