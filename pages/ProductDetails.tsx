import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product, Country } from '../types';
import { PRODUCTS, isProductNew, TAX_RATES } from '../constants';
import { Star, Truck, ShieldCheck, Share2, Tag, CheckCircle, ArrowLeft } from 'lucide-react';

interface ProductDetailsProps {
  addToCart: (product: Product, size: number | string, color: string) => void;
  country: Country;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ addToCart, country }) => {
  const { id } = useParams<{ id: string }>();
  const product = PRODUCTS.find(p => p.id === id);

  const [selectedSize, setSelectedSize] = useState<number | string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(product?.colors[0] || null);
  const [showEmailToast, setShowEmailToast] = useState(false);
  
  // Size Chart Region Logic
  const [sizeRegion, setSizeRegion] = useState<'US' | 'UK' | 'EU'>('US');

  // Financial Breakdown Logic
  const taxRate = TAX_RATES[country] || 0.0;
  const estimatedTax = product ? product.price * taxRate : 0;
  const discountAmount = product?.originalPrice ? product.originalPrice - product.price : 0;
  const finalTotal = product ? product.price + estimatedTax : 0;

  useEffect(() => {
    // Reset selections when product changes
    if (product) {
        setSelectedColor(product.colors[0]);
        setSelectedSize(null);
        setSizeRegion('US'); // Default to US
    }
  }, [product]);

  if (!product) {
    return <div className="text-center py-20">Product not found. <Link to="/catalog">Go back.</Link></div>;
  }

  const handleAddToCart = () => {
    if (selectedSize && selectedColor) {
      addToCart(product, selectedSize, selectedColor);
    }
  };

  const handleImageClick = () => {
      // Simulate backend email sending
      console.log(`Sending details for ${product.name} to user email...`);
      setShowEmailToast(true);
      setTimeout(() => setShowEmailToast(false), 3000);
  };

  // Size conversion helper
  const renderSize = (size: number | string) => {
    if (typeof size === 'string') return size; // Apparel (S, M, L) often doesn't scale linearly in simple numeric conversions
    
    // Numeric conversions for footwear
    if (sizeRegion === 'UK') {
        return Math.max(1, size - 1);
    }
    if (sizeRegion === 'EU') {
        // Simple approximation: US 7 ~= EU 40. scale is roughly +33 but simplified here
        // US 1 (Kids) -> EU 32
        // US 7 (Men) -> EU 40
        return size < 6 ? Math.round(size + 31) : Math.round(size + 33);
    }
    return size; // US Default
  };

  const isNew = isProductNew(product.releaseDate);
  const isSale = product.originalPrice && product.originalPrice > product.price;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
      
      {/* Navigation Back */}
      <div className="mb-8">
        <Link to="/catalog" className="inline-flex items-center text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors">
            <ArrowLeft size={16} className="mr-2" /> Back to Shop
        </Link>
      </div>

      {/* Simulated Toast Notification */}
      {showEmailToast && (
          <div className="fixed top-24 right-4 z-50 bg-black text-white px-6 py-4 rounded-lg shadow-2xl flex items-center animate-fade-in-down">
              <CheckCircle size={20} className="mr-3 text-green-400" />
              <div>
                  <h4 className="font-bold text-sm">Sent!</h4>
                  <p className="text-xs text-gray-300">Product details sent to your registered email.</p>
              </div>
          </div>
      )}

      <div className="lg:grid lg:grid-cols-2 lg:gap-x-12">
        {/* Left Column: Image Gallery */}
        <div className="mb-8 lg:mb-0">
          <div 
            className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4 relative group cursor-pointer"
            onClick={handleImageClick}
            title="Click to email details to yourself"
          >
             <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
             
             {/* Overlay hint */}
             <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                 <span className="opacity-0 group-hover:opacity-100 bg-white/90 text-black text-xs font-bold px-3 py-1 rounded-full pointer-events-none transition-opacity">
                     Click to Email Details
                 </span>
             </div>

             <div className="absolute top-4 left-4 flex gap-2">
                {isNew && (
                  <span className="bg-white text-black px-3 py-1 text-xs font-bold uppercase tracking-widest border border-black">New Release</span>
                )}
                {isSale && (
                  <span className="bg-black text-white px-3 py-1 text-xs font-bold uppercase tracking-widest flex items-center">
                    <Tag size={12} className="mr-1" /> Sale
                  </span>
                )}
             </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-75">
                <img src={`https://picsum.photos/seed/${product.id}-${i}/200/200`} alt="View" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Details & Financial Breakdown */}
        <div className="flex flex-col">
          <nav className="text-sm text-gray-500 mb-4 uppercase tracking-wide">
            <Link to="/catalog">Catalog</Link> / <span className="text-black">{product.category}</span>
          </nav>

          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-2">{product.name}</h1>
          
          {/* Simulated 5-Star Rating */}
          <div className="flex items-center mb-6">
            <div className="flex text-black">
               {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
            </div>
            <span className="ml-2 text-sm text-gray-500 font-medium">(124 verified reviews)</span>
          </div>

          <div className="mb-6">
            {isSale ? (
              <div className="flex items-center gap-4">
                <span className="text-3xl font-medium text-black">${product.price}</span>
                <span className="text-xl text-gray-400 line-through">${product.originalPrice}</span>
                <span className="text-xs font-bold text-white bg-red-600 uppercase px-2 py-0.5">
                  Save ${discountAmount}
                </span>
              </div>
            ) : (
              <p className="text-3xl font-medium text-gray-900">${product.price}</p>
            )}
          </div>

          {/* Financial Breakdown Box */}
          <div className="border border-gray-200 rounded-lg p-6 mb-8 bg-white/50 backdrop-blur-sm">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 border-b border-gray-100 pb-2">Transparency Breakdown</h3>
              <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                      <span className="text-gray-600">Materials {product.materials && `(${product.materials.join(', ')})`}</span>
                      <span className="font-medium text-gray-900">${product.materialCost?.toFixed(2) || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                      <span className="text-gray-600">Est. Tax ({country} {(taxRate * 100).toFixed(0)}%)</span>
                      <span className="font-medium text-gray-900">${estimatedTax.toFixed(2)}</span>
                  </div>
                  {isSale && (
                       <div className="flex justify-between text-green-700">
                          <span>Discount Applied</span>
                          <span className="font-bold">-${discountAmount.toFixed(2)}</span>
                       </div>
                  )}
                  <div className="flex justify-between pt-3 mt-1 border-t border-gray-100">
                      <span className="font-bold text-black uppercase">Final Total</span>
                      <span className="font-black text-black text-lg">${finalTotal.toFixed(2)}</span>
                  </div>
              </div>
              <p className="text-[10px] text-gray-400 mt-3 italic">
                  *Breakdown includes estimated material costs and regional taxes based on your selected location ({country}).
              </p>
          </div>

          <div className="prose prose-sm text-gray-500 mb-8">
            <p>{product.description}</p>
          </div>

          {/* Selectors */}
          <div className="space-y-6 mb-8">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Color</h3>
              <div className="flex space-x-3">
                {product.colors.map(color => (
                   <button
                     key={color}
                     onClick={() => setSelectedColor(color)}
                     className={`px-4 py-2 border rounded-full text-sm font-medium transition-all ${
                       selectedColor === color ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-700 hover:border-gray-400'
                     }`}
                   >
                     {color}
                   </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium text-gray-900">Select Size</h3>
                
                {/* Size Chart Switcher */}
                <div className="flex text-xs font-bold bg-gray-100 rounded p-1">
                    {['US', 'UK', 'EU'].map((region) => (
                        <button 
                            key={region}
                            onClick={() => setSizeRegion(region as any)}
                            className={`px-3 py-1 rounded transition-all ${sizeRegion === region ? 'bg-white shadow text-black' : 'text-gray-500 hover:text-black'}`}
                        >
                            {region}
                        </button>
                    ))}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 border rounded-md text-sm font-medium text-center transition-all ${
                       selectedSize === size 
                       ? 'ring-2 ring-black border-transparent bg-gray-50' 
                       : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    {renderSize(size)}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2 text-right">Showing {sizeRegion} Sizing</p>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!selectedSize}
            className={`w-full py-4 px-8 rounded-full flex items-center justify-center text-base font-bold text-white transition-colors mb-4 ${
              selectedSize ? 'bg-black hover:bg-gray-800 shadow-lg' : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {selectedSize ? 'Add to Bag' : 'Select a Size'}
          </button>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 mt-auto border-t border-gray-100 pt-6">
            <div className="flex items-center">
              <Truck size={18} className="mr-2" /> Free Global Shipping
            </div>
            <div className="flex items-center">
              <ShieldCheck size={18} className="mr-2" /> Lifetime Authenticity
            </div>
            <div className="flex items-center">
              <Share2 size={18} className="mr-2" /> Share Product
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;