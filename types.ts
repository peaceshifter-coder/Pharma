export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stock: number;
  requiresPrescription: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
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

export interface AppSettings {
  logoUrl: string;
  siteName: string;
  primaryColor: string;
  paymentMethods: PaymentMethod[];
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export type ViewState = 'HOME' | 'SHOP' | 'PRODUCT' | 'CART' | 'CHECKOUT' | 'ADMIN' | 'LOGIN' | 'REGISTER' | 'PROFILE';
export type AdminViewState = 'DASHBOARD' | 'PRODUCTS' | 'CATEGORIES' | 'STORES' | 'SETTINGS' | 'ORDERS';