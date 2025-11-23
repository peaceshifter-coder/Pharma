
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Category, Store, CartItem, AppSettings, ViewState, AdminViewState, User, Order, Toast, Page } from '../types';
import { INITIAL_SETTINGS } from '../constants';
import { db } from '../services/api';

interface AppContextType {
  appLoading: boolean;
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
  pages: Page[];
  selectedPage: Page | null;
  
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
  attachPrescription: (productId: string, fileName: string) => void;
  clearCart: () => void;
  navigate: (view: ViewState) => void;
  viewProduct: (product: Product) => void;
  setAdminView: (view: AdminViewState) => void;
  setUserLocation: (loc: { lat: number; lng: number }) => void;
  setSelectedCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  
  // Auth Actions
  login: (email: string, password?: string) => Promise<User | null>;
  register: (name: string, email: string) => void;
  logout: () => void;
  placeOrder: (shippingAddress: string, paymentMethod: string) => void;
  addAddress: (address: string) => void;
  deleteAddress: (address: string) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;

  // Pages Actions
  viewPage: (slug: string) => void;
  addPage: (page: Page) => void;
  updatePage: (page: Page) => void;
  deletePage: (id: string) => void;

  // Toast Actions
  showToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [appLoading, setAppLoading] = useState(true);
  
  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [settings, setSettings] = useState<AppSettings>(INITIAL_SETTINGS);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [user, setUser] = useState<User | null>(db.auth.getCurrentUser());
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [view, setView] = useState<ViewState>('HOME');
  const [adminView, setAdminView] = useState<AdminViewState>('DASHBOARD');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearestStore, setNearestStore] = useState<Store | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Initial Data Load (Simulate connecting to DB)
  useEffect(() => {
    const initData = async () => {
        setAppLoading(true);
        try {
            const [p, c, s, st, o, pg] = await Promise.all([
                db.products.getAll(),
                db.categories.getAll(),
                db.stores.getAll(),
                db.settings.get(),
                db.orders.getAll(),
                db.pages.getAll()
            ]);
            setProducts(p);
            setCategories(c);
            setStores(s);
            setSettings(st);
            setAllOrders(o);
            setPages(pg);
        } catch (error) {
            console.error("Failed to connect to database:", error);
            showToast("Database connection failed", "error");
        } finally {
            setAppLoading(false);
        }
    };
    initData();
  }, []);

  // Toast Helper
  const showToast = (message: string, type: Toast['type'] = 'success') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 3000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // --- Actions ---

  // Products
  const addProduct = async (p: Product) => {
      // Optimistic update
      setProducts(prev => [...prev, p]);
      showToast('Product adding...');
      await db.products.save(p);
      showToast('Product saved to database');
  };

  const updateProduct = async (p: Product) => {
      setProducts(prev => prev.map(i => i.id === p.id ? p : i));
      await db.products.save(p);
      showToast('Product updated');
  };

  const deleteProduct = async (id: string) => {
      setProducts(prev => prev.filter(i => i.id !== id));
      await db.products.delete(id);
      showToast('Product deleted', 'info');
  };

  // Categories
  const addCategory = async (c: Category) => {
      setCategories(prev => [...prev, c]);
      await db.categories.save(c);
      showToast('Category added');
  };
  const updateCategory = async (c: Category) => {
      setCategories(prev => prev.map(i => i.id === c.id ? c : i));
      await db.categories.save(c);
      showToast('Category updated');
  };
  const deleteCategory = async (id: string) => {
      setCategories(prev => prev.filter(c => c.id !== id));
      await db.categories.delete(id);
      showToast('Category deleted', 'info');
  };

  // Stores
  const addStore = async (s: Store) => {
      setStores(prev => [...prev, s]);
      await db.stores.save(s);
      showToast('Store added');
  };
  const updateStore = async (s: Store) => {
      setStores(prev => prev.map(i => i.id === s.id ? s : i));
      await db.stores.save(s);
      showToast('Store updated');
  };
  const deleteStore = async (id: string) => {
      setStores(prev => prev.filter(s => s.id !== id));
      await db.stores.delete(id);
      showToast('Store deleted', 'info');
  };

  // Settings
  const updateSettings = async (s: AppSettings) => {
      setSettings(s);
      await db.settings.save(s);
      showToast('Settings saved');
  };

  const togglePaymentMethod = async (id: string) => {
      const newSettings = {
          ...settings,
          paymentMethods: settings.paymentMethods.map(pm => 
              pm.id === id ? { ...pm, enabled: !pm.enabled } : pm
          )
      };
      setSettings(newSettings);
      await db.settings.save(newSettings);
      showToast('Payment method updated');
  };

  // Cart
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

  const attachPrescription = (productId: string, fileName: string) => {
      setCart(prev => prev.map(item => item.id === productId ? { ...item, prescriptionProof: fileName } : item));
      if(fileName) showToast('Prescription attached successfully');
      else showToast('Prescription removed', 'info');
  };

  const clearCart = () => setCart([]);

  // Navigation
  const navigate = (v: ViewState) => {
    window.scrollTo(0, 0);
    setView(v);
  };

  const viewProduct = (product: Product) => {
    setSelectedProduct(product);
    navigate('PRODUCT');
  };

  const viewPage = (slug: string) => {
      const page = pages.find(p => p.slug === slug);
      if (page) {
          setSelectedPage(page);
          navigate('PAGE');
      } else {
          showToast('Page not found', 'error');
      }
  };

  // Auth
  const login = async (email: string, password?: string): Promise<User | null> => {
    const user = await db.auth.login(email, password);
    setUser(user);
    showToast(`Welcome back, ${user.name}`);
    return user;
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
      db.auth.updateUser(newUser); // Simulate saving new user
      showToast('Account created successfully');
  };

  const logout = () => {
      setUser(null);
      db.auth.logout();
      navigate('HOME');
      showToast('Logged out successfully', 'info');
  };

  // Orders
  const placeOrder = async (shippingAddress: string, paymentMethod: string) => {
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

      // Optimistic update
      if (user) {
          const updatedUser = { ...user, orders: [newOrder, ...user.orders] };
          setUser(updatedUser);
          db.auth.updateUser(updatedUser);
      }
      setAllOrders(prev => [newOrder, ...prev]);
      
      await db.orders.create(newOrder);

      clearCart();
      showToast('Order placed successfully!');
  };

  const addAddress = (address: string) => {
      if (user) {
          const updatedUser = {...user, savedAddresses: [...user.savedAddresses, address]};
          setUser(updatedUser);
          db.auth.updateUser(updatedUser);
          showToast('Address saved');
      }
  }

  const deleteAddress = (address: string) => {
      if (user) {
          const updatedUser = {...user, savedAddresses: user.savedAddresses.filter(a => a !== address)};
          setUser(updatedUser);
          db.auth.updateUser(updatedUser);
          showToast('Address removed', 'info');
      }
  }

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
      setAllOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      await db.orders.updateStatus(orderId, status);
      showToast(`Order status updated to ${status}`);
  };

  // Pages CRUD
  const addPage = async (p: Page) => {
      setPages(prev => [...prev, p]);
      await db.pages.save(p);
      showToast('Page added');
  };
  const updatePage = async (p: Page) => {
      setPages(prev => prev.map(page => page.id === p.id ? p : page));
      await db.pages.save(p);
      showToast('Page updated');
  };
  const deletePage = async (id: string) => {
      setPages(prev => prev.filter(p => p.id !== id));
      await db.pages.delete(id);
      showToast('Page deleted', 'info');
  };

  return (
    <AppContext.Provider value={{
      appLoading,
      products, categories, stores, cart, settings, view, adminView, userLocation, nearestStore, user,
      selectedCategory, setSelectedCategory, allOrders, searchQuery, toasts, selectedProduct, pages, selectedPage,
      addProduct, updateProduct, deleteProduct,
      addCategory, updateCategory, deleteCategory,
      addStore, updateStore, deleteStore,
      updateSettings, togglePaymentMethod,
      addToCart, removeFromCart, updateCartQuantity, attachPrescription, clearCart,
      navigate, viewProduct, setAdminView, setUserLocation: (loc) => {
        setUserLocation(loc);
      },
      login, register, logout, placeOrder, addAddress, deleteAddress, updateOrderStatus,
      viewPage, addPage, updatePage, deletePage,
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
