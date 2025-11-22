import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Category, Store, CartItem, AppSettings, ViewState, AdminViewState, User, Order, Toast } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_STORES, INITIAL_SETTINGS, INITIAL_ORDERS } from '../constants';

interface AppContextType {
  products: Product[];
  categories: Category[];
  stores: Store[];
  cart: CartItem[];
  settings: AppSettings;
  view: ViewState;
  adminView: AdminViewState;
  userLocation: { lat: number; lng: number } | null;
  nearestStore: Store | null;
  user: User | null;
  selectedCategory: string;
  selectedProduct: Product | null;
  allOrders: Order[];
  searchQuery: string;
  toasts: Toast[];
  
  // Actions
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  addCategory: (category: Category) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  addStore: (store: Store) => void;
  updateStore: (store: Store) => void;
  deleteStore: (id: string) => void;
  updateSettings: (settings: AppSettings) => void;
  togglePaymentMethod: (id: string) => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  navigate: (view: ViewState) => void;
  viewProduct: (product: Product) => void;
  setAdminView: (view: AdminViewState) => void;
  setUserLocation: (loc: { lat: number; lng: number }) => void;
  setSelectedCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  
  // Auth Actions
  login: (email: string, password?: string) => User | null;
  register: (name: string, email: string) => void;
  logout: () => void;
  placeOrder: (shippingAddress: string, paymentMethod: string) => void;
  addAddress: (address: string) => void;
  deleteAddress: (address: string) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;

