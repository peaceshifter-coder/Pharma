import { Product, Category, Store, AppSettings, Order } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: '1', name: 'Pain Relief', slug: 'pain-relief' },
  { id: '2', name: 'Vitamins & Supplements', slug: 'vitamins' },
  { id: '3', name: 'First Aid', slug: 'first-aid' },
  { id: '4', name: 'Skin Care', slug: 'skin-care' },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '101',
    name: 'Advanced Pain Relief Gel',
    description: 'Fast-acting gel for muscle and joint pain relief. Contains cooling menthol.',
    price: 12.99,
    category: 'Pain Relief',
    imageUrl: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&q=80&w=400',
    stock: 50,
    requiresPrescription: false,
  },
  {
    id: '102',
    name: 'Multi-Vitamin Complex',
    description: 'Complete daily vitamin supplement for overall health and immunity boost.',
    price: 24.50,
    category: 'Vitamins & Supplements',
    imageUrl: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=400',
    stock: 100,
    requiresPrescription: false,
  },
  {
    id: '103',
    name: 'Premium Bandages Pack',
    description: 'Assorted sizes of waterproof bandages for cuts and scrapes.',
    price: 5.99,
    category: 'First Aid',
    imageUrl: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=400',
    stock: 200,
    requiresPrescription: false,
  },
  {
    id: '104',
    name: 'Hydrating Face Cream',
    description: 'Gentle moisturizing cream for sensitive skin with aloe vera.',
    price: 18.75,
    category: 'Skin Care',
    imageUrl: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&q=80&w=400',
    stock: 35,
    requiresPrescription: false,
  },
];

export const INITIAL_STORES: Store[] = [
  {
    id: 's1',
    name: 'PharmaCare Downtown',
    address: '123 Main St, Cityville',
    phone: '(555) 123-4567',
    lat: 40.7128, // NYC approx
    lng: -74.0060,
  },
  {
    id: 's2',
    name: 'PharmaCare Westside',
    address: '456 Oak Ave, Westtown',
    phone: '(555) 987-6543',
    lat: 34.0522, // LA approx
    lng: -118.2437,
  },
  {
    id: 's3',
    name: 'PharmaCare North Hills',
    address: '789 Pine Rd, Northville',
    phone: '(555) 456-7890',
    lat: 41.8781, // Chicago approx
    lng: -87.6298,
  }
];

export const INITIAL_SETTINGS: AppSettings = {
  logoUrl: 'https://cdn-icons-png.flaticon.com/512/3022/3022706.png', // Generic medical cross
  siteName: 'PharmaCare Plus',
  primaryColor: 'emerald',
  paymentMethods: [
    { id: 'cod', name: 'Cash on Delivery', type: 'cod', enabled: true, description: 'Pay with cash upon receipt of your order.' },
    { id: 'card', name: 'Credit/Debit Card', type: 'card', enabled: true, description: 'Secure online payment via Stripe/Visa/Mastercard.' },
    { id: 'paypal', name: 'PayPal', type: 'wallet', enabled: false, description: 'Fast and secure payment using your PayPal account.' },
  ]
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-1001',
    customerName: 'Alice Smith',
    date: '2023-10-25',
    items: [
      { ...INITIAL_PRODUCTS[0], quantity: 1 },
      { ...INITIAL_PRODUCTS[2], quantity: 2 }
    ],
    total: 24.97,
    status: 'Delivered',
    shippingAddress: '123 Maple St, Cityville',
    paymentMethod: 'Credit Card'
  },
  {
    id: 'ORD-1002',
    customerName: 'Bob Jones',
    date: '2023-10-26',
    items: [
      { ...INITIAL_PRODUCTS[1], quantity: 1 }
    ],
    total: 24.50,
    status: 'Processing',
    shippingAddress: '456 Oak Ave, Westtown',
    paymentMethod: 'Cash on Delivery'
  }
];