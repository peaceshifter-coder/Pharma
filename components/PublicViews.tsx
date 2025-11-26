
import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Product, Order } from '../types';
import { calculateDistance } from '../services/geo';
import { ShoppingCart, Plus, Minus, Trash2, CheckCircle, AlertCircle, ArrowLeft, Star, ShieldCheck, Truck, Clock, CreditCard, Banknote, FileText, Upload, X, Search, Package, LogIn, MapPin, Navigation } from 'lucide-react';

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
    const { addToCart, viewProduct, formatPrice } = useApp();
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full group hover-lift overflow-hidden">
            <div 
                className="relative h-48 overflow-hidden bg-gray-50 cursor-pointer"
                onClick={() => viewProduct(product)}
            >
                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700 ease-in-out" />
                {product.requiresPrescription && (
                    <span className="absolute top-2 right-2 bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full border border-red-200 animate-scale-in">
                        Rx Required
                    </span>
                )}
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <div className="text-xs text-blue-600 font-semibold mb-1 uppercase tracking-wider">{product.category}</div>
                <h3 
                    className="font-bold text-gray-900 text-lg mb-1 leading-tight cursor-pointer hover:text-blue-600 transition"
                    onClick={() => viewProduct(product)}
                >
                    {product.name}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow">{product.description}</p>
                <div className="flex items-center justify-between mt-auto">
                    <span className="text-xl font-bold text-gray-900">{formatPrice(product.price)}</span>
                    <button 
                        onClick={() => addToCart(product)}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-sm transition-all transform hover:scale-110 active:scale-95"
                        title="Add to Cart"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export const ProductDetail = () => {
    const { selectedProduct, addToCart, navigate, formatPrice } = useApp();
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState<'DESC' | 'INFO'>('DESC');
    const [activeImage, setActiveImage] = useState('');

    useEffect(() => {
        if(selectedProduct && selectedProduct.images.length > 0) {
            setActiveImage(selectedProduct.images[0]);
        }
    }, [selectedProduct]);

    if (!selectedProduct) {
        navigate('SHOP');
        return null;
    }

    const handleBuyNow = () => {
        addToCart(selectedProduct, quantity);
        navigate('CHECKOUT');
    };

    return (
        <div className="max-w-6xl mx-auto px-4 md:px-0 animate-fade-in-up">
            <button onClick={() => navigate('SHOP')} className="flex items-center text-gray-500 hover:text-blue-600 mb-6 transition group">
                <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" /> Back to Shop
            </button>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Image Section */}
                    <div className="bg-gray-50 p-8 flex flex-col items-center justify-center relative gap-4">
                         <img src={activeImage} alt={selectedProduct.name} className="max-h-[400px] w-full object-contain rounded-lg shadow-sm mix-blend-multiply animate-scale-in" />
                         {selectedProduct.requiresPrescription && (
                            <div className="absolute top-4 left-4 bg-red-100 text-red-600 text-xs font-bold px-3 py-1.5 rounded-full border border-red-200 flex items-center gap-1 animate-fade-in">
                                <AlertCircle className="w-3 h-3" /> Prescription Required
                            </div>
                        )}
                        <div className="flex gap-3 overflow-x-auto w-full justify-center px-4 py-2">
                            {selectedProduct.images.map((img, idx) => (
                                <button 
                                    key={idx} 
                                    onClick={() => setActiveImage(img)}
                                    className={`relative w-20 h-20 border-2 rounded-lg overflow-hidden shrink-0 transition-all ${activeImage === img ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'}`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="p-8 md:p-12 flex flex-col">
                        <div className="mb-6 animate-fade-in-up delay-100">
                            <span className="text-blue-600 font-semibold text-sm tracking-wide uppercase">{selectedProduct.category}</span>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">{selectedProduct.name}</h1>
                            
                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex items-center text-yellow-400">
                                    {[...Array(5)].map((_, i) => <Star key={i} className={`w-5 h-5 ${i < 4 ? 'fill-current' : 'text-gray-300'}`} />)}
                                    <span className="text-gray-500 text-sm ml-2 font-medium">(124 reviews)</span>
                                </div>
                                <span className="w-px h-5 bg-gray-300"></span>
                                <span className={`text-sm font-medium ${selectedProduct.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                    {selectedProduct.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                </span>
                            </div>

                            <div className="text-3xl font-bold text-gray-900 mb-6">{formatPrice(selectedProduct.price)}</div>

                            <div className="prose text-gray-600 mb-8 leading-relaxed">
                                {selectedProduct.description}
                            </div>

                            {/* Actions */}
                            <div className="space-y-4 pt-6 border-t border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center border border-gray-300 rounded-lg">
                                        <button 
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="px-4 py-3 text-gray-600 hover:bg-gray-50 transition border-r active:bg-gray-100"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="w-12 text-center font-medium">{quantity}</span>
                                        <button 
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="px-4 py-3 text-gray-600 hover:bg-gray-50 transition border-l active:bg-gray-100"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <button 
                                        onClick={() => addToCart(selectedProduct, quantity)}
                                        className="flex-1 bg-gray-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition shadow-lg shadow-gray-200 flex items-center justify-center gap-2 transform hover:-translate-y-1 active:scale-95"
                                    >
                                        <ShoppingCart className="w-5 h-5" /> Add to Cart
                                    </button>
                                </div>
                                <button 
                                    onClick={handleBuyNow}
                                    className="w-full bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100 transform hover:-translate-y-1 active:scale-95"
                                >
                                    Buy Now
                                </button>
                            </div>
                        </div>

                        {/* Additional Features */}
                        <div className="grid grid-cols-2 gap-4 mt-auto pt-8 animate-fade-in-up delay-200">
                            {[
                                {icon: Truck, text: 'Fast Delivery'},
                                {icon: ShieldCheck, text: 'Secure Payment'},
                                {icon: CheckCircle, text: 'Authentic Products'},
                                {icon: Clock, text: '24/7 Support'}
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm text-gray-600">
                                    <div className="p-2 bg-blue-50 rounded-full text-blue-600"><feature.icon className="w-4 h-4" /></div>
                                    <span>{feature.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                
                {/* Tabs Section */}
                <div className="border-t border-gray-100">
                    <div className="flex border-b border-gray-100">
                        {['DESC', 'INFO'].map((tab) => (
                            <button 
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`px-8 py-4 font-bold text-sm tracking-wide transition relative ${activeTab === tab ? 'text-blue-600 bg-blue-50/50' : 'text-gray-500 hover:text-gray-800'}`}
                            >
                                {tab === 'DESC' ? 'Description' : 'Additional Info'}
                                {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>}
                            </button>
                        ))}
                    </div>
                    <div className="p-8 md:p-12 bg-gray-50/30 min-h-[200px]">
                        {activeTab === 'DESC' && (
                            <div className="max-w-3xl text-gray-600 leading-relaxed space-y-4 animate-fade-in">
                                <p>Experience fast and effective relief with {selectedProduct.name}. Formulated by healthcare professionals, this product meets the highest standards of safety and efficacy.</p>
                                <p>Whether you are at home or on the go, {selectedProduct.name} is your reliable companion for health and wellness. Trusted by thousands of customers for its consistent quality.</p>
                                <ul className="list-disc pl-5 space-y-2 mt-4">
                                    <li>High potency formula</li>
                                    <li>Clinically tested ingredients</li>
                                    <li>Fast-acting absorption</li>
                                    <li>Recommended by pharmacists</li>
                                </ul>
                            </div>
                        )}
                        {activeTab === 'INFO' && (
                            <div className="max-w-3xl animate-fade-in">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                                    {[
                                        ['Brand', 'PharmaCare Essentials'],
                                        ['SKU', selectedProduct.id],
                                        ['Form', 'Standard Pack'],
                                        ['Storage', 'Cool & Dry Place']
                                    ].map(([k, v]) => (
                                        <div key={k} className="flex justify-between border-b border-gray-200 py-3">
                                            <span className="font-medium text-gray-900">{k}</span>
                                            <span className="text-gray-600">{v}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const Home = () => {
    const { products, categories, navigate, setSelectedCategory, settings } = useApp();
    const featuredProducts = useMemo(() => products.slice(0, 4), [products]);

    const handleCategoryClick = (categoryName: string) => {
        setSelectedCategory(categoryName);
        navigate('SHOP');
    };

    return (
        <div className="space-y-16 pb-12 animate-fade-in">
            {/* Hero Section */}
            <div className="relative bg-blue-900 rounded-3xl overflow-hidden text-white shadow-2xl mx-4 md:mx-0 animate-scale-in">
                <div 
                    className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay"
                    style={{ backgroundImage: `url('${settings.hero.imageUrl || 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=2000'}')` }}
                ></div>
                <div className="relative z-10 p-12 md:p-20 text-center md:text-left">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight animate-fade-in-up whitespace-pre-wrap">
                        {settings.hero.title || "Your Health, Our Priority"}
                    </h1>
                    <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-xl animate-fade-in-up delay-100">
                        {settings.hero.subtitle || "Get your medications delivered to your doorstep with the nearest pharmacy locator and trusted professionals."}
                    </p>
                    <button onClick={() => { setSelectedCategory('All'); navigate('SHOP'); }} className="bg-white text-blue-900 px-8 py-3 rounded-full font-bold hover:bg-blue-50 transition transform hover:scale-105 shadow-lg animate-fade-in-up delay-200">
                        {settings.hero.ctaText || "Shop Now"}
                    </button>
                </div>
            </div>

            {/* Featured Categories */}
            <div className="px-4 md:px-0">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center md:text-left">Browse Categories</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {categories.map((cat, idx) => (
                        <div 
                            key={cat.id} 
                            onClick={() => handleCategoryClick(cat.name)} 
                            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center cursor-pointer hover:border-blue-300 transition group hover-lift animate-fade-in-up"
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-gray-50 group-hover:border-blue-100 transition duration-300 bg-gray-50">
                                <img src={cat.imageUrl || 'https://via.placeholder.com/200'} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" alt={cat.name} />
                            </div>
                            <h3 className="font-bold text-gray-800 text-lg">{cat.name}</h3>
                        </div>
                    ))}
                </div>
            </div>

            {/* Featured Products */}
            <div className="px-4 md:px-0">
                <div className="flex justify-between items-end mb-8 px-2">
                    <h2 className="text-3xl font-bold text-gray-800">Featured Products</h2>
                    <button onClick={() => navigate('SHOP')} className="text-blue-600 font-semibold hover:text-blue-700 hover:underline">View All</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {featuredProducts.map((p, idx) => (
                        <div key={p.id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
                            <ProductCard product={p} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const Shop = () => {
    const { products, categories, selectedCategory, setSelectedCategory, searchQuery } = useApp();

    const filtered = products.filter(p => {
        const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
        const query = searchQuery.toLowerCase();
        const matchesSearch = p.name.toLowerCase().includes(query) || 
                              p.description.toLowerCase().includes(query) ||
                              p.category.toLowerCase().includes(query);
        return matchesCat && matchesSearch;
    });

    return (
        <div className="px-4 md:px-0 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100 sticky top-24 z-30">
                <h2 className="text-2xl font-bold text-gray-800">Shop</h2>
                <div className="flex flex-1 w-full md:w-auto gap-4 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                     <button 
                        onClick={() => setSelectedCategory('All')} 
                        className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition ${selectedCategory === 'All' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        All
                    </button>
                    {categories.map(c => (
                        <button 
                            key={c.id} 
                            onClick={() => setSelectedCategory(c.name)} 
                            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition ${selectedCategory === c.name ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            {c.name}
                        </button>
                    ))}
                </div>
            </div>
            
            {searchQuery && (
                <div className="mb-6 text-sm text-gray-500 animate-fade-in">
                    Showing results for "<span className="font-bold text-gray-800">{searchQuery}</span>"
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filtered.length > 0 ? (
                    filtered.map((p, idx) => (
                        <div key={p.id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 50}ms` }}>
                            <ProductCard product={p} />
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-20 text-gray-400 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200">
                        <p className="text-lg">No products found matching your criteria.</p>
                        <button onClick={() => setSelectedCategory('All')} className="mt-4 text-blue-600 hover:underline">Clear Filters</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export const Checkout = () => {
    const { cart, updateCartQuantity, removeFromCart, placeOrder, navigate, user, settings, attachPrescription, formatPrice, nearestStore, userLocation } = useApp();
    const [step, setStep] = useState<'CART' | 'DETAILS' | 'SUCCESS'>('CART');
    const [loading, setLoading] = useState(false);
    
    // Controlled Form Inputs
    const [address, setAddress] = useState(user?.savedAddresses[0] || '');
    const [firstName, setFirstName] = useState(user?.name.split(' ')[0] || '');
    const [lastName, setLastName] = useState(user?.name.split(' ')[1] || '');
    const [city, setCity] = useState('');
    const [zip, setZip] = useState('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(settings.paymentMethods.find(pm => pm.enabled)?.id || '');
    
    // Payment Details
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');

    // Validation
    const [errors, setErrors] = useState<{[key:string]: string}>({});

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const taxRate = settings.taxRate || 0;
    const taxAmount = subtotal * taxRate;
    const total = subtotal + taxAmount;

    // Identify items needing Rx without proof
    const pendingRxItems = useMemo(() => {
        return cart.filter(item => item.requiresPrescription && !item.prescriptionProof);
    }, [cart]);

    // Ensure at least one payment method is selected if available
    React.useEffect(() => {
        if (!selectedPaymentMethod) {
            const firstEnabled = settings.paymentMethods.find(pm => pm.enabled);
            if (firstEnabled) setSelectedPaymentMethod(firstEnabled.id);
        }
    }, [settings.paymentMethods, selectedPaymentMethod]);

    const validateForm = () => {
        const newErrors: any = {};
        if (!firstName.trim()) newErrors.firstName = "First name is required";
        if (!lastName.trim()) newErrors.lastName = "Last name is required";
        if (!address.trim()) newErrors.address = "Address is required";
        if (!city.trim()) newErrors.city = "City is required";
        if (!zip.trim()) newErrors.zip = "ZIP code is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handlePayment = () => {
        if (!validateForm()) return;
        
        setLoading(true);
        setTimeout(() => {
            placeOrder(address || "123 Guest St.", selectedPaymentMethod);
            setLoading(false);
            setStep('SUCCESS');
        }, 2000);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, productId: string) => {
        const file = e.target.files?.[0];
        if (file) {
            // Simulate upload by using the filename
            attachPrescription(productId, file.name);
        }
    };

    const distanceInfo = useMemo(() => {
        if (userLocation && nearestStore) {
            const dist = calculateDistance(userLocation.lat, userLocation.lng, nearestStore.lat, nearestStore.lng);
            if (dist < 1) return { text: `${(dist * 1000).toFixed(0)} meters`, raw: dist };
            return { text: `${dist.toFixed(2)} km`, raw: dist };
        }
        return null;
    }, [userLocation, nearestStore]);

    const availablePaymentMethods = settings.paymentMethods.filter(pm => pm.enabled);

    if (step === 'SUCCESS') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-scale-in">
                <div className="bg-green-100 p-6 rounded-full mb-6 animate-bounce">
                    <CheckCircle className="w-16 h-16 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Order Confirmed!</h2>
                <p className="text-gray-600 mb-8 max-w-md">Thank you for your purchase. We have received your order and will begin processing it immediately from your nearest store.</p>
                <button onClick={() => navigate('HOME')} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition transform hover:scale-105">
                    Return Home
                </button>
            </div>
        );
    }

    if (cart.length === 0 && step === 'CART') {
         return (
            <div className="text-center py-20 animate-fade-in">
                <ShoppingCart className="w-20 h-20 text-gray-200 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
                <button onClick={() => navigate('SHOP')} className="text-blue-600 hover:text-blue-800 font-medium underline mt-2">Start Shopping</button>
            </div>
         );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 md:px-0 animate-fade-in-up">
            <button onClick={() => navigate('SHOP')} className="flex items-center text-gray-500 hover:text-blue-600 mb-6 transition group">
                <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" /> Back to Shop
            </button>
            <h2 className="text-3xl font-bold mb-8 text-gray-800">{step === 'CART' ? 'Shopping Cart' : 'Checkout Details'}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    {step === 'CART' ? (
                        <>
                            {pendingRxItems.length > 0 && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 animate-fade-in">
                                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="font-bold text-red-800">Prescription Required</h3>
                                        <p className="text-sm text-red-700 mt-1">Some items in your cart require a valid prescription. Please upload the necessary documents below to proceed.</p>
                                    </div>
                                </div>
                            )}

                            {cart.map((item, idx) => (
                                <div key={item.id} className="flex flex-col gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100 animate-fade-in-up" style={{ animationDelay: `${idx * 50}ms` }}>
                                    <div className="flex gap-4">
                                        <img src={item.images[0]} alt={item.name} className="w-24 h-24 rounded-lg object-cover bg-gray-50" />
                                        <div className="flex-grow flex flex-col justify-between">
                                            <div>
                                                <h3 className="font-bold text-gray-800">{item.name}</h3>
                                                <p className="text-sm text-gray-500">{item.category}</p>
                                            </div>
                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                                                    <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="p-1 hover:bg-white rounded shadow-sm"><Minus className="w-4 h-4 text-gray-600"/></button>
                                                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                                    <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="p-1 hover:bg-white rounded shadow-sm"><Plus className="w-4 h-4 text-gray-600"/></button>
                                                </div>
                                                <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded transition"><Trash2 className="w-5 h-5" /></button>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-lg">{formatPrice(item.price * item.quantity)}</p>
                                        </div>
                                    </div>

                                    {/* Prescription Upload Logic */}
                                    {item.requiresPrescription && (
                                        <div className="border-t border-gray-100 pt-3 mt-1">
                                            {item.prescriptionProof ? (
                                                <div className="flex items-center justify-between bg-blue-50 border border-blue-100 p-3 rounded-lg">
                                                    <div className="flex items-center gap-2 text-blue-700">
                                                        <FileText className="w-4 h-4" />
                                                        <span className="text-sm font-medium truncate max-w-[200px]">{item.prescriptionProof}</span>
                                                        <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full">Uploaded</span>
                                                    </div>
                                                    <button 
                                                        onClick={() => attachPrescription(item.id, '')} 
                                                        className="text-gray-400 hover:text-red-500 p-1"
                                                        title="Remove Prescription"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-3">
                                                    <label className="flex-1 cursor-pointer group">
                                                        <div className="flex items-center gap-3 w-full p-3 border-2 border-dashed border-red-200 rounded-lg hover:border-red-400 hover:bg-red-50 transition">
                                                            <div className="bg-red-100 p-2 rounded-full group-hover:bg-red-200 text-red-600">
                                                                <Upload className="w-4 h-4" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="text-sm font-bold text-gray-700">Upload Prescription</p>
                                                                <p className="text-xs text-red-500">Required for this item</p>
                                                            </div>
                                                        </div>
                                                        <input 
                                                            type="file" 
                                                            className="hidden" 
                                                            accept=".jpg,.png,.pdf"
                                                            onChange={(e) => handleFileUpload(e, item.id)}
                                                        />
                                                    </label>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </>
                    ) : (
                        <div className="space-y-6 animate-fade-in">
                            {/* Store Location Info */}
                            {nearestStore && (
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-4">
                                    <div className="bg-blue-100 p-2 rounded-full text-blue-600 mt-1">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-blue-900">Delivery from Nearest Store</h3>
                                        <p className="text-sm text-blue-800 font-semibold mt-1">{nearestStore.name}</p>
                                        <p className="text-xs text-blue-600 mt-0.5">{nearestStore.address}</p>
                                        {distanceInfo && (
                                            <div className="mt-2 flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-200/50 px-2 py-1 rounded w-fit">
                                                <Navigation className="w-3 h-3" />
                                                <span>Distance: {distanceInfo.text}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Shipping Info */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                                <h3 className="font-bold text-lg mb-4">Shipping Information</h3>
                                {!user && (
                                    <div className="bg-blue-50 p-3 rounded-lg text-blue-800 text-sm mb-4">
                                        <span className="font-bold cursor-pointer hover:underline" onClick={() => navigate('LOGIN')}>Log in</span> to use saved addresses.
                                    </div>
                                )}
                                
                                {user && user.savedAddresses.length > 0 && (
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Saved Addresses</label>
                                        <select 
                                            className="w-full p-2 border rounded" 
                                            onChange={(e) => setAddress(e.target.value)}
                                            value={address}
                                        >
                                            <option value="">Select an address...</option>
                                            {user.savedAddresses.map(a => <option key={a} value={a}>{a}</option>)}
                                        </select>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <input 
                                            type="text" 
                                            placeholder="First Name *" 
                                            className={`border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none ${errors.firstName ? 'border-red-500' : ''}`}
                                            value={firstName}
                                            onChange={e => setFirstName(e.target.value)}
                                        />
                                        {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
                                    </div>
                                    <div>
                                        <input 
                                            type="text" 
                                            placeholder="Last Name *" 
                                            className={`border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none ${errors.lastName ? 'border-red-500' : ''}`} 
                                            value={lastName}
                                            onChange={e => setLastName(e.target.value)}
                                        />
                                        {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
                                    </div>
                                </div>
                                <div>
                                    <input 
                                        type="text" 
                                        placeholder="Address *" 
                                        className={`border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none ${errors.address ? 'border-red-500' : ''}`} 
                                        value={address} 
                                        onChange={e => setAddress(e.target.value)} 
                                    />
                                    {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <input 
                                            type="text" 
                                            placeholder="City *" 
                                            className={`border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none ${errors.city ? 'border-red-500' : ''}`} 
                                            value={city}
                                            onChange={e => setCity(e.target.value)}
                                        />
                                        {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                                    </div>
                                    <div>
                                        <input 
                                            type="text" 
                                            placeholder="ZIP Code *" 
                                            className={`border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none ${errors.zip ? 'border-red-500' : ''}`} 
                                            value={zip}
                                            onChange={e => setZip(e.target.value)}
                                        />
                                        {errors.zip && <p className="text-xs text-red-500 mt-1">{errors.zip}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                                <h3 className="font-bold text-lg mb-4">Payment Method</h3>
                                <div className="grid gap-3">
                                    {availablePaymentMethods.length === 0 && <p className="text-red-500">No payment methods available.</p>}
                                    {availablePaymentMethods.map(pm => (
                                        <label key={pm.id} className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${selectedPaymentMethod === pm.id ? 'border-blue-500 bg-blue-50 shadow-sm' : 'hover:border-gray-300'}`}>
                                            <input 
                                                type="radio" 
                                                name="payment" 
                                                className="sr-only"
                                                value={pm.id}
                                                checked={selectedPaymentMethod === pm.id}
                                                onChange={() => setSelectedPaymentMethod(pm.id)}
                                            />
                                            <div className="flex items-center gap-3 w-full">
                                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${selectedPaymentMethod === pm.id ? 'border-blue-600' : 'border-gray-300'}`}>
                                                    {selectedPaymentMethod === pm.id && <div className="w-3 h-3 rounded-full bg-blue-600"></div>}
                                                </div>
                                                {pm.type === 'card' && <CreditCard className="w-5 h-5 text-gray-600" />}
                                                {pm.type === 'cod' && <Banknote className="w-5 h-5 text-gray-600" />}
                                                {pm.type === 'wallet' && <CreditCard className="w-5 h-5 text-gray-600" />}
                                                <span className="font-medium text-gray-800">{pm.name}</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>

                                {/* Card Details Form (Simulated) */}
                                {availablePaymentMethods.find(pm => pm.id === selectedPaymentMethod)?.type === 'card' && (
                                    <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3 animate-fade-in-up">
                                        <h4 className="font-semibold text-gray-700">Card Details</h4>
                                        <input 
                                            type="text" 
                                            placeholder="Card Number" 
                                            className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={cardNumber}
                                            onChange={e => setCardNumber(e.target.value)}
                                        />
                                        <div className="grid grid-cols-2 gap-3">
                                            <input 
                                                type="text" 
                                                placeholder="MM/YY" 
                                                className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                                                value={expiry}
                                                onChange={e => setExpiry(e.target.value)}
                                            />
                                            <input 
                                                type="text" 
                                                placeholder="CVC" 
                                                className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                                                value={cvc}
                                                onChange={e => setCvc(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                )}
                                
                                {availablePaymentMethods.find(pm => pm.id === selectedPaymentMethod)?.type === 'cod' && (
                                     <div className="mt-4 flex items-center gap-2 text-sm text-blue-700 bg-blue-50 p-3 rounded border border-blue-100 animate-fade-in">
                                        <CheckCircle className="w-4 h-4" />
                                        You will pay in cash upon delivery.
                                     </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24 transition-all">
                        <h3 className="font-bold text-lg mb-4">Order Summary</h3>
                        <div className="space-y-2 mb-6">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>{formatPrice(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Tax ({(taxRate * 100).toFixed(0)}%)</span>
                                <span>{formatPrice(taxAmount)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>
                            <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg text-gray-900">
                                <span>Total</span>
                                <span>{formatPrice(total)}</span>
                            </div>
                        </div>
                        
                        {step === 'CART' ? (
                            !user ? (
                                <button 
                                    onClick={() => navigate('LOGIN')}
                                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition transform hover:scale-105 flex items-center justify-center gap-2"
                                >
                                    <LogIn className="w-5 h-5" /> Login to Checkout
                                </button>
                            ) : (
                                <button 
                                    onClick={() => setStep('DETAILS')} 
                                    disabled={pendingRxItems.length > 0}
                                    className={`w-full py-3 rounded-lg font-bold transition transform active:scale-95 ${
                                        pendingRxItems.length > 0 
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105'
                                    }`}
                                >
                                    {pendingRxItems.length > 0 ? 'Upload Prescriptions to Proceed' : 'Proceed to Checkout'}
                                </button>
                            )
                        ) : (
                            <>
                                <button 
                                    onClick={handlePayment} 
                                    disabled={loading || !selectedPaymentMethod} 
                                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:bg-gray-400 flex justify-center items-center"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : `Pay ${formatPrice(total)}`}
                                </button>
                                <button onClick={() => setStep('CART')} className="w-full text-gray-500 mt-2 py-2 text-sm hover:text-gray-700">
                                    Back to Cart
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const PageView = () => {
    const { selectedPage, navigate } = useApp();

    if (!selectedPage) {
        navigate('HOME');
        return null;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 md:px-0 py-8 animate-fade-in-up">
             <button onClick={() => navigate('HOME')} className="flex items-center text-gray-500 hover:text-blue-600 mb-6 transition group">
                <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" /> Back to Home
            </button>
            <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedPage.title}</h1>
                <p className="text-sm text-gray-500 mb-8">Last updated: {selectedPage.lastUpdated}</p>
                <div className="prose prose-blue max-w-none text-gray-600 whitespace-pre-wrap leading-relaxed">
                    {selectedPage.content}
                </div>
            </div>
        </div>
    );
};

export const TrackOrder = () => {
    const { allOrders, navigate, formatPrice } = useApp();
    const [searchId, setSearchId] = useState('');
    const [order, setOrder] = useState<Order | null>(null);
    const [searched, setSearched] = useState(false);

    const handleTrack = (e: React.FormEvent) => {
        e.preventDefault();
        const found = allOrders.find(o => o.id.toLowerCase() === searchId.toLowerCase());
        setOrder(found || null);
        setSearched(true);
    };

    const getStatusStep = (status: string) => {
        if (status === 'Processing') return 1;
        if (status === 'Shipped') return 2;
        if (status === 'Delivered') return 3;
        return 0;
    };

    const activeStep = order ? getStatusStep(order.status) : 0;

    return (
        <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in-up">
            <button onClick={() => navigate('HOME')} className="flex items-center text-gray-500 hover:text-blue-600 mb-6 transition group">
                <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" /> Back to Home
            </button>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center mb-8">
                <div className="inline-block p-4 bg-blue-50 rounded-full mb-4">
                    <Package className="w-8 h-8 text-blue-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Order</h1>
                <p className="text-gray-500 mb-8">Enter your order ID to see the current status</p>
                
                <form onSubmit={handleTrack} className="max-w-md mx-auto relative flex items-center">
                    <Search className="absolute left-3 text-gray-400 w-5 h-5" />
                    <input 
                        type="text" 
                        placeholder="e.g. ORD-1234" 
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                        value={searchId}
                        onChange={e => setSearchId(e.target.value)}
                    />
                    <button type="submit" className="absolute right-2 bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700 transition font-medium">
                        Track
                    </button>
                </form>
            </div>

            {searched && !order && (
                <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-center animate-fade-in">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                    <p className="font-bold">Order not found</p>
                    <p className="text-sm">Please check the Order ID and try again.</p>
                </div>
            )}

            {order && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-scale-in">
                    <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center flex-wrap gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Order ID</p>
                            <p className="font-bold text-gray-900 text-lg">{order.id}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Order Date</p>
                            <p className="font-bold text-gray-900">{order.date}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Amount</p>
                            <p className="font-bold text-blue-600 text-lg">{formatPrice(order.total)}</p>
                        </div>
                    </div>

                    <div className="p-8">
                        {/* Timeline */}
                        <div className="relative flex justify-between mb-12 max-w-lg mx-auto">
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 -translate-y-1/2 rounded-full"></div>
                            <div className={`absolute top-1/2 left-0 h-1 bg-green-500 -z-10 -translate-y-1/2 rounded-full transition-all duration-1000 ease-out`} style={{ width: `${(activeStep - 1) * 50}%` }}></div>

                            {[
                                { step: 1, label: 'Processing', icon: FileText },
                                { step: 2, label: 'Shipped', icon: Truck },
                                { step: 3, label: 'Delivered', icon: CheckCircle }
                            ].map((s) => (
                                <div key={s.step} className="flex flex-col items-center gap-2 bg-white px-2">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${activeStep >= s.step ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-200' : 'bg-white border-gray-300 text-gray-300'}`}>
                                        <s.icon className="w-5 h-5" />
                                    </div>
                                    <span className={`text-xs font-bold ${activeStep >= s.step ? 'text-green-600' : 'text-gray-400'}`}>{s.label}</span>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-bold text-gray-800 border-b pb-2">Order Items</h3>
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4 py-2">
                                    <img src={item.images[0]} alt={item.name} className="w-16 h-16 rounded-lg object-cover bg-gray-50" />
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">{item.name}</p>
                                        <p className="text-sm text-gray-500">{item.quantity} x {formatPrice(item.price)}</p>
                                    </div>
                                    <p className="font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
