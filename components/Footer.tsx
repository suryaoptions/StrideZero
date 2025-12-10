
import React from 'react';
import { Instagram, Twitter, Facebook, Youtube, Lock, Unlock } from 'lucide-react';
import { User } from '../types';

interface FooterProps {
  onOpenAdmin: () => void;
  currentUser: User | null;
}

const Footer: React.FC<FooterProps> = ({ onOpenAdmin, currentUser }) => {
  const handleAdminClick = () => {
    if (currentUser && currentUser.role === 'admin') {
      onOpenAdmin();
    } else {
      alert("Access Denied: You must be logged in as an Administrator to access the dashboard.");
    }
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <footer className="bg-black text-white pt-20 pb-10 border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <h3 className="text-3xl font-extrabold tracking-tighter italic uppercase">Stride<span className="text-gray-500">Zero</span></h3>
            <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
              Defy the standard. Premium footwear and luxury accessories engineered for those who demand excellence.
            </p>
            {/* Social Media Links */}
            <div className="flex space-x-4 pt-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram size={20} /></a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter size={20} /></a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors"><Facebook size={20} /></a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors"><Youtube size={20} /></a>
            </div>
          </div>
          
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-6 text-gray-500">Collection</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><a href="#/catalog?category=men" className="hover:text-brand-platinum transition-colors">Men's</a></li>
              <li><a href="#/catalog?category=women" className="hover:text-brand-platinum transition-colors">Women's</a></li>
              <li><a href="#/catalog?category=electronics" className="hover:text-brand-platinum transition-colors">Electronics</a></li>
              <li><a href="#/catalog?category=skate" className="hover:text-brand-platinum transition-colors">Skate Gear</a></li>
              <li><a href="#/catalog?category=accessories" className="hover:text-brand-platinum transition-colors">Accessories</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-6 text-gray-500">More</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><a href="#/catalog?category=home" className="hover:text-brand-platinum transition-colors">Home Goods</a></li>
              <li><a href="#/catalog?category=grocery" className="hover:text-brand-platinum transition-colors">Premium Grocery</a></li>
              <li><a href="#/catalog?category=kids" className="hover:text-brand-platinum transition-colors">Kids</a></li>
              <li><a href="#" className="hover:text-brand-platinum transition-colors">Gift Cards</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-6 text-gray-500">Legal</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><a href="#" className="hover:text-brand-platinum transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-brand-platinum transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-20 pt-8 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600">
          <p>&copy; {new Date().getFullYear()} StrideZero Inc. All rights reserved.</p>
          <div className="flex items-center gap-4 mt-2 md:mt-0">
             <p className="uppercase tracking-wider">Designed for Performance</p>
             <button 
              onClick={handleAdminClick} 
              className={`transition-colors ${isAdmin ? 'text-green-500 hover:text-green-400' : 'text-gray-800 hover:text-gray-600'}`} 
              title={isAdmin ? "Access Admin Dashboard" : "Admin Access (Locked)"}
             >
               {isAdmin ? <Unlock size={12} /> : <Lock size={12} />}
             </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
