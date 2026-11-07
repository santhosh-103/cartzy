import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Zap } from 'lucide-react';
import RatingStars from './RatingStars';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const fmt = (price) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

  const badgeStyle = {
    'Best Seller': 'bg-orange-500 text-white',
    'Deal of the Day': 'bg-red-600 text-white',
    "Amazon's Choice": 'bg-slate-800 text-white',
    'Limited Time Deal': 'bg-purple-700 text-white',
  }[product.badge] || 'bg-slate-700 text-white';

  return (
    <div className="cz-card flex flex-col h-full group overflow-hidden">
      {/* Image area */}
      <Link to={`/product/${product._id}`} className="relative block overflow-hidden bg-slate-50 rounded-t-2xl">
        {product.badge && (
          <span className={`absolute top-2.5 left-2.5 z-10 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md shadow ${badgeStyle}`}>
            {product.badge}
          </span>
        )}
        {product.discount > 0 && (
          <span className="absolute top-2.5 right-2.5 z-10 bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md shadow">
            -{product.discount}%
          </span>
        )}
        <div className="h-52 flex items-center justify-center p-4">
          <img
            src={product.image}
            alt={product.name}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&q=80'; }}
          />
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{product.brand}</div>

        <Link to={`/product/${product._id}`} className="text-sm font-semibold text-slate-800 hover:text-orange-600 line-clamp-2 leading-snug transition-colors" title={product.name}>
          {product.name}
        </Link>

        <RatingStars rating={product.rating || 4.5} reviews={product.numReviews || 0} />

        {/* Pricing */}
        <div className="mt-auto space-y-1 pt-1">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-slate-900">{fmt(product.price)}</span>
          </div>
          {product.originalPrice > product.price && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span>M.R.P.</span>
              <span className="line-through">{fmt(product.originalPrice)}</span>
              <span className="text-emerald-600 font-semibold">Save {fmt(product.originalPrice - product.price)}</span>
            </div>
          )}

          {product.isPrime && (
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <span className="text-sky-600 font-black italic text-sm tracking-tighter">prime</span>
              <span>FREE Tomorrow</span>
            </div>
          )}

          {product.countInStock > 0 && product.countInStock <= 5 && (
            <p className="text-[11px] text-red-500 font-semibold">Only {product.countInStock} left!</p>
          )}
        </div>

        {/* CTA */}
        <button
          onClick={() => addToCart(product, 1)}
          disabled={product.countInStock === 0}
          className={`mt-2 w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
            product.countInStock > 0
              ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-sm hover:shadow-md'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          {product.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
