const mongoose = require('mongoose');

const DB_URL = 'mongodb://127.0.0.1:27017/demo';

exports.connectDB = async () => {
  try {
    await mongoose.connect(DB_URL);

    console.log('MongoDB connected successfully!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

exports.disconnectDB = async () => {
  try {
    // Close the Mongoose connection
    await mongoose.connection.close();
    console.log('Mongoose connection closed.\n');

    process.exit(0);
  } catch (error) {
    console.error('Error closing Mongoose connection:', error, '\n');
    process.exit(1);
  }
};
