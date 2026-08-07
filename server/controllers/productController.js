const Product = require('../models/Product');
const { getIsConnected } = require('../config/db');
const memoryStore = require('../store');

// Get all products (with optional search and category filter)
const getProducts = async (req, res) => {
  try {
    const { category, search, featured } = req.query;

    if (getIsConnected()) {
      let query = {};
      if (category && category !== 'All') query.category = category;
      if (search) query.title = { $regex: search, $options: 'i' };
      if (featured === 'true') query.isFeatured = true;

      const products = await Product.find(query).sort({ createdAt: -1 });
      if (products && products.length > 0) return res.json(products);
    }

    const memProducts = memoryStore.getProducts(category, search);
    res.json(memProducts);
  } catch (error) {
    res.json(memoryStore.getProducts(req.query.category, req.query.search));
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    if (getIsConnected()) {
      const product = await Product.findById(req.params.id);
      if (product) return res.json(product);
    }
    const memProduct = memoryStore.getProductById(req.params.id);
    if (memProduct) return res.json(memProduct);
    res.status(404).json({ message: 'Product not found' });
  } catch (error) {
    res.status(404).json({ message: 'Product not found' });
  }
};

// Admin: Create new product
const createProduct = async (req, res) => {
  try {
    const { title, description, price, originalPrice, category, image, countInStock, isFeatured } = req.body;

    if (!title || !description || price === undefined || !category || !image) {
      return res.status(400).json({ message: 'Please provide all required product fields' });
    }

    const createdInMemory = memoryStore.createProduct(req.body);

    if (getIsConnected()) {
      try {
        const product = new Product({
          title,
          description,
          price: Number(price),
          originalPrice: originalPrice ? Number(originalPrice) : Number(price) * 1.25,
          category,
          image,
          countInStock: countInStock !== undefined ? Number(countInStock) : 15,
          isFeatured: isFeatured || false,
          rating: 4.8,
          numReviews: 14
        });
        const createdProduct = await product.save();
        return res.status(201).json(createdProduct);
      } catch (dbErr) {
        console.warn('DB Product save error, returning in-memory product:', dbErr.message);
      }
    }

    res.status(201).json(createdInMemory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Update product
const updateProduct = async (req, res) => {
  try {
    const updatedMem = memoryStore.updateProduct(req.params.id, req.body);

    if (getIsConnected()) {
      const product = await Product.findById(req.params.id);
      if (product) {
        const { title, description, price, originalPrice, category, image, countInStock, isFeatured } = req.body;
        product.title = title || product.title;
        product.description = description || product.description;
        product.price = price !== undefined ? Number(price) : product.price;
        product.originalPrice = originalPrice !== undefined ? Number(originalPrice) : product.originalPrice;
        product.category = category || product.category;
        product.image = image || product.image;
        product.countInStock = countInStock !== undefined ? Number(countInStock) : product.countInStock;
        product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;

        const updatedProduct = await product.save();
        return res.json(updatedProduct);
      }
    }

    res.json(updatedMem || { message: 'Product updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Delete product
const deleteProduct = async (req, res) => {
  try {
    memoryStore.deleteProduct(req.params.id);

    if (getIsConnected()) {
      const product = await Product.findById(req.params.id);
      if (product) {
        await product.deleteOne();
      }
    }

    res.json({ message: 'Product removed successfully' });
  } catch (error) {
    res.json({ message: 'Product removed successfully' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
