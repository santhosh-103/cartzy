import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, ChevronRight, RotateCcw, ChevronLeft, Sparkles } from 'lucide-react';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';

const banners = [
  {
    title: 'Great Republic Day Sale',
    subtitle: 'Up to 70% off on Electronics, Mobiles & more',
    bg: 'from-amber-600 via-orange-500 to-amber-700',
    tag: 'LIMITED TIME DEALS',
  },
  {
    title: 'Next-Gen Smartphones',
    subtitle: 'iPhone 15 & Samsung S24 Ultra with No Cost EMI',
    bg: 'from-blue-700 via-indigo-600 to-sky-700',
    tag: 'LATEST LAUNCHES',
  },
  {
    title: 'Laptops & Workstations',
    subtitle: 'MacBook Air M2 & High Performance PC Accessories',
    bg: 'from-emerald-700 via-teal-600 to-cyan-700',
    tag: 'UP TO 40% OFF',
  },
];

const categoryList = [
  'All',
  'Mobiles & Tablets',
  'Laptops & Computers',
  'Audio & Headphones',
  'Wearables & Smartwatches',
  'Home & Kitchen',
  'Fashion & Footwear',
  'Books',
  'Electronics',
];

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [currentBanner, setCurrentBanner] = useState(0);

  // Filters state from URL query
  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || 'All';
  const sortBy = searchParams.get('sortBy') || 'featured';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const rating = searchParams.get('rating') || '';

  // Local filter states for inputs
  const [priceRange, setPriceRange] = useState({ min: minPrice, max: maxPrice });
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Banner auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (keyword) query.set('keyword', keyword);
        if (category && category !== 'All') query.set('category', category);
        if (sortBy) query.set('sortBy', sortBy);
        if (minPrice) query.set('minPrice', minPrice);
        if (maxPrice) query.set('maxPrice', maxPrice);
        if (rating) query.set('rating', rating);
        query.set('page', page);
        query.set('limit', 8);

        const { data } = await api.get(`/api/products?${query.toString()}`);
        setProducts(data.products || []);
        setPages(data.pages || 1);
        setTotal(data.total || 0);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [keyword, category, sortBy, minPrice, maxPrice, rating, page]);

  // Update query params
  const updateFilter = (updates) => {
    const nextParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === undefined || val === '' || val === 'All') {
        nextParams.delete(key);
      } else {
        nextParams.set(key, val);
      }
    });
    nextParams.set('page', '1');
    setPage(1);
    setSearchParams(nextParams);
  };

  const handlePriceApply = (e) => {
    e.preventDefault();
    updateFilter({ minPrice: priceRange.min, maxPrice: priceRange.max });
  };

  const resetFilters = () => {
    setPriceRange({ min: '', max: '' });
    setSearchParams({});
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Carousel Banner */}
      {!keyword && (
        <div className="relative overflow-hidden bg-gradient-to-r text-white transition-all duration-700 shadow-md">
          <div
            className={`bg-gradient-to-r ${banners[currentBanner].bg} py-12 sm:py-20 px-6 sm:px-12 flex flex-col justify-center items-start min-h-[220px] sm:min-h-[280px] relative`}
          >
            <div className="max-w-[1400px] mx-auto w-full">
              <span className="inline-block bg-white/20 backdrop-blur-md text-amber-200 text-xs sm:text-sm font-black tracking-widest px-3 py-1 rounded-full uppercase mb-2">
                {banners[currentBanner].tag}
              </span>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight mb-2 drop-shadow-md">
                {banners[currentBanner].title}
              </h1>
              <p className="text-sm sm:text-lg text-gray-100 max-w-xl font-medium drop-shadow">
                {banners[currentBanner].subtitle}
              </p>
            </div>

            {/* Slider controls */}
            <div className="absolute bottom-3 right-6 flex items-center gap-2">
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentBanner(i)}
                  className={`h-2.5 rounded-full transition-all ${
                    currentBanner === i ? 'w-8 bg-amber-400' : 'w-2.5 bg-white/50'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-[1500px] mx-auto px-3 sm:px-4 py-6">
        
        {/* Search header / Status */}
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {keyword ? (
                <span>
                  Results for <span className="text-amber-600 font-extrabold">"{keyword}"</span>
                </span>
              ) : category && category !== 'All' ? (
                <span>Category: <span className="text-amber-600 font-extrabold">{category}</span></span>
              ) : (
                <span>Featured Products & Deals</span>
              )}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Showing {products.length > 0 ? (page - 1) * 8 + 1 : 0} -{' '}
              {Math.min(page * 8, total)} of {total} products
            </p>
          </div>

          {/* Sort By & Mobile Filter Toggle */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 border border-gray-300 rounded text-xs font-semibold text-gray-700"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </button>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-600 font-medium whitespace-nowrap">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => updateFilter({ sortBy: e.target.value })}
                className="bg-gray-50 border border-gray-300 rounded px-2.5 py-1.5 text-xs font-medium focus:ring-1 focus:ring-amber-500 focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Avg. Customer Review</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>
        </div>

        {/* Layout Grid: Sidebar + Products */}
        <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-6 items-start">
          
          {/* Filter Sidebar */}
          <aside
            className={`lg:col-span-1 bg-white p-4 rounded-lg border border-gray-200 shadow-sm text-xs space-y-6 ${
              mobileFilterOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <span className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                <Filter className="w-4 h-4 text-amber-600" /> Filter Results
              </span>
              {(category !== 'All' || keyword || minPrice || maxPrice || rating) && (
                <button
                  onClick={resetFilters}
                  className="text-amber-700 hover:text-amber-800 flex items-center gap-1 font-semibold hover:underline"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div>
              <h3 className="font-bold text-gray-900 mb-2 uppercase tracking-wider text-[11px]">
                Department
              </h3>
              <ul className="space-y-1">
                {categoryList.map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => updateFilter({ category: cat })}
                      className={`w-full text-left py-1 px-2 rounded transition flex items-center justify-between ${
                        category === cat || (cat === 'All' && !category)
                          ? 'bg-amber-100 font-bold text-amber-900'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span>{cat}</span>
                      {category === cat && <ChevronRight className="w-3.5 h-3.5 text-amber-700" />}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Filter */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-bold text-gray-900 mb-2 uppercase tracking-wider text-[11px]">
                Price (₹)
              </h3>
              <div className="space-y-1 mb-3">
                {[
                  { label: 'Under ₹1,000', min: 0, max: 1000 },
                  { label: '₹1,000 - ₹10,000', min: 1000, max: 10000 },
                  { label: '₹10,000 - ₹50,000', min: 10000, max: 50000 },
                  { label: 'Over ₹50,000', min: 50000, max: '' },
                ].map((tier, i) => (
                  <button
                    key={i}
                    onClick={() => updateFilter({ minPrice: tier.min, maxPrice: tier.max })}
                    className={`block w-full text-left py-1 px-2 rounded ${
                      minPrice === String(tier.min) && maxPrice === String(tier.max)
                        ? 'font-bold text-amber-900 bg-amber-50'
                        : 'text-gray-700 hover:underline'
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>

              {/* Custom price inputs */}
              <form onSubmit={handlePriceApply} className="flex items-center gap-1.5 mt-2">
                <input
                  type="number"
                  placeholder="Min ₹"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  placeholder="Max ₹"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-2.5 py-1 bg-amber-400 hover:bg-amber-500 border border-amber-500 rounded font-bold text-gray-900 transition"
                >
                  Go
                </button>
              </form>
            </div>

            {/* Customer Rating Filter */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-bold text-gray-900 mb-2 uppercase tracking-wider text-[11px]">
                Customer Reviews
              </h3>
              <div className="space-y-1">
                {[4, 3, 2].map((r) => (
                  <button
                    key={r}
                    onClick={() => updateFilter({ rating: r })}
                    className={`flex items-center gap-1.5 w-full py-1 px-2 rounded ${
                      rating === String(r) ? 'bg-amber-50 font-bold' : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-amber-500 font-bold">★ {r} & Up</span>
                    <span className="text-gray-500 text-[11px]">& higher</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Amazon Prime Filter */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded">
                <span className="text-blue-700 font-black italic tracking-tighter text-sm">
                  prime
                </span>
                <span className="text-xs text-blue-900 font-medium">Eligible for Free Delivery</span>
              </div>
            </div>
          </aside>

          {/* Product Listing Grid */}
          <main className="lg:col-span-3 xl:col-span-4">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg border border-gray-200 p-4 h-96 animate-pulse flex flex-col justify-between"
                  >
                    <div className="bg-gray-200 h-48 rounded mb-4"></div>
                    <div className="space-y-2">
                      <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                      <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                      <div className="bg-gray-200 h-6 rounded w-1/3"></div>
                    </div>
                    <div className="bg-gray-200 h-8 rounded-full mt-4"></div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center shadow-sm">
                <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">No products found</h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto mb-4">
                  We couldn't find any products matching your search or filters. Try adjusting your
                  filters or searching with different keywords.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-500 font-bold text-xs rounded-full border border-amber-500 text-gray-900 transition"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {pages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded border text-xs font-medium transition ${
                        page === 1
                          ? 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed'
                          : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-100'
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" /> Previous
                    </button>

                    {[...Array(pages)].map((_, i) => {
                      const pNum = i + 1;
                      return (
                        <button
                          key={pNum}
                          onClick={() => setPage(pNum)}
                          className={`w-8 h-8 rounded border text-xs font-bold transition ${
                            page === pNum
                              ? 'bg-amber-400 border-amber-500 text-gray-950 shadow-sm'
                              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {pNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => setPage((p) => Math.min(pages, p + 1))}
                      disabled={page === pages}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded border text-xs font-medium transition ${
                        page === pages
                          ? 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed'
                          : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-100'
                      }`}
                    >
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
