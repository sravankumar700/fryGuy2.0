import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CategoryType, MenuItem, CartItem, PaymentMethod } from '../types';
import { BrandLogo } from './BrandLogo';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  ArrowRight,
  Store,
  ChefHat,
  User,
  Smartphone,
  CreditCard,
  Banknote,
  QrCode,
  Tag,
  Clock,
  Printer,
  FileText,
} from 'lucide-react';

export const CounterPOS: React.FC = () => {
  const {
    menuItems,
    addons,
    tables,
    placePosOrder,
    setActiveView,
    setSelectedOrderForInvoice,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [orderType, setOrderType] = useState<'Dine-in' | 'Takeaway'>('Takeaway');
  const [selectedTable, setSelectedTable] = useState('01');
  const [customerMobile, setCustomerMobile] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [couponCode, setCouponCode] = useState('');

  // POS local active cart
  const [posCart, setPosCart] = useState<CartItem[]>([]);
  const [lastCreatedOrder, setLastCreatedOrder] = useState<any>(null);

  const categories: CategoryType[] = [
    'All',
    'Burgers',
    'Fried Chicken',
    'Fries',
    'Combos',
    'Beverages',
    'Milkshakes',
    'Desserts',
    'Chocolates',
  ];

  const filteredProducts = menuItems.filter((item) => {
    const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch && item.isAvailable;
  });

  const addToPosCart = (product: MenuItem) => {
    setPosCart((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id
            ? {
                ...i,
                quantity: i.quantity + 1,
                itemTotal: (i.quantity + 1) * i.basePrice,
              }
            : i,
        );
      }
      return [
        ...prev,
        {
          cartItemId: `pos-${product.id}-${Date.now()}`,
          productId: product.id,
          productName: product.name,
          category: product.category,
          basePrice: product.price,
          quantity: 1,
          image: product.image,
          selectedAddons: [],
          itemTotal: product.price,
        },
      ];
    });
  };

  const updateQty = (cartItemId: string, delta: number) => {
    setPosCart((prev) =>
      prev
        .map((i) => {
          if (i.cartItemId === cartItemId) {
            const nq = i.quantity + delta;
            return nq > 0 ? { ...i, quantity: nq, itemTotal: nq * i.basePrice } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[],
    );
  };

  const posSubtotal = posCart.reduce((acc, i) => acc + i.itemTotal, 0);
  const posDiscount = couponCode.toUpperCase() === 'FRY50' && posSubtotal >= 299 ? 50 : 0;
  const posGst = Math.max(0, Math.round((posSubtotal - posDiscount) * 0.05));
  const posTotal = Math.max(0, posSubtotal - posDiscount + posGst);

  const handlePlaceOrder = () => {
    if (posCart.length === 0) return;
    const order = placePosOrder(
      posCart,
      orderType,
      orderType === 'Dine-in' ? selectedTable : undefined,
      customerMobile || '9876500000',
      paymentMethod,
      couponCode,
    );

    setLastCreatedOrder(order);
    setPosCart([]);
    setCustomerMobile('');
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col md:flex-row bg-zinc-950 text-zinc-100 overflow-hidden">
      {/* LEFT SECTION: Search, Category Bar, and Dense Touch Product Grid */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-zinc-800 overflow-hidden">
        {/* Top Filter Bar */}
        <div className="p-3.5 sm:p-4 bg-zinc-900 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#ED1C24] text-white rounded-xl shadow-sm">
              <Store className="w-5 h-5" />
            </div>
            <h1 className="font-display font-black text-lg sm:text-xl text-zinc-100">
              FRYGUY Counter POS
            </h1>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 placeholder-zinc-500 focus:outline-hidden focus:border-red-500 transition-colors"
            />
          </div>
        </div>

        {/* Categories Bar */}
        <div className="bg-zinc-900/90 px-3 py-2.5 border-b border-zinc-800 flex items-center gap-1.5 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer font-condensed tracking-wide ${
                selectedCategory === cat
                  ? 'bg-[#ED1C24] text-white shadow-sm'
                  : 'bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="flex-1 p-3 sm:p-4 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredProducts.map((item) => (
              <button
                key={item.id}
                onClick={() => addToPosCart(item)}
                className="group bg-zinc-900/90 rounded-2xl border border-zinc-800 hover:border-red-500/50 p-3 text-left flex flex-col justify-between transition-all hover:shadow-lg active:scale-97 cursor-pointer"
              >
                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-2 bg-zinc-950 border border-zinc-800">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {item.isVegetarian && (
                    <span className="absolute top-1.5 left-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-zinc-900" />
                  )}
                </div>

                <div>
                  <h3 className="font-display font-bold text-xs sm:text-sm text-zinc-200 line-clamp-1 group-hover:text-red-400 transition-colors">
                    {item.name}
                  </h3>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="font-condensed font-extrabold text-sm text-red-400">
                      ₹{item.price}
                    </span>
                    <span className="text-[10px] bg-[#ED1C24] text-white font-black px-2 py-0.5 rounded-md font-condensed tracking-wider">
                      + ADD
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SECTION: Current Order Ticket & Payment Panel */}
      <div className="w-full md:w-96 lg:w-[420px] bg-zinc-900 flex flex-col h-full shadow-2xl border-l border-zinc-800">
        {/* Order Setup Header */}
        <div className="p-3.5 sm:p-4 border-b border-zinc-800 bg-zinc-900/90 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-base text-zinc-100">Current Ticket</h2>
            {posCart.length > 0 && (
              <button
                onClick={() => setPosCart([])}
                className="text-xs text-zinc-400 hover:text-red-400 cursor-pointer transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          {/* Dine-in vs Takeaway Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-950 rounded-xl border border-zinc-800">
            <button
              onClick={() => setOrderType('Takeaway')}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                orderType === 'Takeaway'
                  ? 'bg-[#ED1C24] text-white font-black shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Takeaway
            </button>
            <button
              onClick={() => setOrderType('Dine-in')}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                orderType === 'Dine-in'
                  ? 'bg-[#ED1C24] text-white font-black shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Dine-In
            </button>
          </div>

          {/* Table Selector (If Dine-In) & Customer Mobile */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {orderType === 'Dine-in' ? (
              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                  Table No.
                </label>
                <select
                  value={selectedTable}
                  onChange={(e) => setSelectedTable(e.target.value)}
                  className="w-full p-2 border border-zinc-800 rounded-xl bg-zinc-950 text-zinc-200 font-bold text-xs focus:border-red-500 focus:outline-hidden"
                >
                  {tables.map((t) => (
                    <option key={t.id} value={t.number} className="bg-zinc-950 text-zinc-200">
                      Table {t.number} ({t.status})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                  Counter Order
                </label>
                <div className="p-2 bg-zinc-950 border border-zinc-800 rounded-xl font-semibold text-zinc-400 text-xs">
                  Express Handoff
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                Customer Mobile
              </label>
              <input
                type="tel"
                placeholder="98XXXXXX42"
                value={customerMobile}
                onChange={(e) => setCustomerMobile(e.target.value)}
                className="w-full p-2 border border-zinc-800 rounded-xl bg-zinc-950 font-medium text-xs text-zinc-200 placeholder-zinc-500 focus:outline-hidden focus:border-red-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Ticket Item List */}
        <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-2 divide-y divide-zinc-800/60">
          {posCart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-zinc-500 py-12">
              <Store className="w-8 h-8 text-zinc-600 mb-2" />
              <p className="text-xs font-semibold text-zinc-400">No items selected yet</p>
              <span className="text-[11px] text-zinc-500 mt-0.5">
                Tap items from the left menu to build order
              </span>
            </div>
          ) : (
            posCart.map((item) => (
              <div key={item.cartItemId} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                <div className="flex-1 min-w-0 pr-2">
                  <h4 className="font-bold text-zinc-200 truncate">{item.productName}</h4>
                  <span className="text-[11px] text-zinc-500">₹{item.basePrice} each</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center border border-zinc-800 rounded-lg bg-zinc-950">
                    <button
                      onClick={() => updateQty(item.cartItemId, -1)}
                      className="px-2 py-1 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-l-lg cursor-pointer transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-condensed font-bold text-xs px-2 min-w-[20px] text-center text-zinc-200">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQty(item.cartItemId, 1)}
                      className="px-2 py-1 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-r-lg cursor-pointer transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <span className="font-condensed font-extrabold text-sm min-w-[44px] text-right text-red-400">
                    ₹{item.itemTotal}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Order Payment Footer */}
        <div className="p-3.5 sm:p-4 bg-zinc-950/80 border-t border-zinc-800 space-y-3">
          {/* Quick Payment Mode Buttons */}
          <div>
            <span className="block text-[10px] uppercase font-bold text-zinc-400 mb-1.5">
              Payment Method
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {(['Cash', 'UPI', 'Card'] as PaymentMethod[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setPaymentMethod(mode)}
                  className={`py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    paymentMethod === mode
                      ? 'bg-[#ED1C24] text-white border-red-500 font-black shadow-sm'
                      : 'bg-zinc-900 hover:bg-zinc-850 border-zinc-800 text-zinc-300'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Totals Breakdown */}
          <div className="space-y-1.5 text-xs text-zinc-400 border-t border-zinc-800 pt-3">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-zinc-200">₹{posSubtotal}</span>
            </div>
            {posDiscount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Discount</span>
                <span>-₹{posDiscount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>GST (5%)</span>
              <span className="font-semibold text-zinc-200">₹{posGst}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-zinc-100 pt-1">
              <span>Total Payable</span>
              <span className="font-condensed font-extrabold text-xl text-[#ED1C24]">
                ₹{posTotal}
              </span>
            </div>
          </div>

          {/* Place Order CTA */}
          <button
            disabled={posCart.length === 0}
            onClick={handlePlaceOrder}
            className="w-full py-3.5 px-4 bg-[#ED1C24] hover:bg-red-600 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed text-white font-condensed font-black text-base tracking-wider uppercase rounded-2xl flex items-center justify-between transition-all shadow-md shadow-red-950/40 cursor-pointer"
          >
            <span>Place Order ({orderType})</span>
            <div className="flex items-center gap-2">
              <span className="font-black">₹{posTotal}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </div>
          </button>
        </div>
      </div>

      {/* POS Order Success Dialog */}
      {lastCreatedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 bg-emerald-950/80 border border-emerald-800 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                ✓ Payment Received via {lastCreatedOrder.paymentMethod}
              </span>
              <h3 className="font-display font-black text-2xl text-zinc-100 mt-1">
                ORDER #{lastCreatedOrder.orderNumber} CREATED
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                {lastCreatedOrder.type === 'Dine-in'
                  ? `Dine-in • Table ${lastCreatedOrder.tableNumber}`
                  : 'Takeaway • Counter Order'}{' '}
                • Dispatched to Kitchen Display
              </p>
            </div>

            <div className="p-3.5 bg-zinc-950/70 border border-zinc-800 rounded-2xl text-xs space-y-1 text-left">
              <div className="flex justify-between">
                <span className="text-zinc-400">Amount:</span>
                <span className="font-bold text-red-400">₹{lastCreatedOrder.totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Txn ID:</span>
                <span className="font-mono text-zinc-300">{lastCreatedOrder.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Status:</span>
                <span className="font-bold text-red-400">NEW in Kitchen</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  setLastCreatedOrder(null);
                  setActiveView('KITCHEN');
                }}
                className="w-full py-3 bg-[#ED1C24] hover:bg-red-600 text-white font-condensed font-black text-sm tracking-wider uppercase rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-md shadow-red-950/50"
              >
                <ChefHat className="w-4 h-4" />
                <span>Switch to Kitchen Board</span>
              </button>

              <button
                onClick={() => {
                  setSelectedOrderForInvoice(lastCreatedOrder);
                  setLastCreatedOrder(null);
                  setActiveView('INVOICE');
                }}
                className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 font-condensed font-bold text-xs tracking-wider uppercase rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>View Digital Bill</span>
              </button>

              <button
                onClick={() => setLastCreatedOrder(null)}
                className="w-full text-xs text-zinc-400 hover:text-zinc-200 py-1 cursor-pointer transition-colors"
              >
                New POS Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
