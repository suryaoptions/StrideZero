
import React from 'react';
import { ShoppingBag, User, Menu, X, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Language, Country } from '../types';
import { TRANSLATIONS } from '../constants';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (v: boolean) => void;
  language: Language;
  setLanguage: (l: Language) => void;
  country: Country;
  setCountry: (c: Country) => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  cartCount, 
  onOpenCart, 
  isMobileMenuOpen, 
  setIsMobileMenuOpen,
  language,
  setLanguage,
  country,
  setCountry
}) => {
  const t = TRANSLATIONS[language].nav;

  const languages: Language[] = ['en', 'de', 'fr', 'ja'];
  const countries: Country[] = ['US', 'UK', 'DE', 'FR', 'JP', 'AU', 'CA', 'IT', 'IN', 'NZ'];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-900">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-3xl font-extrabold tracking-tighter italic uppercase group">
              Stride<span className="text-gray-400 group-hover:text-black transition-colors duration-500">Zero</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex space-x-6 xl:space-x-8 items-center overflow-x-auto no-scrollbar">
            <Link to="/catalog" className="text-xs font-bold uppercase tracking-widest hover:text-gray-500 transition-colors whitespace-nowrap">{t.all}</Link>
            <Link to="/catalog?category=men" className="text-xs font-bold uppercase tracking-widest hover:text-gray-500 transition-colors whitespace-nowrap">{t.men}</Link>
            <Link to="/catalog?category=women" className="text-xs font-bold uppercase tracking-widest hover:text-gray-500 transition-colors whitespace-nowrap">{t.women}</Link>
            <Link to="/catalog?category=kids" className="text-xs font-bold uppercase tracking-widest hover:text-gray-500 transition-colors whitespace-nowrap">{t.kids}</Link>
            <Link to="/catalog?category=skate" className="text-xs font-bold uppercase tracking-widest hover:text-gray-500 transition-colors whitespace-nowrap">{t.skate}</Link>
            <Link to="/catalog?category=accessories" className="text-xs font-bold uppercase tracking-widest hover:text-gray-500 transition-colors whitespace-nowrap">{t.accessories}</Link>
            <Link to="/catalog?category=electronics" className="text-xs font-bold uppercase tracking-widest hover:text-gray-500 transition-colors whitespace-nowrap">{t.electronics}</Link>
            <Link to="/catalog?category=home" className="text-xs font-bold uppercase tracking-widest hover:text-gray-500 transition-colors whitespace-nowrap">{t.home}</Link>
            <Link to="/catalog?category=grocery" className="text-xs font-bold uppercase tracking-widest hover:text-gray-500 transition-colors whitespace-nowrap">{t.grocery}</Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4 lg:space-x-6">
            
            {/* Localization Selectors */}
            <div className="hidden lg:flex items-center space-x-2 text-xs font-bold uppercase tracking-wider border-r border-gray-200 pr-6 mr-2">
               <div className="flex items-center group relative cursor-pointer">
                 <Globe size={14} className="mr-1 text-gray-500" />
                 <select 
                   value={language} 
                   onChange={(e) => setLanguage(e.target.value as Language)}
                   className="appearance-none bg-transparent border-none focus:ring-0 cursor-pointer py-1 pr-4 text-gray-700 hover:text-black"
                 >
                   {languages.map(l => <option key={l} value={l}>{l.toUpperCase()}</option>)}
                 </select>
               </div>
               <div className="h-4 w-[1px] bg-gray-300 mx-2"></div>
               <select 
                 value={country} 
                 onChange={(e) => setCountry(e.target.value as Country)}
                 className="appearance-none bg-transparent border-none focus:ring-0 cursor-pointer py-1 text-gray-700 hover:text-black"
               >
                 {countries.map(c => <option key={c} value={c}>{c}</option>)}
               </select>
            </div>

            <Link to="/auth" className="p-2 text-gray-900 hover:text-gray-500 transition-colors">
              <User size={22} />
            </Link>
            <button onClick={onOpenCart} className="p-2 text-gray-900 relative hover:text-gray-500 transition-colors">
              <ShoppingBag size={22} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-black bg-brand-platinum rounded-full border border-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-100 absolute w-full left-0 z-40 h-[calc(100vh-5rem)] overflow-y-auto">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <Link to="/catalog" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 text-lg font-bold uppercase tracking-wider border-b border-gray-50">{t.all}</Link>
            <Link to="/catalog?category=men" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 text-lg font-bold uppercase tracking-wider border-b border-gray-50">{t.men}</Link>
            <Link to="/catalog?category=women" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 text-lg font-bold uppercase tracking-wider border-b border-gray-50">{t.women}</Link>
            <Link to="/catalog?category=kids" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 text-lg font-bold uppercase tracking-wider border-b border-gray-50">{t.kids}</Link>
            <Link to="/catalog?category=skate" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 text-lg font-bold uppercase tracking-wider border-b border-gray-50">{t.skate}</Link>
            <Link to="/catalog?category=accessories" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 text-lg font-bold uppercase tracking-wider border-b border-gray-50">{t.accessories}</Link>
            <Link to="/catalog?category=electronics" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 text-lg font-bold uppercase tracking-wider border-b border-gray-50">{t.electronics}</Link>
            <Link to="/catalog?category=home" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 text-lg font-bold uppercase tracking-wider border-b border-gray-50">{t.home}</Link>
            <Link to="/catalog?category=grocery" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 text-lg font-bold uppercase tracking-wider border-b border-gray-50">{t.grocery}</Link>
            
            {/* Mobile Localization */}
            <div className="flex gap-4 py-4 border-b border-gray-50">
               <div className="flex flex-col">
                  <label className="text-xs text-gray-400 font-bold mb-1">Language</label>
                  <select 
                     value={language} 
                     onChange={(e) => setLanguage(e.target.value as Language)}
                     className="bg-gray-50 border border-gray-200 rounded p-1 text-sm font-bold"
                   >
                     {languages.map(l => <option key={l} value={l}>{l.toUpperCase()}</option>)}
                   </select>
               </div>
               <div className="flex flex-col">
                  <label className="text-xs text-gray-400 font-bold mb-1">Region</label>
                  <select 
                     value={country} 
                     onChange={(e) => setCountry(e.target.value as Country)}
                     className="bg-gray-50 border border-gray-200 rounded p-1 text-sm font-bold"
                   >
                     {countries.map(c => <option key={c} value={c}>{c}</option>)}
                   </select>
               </div>
            </div>

            <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 text-lg font-bold uppercase tracking-wider">Account</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
