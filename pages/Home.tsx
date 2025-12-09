import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Product, Language } from '../types';
import { isProductNew, TRANSLATIONS } from '../constants';
import ProductCard from '../components/ProductCard';

interface HomeProps {
  featuredProducts: Product[];
  onQuickAdd: (product: Product) => void;
  language: Language;
}

const Home: React.FC<HomeProps> = ({ featuredProducts, onQuickAdd, language }) => {
  const t = TRANSLATIONS[language];
  const navT = TRANSLATIONS[language].nav;

  // Filter strictly for products released in the last 7 days for the "Trending" section
  const trendingProducts = featuredProducts.filter(p => isProductNew(p.releaseDate)).slice(0, 4);

  return (
    <div className="space-y-20 pb-20 bg-white">
      
      {/* Hero Section - Sneaker Focused & High Impact */}
      <section className="relative h-screen min-h-[600px] flex items-center bg-black overflow-hidden">
        {/* Dynamic Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black z-0"></div>
        
        {/* Main Hero Image - High Impact Sneaker */}
        <div className="absolute inset-0 z-0">
           <img 
             src="https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=2000&auto=format&fit=crop" 
             alt="StrideZero Phantom Platinum Edition" 
             className="w-full h-full object-cover object-center opacity-70 scale-105 hover:scale-100 transition-transform duration-[2000ms] ease-out"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
           <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent"></div>
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-full flex items-center">
          <div className="max-w-4xl pt-20">
            <div className="flex items-center space-x-4 mb-6 animate-fade-in-up">
              <span className="h-[1px] w-12 bg-brand-platinum"></span>
              <span className="text-brand-platinum uppercase tracking-[0.3em] text-xs font-bold">The Platinum Series</span>
            </div>
            
            <h1 className="text-7xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter leading-[0.9] mb-8 animate-fade-in-up delay-100">
              {t.hero.title} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">{t.hero.titleHighlight}</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-lg font-light leading-relaxed animate-fade-in-up delay-200">
              {t.hero.subtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 animate-fade-in-up delay-300">
              <Link to="/catalog" className="inline-flex items-center justify-center px-10 py-5 bg-white text-black text-sm font-bold uppercase tracking-widest hover:bg-brand-platinum transition-colors duration-300 min-w-[200px]">
                {t.hero.cta1}
              </Link>
              <Link to="/catalog?category=men" className="inline-flex items-center justify-center px-10 py-5 border border-white text-white text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300 min-w-[200px]">
                {t.hero.cta2}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid - High Contrast */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-30">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Men (Large) */}
          <Link to="/catalog?category=men" className="lg:col-span-2 group relative h-[450px] overflow-hidden bg-black">
             <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500 z-10" />
             <img src="https://images.unsplash.com/photo-1539185441755-54339cf0e19c?auto=format&fit=crop&q=80&w=800" alt="Men" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-110" />
             <div className="absolute bottom-8 left-8 z-20">
               <h3 className="text-3xl font-extrabold text-white uppercase italic tracking-tighter">{navT.men}</h3>
               <span className="text-xs font-bold text-white uppercase tracking-widest mt-2 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                 Shop Now <ArrowRight size={14} className="ml-2" />
               </span>
             </div>
          </Link>

           {/* Women (Large) */}
           <Link to="/catalog?category=women" className="lg:col-span-2 group relative h-[450px] overflow-hidden bg-black">
             <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500 z-10" />
             <img src="https://images.unsplash.com/photo-1596460658428-18e00d760773?auto=format&fit=crop&q=80&w=800" alt="Women" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-110" />
             <div className="absolute bottom-8 left-8 z-20">
               <h3 className="text-3xl font-extrabold text-white uppercase italic tracking-tighter">{navT.women}</h3>
               <span className="text-xs font-bold text-white uppercase tracking-widest mt-2 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                 Shop Now <ArrowRight size={14} className="ml-2" />
               </span>
             </div>
          </Link>

           {/* Stacked Kids & Accessories */}
           <div className="lg:col-span-2 flex flex-col gap-4 h-[450px]">
              <Link to="/catalog?category=kids" className="flex-1 group relative overflow-hidden bg-black">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500 z-10" />
                <img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800" alt="Kids" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-110" />
                <div className="absolute bottom-6 left-6 z-20">
                  <h3 className="text-2xl font-extrabold text-white uppercase italic tracking-tighter">{navT.kids}</h3>
                </div>
              </Link>
              <Link to="/catalog?category=accessories" className="flex-1 group relative overflow-hidden bg-black">
                 <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500 z-10" />
                 <img src="https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&q=80&w=800" alt="Accessories" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-110" />
                 <div className="absolute bottom-6 left-6 z-20">
                   <h3 className="text-2xl font-extrabold text-white uppercase italic tracking-tighter">{navT.accessories}</h3>
                 </div>
              </Link>
           </div>
        </div>
      </section>

      {/* Featured / Trending */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-black/10 pb-6">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">{t.sections.freshDrops}</span>
            <h2 className="text-4xl font-extrabold uppercase tracking-tighter">{t.sections.trending}</h2>
          </div>
          <Link to="/catalog" className="hidden md:inline-block text-sm font-bold uppercase tracking-widest hover:text-gray-500 transition-colors">View All Products</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {trendingProducts.length > 0 ? (
            trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} onQuickAdd={onQuickAdd} />
            ))
          ) : (
             <div className="col-span-full text-center text-gray-500">Check back soon for new drops.</div>
          )}
        </div>
        <div className="mt-8 text-center md:hidden">
           <Link to="/catalog" className="text-sm font-bold uppercase tracking-widest border-b border-black pb-1">View All Products</Link>
        </div>
      </section>

      {/* Luxury Promo */}
      <section className="bg-brand-gray py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-black text-white overflow-hidden relative shadow-2xl">
            <div className="absolute top-0 right-0 w-full h-full opacity-40">
               <img src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1600" alt="Luxury Background" className="w-full h-full object-cover grayscale" />
            </div>
            <div className="relative z-10 px-8 py-20 md:py-32 md:px-20 text-center">
              <span className="inline-block py-1 px-3 border border-white/30 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">Members Only</span>
              <h2 className="text-4xl md:text-6xl font-extrabold uppercase tracking-tighter mb-6">Platinum Access</h2>
              <p className="text-gray-300 mb-10 max-w-xl mx-auto text-lg leading-relaxed">
                Join the StrideZero elite club. Unlock early access to limited edition drops, luxury accessories, and invite-only events.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
                 <input 
                  type="email" 
                  placeholder="ENTER YOUR EMAIL" 
                  className="px-6 py-4 bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-white w-full text-sm font-bold tracking-widest"
                />
                <button className="px-10 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-brand-platinum transition-colors whitespace-nowrap">
                  Join The List
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
