
import React, { useState, useMemo, useEffect } from 'react';
import { Product, FilterState } from '../types';
import { isProductNew } from '../constants';
import ProductCard from '../components/ProductCard';
import { SlidersHorizontal, ChevronDown, ChevronRight, Percent } from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';

interface CatalogProps {
  products: Product[];
  onQuickAdd: (product: Product) => void;
}

const CATEGORIES_LIST = [
  { id: 'all', label: 'All Products' },
  { id: 'men', label: 'Men' },
  { id: 'women', label: 'Women' },
  { id: 'kids', label: 'Kids' },
  { id: 'skate', label: 'Skate Gear' },
  { id: 'accessories', label: 'Accessories' },
  { id: 'electronics', label: 'Electronics' },
  { id: 'home', label: 'Home Goods' },
  { id: 'grocery', label: 'Grocery' }
];

const Catalog: React.FC<CatalogProps> = ({ products, onQuickAdd }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category');
  const initialSale = searchParams.get('sale') === 'true';

  const [filters, setFilters] = useState<FilterState & { sale: boolean }>({
    category: initialCategory || null,
    minPrice: 0,
    maxPrice: 3000,
    color: null,
    sale: initialSale
  });
  
  // Sync state with URL params
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const saleParam = searchParams.get('sale') === 'true';

    const currentCat = filters.category ? filters.category.toLowerCase() : null;
    const paramCat = categoryParam ? categoryParam.toLowerCase() : null;

    if (paramCat !== currentCat || filters.sale !== saleParam) {
        setFilters(prev => ({...prev, category: categoryParam || null, sale: saleParam}));
    }
  }, [searchParams, filters.category, filters.sale]);

  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  const filteredProducts = useMemo(() => {
    let result = products;

    if (filters.category && filters.category !== 'all') {
      result = result.filter(p => p.category.toLowerCase() === filters.category!.toLowerCase());
    }
    if (filters.sale) {
        result = result.filter(p => p.originalPrice && p.originalPrice > p.price);
    }
    if (filters.color) {
      result = result.filter(p => p.colors.includes(filters.color!));
    }
    result = result.filter(p => p.price >= filters.minPrice && p.price <= filters.maxPrice);

    // Sorting
    if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, filters, sortBy]);

  const allColors = Array.from(new Set(products.flatMap(p => p.colors))) as string[];

  // Get New Releases for Sidebar "Fresh Drops"
  const newReleases = useMemo(() => {
    return products.filter(p => isProductNew(p.releaseDate)).slice(0, 5);
  }, [products]);

  const handleCategoryChange = (cat: string | null) => {
    const newCat = cat === 'all' ? null : cat;
    setFilters(prev => ({ ...prev, category: newCat, sale: false }));
    if (newCat) {
      searchParams.set('category', newCat);
      searchParams.delete('sale');
    } else {
      searchParams.delete('category');
      searchParams.delete('sale');
    }
    setSearchParams(searchParams);
  };

  const handleSaleFilter = () => {
    setFilters(prev => ({ ...prev, category: null, sale: true }));
    searchParams.delete('category');
    searchParams.set('sale', 'true');
    setSearchParams(searchParams);
  };

  const getPriceMax = () => {
      if (products.length === 0) return 1000;
      const max = Math.max(...products.map(p => p.price));
      return Math.ceil(max / 100) * 100;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Header & Sort Mobile Only (Desktop Header is integrated) */}
      <div className="flex flex-col mb-8 lg:hidden">
        <h1 className="text-4xl font-extrabold tracking-tighter text-black uppercase mb-2">Collection</h1>
        
        <div className="flex justify-between items-center mt-6">
          <p className="text-gray-500 text-sm font-medium">{filteredProducts.length} Items</p>
          
          <div className="flex items-center">
            <button 
              className="lg:hidden mr-6 flex items-center text-black font-bold uppercase text-sm tracking-widest"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
            >
              <SlidersHorizontal size={16} className="mr-2" /> Filter
            </button>

            <div className="relative inline-block text-left">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="group inline-flex justify-center text-sm font-bold uppercase tracking-widest text-gray-700 hover:text-black focus:outline-none bg-transparent cursor-pointer border-none ring-0 focus:ring-0"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-x-12">
        
        {/* Left-Hand Inventory Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 flex-shrink-0 space-y-12">
          
          {/* Categories Sidebar */}
          <div>
            <h3 className="text-xl font-black uppercase tracking-tight mb-6 border-b-4 border-black pb-2">Inventory</h3>
            <nav className="space-y-1">
              {CATEGORIES_LIST.map((cat) => {
                const isActive = cat.id === 'all' 
                  ? !filters.category && !filters.sale
                  : filters.category?.toLowerCase() === cat.id;
                
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`w-full text-left py-3 px-2 text-sm font-bold uppercase tracking-widest transition-all duration-200 flex items-center justify-between group ${
                      isActive 
                      ? 'bg-black text-white pl-4' 
                      : 'text-gray-500 hover:text-black hover:bg-gray-100'
                    }`}
                  >
                    {cat.label}
                    {isActive && <ChevronRight size={14} />}
                  </button>
                );
              })}
              
              {/* Sale Category Link */}
              <button
                onClick={handleSaleFilter}
                className={`w-full text-left py-3 px-2 text-sm font-bold uppercase tracking-widest transition-all duration-200 flex items-center justify-between group ${
                  filters.sale
                  ? 'bg-red-600 text-white pl-4' 
                  : 'text-red-600 hover:text-red-800 hover:bg-red-50'
                }`}
              >
                Sale Items
                {filters.sale ? <ChevronRight size={14} /> : <Percent size={14} />}
              </button>
            </nav>
          </div>

          {/* Fresh Drops (Dynamic Refresh Logic) */}
          <div>
             <h3 className="text-sm font-black uppercase tracking-widest mb-4 text-red-600 flex items-center">
                <span className="w-2 h-2 bg-red-600 rounded-full mr-2 animate-pulse"></span>
                Fresh Drops
             </h3>
             <ul className="space-y-3">
                {newReleases.map(item => (
                   <li key={item.id}>
                      <Link to={`/product/${item.id}`} className="block group">
                         <span className="text-xs font-bold text-black uppercase group-hover:underline block mb-1">{item.name}</span>
                         <span className="text-[10px] text-gray-500 font-medium">{item.category}</span>
                      </Link>
                   </li>
                ))}
             </ul>
          </div>

          {/* Filters */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4 border-t border-gray-200 pt-6">Price Range</h3>
            <div className="flex items-center justify-between text-xs font-medium text-gray-900 mb-2">
               <span>${filters.minPrice}</span>
               <span>${filters.maxPrice}</span>
            </div>
             <input 
                 type="range" 
                 min="0" max={getPriceMax()} step="10"
                 value={filters.maxPrice}
                 onChange={(e) => setFilters({...filters, maxPrice: Number(e.target.value)})}
                 className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
               />
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4">Color</h3>
            <div className="flex flex-wrap gap-2">
              {allColors.map(color => {
                 let bg = color.toLowerCase();
                 // Color mapping simulation
                 if (bg === 'platinum' || bg === 'silver') bg = '#E5E4E2';
                 if (bg === 'carbon') bg = '#333';
                 if (bg === 'diamond') bg = '#e0f7fa';
                 if (bg === 'gold') bg = '#FFD700';
                 if (bg === 'chrome') bg = '#dbe4eb';
                 
                 return (
                  <button
                    key={color}
                    onClick={() => setFilters(prev => ({...prev, color: prev.color === color ? null : color}))}
                    className={`h-6 w-6 rounded-full border border-gray-200 focus:outline-none transition-all ${filters.color === color ? 'ring-2 ring-offset-2 ring-black scale-110' : 'hover:scale-110'}`}
                    style={{ backgroundColor: bg }}
                    title={color}
                  />
                 );
              })}
            </div>
          </div>
        </aside>

        {/* Mobile Filters Drawer */}
        {showMobileFilters && (
           <div className="fixed inset-0 z-50 flex lg:hidden">
             <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)} />
             <div className="relative ml-auto flex h-full w-80 flex-col overflow-y-auto bg-white py-6 shadow-2xl animate-slide-in-right">
               <div className="flex items-center justify-between px-6 mb-8">
                 <h2 className="text-xl font-bold uppercase tracking-tight text-black">Filters</h2>
                 <button onClick={() => setShowMobileFilters(false)}><ChevronDown className="rotate-90 text-black" /></button>
               </div>
               
               <div className="px-6 space-y-8">
                  {/* Mobile Categories */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest mb-4">Categories</h3>
                    <div className="space-y-2">
                        {CATEGORIES_LIST.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => {
                                    handleCategoryChange(cat.id);
                                    setShowMobileFilters(false);
                                }}
                                className={`block w-full text-left text-sm font-bold uppercase ${
                                    (cat.id === 'all' && !filters.category && !filters.sale) || filters.category === cat.id 
                                    ? 'text-black underline' 
                                    : 'text-gray-500'
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                         <button
                            onClick={() => {
                                handleSaleFilter();
                                setShowMobileFilters(false);
                            }}
                            className={`block w-full text-left text-sm font-bold uppercase text-red-600 ${filters.sale ? 'underline' : ''}`}
                        >
                            Sale Items
                        </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest mb-4">Price Max: ${filters.maxPrice}</h3>
                    <input 
                      type="range" 
                      min="0" max={getPriceMax()} step="10"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({...filters, maxPrice: Number(e.target.value)})}
                      className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                    />
                  </div>
               </div>
               <div className="mt-auto px-6 pt-6">
                 <button 
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full bg-black text-white py-4 font-bold uppercase tracking-widest text-sm"
                 >
                   View Results
                 </button>
               </div>
             </div>
           </div>
        )}

        {/* Product Grid */}
        <div className="flex-1">
          {/* Desktop Sort Bar (Inline with top of grid) */}
          <div className="hidden lg:flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
             <h2 className="text-2xl font-extrabold uppercase tracking-tight">
                 {filters.sale ? 'Sale Items' : (filters.category ? CATEGORIES_LIST.find(c => c.id === filters.category)?.label : 'All Products')}
             </h2>
             <div className="flex items-center space-x-4">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{filteredProducts.length} Results</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="text-xs font-bold uppercase tracking-widest border-none bg-transparent focus:ring-0 cursor-pointer text-right"
                >
                  <option value="featured">Sort: Featured</option>
                  <option value="price-asc">Sort: Price Low-High</option>
                  <option value="price-desc">Sort: Price High-Low</option>
                </select>
             </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <p className="text-lg">No products found.</p>
              <button onClick={() => {
                  setFilters({category: null, minPrice: 0, maxPrice: 3000, color: null, sale: false});
                  searchParams.delete('category');
                  searchParams.delete('sale');
                  setSearchParams(searchParams);
              }} className="mt-4 text-black underline hover:text-gray-600">Clear all filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} onQuickAdd={onQuickAdd} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Catalog;
