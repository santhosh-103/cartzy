import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Tag, Menu } from 'lucide-react';

const SubNav = () => {
  const navigate = useNavigate();

  const links = [
    { label: 'All', query: '', icon: null },
    { label: "Today's Deals", query: 'deals', highlight: true },
    { label: 'Mobiles', query: 'Mobiles & Tablets' },
    { label: 'Laptops', query: 'Laptops & Computers' },
    { label: 'Audio', query: 'Audio & Headphones' },
    { label: 'Smartwatches', query: 'Wearables & Smartwatches' },
    { label: 'Electronics', query: 'Electronics' },
    { label: 'Home & Kitchen', query: 'Home & Kitchen' },
    { label: 'Fashion', query: 'Fashion & Footwear' },
    { label: 'Books', query: 'Books' },
  ];

  const handleClick = (query) => {
    if (!query) return navigate('/');
    if (query === 'deals') return navigate('/?sortBy=rating');
    navigate(`/?category=${encodeURIComponent(query)}`);
  };

  return (
    <nav className="bg-[#162040] text-white text-xs font-semibold border-t border-white/5 overflow-x-auto no-scrollbar">
      <div className="max-w-[1500px] mx-auto px-3 sm:px-5 flex items-center gap-0.5 whitespace-nowrap py-0.5">
        {links.map((item) => (
          <button
            key={item.label}
            onClick={() => handleClick(item.query)}
            className={`px-3 py-2 rounded-md transition flex items-center gap-1 ${
              item.highlight
                ? 'text-orange-400 hover:text-orange-300 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            {item.highlight && <Flame className="w-3 h-3 fill-orange-400" />}
            {item.label}
          </button>
        ))}

        {/* Right-side promo tag */}
        <div className="ml-auto hidden xl:flex items-center gap-2 pl-4 border-l border-white/10">
          <Tag className="w-3.5 h-3.5 text-orange-400" />
          <span className="text-orange-300 font-bold text-[11px]">Mega Sale — Up to 70% Off</span>
          <span className="bg-orange-500 text-white px-2 py-0.5 rounded text-[10px] font-black animate-pulse-soft">
            LIVE
          </span>
        </div>
      </div>
    </nav>
  );
};

export default SubNav;
