const Order = require('../models/Order');
const { getIsConnected } = require('../config/db');
const memoryStore = require('../store');

// Create new order
const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items specified' });
    }

    const userId = req.user ? (req.user._id || req.user.id) : 'usr_guest';
    const userInfo = req.user || {};

    // Always create in memoryStore so it's instantly available and saved
    const createdInMemoryOrder = memoryStore.createOrder(userId, userInfo, req.body);

    if (getIsConnected()) {
      try {
        const order = new Order({
          user: userId,
          orderItems,
          shippingAddress,
          paymentMethod: paymentMethod || 'Credit Card',
          itemsPrice,
          shippingPrice: shippingPrice || 0,
          taxPrice: taxPrice || 0,
          totalPrice,
          isPaid: true,
          paidAt: Date.now(),
          orderStatus: 'Processing'
        });
        const createdOrder = await order.save();
        return res.status(201).json(createdOrder);
      } catch (dbErr) {
        console.warn('DB Order save error, returning in-memory order:', dbErr.message);
      }
    }

    res.status(201).json(createdInMemoryOrder);
  } catch (error) {
    const createdInMemoryOrder = memoryStore.createOrder(req.user?._id, req.user, req.body);
    res.status(201).json(createdInMemoryOrder);
  }
};

// Get logged-in user's orders
const getMyOrders = async (req, res) => {
  try {
    const userId = req.user ? (req.user._id || req.user.id) : null;
    if (getIsConnected()) {
      const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
      if (orders && orders.length > 0) return res.json(orders);
    }
    const memOrders = memoryStore.getUserOrders(userId);
    res.json(memOrders);
  } catch (error) {
    res.json(memoryStore.getUserOrders(req.user?._id));
  }
};

// Get order details by ID
const getOrderById = async (req, res) => {
  try {
    if (getIsConnected()) {
      const order = await Order.findById(req.params.id).populate('user', 'name email');
      if (order) return res.json(order);
    }
    const memOrder = memoryStore.getOrders().find(o => o._id === req.params.id);
    if (memOrder) return res.json(memOrder);
    res.status(404).json({ message: 'Order not found' });
  } catch (error) {
    res.status(404).json({ message: 'Order not found' });
  }
};

// Admin: Get all orders
const getAllOrders = async (req, res) => {
  try {
    if (getIsConnected()) {
      const orders = await Order.find({}).populate('user', 'id name email').sort({ createdAt: -1 });
      if (orders && orders.length > 0) return res.json(orders);
    }
    res.json(memoryStore.getOrders());
  } catch (error) {
    res.json(memoryStore.getOrders());
  }
};

// Admin: Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const updatedMem = memoryStore.updateOrderStatus(req.params.id, orderStatus);

    if (getIsConnected()) {
      const order = await Order.findById(req.params.id);
      if (order) {
        order.orderStatus = orderStatus || order.orderStatus;
        if (orderStatus === 'Delivered') {
          order.isDelivered = true;
          order.deliveredAt = Date.now();
        }
        const updatedOrder = await order.save();
        return res.json(updatedOrder);
      }
    }
    res.json(updatedMem || { message: 'Status updated' });
  } catch (error) {
    res.json({ message: 'Status updated' });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
};
