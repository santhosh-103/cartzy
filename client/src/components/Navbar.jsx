import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  MapPin,
  ChevronDown,
  User,
  Package,
  ShieldCheck,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemsCount } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('All');
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const q = searchParams.get('keyword') || '';
    const cat = searchParams.get('category') || 'All';
    setKeyword(q);
    setCategory(cat);
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set('keyword', keyword.trim());
    if (category && category !== 'All') params.set('category', category);
    navigate(`/?${params.toString()}`);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#131921] text-white select-none">
      {/* Top Navbar */}
      <div className="max-w-[1500px] mx-auto px-3 sm:px-4 py-2 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Mobile menu trigger */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="lg:hidden p-1.5 hover:border border-white rounded transition"
          aria-label="Open navigation menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Amazon Logo */}
        <Link
          to="/"
          className="flex items-center gap-0.5 p-1.5 hover:border border-white rounded transition group flex-shrink-0"
        >
          <span className="text-xl sm:text-2xl font-black tracking-tight flex items-baseline">
            amazon<span className="text-amber-400 text-xs sm:text-sm font-semibold tracking-normal">.in</span>
          </span>
        </Link>

        {/* Delivery Location Pill (Hidden on mobile) */}
        <div className="hidden md:flex items-center gap-1.5 p-1.5 hover:border border-white rounded cursor-pointer transition text-xs flex-shrink-0">
          <MapPin className="w-4 h-4 text-gray-300 mt-1" />
          <div className="flex flex-col leading-tight">
            <span className="text-gray-300 text-[11px]">
              {user ? `Deliver to ${user.name.split(' ')[0]}` : 'Delivering to Bengaluru'}
            </span>
            <span className="font-bold text-white text-[13px]">
              {user?.address?.city ? `${user.address.city} ${user.address.postalCode || ''}` : '560001'}
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="flex-1 flex items-center h-10 rounded-md overflow-hidden bg-white shadow-inner focus-within:ring-2 focus-within:ring-amber-500 max-w-3xl"
        >
          {/* Category dropdown */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="hidden sm:block h-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs px-2.5 border-r border-gray-300 focus:outline-none cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="Mobiles & Tablets">Mobiles & Tablets</option>
            <option value="Laptops & Computers">Laptops & Computers</option>
            <option value="Audio & Headphones">Audio & Headphones</option>
            <option value="Wearables & Smartwatches">Wearables</option>
            <option value="Home & Kitchen">Home & Kitchen</option>
            <option value="Fashion & Footwear">Fashion</option>
            <option value="Books">Books</option>
            <option value="Electronics">Electronics</option>
          </select>

          {/* Search Input */}
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search Amazon.in"
            className="flex-1 px-3 py-1.5 text-gray-900 text-sm focus:outline-none h-full placeholder-gray-500"
          />

          {/* Search Button */}
          <button
            type="submit"
            className="bg-[#febd69] hover:bg-[#f3a847] h-full px-4 flex items-center justify-center text-gray-900 transition flex-shrink-0"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>
        </form>

        {/* Language selector (Flag 🇮🇳 EN) */}
        <div className="hidden lg:flex items-center gap-1 p-1.5 hover:border border-white rounded cursor-pointer transition text-xs font-bold">
          <span className="text-base">🇮🇳</span>
          <span>EN</span>
          <ChevronDown className="w-3 h-3 text-gray-400" />
        </div>

        {/* Account & Lists Dropdown */}
        <div
          className="relative"
          onMouseEnter={() => setIsAccountOpen(true)}
          onMouseLeave={() => setIsAccountOpen(false)}
        >
          <div className="p-1.5 hover:border border-white rounded cursor-pointer transition text-xs flex flex-col justify-center leading-tight">
            <span className="text-[11px] text-gray-300">
              {isAuthenticated ? `Hello, ${user.name.split(' ')[0]}` : 'Hello, sign in'}
            </span>
            <div className="flex items-center font-bold text-white text-[13px]">
              <span>Account & Lists</span>
              <ChevronDown className="w-3 h-3 ml-0.5 text-gray-300" />
            </div>
          </div>

          {/* Hover Menu */}
          {isAccountOpen && (
            <div className="absolute right-0 top-full pt-1 z-50 w-64 shadow-2xl animate-in fade-in zoom-in-95 duration-100">
              <div className="bg-white text-gray-900 rounded-md border border-gray-200 p-4 text-sm shadow-xl">
                {!isAuthenticated ? (
                  <div className="text-center pb-3 border-b border-gray-200">
                    <Link
                      to="/login"
                      onClick={() => setIsAccountOpen(false)}
                      className="block w-full py-2 bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b] hover:from-[#f5d78e] hover:to-[#eeb933] border border-[#a88734] rounded text-center font-medium shadow-sm text-gray-900 text-xs"
                    >
                      Sign In
                    </Link>
                    <p className="text-xs text-gray-600 mt-2">
                      New customer?{' '}
                      <Link
                        to="/register"
                        onClick={() => setIsAccountOpen(false)}
                        className="text-amazon-link hover:underline font-semibold"
                      >
                        Start here.
                      </Link>
                    </p>
                  </div>
                ) : (
                  <div className="pb-3 border-b border-gray-200">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="font-bold text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                )}

                <div className="py-2 space-y-1 text-xs">
                  <div className="font-bold text-gray-800 text-[11px] uppercase tracking-wider mb-1">
                    Your Account
                  </div>
                  <Link
                    to="/orders"
                    onClick={() => setIsAccountOpen(false)}
                    className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded text-gray-700"
                  >
                    <Package className="w-4 h-4 text-gray-500" />
                    <span>Your Orders</span>
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsAccountOpen(false)}
                      className="flex items-center gap-2 p-1.5 hover:bg-amber-50 rounded text-amber-800 font-semibold"
                    >
                      <ShieldCheck className="w-4 h-4 text-amber-600" />
                      <span>Admin Seller Panel</span>
                    </Link>
                  )}
                </div>

                {isAuthenticated && (
                  <div className="pt-2 border-t border-gray-200">
                    <button
                      onClick={() => {
                        logout();
                        setIsAccountOpen(false);
                      }}
                      className="flex items-center gap-2 w-full p-1.5 text-xs text-red-600 hover:bg-red-50 rounded"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Returns & Orders */}
        <Link
          to="/orders"
          className="hidden md:flex flex-col justify-center p-1.5 hover:border border-white rounded transition text-xs leading-tight flex-shrink-0"
        >
          <span className="text-[11px] text-gray-300">Returns</span>
          <span className="font-bold text-white text-[13px]">& Orders</span>
        </Link>

        {/* Shopping Cart */}
        <Link
          to="/cart"
          className="flex items-end gap-1 p-1.5 hover:border border-white rounded transition relative flex-shrink-0"
        >
          <div className="relative">
            <ShoppingCart className="w-7 h-7 sm:w-8 sm:h-8" />
            <span className="absolute -top-1 left-3 sm:left-4 font-black text-amber-400 text-xs sm:text-sm px-1 leading-none">
              {itemsCount}
            </span>
          </div>
          <span className="hidden sm:inline font-bold text-xs sm:text-sm text-white mb-0.5">
            Cart
          </span>
        </Link>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div className="relative bg-white text-gray-900 w-80 max-w-[85%] h-full flex flex-col z-10 shadow-2xl">
            {/* Header */}
            <div className="bg-[#232f3e] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-6 h-6 text-amber-400" />
                <span className="font-bold text-base">
                  {isAuthenticated ? `Hello, ${user.name}` : 'Hello, Sign In'}
                </span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 hover:bg-gray-700 rounded text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Links */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
              <div>
                <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-2 text-gray-500">
                  Shop By Category
                </h3>
                <div className="space-y-1">
                  {[
                    'Mobiles & Tablets',
                    'Laptops & Computers',
                    'Audio & Headphones',
                    'Wearables & Smartwatches',
                    'Home & Kitchen',
                    'Fashion & Footwear',
                    'Books',
                    'Electronics'
                  ].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        navigate(`/?category=${encodeURIComponent(cat)}`);
                      }}
                      className="block w-full text-left py-2 px-2 hover:bg-gray-100 rounded text-gray-800"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t pt-3">
                <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-2 text-gray-500">
                  Your Account
                </h3>
                <div className="space-y-1">
                  <Link
                    to="/orders"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 py-2 px-2 hover:bg-gray-100 rounded text-gray-800"
                  >
                    <Package className="w-4 h-4 text-gray-500" />
                    <span>Your Orders</span>
                  </Link>
                  <Link
                    to="/cart"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 py-2 px-2 hover:bg-gray-100 rounded text-gray-800"
                  >
                    <ShoppingCart className="w-4 h-4 text-gray-500" />
                    <span>Your Cart ({itemsCount})</span>
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2 py-2 px-2 bg-amber-50 text-amber-900 font-semibold rounded"
                    >
                      <ShieldCheck className="w-4 h-4 text-amber-600" />
                      <span>Admin Seller Panel</span>
                    </Link>
                  )}
                </div>
              </div>

              <div className="border-t pt-3">
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left py-2 px-2 text-red-600 font-medium hover:bg-red-50 rounded"
                  >
                    Sign Out
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full py-2 bg-amber-400 text-center font-bold text-gray-900 rounded"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
