import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Filter, SlidersHorizontal, ChevronRight, RotateCcw,
  ChevronLeft, Sparkles, Smartphone, Laptop, Headphones,
  Watch, Home, Shirt, BookOpen, Cpu, TrendingUp
} from 'lucide-react';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';

const HERO_SLIDES = [
  {
    tag: '🔥 Mega Sale', title: 'Up to 70% Off', sub: 'On Electronics, Mobiles, Fashion & More',
    bg: 'from-[#0f1c3a] via-[#1a3a6a] to-[#0a2550]', accent: 'text-orange-400',
  },
  {
    tag: '📱 New Arrivals', title: 'Next-Gen Smartphones', sub: 'iPhone 15, Samsung S24 Ultra & more with No Cost EMI',
    bg: 'from-[#1a0a3a] via-[#2d1a6a] to-[#0d0a40]', accent: 'text-purple-400',
  },
  {
    tag: '💻 Work From Home', title: 'Laptops & Accessories', sub: 'MacBook Air M2, premium mice, keyboards & monitors',
    bg: 'from-[#0a2a1a] via-[#0f4a2a] to-[#062015]', accent: 'text-emerald-400',
  },
];

const CATEGORIES = [
  { label: 'Mobiles', query: 'Mobiles & Tablets', icon: Smartphone, color: 'bg-blue-100 text-blue-600' },
  { label: 'Laptops', query: 'Laptops & Computers', icon: Laptop, color: 'bg-indigo-100 text-indigo-600' },
  { label: 'Audio', query: 'Audio & Headphones', icon: Headphones, color: 'bg-purple-100 text-purple-600' },
  { label: 'Wearables', query: 'Wearables & Smartwatches', icon: Watch, color: 'bg-rose-100 text-rose-600' },
  { label: 'Home & Kitchen', query: 'Home & Kitchen', icon: Home, color: 'bg-amber-100 text-amber-600' },
  { label: 'Fashion', query: 'Fashion & Footwear', icon: Shirt, color: 'bg-pink-100 text-pink-600' },
  { label: 'Books', query: 'Books', icon: BookOpen, color: 'bg-green-100 text-green-600' },
  { label: 'Electronics', query: 'Electronics', icon: Cpu, color: 'bg-cyan-100 text-cyan-600' },
];

