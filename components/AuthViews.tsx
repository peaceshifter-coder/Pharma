
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Lock, Mail, MapPin, Package, LogOut, User as UserIcon, Plus, Trash2 } from 'lucide-react';

export const Login = () => {
    const { login, navigate } = useApp();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const user = await login(email, password);
        setLoading(false);
        if (user) {
            if (user.role === 'admin') {
                navigate('ADMIN');
            } else {
                navigate('HOME');
            }
        }
    };

    const handleReset = () => {
        if(!email) alert("Please enter your email to reset password.");
        else alert("Password reset link has been sent to " + email);
    }

    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4 animate-fade-in-up">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-100 transform transition-all hover:shadow-xl">
                <div className="text-center mb-8">
                    <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 animate-scale-in">
                        <Lock className="w-6 h-6 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
                    <p className="text-gray-500">Sign in to your account</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                            <input 
                                type="email" 
                                required
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between mb-1">
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <button type="button" onClick={handleReset} className="text-xs text-blue-600 hover:underline">Forgot password?</button>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                            <input 
                                type="password" 
                                required
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition flex justify-center items-center"
                    >
                        {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Sign In'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                    Don't have an account? 
                    <button onClick={() => navigate('REGISTER')} className="text-blue-600 font-semibold hover:underline ml-1">Create Account</button>
                </div>
            </div>
        </div>
    );
};

export const Register = () => {
    const { register, navigate } = useApp();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            register(name, email);
            setLoading(false);
            navigate('HOME');
        }, 800);
    };

    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4 animate-fade-in-up">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <div className="text-center mb-8">
                    <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 animate-scale-in">
                        <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
                    <p className="text-gray-500">Join PharmaCare Plus today</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                            <input 
                                type="text" 
                                required
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                            <input 
                                type="email" 
                                required
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                            <input 
                                type="password" 
                                required
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition flex justify-center items-center">
                         {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Create Account'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                    Already have an account? 
                    <button onClick={() => navigate('LOGIN')} className="text-blue-600 font-semibold hover:underline ml-1">Sign In</button>
                </div>
            </div>
        </div>
    );
};

export const UserProfile = () => {
    const { user, logout, addAddress, deleteAddress, formatPrice } = useApp();
    const [activeTab, setActiveTab] = useState<'ORDERS' | 'ADDRESS'>('ORDERS');
    const [newAddress, setNewAddress] = useState('');

    if (!user) return <div>Please log in.</div>;

    const handleAddAddress = (e: React.FormEvent) => {
        e.preventDefault();
        if (newAddress) {
            addAddress(newAddress);
            setNewAddress('');
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 animate-fade-in-up">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <div className="md:w-1/4">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center sticky top-24">
                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-blue-700 animate-scale-in">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <h2 className="font-bold text-gray-800 text-lg">{user.name}</h2>
                        <p className="text-sm text-gray-500 mb-6">{user.email}</p>
                        
                        <nav className="space-y-2 text-left">
                            <button 
                                onClick={() => setActiveTab('ORDERS')}
                                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${activeTab === 'ORDERS' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <Package className="w-4 h-4" /> Orders
                            </button>
                            <button 
                                onClick={() => setActiveTab('ADDRESS')}
                                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${activeTab === 'ADDRESS' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <MapPin className="w-4 h-4" /> Addresses
                            </button>
                            {user.role === 'admin' && (
                                <button 
                                    onClick={() => window.location.reload()} 
                                    className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition"
                                >
                                    <User className="w-4 h-4" /> Admin View
                                </button>
                            )}
                            <button 
                                onClick={logout}
                                className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition mt-4 border-t border-gray-100 pt-4"
                            >
                                <LogOut className="w-4 h-4" /> Sign Out
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Content */}
                <div className="md:w-3/4">
                    {activeTab === 'ORDERS' && (
                        <div className="space-y-4 animate-fade-in">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Order History</h3>
                            {user.orders.length === 0 ? (
                                <div className="text-center py-10 bg-white rounded-xl border border-gray-100">
                                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                                    <p className="text-gray-500">No orders found</p>
                                </div>
                            ) : (
                                user.orders.map((order, idx) => (
                                    <div key={order.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
                                        <div className="flex justify-between items-start border-b border-gray-100 pb-4 mb-4">
                                            <div>
                                                <p className="font-bold text-gray-800">{order.id}</p>
                                                <p className="text-sm text-gray-500">{order.date}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                                    order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                                                    order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {order.status}
                                                </span>
                                                <p className="font-bold text-blue-600 mt-1">{formatPrice(order.total)}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex justify-between text-sm">
                                                    <span className="text-gray-600">{item.quantity}x {item.name}</span>
                                                    <span className="text-gray-900">{formatPrice(item.price * item.quantity)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'ADDRESS' && (
                        <div className="animate-fade-in">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Saved Addresses</h3>
                            <div className="grid gap-4">
                                {user.savedAddresses.map((addr, idx) => (
                                    <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between shadow-sm animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
                                        <div className="flex items-center gap-3">
                                            <MapPin className="w-5 h-5 text-gray-400" />
                                            <span className="text-gray-700">{addr}</span>
                                        </div>
                                        <button onClick={() => deleteAddress(addr)} className="text-gray-400 hover:text-red-500 transition p-2 rounded hover:bg-red-50">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            
                            <form onSubmit={handleAddAddress} className="mt-6 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Add New Address</label>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        className="flex-1 border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                                        placeholder="123 Main St, City, State"
                                        value={newAddress}
                                        onChange={(e) => setNewAddress(e.target.value)}
                                    />
                                    <button type="submit" className="bg-gray-800 text-white px-4 rounded-lg hover:bg-gray-900 flex items-center gap-2 transition">
                                        <Plus className="w-4 h-4" /> Add
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};