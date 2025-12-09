import React from 'react';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem } from '../types';
import { Link } from 'react-router-dom';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  updateQuantity: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, cartItems, updateQuantity, removeItem }) => {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="relative z-50">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-0 sm:pl-10">
        <div className="w-screen max-w-md transform transition-transform ease-in-out duration-500 animate-slide-in-right">
          <div className="flex h-full flex-col bg-white shadow-2xl">
            <div className="flex-1 overflow-y-auto px-6 py-8">
              <div className="flex items-start justify-between border-b border-gray-100 pb-6">
                <h2 className="text-xl font-extrabold text-black uppercase tracking-tight">Your Bag ({cartItems.length})</h2>
                <div className="ml-3 flex h-7 items-center">
                  <button onClick={onClose} className="relative -m-2 p-2 text-gray-400 hover:text-black transition-colors">
                    <X size={24} />
                  </button>
                </div>
              </div>

              <div className="mt-8">
                <div className="flow-root">
                  {cartItems.length === 0 ? (
                    <div className="text-center py-20">
                      <p className="text-gray-500 mb-6">Your bag is currently empty.</p>
                      <button onClick={onClose} className="text-black font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-gray-600">Start Shopping</button>
                    </div>
                  ) : (
                    <ul className="-my-6 divide-y divide-gray-100">
                      {cartItems.map((item) => (
                        <li key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex py-8">
                          <div className="h-28 w-28 flex-shrink-0 overflow-hidden rounded-none border border-gray-100 bg-gray-50">
                            <img src={item.image} alt={item.name} className="h-full w-full object-cover object-center" />
                          </div>

                          <div className="ml-6 flex flex-1 flex-col">
                            <div>
                              <div className="flex justify-between text-base font-bold text-black uppercase tracking-wide">
                                <h3>{item.name}</h3>
                                <p className="ml-4">${item.price}</p>
                              </div>
                              <p className="mt-1 text-sm text-gray-500 capitalize">{item.selectedColor} | Size {item.selectedSize}</p>
                            </div>
                            <div className="flex flex-1 items-end justify-between text-sm">
                              <div className="flex items-center border border-gray-300">
                                <button onClick={() => updateQuantity(item.id, -1)} className="p-2 hover:bg-gray-100 disabled:opacity-50" disabled={item.quantity <= 1}>
                                  <Minus size={14} />
                                </button>
                                <span className="px-3 font-medium">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, 1)} className="p-2 hover:bg-gray-100">
                                  <Plus size={14} />
                                </button>
                              </div>
                              <button onClick={() => removeItem(item.id)} className="font-medium text-gray-400 hover:text-black transition-colors">
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {cartItems.length > 0 && (
              <div className="border-t border-gray-100 px-6 py-6 bg-gray-50">
                <div className="flex justify-between text-base font-bold text-black mb-4 uppercase tracking-wide">
                  <p>Subtotal</p>
                  <p>${subtotal.toFixed(2)}</p>
                </div>
                <p className="mt-0.5 text-xs text-gray-500 mb-6">Shipping and taxes calculated at checkout.</p>
                <div className="space-y-3">
                  <Link
                    to="/checkout"
                    onClick={onClose}
                    className="flex w-full items-center justify-center border border-transparent bg-black px-6 py-4 text-sm font-bold uppercase tracking-widest text-white hover:bg-gray-800 transition-colors"
                  >
                    Checkout
                  </Link>
                  <button
                    onClick={onClose}
                    className="flex w-full items-center justify-center border border-black bg-transparent px-6 py-4 text-sm font-bold uppercase tracking-widest text-black hover:bg-white transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;