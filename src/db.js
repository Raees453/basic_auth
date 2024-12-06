const mongoose = require('mongoose');

const DB_URL = 'mongodb://127.0.0.1:27017/demo';

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URL);

    console.log('MongoDB connected successfully!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
