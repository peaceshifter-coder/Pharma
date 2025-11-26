
import { Product, Category, Store, AppSettings, User, Order, Page } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_STORES, INITIAL_SETTINGS, INITIAL_ORDERS, INITIAL_PAGES, FIREBASE_CONFIG } from '../constants';
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, collection, getDocs, setDoc, doc, deleteDoc, Firestore } from 'firebase/firestore';

// --- CONFIGURATION TYPE ---
export interface FirebaseConfig {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
}

// Helper to simulate network latency for local mode
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const LATENCY = 600;

// --- STORAGE HELPERS ---
const getStorageKey = () => 'PHARMA_FIREBASE_CONFIG';

export const getStoredFirebaseConfig = (): FirebaseConfig | null => {
    const data = localStorage.getItem(getStorageKey());
    try {
        return data ? JSON.parse(data) : null;
    } catch {
        return null;
    }
};

export const saveFirebaseConfig = (config: FirebaseConfig) => {
    localStorage.setItem(getStorageKey(), JSON.stringify(config));
    window.location.reload(); // Reload to initialize new DB connection
};

export const clearFirebaseConfig = () => {
    localStorage.removeItem(getStorageKey());
    window.location.reload();
};

// Data Migration Helper
const migrateProducts = (products: any[]): Product[] => {
    return products.map(p => {
        if (!p.images && p.imageUrl) {
            return { ...p, images: [p.imageUrl], imageUrl: undefined };
        }
        if (!p.images) {
            return { ...p, images: ['https://via.placeholder.com/400'] };
        }
        return p;
    });
};

const migrateOrders = (orders: any[]): Order[] => {
    return orders.map(o => ({
        ...o,
        items: migrateProducts(o.items)
    }));
}


// --- DATABASE INTERFACE ---
interface DBAdapter {
    type: 'LOCAL' | 'CLOUD';
    products: {
        getAll: () => Promise<Product[]>;
        save: (p: Product) => Promise<Product>;
        delete: (id: string) => Promise<void>;
    };
    categories: {
        getAll: () => Promise<Category[]>;
        save: (c: Category) => Promise<Category>;
        delete: (id: string) => Promise<void>;
    };
    stores: {
        getAll: () => Promise<Store[]>;
        save: (s: Store) => Promise<Store>;
        delete: (id: string) => Promise<void>;
    };
    orders: {
        getAll: () => Promise<Order[]>;
        create: (o: Order) => Promise<Order>;
        updateStatus: (id: string, status: Order['status']) => Promise<void>;
    };
    pages: {
        getAll: () => Promise<Page[]>;
        save: (p: Page) => Promise<Page>;
        delete: (id: string) => Promise<void>;
    };
    settings: {
        get: () => Promise<AppSettings>;
        save: (s: AppSettings) => Promise<AppSettings>;
    };
    auth: {
        login: (e: string, p?: string) => Promise<User>;
        logout: () => Promise<void>;
        getCurrentUser: () => User | null;
        updateUser: (u: User) => Promise<User>;
    };
}

// --- LOCAL ADAPTER (localStorage) ---
const LocalDB: DBAdapter = {
    type: 'LOCAL',
    products: {
        getAll: async () => { 
            await delay(LATENCY); 
            const raw = getTable('products', INITIAL_PRODUCTS);
            return migrateProducts(raw);
        },
        save: async (p) => { 
            await delay(LATENCY/2); 
            const list = migrateProducts(getTable('products', INITIAL_PRODUCTS));
            const idx = list.findIndex(x => x.id === p.id);
            if(idx >= 0) list[idx] = p; else list.push(p);
            saveTable('products', list);
            return p;
        },
        delete: async (id) => {
            await delay(LATENCY/2);
            const list = getTable('products', INITIAL_PRODUCTS);
            saveTable('products', list.filter(x => x.id !== id));
        }
    },
    categories: {
        getAll: async () => { await delay(LATENCY); return getTable('categories', INITIAL_CATEGORIES); },
        save: async (c) => {
            await delay(LATENCY/2);
            const list = getTable('categories', INITIAL_CATEGORIES);
            const idx = list.findIndex(x => x.id === c.id);
            if(idx >= 0) list[idx] = c; else list.push(c);
            saveTable('categories', list);
            return c;
        },
        delete: async (id) => {
            await delay(LATENCY/2);
            const list = getTable('categories', INITIAL_CATEGORIES);
            saveTable('categories', list.filter(x => x.id !== id));
        }
    },
    stores: {
        getAll: async () => { await delay(LATENCY); return getTable('stores', INITIAL_STORES); },
        save: async (s) => {
            await delay(LATENCY/2);
            const list = getTable('stores', INITIAL_STORES);
            const idx = list.findIndex(x => x.id === s.id);
            if(idx >= 0) list[idx] = s; else list.push(s);
            saveTable('stores', list);
            return s;
        },
        delete: async (id) => {
            await delay(LATENCY/2);
            const list = getTable('stores', INITIAL_STORES);
            saveTable('stores', list.filter(x => x.id !== id));
        }
    },
    orders: {
        getAll: async () => { 
            await delay(LATENCY); 
            const raw = getTable('all_orders', INITIAL_ORDERS);
            return migrateOrders(raw);
        },
        create: async (o) => {
            await delay(LATENCY);
            const list = migrateOrders(getTable('all_orders', INITIAL_ORDERS));
            list.unshift(o);
            saveTable('all_orders', list);
            return o;
        },
        updateStatus: async (id, status) => {
            await delay(LATENCY/2);
            const list = migrateOrders(getTable<Order>('all_orders', INITIAL_ORDERS));
            const item = list.find(x => x.id === id);
            if(item) { item.status = status; saveTable('all_orders', list); }
        }
    },
    pages: {
        getAll: async () => { await delay(LATENCY); return getTable('pages', INITIAL_PAGES); },
        save: async (p) => {
             await delay(LATENCY/2);
             const list = getTable('pages', INITIAL_PAGES);
             const idx = list.findIndex(x => x.id === p.id);
             if(idx >= 0) list[idx] = p; else list.push(p);
             saveTable('pages', list);
             return p;
        },
        delete: async (id) => {
            await delay(LATENCY/2);
            const list = getTable('pages', INITIAL_PAGES);
            saveTable('pages', list.filter(x => x.id !== id));
        }
    },
    settings: {
        get: async () => { await delay(LATENCY); return getTable('settings_obj', [INITIAL_SETTINGS])[0]; },
        save: async (s) => { 
            await delay(LATENCY/2); 
            saveTable('settings_obj', [s]); 
            return s; 
        }
    },
    auth: {
        login: async (email, password) => {
            await delay(800);
            if (email === 'admin@gmail.com' && password === 'Dark360@') {
                const admin: User = { id: 'admin-1', name: 'Administrator', email, savedAddresses: [], orders: [], role: 'admin' };
                localStorage.setItem('currentUser', JSON.stringify(admin));
                return admin;
            }
            const user: User = { id: 'u-'+Date.now(), name: email.split('@')[0], email, savedAddresses: ['123 Main St, Local'], orders: [], role: 'customer' };
            localStorage.setItem('currentUser', JSON.stringify(user));
            return user;
        },
        logout: async () => { localStorage.removeItem('currentUser'); },
        getCurrentUser: () => { const s = localStorage.getItem('currentUser'); return s ? JSON.parse(s) : null; },
        updateUser: async (u) => { localStorage.setItem('currentUser', JSON.stringify(u)); return u; }
    }
};

