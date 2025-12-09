import React from 'react';
import { Product } from '../types';
import { isProductNew } from '../constants';
import { Link } from 'react-router-dom';
import { Plus, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onQuickAdd: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickAdd }) => {
  const isNew = isProductNew(product.releaseDate);
  const isSale = product.originalPrice && product.originalPrice > product.price;

  return (
    <div className="group relative flex flex-col h-full">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-in-out"
          loading="lazy"
        />
        <div className="absolute top-4 left-4 flex flex-col gap-2 items-start">
          {isNew && (
            <span className="bg-white text-black text-[10px] font-bold px-2 py-1 uppercase tracking-widest border border-black">
              New Release
            </span>
          )}
          {isSale && (
            <span className="bg-black text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
              Sale
            </span>
          )}
        </div>
        
        <button 
          onClick={(e) => {
            e.preventDefault();
            onQuickAdd(product);
          }}
          className="absolute bottom-4 right-4 bg-black text-white p-3 shadow-xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-gray-800"
          aria-label="Quick Add"
        >
          <Plus size={20} />
        </button>
      </div>
      <div className="mt-5 flex justify-between items-start">
        <div>
          <h3 className="text-sm font-bold text-black uppercase tracking-wide">
            <Link to={`/product/${product.id}`}>
              <span aria-hidden="true" className="absolute inset-0" />
              {product.name}
            </Link>
          </h3>
          <p className="mt-1 text-xs text-gray-500 uppercase tracking-widest">{product.category}</p>
          <div className="flex items-center mt-1.5">
             <div className="flex text-black">
               {[...Array(5)].map((_, i) => (
                 <Star key={i} size={10} fill="currentColor" />
               ))}
             </div>
             <span className="ml-1 text-[10px] text-gray-400 font-medium">(124)</span>
          </div>
        </div>
        <div className="text-right">
          {isSale ? (
            <div className="flex flex-col items-end">
              <span className="text-xs text-gray-400 line-through">${product.originalPrice}</span>
              <span className="text-sm font-bold text-black">${product.price}</span>
            </div>
          ) : (
            <p className="text-sm font-medium text-black">${product.price}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;