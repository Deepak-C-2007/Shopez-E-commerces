const dns = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch (e) {}
const mongoose = require('mongoose');

let isConnected = false;

// Disable Mongoose buffering globally so queries fail/fallback fast if DB is offline
mongoose.set('bufferCommands', false);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shopez', {
      serverSelectionTimeoutMS: 10000
    });
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`MongoDB Notice: Database server not active on local port 27017 (${error.message}). Running in instant fallback mode.`);
    isConnected = false;
  }
};

const getIsConnected = () => isConnected && mongoose.connection.readyState === 1;

module.exports = { connectDB, getIsConnected };
