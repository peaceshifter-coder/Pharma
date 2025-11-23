
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product, Store, Category, Order, Page } from '../types';
import { generateProductDescription } from '../services/geminiService';
import { 
  Trash2, Edit, Plus, MapPin, Package, 
  LayoutGrid, Settings, Activity, Sparkles, Save,
  ShoppingBag, ChevronDown, ChevronUp, CreditCard, Wallet, Truck, FileText,
  Image as ImageIcon, Type, Link as LinkIcon, Phone, Mail, Globe, File
} from 'lucide-react';

// --- Generic Table Component ---
const Table: React.FC<{ headers: string[], children: React.ReactNode }> = ({ headers, children }) => (
  <div className="overflow-x-auto bg-white shadow-md rounded-lg border border-gray-200">
    <table className="w-full text-sm text-left text-gray-500">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
        <tr>
          {headers.map(h => <th key={h} className="px-6 py-3">{h}</th>)}
          <th className="px-6 py-3 text-right">Actions</th>
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  </div>
);

// --- Products View ---
export const AdminProducts = () => {
  const { products, categories, deleteProduct, addProduct, updateProduct } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const product = {
        id: formData.id || Date.now().toString(),
        name: formData.name || 'New Product',
        description: formData.description || '',
        price: Number(formData.price) || 0,
        category: formData.category || categories[0]?.name || 'General',
        imageUrl: formData.imageUrl || 'https://picsum.photos/200',
        stock: Number(formData.stock) || 0,
        requiresPrescription: formData.requiresPrescription || false,
    } as Product;

    if (formData.id) updateProduct(product);
    else addProduct(product);
    setIsEditing(false);
    setFormData({});
  };

  const handleGenerateDescription = async () => {
    if (!formData.name || !formData.category) return;
    setIsGenerating(true);
    const desc = await generateProductDescription(formData.name, formData.category);
    setFormData(prev => ({ ...prev, description: desc }));
    setIsGenerating(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto animate-fade-in-up">
        <h3 className="text-xl font-bold mb-4 text-gray-800">{formData.id ? 'Edit Product' : 'Add New Product'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input required className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-blue-500 outline-none" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-blue-500 outline-none" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <div className="flex gap-2 mt-1">
                <textarea className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" rows={3} value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} />
                <button type="button" onClick={handleGenerateDescription} disabled={isGenerating || !formData.name} className="bg-purple-100 text-purple-700 px-3 py-1 rounded hover:bg-purple-200 flex items-center h-fit self-start transition-colors">
                    {isGenerating ? <Activity className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    <span className="ml-1 text-xs font-bold">AI</span>
                </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                <input type="number" step="0.01" required className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-blue-500 outline-none" value={formData.price || ''} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Stock</label>
                <input type="number" required className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-blue-500 outline-none" value={formData.stock || ''} onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})} />
            </div>
          </div>
          
          <div>
             <label className="block text-sm font-medium text-gray-700">Image URL</label>
             <input className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-blue-500 outline-none" value={formData.imageUrl || ''} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
          </div>

          <div className="flex items-center gap-2">
             <input type="checkbox" id="rx" checked={formData.requiresPrescription || false} onChange={e => setFormData({...formData, requiresPrescription: e.target.checked})} className="rounded text-blue-600 focus:ring-blue-500"/>
             <label htmlFor="rx" className="text-sm text-gray-700">Requires Prescription</label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2">
                <Save className="w-4 h-4" /> Save Product
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Product Management</h2>
        <button onClick={() => { setFormData({}); setIsEditing(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition">
            <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>
      <Table headers={['Name', 'Category', 'Price', 'Stock']}>
        {products.map(p => (
          <tr key={p.id} className="bg-white border-b hover:bg-gray-50">
            <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-2">
                <img src={p.imageUrl} alt="" className="w-8 h-8 rounded object-cover" />
                {p.name}
            </td>
            <td className="px-6 py-4">{p.category}</td>
            <td className="px-6 py-4">${p.price.toFixed(2)}</td>
            <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${p.stock > 10 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {p.stock} in stock
                </span>
            </td>
            <td className="px-6 py-4 text-right">
              <div className="flex justify-end gap-2">
                <button onClick={() => { setFormData(p); setIsEditing(true); }} className="text-blue-600 hover:text-blue-900 p-1"><Edit className="w-4 h-4" /></button>
                <button onClick={() => deleteProduct(p.id)} className="text-red-600 hover:text-red-900 p-1"><Trash2 className="w-4 h-4" /></button>
              </div>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
};

// --- Categories View ---
export const AdminCategories = () => {
  const { categories, addCategory, deleteCategory, updateCategory } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Category>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = formData.name || 'New Category';
    const slug = formData.slug || name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    
    const category: Category = {
      id: formData.id || Date.now().toString(),
      name,
      slug,
      imageUrl: formData.imageUrl || 'https://via.placeholder.com/400'
    };

    if (formData.id) updateCategory(category);
    else addCategory(category);
    
    setIsEditing(false);
    setFormData({});
  };

  if (isEditing) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto animate-fade-in-up">
        <h3 className="text-xl font-bold mb-4 text-gray-800">{formData.id ? 'Edit Category' : 'Add Category'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Category Name</label>
            <input 
              required 
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-blue-500 outline-none" 
              value={formData.name || ''} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              placeholder="e.g. Pain Relief"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Slug (Optional)</label>
            <input 
              className="w-full p-2 border border-gray-300 rounded mt-1 text-gray-500 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none" 
              value={formData.slug || ''} 
              onChange={e => setFormData({...formData, slug: e.target.value})} 
              placeholder="Auto-generated if empty"
            />
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-700">Image URL</label>
            <input 
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-blue-500 outline-none" 
              value={formData.imageUrl || ''} 
              onChange={e => setFormData({...formData, imageUrl: e.target.value})} 
              placeholder="https://..."
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2">
               <Save className="w-4 h-4" /> Save
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Categories</h2>
        <button onClick={() => { setFormData({}); setIsEditing(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition">
            <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>
      <Table headers={['Name', 'Slug', 'Image']}>
        {categories.map(c => (
          <tr key={c.id} className="bg-white border-b hover:bg-gray-50">
            <td className="px-6 py-4 font-medium text-gray-900">{c.name}</td>
            <td className="px-6 py-4 text-gray-500 font-mono text-xs">{c.slug}</td>
            <td className="px-6 py-4">
                {c.imageUrl && <img src={c.imageUrl} alt={c.name} className="w-10 h-10 rounded object-cover" />}
            </td>
            <td className="px-6 py-4 text-right">
              <div className="flex justify-end gap-2">
                <button onClick={() => { setFormData(c); setIsEditing(true); }} className="text-blue-600 hover:text-blue-900 p-1"><Edit className="w-4 h-4" /></button>
                <button onClick={() => deleteCategory(c.id)} className="text-red-600 hover:text-red-900 p-1"><Trash2 className="w-4 h-4" /></button>
              </div>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
};

// --- Stores View ---
export const AdminStores = () => {
    const { stores, addStore, updateStore, deleteStore } = useApp();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<Store>>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const store = {
            id: formData.id || Date.now().toString(),
            name: formData.name || 'New Store',
            address: formData.address || '',
            phone: formData.phone || '',
            lat: Number(formData.lat) || 0,
            lng: Number(formData.lng) || 0,
        } as Store;

        if (formData.id) updateStore(store);
        else addStore(store);
        setIsEditing(false);
        setFormData({});
    };

    if (isEditing) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto animate-fade-in-up">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Manage Store</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Store Name</label>
                        <input 
                            required 
                            className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-blue-500 outline-none" 
                            value={formData.name || ''} 
                            onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <input 
                            required 
                            className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-blue-500 outline-none" 
                            value={formData.address || ''} 
                            onChange={e => setFormData({...formData, address: e.target.value})}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Latitude</label>
                            <input 
                                type="number" 
                                step="any" 
                                required 
                                className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-blue-500 outline-none" 
                                value={formData.lat || ''} 
                                onChange={e => setFormData({...formData, lat: parseFloat(e.target.value)})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Longitude</label>
                            <input 
                                type="number" 
                                step="any" 
                                required 
                                className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-blue-500 outline-none" 
                                value={formData.lng || ''} 
                                onChange={e => setFormData({...formData, lng: parseFloat(e.target.value)})}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <input 
                            required 
                            className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-blue-500 outline-none" 
                            value={formData.phone || ''} 
                            onChange={e => setFormData({...formData, phone: e.target.value})}
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2">
                             <Save className="w-4 h-4" /> Save Store
                        </button>
                    </div>
                </form>
            </div>
        )
    }

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Store Locations</h2>
                <button onClick={() => { setFormData({}); setIsEditing(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
                    <Plus className="w-4 h-4" /> Add Store
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stores.map(store => (
                    <div key={store.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex justify-between items-start hover:shadow-md transition">
                        <div>
                            <h3 className="font-bold text-gray-800 flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-600"/> {store.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{store.address}</p>
                            <p className="text-xs text-gray-500 mt-1">{store.phone}</p>
                            <p className="text-xs text-gray-400 mt-2 font-mono bg-gray-50 inline-block px-2 py-1 rounded">Lat: {store.lat}, Lng: {store.lng}</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => { setFormData(store); setIsEditing(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit className="w-4 h-4"/></button>
                            <button onClick={() => deleteStore(store.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4"/></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

// --- Pages View ---
export const AdminPages = () => {
    const { pages, addPage, updatePage, deletePage } = useApp();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<Page>>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const page: Page = {
            id: formData.id || Date.now().toString(),
            title: formData.title || 'New Page',
            slug: formData.slug || (formData.title || '').toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
            content: formData.content || '',
            lastUpdated: new Date().toLocaleDateString()
        };

        if (formData.id) updatePage(page);
        else addPage(page);
        
        setIsEditing(false);
        setFormData({});
    };

    if (isEditing) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto animate-fade-in-up">
                <h3 className="text-xl font-bold mb-4 text-gray-800">{formData.id ? 'Edit Page' : 'Add New Page'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Page Title</label>
                            <input 
                                required 
                                className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-blue-500 outline-none" 
                                value={formData.title || ''} 
                                onChange={e => setFormData({...formData, title: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Slug (URL)</label>
                            <input 
                                className="w-full p-2 border border-gray-300 rounded mt-1 bg-gray-50 text-gray-500 focus:ring-2 focus:ring-blue-500 outline-none" 
                                value={formData.slug || ''} 
                                onChange={e => setFormData({...formData, slug: e.target.value})}
                                placeholder="Auto-generated if empty"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Content (Markdown supported)</label>
                        <textarea 
                            required 
                            rows={15}
                            className="w-full p-4 border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm" 
                            value={formData.content || ''} 
                            onChange={e => setFormData({...formData, content: e.target.value})}
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2">
                             <Save className="w-4 h-4" /> Save Page
                        </button>
                    </div>
                </form>
            </div>
        )
    }

    return (
        <div className="animate-fade-in">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Pages Management</h2>
                <button onClick={() => { setFormData({}); setIsEditing(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
                    <Plus className="w-4 h-4" /> Add Page
                </button>
            </div>
            <Table headers={['Title', 'Slug', 'Last Updated']}>
                {pages.map(page => (
                    <tr key={page.id} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-blue-500" />
                            {page.title}
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-gray-500">{page.slug}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{page.lastUpdated}</td>
                        <td className="px-6 py-4 text-right">
                             <div className="flex justify-end gap-2">
                                <button onClick={() => { setFormData(page); setIsEditing(true); }} className="text-blue-600 hover:text-blue-900 p-1"><Edit className="w-4 h-4" /></button>
                                <button onClick={() => deletePage(page.id)} className="text-red-600 hover:text-red-900 p-1"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </td>
                    </tr>
                ))}
            </Table>
        </div>
    );
};

// --- Orders View ---
export const AdminOrders = () => {
    const { allOrders, updateOrderStatus } = useApp();
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedOrder(expandedOrder === id ? null : id);
    };

    return (
        <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Management</h2>
            <Table headers={['Order ID', 'Customer', 'Date', 'Total', 'Status']}>
                {allOrders.map(order => (
                    <React.Fragment key={order.id}>
                        <tr className="bg-white border-b hover:bg-gray-50 cursor-pointer" onClick={() => toggleExpand(order.id)}>
                            <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-2">
                                {expandedOrder === order.id ? <ChevronUp className="w-4 h-4 text-gray-400"/> : <ChevronDown className="w-4 h-4 text-gray-400"/>}
                                {order.id}
                            </td>
                            <td className="px-6 py-4">{order.customerName}</td>
                            <td className="px-6 py-4">{order.date}</td>
                            <td className="px-6 py-4 font-bold">${order.total.toFixed(2)}</td>
                            <td className="px-6 py-4">
                                <select 
                                    onClick={(e) => e.stopPropagation()}
                                    value={order.status}
                                    onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                                    className={`text-xs font-semibold px-2 py-1 rounded-full border-none outline-none cursor-pointer ${
                                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}
                                >
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                </select>
                            </td>
                            <td className="px-6 py-4 text-right text-xs text-gray-400">
                                Click to view details
                            </td>
                        </tr>
                        {expandedOrder === order.id && (
                            <tr className="bg-gray-50">
                                <td colSpan={6} className="px-6 py-4">
                                    <div className="border rounded-lg bg-white p-4">
                                        <h4 className="font-bold text-gray-700 mb-2">Order Details</h4>
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <p className="text-sm text-gray-600"><strong>Shipping Address:</strong> {order.shippingAddress}</p>
                                            <p className="text-sm text-gray-600"><strong>Payment Method:</strong> {order.paymentMethod || 'Not Specified'}</p>
                                        </div>
                                        <div className="space-y-2">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex justify-between text-sm border-b border-gray-100 pb-1 last:border-0">
                                                    <span className="flex items-center gap-2">
                                                        <img src={item.imageUrl} className="w-8 h-8 rounded object-cover" alt="" />
                                                        {item.name} <span className="text-gray-400">x{item.quantity}</span>
                                                        {item.requiresPrescription && <span className="text-xs text-red-500 font-bold bg-red-50 px-1 rounded">Rx</span>}
                                                        {item.prescriptionProof && (
                                                            <div className="flex items-center text-blue-600 text-xs gap-1 bg-blue-50 px-2 py-0.5 rounded cursor-pointer" title="View Prescription">
                                                                <FileText className="w-3 h-3" />
                                                                <span className="truncate max-w-[100px]">{item.prescriptionProof}</span>
                                                            </div>
                                                        )}
                                                    </span>
                                                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                ))}
            </Table>
        </div>
    );
};

// --- Dashboard & Settings ---
export const AdminDashboard = () => {
    const { products, stores, allOrders } = useApp();
    const totalStock = products.reduce((acc, p) => acc + p.stock, 0);
    const lowStock = products.filter(p => p.stock < 10).length;
    const recentOrders = allOrders.length;
    const revenue = allOrders.reduce((acc, o) => acc + o.total, 0);

    const StatCard = ({ title, value, icon: Icon, color }: any) => (
        <div className="bg-white p-6 rounded-lg shadow border border-gray-100 flex items-center gap-4 hover-lift animate-fade-in-up">
            <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
                <Icon className={`w-6 h-6 ${color.replace('bg', 'text')}`} />
            </div>
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
            </div>
        </div>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard title="Total Revenue" value={`$${revenue.toFixed(0)}`} icon={ShoppingBag} color="bg-blue-500 text-blue-500" />
            <StatCard title="Total Orders" value={recentOrders} icon={Package} color="bg-purple-500 text-purple-500" />
            <StatCard title="Low Stock Alert" value={lowStock} icon={Activity} color="bg-red-500 text-red-500" />
            <StatCard title="Active Stores" value={stores.length} icon={MapPin} color="bg-blue-500 text-blue-500" />
        </div>
    );
};

export const AdminSettings = () => {
    const { settings, updateSettings, togglePaymentMethod } = useApp();
    const [localSettings, setLocalSettings] = useState(settings);
    const [activeTab, setActiveTab] = useState<'GENERAL' | 'HERO' | 'CONTACT' | 'PAYMENT'>('GENERAL');

    const handleSave = () => {
        updateSettings(localSettings);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Site Configuration</h2>
                <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-lg">
                    <Save className="w-4 h-4" /> Save Changes
                </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-2 border-b border-gray-200">
                {[
                    { id: 'GENERAL', label: 'General', icon: Settings },
                    { id: 'HERO', label: 'Home Page', icon: LayoutGrid },
                    { id: 'CONTACT', label: 'Contact & Footer', icon: Globe },
                    { id: 'PAYMENT', label: 'Payments', icon: CreditCard },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-all border-b-2 ${
                            activeTab === tab.id 
                                ? 'border-blue-600 text-blue-700 bg-blue-50' 
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* General Settings */}
            {activeTab === 'GENERAL' && (
                <div className="bg-white p-6 rounded-b-lg rounded-r-lg shadow-sm border border-t-0 border-gray-200 animate-fade-in">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><Settings className="w-5 h-5 text-gray-400"/> General Information</h3>
                    <div className="space-y-4 max-w-lg">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Site Name</label>
                            <input 
                                className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-blue-500 outline-none" 
                                value={localSettings.siteName} 
                                onChange={e => setLocalSettings({...localSettings, siteName: e.target.value})} 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Logo URL</label>
                            <div className="flex gap-4 items-center">
                                <input 
                                    className="flex-1 p-2 border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-blue-500 outline-none" 
                                    value={localSettings.logoUrl} 
                                    onChange={e => setLocalSettings({...localSettings, logoUrl: e.target.value})} 
                                />
                                <div className="p-2 border rounded bg-gray-50 mt-1">
                                    <img src={localSettings.logoUrl} alt="Preview" className="w-8 h-8 object-contain" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Hero Section Settings */}
            {activeTab === 'HERO' && (
                <div className="bg-white p-6 rounded-b-lg rounded-r-lg shadow-sm border border-t-0 border-gray-200 animate-fade-in">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><LayoutGrid className="w-5 h-5 text-gray-400"/> Home Page Hero Section</h3>
                    <div className="space-y-4 max-w-2xl">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Hero Title</label>
                            <div className="flex items-center gap-2">
                                <Type className="w-4 h-4 text-gray-400" />
                                <input 
                                    className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-blue-500 outline-none" 
                                    value={localSettings.hero?.title || ''} 
                                    onChange={e => setLocalSettings({...localSettings, hero: {...localSettings.hero, title: e.target.value}})} 
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Hero Subtitle</label>
                            <textarea 
                                className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-blue-500 outline-none" 
                                rows={3}
                                value={localSettings.hero?.subtitle || ''} 
                                onChange={e => setLocalSettings({...localSettings, hero: {...localSettings.hero, subtitle: e.target.value}})} 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Background Image URL</label>
                            <div className="flex items-center gap-2">
                                <ImageIcon className="w-4 h-4 text-gray-400" />
                                <input 
                                    className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-blue-500 outline-none" 
                                    value={localSettings.hero?.imageUrl || ''} 
                                    onChange={e => setLocalSettings({...localSettings, hero: {...localSettings.hero, imageUrl: e.target.value}})} 
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Call to Action Button Text</label>
                            <div className="flex items-center gap-2">
                                <LinkIcon className="w-4 h-4 text-gray-400" />
                                <input 
                                    className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-blue-500 outline-none" 
                                    value={localSettings.hero?.ctaText || ''} 
                                    onChange={e => setLocalSettings({...localSettings, hero: {...localSettings.hero, ctaText: e.target.value}})} 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Contact & Footer Settings */}
            {activeTab === 'CONTACT' && (
                <div className="bg-white p-6 rounded-b-lg rounded-r-lg shadow-sm border border-t-0 border-gray-200 animate-fade-in">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><Globe className="w-5 h-5 text-gray-400"/> Contact Information & Footer</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Support Email</label>
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    <input 
                                        className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-blue-500 outline-none" 
                                        value={localSettings.contact?.email || ''} 
                                        onChange={e => setLocalSettings({...localSettings, contact: {...localSettings.contact, email: e.target.value}})} 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Support Phone</label>
                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    <input 
                                        className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-blue-500 outline-none" 
                                        value={localSettings.contact?.phone || ''} 
                                        onChange={e => setLocalSettings({...localSettings, contact: {...localSettings.contact, phone: e.target.value}})} 
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Physical Address</label>
                                <div className="flex items-start gap-2">
                                    <MapPin className="w-4 h-4 text-gray-400 mt-3" />
                                    <textarea 
                                        className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-blue-500 outline-none" 
                                        rows={2}
                                        value={localSettings.contact?.address || ''} 
                                        onChange={e => setLocalSettings({...localSettings, contact: {...localSettings.contact, address: e.target.value}})} 
                                    />
                                </div>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Footer About Text</label>
                                <textarea 
                                    className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-blue-500 outline-none" 
                                    rows={3}
                                    value={localSettings.footerAboutText || ''} 
                                    onChange={e => setLocalSettings({...localSettings, footerAboutText: e.target.value})} 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Methods */}
            {activeTab === 'PAYMENT' && (
                <div className="bg-white p-6 rounded-b-lg rounded-r-lg shadow-sm border border-t-0 border-gray-200 animate-fade-in">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><CreditCard className="w-5 h-5 text-gray-400"/> Payment Methods</h3>
                    <div className="space-y-4">
                        {settings.paymentMethods.map(pm => (
                            <div key={pm.id} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-full ${pm.enabled ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-500'}`}>
                                        {pm.type === 'card' && <CreditCard className="w-6 h-6" />}
                                        {pm.type === 'cod' && <Truck className="w-6 h-6" />}
                                        {pm.type === 'wallet' && <Wallet className="w-6 h-6" />}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800">{pm.name}</h4>
                                        <p className="text-sm text-gray-500">{pm.description}</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only peer" 
                                        checked={pm.enabled}
                                        onChange={() => togglePaymentMethod(pm.id)}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
