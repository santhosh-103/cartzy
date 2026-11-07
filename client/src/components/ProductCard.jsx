import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Check } from 'lucide-react';
import RatingStars from './RatingStars';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const formattedPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="bg-white rounded-md border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group p-4 relative">
      
      {/* Badge (Best Seller, Deal of the Day, Amazon's Choice) */}
      {product.badge && (
        <div className="absolute top-2 left-2 z-10">
          <span
            className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded shadow-sm text-white uppercase tracking-wider ${
              product.badge === 'Deal of the Day'
                ? 'bg-red-600'
                : product.badge === 'Best Seller'
                ? 'bg-amber-600'
                : product.badge === "Amazon's Choice"
                ? 'bg-gray-900'
                : 'bg-orange-600'
            }`}
          >
            {product.badge}
          </span>
        </div>
      )}

      {/* Product Image */}
      <div className="pt-4 pb-2">
        <Link
          to={`/product/${product._id}`}
          className="block w-full h-48 sm:h-52 overflow-hidden flex items-center justify-center relative bg-white"
        >
          <img
            src={product.image}
            alt={product.name}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&q=80';
            }}
          />
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between mt-2">
        <div>
          {/* Brand */}
          <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-0.5">
            {product.brand || 'Brand'}
          </div>

          {/* Name */}
          <Link
            to={`/product/${product._id}`}
            className="text-sm font-medium text-gray-900 hover:text-amber-700 line-clamp-2 leading-snug mb-1.5 transition"
            title={product.name}
          >
            {product.name}
          </Link>

          {/* Ratings */}
          <div className="mb-2">
            <RatingStars rating={product.rating || 4.5} reviews={product.numReviews || 0} />
          </div>

          {/* Pricing */}
          <div className="space-y-1 mb-2">
            <div className="flex items-baseline gap-2 flex-wrap">
              {product.discount > 0 && (
                <span className="bg-red-700 text-white text-[11px] font-bold px-1.5 py-0.5 rounded">
                  {product.discount}% off
                </span>
              )}
              <span className="text-xl font-bold text-gray-950">
                {formattedPrice(product.price)}
              </span>
            </div>

            {product.originalPrice > product.price && (
              <div className="text-xs text-gray-500">
                M.R.P.: <span className="line-through">{formattedPrice(product.originalPrice)}</span>
              </div>
            )}
          </div>

          {/* Prime Tag */}
          {product.isPrime && (
            <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-2">
              <span className="text-blue-600 font-black italic tracking-tighter text-sm">
                prime
              </span>
              <span className="text-[11px]">FREE Delivery Tomorrow</span>
            </div>
          )}

          {/* Stock Indicator */}
          {product.countInStock > 0 && product.countInStock <= 5 && (
            <div className="text-xs font-semibold text-red-600 mb-2">
              Only {product.countInStock} left in stock - order soon.
            </div>
          )}

          {product.countInStock === 0 && (
            <div className="text-xs font-semibold text-red-600 mb-2">
              Currently Unavailable.
            </div>
          )}
        </div>

        {/* Add to Cart Button */}
        <div className="mt-3">
          <button
            onClick={() => addToCart(product, 1)}
            disabled={product.countInStock === 0}
            className={`w-full py-1.5 px-3 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition ${
              product.countInStock > 0
                ? 'bg-amber-400 hover:bg-amber-500 text-gray-900 border border-amber-500 active:scale-95'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>{product.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
