import React, { useState, useEffect } from 'react';
import { CheckoutStep, Country, CartItem } from '../types';
import { CheckCircle, CreditCard, Truck, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TAX_RATES } from '../constants';
import { submitOrderToGoogleSheets, OrderData } from '../services/googleSheetsService';

interface CheckoutProps {
  country: Country;
  cart: CartItem[];
}

const Checkout: React.FC<CheckoutProps> = ({ country, cart }) => {
  const [step, setStep] = useState<CheckoutStep>(CheckoutStep.SHIPPING);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    zip: ''
  });

  // Derived Totals from Cart
  const [subtotal, setSubtotal] = useState(0); 
  const [shipping, setShipping] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [taxRate, setTaxRate] = useState(TAX_RATES[country]);

  useEffect(() => {
    // Calculate Subtotal from real cart
    const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    setSubtotal(cartTotal);
  }, [cart]);

  useEffect(() => {
    // Update tax rate when country changes
    setTaxRate(TAX_RATES[country]);
  }, [country]);

  useEffect(() => {
    // Logic: Free shipping over $200. Tax depends on country.
    const shippingCost = subtotal > 200 ? 0 : 15;
    const currentTaxRate = TAX_RATES[country] || 0.0825; // fallback
    const taxAmount = subtotal * currentTaxRate;
    
    setShipping(shippingCost);
    setTax(taxAmount);
    setTotal(subtotal + shippingCost + taxAmount);
  }, [subtotal, country]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePayment = async () => {
    setIsSubmitting(true);

    // 1. Format Products into a single string
    const productNames = cart.map(item => `${item.name} (Qty: ${item.quantity})`).join(', ');
    
    // 2. Get Current Date/Time
    const dateTime = new Date().toLocaleString();

    // 3. Prepare Payload
    const orderData: OrderData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      address: formData.address,
      city: formData.city,
      zip: formData.zip,
      productNames: productNames,
      totalAmount: total.toFixed(2),
      dateTime: dateTime
    };

    // 4. Send to Google Sheets Service (Backend Simulation)
    await submitOrderToGoogleSheets(orderData);

    // 5. Open PayPal Link in New Tab (As per requirements)
    // Replace with actual PayPal link or dynamic payment generator
    const PAYPAL_LINK = "https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=YOUR_PAYPAL_EMAIL_HERE&currency_code=USD&amount=" + total.toFixed(2);
    window.open(PAYPAL_LINK, '_blank');

    setIsSubmitting(false);
    // 6. Proceed to confirmation
    setStep(CheckoutStep.CONFIRMATION);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-10">
      {[
        { s: CheckoutStep.SHIPPING, icon: Truck, label: 'Shipping' },
        { s: CheckoutStep.PAYMENT, icon: CreditCard, label: 'Payment' },
        { s: CheckoutStep.CONFIRMATION, icon: CheckCircle, label: 'Review' },
      ].map((item, idx) => (
        <div key={item.s} className="flex items-center">
          <div className={`flex flex-col items-center ${step >= item.s ? 'text-black' : 'text-gray-400'}`}>
            <div className={`rounded-full p-3 border-2 ${step >= item.s ? 'border-black bg-black text-white' : 'border-gray-300'}`}>
              <item.icon size={20} />
            </div>
            <span className="text-xs font-bold uppercase mt-2">{item.label}</span>
          </div>
          {idx < 2 && <div className={`w-12 h-0.5 mx-4 ${step > item.s ? 'bg-black' : 'bg-gray-300'}`} />}
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold uppercase tracking-tight text-center mb-8">Checkout</h1>
      
      {renderStepIndicator()}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Form Area */}
        <div className="lg:col-span-2 bg-white shadow-lg rounded-lg p-8 border border-gray-100">
          {step === CheckoutStep.SHIPPING && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold border-b border-gray-100 pb-4">Shipping Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input 
                  type="text" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First Name" 
                  className="border p-3 rounded-md w-full focus:ring-1 focus:ring-black outline-none" 
                />
                <input 
                  type="text" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last Name" 
                  className="border p-3 rounded-md w-full focus:ring-1 focus:ring-black outline-none" 
                />
                
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email Address" 
                  className="border p-3 rounded-md w-full md:col-span-2 focus:ring-1 focus:ring-black outline-none" 
                />
                
                <input 
                  type="text" 
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Street Address" 
                  className="border p-3 rounded-md w-full md:col-span-2 focus:ring-1 focus:ring-black outline-none" 
                />
                
                <input 
                  type="text" 
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="City" 
                  className="border p-3 rounded-md w-full focus:ring-1 focus:ring-black outline-none" 
                />
                <div className="grid grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      name="zip"
                      value={formData.zip}
                      onChange={handleInputChange}
                      placeholder="Zip Code" 
                      className="border p-3 rounded-md w-full focus:ring-1 focus:ring-black outline-none" 
                    />
                    {/* Country is displayed as a read-only field since it's controlled globally */}
                    <div className="border p-3 rounded-md w-full bg-gray-50 text-gray-700 font-bold flex items-center">
                        {country}
                    </div>
                </div>
              </div>
              <button 
                onClick={() => setStep(CheckoutStep.PAYMENT)}
                className="w-full bg-black text-white py-4 rounded-full font-bold hover:bg-gray-800 transition-colors mt-6 uppercase tracking-widest text-sm shadow-lg transform hover:-translate-y-1 duration-300"
              >
                Continue to Payment
              </button>
            </div>
          )}

          {step === CheckoutStep.PAYMENT && (
            <div className="space-y-8">
              <h2 className="text-xl font-bold border-b border-gray-100 pb-4">Secure Payment</h2>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center space-y-4">
                  <div className="flex justify-center items-center space-x-2 text-green-600 mb-2">
                      <Lock size={20} />
                      <span className="text-sm font-bold uppercase tracking-wide">Secure SSL Encryption</span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                      All transactions are secure and encrypted. For security, you will be redirected to PayPal to complete your purchase.
                  </p>
                  
                  {/* Card Logos Placeholders */}
                  <div className="flex justify-center items-center space-x-4 py-4">
                       <div className="h-10 w-16 bg-blue-900 rounded-md shadow-sm flex items-center justify-center text-[10px] font-bold text-white tracking-widest italic border border-blue-800">
                         VISA
                       </div>
                       <div className="h-10 w-16 bg-gray-800 rounded-md shadow-sm flex items-center justify-center text-[10px] font-bold text-white tracking-widest relative overflow-hidden">
                         <div className="absolute top-0 left-0 w-full h-1/2 bg-red-600 opacity-50"></div>
                         <div className="absolute bottom-0 left-0 w-full h-1/2 bg-yellow-500 opacity-50"></div>
                         <span className="relative z-10">MC</span>
                       </div>
                       <div className="h-10 w-16 bg-blue-500 rounded-md shadow-sm flex items-center justify-center text-[10px] font-bold text-white tracking-widest border border-blue-400">
                         AMEX
                       </div>
                  </div>
              </div>

               <div className="flex flex-col gap-4">
                <button 
                  onClick={handlePayment}
                  disabled={isSubmitting}
                  className="w-full bg-[#0070BA] text-white py-4 rounded-full font-bold hover:bg-[#003087] transition-colors uppercase tracking-widest text-sm shadow-md flex items-center justify-center disabled:opacity-70 disabled:cursor-wait"
                >
                  {isSubmitting ? 'Processing...' : (
                     <>Pay with <span className="font-extrabold italic ml-1">PayPal</span></>
                  )}
                </button>
                
                <button 
                  onClick={() => setStep(CheckoutStep.SHIPPING)}
                  className="w-full text-gray-500 py-2 text-xs font-bold uppercase hover:text-black transition-colors"
                >
                  &larr; Return to Shipping
                </button>
              </div>
            </div>
          )}

          {step === CheckoutStep.CONFIRMATION && (
            <div className="text-center py-16 animate-fade-in-up">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 text-green-600 shadow-xl">
                <CheckCircle size={56} />
              </div>
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">Order Confirmed</h2>
              <p className="text-xl text-gray-900 font-medium mb-6">Thanking you for your purchase!</p>
              
              <div className="bg-gray-50 p-6 rounded-lg max-w-sm mx-auto mb-8 text-left text-sm text-gray-600">
                  <p className="mb-2"><strong>Order ID:</strong> #SZ-{Math.floor(Math.random() * 10000)}</p>
                  <p>We've sent a confirmation email to <strong>{formData.email || 'your inbox'}</strong>. Your platinum gear is on its way.</p>
              </div>

              <Link to="/catalog" className="inline-block px-10 py-4 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition-colors uppercase tracking-widest text-sm shadow-lg">
                Continue Shopping
              </Link>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg sticky top-24 border border-gray-200">
                <h3 className="text-lg font-bold uppercase tracking-wide mb-6 border-b border-gray-200 pb-4">Order Summary</h3>
                
                {/* Real Items List */}
                <div className="space-y-4 mb-6 text-sm max-h-60 overflow-y-auto">
                    {cart.map((item, idx) => (
                      <div key={`${item.id}-${idx}`} className="flex justify-between items-center">
                        <div className="flex items-center">
                             <div className="w-10 h-10 bg-gray-200 rounded-md mr-3 overflow-hidden flex-shrink-0">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                             </div>
                             <div>
                               <span className="text-gray-700 font-medium block">{item.name}</span>
                               <span className="text-gray-400 text-xs block">Size: {item.selectedSize} | Qty: {item.quantity}</span>
                             </div>
                        </div>
                        <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    ))}
                    {cart.length === 0 && <p className="text-gray-400 italic">Your cart is empty.</p>}
                </div>

                <div className="space-y-3 border-t border-gray-200 pt-6 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-500 font-medium">Subtotal</span>
                        <span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500 font-medium">Estimated Shipping</span>
                        <span className="font-bold text-gray-900">
                            {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500 font-medium">Tax ({country} {(taxRate * 100).toFixed(1)}%)</span>
                        <span className="font-bold text-gray-900">${tax.toFixed(2)}</span>
                    </div>
                </div>
                
                <div className="border-t-2 border-black mt-6 pt-6 flex justify-between items-end">
                    <span className="text-lg font-bold uppercase tracking-tight">Total</span>
                    <span className="text-3xl font-black tracking-tighter">${total.toFixed(2)}</span>
                </div>
                
                {shipping === 0 && (
                    <div className="mt-6 flex items-center justify-center bg-black text-white text-[10px] font-bold py-2 px-3 rounded uppercase tracking-widest">
                        <Truck size={12} className="mr-2" /> Platinum Shipping Applied
                    </div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;