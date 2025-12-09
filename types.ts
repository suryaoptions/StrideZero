
export interface Product {
  id: string;
  name: string;
  category: 'men' | 'women' | 'kids' | 'accessories' | 'skate' | 'electronics' | 'home' | 'grocery' | string;
  price: number;
  originalPrice?: number;
  image: string;
  colors: string[];
  sizes: number[] | string[];
  releaseDate: string; // ISO Date String
  description: string;
  materialCost?: number; // Cost of raw materials for financial breakdown
  materials?: string[]; // e.g. "18k Gold", "VS1 Diamonds"
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: number | string;
  selectedColor: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface FilterState {
  category: string | null;
  minPrice: number;
  maxPrice: number;
  color: string | null;
}

export enum CheckoutStep {
  CART = 0,
  SHIPPING = 1,
  PAYMENT = 2,
  CONFIRMATION = 3,
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export type Language = 'en' | 'de' | 'fr' | 'ja';
export type Country = 'US' | 'UK' | 'AU' | 'NZ' | 'DE' | 'IT' | 'FR' | 'CA' | 'JP' | 'IN';
