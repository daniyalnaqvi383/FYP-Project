import React from 'react';
import { FaInstagram, FaFacebookF, FaTiktok, FaYoutube, FaArrowRight } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-20 pb-10 border-t border-gray-200">
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* Top Section: Newsletter & Branding */}
        <div className="flex flex-col lg:flex-row justify-between items-start mb-20 gap-12">
          <div className="max-w-md">
            <h2 className="text-2xl font-bold tracking-tighter mb-4 italic text-[#C19A6B]">BE THE FIRST TO KNOW</h2>
            <p className="text-gray-500 text-sm mb-6">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>
            <div className="flex border-b border-white pb-2 group">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-transparent outline-none w-full text-sm placeholder:text-white"
              />
              <button className="hover:translate-x-1 transition-transform duration-300">
                <FaArrowRight size={14} />
              </button>
            </div>
          </div>

          <div className="flex flex-col items-end">
             <h1 className="text-5xl font-black tracking-tighter mb-4">Me.</h1>
             <div className="flex space-x-5">
                <a href="#" className="p-2 border border-white rounded-full hover:bg-white hover:text-black transition-all duration-300"><FaInstagram size={16} /></a>
                <a href="#" className="p-2 border border-white rounded-full hover:bg-white hover:text-black transition-all duration-300"><FaTiktok size={16} /></a>
                <a href="#" className="p-2 border border-white rounded-full hover:bg-white hover:text-black transition-all duration-300"><FaFacebookF size={16} /></a>
             </div>
          </div>
        </div>

        {/* Middle Section: Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          <div>
            <h4 className="font-bold text-xs uppercase tracking-[0.2em] mb-6">Shop</h4>
            <ul className="space-y-3 text-sm text-gray-600 font-medium">
              <li><a href="#" className="hover:text-[#C19A6B] transition-colors">New Arrivals</a></li>
              <li><a href="#" className="hover:text-[#C19A6B] transition-colors">Best Sellers</a></li>
              <li><a href="#" className="hover:text-[#C19A6B] transition-colors">Men's Collection</a></li>
              <li><a href="#" className="hover:text-[#C19A6B] transition-colors">Women's Collection</a></li>
              <li><a href="#" className="hover:text-[#C19A6B] transition-colors">Accessories</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase tracking-[0.2em] mb-6">Customer Care</h4>
            <ul className="space-y-3 text-sm text-gray-600 font-medium">
              <li><a href="#" className="hover:text-[#C19A6B] transition-colors">Track Your Order</a></li>
              <li><a href="#" className="hover:text-[#C19A6B] transition-colors">Shipping Policy</a></li>
              <li><a href="#" className="hover:text-[#C19A6B] transition-colors">Returns & Exchanges</a></li>
              <li><a href="#" className="hover:text-[#C19A6B] transition-colors">FAQs</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase tracking-[0.2em] mb-6">Our Story</h4>
            <ul className="space-y-3 text-sm text-gray-600 font-medium">
              <li><a href="#" className="hover:text-[#C19A6B] transition-colors">About Breakout</a></li>
              <li><a href="#" className="hover:text-[#C19A6B] transition-colors">Sustainability</a></li>
              <li><a href="#" className="hover:text-[#C19A6B] transition-colors">Store Locator</a></li>
              <li><a href="#" className="hover:text-[#C19A6B] transition-colors">Careers</a></li>
            </ul>
          </div>

          <div className="bg-black p-6 rounded-lg">
            <h4 className="font-bold text-xs uppercase tracking-[0.2em] mb-4 text-white">Contact Us</h4>
            <div className="space-y-4 text-sm">
              <p className="text-gray-600 leading-relaxed">
                Need help? Our team is available <br/> 
                <span className="font-bold text-black italic">Mon-Sat (10am - 6pm)</span>
              </p>
              <p className="font-bold text-lg">+92 311 1100439</p>
              <p className="underline underline-offset-4 cursor-pointer hover:text-gray-500 transition-colors">support@breakout.com</p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-100">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest">
            © 2026 BREAKOUT CLOTHING CO. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0 opacity-40">
             <span className="text-[10px] font-bold">VISA</span>
             <span className="text-[10px] font-bold">MASTERCARD</span>
             <span className="text-[10px] font-bold">APPLE PAY</span>
             <span className="text-[10px] font-bold">CASH ON DELIVERY</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;