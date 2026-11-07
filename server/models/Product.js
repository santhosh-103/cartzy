const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide product name'],
      trim: true
    },
    brand: {
      type: String,
      default: 'Amazon'
    },
    category: {
      type: String,
      required: [true, 'Please provide product category'],
      trim: true,
      index: true
    },
    description: {
      type: String,
      required: [true, 'Please provide product description']
    },
    features: {
      type: [String],
      default: []
    },
    image: {
      type: String,
      required: [true, 'Please provide product image URL']
    },
    images: {
      type: [String],
      default: []
    },
    price: {
      type: Number,
      required: [true, 'Please provide product price'],
      min: [0, 'Price must be greater than or equal to 0']
    },
    originalPrice: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    countInStock: {
      type: Number,
      required: [true, 'Please provide stock quantity'],
      min: [0, 'Count in stock cannot be negative'],
      default: 10
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5
    },
    numReviews: {
      type: Number,
      default: 0
    },
    badge: {
      type: String,
      default: ''
    },
    isPrime: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Auto-calculate discount if originalPrice is provided and discount is 0
productSchema.pre('save', function (next) {
  if (this.originalPrice && this.originalPrice > this.price && !this.discount) {
    this.discount = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  next();
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
