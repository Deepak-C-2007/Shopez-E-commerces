const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getIsConnected } = require('../config/db');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'shopez_super_secret_jwt_key_2026_glassmorphism'
      );

      let user = null;
      if (getIsConnected()) {
        try {
          user = await User.findById(decoded.id).select('-password');
        } catch (dbError) {
          user = null;
        }
      }

      if (user) {
        req.user = user;
      } else {
        // Fallback user object extracted directly from verified JWT token
        req.user = {
          _id: decoded.id || 'usr_demo',
          id: decoded.id || 'usr_demo',
          name: decoded.name || (decoded.email === 'admin@gmail.com' ? 'ShopEZ Admin' : 'ShopEZ User'),
          email: decoded.email || 'user@example.com',
          role: decoded.role || (decoded.email === 'admin@gmail.com' ? 'admin' : 'user')
        };
      }
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admin privileges required' });
  }
};

module.exports = { protect, adminOnly };
