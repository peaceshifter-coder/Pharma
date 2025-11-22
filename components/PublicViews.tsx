import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { ShoppingCart, Plus, Minus, Trash2, CheckCircle, AlertCircle, ArrowLeft, Star, ShieldCheck, Truck, Clock, CreditCard, Banknote } from 'lucide-react';

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
    const { addToCart, viewProduct } = useApp();
    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition duration-300 overflow-hidden border border-gray-100 flex flex-col h-full group">
            <div 
                className="relative h-48 overflow-hidden bg-gray-100 cursor-pointer"
                onClick={() => viewProduct(product)}
            >
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                {product.requiresPrescription && (
                    <span className="absolute top-2 right-2 bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full border border-red-200">
                        Rx Required
                    </span>
                )}
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <div className="text-xs text-emerald-600 font-semibold mb-1 uppercase tracking-wider">{product.category}</div>
                <h3 
                    className="font-bold text-gray-900 text-lg mb-1 leading-tight cursor-pointer hover:text-emerald-600 transition"
                    onClick={() => viewProduct(product)}
                >
                    {product.name}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow">{product.description}</p>
                <div className="flex items-center justify-between mt-auto">
                    <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                    <button 
                        onClick={() => addToCart(product)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-full shadow-sm transition-colors"
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
    const { selectedProduct, addToCart, navigate } = useApp();
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState<'DESC' | 'INFO'>('DESC');

    if (!selectedProduct) {
        navigate('SHOP');
        return null;
    }

    const handleBuyNow = () => {
        addToCart(selectedProduct, quantity);
        navigate('CHECKOUT');
    };

    return (
        <div className="max-w-6xl mx-auto px-4 md:px-0">
            <button onClick={() => navigate('SHOP')} className="flex items-center text-gray-500 hover:text-emerald-600 mb-6 transition">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Shop
            </button>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Image Section */}
                    <div className="bg-gray-50 p-8 flex items-center justify-center relative">
                         <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="max-h-[500px] w-full object-contain rounded-lg shadow-sm mix-blend-multiply" />
                         {selectedProduct.requiresPrescription && (
                            <div className="absolute top-4 left-4 bg-red-100 text-red-600 text-xs font-bold px-3 py-1.5 rounded-full border border-red-200 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> Prescription Required
                            </div>
                        )}
                    </div>

                    {/* Info Section */}
                    <div className="p-8 md:p-12 flex flex-col">
                        <div className="mb-6">
                            <span className="text-emerald-600 font-semibold text-sm tracking-wide uppercase">{selectedProduct.category}</span>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">{selectedProduct.name}</h1>
                            
                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex items-center text-yellow-400">
                                    <Star className="w-5 h-5 fill-current" />
                                    <Star className="w-5 h-5 fill-current" />
                                    <Star className="w-5 h-5 fill-current" />
                                    <Star className="w-5 h-5 fill-current" />
                                    <Star className="w-5 h-5 text-gray-300" />
                                    <span className="text-gray-500 text-sm ml-2 font-medium">(124 reviews)</span>
                                </div>
                                <span className="w-px h-5 bg-gray-300"></span>
                                <span className={`text-sm font-medium ${selectedProduct.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                    {selectedProduct.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                </span>
                            </div>

                            <div className="text-3xl font-bold text-gray-900 mb-6">${selectedProduct.price.toFixed(2)}</div>

                            <div className="prose text-gray-600 mb-8 leading-relaxed">
                                {selectedProduct.description}
                            </div>

                            {/* Actions */}
                            <div className="space-y-4 pt-6 border-t border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center border border-gray-300 rounded-lg">
                                        <button 
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="px-4 py-3 text-gray-600 hover:bg-gray-50 transition border-r"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="w-12 text-center font-medium">{quantity}</span>
                                        <button 
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="px-4 py-3 text-gray-600 hover:bg-gray-50 transition border-l"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <button 
                                        onClick={() => addToCart(selectedProduct, quantity)}
                                        className="flex-1 bg-gray-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition shadow-lg shadow-gray-200 flex items-center justify-center gap-2"
                                    >
                                        <ShoppingCart className="w-5 h-5" /> Add to Cart
                                    </button>
                                </div>
                                <button 
                                    onClick={handleBuyNow}
                                    className="w-full bg-emerald-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-100"
                                >
                                    Buy Now
                                </button>
                            </div>
                        </div>

                        {/* Additional Features */}
                        <div className="grid grid-cols-2 gap-4 mt-auto pt-8">
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <div className="p-2 bg-emerald-50 rounded-full text-emerald-600"><Truck className="w-4 h-4" /></div>
                                <span>Fast Delivery</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <div className="p-2 bg-emerald-50 rounded-full text-emerald-600"><ShieldCheck className="w-4 h-4" /></div>
                                <span>Secure Payment</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <div className="p-2 bg-emerald-50 rounded-full text-emerald-600"><CheckCircle className="w-4 h-4" /></div>
                                <span>Authentic Products</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <div className="p-2 bg-emerald-50 rounded-full text-emerald-600"><Clock className="w-4 h-4" /></div>
                                <span>24/7 Support</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Tabs Section */}
                <div className="border-t border-gray-100">
                    <div className="flex border-b border-gray-100">
                        <button 
                            onClick={() => setActiveTab('DESC')}
                            className={`px-8 py-4 font-bold text-sm tracking-wide transition ${activeTab === 'DESC' ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/50' : 'text-gray-500 hover:text-gray-800'}`}
                        >
                            Description
                        </button>
                        <button 
                            onClick={() => setActiveTab('INFO')}
                            className={`px-8 py-4 font-bold text-sm tracking-wide transition ${activeTab === 'INFO' ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/50' : 'text-gray-500 hover:text-gray-800'}`}
                        >
                            Additional Info
                        </button>
                    </div>
                    <div className="p-8 md:p-12 bg-gray-50/30">
                        {activeTab === 'DESC' && (
                            <div className="max-w-3xl text-gray-600 leading-relaxed space-y-4">
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
                            <div className="max-w-3xl">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                                    <div className="flex justify-between border-b border-gray-200 py-3">
                                        <span className="font-medium text-gray-900">Brand</span>
                                        <span className="text-gray-600">PharmaCare Essentials</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-200 py-3">
                                        <span className="font-medium text-gray-900">SKU</span>
                                        <span className="text-gray-600">{selectedProduct.id}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-200 py-3">
                                        <span className="font-medium text-gray-900">Form</span>
                                        <span className="text-gray-600">Standard Pack</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-200 py-3">
                                        <span className="font-medium text-gray-900">Storage</span>
                                        <span className="text-gray-600">Cool & Dry Place</span>
                                    </div>
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
    const { products, navigate, setSelectedCategory } = useApp();
    const featuredProducts = useMemo(() => products.slice(0, 4), [products]);

    const categoryHighlights = [
        { name: 'Vitamins', category: 'Vitamins & Supplements', image: 'https://images.unsplash.com/photo-1565071783280-719b01b29912' },
        { name: 'First Aid', category: 'First Aid', image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&q=80&w=200' },
        { name: 'Skincare', category: 'Skin Care', image: 'https://images.unsplash.com/photo-1585945037805-5fd82c2e60b1' },
        { name: 'Pain Relief', category: 'Pain Relief', image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=200' }
    ];

    const handleCategoryClick = (categoryName: string) => {
        setSelectedCategory(categoryName);
        navigate('SHOP');
    };

    return (
        <div className="space-y-12 pb-12">
            {/* Hero Section */}
            <div className="relative bg-emerald-900 rounded-3xl overflow-hidden text-white shadow-2xl mx-4 md:mx-0">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=2000')] bg-cover bg-center opacity-25"></div>
                <div className="relative z-10 p-12 md:p-20 text-center md:text-left">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Your Health, <br/><span className="text-emerald-300">Our Priority</span></h1>
                    <p className="text-lg md:text-xl text-emerald-100 mb-8 max-w-xl">Get your medications delivered to your doorstep with the nearest pharmacy locator and trusted professionals.</p>
                    <button onClick={() => { setSelectedCategory('All'); navigate('SHOP'); }} className="bg-white text-emerald-900 px-8 py-3 rounded-full font-bold hover:bg-emerald-50 transition transform hover:scale-105 shadow-lg">
                        Shop Now
                    </button>
                </div>
            </div>

            {/* Featured Categories */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 md:px-0">
                {categoryHighlights.map((cat) => (
                    <div key={cat.name} onClick={() => handleCategoryClick(cat.category)} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center cursor-pointer hover:border-emerald-300 transition group">
                        <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden border-2 border-gray-100 group-hover:border-emerald-200 transition">
                            <img src={cat.image} className="w-full h-full object-cover" alt={cat.name} />
                        </div>
                        <h3 className="font-semibold text-gray-800">{cat.name}</h3>
                    </div>
                ))}
            </div>

            {/* Featured Products */}
            <div className="px-4 md:px-0">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center md:text-left">Featured Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {featuredProducts.map(p => <ProductCard key={p.id} product={p} />)}
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
        <div className="px-4 md:px-0">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800">Shop</h2>
                <div className="flex flex-1 w-full md:w-auto gap-4 overflow-x-auto pb-2 md:pb-0">
                     <button 
                        onClick={() => setSelectedCategory('All')} 
                        className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition ${selectedCategory === 'All' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        All
                    </button>
                    {categories.map(c => (
                        <button 
                            key={c.id} 
                            onClick={() => setSelectedCategory(c.name)} 
                            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition ${selectedCategory === c.name ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            {c.name}
                        </button>
                    ))}
                </div>
            </div>
            
            {searchQuery && (
                <div className="mb-6 text-sm text-gray-500">
                    Showing results for "<span className="font-bold text-gray-800">{searchQuery}</span>"
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filtered.length > 0 ? (
                    filtered.map(p => <ProductCard key={p.id} product={p} />)
                ) : (
                    <div className="col-span-full text-center py-20 text-gray-400">
                        <p>No products found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export const Checkout = () => {
    const { cart, updateCartQuantity, removeFromCart, placeOrder, navigate, user, settings } = useApp();
    const [step, setStep] = useState<'CART' | 'DETAILS' | 'SUCCESS'>('CART');
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState(user?.savedAddresses[0] || '');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(settings.paymentMethods.find(pm => pm.enabled)?.id || '');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Ensure at least one payment method is selected if available
    React.useEffect(() => {
        if (!selectedPaymentMethod) {
            const firstEnabled = settings.paymentMethods.find(pm => pm.enabled);
            if (firstEnabled) setSelectedPaymentMethod(firstEnabled.id);
        }
    }, [settings.paymentMethods, selectedPaymentMethod]);

    const handlePayment = () => {
        setLoading(true);
        setTimeout(() => {
            placeOrder(address || "123 Guest St.", selectedPaymentMethod);
            setLoading(false);
            setStep('SUCCESS');
        }, 2000);
    };

    const availablePaymentMethods = settings.paymentMethods.filter(pm => pm.enabled);

    if (step === 'SUCCESS') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <div className="bg-green-100 p-6 rounded-full mb-6">
                    <CheckCircle className="w-16 h-16 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Order Confirmed!</h2>
                <p className="text-gray-600 mb-8 max-w-md">Thank you for your purchase. We have received your order and will begin processing it immediately from your nearest store.</p>
                <button onClick={() => navigate('HOME')} className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition">
                    Return Home
                </button>
            </div>
        );
    }

    if (cart.length === 0 && step === 'CART') {
         return (
            <div className="text-center py-20">
                <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
                <button onClick={() => navigate('SHOP')} className="text-emerald-600 hover:text-emerald-800 font-medium underline">Start Shopping</button>
            </div>
         );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 md:px-0">
            <h2 className="text-3xl font-bold mb-8 text-gray-800">{step === 'CART' ? 'Shopping Cart' : 'Checkout Details'}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    {step === 'CART' ? (
                        cart.map(item => (
                            <div key={item.id} className="flex gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <img src={item.imageUrl} alt={item.name} className="w-24 h-24 rounded-lg object-cover bg-gray-100" />
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
                                        <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 p-2"><Trash2 className="w-5 h-5" /></button>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="space-y-6">
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
                                    <input type="text" placeholder="First Name" className="border p-3 rounded-lg w-full" defaultValue={user?.name.split(' ')[0]} />
                                    <input type="text" placeholder="Last Name" className="border p-3 rounded-lg w-full" defaultValue={user?.name.split(' ')[1]} />
                                </div>
                                <input type="text" placeholder="Address" className="border p-3 rounded-lg w-full" value={address} onChange={e => setAddress(e.target.value)} />
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" placeholder="City" className="border p-3 rounded-lg w-full" />
                                    <input type="text" placeholder="ZIP Code" className="border p-3 rounded-lg w-full" />
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                                <h3 className="font-bold text-lg mb-4">Payment Method</h3>
                                <div className="grid gap-3">
                                    {availablePaymentMethods.length === 0 && <p className="text-red-500">No payment methods available.</p>}
                                    {availablePaymentMethods.map(pm => (
                                        <label key={pm.id} className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${selectedPaymentMethod === pm.id ? 'border-emerald-500 bg-emerald-50' : 'hover:border-gray-300'}`}>
                                            <input 
                                                type="radio" 
                                                name="payment" 
                                                className="sr-only"
                                                value={pm.id}
                                                checked={selectedPaymentMethod === pm.id}
                                                onChange={() => setSelectedPaymentMethod(pm.id)}
                                            />
                                            <div className="flex items-center gap-3 w-full">
                                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedPaymentMethod === pm.id ? 'border-emerald-600' : 'border-gray-300'}`}>
                                                    {selectedPaymentMethod === pm.id && <div className="w-3 h-3 rounded-full bg-emerald-600"></div>}
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
                                    <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3 animate-in slide-in-from-top-2">
                                        <h4 className="font-semibold text-gray-700">Card Details</h4>
                                        <input 
                                            type="text" 
                                            placeholder="Card Number" 
                                            className="w-full p-3 border rounded-lg bg-white"
                                            value={cardNumber}
                                            onChange={e => setCardNumber(e.target.value)}
                                        />
                                        <div className="grid grid-cols-2 gap-3">
                                            <input 
                                                type="text" 
                                                placeholder="MM/YY" 
                                                className="w-full p-3 border rounded-lg bg-white"
                                                value={expiry}
                                                onChange={e => setExpiry(e.target.value)}
                                            />
                                            <input 
                                                type="text" 
                                                placeholder="CVC" 
                                                className="w-full p-3 border rounded-lg bg-white"
                                                value={cvc}
                                                onChange={e => setCvc(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                )}
                                
                                {availablePaymentMethods.find(pm => pm.id === selectedPaymentMethod)?.type === 'cod' && (
                                     <div className="mt-4 flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 p-3 rounded border border-emerald-100">
                                        <CheckCircle className="w-4 h-4" />
                                        You will pay in cash upon delivery.
                                     </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-6">
                        <h3 className="font-bold text-lg mb-4">Order Summary</h3>
                        <div className="space-y-2 mb-6">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Tax (8%)</span>
                                <span>${(total * 0.08).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>
                            <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg text-gray-900">
                                <span>Total</span>
                                <span>${(total * 1.08).toFixed(2)}</span>
                            </div>
                        </div>
                        
                        {step === 'CART' ? (
                            <button onClick={() => setStep('DETAILS')} className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 transition">
                                Proceed to Checkout
                            </button>
                        ) : (
                            <>
                                <button 
                                    onClick={handlePayment} 
                                    disabled={loading || !selectedPaymentMethod} 
                                    className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 transition disabled:bg-gray-400 flex justify-center items-center"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : `Pay $${(total * 1.08).toFixed(2)}`}
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