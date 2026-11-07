
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Load environment variables first
dotenv.config();

// Database connection
const connectDB = require('./config/db');

// Import routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// Import error middleware
const {
  notFound,
  errorHandler
} = require('./middleware/errorMiddleware');

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Cartzy Backend API is running smoothly',
    timestamp: new Date().toISOString()
  });
});

// Root welcome endpoint
app.get('/', (req, res) => {
  res.send(
    'Cartzy E-Commerce REST API is running. Access endpoints via /api/...'
  );
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Server configuration
const PORT = process.env.PORT || 5000;

// Start server after MongoDB connection
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(
        `Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
      );
    });

  } catch (error) {
    console.error('Server startup failed:', error.message);
    process.exit(1);
  }
};

// Start application
startServer();
