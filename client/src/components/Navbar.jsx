import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search, ShoppingCart, MapPin, ChevronDown, User,
  Package, ShieldCheck, LogOut, Menu, X, Sparkles
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setKeyword(searchParams.get('keyword') || '');
    setCategory(searchParams.get('category') || 'All');
  }, [searchParams]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set('keyword', keyword.trim());
    if (category && category !== 'All') params.set('category', category);
    navigate(`/?${params.toString()}`);
  };

  const categories = [
    'All','Mobiles & Tablets','Laptops & Computers','Audio & Headphones',
    'Wearables & Smartwatches','Home & Kitchen','Fashion & Footwear','Books','Electronics',
  ];

  return (
    <header className={`sticky top-0 z-40 transition-shadow duration-200 ${scrolled ? 'shadow-nav' : ''}`}>
      {/* ── Top Bar ── */}
      <div className="bg-nav-gradient text-white">
        <div className="max-w-[1500px] mx-auto px-3 sm:px-5 py-2.5 flex items-center gap-3">

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-1.5 rounded hover:bg-white/10 transition"
            aria-label="Menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* ─ Logo ─ */}
          <Link to="/" className="flex items-center gap-1.5 flex-shrink-0 group">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shadow-md group-hover:bg-orange-400 transition">
              <ShoppingCart className="w-4.5 h-4.5 text-white w-[18px] h-[18px]" />
            </div>
            <span className="text-xl font-black tracking-tight leading-none">
              Cart<span className="text-orange-400">zy</span>
            </span>
          </Link>

          {/* ─ Delivery location (md+) ─ */}
          <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-white/10 cursor-pointer transition text-xs flex-shrink-0">
            <MapPin className="w-4 h-4 text-orange-300 mt-0.5" />
            <div className="leading-tight">
              <div className="text-slate-300 text-[11px]">
                {user ? `Deliver to ${user.name.split(' ')[0]}` : 'Deliver to'}
              </div>
              <div className="font-bold text-white text-[13px]">
                {user?.address?.city ? `${user.address.city} ${user.address.postalCode || ''}` : 'India'}
              </div>
            </div>
          </div>

          {/* ─ Search bar ─ */}
          <form
            onSubmit={handleSearch}
            className="flex-1 flex items-stretch h-10 rounded-xl overflow-hidden ring-2 ring-transparent focus-within:ring-orange-400 transition-all max-w-3xl"
          >
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="hidden sm:block bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold px-2.5 border-r border-slate-300 focus:outline-none cursor-pointer flex-shrink-0"
            >
              {categories.map(c => <option key={c} value={c}>{c === 'All' ? 'All Departments' : c}</option>)}
            </select>

            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search Cartzy..."
              className="flex-1 px-4 py-2 text-slate-900 text-sm bg-white placeholder-slate-400 focus:outline-none"
            />

            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 px-4 flex items-center justify-center transition flex-shrink-0"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-white" />
            </button>
          </form>

          {/* ─ Account dropdown ─ */}
          <div
            className="relative hidden sm:block"
            onMouseEnter={() => setIsAccountOpen(true)}
            onMouseLeave={() => setIsAccountOpen(false)}
          >
            <button className="flex flex-col items-start px-2 py-1 rounded-lg hover:bg-white/10 transition text-xs leading-tight cursor-pointer">
              <span className="text-slate-300 text-[11px]">
                {isAuthenticated ? `Hello, ${user.name.split(' ')[0]}` : 'Hello, sign in'}
              </span>
              <span className="flex items-center gap-0.5 font-bold text-white text-[13px]">
                Account <ChevronDown className="w-3 h-3 text-slate-300 mt-px" />
              </span>
            </button>

            {isAccountOpen && (
              <div className="absolute right-0 top-full pt-2 z-50 w-64">
                <div className="bg-white text-slate-800 rounded-xl border border-slate-200 shadow-2xl p-4 text-sm animate-slide-in-top">
                  {!isAuthenticated ? (
                    <div className="text-center pb-3 border-b border-slate-100">
                      <Link
                        to="/login"
                        onClick={() => setIsAccountOpen(false)}
                        className="block w-full py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition text-sm"
                      >
                        Sign In
                      </Link>
                      <p className="text-xs text-slate-500 mt-2">
                        New?{' '}
                        <Link to="/register" onClick={() => setIsAccountOpen(false)} className="text-orange-500 hover:underline font-semibold">
                          Create account
                        </Link>
                      </p>
                    </div>
                  ) : (
                    <div className="pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-black text-sm flex items-center justify-center uppercase flex-shrink-0">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{user.name}</p>
                          <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="py-2 space-y-0.5 text-xs">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 pt-1 pb-0.5">
                      Your Account
                    </p>
                    <Link to="/orders" onClick={() => setIsAccountOpen(false)}
                      className="flex items-center gap-2 px-2 py-2 hover:bg-slate-50 rounded-lg text-slate-700 transition">
                      <Package className="w-4 h-4 text-slate-400" /> Your Orders
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setIsAccountOpen(false)}
                        className="flex items-center gap-2 px-2 py-2 hover:bg-orange-50 rounded-lg text-orange-700 font-semibold transition">
                        <ShieldCheck className="w-4 h-4 text-orange-500" /> Seller Dashboard
                      </Link>
                    )}
                  </div>

                  {isAuthenticated && (
                    <div className="pt-2 border-t border-slate-100">
                      <button
                        onClick={() => { logout(); setIsAccountOpen(false); }}
                        className="flex items-center gap-2 w-full px-2 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ─ Orders link ─ */}
          <Link to="/orders"
            className="hidden lg:flex flex-col items-start px-2 py-1 rounded-lg hover:bg-white/10 transition text-xs leading-tight flex-shrink-0">
            <span className="text-slate-300 text-[11px]">Returns</span>
            <span className="font-bold text-white text-[13px]">& Orders</span>
          </Link>

          {/* ─ Cart ─ */}
          <Link to="/cart"
            className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-white/10 transition relative flex-shrink-0">
            <div className="relative">
              <ShoppingCart className="w-7 h-7 sm:w-8 sm:h-8" />
              {itemsCount > 0 && (
                <span className="absolute -top-1.5 left-4 min-w-[18px] h-[18px] bg-orange-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-0.5 leading-none shadow">
                  {itemsCount > 99 ? '99+' : itemsCount}
                </span>
              )}
            </div>
            <span className="hidden sm:block font-bold text-sm">Cart</span>
          </Link>
        </div>
      </div>

      {/* ── Mobile Slide Drawer ── */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="relative bg-white w-80 max-w-[90vw] h-full flex flex-col z-10 shadow-2xl overflow-y-auto">
            <div className="bg-nav-gradient text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-[18px] h-[18px] text-white" />
                </div>
                <span className="text-lg font-black">Cart<span className="text-orange-400">zy</span></span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10">
                <X className="w-5 h-5" />
              </button>
            </div>

            {isAuthenticated && (
              <div className="bg-orange-50 border-b border-orange-100 px-4 py-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-orange-500 text-white font-black text-base flex items-center justify-center uppercase">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">{user.name}</p>
                  <p className="text-[11px] text-slate-500">{user.email}</p>
                </div>
              </div>
            )}

            <div className="p-4 space-y-5 text-sm flex-1">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Shop by Category</p>
                <div className="space-y-0.5">
                  {categories.slice(1).map(cat => (
                    <button key={cat} onClick={() => { setIsMobileMenuOpen(false); navigate(`/?category=${encodeURIComponent(cat)}`); }}
                      className="block w-full text-left px-3 py-2.5 hover:bg-orange-50 hover:text-orange-700 rounded-lg text-slate-700 transition font-medium text-xs">
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Account</p>
                <div className="space-y-0.5">
                  <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-slate-50 rounded-lg text-slate-700 font-medium text-xs">
                    <Package className="w-4 h-4 text-slate-400" /> Your Orders
                  </Link>
                  <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-slate-50 rounded-lg text-slate-700 font-medium text-xs">
                    <ShoppingCart className="w-4 h-4 text-slate-400" /> Cart ({itemsCount})
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 bg-orange-50 text-orange-800 rounded-lg font-bold text-xs">
                      <ShieldCheck className="w-4 h-4 text-orange-500" /> Seller Dashboard
                    </Link>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100">
              {isAuthenticated ? (
                <button onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                  className="w-full py-2.5 bg-red-50 text-red-600 font-bold rounded-lg text-sm flex items-center justify-center gap-2">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              ) : (
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full py-2.5 bg-orange-500 text-white font-bold rounded-lg text-sm text-center">
                  Sign In to Cartzy
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
