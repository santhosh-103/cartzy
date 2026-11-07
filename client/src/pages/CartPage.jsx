import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, CheckCircle2, ShieldCheck, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CartPage = () => {
  const {
    cartItems,
    itemsCount,
    itemsPrice,
    totalSavings,
    shippingPrice,
    totalPrice,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const formattedPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  const handleProceedToBuy = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] bg-gray-100 py-12 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg border border-gray-200 p-8 sm:p-12 shadow-sm text-center">
          <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Cartzy Cart is empty</h2>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
            Your shopping cart is waiting. Give it purpose – fill it with groceries, clothing,
            household supplies, electronics and more.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/"
              className="w-full sm:w-auto px-6 py-2.5 bg-amber-400 hover:bg-amber-500 rounded-full font-bold text-sm text-gray-950 transition border border-amber-500"
            >
              Explore Today's Deals
            </Link>
            {!isAuthenticated && (
              <Link
                to="/login"
                className="w-full sm:w-auto px-6 py-2.5 bg-white hover:bg-gray-50 rounded-full font-semibold text-sm text-gray-800 border border-gray-300 transition"
              >
                Sign in to your account
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-3 sm:px-6">
      <div className="max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Cart Items List (8 cols) */}
        <div className="lg:col-span-8 bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Shopping Cart</h1>
              <p className="text-xs text-gray-500 mt-0.5">Deselect all items</p>
            </div>
            <span className="text-xs text-gray-500 font-medium">Price</span>
          </div>

          {/* Free delivery notice bar */}
          <div className="py-3 px-3 my-4 bg-emerald-50 border border-emerald-200 rounded-md flex items-center gap-2 text-xs text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>
              Your order is eligible for <strong>FREE Delivery</strong>. Select this option at checkout.
            </span>
          </div>

          {/* Cart Items */}
          <div className="divide-y divide-gray-200">
            {cartItems.map((item) => (
              <div key={item.product} className="py-5 flex flex-col sm:flex-row gap-4 items-start">
                
                {/* Product Image */}
                <Link
                  to={`/product/${item.product}`}
                  className="w-28 h-28 sm:w-36 sm:h-36 flex-shrink-0 bg-white p-2 border border-gray-100 rounded overflow-hidden flex items-center justify-center self-center sm:self-start"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between h-full w-full">
                  <div>
                    <div className="flex justify-between items-start gap-4">
                      <Link
                        to={`/product/${item.product}`}
                        className="text-base font-medium text-gray-900 hover:text-amber-700 line-clamp-2 leading-snug transition"
                      >
                        {item.name}
                      </Link>
                      <span className="text-lg font-bold text-gray-950 whitespace-nowrap">
                        {formattedPrice(item.price * item.qty)}
                      </span>
                    </div>

                    <div className="text-xs text-emerald-700 font-semibold mt-1">In Stock</div>

                    {item.isPrime && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                        <span className="text-blue-600 font-black italic tracking-tighter">
                          prime
                        </span>
                        <span className="text-[11px]">Eligible for FREE Shipping</span>
                      </div>
                    )}
                  </div>

                  {/* Quantity Controls & Actions */}
                  <div className="mt-4 flex flex-wrap items-center gap-4 text-xs">
                    {/* Quantity Selector / Buttons */}
                    <div className="flex items-center border border-gray-300 rounded-md overflow-hidden bg-gray-50">
                      <button
                        onClick={() => updateQuantity(item.product, item.qty - 1)}
                        className="p-1.5 hover:bg-gray-200 text-gray-600 transition"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 py-1 font-bold text-gray-900 text-xs bg-white min-w-[32px] text-center border-x border-gray-300">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product, item.qty + 1)}
                        className="p-1.5 hover:bg-gray-200 text-gray-600 transition"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="text-gray-300">|</span>

                    {/* Delete button */}
                    <button
                      onClick={() => removeFromCart(item.product)}
                      className="text-amazon-link hover:underline font-medium flex items-center gap-1 text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Footer */}
          <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-2">
            <button
              onClick={clearCart}
              className="text-xs text-red-600 hover:underline font-semibold"
            >
              Clear Entire Cart
            </button>
            <div className="text-base text-gray-900 font-medium">
              Subtotal ({itemsCount} {itemsCount === 1 ? 'item' : 'items'}):{' '}
              <span className="font-bold text-lg text-gray-950">{formattedPrice(itemsPrice)}</span>
            </div>
          </div>
        </div>

        {/* Right: Subtotal & Checkout Card (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-4 sticky top-24">
            
            {/* Free Delivery Banner */}
            <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>
                Part of your order qualifies for <strong>FREE Delivery</strong>.
              </span>
            </div>

            {/* Subtotal */}
            <div>
              <div className="text-base text-gray-900 font-medium">
                Subtotal ({itemsCount} {itemsCount === 1 ? 'item' : 'items'}):
              </div>
              <div className="text-2xl font-bold text-gray-950 mt-1">
                {formattedPrice(itemsPrice)}
              </div>
              {totalSavings > 0 && (
                <div className="text-xs text-emerald-700 font-semibold mt-1">
                  You save {formattedPrice(totalSavings)} on this order!
                </div>
              )}
            </div>

            {/* Proceed to Buy Button */}
            <button
              onClick={handleProceedToBuy}
              className="w-full py-2.5 px-4 rounded-full text-xs font-bold bg-[#ffd814] hover:bg-[#f7ca00] text-gray-950 border border-[#fcd200] shadow-sm transition active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Proceed to Buy</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Security note */}
            <div className="text-[11px] text-gray-500 flex items-center gap-1.5 justify-center pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Safe and Secure Payments</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
