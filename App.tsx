import React, { useEffect, useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AdminDashboard, AdminProducts, AdminStores, AdminSettings, AdminCategories, AdminOrders } from './components/AdminViews';
import { Home, Shop, Checkout, ProductDetail } from './components/PublicViews';
import { Login, Register, UserProfile } from './components/AuthViews';
import { findNearestStore } from './services/geo.ts';
import { ShoppingCart, MapPin, Menu, X, Settings, LayoutDashboard, Package, Store as StoreIcon, Layers, User as UserIcon, ShieldCheck, ChevronDown, ClipboardList, Search, Phone, Mail, CheckCircle, AlertCircle, Info } from 'lucide-react';

// --- Toast Container ---
const ToastContainer = () => {
    const { toasts, removeToast } = useApp();
    return (
        <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-3 pointer-events-none">
            {toasts.map(t => (
                <div 
                    key={t.id} 
                    onClick={() => removeToast(t.id)}
                    className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 animate-in slide-in-from-right cursor-pointer ${
                        t.type === 'success' ? 'bg-emerald-600 text-white' : 
                        t.type === 'error' ? 'bg-red-500 text-white' : 
                        'bg-gray-800 text-white'
                    }`}
                >
                    {t.type === 'success' && <CheckCircle className="w-5 h-5" />}
                    {t.type === 'error' && <AlertCircle className="w-5 h-5" />}
                    {t.type === 'info' && <Info className="w-5 h-5" />}
                    <span className="font-medium text-sm">{t.message}</span>
                </div>
            ))}
        </div>
    );
}

// --- Navigation Component ---
const Navbar = () => {
  const { settings, cart, navigate, stores, userLocation, setUserLocation, user, categories, setSelectedCategory, searchQuery, setSearchQuery } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [nearest, setNearest] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
                const near = findNearestStore(position.coords.latitude, position.coords.longitude, stores);
                if (near) setNearest(near.name);
            },
            (err) => console.log("Geo permission denied or error", err)
        );
    }
  }, [stores, setUserLocation]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim() !== '') {
        navigate('SHOP');
    }
  };

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <div className="flex items-center cursor-pointer" onClick={() => navigate('HOME')}>
                <img src={settings.logoUrl} alt="Logo" className="h-8 w-8 mr-2" />
                <span className="font-bold text-xl text-gray-800">{settings.siteName}</span>
            </div>

            {/* Nearest Store Indicator - Desktop */}
            <div className="hidden lg:flex items-center text-sm bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-100">
                <MapPin className="w-3 h-3 mr-1.5" />
                <span className="font-medium truncate max-w-[200px]">
                    {nearest ? `${nearest}` : "Locating..."}
                </span>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center px-6">
              {/* Search Bar */}
              <div className="hidden md:flex relative w-full max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input 
                    type="text" 
                    className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors" 
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={handleSearch}
                  />
              </div>
          </div>

          <div className="hidden md:flex items-center space-x-6">
             {/* Categories Dropdown */}
            <div className="relative group h-full flex items-center">
                <button className="text-gray-600 hover:text-emerald-600 font-medium transition flex items-center gap-1 h-full">
                    Categories <ChevronDown className="w-4 h-4" />
                </button>
                <div className="absolute top-14 right-0 w-56 bg-white shadow-xl rounded-xl border border-gray-100 py-2 hidden group-hover:block z-50 animate-in fade-in slide-in-from-top-2">
                    <button
                        onClick={() => { setSelectedCategory('All'); navigate('SHOP'); }}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 font-medium text-sm"
                    >
                        All Categories
                    </button>
                    <div className="h-px bg-gray-100 my-1"></div>
                    {categories.map(c => (
                        <button
                            key={c.id}
                            onClick={() => { setSelectedCategory(c.name); navigate('SHOP'); }}
                            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 text-sm"
                        >
                            {c.name}
                        </button>
                    ))}
                </div>
            </div>

            <button onClick={() => navigate('SHOP')} className="text-gray-600 hover:text-emerald-600 font-medium transition">Shop</button>
            {user?.role === 'admin' && (
                 <button onClick={() => navigate('ADMIN')} className="text-gray-600 hover:text-emerald-600 font-medium transition flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" /> Admin
                 </button>
            )}
            
            <div className="flex items-center gap-4 border-l pl-6 border-gray-200">
                <button onClick={() => navigate('CHECKOUT')} className="relative p-2 text-gray-600 hover:text-emerald-600 transition">
                <ShoppingCart className="w-6 h-6" />
                {cart.length > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
                    {cart.length}
                    </span>
                )}
                </button>

                <button onClick={() => navigate(user ? 'PROFILE' : 'LOGIN')} className="p-2 text-gray-600 hover:text-emerald-600 transition flex items-center gap-2">
                    <div className="bg-gray-100 rounded-full p-1">
                        <UserIcon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium hidden lg:block">{user ? 'Profile' : 'Sign In'}</span>
                </button>
            </div>
          </div>

          <div className="flex items-center md:hidden gap-4">
             {/* Mobile Cart Icon */}
             <button onClick={() => navigate('CHECKOUT')} className="relative p-2 text-gray-600">
                <ShoppingCart className="w-6 h-6" />
                {cart.length > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
                    {cart.length}
                    </span>
                )}
             </button>
             <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-600 p-2">
               {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
             </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg absolute w-full z-50 max-h-[80vh] overflow-y-auto">
          <div className="px-4 pt-4 pb-4 space-y-3">
            {/* Mobile Search */}
             <div className="relative w-full mb-4">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input 
                    type="text" 
                    className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" 
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={handleSearch}
                  />
              </div>

            {/* Mobile Location */}
            <div className="flex items-center text-sm text-emerald-700 bg-emerald-50 p-3 rounded-lg">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="font-medium">{nearest ? `${nearest}` : "Locating..."}</span>
            </div>

            <button onClick={() => { navigate('HOME'); setMobileMenuOpen(false); }} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 w-full text-left">Home</button>
            
            {/* Mobile Categories List */}
            <div className="px-3 py-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Categories</p>
                {categories.map(c => (
                    <button
                        key={c.id}
                        onClick={() => { setSelectedCategory(c.name); navigate('SHOP'); setMobileMenuOpen(false); }}
                        className="block w-full text-left px-2 py-2 text-gray-600 hover:text-emerald-600 text-sm"
                    >
                        {c.name}
                    </button>
                ))}
            </div>

            <button onClick={() => { navigate('SHOP'); setMobileMenuOpen(false); }} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 w-full text-left">Shop All</button>
            {user?.role === 'admin' && (
                 <button onClick={() => { navigate('ADMIN'); setMobileMenuOpen(false); }} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 w-full text-left flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> Admin
                 </button>
            )}
            <button onClick={() => { navigate(user ? 'PROFILE' : 'LOGIN'); setMobileMenuOpen(false); }} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 w-full text-left">
                {user ? 'My Profile' : 'Sign In'}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

// --- Footer Component ---
const Footer = () => {
    const { settings, navigate, categories, setSelectedCategory } = useApp();

    return (
        <footer className="bg-emerald-950 text-emerald-50 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <img src={settings.logoUrl} alt="Logo" className="h-10 w-10 brightness-0 invert" />
                            <span className="font-bold text-2xl text-white">{settings.siteName}</span>
                        </div>
                        <p className="text-emerald-200/80 text-sm leading-relaxed">
                            Your trusted partner in health and wellness. We provide high-quality medicines, health products, and professional care right to your doorstep.
                        </p>
                        <div className="flex gap-4 pt-4">
                            {/* Social Placeholders */}
                            <div className="w-8 h-8 bg-emerald-900 rounded-full flex items-center justify-center hover:bg-emerald-700 transition cursor-pointer text-white text-xs font-bold">FB</div>
                            <div className="w-8 h-8 bg-emerald-900 rounded-full flex items-center justify-center hover:bg-emerald-700 transition cursor-pointer text-white text-xs font-bold">TW</div>
                            <div className="w-8 h-8 bg-emerald-900 rounded-full flex items-center justify-center hover:bg-emerald-700 transition cursor-pointer text-white text-xs font-bold">IG</div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-bold text-white text-lg mb-6">Quick Links</h3>
                        <ul className="space-y-3 text-sm">
                            <li><button onClick={() => navigate('HOME')} className="text-emerald-200/80 hover:text-white transition">Home</button></li>
                            <li><button onClick={() => navigate('SHOP')} className="text-emerald-200/80 hover:text-white transition">Shop All</button></li>
                            <li><button onClick={() => navigate('LOGIN')} className="text-emerald-200/80 hover:text-white transition">My Account</button></li>
                            <li><button onClick={() => navigate('CHECKOUT')} className="text-emerald-200/80 hover:text-white transition">Track Order</button></li>
                        </ul>
                    </div>

                     {/* Categories */}
                     <div>
                        <h3 className="font-bold text-white text-lg mb-6">Popular Categories</h3>
                        <ul className="space-y-3 text-sm">
                            {categories.slice(0, 5).map(c => (
                                <li key={c.id}>
                                    <button onClick={() => { setSelectedCategory(c.name); navigate('SHOP'); }} className="text-emerald-200/80 hover:text-white transition">{c.name}</button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="font-bold text-white text-lg mb-6">Contact Us</h3>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                                <span className="text-emerald-100">123 Health Avenue, Medical District,<br/>New York, NY 10001</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-emerald-400 shrink-0" />
                                <span className="text-emerald-100">(555) 123-4567</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-emerald-400 shrink-0" />
                                <span className="text-emerald-100">support@pharmacareplus.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-emerald-900 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-emerald-400">
                    <p>&copy; {new Date().getFullYear()} {settings.siteName}. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <button className="hover:text-white transition">Privacy Policy</button>
                        <button className="hover:text-white transition">Terms of Service</button>
                        <button className="hover:text-white transition">Cookie Policy</button>
                    </div>
                </div>
            </div>
        </footer>
    );
}

// --- Admin Layout ---
const AdminLayout = () => {
    const { adminView, setAdminView, navigate } = useApp();
    
    const NavItem = ({ view, icon: Icon, label }: any) => (
        <button 
            onClick={() => setAdminView(view)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${adminView === view ? 'bg-emerald-100 text-emerald-800 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}
        >
            <Icon className="w-5 h-5" />
            {label}
        </button>
    );

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col h-screen sticky top-0">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center gap-2 font-bold text-xl text-gray-800 cursor-pointer" onClick={() => navigate('HOME')}>
                        <div className="bg-emerald-600 text-white p-1 rounded">Admin</div>
                        <span>Panel</span>
                    </div>
                </div>
                <div className="flex-1 p-4 overflow-y-auto">
                    <NavItem view="DASHBOARD" icon={LayoutDashboard} label="Dashboard" />
                    <NavItem view="ORDERS" icon={ClipboardList} label="Orders" />
                    <NavItem view="PRODUCTS" icon={Package} label="Products" />
                    <NavItem view="CATEGORIES" icon={Layers} label="Categories" />
                    <NavItem view="STORES" icon={StoreIcon} label="Stores" />
                    <NavItem view="SETTINGS" icon={Settings} label="Settings" />
                </div>
                <div className="p-4 border-t border-gray-200">
                    <button onClick={() => navigate('HOME')} className="w-full py-2 px-4 text-sm text-center text-gray-600 hover:bg-gray-100 rounded">Exit Admin</button>
                </div>
            </aside>
            
            {/* Content */}
            <main className="flex-1 p-8 overflow-y-auto h-screen">
                {adminView === 'DASHBOARD' && <AdminDashboard />}
                {adminView === 'ORDERS' && <AdminOrders />}
                {adminView === 'PRODUCTS' && <AdminProducts />}
                {adminView === 'CATEGORIES' && <AdminCategories />}
                {adminView === 'STORES' && <AdminStores />}
                {adminView === 'SETTINGS' && <AdminSettings />}
            </main>
        </div>
    );
};

// --- Main Layout Switcher ---
const MainContent = () => {
    const { view, user } = useApp();

    // Simple protection: if viewing ADMIN but not admin user, show login
    if (view === 'ADMIN' && user?.role !== 'admin') {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Navbar />
                <div className="flex-grow flex items-center justify-center">
                     <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
                        <p className="text-gray-600 mb-4">You must be an administrator to view this page.</p>
                        <Login />
                     </div>
                </div>
                <Footer />
                <ToastContainer />
            </div>
        );
    }

    if (view === 'ADMIN') return (
        <>
            <AdminLayout />
            <ToastContainer />
        </>
    );

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                {view === 'HOME' && <Home />}
                {view === 'SHOP' && <Shop />}
                {view === 'PRODUCT' && <ProductDetail />}
                {view === 'CHECKOUT' && <Checkout />}
                {view === 'LOGIN' && <Login />}
                {view === 'REGISTER' && <Register />}
                {view === 'PROFILE' && <UserProfile />}
            </main>
            <Footer />
            <ToastContainer />
        </div>
    );
};

// --- App Entry ---
const App = () => {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
};

export default App;