  // Toast Actions
  showToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state from localStorage or constants
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });
  
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [stores, setStores] = useState<Store[]>(() => {
    const saved = localStorage.getItem('stores');
    return saved ? JSON.parse(saved) : INITIAL_STORES;
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('settings');
    const parsed = saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    // Merge with INITIAL_SETTINGS to ensure new fields like paymentMethods are present
    return { 
        ...INITIAL_SETTINGS, 
        ...parsed, 
        paymentMethods: parsed.paymentMethods || INITIAL_SETTINGS.paymentMethods 
    };
  });

  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [allOrders, setAllOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('all_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [view, setView] = useState<ViewState>('HOME');
  const [adminView, setAdminView] = useState<AdminViewState>('DASHBOARD');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearestStore, setNearestStore] = useState<Store | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Persistence Effects
  useEffect(() => localStorage.setItem('products', JSON.stringify(products)), [products]);
  useEffect(() => localStorage.setItem('categories', JSON.stringify(categories)), [categories]);
  useEffect(() => localStorage.setItem('stores', JSON.stringify(stores)), [stores]);
  useEffect(() => localStorage.setItem('settings', JSON.stringify(settings)), [settings]);
  useEffect(() => localStorage.setItem('all_orders', JSON.stringify(allOrders)), [allOrders]);
  useEffect(() => {
    if (user) localStorage.setItem('currentUser', JSON.stringify(user));
    else localStorage.removeItem('currentUser');
  }, [user]);

  // Toast Helper
  const showToast = (message: string, type: Toast['type'] = 'success') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 3000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Actions
  const addProduct = (p: Product) => { setProducts([...products, p]); showToast('Product added'); };
  const updateProduct = (p: Product) => { setProducts(products.map(i => i.id === p.id ? p : i)); showToast('Product updated'); };
  const deleteProduct = (id: string) => { setProducts(products.filter(i => i.id !== id)); showToast('Product deleted', 'info'); };

  const addCategory = (c: Category) => { setCategories([...categories, c]); showToast('Category added'); };
  const updateCategory = (c: Category) => { setCategories(categories.map(i => i.id === c.id ? c : i)); showToast('Category updated'); };
  const deleteCategory = (id: string) => { setCategories(categories.filter(c => c.id !== id)); showToast('Category deleted', 'info'); };

  const addStore = (s: Store) => { setStores([...stores, s]); showToast('Store added'); };
  const updateStore = (s: Store) => { setStores(stores.map(i => i.id === s.id ? s : i)); showToast('Store updated'); };
  const deleteStore = (id: string) => { setStores(stores.filter(s => s.id !== id)); showToast('Store deleted', 'info'); };

  const updateSettings = (s: AppSettings) => { setSettings(s); showToast('Settings saved'); };

  const togglePaymentMethod = (id: string) => {
      setSettings(prev => ({
          ...prev,
          paymentMethods: prev.paymentMethods.map(pm => 
              pm.id === id ? { ...pm, enabled: !pm.enabled } : pm
          )
      }));
      showToast('Payment method updated');
  };

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity }];
    });
    showToast(`Added ${quantity} ${product.name} to cart`);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
    showToast('Item removed from cart', 'info');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);

  const navigate = (v: ViewState) => {
    window.scrollTo(0, 0);
    setView(v);
  };

  const viewProduct = (product: Product) => {
    setSelectedProduct(product);
    navigate('PRODUCT');
  };

  // Auth Logic
  const login = (email: string, password?: string): User | null => {
    // Admin Check
    if (email === 'admin@gmail.com' && password === 'Dark360@') {
        const adminUser: User = {
            id: 'admin-1',
            name: 'Administrator',
            email: email,
            savedAddresses: [],
            orders: [],
            role: 'admin'
        };
        setUser(adminUser);
        showToast('Welcome Administrator');
        return adminUser;
    }

    // Normal User Logic (Mock)
    const mockUser: User = {
        id: 'u1',
        name: email.split('@')[0],
        email: email,
        savedAddresses: ['123 Main St, Cityville', '456 Oak Ave, Townsville'],
        orders: [],
        role: 'customer'
    };
    setUser(mockUser);
    showToast(`Welcome back, ${mockUser.name}`);
    return mockUser;
  };

  const register = (name: string, email: string) => {
      const newUser: User = {
          id: Date.now().toString(),
          name,
          email,
          savedAddresses: [],
          orders: [],
          role: 'customer'
      };
      setUser(newUser);
      showToast('Account created successfully');
  };

  const logout = () => {
      setUser(null);
      navigate('HOME');
      showToast('Logged out successfully', 'info');
  };

  const placeOrder = (shippingAddress: string, paymentMethod: string) => {
      if (!cart.length) return;
      
      const newOrder: Order = {
          id: 'ORD-' + Math.floor(Math.random() * 10000),
          customerName: user ? user.name : 'Guest',
          date: new Date().toLocaleDateString(),
          items: [...cart],
          total: cart.reduce((sum, i) => sum + (i.price * i.quantity), 0),
          status: 'Processing',
          shippingAddress,
          paymentMethod
      };

      if (user) {
          setUser({ ...user, orders: [newOrder, ...user.orders] });
      }

      setAllOrders(prev => [newOrder, ...prev]);
      clearCart();
      showToast('Order placed successfully!');
  };

  const addAddress = (address: string) => {
      if (user) {
          setUser({...user, savedAddresses: [...user.savedAddresses, address]});
          showToast('Address saved');
      }
  }

  const deleteAddress = (address: string) => {
      if (user) {
          setUser({...user, savedAddresses: user.savedAddresses.filter(a => a !== address)});
          showToast('Address removed', 'info');
      }
  }

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
      setAllOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      if (user) {
          const userHasOrder = user.orders.find(o => o.id === orderId);
          if (userHasOrder) {
              setUser({
                  ...user,
                  orders: user.orders.map(o => o.id === orderId ? { ...o, status } : o)
              });
          }
      }
      showToast(`Order status updated to ${status}`);
  };

  return (
    <AppContext.Provider value={{
      products, categories, stores, cart, settings, view, adminView, userLocation, nearestStore, user,
      selectedCategory, setSelectedCategory, allOrders, searchQuery, toasts, selectedProduct,
      addProduct, updateProduct, deleteProduct,
      addCategory, updateCategory, deleteCategory,
      addStore, updateStore, deleteStore,
      updateSettings, togglePaymentMethod,
      addToCart, removeFromCart, updateCartQuantity, clearCart,
      navigate, viewProduct, setAdminView, setUserLocation: (loc) => {
        setUserLocation(loc);
      },
      login, register, logout, placeOrder, addAddress, deleteAddress, updateOrderStatus,
      setSearchQuery, showToast, removeToast
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};