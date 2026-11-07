const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

dotenv.config();

const sampleProducts = [
  {
    name: 'Apple iPhone 15 (128 GB) - Black',
    brand: 'Apple',
    category: 'Mobiles & Tablets',
    description: 'DYNAMIC ISLAND COMES TO IPHONE 15 — Dynamic Island bubbles up alerts and Live Activities — so you don’t miss them while you’re doing something else. 48MP Main camera with 2x Telephoto. All-day battery life and USB-C connectivity.',
    features: [
      'Super Retina XDR display (6.1-inch)',
      '48MP Main camera with 2x Telephoto',
      'A16 Bionic chip with 5-core GPU',
      'USB-C connector with fast charging support',
      'Ceramic Shield front, tougher than any smartphone glass'
    ],
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80',
    price: 69999,
    originalPrice: 79900,
    discount: 12,
    countInStock: 25,
    rating: 4.6,
    numReviews: 2450,
    badge: 'Best Seller',
    isPrime: true
  },
  {
    name: 'Samsung Galaxy S24 Ultra 5G (Titanium Gray, 256 GB)',
    brand: 'Samsung',
    category: 'Mobiles & Tablets',
    description: 'Meet Galaxy S24 Ultra, the ultimate form of Galaxy Ultra with a new titanium exterior and a 6.8 inch flat display. Galaxy AI is here. Search like never before, get quick language translation on a call, and format your notes into a clear summary.',
    features: [
      'Galaxy AI powered features for live translation & photo assist',
      '200MP camera with Quad Tele System & 100x Space Zoom',
      'Snapdragon 8 Gen 3 Mobile Platform for Galaxy',
      'Titanium shield defense & Corning Gorilla Armor',
      'Built-in S Pen stylus included'
    ],
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80',
    price: 119999,
    originalPrice: 134999,
    discount: 11,
    countInStock: 15,
    rating: 4.7,
    numReviews: 1820,
    badge: "Amazon's Choice",
    isPrime: true
  },
  {
    name: 'Apple MacBook Air M2 Chip (13.6-inch, 8GB RAM, 256GB SSD) - Space Grey',
    brand: 'Apple',
    category: 'Laptops & Computers',
    description: 'STRIKINGLY THIN DESIGN — The redesigned MacBook Air is more portable than ever and weighs just 1.24 kg. It’s the ultra-capable laptop that lets you work, play or create just about anything — anywhere. Up to 18 hours of battery life.',
    features: [
      'Apple M2 chip with 8-core CPU and 8-core GPU',
      '13.6-inch Liquid Retina display with 500 nits brightness',
      '1080p FaceTime HD camera with three-mic array',
      'Four-speaker sound system with Spatial Audio',
      'MagSafe 3 charging port, two Thunderbolt ports'
    ],
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
    price: 89990,
    originalPrice: 99900,
    discount: 10,
    countInStock: 18,
    rating: 4.8,
    numReviews: 3200,
    badge: 'Deal of the Day',
    isPrime: true
  },
  {
    name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones - Black',
    brand: 'Sony',
    category: 'Audio & Headphones',
    description: 'Industry-leading noise cancellation with two processors and 8 microphones. Magnificent Sound, engineered to perfection with the new Integrated Processor V1. Crystal clear hands-free calling with 4 beamforming microphones.',
    features: [
      'Auto NC Optimizer automatically adjusts noise canceling',
      'Up to 30-hour battery life with quick charging (3 min for 3 hours playback)',
      'Ultra-comfortable, lightweight design with soft fit leather',
      'Multi-point connection allows switching quickly between devices',
      'Speak-to-chat technology automatically pauses music when you speak'
    ],
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    price: 26990,
    originalPrice: 34990,
    discount: 23,
    countInStock: 30,
    rating: 4.5,
    numReviews: 1420,
    badge: 'Best Seller',
    isPrime: true
  },
  {
    name: 'OnePlus Watch 2 with Wear OS by Google - Radiant Steel',
    brand: 'OnePlus',
    category: 'Wearables & Smartwatches',
    description: 'Up to 100 Hours battery life in Smart Mode. Dual-Engine Architecture with Snapdragon W5 Gen 1 and BES 2700 chips. Sapphire Crystal Glass and Stainless Steel chassis. Wear OS 4 powered by Google with Google Wallet support.',
    features: [
      'Dual Frequency L1+L5 GPS for ultra-accurate tracking',
      '100+ Sports modes and advanced running analysis',
      'Sleep tracking with snore detection and breathing quality',
      'VOOC Fast Charging: 100% in 45 minutes',
      '5ATM + IP68 Water and dust resistance'
    ],
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    price: 19999,
    originalPrice: 24999,
    discount: 20,
    countInStock: 40,
    rating: 4.3,
    numReviews: 890,
    badge: "Amazon's Choice",
    isPrime: true
  },
  {
    name: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker, 6 Litres',
    brand: 'Instant Pot',
    category: 'Home & Kitchen',
    description: '7-in-1 functional cooker: Pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker and warmer. 13 customizable Smart Programs for quick one-touch cooking ribs, soups, beans, rice, poultry, yogurt and desserts.',
    features: [
      'Cooks fast & saves up to 70% energy compared to traditional cooking',
      'Fingerprint-resistant stainless steel sides and dishwasher-safe lid',
      'Over 10 safety features including overheat protection and safe-locking lid',
      'Food-grade 304 stainless steel inner pot with tri-ply bottom',
      'Includes free Instant Pot app with over 2000 recipes'
    ],
    image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80',
    price: 7999,
    originalPrice: 11999,
    discount: 33,
    countInStock: 22,
    rating: 4.6,
    numReviews: 5410,
    badge: 'Deal of the Day',
    isPrime: true
  },
  {
    name: 'Nike Men Air Zoom Pegasus 40 Running Shoes - White/Black',
    brand: 'Nike',
    category: 'Fashion & Footwear',
    description: 'A springy ride for any run, the Pegasus familiar, just-for-you feel returns to help you accomplish your goals. This version has the same responsiveness and neutral support you love, but with improved comfort in sensitive areas of your foot.',
    features: [
      'Nike React foam technology delivers a smooth, responsive ride',
      'Two Zoom Air units at forefoot and heel for energizing feel',
      'Engineered mesh upper for breathability and comfort',
      'Waffle-inspired rubber outsole for durable traction',
      'Padded collar and tongue for a snug, secure fit'
    ],
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    price: 8495,
    originalPrice: 11495,
    discount: 26,
    countInStock: 35,
    rating: 4.4,
    numReviews: 960,
    badge: 'Limited Time Deal',
    isPrime: true
  },
  {
    name: 'Logitech MX Master 3S Wireless Performance Mouse',
    brand: 'Logitech',
    category: 'Laptops & Computers',
    description: 'Feel every single moment of your workflow with even more precision, tactility, and performance, thanks to Quiet Clicks and an 8,000 DPI track-on-glass sensor. MagSpeed scrolling is 90% faster and 87% more precise.',
    features: [
      '8K DPI any-surface tracking, even on glass',
      'Quiet Clicks feel satisfying but make 90% less noise',
      'MagSpeed Electromagnetic scrolling for high speed & precision',
      'Ergonomic silhouette crafted for palm and finger support',
      'USB-C quick charging: up to 70 days on a full charge'
    ],
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80',
    price: 7995,
    originalPrice: 10995,
    discount: 27,
    countInStock: 50,
    rating: 4.7,
    numReviews: 4120,
    badge: "Amazon's Choice",
    isPrime: true
  },
  {
    name: 'Kindle Paperwhite (16 GB) – 6.8-inch display and adjustable warm light',
    brand: 'Amazon',
    category: 'Electronics',
    description: 'Now with a 6.8” display and thinner borders, adjustable warm light, up to 10 weeks of battery life, and 20% faster page turns. Purpose-built for reading with a flush-front design and 300 ppi glare-free display that reads like real paper.',
    features: [
      '6.8-inch glare-free display with 300 ppi resolution',
      'Adjustable warm light to shift screen shade from white to amber',
      'Waterproof (IPX8) tested against accidental immersion',
      'Single charge via USB-C lasts up to 10 weeks',
      'Stores thousands of titles in 16 GB storage'
    ],
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80',
    price: 14999,
    originalPrice: 16999,
    discount: 12,
    countInStock: 20,
    rating: 4.8,
    numReviews: 6730,
    badge: 'Best Seller',
    isPrime: true
  },
  {
    name: 'Ray-Ban Classic Polarized Aviator Sunglasses - Gold/Green',
    brand: 'Ray-Ban',
    category: 'Fashion & Footwear',
    description: 'Originally created for U.S. Aviators in 1937, Ray-Ban Aviator Classic sunglasses are a timeless model that combines great aviator styling with exceptional quality, performance and comfort.',
    features: [
      'Polarized green classic G-15 crystal lenses',
      '100% UV400 protection coating',
      'Sturdy polished gold metal frame',
      'Adjustable silicone nose pads',
      'Includes authentic Ray-Ban protective leather case'
    ],
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80',
    price: 9490,
    originalPrice: 12590,
    discount: 25,
    countInStock: 15,
    rating: 4.5,
    numReviews: 830,
    badge: 'Limited Time Deal',
    isPrime: true
  },
  {
    name: 'Philips Smart Wi-Fi LED 9W Bulb - 16 Million Colours',
    brand: 'Philips',
    category: 'Home & Kitchen',
    description: 'Control your lights anywhere using the WiZ app or your favorite compatible voice assistant (Alexa, Google Assistant, Siri Shortcuts). Choose from 16 million colors or tune from warm white to cool daylight.',
    features: [
      '16 Million colors with preset light modes',
      'Works with Alexa, Google Assistant and Siri',
      'No hub required, connects directly to Wi-Fi',
      'Dimmable via mobile app and voice control',
      'Set automated schedules and timers'
    ],
    image: 'https://images.unsplash.com/photo-1550524514-9b7657159ec3?w=800&q=80',
    price: 699,
    originalPrice: 1299,
    discount: 46,
    countInStock: 80,
    rating: 4.3,
    numReviews: 9240,
    badge: 'Best Seller',
    isPrime: true
  },
  {
    name: 'Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones',
    brand: 'Random House',
    category: 'Books',
    description: 'The #1 New York Times bestseller by James Clear. Over 15 million copies sold worldwide. A supremely practical and proven framework for improving every day, no matter what your goals are.',
    features: [
      'Paperback edition with high-grade paper',
      'Includes practical habit loop framework and worksheets',
      'Packed with inspiring real-world case studies',
      'Translated into more than 50 languages'
    ],
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80',
    price: 499,
    originalPrice: 799,
    discount: 38,
    countInStock: 120,
    rating: 4.9,
    numReviews: 45000,
    badge: 'Best Seller',
    isPrime: true
  }
];

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error(' MONGODB_URI is not set in .env file');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log(' Connected to MongoDB for seeding...');

    // Clear existing collections
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    console.log(' Cleared old data.');

    // Create Admin User
    const adminUser = await User.create({
      name: 'Cartzy Admin',
      email: 'admin@cartzy.com',
      password: 'admin123',
      phone: '+91 9876543210',
      address: {
        street: 'Brigade Gateway, 26/1 Dr. Rajkumar Road',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560055',
        country: 'India'
      },
      isAdmin: true
    });

    // Create Demo Customer
    const normalUser = await User.create({
      name: 'Rahul Sharma',
      email: 'user@cartzy.com',
      password: 'user123',
      phone: '+91 9123456780',
      address: {
        street: 'Flat 402, Green Valley Apartments, MG Road',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400001',
        country: 'India'
      },
      isAdmin: false
    });

    console.log(' Users created:');
    console.log(`   Admin: admin@cartzy.com / admin123`);
    console.log(`   Customer: user@cartzy.com / user123`);

    // Insert Products
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(` Inserted ${createdProducts.length} sample Amazon products.`);

    // Create a sample order for normalUser
    const sampleOrder = await Order.create({
      user: normalUser._id,
      orderItems: [
        {
          product: createdProducts[0]._id,
          name: createdProducts[0].name,
          image: createdProducts[0].image,
          price: createdProducts[0].price,
          qty: 1
        },
        {
          product: createdProducts[3]._id,
          name: createdProducts[3].name,
          image: createdProducts[3].image,
          price: createdProducts[3].price,
          qty: 1
        }
      ],
      shippingAddress: {
        fullName: normalUser.name,
        phone: normalUser.phone,
        street: normalUser.address.street,
        city: normalUser.address.city,
        state: normalUser.address.state,
        postalCode: normalUser.address.postalCode,
        country: normalUser.address.country
      },
      paymentMethod: 'Credit/Debit Card',
      itemsPrice: createdProducts[0].price + createdProducts[3].price,
      shippingPrice: 0,
      taxPrice: 0,
      totalPrice: createdProducts[0].price + createdProducts[3].price,
      isPaid: true,
      paidAt: Date.now(),
      orderStatus: 'Processing'
    });

    console.log(` Created initial sample order ID: ${sampleOrder._id}`);
    console.log(' Database Seeding Completed Successfully!');
    process.exit();
  } catch (error) {
    console.error(` Seeding Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    console.log(' Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(` Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  seedData();
}
