export type CategoryType = 
  | 'All'
  | 'Burgers'
  | 'Fried Chicken'
  | 'Fries'
  | 'Combos'
  | 'Beverages'
  | 'Milkshakes'
  | 'Desserts'
  | 'Chocolates';

export interface CustomizationOption {
  cheese: 'Regular' | 'Extra (+₹20)';
  patty: 'Regular' | 'Extra (+₹50)';
  sauce: 'Signature' | 'Spicy' | 'Smoky';
}

export interface Addon {
  id: string;
  name: string;
  price: number;
  isAvailable: boolean;
  category?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: CategoryType;
  price: number;
  description: string;
  image: string;
  isAvailable: boolean;
  isVegetarian: boolean;
  isBestSeller?: boolean;
  preparationTimeMinutes: number;
  customizable?: boolean;
}

export interface ComboItem {
  id: string;
  name: string;
  description: string;
  items: string[];
  price: number;
  isAvailable: boolean;
  image: string;
}

export interface CartItem {
  cartItemId: string;
  productId: string;
  productName: string;
  category: string;
  basePrice: number;
  quantity: number;
  image: string;
  selectedCheese?: string;
  selectedPatty?: string;
  selectedSauce?: string;
  selectedAddons: {
    id: string;
    name: string;
    price: number;
  }[];
  itemTotal: number;
}

export type OrderSource = 'QR' | 'POS';
export type OrderType = 'Dine-in' | 'Takeaway';
export type OrderStatus = 'NEW' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';
export type PaymentMethod = 'UPI' | 'Card' | 'Cash';
export type PaymentStatus = 'PAID' | 'PENDING' | 'FAILED';

export interface Order {
  id: string;
  orderNumber: string; // e.g. "1048"
  source: OrderSource;
  type: OrderType;
  tableNumber?: string; // e.g. "12"
  customerMobile: string;
  customerName?: string;
  items: CartItem[];
  subtotal: number;
  couponCode?: string;
  discountAmount: number;
  gstAmount: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionId: string;
  status: OrderStatus;
  estimatedPrepMinutes: number;
  createdAt: string; // ISO or human readable
  statusTimestamps: {
    placed: string;
    preparing?: string;
    ready?: string;
    completed?: string;
  };
}

export interface RestaurantTable {
  id: string;
  number: string;
  capacity: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'INACTIVE';
  activeOrderId?: string;
}

export interface Coupon {
  code: string;
  discountType: 'FLAT' | 'PERCENT';
  discountValue: number;
  minOrder: number;
  maxDiscount?: number;
  expiry: string;
  usageCount: number;
  isActive: boolean;
  description: string;
}

export interface NotificationRecord {
  id: string;
  orderId: string;
  orderNumber: string;
  recipientMobile: string;
  channel: 'WHATSAPP' | 'SMS';
  message: string;
  timestamp: string;
  status: 'SENT' | 'DELIVERED';
}

export interface CustomerProfile {
  id: string;
  name: string;
  mobile: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate: string;
  favoriteItem?: string;
}

export type ActiveAppView = 
  | 'CUSTOMER' 
  | 'POS' 
  | 'KITCHEN' 
  | 'ADMIN'
  | 'ORDER_TRACKING'
  | 'INVOICE';

export type AdminSubTab = 
  | 'dashboard'
  | 'orders'
  | 'menu'
  | 'addons'
  | 'combos'
  | 'tables'
  | 'customers'
  | 'coupons'
  | 'payments'
  | 'notifications'
  | 'reports'
  | 'staff'
  | 'settings';
