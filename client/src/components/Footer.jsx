import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Shield, Truck, RotateCcw, Headphones } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const links = {
    'Get to Know Us': ['About Cartzy', 'Careers', 'Press & Media', 'Investor Relations'],
    'Make Money with Us': ['Sell on Cartzy', 'Become an Affiliate', 'Advertise Products', 'Fulfilment by Cartzy'],
    'Cartzy Payment': ['EMI & No-Cost EMI', 'Pay on Delivery', 'Cartzy Pay Wallet', 'Gift Cards'],
    'Let Us Help You': ['Your Account', 'Returns Centre', 'Help & Customer Service', 'Cartzy App Download'],
  };

  const perks = [
    { icon: Truck, label: 'Free Delivery', sub: 'On orders above ₹499' },
    { icon: Shield, label: 'Secure Payments', sub: '100% protected checkout' },
    { icon: RotateCcw, label: 'Easy Returns', sub: '7-day hassle-free returns' },
    { icon: Headphones, label: '24/7 Support', sub: 'Always here to help' },
  ];

  return (
    <footer className="mt-16">
      {/* Perks bar */}
      <div className="bg-[#0f1c3a] text-white border-t border-white/10">
        <div className="max-w-[1200px] mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {perks.map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-white">{label}</p>
                <p className="text-[11px] text-slate-400">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Back to top */}
      <button
        onClick={scrollToTop}
        className="w-full py-3 bg-[#1a2a52] hover:bg-[#213360] text-white text-xs font-semibold text-center transition"
      >
        ↑ Back to top
      </button>

      {/* Main footer links */}
      <div className="bg-[#162040] text-slate-300 text-xs">
        <div className="max-w-[1200px] mx-auto px-6 py-12 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {Object.entries(links).map(([heading, items]) => (
            <div key={heading}>
              <h4 className="font-bold text-white text-sm mb-4">{heading}</h4>
              <ul className="space-y-2.5">
                {items.map(item => (
                  <li key={item}>
                    <a href="#" className="hover:text-orange-400 transition-colors leading-relaxed">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-[#0f1c3a] py-8 border-t border-white/5 text-center text-xs text-slate-500">
        <div className="flex items-center justify-center gap-3 mb-5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-black text-white">
              Cart<span className="text-orange-400">zy</span>
            </span>
          </div>
          <span className="border border-slate-700 rounded px-2 py-0.5 text-[11px] text-slate-400">🌐 English</span>
          <span className="border border-slate-700 rounded px-2 py-0.5 text-[11px] text-slate-400">🇮🇳 India</span>
        </div>

        <p className="text-[11px] text-slate-600 mb-2">
          <a href="#" className="hover:text-slate-400 mx-2">Conditions of Use</a>
          <a href="#" className="hover:text-slate-400 mx-2">Privacy Notice</a>
          <a href="#" className="hover:text-slate-400 mx-2">Interest-Based Ads</a>
        </p>
        <p className="text-[11px] text-slate-700">
          © {new Date().getFullYear()} Cartzy. All rights reserved. Shop Smarter.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
