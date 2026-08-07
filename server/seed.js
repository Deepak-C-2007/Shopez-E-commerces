const dns = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch (e) {}
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Product = require('./models/Product');

const seedData = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shopez', {
      serverSelectionTimeoutMS: 10000
    });
    console.log(`MongoDB Connected for seeding to: ${conn.connection.host}`);

    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();

    // Create Admin User
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const userPassword = await bcrypt.hash('user123', salt);

    await User.create({
      name: 'ShopEZ Admin',
      email: 'admin@gmail.com',
      password: adminPassword,
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    });

    await User.create({
      name: 'Sarah Connor',
      email: 'sarah@example.com',
      password: userPassword,
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
    });

    await User.create({
      name: 'Alex Rivera',
      email: 'alex@example.com',
      password: userPassword,
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    });

    console.log('Seeded Users successfully.');

    // 20 Curated Products
    const sampleProducts = [
      // Electronics
      {
        title: 'Quantum Neo Wireless Headphones',
        description: 'Active Noise Cancelling over-ear headphones with 40h battery life, spatial audio, and sleek frosted glass accents.',
        price: 249.99,
        originalPrice: 329.99,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
        countInStock: 25,
        rating: 4.9,
        numReviews: 48,
        isFeatured: true
      },
      {
        title: 'Aura Glass Smartwatch Ultra',
        description: 'Next-gen AMOLED smart timepiece featuring health tracking, GPS, titanium bezel, and 50m water resistance.',
        price: 399.00,
        originalPrice: 499.00,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
        countInStock: 18,
        rating: 4.8,
        numReviews: 32,
        isFeatured: true
      },
      {
        title: 'Horizon Pro Mirrorless 4K Camera',
        description: '4K 60fps full-frame mirrorless camera with real-time eye autofocus and 5-axis optical image stabilization.',
        price: 1299.99,
        originalPrice: 1499.99,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
        countInStock: 6,
        rating: 5.0,
        numReviews: 64,
        isFeatured: true
      },
      {
        title: 'Prism Gold Wireless Earbuds Pro',
        description: 'True wireless ANC earbuds with 24-bit studio audio quality, wireless charging case, and IPX5 resistance.',
        price: 129.99,
        originalPrice: 169.99,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
        countInStock: 28,
        rating: 4.8,
        numReviews: 35,
        isFeatured: false
      },
      {
        title: '4K Cinema Short Throw Projector',
        description: 'Ultra short throw 4K laser projector capable of projecting up to 150 inches with built-in Harman Kardon speakers.',
        price: 899.00,
        originalPrice: 1199.00,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=800&auto=format&fit=crop&q=80',
        countInStock: 9,
        rating: 4.9,
        numReviews: 21,
        isFeatured: true
      },

      // Gaming
      {
        title: 'Cyber Deck RGB Mechanical Keyboard',
        description: 'Hot-swappable RGB mechanical gaming keyboard with custom Gateron switches and translucent keycaps.',
        price: 159.50,
        originalPrice: 199.99,
        category: 'Gaming',
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
        countInStock: 14,
        rating: 4.7,
        numReviews: 29,
        isFeatured: false
      },
      {
        title: 'Vortex Wireless Gaming Mouse',
        description: 'Ultra-lightweight 58g gaming mouse with 26k DPI sensor, zero latency wireless, and PTFE feet.',
        price: 79.99,
        originalPrice: 99.99,
        category: 'Gaming',
        image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80',
        countInStock: 22,
        rating: 4.8,
        numReviews: 37,
        isFeatured: true
      },
      {
        title: 'OLED Curved Ultrawide Monitor',
        description: '34-inch 175Hz 0.03ms OLED curved gaming display with HDR True Black 400 and ambient backlighting.',
        price: 549.99,
        originalPrice: 699.99,
        category: 'Gaming',
        image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
        countInStock: 11,
        rating: 4.9,
        numReviews: 50,
        isFeatured: true
      },

      // Fashion
      {
        title: 'Minimalist Prism Leather Backpack',
        description: 'Crafted from premium full-grain Italian leather with dedicated 16-inch laptop compartment.',
        price: 189.00,
        originalPrice: 240.00,
        category: 'Fashion',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
        countInStock: 8,
        rating: 4.9,
        numReviews: 19,
        isFeatured: true
      },
      {
        title: 'Vogue Silk Touch Designer Sunglasses',
        description: 'Polarized UV400 fashion sunglasses with handmade acetate frames and anti-glare scratch resistant coating.',
        price: 119.00,
        originalPrice: 159.00,
        category: 'Fashion',
        image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80',
        countInStock: 22,
        rating: 4.7,
        numReviews: 41,
        isFeatured: false
      },
      {
        title: 'Urban Phantom Chronograph Watch',
        description: 'Sleek matte black stainless steel watch with sapphire crystal lens and Japanese quartz movement.',
        price: 220.00,
        originalPrice: 280.00,
        category: 'Fashion',
        image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80',
        countInStock: 12,
        rating: 4.8,
        numReviews: 28,
        isFeatured: false
      },
      {
        title: 'Pure Silk Luxury Sleep Set',
        description: '100% Mulberry silk pyjama loungewear set offering thermoregulating comfort and anti-friction feel.',
        price: 85.00,
        originalPrice: 110.00,
        category: 'Fashion',
        image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80',
        countInStock: 20,
        rating: 4.7,
        numReviews: 16,
        isFeatured: false
      },

      // Home & Living
      {
        title: 'Lumina Smart Ambient Lamp',
        description: 'Color-changing LED ambient table lamp syncable with music and customizable via smartphone app.',
        price: 79.99,
        originalPrice: 99.99,
        category: 'Home & Living',
        image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80',
        countInStock: 30,
        rating: 4.6,
        numReviews: 15,
        isFeatured: false
      },
      {
        title: 'Sonic Glide Ergonomic Office Chair',
        description: 'Breathable mesh executive chair with dynamic lumbar support, 3D adjustable armrests, and recline control.',
        price: 349.99,
        originalPrice: 429.99,
        category: 'Home & Living',
        image: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=800&auto=format&fit=crop&q=80',
        countInStock: 10,
        rating: 4.8,
        numReviews: 53,
        isFeatured: true
      },
      {
        title: 'Barista Touch Espresso Machine',
        description: 'Precision thermal espresso machine with integrated conical burr grinder and automatic steam wand.',
        price: 649.00,
        originalPrice: 799.00,
        category: 'Home & Living',
        image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=800&auto=format&fit=crop&q=80',
        countInStock: 7,
        rating: 4.9,
        numReviews: 38,
        isFeatured: true
      },
      {
        title: 'Nitro Cold Brew Coffee Dispenser',
        description: 'Stainless steel home cold brew keg system infusing micro-bubbles for velvety smooth nitro coffee.',
        price: 139.00,
        originalPrice: 179.00,
        category: 'Home & Living',
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
        countInStock: 15,
        rating: 4.8,
        numReviews: 27,
        isFeatured: false
      },

      // Beauty & Wellness
      {
        title: 'Botanical Elixir Facial Serum',
        description: 'Organic hyaluronic acid serum infused with vitamin C, rosehip oil, and botanical peptides.',
        price: 48.00,
        originalPrice: 65.00,
        category: 'Beauty & Wellness',
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
        countInStock: 40,
        rating: 4.9,
        numReviews: 56,
        isFeatured: false
      },
      {
        title: 'Sonic Glow Facial Cleansing Brush',
        description: 'Ultra-hygienic silicone facial brush with sonic vibrations to gently unclog pores and massage skin.',
        price: 69.99,
        originalPrice: 89.99,
        category: 'Beauty & Wellness',
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
        countInStock: 25,
        rating: 4.7,
        numReviews: 31,
        isFeatured: false
      },

      // Sports & Fitness
      {
        title: 'Zenith Non-Slip Eco Yoga Mat',
        description: 'Sustainable natural rubber yoga mat with alignment guidelines and ultra-dense cushioning.',
        price: 58.00,
        originalPrice: 75.00,
        category: 'Sports & Fitness',
        image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&auto=format&fit=crop&q=80',
        countInStock: 20,
        rating: 4.9,
        numReviews: 44,
        isFeatured: false
      },
      {
        title: 'HyperPulse Muscle Massage Gun',
        description: 'Deep tissue percussion massage gun with 6 interchangeable heads and ultra-quiet motor.',
        price: 129.99,
        originalPrice: 179.99,
        category: 'Sports & Fitness',
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80',
        countInStock: 16,
        rating: 4.8,
        numReviews: 61,
        isFeatured: true
      }
    ];

    await Product.insertMany(sampleProducts);
    console.log(`Seeded ${sampleProducts.length} Products successfully across all categories.`);
    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.warn(`MongoDB Notice: Could not connect to local MongoDB service (${error.message}). The application will automatically fall back to client/server in-memory mode with pre-loaded products and Admin credentials.`);
    process.exit(0);
  }
};

seedData();