// --- CLOUD ADAPTER (Firebase) ---
// Note: This requires valid credentials to work.
let app: FirebaseApp | undefined;
let dbInstance: Firestore | undefined;

const initFirebase = (config: FirebaseConfig) => {
    if (!getApps().length) {
        try {
            app = initializeApp(config);
            dbInstance = getFirestore(app);
            console.log("Firebase Initialized Successfully");
        } catch (e) {
            console.error("Firebase Init Failed:", e);
        }
    } else {
        app = getApps()[0];
        dbInstance = getFirestore(app);
    }
};

const CloudDB = (): DBAdapter => {
    if (!dbInstance) throw new Error("Firebase not initialized");
    const fdb = dbInstance;

    // Generic Firestore Helpers
    const getCollection = async <T>(col: string, defaults: T[]): Promise<T[]> => {
        try {
            const snap = await getDocs(collection(fdb, col));
            if (snap.empty) {
                // If cloud is empty, return defaults
                return defaults; 
            }
            return snap.docs.map(d => d.data() as T);
        } catch (e) {
            console.error(`Error fetching ${col}:`, e);
            return defaults;
        }
    };

    const setItem = async <T extends {id: string}>(col: string, item: T) => {
        await setDoc(doc(fdb, col, item.id), item);
        return item;
    };

    const deleteItem = async (col: string, id: string) => {
        await deleteDoc(doc(fdb, col, id));
    };

    return {
        type: 'CLOUD',
        products: {
            getAll: async () => {
                const raw = await getCollection('products', INITIAL_PRODUCTS);
                return migrateProducts(raw);
            },
            save: (p) => setItem('products', p),
            delete: (id) => deleteItem('products', id)
        },
        categories: {
            getAll: () => getCollection('categories', INITIAL_CATEGORIES),
            save: (c) => setItem('categories', c),
            delete: (id) => deleteItem('categories', id)
        },
        stores: {
            getAll: () => getCollection('stores', INITIAL_STORES),
            save: (s) => setItem('stores', s),
            delete: (id) => deleteItem('stores', id)
        },
        orders: {
            getAll: async () => {
                const raw = await getCollection('orders', INITIAL_ORDERS);
                return migrateOrders(raw);
            },
            create: (o) => setItem('orders', o),
            updateStatus: async (id, status) => {
                await setDoc(doc(fdb, 'orders', id), { status }, { merge: true });
            }
        },
        pages: {
            getAll: () => getCollection('pages', INITIAL_PAGES),
            save: (p) => setItem('pages', p),
            delete: (id) => deleteItem('pages', id)
        },
        settings: {
            get: async () => {
                const list = await getCollection('settings', [INITIAL_SETTINGS]);
                return list[0] || INITIAL_SETTINGS;
            },
            save: async (s) => {
                await setDoc(doc(fdb, 'settings', 'global'), s);
                return s;
            }
        },
        auth: LocalDB.auth 
    };
};

// --- INITIALIZATION ---
let activeDB: DBAdapter = LocalDB;

// Determine which config to use
const storedConfig = getStoredFirebaseConfig();
const hardcodedConfig = FIREBASE_CONFIG;
const validHardcoded = hardcodedConfig && hardcodedConfig.apiKey && hardcodedConfig.apiKey !== "";

const activeConfig = validHardcoded ? hardcodedConfig : storedConfig;

if (activeConfig && activeConfig.apiKey) {
    initFirebase(activeConfig);
    if (dbInstance) {
        activeDB = CloudDB();
    }
}

export const db = activeDB;

// --- UTILS ---
function getTable<T>(key: string, def: T[]): T[] {
    const s = localStorage.getItem(key);
    return s ? JSON.parse(s) : def;
}
function saveTable(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
}
