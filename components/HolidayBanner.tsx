import React, { useState, useEffect } from 'react';
import { X, Globe } from 'lucide-react';
import { Country, Language } from '../types';
import { HOLIDAY_PROMOS } from '../constants';

interface HolidayBannerProps {
  country: Country;
  language: Language;
}

const HolidayBanner: React.FC<HolidayBannerProps> = ({ country, language }) => {
  const [isVisible, setIsVisible] = useState(true);
  
  // Re-show banner when country changes to show the new deal
  useEffect(() => {
    setIsVisible(true);
  }, [country]);

  if (!isVisible) return null;

  const promo = HOLIDAY_PROMOS[country];

  return (
    <div className="bg-brand-platinum text-black py-2 px-4 relative animate-fade-in-down border-b border-white">
      <div className="max-w-7xl mx-auto flex items-center justify-center text-center">
        <Globe size={16} className="mr-3 hidden sm:block" />
        <p className="text-xs sm:text-sm font-bold tracking-wide uppercase">
          <span className="font-black mr-2">[{country} EXCLUSIVE]</span> 
          {promo.name}: Use Code <span className="bg-black text-white px-2 py-0.5 mx-1">{promo.code}</span> for {promo.discount}
        </p>
      </div>
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-white/50 rounded-full transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default HolidayBanner;
