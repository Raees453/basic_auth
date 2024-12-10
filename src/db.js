const mongoose = require('mongoose');

const DB_URL = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_USER_PASS}@cluster0.uetth.mongodb.net/?retryWrites=true&w=majority&appName=${process.env.DB_NAME}`;

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
    await mongoose.connection.close();
    console.log('Mongoose connection closed.\n');

    process.exit(0);
  } catch (error) {
    console.error('Error closing Mongoose connection:', error, '\n');
    process.exit(1);
  }
};
