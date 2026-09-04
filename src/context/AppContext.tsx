import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  MenuItem,
  Addon,
  ComboItem,
  RestaurantTable,
  Coupon,
  Order,
  CustomerProfile,
  NotificationRecord,
  CartItem,
  ActiveAppView,
  AdminSubTab,
  OrderStatus,
  PaymentMethod,
} from '../types';
import {
  INITIAL_MENU_ITEMS,
  INITIAL_ADDONS,
  INITIAL_COMBOS,
  INITIAL_TABLES,
  INITIAL_COUPONS,
  INITIAL_CUSTOMERS,
  INITIAL_ORDERS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';

interface AppContextType {
  // Navigation & View
  activeView: ActiveAppView;
  setActiveView: (view: ActiveAppView) => void;
  adminSubTab: AdminSubTab;
  setAdminSubTab: (tab: AdminSubTab) => void;
  userRole: 'CUSTOMER' | 'KITCHEN' | 'OWNER';
  setUserRole: (role: 'CUSTOMER' | 'KITCHEN' | 'OWNER') => void;

  // Active Context
  activeTableNumber: string;
  setActiveTableNumber: (table: string) => void;
  currentOrder: Order | null;
  setCurrentOrder: (order: Order | null) => void;
  selectedOrderForInvoice: Order | null;
  setSelectedOrderForInvoice: (order: Order | null) => void;

  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  addToCart: (item: Omit<CartItem, 'cartItemId' | 'itemTotal'>) => void;
  updateCartItemQty: (cartItemId: string, qty: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  cartSubtotal: number;
  discountAmount: number;
  gstAmount: number;
  cartTotal: number;

  // Ordering & Checkout
  simulatePaymentFailure: boolean;
  setSimulatePaymentFailure: (val: boolean) => void;
  placeCustomerOrder: (mobile: string, paymentMethod: PaymentMethod, customerName?: string) => Promise<Order>;
  placePosOrder: (
    items: CartItem[],
    type: 'Dine-in' | 'Takeaway',
    tableNumber: string | undefined,
    customerMobile: string,
    paymentMethod: PaymentMethod,
    couponCode?: string,
  ) => Order;

  // Operational State
  orders: Order[];
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  cancelOrder: (orderId: string) => void;

  // Entity Lists & Management
  menuItems: MenuItem[];
  toggleProductAvailability: (id: string) => void;
  updateMenuItem: (item: MenuItem) => void;
  addMenuItem: (item: MenuItem) => void;

  addons: Addon[];
  toggleAddonAvailability: (id: string) => void;

  combos: ComboItem[];
  toggleComboAvailability: (id: string) => void;

  tables: RestaurantTable[];
  updateTableStatus: (tableId: string, status: 'AVAILABLE' | 'OCCUPIED' | 'INACTIVE') => void;

  coupons: Coupon[];
  toggleCouponActive: (code: string) => void;
  saveCoupon: (coupon: Coupon) => void;

  customers: CustomerProfile[];
  notifications: NotificationRecord[];
  sendCustomNotification: (mobile: string, channel: 'WHATSAPP' | 'SMS', message: string, orderNumber: string) => void;

  // Demo Control
  resetDemo: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Views
  const [activeView, setActiveView] = useState<ActiveAppView>('CUSTOMER');
  const [adminSubTab, setAdminSubTab] = useState<AdminSubTab>('dashboard');
  const [userRole, setUserRole] = useState<'CUSTOMER' | 'KITCHEN' | 'OWNER'>('CUSTOMER');

  // Customer State
  const [activeTableNumber, setActiveTableNumber] = useState<string>('12'); // Default Table 12 as per master prompt
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);
  const [simulatePaymentFailure, setSimulatePaymentFailure] = useState<boolean>(false);

  // Core Data
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [addons, setAddons] = useState<Addon[]>(INITIAL_ADDONS);
  const [combos, setCombos] = useState<ComboItem[]>(INITIAL_COMBOS);
  const [tables, setTables] = useState<RestaurantTable[]>(INITIAL_TABLES);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [customers, setCustomers] = useState<CustomerProfile[]>(INITIAL_CUSTOMERS);
  const [notifications, setNotifications] = useState<NotificationRecord[]>(INITIAL_NOTIFICATIONS);

  // Sync current tracked order if it exists in orders
  useEffect(() => {
    if (currentOrder) {
      const updated = orders.find((o) => o.id === currentOrder.id);
      if (updated && updated.status !== currentOrder.status) {
        setCurrentOrder(updated);
      }
    }
  }, [orders, currentOrder]);

  // Cart Calculations
  const cartSubtotal = cart.reduce((acc, item) => acc + item.itemTotal, 0);

  let discountAmount = 0;
  if (appliedCoupon && cartSubtotal >= appliedCoupon.minOrder) {
    if (appliedCoupon.discountType === 'FLAT') {
      discountAmount = appliedCoupon.discountValue;
    } else {
      const calculated = Math.round((cartSubtotal * appliedCoupon.discountValue) / 100);
      discountAmount = appliedCoupon.maxDiscount ? Math.min(calculated, appliedCoupon.maxDiscount) : calculated;
    }
  }

  // GST 5% placeholder (rounded)
  const gstAmount = Math.max(0, Math.round((cartSubtotal - discountAmount) * 0.05));
  const cartTotal = Math.max(0, cartSubtotal - discountAmount + gstAmount);

  // Cart Actions
  const addToCart = (item: Omit<CartItem, 'cartItemId' | 'itemTotal'>) => {
    const addonsCost = item.selectedAddons.reduce((sum, a) => sum + a.price, 0);
    const itemTotal = (item.basePrice + addonsCost) * item.quantity;
    const cartItemId = `${item.productId}-${item.selectedCheese || ''}-${item.selectedPatty || ''}-${item.selectedSauce || ''}-${item.selectedAddons.map((a) => a.id).sort().join(',')}`;

    setCart((prev) => {
      const existingIndex = prev.findIndex((i) => i.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + item.quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          itemTotal: (item.basePrice + addonsCost) * newQty,
        };
        return updated;
      } else {
        return [...prev, { ...item, cartItemId, itemTotal }];
      }
    });
  };

  const updateCartItemQty = (cartItemId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.cartItemId === cartItemId) {
          const addonsCost = item.selectedAddons.reduce((sum, a) => sum + a.price, 0);
          return {
            ...item,
            quantity: qty,
            itemTotal: (item.basePrice + addonsCost) * qty,
          };
        }
        return item;
      }),
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const cleaned = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === cleaned && c.isActive);
    if (!found) {
      return { success: false, message: `Coupon "${cleaned}" is invalid or expired.` };
    }
    if (cartSubtotal < found.minOrder) {
      return {
        success: false,
        message: `Coupon "${cleaned}" requires a minimum order of ₹${found.minOrder}. Current subtotal: ₹${cartSubtotal}.`,
      };
    }
    setAppliedCoupon(found);
    return { success: true, message: `Coupon "${cleaned}" applied successfully! You saved ₹${found.discountType === 'FLAT' ? found.discountValue : found.discountValue + '%'}.` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Helper to send simulated notification
  const sendSimulatedNotification = (
    orderId: string,
    orderNumber: string,
    mobile: string,
    channel: 'WHATSAPP' | 'SMS',
    message: string,
  ) => {
    const newNotif: NotificationRecord = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      orderId,
      orderNumber,
      recipientMobile: mobile,
      channel,
      message,
      timestamp: 'Just now',
      status: 'DELIVERED',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Checkout and Order Placement (Customer QR)
  const placeCustomerOrder = async (
    mobile: string,
    paymentMethod: PaymentMethod,
    customerName?: string,
  ): Promise<Order> => {
    // Generate order number starting from 1048
    const nextOrderNum = (1048 + orders.length - 4).toString();
    const orderId = `order-${nextOrderNum}`;
    const txnId = `DEMO_TXN_${nextOrderNum}`;
    const nowTime = 'Just now';

    const newOrder: Order = {
      id: orderId,
      orderNumber: nextOrderNum,
      source: 'QR',
      type: 'Dine-in',
      tableNumber: activeTableNumber,
      customerMobile: mobile,
      customerName: customerName || 'Table Guest',
      items: [...cart],
      subtotal: cartSubtotal,
      couponCode: appliedCoupon?.code,
      discountAmount,
      gstAmount,
      totalAmount: cartTotal,
      paymentMethod,
      paymentStatus: 'PAID',
      transactionId: txnId,
      status: 'NEW',
      estimatedPrepMinutes: 12,
      createdAt: nowTime,
      statusTimestamps: {
        placed: nowTime,
      },
    };

    // Update state
    setOrders((prev) => [newOrder, ...prev]);
    setCurrentOrder(newOrder);
    setSelectedOrderForInvoice(newOrder);

    // Update table status
    setTables((prev) =>
      prev.map((t) =>
        t.number === activeTableNumber ? { ...t, status: 'OCCUPIED', activeOrderId: orderId } : t,
      ),
    );

    // Update or add customer profile
    setCustomers((prev) => {
      const idx = prev.findIndex((c) => c.mobile === mobile);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          ordersCount: updated[idx].ordersCount + 1,
          totalSpent: updated[idx].totalSpent + cartTotal,
          lastOrderDate: 'Just now',
        };
        return updated;
      } else {
        return [
          {
            id: `cust-${Date.now()}`,
            name: customerName || `Customer ${mobile.slice(-4)}`,
            mobile,
            ordersCount: 1,
            totalSpent: cartTotal,
            lastOrderDate: 'Just now',
            favoriteItem: cart[0]?.productName,
          },
          ...prev,
        ];
      }
    });

    // Send Simulated WhatsApp & SMS
    sendSimulatedNotification(
      orderId,
      nextOrderNum,
      mobile,
      'WHATSAPP',
      `Your FRYGUY order #${nextOrderNum} for Table ${activeTableNumber} is confirmed! Payment of ₹${cartTotal} verified via ${paymentMethod}. Kitchen is preparing your meal.`,
    );
    sendSimulatedNotification(
      orderId,
      nextOrderNum,
      mobile,
      'SMS',
      `FRYGUY: Order #${nextOrderNum} confirmed. Total: ₹${cartTotal}. Estimated preparation: 10–15 mins. Track order at https://fryguy.demo/track/${nextOrderNum}`,
    );

    // Clear cart
    clearCart();

    return newOrder;
  };

  // Place POS Order
  const placePosOrder = (
    items: CartItem[],
    type: 'Dine-in' | 'Takeaway',
    tableNumber: string | undefined,
    customerMobile: string,
    paymentMethod: PaymentMethod,
    couponCode?: string,
  ): Order => {
    const nextOrderNum = (1048 + orders.length - 4).toString();
    const orderId = `order-${nextOrderNum}`;
    const txnId = `DEMO_TXN_${nextOrderNum}`;
    const nowTime = 'Just now';

    const subtotal = items.reduce((sum, i) => sum + i.itemTotal, 0);
    let discount = 0;
    if (couponCode) {
      const c = coupons.find((cp) => cp.code.toUpperCase() === couponCode.toUpperCase());
      if (c && subtotal >= c.minOrder) {
        discount = c.discountType === 'FLAT' ? c.discountValue : Math.round((subtotal * c.discountValue) / 100);
      }
    }
    const gst = Math.max(0, Math.round((subtotal - discount) * 0.05));
    const total = Math.max(0, subtotal - discount + gst);

    const newOrder: Order = {
      id: orderId,
      orderNumber: nextOrderNum,
      source: 'POS',
      type,
      tableNumber: type === 'Dine-in' ? tableNumber || '01' : undefined,
      customerMobile: customerMobile || '9876500000',
      customerName: type === 'Dine-in' ? `Table ${tableNumber || '01'} Guest` : 'Counter Customer',
      items,
      subtotal,
      couponCode,
      discountAmount: discount,
      gstAmount: gst,
      totalAmount: total,
      paymentMethod,
      paymentStatus: 'PAID',
      transactionId: txnId,
      status: 'NEW',
      estimatedPrepMinutes: 10,
      createdAt: nowTime,
      statusTimestamps: {
        placed: nowTime,
      },
    };

    setOrders((prev) => [newOrder, ...prev]);

    if (type === 'Dine-in' && tableNumber) {
      setTables((prev) =>
        prev.map((t) =>
          t.number === tableNumber ? { ...t, status: 'OCCUPIED', activeOrderId: orderId } : t,
        ),
      );
    }

    sendSimulatedNotification(
      orderId,
      nextOrderNum,
      customerMobile || '9876500000',
      'SMS',
      `FRYGUY POS: Order #${nextOrderNum} (${type}) confirmed. Amount: ₹${total} via ${paymentMethod}. Digital bill: https://fryguy.demo/inv/${nextOrderNum}`,
    );

    return newOrder;
  };

  // Kitchen / Admin Status Progression
  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const updatedTimestamps = { ...order.statusTimestamps };
          if (status === 'PREPARING') updatedTimestamps.preparing = 'Just now';
          if (status === 'READY') updatedTimestamps.ready = 'Just now';
          if (status === 'COMPLETED') updatedTimestamps.completed = 'Just now';

          // Trigger simulated notification
          if (status === 'PREPARING') {
            sendSimulatedNotification(
              order.id,
              order.orderNumber,
              order.customerMobile,
              'WHATSAPP',
              `Your FRYGUY order #${order.orderNumber} is now PREPARING in the kitchen! Freshly breaded and frying to crisp perfection.`,
            );
          } else if (status === 'READY') {
            sendSimulatedNotification(
              order.id,
              order.orderNumber,
              order.customerMobile,
              'WHATSAPP',
              `Order #${order.orderNumber} is READY! ${
                order.type === 'Dine-in'
                  ? `Our server is bringing it to Table ${order.tableNumber || 'your table'}.`
                  : 'Please pick it up at the counter.'
              }`,
            );
            sendSimulatedNotification(
              order.id,
              order.orderNumber,
              order.customerMobile,
              'SMS',
              `FRYGUY: Order #${order.orderNumber} is READY for ${order.type === 'Dine-in' ? `Table ${order.tableNumber}` : 'pickup'}. Enjoy!`,
            );
          } else if (status === 'COMPLETED') {
            sendSimulatedNotification(
              order.id,
              order.orderNumber,
              order.customerMobile,
              'WHATSAPP',
              `Thank you for choosing FRYGUY! View your digital invoice INV-${order.orderNumber}: https://fryguy.demo/inv/${order.orderNumber}`,
            );
          }

          // If completed, release table
          if (status === 'COMPLETED' && order.tableNumber) {
            setTables((tbls) =>
              tbls.map((t) =>
                t.number === order.tableNumber ? { ...t, status: 'AVAILABLE', activeOrderId: undefined } : t,
              ),
            );
          }

          return {
            ...order,
            status,
            statusTimestamps: updatedTimestamps,
          };
        }
        return order;
      }),
    );
  };

  const cancelOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          if (order.tableNumber) {
            setTables((tbls) =>
              tbls.map((t) =>
                t.number === order.tableNumber ? { ...t, status: 'AVAILABLE', activeOrderId: undefined } : t,
              ),
            );
          }
          return { ...order, status: 'CANCELLED' };
        }
        return order;
      }),
    );
  };

  // Menu Management
  const toggleProductAvailability = (id: string) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isAvailable: !item.isAvailable } : item)),
    );
  };

  const updateMenuItem = (updatedItem: MenuItem) => {
    setMenuItems((prev) => prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
  };

  const addMenuItem = (item: MenuItem) => {
    setMenuItems((prev) => [item, ...prev]);
  };

  const toggleAddonAvailability = (id: string) => {
    setAddons((prev) =>
      prev.map((addon) => (addon.id === id ? { ...addon, isAvailable: !addon.isAvailable } : addon)),
    );
  };

  const toggleComboAvailability = (id: string) => {
    setCombos((prev) =>
      prev.map((combo) => (combo.id === id ? { ...combo, isAvailable: !combo.isAvailable } : combo)),
    );
  };

  const updateTableStatus = (tableId: string, status: 'AVAILABLE' | 'OCCUPIED' | 'INACTIVE') => {
    setTables((prev) => prev.map((t) => (t.id === tableId ? { ...t, status } : t)));
  };

  const toggleCouponActive = (code: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.code === code ? { ...c, isActive: !c.isActive } : c)),
    );
  };

  const saveCoupon = (coupon: Coupon) => {
    setCoupons((prev) => {
      const idx = prev.findIndex((c) => c.code.toUpperCase() === coupon.code.toUpperCase());
      if (idx > -1) {
        const updated = [...prev];
        updated[idx] = coupon;
        return updated;
      }
      return [coupon, ...prev];
    });
  };

  const sendCustomNotification = (
    mobile: string,
    channel: 'WHATSAPP' | 'SMS',
    message: string,
    orderNumber: string,
  ) => {
    sendSimulatedNotification(`custom-${Date.now()}`, orderNumber, mobile, channel, message);
  };

  // Reset Demo to initial state
  const resetDemo = () => {
    setMenuItems(INITIAL_MENU_ITEMS);
    setAddons(INITIAL_ADDONS);
    setCombos(INITIAL_COMBOS);
    setTables(INITIAL_TABLES);
    setCoupons(INITIAL_COUPONS);
    setOrders(INITIAL_ORDERS);
    setCustomers(INITIAL_CUSTOMERS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setCart([]);
    setAppliedCoupon(null);
    setCurrentOrder(null);
    setSelectedOrderForInvoice(null);
    setActiveTableNumber('12');
    setSimulatePaymentFailure(false);
    setActiveView('CUSTOMER');
    setAdminSubTab('dashboard');
    setUserRole('CUSTOMER');
  };

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
        adminSubTab,
        setAdminSubTab,
        userRole,
        setUserRole,

        activeTableNumber,
        setActiveTableNumber,
        currentOrder,
        setCurrentOrder,
        selectedOrderForInvoice,
        setSelectedOrderForInvoice,

        cart,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        addToCart,
        updateCartItemQty,
        removeFromCart,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        cartSubtotal,
        discountAmount,
        gstAmount,
        cartTotal,

        simulatePaymentFailure,
        setSimulatePaymentFailure,
        placeCustomerOrder,
        placePosOrder,

        orders,
        updateOrderStatus,
        cancelOrder,

        menuItems,
        toggleProductAvailability,
        updateMenuItem,
        addMenuItem,

        addons,
        toggleAddonAvailability,

        combos,
        toggleComboAvailability,

        tables,
        updateTableStatus,

        coupons,
        toggleCouponActive,
        saveCoupon,

        customers,
        notifications,
        sendCustomNotification,

        resetDemo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
