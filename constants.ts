
import { Product, Category, Store, AppSettings, Order, Page } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  { 
    id: '1', 
    name: 'Pain Relief', 
    slug: 'pain-relief',
    imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: '2', 
    name: 'Vitamins & Supplements', 
    slug: 'vitamins',
    imageUrl: 'https://images.unsplash.com/photo-1565071783280-719b01b29912?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: '3', 
    name: 'First Aid', 
    slug: 'first-aid',
    imageUrl: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: '4', 
    name: 'Skin Care', 
    slug: 'skin-care',
    imageUrl: 'https://images.unsplash.com/photo-1585945037805-5fd82c2e60b1?auto=format&fit=crop&q=80&w=400'
  },
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
  },
  {
    id: 's4',
    name: 'Sameer store',
    address: '12 medavakkam',
    phone: '(+91)9884917541',
    lat: 12.9103105, // Chicago approx
    lng: 80.1938566,
  }
];

export const INITIAL_SETTINGS: AppSettings = {
  logoUrl: 'https://cdn-icons-png.flaticon.com/512/3022/3022706.png', // Generic medical cross
  siteName: 'PharmaCare Plus',
  primaryColor: 'blue',
  paymentMethods: [
    { id: 'cod', name: 'Cash on Delivery', type: 'cod', enabled: true, description: 'Pay with cash upon receipt of your order.' },
    { id: 'card', name: 'Credit/Debit Card', type: 'card', enabled: true, description: 'Secure online payment via Stripe/Visa/Mastercard.' },
    { id: 'paypal', name: 'PayPal', type: 'wallet', enabled: false, description: 'Fast and secure payment using your PayPal account.' },
  ],
  hero: {
      title: 'Your Health, Our Priority',
      subtitle: 'Get your medications delivered to your doorstep with the nearest pharmacy locator and trusted professionals.',
      imageUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=2000',
      ctaText: 'Shop Now'
  },
  contact: {
      address: '123 Health Avenue, Medical District, New York, NY 10001',
      phone: '(555) 123-4567',
      email: 'support@pharmacareplus.com'
  },
  footerAboutText: 'Your trusted partner in health and wellness. We provide high-quality medicines, health products, and professional care right to your doorstep.'
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

export const INITIAL_PAGES: Page[] = [
  {
    id: 'p1',
    title: 'Terms of Service',
    slug: 'terms-of-service',
    lastUpdated: '2023-11-01',
    content: `Welcome to PharmaCare Plus.

1. **Acceptance of Terms**
By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.

2. **Use of Services**
You agree to use our services for lawful purposes only. You are prohibited from violating or attempting to violate the security of the site.

3. **Medical Disclaimer**
The content on this site is for informational purposes only. It is not intended to be a substitute for professional medical advice, diagnosis, or treatment.

4. **Prescription Drugs**
Valid prescriptions are required for the purchase of certain medication. We reserve the right to verify prescriptions with your healthcare provider.

5. **Changes to Terms**
We reserve the right to modify these terms at any time. Your continued use of the site constitutes your acceptance of such changes.`
  },
  {
    id: 'p2',
    title: 'Privacy Policy',
    slug: 'privacy-policy',
    lastUpdated: '2023-11-01',
    content: `Your privacy is important to us.

1. **Information Collection**
We collect information you provide directly to us, such as when you create an account, place an order, or contact customer support.

2. **Use of Information**
We use the information we collect to process your orders, communicate with you, and improve our services.

3. **Data Security**
We implement security measures to maintain the safety of your personal information.

4. **Third-Party Disclosure**
We do not sell, trade, or otherwise transfer your Personally Identifiable Information to outside parties unless we provide users with advance notice.

5. **Contact Us**
If there are any questions regarding this privacy policy, you may contact us using the information in the contact section.`
  },
  {
    id: 'p3',
    title: 'Cookie Policy',
    slug: 'cookie-policy',
    lastUpdated: '2023-11-01',
    content: `This Cookie Policy explains how PharmaCare Plus uses cookies and similar technologies.

1. **What are Cookies?**
Cookies are small text files that are stored on your device when you visit a website.

2. **How We Use Cookies**
We use cookies to:
- Remember your login status
- Process items in your shopping cart
- Analyze site traffic and user behavior

3. **Managing Cookies**
You can choose to disable cookies through your browser settings, but this may affect the functionality of the website.

4. **Third-Party Cookies**
We may use third-party services that also set cookies on your device for analytics or advertising purposes.`
  }
];
