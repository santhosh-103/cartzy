const Product = require('../models/Product');

// @desc    Fetch all products with search, filter, and pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const pageSize = Number(req.query.limit) || 8;
    const page = Number(req.query.page) || 1;

    // Search keyword query
    const keyword = req.query.keyword
      ? {
          $or: [
            { name: { $regex: req.query.keyword, $options: 'i' } },
            { description: { $regex: req.query.keyword, $options: 'i' } },
            { brand: { $regex: req.query.keyword, $options: 'i' } },
            { category: { $regex: req.query.keyword, $options: 'i' } }
          ]
        }
      : {};

    // Category filter
    const category = req.query.category && req.query.category !== 'All'
      ? { category: req.query.category }
      : {};

    // Price range filter
    const minPrice = req.query.minPrice ? Number(req.query.minPrice) : 0;
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : Infinity;
    const priceFilter = {
      price: { $gte: minPrice, $lte: maxPrice === Infinity ? 999999999 : maxPrice }
    };

    // Rating filter
    const ratingFilter = req.query.rating ? { rating: { $gte: Number(req.query.rating) } } : {};

    // Combine filters
    const filter = {
      ...keyword,
      ...category,
      ...priceFilter,
      ...ratingFilter
    };

    // Sorting
    let sort = { createdAt: -1 };
    if (req.query.sortBy === 'price-low') {
      sort = { price: 1 };
    } else if (req.query.sortBy === 'price-high') {
      sort = { price: -1 };
    } else if (req.query.sortBy === 'rating') {
      sort = { rating: -1 };
    } else if (req.query.sortBy === 'newest') {
      sort = { createdAt: -1 };
    }

    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort(sort)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize) || 1,
      total: count
    });
  } catch (error) {
    console.error('getProducts error:', error);
    res.status(500).json({ message: error.message || 'Server error fetching products' });
  }
};

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all product categories with count
// @route   GET /api/products/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.json(categories.map(c => ({ name: c._id, count: c.count })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get featured deals & top products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
  try {
    const deals = await Product.find({
      $or: [
        { badge: { $exists: true, $ne: '' } },
        { discount: { $gte: 20 } }
      ]
    }).limit(6);

    res.json(deals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      originalPrice,
      discount,
      description,
      image,
      images,
      brand,
      category,
      countInStock,
      features,
      badge,
      isPrime
    } = req.body;

    if (!name || price === undefined || !category || !description || !image) {
      return res.status(400).json({
        message: 'Please provide name, price, category, description, and image URL'
      });
    }

    const calculatedDiscount = discount || (originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0);

    const product = new Product({
      name,
      price: Number(price),
      originalPrice: Number(originalPrice || price),
      discount: Number(calculatedDiscount),
      description,
      image,
      images: images || [],
      brand: brand || 'Cartzy',
      category,
      countInStock: Number(countInStock !== undefined ? countInStock : 10),
      features: Array.isArray(features) ? features : (features ? [features] : []),
      badge: badge || '',
      isPrime: isPrime !== undefined ? isPrime : true,
      rating: 4.5,
      numReviews: 12
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error('createProduct error:', error);
    res.status(500).json({ message: error.message || 'Error creating product' });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      originalPrice,
      discount,
      description,
      image,
      images,
      brand,
      category,
      countInStock,
      features,
      badge,
      isPrime
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name !== undefined ? name : product.name;
      product.price = price !== undefined ? Number(price) : product.price;
      product.originalPrice = originalPrice !== undefined ? Number(originalPrice) : product.originalPrice;
      product.discount = discount !== undefined ? Number(discount) : product.discount;
      product.description = description !== undefined ? description : product.description;
      product.image = image !== undefined ? image : product.image;
      product.images = images !== undefined ? images : product.images;
      product.brand = brand !== undefined ? brand : product.brand;
      product.category = category !== undefined ? category : product.category;
      product.countInStock = countInStock !== undefined ? Number(countInStock) : product.countInStock;
      product.features = features !== undefined ? (Array.isArray(features) ? features : [features]) : product.features;
      product.badge = badge !== undefined ? badge : product.badge;
      product.isPrime = isPrime !== undefined ? isPrime : product.isPrime;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.findByIdAndDelete(req.params.id);
      res.json({ message: 'Product successfully removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  getCategories,
  getFeaturedProducts,
  createProduct,
  updateProduct,
  deleteProduct
};
