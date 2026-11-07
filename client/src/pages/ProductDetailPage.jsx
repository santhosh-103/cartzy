import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Lock,
  ChevronRight,
  ShoppingCart,
  Zap,
  Check
} from 'lucide-react';
import api from '../utils/api';
import RatingStars from '../components/RatingStars';
import { useCart } from '../context/CartContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/api/products/${id}`);
        setProduct(data);
        setSelectedImage(data.image);
      } catch (err) {
        setError(err.response?.data?.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const formattedPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price || 0);
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product, qty);
      navigate('/checkout');
    }
  };

  if (loading) {
    return (
      <div className="max-w-[1500px] mx-auto px-4 py-12 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Product Not Found</h2>
        <p className="text-sm text-gray-600 mb-6">{error || 'Looking for something else?'}</p>
        <Link
          to="/"
          className="px-6 py-2 bg-amber-400 hover:bg-amber-500 rounded-full font-bold text-sm text-gray-900"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200 py-2 text-xs text-gray-500">
        <div className="max-w-[1500px] mx-auto px-4 flex items-center gap-1.5 flex-wrap">
          <Link to="/" className="hover:underline hover:text-amber-800">Home</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <Link
            to={`/?category=${encodeURIComponent(product.category)}`}
            className="hover:underline hover:text-amber-800"
          >
            {product.category}
          </Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-gray-800 font-medium truncate max-w-xs">{product.name}</span>
        </div>
      </div>

      <div className="max-w-[1500px] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Image Gallery (4 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-md h-96 sm:h-[450px] border border-gray-200 rounded-lg p-6 flex items-center justify-center bg-white shadow-sm overflow-hidden sticky top-24">
              <img
                src={selectedImage || product.image}
                alt={product.name}
                className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-110 cursor-zoom-in"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&q=80';
                }}
              />
            </div>

            {/* Thumbnail selector if additional images exist */}
            {product.images && product.images.length > 0 && (
              <div className="flex gap-2 mt-4 overflow-x-auto p-1 max-w-md">
                <button
                  onClick={() => setSelectedImage(product.image)}
                  className={`w-14 h-14 border rounded p-1 flex-shrink-0 bg-white ${
                    selectedImage === product.image ? 'border-amber-500 ring-2 ring-amber-300' : 'border-gray-200'
                  }`}
                >
                  <img src={product.image} alt="main" className="w-full h-full object-contain" />
                </button>
                {product.images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`w-14 h-14 border rounded p-1 flex-shrink-0 bg-white ${
                      selectedImage === imgUrl ? 'border-amber-500 ring-2 ring-amber-300' : 'border-gray-200'
                    }`}
                  >
                    <img src={imgUrl} alt={`gallery-${idx}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Center Column: Product Specs & Features (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div>
              <span className="text-xs font-semibold text-amazon-link hover:underline cursor-pointer uppercase tracking-wider">
                Visit the {product.brand || 'Amazon'} Store
              </span>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mt-1 leading-snug">
                {product.name}
              </h1>

              {/* Badges & Rating */}
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <RatingStars rating={product.rating || 4.5} reviews={product.numReviews || 0} size="md" />
                <span className="text-xs text-gray-400">|</span>
                <span className="text-xs text-gray-600 font-medium">1,000+ bought in past month</span>
              </div>

              {product.badge && (
                <div className="mt-2.5">
                  <span className="bg-amber-600 text-white text-xs font-bold px-2 py-0.5 rounded shadow-sm">
                    {product.badge}
                  </span>
                </div>
              )}
            </div>

            <div className="border-t border-b border-gray-200 py-3 space-y-1">
              <div className="flex items-baseline gap-3">
                {product.discount > 0 && (
                  <span className="text-red-700 text-2xl font-light">-{product.discount}%</span>
                )}
                <span className="text-3xl font-bold text-gray-950">
                  {formattedPrice(product.price)}
                </span>
              </div>

              {product.originalPrice > product.price && (
                <div className="text-xs text-gray-500">
                  M.R.P.: <span className="line-through">{formattedPrice(product.originalPrice)}</span>
                </div>
              )}
              <div className="text-xs text-gray-600 font-medium pt-1">
                Inclusive of all taxes
              </div>
            </div>

            {/* Value features / Guarantees */}
            <div className="grid grid-cols-3 gap-2 py-2 text-center text-xs text-gray-700">
              <div className="flex flex-col items-center p-2 rounded-lg bg-gray-50 border border-gray-100">
                <RotateCcw className="w-5 h-5 text-amber-600 mb-1" />
                <span className="font-semibold text-[11px]">7 Days Replacement</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-lg bg-gray-50 border border-gray-100">
                <Truck className="w-5 h-5 text-amber-600 mb-1" />
                <span className="font-semibold text-[11px]">Free Delivery</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-lg bg-gray-50 border border-gray-100">
                <ShieldCheck className="w-5 h-5 text-amber-600 mb-1" />
                <span className="font-semibold text-[11px]">1 Year Warranty</span>
              </div>
            </div>

            {/* About this item (Features) */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-bold text-gray-900 text-sm mb-2">About this item</h3>
              {product.features && product.features.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-700 leading-relaxed">
                  {product.features.map((feat, i) => (
                    <li key={i}>{feat}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-gray-700 leading-relaxed">{product.description}</p>
              )}
            </div>

            {/* Detailed Description */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-bold text-gray-900 text-sm mb-1">Product Description</h3>
              <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          </div>

          {/* Right Column: Buy Box (3 cols) */}
          <div className="lg:col-span-3">
            <div className="border border-gray-300 rounded-lg p-5 bg-white shadow-sm space-y-4 sticky top-24">
              <div>
                <span className="text-2xl font-bold text-gray-950">
                  {formattedPrice(product.price)}
                </span>
                <div className="text-xs text-amazon-link hover:underline cursor-pointer mt-1 font-medium">
                  FREE delivery <span className="font-bold text-gray-900">Tomorrow</span>. Order within 4 hrs.
                </div>
              </div>

              {/* In Stock / Out of Stock */}
              <div>
                {product.countInStock > 0 ? (
                  <span className="text-base font-bold text-emerald-700">In Stock</span>
                ) : (
                  <span className="text-base font-bold text-red-600">Currently Unavailable</span>
                )}
                {product.countInStock > 0 && product.countInStock <= 5 && (
                  <p className="text-xs text-red-600 font-semibold mt-1">
                    Only {product.countInStock} left in stock - order soon.
                  </p>
                )}
              </div>

              {/* Quantity Selector */}
              {product.countInStock > 0 && (
                <div className="flex items-center gap-2 text-xs">
                  <label htmlFor="qty-select" className="font-bold text-gray-700">
                    Quantity:
                  </label>
                  <select
                    id="qty-select"
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="border border-gray-300 bg-gray-100 hover:bg-gray-200 rounded px-2.5 py-1 font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                  >
                    {[...Array(Math.min(product.countInStock, 10))].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => addToCart(product, qty)}
                  disabled={product.countInStock === 0}
                  className={`w-full py-2.5 px-4 rounded-full text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition ${
                    product.countInStock > 0
                      ? 'bg-[#ffd814] hover:bg-[#f7ca00] text-gray-950 border border-[#fcd200] active:scale-95'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={product.countInStock === 0}
                  className={`w-full py-2.5 px-4 rounded-full text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition ${
                    product.countInStock > 0
                      ? 'bg-[#ffa41c] hover:bg-[#fa8900] text-gray-950 border border-[#ff8f00] active:scale-95'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  <span>Buy Now</span>
                </button>
              </div>

              {/* Transaction details */}
              <div className="text-[11px] text-gray-500 space-y-1.5 pt-2 border-t border-gray-200">
                <div className="flex items-center gap-1.5 text-gray-600">
                  <Lock className="w-3.5 h-3.5 text-gray-400" />
                  <span>Secure transaction</span>
                </div>
                <div className="flex justify-between">
                  <span>Ships from</span>
                  <span className="text-gray-800 font-medium">Amazon</span>
                </div>
                <div className="flex justify-between">
                  <span>Sold by</span>
                  <span className="text-gray-800 font-medium">{product.brand || 'Retailer'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