const CATEGORY_LIST = ['All', ...CATEGORIES.map(c => c.query)];
const CATEGORY_LABELS = { All: 'All', ...Object.fromEntries(CATEGORIES.map(c => [c.query, c.label])) };

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [slideIdx, setSlideIdx] = useState(0);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const keyword  = searchParams.get('keyword')  || '';
  const category = searchParams.get('category') || 'All';
  const sortBy   = searchParams.get('sortBy')   || 'featured';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const rating   = searchParams.get('rating')   || '';

  // Hero auto-slide
  useEffect(() => {
    const t = setInterval(() => setSlideIdx(i => (i + 1) % HERO_SLIDES.length), 5500);
    return () => clearInterval(t);
  }, []);

  // Fetch products
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const q = new URLSearchParams();
        if (keyword) q.set('keyword', keyword);
        if (category && category !== 'All') q.set('category', category);
        if (sortBy) q.set('sortBy', sortBy);
        if (minPrice) q.set('minPrice', minPrice);
        if (maxPrice) q.set('maxPrice', maxPrice);
        if (rating) q.set('rating', rating);
        q.set('page', page); q.set('limit', 8);
        const { data } = await api.get(`/api/products?${q}`);
        setProducts(data.products || []);
        setPages(data.pages || 1);
        setTotal(data.total || 0);
      } catch { setProducts([]); }
      finally { setLoading(false); }
    };
    fetch();
  }, [keyword, category, sortBy, minPrice, maxPrice, rating, page]);

  const updateFilter = (updates) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => {
      if (!v || v === '' || v === 'All') next.delete(k); else next.set(k, v);
    });
    next.set('page', '1'); setPage(1); setSearchParams(next);
  };
  const resetFilters = () => { setPriceRange({ min: '', max: '' }); setSearchParams({}); setPage(1); };
  const hasFilters = !!(keyword || (category && category !== 'All') || minPrice || maxPrice || rating);

  const slide = HERO_SLIDES[slideIdx];

  return (
    <div className="min-h-screen bg-slate-100">

      {/* ── Hero Banner (hidden when searching) ── */}
      {!keyword && (
        <div className={`relative overflow-hidden bg-gradient-to-br ${slide.bg} transition-colors duration-700`}>
          <div className="max-w-[1500px] mx-auto px-6 sm:px-10 py-14 sm:py-24 relative z-10">
            <span className={`inline-block text-xs font-black uppercase tracking-widest bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full mb-3 ${slide.accent}`}>
              {slide.tag}
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight mb-3">
              {slide.title}
            </h1>
            <p className="text-slate-300 text-sm sm:text-lg max-w-lg mb-6">{slide.sub}</p>
            <button
              onClick={() => navigate('/?sortBy=price-low')}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 text-sm"
            >
              Shop Now →
            </button>
          </div>

          {/* Slide dots */}
          <div className="absolute bottom-4 right-6 flex gap-2">
            {HERO_SLIDES.map((_, i) => (
              <button key={i} onClick={() => setSlideIdx(i)}
                className={`h-2 rounded-full transition-all ${i === slideIdx ? 'w-7 bg-orange-400' : 'w-2 bg-white/30'}`} />
            ))}
          </div>

          {/* Decorative circles */}
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -left-10 bottom-0 w-60 h-60 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        </div>
      )}

      {/* ── Category Tiles (homepage only) ── */}
      {!keyword && category === 'All' && (
        <div className="max-w-[1500px] mx-auto px-3 sm:px-5 pt-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-card">
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4">Shop by Category</h2>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
              {CATEGORIES.map(({ label, query, icon: Icon, color }) => (
                <button key={query} onClick={() => updateFilter({ category: query })}
                  className="flex flex-col items-center gap-2 group">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center ${color} group-hover:scale-110 transition-transform shadow-sm`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-semibold text-slate-600 text-center leading-tight">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Main Container ── */}
      <div className="max-w-[1500px] mx-auto px-3 sm:px-5 py-6">

        {/* ── Filter bar / Result header ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-4 mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-black text-slate-900">
              {keyword ? (
                <>Results for <span className="text-orange-500">"{keyword}"</span></>
              ) : category && category !== 'All' ? (
                <>Category: <span className="text-orange-500">{CATEGORY_LABELS[category] || category}</span></>
              ) : (
                <>Featured Products & <span className="text-orange-500">Hot Deals</span></>
              )}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Showing {products.length > 0 ? (page - 1) * 8 + 1 : 0}–{Math.min(page * 8, total)} of {total} products
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <button onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700">
              <SlidersHorizontal className="w-4 h-4" /> Filters {hasFilters && <span className="bg-orange-500 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center">!</span>}
            </button>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">Sort:</span>
              <select value={sortBy} onChange={(e) => updateFilter({ sortBy: e.target.value })}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none cursor-pointer text-slate-700">
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
                <option value="rating">Best Rated</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── Sidebar + Products ── */}
        <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-5 items-start">

          {/* Sidebar filters */}
          <aside className={`lg:col-span-1 bg-white rounded-2xl border border-slate-200 shadow-card p-4 text-xs space-y-5 ${mobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-black text-sm text-slate-900 flex items-center gap-2">
                <Filter className="w-4 h-4 text-orange-500" /> Filters
              </span>
              {hasFilters && (
                <button onClick={resetFilters} className="text-xs text-orange-500 hover:underline font-semibold flex items-center gap-1">
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              )}
            </div>

            {/* Department */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Department</p>
              <ul className="space-y-0.5">
                {CATEGORY_LIST.map(cat => (
                  <li key={cat}>
                    <button onClick={() => updateFilter({ category: cat })}
                      className={`w-full text-left px-2.5 py-2 rounded-lg transition flex items-center justify-between ${
                        (category === cat) || (cat === 'All' && !category)
                          ? 'bg-orange-50 font-bold text-orange-700'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}>
                      <span>{CATEGORY_LABELS[cat] || cat}</span>
                      {category === cat && <ChevronRight className="w-3 h-3 text-orange-500" />}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price */}
            <div className="border-t border-slate-100 pt-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Price Range (₹)</p>
              <div className="space-y-1 mb-3">
                {[
                  { l: 'Under ₹1,000', mn: 0, mx: 1000 },
                  { l: '₹1,000 – ₹10,000', mn: 1000, mx: 10000 },
                  { l: '₹10,000 – ₹50,000', mn: 10000, mx: 50000 },
                  { l: 'Over ₹50,000', mn: 50000, mx: '' },
                ].map(({ l, mn, mx }) => (
                  <button key={l} onClick={() => updateFilter({ minPrice: mn, maxPrice: mx })}
                    className={`block w-full text-left px-2.5 py-1.5 rounded-lg transition ${
                      minPrice === String(mn) && maxPrice === String(mx)
                        ? 'bg-orange-50 text-orange-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
                    }`}>{l}</button>
                ))}
              </div>
              <form onSubmit={(e) => { e.preventDefault(); updateFilter({ minPrice: priceRange.min, maxPrice: priceRange.max }); }}
                className="flex items-center gap-1.5">
                <input type="number" placeholder="Min" value={priceRange.min} onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  className="w-20 px-2 py-1.5 border border-slate-300 rounded-lg text-xs" />
                <span className="text-slate-300">—</span>
                <input type="number" placeholder="Max" value={priceRange.max} onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  className="w-20 px-2 py-1.5 border border-slate-300 rounded-lg text-xs" />
                <button type="submit" className="px-2.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition text-xs">Go</button>
              </form>
            </div>

            {/* Customer Review */}
            <div className="border-t border-slate-100 pt-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Customer Reviews</p>
              {[4, 3, 2].map(r => (
                <button key={r} onClick={() => updateFilter({ rating: r })}
                  className={`flex items-center gap-1.5 w-full px-2.5 py-1.5 rounded-lg transition ${rating === String(r) ? 'bg-amber-50 text-amber-800 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}>
                  <span className="text-amber-400">{'★'.repeat(r)}{'☆'.repeat(5 - r)}</span>
                  <span className="text-xs">& Up</span>
                </button>
              ))}
            </div>

            {/* Prime badge */}
            <div className="border-t border-slate-100 pt-4">
              <div className="flex items-center gap-2 p-3 bg-sky-50 border border-sky-200 rounded-xl">
                <span className="text-sky-600 font-black italic text-sm tracking-tighter">prime</span>
                <span className="text-xs text-sky-900 font-medium">Free Delivery Eligible</span>
              </div>
            </div>
          </aside>

          {/* Product grid */}
          <main className="lg:col-span-3 xl:col-span-4">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
                    <div className="h-52 bg-slate-100" />
                    <div className="p-4 space-y-3">
                      <div className="h-3 bg-slate-100 rounded w-1/3" />
                      <div className="h-4 bg-slate-100 rounded w-4/5" />
                      <div className="h-3 bg-slate-100 rounded w-3/5" />
                      <div className="h-6 bg-slate-100 rounded w-2/5" />
                      <div className="h-9 bg-slate-100 rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-14 text-center">
                <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-1">No products found</h3>
                <p className="text-sm text-slate-400 max-w-sm mx-auto mb-5">
                  Try adjusting your filters or search with different keywords.
                </p>
                <button onClick={resetFilters} className="cz-btn-primary">Clear All Filters</button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {products.map(p => <ProductCard key={p._id} product={p} />)}
                </div>

                {pages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-2">
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                      className={`flex items-center gap-1 px-4 py-2 rounded-xl border text-xs font-semibold transition ${page === 1 ? 'border-slate-100 text-slate-300 bg-white cursor-not-allowed' : 'border-slate-200 text-slate-700 bg-white hover:bg-slate-50'}`}>
                      <ChevronLeft className="w-4 h-4" /> Prev
                    </button>
                    {[...Array(pages)].map((_, i) => {
                      const n = i + 1;
                      return (
                        <button key={n} onClick={() => setPage(n)}
                          className={`w-9 h-9 rounded-xl border text-xs font-black transition ${page === n ? 'bg-orange-500 border-orange-500 text-white shadow-md' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
                          {n}
                        </button>
                      );
                    })}
                    <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
                      className={`flex items-center gap-1 px-4 py-2 rounded-xl border text-xs font-semibold transition ${page === pages ? 'border-slate-100 text-slate-300 bg-white cursor-not-allowed' : 'border-slate-200 text-slate-700 bg-white hover:bg-slate-50'}`}>
                      Next <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
