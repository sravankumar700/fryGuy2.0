import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  RotateCcw,
  ChefHat,
  LayoutDashboard,
  Store,
  Smartphone,
  MessageSquare,
  QrCode,
  FileText,
  Activity,
  Layers,
} from 'lucide-react';

interface DemoBarProps {
  onOpenNotifications: () => void;
  onOpenTables?: () => void;
  onOpenTableModal?: () => void;
  onOpenInvoice?: () => void;
}

export const DemoBar: React.FC<DemoBarProps> = ({
  onOpenNotifications,
  onOpenTables,
  onOpenTableModal,
  onOpenInvoice,
}) => {
  const handleOpenTables = onOpenTables || onOpenTableModal || (() => {});
  const {
    activeView,
    setActiveView,
    activeTableNumber,
    currentOrder,
    orders,
    notifications,
    resetDemo,
    userRole,
    setUserRole,
  } = useApp();

  const [confirmReset, setConfirmReset] = useState(false);

  // Count active kitchen orders
  const activeKitchenOrdersCount = orders.filter(
    (o) => o.status === 'NEW' || o.status === 'PREPARING' || o.status === 'READY',
  ).length;

  const handleReset = () => {
    resetDemo();
    setConfirmReset(false);
  };

  return (
    <aside aria-label="Demo Controls" className="sticky top-0 z-50 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800 text-zinc-300 text-xs shadow-lg">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2">
        {/* Left: Brand context badge & Quick Workflow Switchers */}
        <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded-xl">
            <span className="font-display font-black text-xs text-[#ED1C24] uppercase tracking-wider">FRYGUY</span>
            <span className="text-[10px] font-condensed font-bold bg-[#ED1C24] text-white px-1.5 py-0.2 rounded">2.0</span>
          </div>

          <div className="flex items-center bg-zinc-900/90 p-1 rounded-xl border border-zinc-800 gap-1">
            <button
              onClick={() => {
                setActiveView('CUSTOMER');
                setUserRole('CUSTOMER');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all font-medium ${
                activeView === 'CUSTOMER'
                  ? 'bg-[#ED1C24] text-white font-semibold shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Customer (Table {activeTableNumber})</span>
            </button>

            <button
              onClick={() => {
                setActiveView('POS');
                setUserRole('OWNER');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all font-medium ${
                activeView === 'POS'
                  ? 'bg-[#ED1C24] text-white font-semibold shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Counter POS</span>
            </button>

            <button
              onClick={() => {
                setActiveView('KITCHEN');
                setUserRole('KITCHEN');
              }}
              className={`relative flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all font-medium ${
                activeView === 'KITCHEN'
                  ? 'bg-[#ED1C24] text-white font-semibold shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80'
              }`}
            >
              <ChefHat className="w-3.5 h-3.5" />
              <span>Kitchen KDS</span>
              {activeKitchenOrdersCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold bg-[#ED1C24] text-white rounded-full">
                  {activeKitchenOrdersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setActiveView('ADMIN');
                setUserRole('OWNER');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all font-medium ${
                activeView === 'ADMIN'
                  ? 'bg-[#ED1C24] text-white font-semibold shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Owner Dashboard</span>
            </button>
          </div>
        </div>

        {/* Right: Quick Tools, Live Order Tracker shortcut, Notifications, Reset */}
        <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
          {currentOrder && (
            <button
              onClick={() => setActiveView('ORDER_TRACKING')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border font-medium transition-all ${
                activeView === 'ORDER_TRACKING'
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                  : 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60 hover:bg-emerald-900/80 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
              <span>Order #{currentOrder.orderNumber} ({currentOrder.status})</span>
            </button>
          )}

          {onOpenInvoice && (
            <button
              onClick={onOpenInvoice}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-xl text-zinc-300 hover:text-white transition-colors cursor-pointer"
              title="View Digital Invoice"
            >
              <FileText className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden sm:inline">Bill / Invoice</span>
            </button>
          )}

          <button
            onClick={handleOpenTables}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-xl text-zinc-300 hover:text-white transition-colors cursor-pointer"
            title="Switch or view Table QR codes"
          >
            <QrCode className="w-3.5 h-3.5 text-red-500" />
            <span className="hidden sm:inline">Tables & QR</span>
          </button>

          <button
            onClick={onOpenNotifications}
            className="relative flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-xl text-zinc-300 hover:text-white transition-colors cursor-pointer"
            title="Simulated WhatsApp & SMS Alerts"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">WhatsApp/SMS</span>
            {notifications.length > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 text-[10px] font-bold bg-red-600 text-white rounded-full">
                {notifications.length}
              </span>
            )}
          </button>

          {/* Reset Demo Button */}
          {confirmReset ? (
            <div className="flex items-center gap-1 bg-red-950 p-1 rounded-xl border border-red-700">
              <span className="text-[11px] font-semibold px-1 text-red-200">Reset?</span>
              <button
                onClick={handleReset}
                className="px-2 py-0.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg"
              >
                Yes
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="px-2 py-0.5 text-zinc-300 hover:text-white rounded-lg"
              >
                No
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmReset(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer"
              title="Reset all orders and state back to fresh demo"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
