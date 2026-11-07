const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(` MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(` MongoDB Connection Error: ${error.message}`);
    console.warn(` Please ensure MONGODB_URI in server/.env is a valid MongoDB Atlas connection string.`);
    return false;
  }
};

module.exports = connectDB;
