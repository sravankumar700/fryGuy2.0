import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AdminSubTab, Order, OrderStatus, MenuItem } from '../types';
import { BrandLogo } from './BrandLogo';
import {
  LayoutDashboard,
  ShoppingBag,
  Store,
  ChefHat,
  Utensils,
  Plus,
  Layers,
  QrCode,
  Users,
  Tag,
  CreditCard,
  FileText,
  MessageSquare,
  BarChart3,
  UserCheck,
  Settings,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  TrendingUp,
  AlertCircle,
  X,
  Printer,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export const OwnerDashboard: React.FC = () => {
  const {
    adminSubTab,
    setAdminSubTab,
    orders,
    menuItems,
    toggleProductAvailability,
    addons,
    toggleAddonAvailability,
    combos,
    toggleComboAvailability,
    tables,
    customers,
    coupons,
    toggleCouponActive,
    notifications,
    updateOrderStatus,
    cancelOrder,
    setSelectedOrderForInvoice,
    setActiveView,
    activeTableNumber,
  } = useApp();

  const [orderFilter, setOrderFilter] = useState<string>('ALL');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  // Real-time calculated KPIs (Starting from prompt values: ₹18,757 and 125 orders)
  const currentOrdersSum = orders
    .filter((o) => o.paymentStatus === 'PAID')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  // Baseline 125 orders + new session orders
  const todayTotalSales = 18757 + (currentOrdersSum > 1200 ? currentOrdersSum - 1200 : 0);
  const todayOrdersCount = 125 + Math.max(0, orders.length - 4);
  const activeOrdersCount = orders.filter(
    (o) => o.status === 'NEW' || o.status === 'PREPARING' || o.status === 'READY',
  ).length;
  const averageOrderValue = Math.round(todayTotalSales / todayOrdersCount);

  // Sales by Source
  const qrOrders = orders.filter((o) => o.source === 'QR').length;
  const posOrders = orders.filter((o) => o.source === 'POS').length;
  const qrPercentage = Math.round((qrOrders / (qrOrders + posOrders || 1)) * 100);
  const posPercentage = 100 - qrPercentage;

  // Payment Mix
  const upiCount = orders.filter((o) => o.paymentMethod === 'UPI').length;
  const cashCount = orders.filter((o) => o.paymentMethod === 'Cash').length;
  const cardCount = orders.filter((o) => o.paymentMethod === 'Card').length;
  const totalPayCount = upiCount + cashCount + cardCount || 1;

  // Sidebar Menu Items
  const sidebarNav: { id: AdminSubTab; label: string; icon: any }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Live Orders', icon: ShoppingBag },
    { id: 'menu', label: 'Menu Catalog', icon: Utensils },
    { id: 'addons', label: 'Add-ons & Sides', icon: Plus },
    { id: 'combos', label: 'Combos & Feasts', icon: Layers },
    { id: 'tables', label: 'Tables & QR', icon: QrCode },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'coupons', label: 'Coupons & Promo', icon: Tag },
    { id: 'payments', label: 'Payments & Bills', icon: CreditCard },
    { id: 'notifications', label: 'SMS & WhatsApp', icon: MessageSquare },
    { id: 'reports', label: 'Sales Reports', icon: BarChart3 },
    { id: 'staff', label: 'Staff Roles', icon: UserCheck },
    { id: 'settings', label: 'Store Settings', icon: Settings },
  ];

  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'ALL') return true;
    return o.status === orderFilter;
  });

  return (
    <div className="min-h-[calc(100vh-80px)] flex bg-zinc-950 text-zinc-100">
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-56 lg:w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col shrink-0 hidden md:flex">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <BrandLogo size="sm" />
          <span className="text-[10px] font-condensed font-extrabold uppercase bg-[#ED1C24] text-white px-2 py-0.5 rounded shadow-sm">
            Admin
          </span>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {sidebarNav.map((item) => {
            const Icon = item.icon;
            const isActive = adminSubTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setAdminSubTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-zinc-800 text-red-400 font-bold border border-zinc-700 shadow-sm'
                    : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#ED1C24]' : 'text-zinc-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.id === 'orders' && activeOrdersCount > 0 && (
                  <span className="px-1.5 py-0.2 bg-[#ED1C24] text-white text-[10px] font-extrabold rounded-full">
                    {activeOrdersCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-zinc-800 text-[11px] text-zinc-500 bg-zinc-950/60">
          <span className="font-bold text-zinc-300 block">FRYGUY Flagship</span>
          <span>Logged in as owner@fryguys.demo</span>
        </div>
      </aside>

      {/* MAIN ADMIN CONTENT AREA */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-zinc-950">
        {/* Mobile Horizontal Sub-Tab Bar */}
        <div className="md:hidden flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 border-b border-zinc-800">
          {sidebarNav.map((item) => (
            <button
              key={item.id}
              onClick={() => setAdminSubTab(item.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                adminSubTab === item.id
                  ? 'bg-[#ED1C24] text-white'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-300'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* 1. DASHBOARD TAB */}
        {adminSubTab === 'dashboard' && (
          <div className="space-y-6 sm:space-y-8">
            {/* Header Greeting */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-condensed font-bold uppercase tracking-wider text-red-400">
                  Operational Analytics
                </span>
                <h1 className="font-display font-black text-2xl sm:text-3xl text-zinc-100">
                  Good Evening, Owner
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400">
                  FRYGUY Flagship Store • Real-time synchronized store performance
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setActiveView('KITCHEN')}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <ChefHat className="w-4 h-4 text-[#ED1C24]" />
                  <span>Open Kitchen Screen</span>
                </button>
                <button
                  onClick={() => setActiveView('POS')}
                  className="px-4 py-2 bg-[#ED1C24] hover:bg-red-600 text-white rounded-xl text-xs font-extrabold font-condensed tracking-wider uppercase flex items-center gap-2 cursor-pointer shadow-md shadow-red-950/40"
                >
                  <Store className="w-4 h-4" />
                  <span>Open Counter POS</span>
                </button>
              </div>
            </div>

            {/* KPI METRIC CARDS (Bento Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-zinc-900 p-5 rounded-3xl border border-zinc-800 shadow-xl space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Today's Sales
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="font-condensed font-black text-3xl sm:text-4xl text-zinc-100">
                    ₹{todayTotalSales.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-emerald-400 font-bold flex items-center">
                    <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +14.2%
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500">Live total across QR + POS channels</p>
              </div>

              <div className="bg-zinc-900 p-5 rounded-3xl border border-zinc-800 shadow-xl space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Total Orders
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="font-condensed font-black text-3xl sm:text-4xl text-zinc-100">
                    {todayOrdersCount}
                  </span>
                  <span className="text-xs text-zinc-500 font-semibold">Goal: 150</span>
                </div>
                <p className="text-[11px] text-zinc-500">Dine-in and takeaway tickets</p>
              </div>

              <div className="bg-zinc-900 p-5 rounded-3xl border border-zinc-800 shadow-xl space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Active Kitchen Orders
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="font-condensed font-black text-3xl sm:text-4xl text-red-500">
                    {activeOrdersCount}
                  </span>
                  <span className="text-xs font-bold text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded-lg">
                    In Process
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500">Under New, Preparing or Ready</p>
              </div>

              <div className="bg-zinc-900 p-5 rounded-3xl border border-zinc-800 shadow-xl space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Average Order Value
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="font-condensed font-black text-3xl sm:text-4xl text-zinc-100">
                    ₹{averageOrderValue}
                  </span>
                  <span className="text-xs text-emerald-400 font-bold">Stable</span>
                </div>
                <p className="text-[11px] text-zinc-500">Target benchmark: ₹140</p>
              </div>
            </div>

            {/* Middle Grid: Live Orders + Best Sellers */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Live Orders Feed */}
              <div className="lg:col-span-8 bg-zinc-900 rounded-3xl border border-zinc-800 p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                    <h2 className="font-display font-bold text-base text-zinc-100">
                      Live Orders Queue
                    </h2>
                  </div>
                  <button
                    onClick={() => setAdminSubTab('orders')}
                    className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                  >
                    View All Orders →
                  </button>
                </div>

                <div className="divide-y divide-zinc-800/80">
                  {orders.slice(0, 5).map((ord) => (
                    <div
                      key={ord.id}
                      className="py-3 first:pt-0 last:pb-0 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-display font-black text-sm text-zinc-100">
                          #{ord.orderNumber}
                        </span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-zinc-200">
                              {ord.type === 'Dine-in' ? `Table ${ord.tableNumber}` : 'Takeaway'}
                            </span>
                            <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.2 rounded font-bold">
                              {ord.source}
                            </span>
                          </div>
                          <span className="text-[11px] text-zinc-500">
                            {ord.items.length} items • ₹{ord.totalAmount} via {ord.paymentMethod}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-1 text-[11px] font-condensed font-bold uppercase rounded-full ${
                            ord.status === 'READY'
                              ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-400'
                              : ord.status === 'PREPARING'
                              ? 'bg-amber-950/80 border border-amber-800 text-amber-400'
                              : ord.status === 'COMPLETED'
                              ? 'bg-zinc-800 text-zinc-400'
                              : 'bg-red-950/80 border border-red-800 text-red-400'
                          }`}
                        >
                          {ord.status}
                        </span>

                        <button
                          onClick={() => setSelectedOrderDetails(ord)}
                          className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Best Sellers */}
              <div className="lg:col-span-4 bg-zinc-900 rounded-3xl border border-zinc-800 p-6 shadow-xl space-y-4">
                <h2 className="font-display font-bold text-base text-zinc-100 pb-3 border-b border-zinc-800">
                  Best Sellers Today
                </h2>

                <div className="space-y-3 text-xs">
                  {[
                    { name: 'Says Cheese', sales: 48, revenue: '₹6,672', cat: 'Burgers' },
                    { name: 'Original Crispy', sales: 36, revenue: '₹4,644', cat: 'Burgers' },
                    { name: 'FRYGUY Loaded Fries', sales: 52, revenue: '₹4,108', cat: 'Fries' },
                    { name: 'Korean Melt', sales: 29, revenue: '₹4,611', cat: 'Burgers' },
                  ].map((bs, i) => (
                    <div
                      key={bs.name}
                      className="flex items-center justify-between p-3 rounded-2xl bg-zinc-950/60 border border-zinc-800/80"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="font-condensed font-black text-sm text-red-400 w-4">
                          0{i + 1}
                        </span>
                        <div>
                          <span className="font-bold text-zinc-200">{bs.name}</span>
                          <span className="text-[10px] text-zinc-500 block">{bs.cat}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-condensed font-bold text-xs text-zinc-200 block">
                          {bs.sales} sold
                        </span>
                        <span className="text-[10px] text-emerald-400 font-medium">{bs.revenue}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Row: Sales by Source & Payment Mix Charts (Bento Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sales by Source (QR vs POS) */}
              <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-6 shadow-xl space-y-4">
                <h3 className="font-display font-bold text-sm text-zinc-200">
                  Sales by Channel Source
                </h3>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1 font-semibold text-zinc-300">
                      <span>Customer Table QR</span>
                      <span className="text-red-400">{qrPercentage}%</span>
                    </div>
                    <div className="h-3 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#ED1C24] rounded-full transition-all duration-500"
                        style={{ width: `${qrPercentage}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1 font-semibold text-zinc-300">
                      <span>Counter POS</span>
                      <span className="text-zinc-400">{posPercentage}%</span>
                    </div>
                    <div className="h-3 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-zinc-600 rounded-full transition-all duration-500"
                        style={{ width: `${posPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-zinc-500 pt-1">
                  Unified order engine connects both QR tables and counter terminals.
                </p>
              </div>

              {/* Payment Mix */}
              <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-6 shadow-xl space-y-4">
                <h3 className="font-display font-bold text-sm text-zinc-200">
                  Payment Method Breakdown
                </h3>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-zinc-950/60 border border-zinc-800/80 rounded-2xl">
                    <span className="text-xs text-zinc-400 block">UPI / QR</span>
                    <span className="font-condensed font-black text-xl text-red-400">
                      {Math.round((upiCount / totalPayCount) * 100)}%
                    </span>
                    <span className="text-[10px] text-zinc-500 block">{upiCount} orders</span>
                  </div>

                  <div className="p-3 bg-zinc-950/60 border border-zinc-800/80 rounded-2xl">
                    <span className="text-xs text-zinc-400 block">Cash</span>
                    <span className="font-condensed font-black text-xl text-zinc-200">
                      {Math.round((cashCount / totalPayCount) * 100)}%
                    </span>
                    <span className="text-[10px] text-zinc-500 block">{cashCount} orders</span>
                  </div>

                  <div className="p-3 bg-zinc-950/60 border border-zinc-800/80 rounded-2xl">
                    <span className="text-xs text-zinc-400 block">Card</span>
                    <span className="font-condensed font-black text-xl text-zinc-200">
                      {Math.round((cardCount / totalPayCount) * 100)}%
                    </span>
                    <span className="text-[10px] text-zinc-500 block">{cardCount} orders</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. ORDERS MANAGEMENT TAB */}
        {adminSubTab === 'orders' && (
          <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-6 shadow-xl space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-display font-black text-xl text-zinc-100">
                  All Restaurant Orders
                </h2>
                <p className="text-xs text-zinc-400">
                  Synchronized feed across QR and POS channels
                </p>
              </div>

              {/* Status Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                {['ALL', 'NEW', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderFilter(st)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                      orderFilter === st
                        ? 'bg-[#ED1C24] text-white shadow-sm'
                        : 'bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/50'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500 font-bold uppercase tracking-wider">
                    <th className="py-3 px-3">Order #</th>
                    <th className="py-3 px-3">Time</th>
                    <th className="py-3 px-3">Source & Type</th>
                    <th className="py-3 px-3">Customer</th>
                    <th className="py-3 px-3">Items</th>
                    <th className="py-3 px-3">Amount</th>
                    <th className="py-3 px-3">Payment</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-zinc-800/40 transition-colors">
                      <td className="py-3 px-3 font-display font-bold text-sm text-zinc-100">
                        #{ord.orderNumber}
                      </td>
                      <td className="py-3 px-3 text-zinc-500">{ord.createdAt}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-zinc-200">
                            {ord.type === 'Dine-in' ? `Table ${ord.tableNumber}` : 'Takeaway'}
                          </span>
                          <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1 py-0.2 rounded font-bold">
                            {ord.source}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-medium text-zinc-200">{ord.customerName}</span>
                        <span className="text-[11px] text-zinc-500 block">
                          +91 {ord.customerMobile}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-zinc-400">
                        {ord.items.map((i) => `${i.quantity}x ${i.productName}`).join(', ')}
                      </td>
                      <td className="py-3 px-3 font-condensed font-extrabold text-sm text-zinc-100">
                        ₹{ord.totalAmount}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-medium text-zinc-200">{ord.paymentMethod}</span>
                        <span className="text-[10px] text-emerald-400 font-bold block">
                          ✓ {ord.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-condensed font-extrabold uppercase rounded-full ${
                            ord.status === 'READY'
                              ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-400'
                              : ord.status === 'PREPARING'
                              ? 'bg-amber-950/80 border border-amber-800 text-amber-400'
                              : ord.status === 'COMPLETED'
                              ? 'bg-zinc-800 text-zinc-400'
                              : 'bg-red-950/80 border border-red-800 text-red-400'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => setSelectedOrderDetails(ord)}
                          className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-[11px] font-semibold text-zinc-200 cursor-pointer transition-colors"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. MENU CATALOG MANAGEMENT */}
        {adminSubTab === 'menu' && (
          <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-black text-xl text-zinc-100">Menu Management</h2>
                <p className="text-xs text-zinc-400">
                  Enable/disable availability or edit pricing in real-time
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl border border-zinc-800 bg-zinc-950/60 flex gap-3 items-center justify-between"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-xl shrink-0 border border-zinc-800"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs sm:text-sm text-zinc-200 truncate">
                      {item.name}
                    </h4>
                    <span className="text-[11px] text-zinc-500 block">{item.category}</span>
                    <span className="font-condensed font-extrabold text-sm text-red-400">
                      ₹{item.price}
                    </span>
                  </div>

                  {/* Availability Toggle Switch */}
                  <div className="flex flex-col items-end gap-1">
                    <button
                      onClick={() => toggleProductAvailability(item.id)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                        item.isAvailable
                          ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-400 hover:bg-emerald-900/60'
                          : 'bg-red-950/80 border border-red-800 text-red-400 hover:bg-red-900/60'
                      }`}
                    >
                      {item.isAvailable ? 'AVAILABLE' : 'SOLD OUT'}
                    </button>
                    <span className="text-[9px] text-zinc-500">
                      {item.isAvailable ? 'Customer active' : 'Hidden on cart'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. ADD-ONS & SIDES */}
        {adminSubTab === 'addons' && (
          <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-6 shadow-xl space-y-5">
            <div>
              <h2 className="font-display font-black text-xl text-zinc-100">Add-ons & Extras</h2>
              <p className="text-xs text-zinc-400">
                Manage modifiers and upgrade add-ons for burgers and snacks
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {addons.map((addon) => (
                <div
                  key={addon.id}
                  className="p-4 bg-zinc-950/60 border border-zinc-800 rounded-2xl flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-bold text-sm text-zinc-200">{addon.name}</h4>
                    <span className="font-condensed font-extrabold text-sm text-red-400">
                      +₹{addon.price}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleAddonAvailability(addon.id)}
                    className={`px-3 py-1 text-xs font-bold rounded-full cursor-pointer transition-colors ${
                      addon.isAvailable
                        ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-400'
                        : 'bg-red-950/80 border border-red-800 text-red-400'
                    }`}
                  >
                    {addon.isAvailable ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. COMBOS & FEASTS */}
        {adminSubTab === 'combos' && (
          <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-6 shadow-xl space-y-5">
            <div>
              <h2 className="font-display font-black text-xl text-zinc-100">Combos Management</h2>
              <p className="text-xs text-zinc-400">
                Special bundled meal boxes for high-value ordering
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {combos.map((combo) => (
                <div
                  key={combo.id}
                  className="p-4 bg-zinc-950/60 border border-zinc-800 rounded-2xl space-y-3"
                >
                  <img
                    src={combo.image}
                    alt={combo.name}
                    className="w-full h-32 object-cover rounded-xl border border-zinc-800"
                  />
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-zinc-200">{combo.name}</h4>
                      <p className="text-xs text-zinc-400 mt-0.5">{combo.description}</p>
                    </div>
                    <span className="font-condensed font-extrabold text-base text-red-400">
                      ₹{combo.price}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-zinc-800 flex justify-between items-center text-xs">
                    <span className="text-zinc-500">{combo.items.length} included items</span>
                    <button
                      onClick={() => toggleComboAvailability(combo.id)}
                      className={`px-3 py-1 font-bold rounded-full cursor-pointer transition-colors ${
                        combo.isAvailable
                          ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-400'
                          : 'bg-red-950/80 border border-red-800 text-red-400'
                      }`}
                    >
                      {combo.isAvailable ? 'Active' : 'Disabled'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. TABLES & QR */}
        {adminSubTab === 'tables' && (
          <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-black text-xl text-zinc-100">
                  Table & QR Station Management
                </h2>
                <p className="text-xs text-zinc-400">
                  All 20 restaurant dining tables with unique QR identities
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
              {tables.map((t) => (
                <div
                  key={t.id}
                  className="p-3.5 bg-zinc-950/60 border border-zinc-800 rounded-2xl text-center space-y-2.5"
                >
                  <div className="flex justify-between items-center text-[10px] text-zinc-500">
                    <span>Seats {t.capacity}</span>
                    <span
                      className={`font-bold px-1.5 py-0.2 rounded ${
                        t.status === 'OCCUPIED'
                          ? 'bg-amber-950/80 border border-amber-800 text-amber-400'
                          : 'bg-emerald-950/80 border border-emerald-800 text-emerald-400'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>

                  <span className="font-display font-black text-2xl text-zinc-100 block">
                    Table {t.number}
                  </span>

                  <button
                    onClick={() => {
                      alert(`Showing QR Tent Card for Table ${t.number}`);
                    }}
                    className="w-full py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-[11px] font-semibold text-zinc-200 rounded-xl cursor-pointer transition-colors"
                  >
                    View QR Card
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. CUSTOMERS DIRECTORY */}
        {adminSubTab === 'customers' && (
          <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-6 shadow-xl space-y-5">
            <div>
              <h2 className="font-display font-black text-xl text-zinc-100">Customer Profiles</h2>
              <p className="text-xs text-zinc-400">
                Mobile-first customer registry and order history
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500 font-bold uppercase tracking-wider">
                    <th className="py-3 px-3">Customer</th>
                    <th className="py-3 px-3">Mobile Number</th>
                    <th className="py-3 px-3">Total Orders</th>
                    <th className="py-3 px-3">Total Spent</th>
                    <th className="py-3 px-3">Last Order</th>
                    <th className="py-3 px-3">Favorite Item</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-zinc-800/40 transition-colors">
                      <td className="py-3 px-3 font-bold text-zinc-200">{c.name}</td>
                      <td className="py-3 px-3 font-mono text-zinc-400">+91 {c.mobile}</td>
                      <td className="py-3 px-3 font-semibold text-zinc-300">{c.ordersCount}</td>
                      <td className="py-3 px-3 font-condensed font-extrabold text-sm text-red-400">
                        ₹{c.totalSpent}
                      </td>
                      <td className="py-3 px-3 text-zinc-500">{c.lastOrderDate}</td>
                      <td className="py-3 px-3 text-zinc-300 font-medium">{c.favoriteItem}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 8. COUPONS & PROMOS */}
        {adminSubTab === 'coupons' && (
          <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-6 shadow-xl space-y-5">
            <div>
              <h2 className="font-display font-black text-xl text-zinc-100">Coupons & Discounts</h2>
              <p className="text-xs text-zinc-400">
                Changes here instantly affect customer checkout and POS validation
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {coupons.map((c) => (
                <div
                  key={c.code}
                  className="p-4 bg-zinc-950/60 border border-zinc-800 rounded-2xl flex items-start justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-red-400 bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700">
                        {c.code}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-400">
                        {c.discountType === 'FLAT' ? `₹${c.discountValue} OFF` : `${c.discountValue}% OFF`}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-zinc-200">{c.description}</p>
                    <p className="text-[11px] text-zinc-500">
                      Min Order: ₹{c.minOrder} • Redemptions: {c.usageCount}
                    </p>
                  </div>

                  <button
                    onClick={() => toggleCouponActive(c.code)}
                    className={`px-3 py-1 text-xs font-bold rounded-full cursor-pointer transition-colors ${
                      c.isActive
                        ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-400'
                        : 'bg-red-950/80 border border-red-800 text-red-400'
                    }`}
                  >
                    {c.isActive ? 'Active' : 'Disabled'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 9. PAYMENTS & INVOICES */}
        {adminSubTab === 'payments' && (
          <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-6 shadow-xl space-y-5">
            <div>
              <h2 className="font-display font-black text-xl text-zinc-100">
                Digital Invoices & Settlements
              </h2>
              <p className="text-xs text-zinc-400">
                100% paperless billing log with GST tax breakdown
              </p>
            </div>

            <div className="divide-y divide-zinc-800/60">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="py-3 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-mono font-bold text-zinc-200">INV-{ord.orderNumber}</span>
                    <p className="text-[11px] text-zinc-500">
                      Order #{ord.orderNumber} • {ord.createdAt} • +91 {ord.customerMobile}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-condensed font-extrabold text-sm text-zinc-100">
                      ₹{ord.totalAmount}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedOrderForInvoice(ord);
                        setActiveView('INVOICE');
                      }}
                      className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl font-semibold text-zinc-200 cursor-pointer transition-colors"
                    >
                      View Invoice
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 10. NOTIFICATIONS LOG */}
        {adminSubTab === 'notifications' && (
          <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-6 shadow-xl space-y-5">
            <div>
              <h2 className="font-display font-black text-xl text-zinc-100">
                Simulated Notification Outbox
              </h2>
              <p className="text-xs text-zinc-400">
                Audit log of all SMS & WhatsApp messages delivered to customers
              </p>
            </div>

            <div className="space-y-2">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className="p-3 rounded-2xl border border-zinc-800 bg-zinc-950/60 flex items-start justify-between text-xs gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                          notif.channel === 'WHATSAPP'
                            ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-400'
                            : 'bg-blue-950/80 border border-blue-800 text-blue-400'
                        }`}
                      >
                        {notif.channel}
                      </span>
                      <span className="font-mono text-zinc-400">+91 {notif.recipientMobile}</span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-zinc-500">{notif.timestamp}</span>
                    </div>
                    <p className="text-zinc-200 font-medium">{notif.message}</p>
                  </div>

                  <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded font-mono shrink-0">
                    Order #{notif.orderNumber}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 11. REPORTS */}
        {adminSubTab === 'reports' && (
          <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-6 shadow-xl space-y-5">
            <div>
              <h2 className="font-display font-black text-xl text-zinc-100">
                Sales & Operational Reports
              </h2>
              <p className="text-xs text-zinc-400">
                Daily summary report for FRYGUY restaurant management
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-zinc-950/60 border border-zinc-800 rounded-2xl space-y-1">
                <span className="text-zinc-500">Gross Sales</span>
                <span className="font-condensed font-black text-2xl text-zinc-100 block">
                  ₹{todayTotalSales}
                </span>
                <span className="text-[11px] text-emerald-400 font-semibold">
                  Includes 5% GST (₹{Math.round(todayTotalSales * 0.05)})
                </span>
              </div>

              <div className="p-4 bg-zinc-950/60 border border-zinc-800 rounded-2xl space-y-1">
                <span className="text-zinc-500">Total Food Items Sold</span>
                <span className="font-condensed font-black text-2xl text-zinc-100 block">
                  284 items
                </span>
                <span className="text-[11px] text-zinc-500">Avg 2.2 items / ticket</span>
              </div>

              <div className="p-4 bg-zinc-950/60 border border-zinc-800 rounded-2xl space-y-1">
                <span className="text-zinc-500">Avg Prep & Service Speed</span>
                <span className="font-condensed font-black text-2xl text-red-400 block">
                  11.4 mins
                </span>
                <span className="text-[11px] text-emerald-400 font-semibold">Under target 15 mins</span>
              </div>
            </div>
          </div>
        )}

        {/* 12. STAFF & ROLES */}
        {adminSubTab === 'staff' && (
          <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-6 shadow-xl space-y-5">
            <div>
              <h2 className="font-display font-black text-xl text-zinc-100">
                Staff Roles & Demo Access
              </h2>
              <p className="text-xs text-zinc-400">
                Strict two-role operational separation: Owner / Admin and Kitchen
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-5 bg-zinc-950/60 border-2 border-red-500/40 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-zinc-100">Role: OWNER / ADMIN</span>
                  <span className="bg-[#ED1C24] text-white px-2 py-0.5 rounded text-[10px] font-bold">
                    Full Access
                  </span>
                </div>
                <p className="text-zinc-400">
                  Full access to Dashboard, Menu, Combos, Pricing, QR Codes, Customers, Coupons, Revenue, and Reports.
                </p>
                <div className="p-2.5 bg-zinc-900 rounded-xl border border-zinc-800 font-mono text-[11px] text-zinc-300">
                  Demo Login: owner@fryguys.demo / demo123
                </div>
              </div>

              <div className="p-5 bg-zinc-950/60 border border-zinc-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-zinc-100">Role: KITCHEN DISPLAY</span>
                  <span className="bg-amber-950/80 border border-amber-800 text-amber-400 px-2 py-0.5 rounded text-[10px] font-bold">
                    Operational Only
                  </span>
                </div>
                <p className="text-zinc-400">
                  Restricted view: Only New, Preparing, Ready, Completed tickets. Blocked from revenue, reports, and admin settings.
                </p>
                <div className="p-2.5 bg-zinc-900 rounded-xl border border-zinc-800 font-mono text-[11px] text-zinc-300">
                  Demo Login: kitchen / demo123
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 13. SETTINGS */}
        {adminSubTab === 'settings' && (
          <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-6 shadow-xl space-y-5">
            <div>
              <h2 className="font-display font-black text-xl text-zinc-100">Store Configuration</h2>
              <p className="text-xs text-zinc-400">General store information and active parameters</p>
            </div>

            <div className="space-y-4 max-w-md text-xs">
              <div>
                <label className="block font-bold text-zinc-300 mb-1.5">Restaurant Brand Name</label>
                <input
                  type="text"
                  disabled
                  value="FRYGUY (fryguy2.o)"
                  className="w-full p-2.5 border border-zinc-800 rounded-xl bg-zinc-950 text-zinc-200 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-300 mb-1.5">UPI Merchant VPA</label>
                <input
                  type="text"
                  disabled
                  value="fryguy@okaxis"
                  className="w-full p-2.5 border border-zinc-800 rounded-xl bg-zinc-950 text-red-400 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-300 mb-1.5">Default Preparation Time</label>
                <input
                  type="text"
                  disabled
                  value="12 minutes"
                  className="w-full p-2.5 border border-zinc-800 rounded-xl bg-zinc-950 text-zinc-200"
                />
              </div>
            </div>
          </div>
        )}

        {/* Detailed Order Inspector Modal */}
        {selectedOrderDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div>
                  <span className="text-[10px] font-condensed font-bold uppercase text-red-400">
                    Order Details
                  </span>
                  <h3 className="font-display font-black text-2xl text-zinc-100">
                    #{selectedOrderDetails.orderNumber}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedOrderDetails(null)}
                  className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-zinc-950/60 rounded-2xl border border-zinc-800">
                  <span className="text-zinc-500">Type:</span>
                  <strong className="block text-zinc-200">
                    {selectedOrderDetails.type} • Table {selectedOrderDetails.tableNumber || 'N/A'}
                  </strong>
                </div>
                <div className="p-3 bg-zinc-950/60 rounded-2xl border border-zinc-800">
                  <span className="text-zinc-500">Channel:</span>
                  <strong className="block text-zinc-200">{selectedOrderDetails.source}</strong>
                </div>
                <div className="p-3 bg-zinc-950/60 rounded-2xl border border-zinc-800">
                  <span className="text-zinc-500">Customer:</span>
                  <strong className="block text-zinc-200">+91 {selectedOrderDetails.customerMobile}</strong>
                </div>
                <div className="p-3 bg-zinc-950/60 rounded-2xl border border-zinc-800">
                  <span className="text-zinc-500">Payment:</span>
                  <strong className="block text-zinc-200">
                    {selectedOrderDetails.paymentMethod} (₹{selectedOrderDetails.totalAmount})
                  </strong>
                </div>
              </div>

              {/* Items List */}
              <div className="border-t border-zinc-800 pt-3 space-y-2 text-xs">
                <span className="font-bold text-zinc-300">Items:</span>
                {selectedOrderDetails.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between p-3 bg-zinc-950/60 rounded-xl border border-zinc-800/80"
                  >
                    <div>
                      <span className="font-bold text-zinc-200">
                        {item.quantity}× {item.productName}
                      </span>
                      {item.selectedCheese && (
                        <p className="text-[10px] text-zinc-400">Cheese: {item.selectedCheese}</p>
                      )}
                      {item.selectedAddons.length > 0 && (
                        <p className="text-[10px] text-red-400">
                          +{item.selectedAddons.map((a) => a.name).join(', ')}
                        </p>
                      )}
                    </div>
                    <span className="font-bold text-zinc-100">₹{item.itemTotal}</span>
                  </div>
                ))}
              </div>

              {/* Advance Status Controls */}
              <div className="border-t border-zinc-800 pt-3 space-y-2">
                <span className="text-xs font-bold text-zinc-300">Change Order Status:</span>
                <div className="flex gap-2 text-xs font-bold">
                  {(['NEW', 'PREPARING', 'READY', 'COMPLETED'] as OrderStatus[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        updateOrderStatus(selectedOrderDetails.id, st);
                        setSelectedOrderDetails({ ...selectedOrderDetails, status: st });
                      }}
                      className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
                        selectedOrderDetails.status === st
                          ? 'bg-[#ED1C24] text-white font-black shadow-sm'
                          : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-zinc-800 pt-4 flex justify-end gap-2">
                <button
                  onClick={() => {
                    setSelectedOrderForInvoice(selectedOrderDetails);
                    setSelectedOrderDetails(null);
                    setActiveView('INVOICE');
                  }}
                  className="px-5 py-2.5 bg-[#ED1C24] hover:bg-red-600 text-white text-xs font-bold font-condensed tracking-wider uppercase rounded-xl cursor-pointer shadow-md shadow-red-950/40 transition-colors"
                >
                  View Digital Invoice
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
