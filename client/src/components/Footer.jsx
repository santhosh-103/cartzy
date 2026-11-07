import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-16 bg-[#232f3e] text-gray-300 text-sm">
      {/* Back to top */}
      <button
        onClick={scrollToTop}
        className="w-full py-3.5 bg-[#37475a] hover:bg-[#485769] text-white text-xs font-semibold text-center transition"
      >
        Back to top
      </button>

      {/* Main Footer Links */}
      <div className="max-w-[1200px] mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-xs leading-relaxed">
        <div>
          <h4 className="font-bold text-white text-sm mb-3">Get to Know Us</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:underline text-gray-300">About Amazon</a></li>
            <li><a href="#" className="hover:underline text-gray-300">Careers</a></li>
            <li><a href="#" className="hover:underline text-gray-300">Press Releases</a></li>
            <li><a href="#" className="hover:underline text-gray-300">Amazon Science</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white text-sm mb-3">Connect with Us</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:underline text-gray-300">Facebook</a></li>
            <li><a href="#" className="hover:underline text-gray-300">Twitter</a></li>
            <li><a href="#" className="hover:underline text-gray-300">Instagram</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white text-sm mb-3">Make Money with Us</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:underline text-gray-300">Sell on Amazon</a></li>
            <li><a href="#" className="hover:underline text-gray-300">Sell under Amazon Accelerator</a></li>
            <li><a href="#" className="hover:underline text-gray-300">Protect and Build Your Brand</a></li>
            <li><a href="#" className="hover:underline text-gray-300">Amazon Global Selling</a></li>
            <li><a href="#" className="hover:underline text-gray-300">Become an Affiliate</a></li>
            <li><a href="#" className="hover:underline text-gray-300">Fulfilment by Amazon</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white text-sm mb-3">Let Us Help You</h4>
          <ul className="space-y-2">
            <li><Link to="/orders" className="hover:underline text-gray-300">Your Account</Link></li>
            <li><Link to="/orders" className="hover:underline text-gray-300">Returns Centre</Link></li>
            <li><a href="#" className="hover:underline text-gray-300">100% Purchase Protection</a></li>
            <li><a href="#" className="hover:underline text-gray-300">Amazon App Download</a></li>
            <li><a href="#" className="hover:underline text-gray-300">Help</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 bg-[#131921] py-8 text-center text-xs text-gray-400">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-xl font-black text-white tracking-tight">
            amazon<span className="text-amber-400 text-xs">.in</span>
          </span>
          <span className="border border-gray-600 rounded px-2 py-0.5 text-[11px] text-gray-300 ml-4 flex items-center gap-1">
            <span>🌐 English</span>
          </span>
          <span className="border border-gray-600 rounded px-2 py-0.5 text-[11px] text-gray-300 flex items-center gap-1">
            <span>🇮🇳 India</span>
          </span>
        </div>

        <div className="max-w-3xl mx-auto px-4 space-y-1">
          <p className="flex justify-center flex-wrap gap-4 text-[11px]">
            <a href="#" className="hover:underline">Conditions of Use & Sale</a>
            <a href="#" className="hover:underline">Privacy Notice</a>
            <a href="#" className="hover:underline">Interest-Based Ads</a>
          </p>
          <p className="text-[11px] text-gray-500 mt-2">
            © 1996-{new Date().getFullYear()}, Amazon.com, Inc. or its affiliates. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
