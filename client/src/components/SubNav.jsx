import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';

const SubNav = () => {
  const navigate = useNavigate();

  const categories = [
    { label: 'All', query: '' },
    { label: "Today's Deals", query: 'deals' },
    { label: 'Mobiles', query: 'Mobiles & Tablets' },
    { label: 'Laptops', query: 'Laptops & Computers' },
    { label: 'Audio', query: 'Audio & Headphones' },
    { label: 'Smartwatches', query: 'Wearables & Smartwatches' },
    { label: 'Electronics', query: 'Electronics' },
    { label: 'Home & Kitchen', query: 'Home & Kitchen' },
    { label: 'Fashion', query: 'Fashion & Footwear' },
    { label: 'Books', query: 'Books' },
  ];

  const handleCategoryClick = (query) => {
    if (!query) {
      navigate('/');
    } else if (query === 'deals') {
      navigate('/?sortBy=rating');
    } else {
      navigate(`/?category=${encodeURIComponent(query)}`);
    }
  };

  return (
    <nav className="bg-[#232f3e] text-white text-xs sm:text-sm font-medium border-t border-gray-700/50 overflow-x-auto no-scrollbar">
      <div className="max-w-[1500px] mx-auto px-3 sm:px-4 flex items-center justify-between whitespace-nowrap min-w-max">
        <div className="flex items-center gap-1 sm:gap-3 py-1.5">
          <button
            onClick={() => handleCategoryClick('')}
            className="flex items-center gap-1 px-2 py-1 hover:border border-white rounded transition font-bold"
          >
            <Menu className="w-4 h-4" />
            <span>All</span>
          </button>

          {categories.slice(1).map((item) => (
            <button
              key={item.label}
              onClick={() => handleCategoryClick(item.query)}
              className="px-2 py-1 hover:border border-white rounded transition text-gray-200 hover:text-white"
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="hidden xl:flex items-center gap-2 text-xs text-amber-300 font-bold px-2">
          <span>Amazon Great Republic Day Sale</span>
          <span className="bg-amber-400 text-gray-950 px-2 py-0.5 rounded text-[11px] font-black">
            LIVE NOW
          </span>
        </div>
      </div>
    </nav>
  );
};

export default SubNav;
