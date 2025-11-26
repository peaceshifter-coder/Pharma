
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  stock: number;
  requiresPrescription: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
}

export interface CartItem extends Product {
  quantity: number;
  prescriptionProof?: string;
}

export interface Order {
  id: string;
  customerName: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered';
  shippingAddress: string;
  paymentMethod: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  savedAddresses: string[];
  orders: Order[];
  role?: 'admin' | 'customer';
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'cod' | 'card' | 'wallet';
  enabled: boolean;
  description?: string;
}

export interface HeroConfig {
    title: string;
    subtitle: string;
    imageUrl: string;
    ctaText: string;
}

export interface ContactConfig {
    address: string;
    phone: string;
    email: string;
}

export interface AppSettings {
  logoUrl: string;
  siteName: string;
  primaryColor: string;
  paymentMethods: PaymentMethod[];
  hero: HeroConfig;
  contact: ContactConfig;
  footerAboutText: string;
  currencySymbol: string;
  taxRate: number;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  lastUpdated: string;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export type ViewState = 'HOME' | 'SHOP' | 'PRODUCT' | 'CART' | 'CHECKOUT' | 'ADMIN' | 'LOGIN' | 'REGISTER' | 'PROFILE' | 'PAGE' | 'TRACK_ORDER';
export type AdminViewState = 'DASHBOARD' | 'PRODUCTS' | 'CATEGORIES' | 'STORES' | 'SETTINGS' | 'ORDERS' | 'PAGES';
