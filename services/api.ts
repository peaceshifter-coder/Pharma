
import { Product, Category, Store, AppSettings, User, Order, Page } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_STORES, INITIAL_SETTINGS, INITIAL_ORDERS, INITIAL_PAGES } from '../constants';

// Simulated Network Latency (ms) - This makes it feel like a real DB connection
const LATENCY = 800;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to read/write from localStorage (Mocking a database table)
const getTable = <T>(tableName: string, defaultData: T[]): T[] => {
    const data = localStorage.getItem(tableName);
    return data ? JSON.parse(data) : defaultData;
};

const saveTable = <T>(tableName: string, data: T[]) => {
    localStorage.setItem(tableName, JSON.stringify(data));
};

const getSettings = (): AppSettings => {
    const data = localStorage.getItem('settings');
    return data ? { ...INITIAL_SETTINGS, ...JSON.parse(data) } : INITIAL_SETTINGS;
};

// --- Database API Service ---
// Replace the contents of these functions with actual fetch()/axios calls to connect to a real backend.
export const db = {
    products: {
        getAll: async (): Promise<Product[]> => {
            await delay(LATENCY);
            return getTable('products', INITIAL_PRODUCTS);
        },
        save: async (product: Product): Promise<Product> => {
            await delay(LATENCY / 2); // Writes are usually faster in UI perception
            const products = getTable('products', INITIAL_PRODUCTS);
            const index = products.findIndex(p => p.id === product.id);
            if (index >= 0) products[index] = product;
            else products.push(product);
            saveTable('products', products);
            return product;
        },
        delete: async (id: string): Promise<void> => {
            await delay(LATENCY / 2);
            const products = getTable('products', INITIAL_PRODUCTS);
            saveTable('products', products.filter(p => p.id !== id));
        }
    },

    categories: {
        getAll: async (): Promise<Category[]> => {
            await delay(LATENCY);
            return getTable('categories', INITIAL_CATEGORIES);
        },
        save: async (category: Category): Promise<Category> => {
            await delay(LATENCY / 2);
            const list = getTable('categories', INITIAL_CATEGORIES);
            const index = list.findIndex(c => c.id === category.id);
            if (index >= 0) list[index] = category;
            else list.push(category);
            saveTable('categories', list);
            return category;
        },
        delete: async (id: string): Promise<void> => {
            await delay(LATENCY / 2);
            const list = getTable('categories', INITIAL_CATEGORIES);
            saveTable('categories', list.filter(c => c.id !== id));
        }
    },

    stores: {
        getAll: async (): Promise<Store[]> => {
            await delay(LATENCY);
            return getTable('stores', INITIAL_STORES);
        },
        save: async (store: Store): Promise<Store> => {
            await delay(LATENCY / 2);
            const list = getTable('stores', INITIAL_STORES);
            const index = list.findIndex(s => s.id === store.id);
            if (index >= 0) list[index] = store;
            else list.push(store);
            saveTable('stores', list);
            return store;
        },
        delete: async (id: string): Promise<void> => {
            await delay(LATENCY / 2);
            const list = getTable('stores', INITIAL_STORES);
            saveTable('stores', list.filter(s => s.id !== id));
        }
    },

    orders: {
        getAll: async (): Promise<Order[]> => {
            await delay(LATENCY);
            return getTable('all_orders', INITIAL_ORDERS);
        },
        create: async (order: Order): Promise<Order> => {
            await delay(LATENCY);
            const list = getTable('all_orders', INITIAL_ORDERS);
            list.unshift(order); // Add to top
            saveTable('all_orders', list);
            return order;
        },
        updateStatus: async (orderId: string, status: Order['status']): Promise<void> => {
            await delay(LATENCY / 2);
            const list = getTable('all_orders', INITIAL_ORDERS);
            const order = list.find(o => o.id === orderId);
            if (order) {
                order.status = status;
                saveTable('all_orders', list);
            }
        }
    },

    pages: {
        getAll: async (): Promise<Page[]> => {
            await delay(LATENCY);
            return getTable('pages', INITIAL_PAGES);
        },
        save: async (page: Page): Promise<Page> => {
            await delay(LATENCY / 2);
            const list = getTable('pages', INITIAL_PAGES);
            const index = list.findIndex(p => p.id === page.id);
            if (index >= 0) list[index] = page;
            else list.push(page);
            saveTable('pages', list);
            return page;
        },
        delete: async (id: string): Promise<void> => {
            await delay(LATENCY / 2);
            const list = getTable('pages', INITIAL_PAGES);
            saveTable('pages', list.filter(p => p.id !== id));
        }
    },

    settings: {
        get: async (): Promise<AppSettings> => {
            await delay(LATENCY);
            return getSettings();
        },
        save: async (settings: AppSettings): Promise<AppSettings> => {
            await delay(LATENCY / 2);
            localStorage.setItem('settings', JSON.stringify(settings));
            return settings;
        }
    },

    auth: {
        login: async (email: string, password?: string): Promise<User> => {
            await delay(1000); // Simulate secure auth check
            
            // Hardcoded Admin Check
            if (email === 'admin@gmail.com' && password === 'Dark360@') {
                const admin: User = { 
                    id: 'admin-1', 
                    name: 'Administrator', 
                    email, 
                    savedAddresses: [], 
                    orders: [], 
                    role: 'admin' 
                };
                localStorage.setItem('currentUser', JSON.stringify(admin));
                return admin;
            }

            // Mock Customer Login
            const user: User = {
                id: 'user-' + Date.now(),
                name: email.split('@')[0],
                email: email,
                savedAddresses: ['123 Main St, Cityville'],
                orders: [],
                role: 'customer'
            };
            localStorage.setItem('currentUser', JSON.stringify(user));
            return user;
        },
        logout: async (): Promise<void> => {
            await delay(200);
            localStorage.removeItem('currentUser');
        },
        getCurrentUser: (): User | null => {
            const saved = localStorage.getItem('currentUser');
            return saved ? JSON.parse(saved) : null;
        },
        updateUser: async (user: User): Promise<User> => {
            await delay(300);
            localStorage.setItem('currentUser', JSON.stringify(user));
            return user;
        }
    }
};
