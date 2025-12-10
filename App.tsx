
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import AIChatBot from './components/AIChatBot';
import HolidayBanner from './components/HolidayBanner'; 
import AdminReportModal from './components/AdminReportModal';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetails from './pages/ProductDetails';
import Auth from './pages/Auth';
import Checkout from './pages/Checkout';
import { Product, CartItem, Language, Country, User } from './types';
import { PRODUCTS } from './constants';
import { getCurrentUser, logout as authLogout } from './services/authService';

const App: React.FC = () => {
  // Global State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdminReportOpen, setIsAdminReportOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Localization State
  const [language, setLanguage] = useState<Language>('en');
  const [country, setCountry] = useState<Country>('US');

  // Load User on Mount
  useEffect(() => {
    try {
      const user = getCurrentUser();
      if (user) {
        setCurrentUser(user);
      }
    } catch (e) {
      console.error("Failed to load user session:", e);
      // If session is corrupt, clear it
      authLogout();
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    authLogout();
    setCurrentUser(null);
    setIsAdminReportOpen(false); // Close admin panel if open
  };

  // Cart Logic
  const addToCart = (product: Product, selectedSize: number | string, selectedColor: string) => {
    setCart(prev => {
      const existing = prev.find(item => 
        item.id === product.id && 
        item.selectedSize === selectedSize && 
        item.selectedColor === selectedColor
      );
      
      if (existing) {
        return prev.map(item => 
          (item === existing) ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1, selectedSize, selectedColor }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const onQuickAdd = (product: Product) => {
    // Default quick add picks first color/size
    addToCart(product, product.sizes[0], product.colors[0]);
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-white">
        <HolidayBanner country={country} language={language} />

        <Navbar 
          cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)} 
          onOpenCart={() => setIsCartOpen(true)}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          language={language}
          setLanguage={setLanguage}
          country={country}
          setCountry={setCountry}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
        
        <CartDrawer 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
          cartItems={cart} 
          updateQuantity={updateQuantity}
          removeItem={removeItem}
        />

        <AdminReportModal 
          isOpen={isAdminReportOpen} 
          onClose={() => setIsAdminReportOpen(false)} 
        />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home featuredProducts={PRODUCTS} onQuickAdd={onQuickAdd} language={language} />} />
            <Route path="/catalog" element={<Catalog products={PRODUCTS} onQuickAdd={onQuickAdd} />} />
            <Route path="/product/:id" element={<ProductDetails addToCart={addToCart} country={country} />} />
            <Route path="/auth" element={<Auth onLogin={handleLogin} />} />
            <Route path="/checkout" element={<Checkout country={country} cart={cart} />} />
          </Routes>
        </main>

        <AIChatBot />
        <Footer 
          onOpenAdmin={() => setIsAdminReportOpen(true)} 
          currentUser={currentUser}
        />
      </div>
    </Router>
  );
};

export default App;
