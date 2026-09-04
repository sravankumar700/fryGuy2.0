import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Order, OrderStatus } from '../types';
import {
  ChefHat,
  Clock,
  CheckCircle2,
  AlertCircle,
  Play,
  Check,
  Volume2,
  VolumeX,
  RefreshCw,
  Eye,
  Filter,
} from 'lucide-react';

export const KitchenDisplay: React.FC = () => {
  const { orders, updateOrderStatus, setActiveView, setSelectedOrderForInvoice } = useApp();
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [filterType, setFilterType] = useState<'ALL' | 'DINE_IN' | 'TAKEAWAY'>('ALL');

  // Filter orders by status
  const filterOrders = (status: OrderStatus) => {
    return orders.filter((o) => {
      const matchStatus = o.status === status;
      const matchType =
        filterType === 'ALL' ||
        (filterType === 'DINE_IN' && o.type === 'Dine-in') ||
        (filterType === 'TAKEAWAY' && o.type === 'Takeaway');
      return matchStatus && matchType;
    });
  };

  const newOrders = filterOrders('NEW');
  const preparingOrders = filterOrders('PREPARING');
  const readyOrders = filterOrders('READY');
  const completedOrders = filterOrders('COMPLETED').slice(0, 8); // Show recent 8

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* High-Contrast Kitchen Operational Header */}
      <header className="bg-zinc-900 border-b border-zinc-800 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-[#ED1C24] p-2.5 rounded-2xl text-white shadow-md">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-black text-xl sm:text-2xl tracking-tight text-zinc-100">
                FRYGUY KITCHEN
              </h1>
              <span className="bg-red-600/20 text-red-400 border border-red-500/40 font-condensed font-extrabold text-xs px-2 py-0.5 rounded-lg uppercase">
                KDS LIVE
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Kitchen Display System • Station 1 (Fryer & Assembly)
            </p>
          </div>
        </div>

        {/* Operational Controls & Sound indicator */}
        <div className="flex items-center gap-3">
          {/* Quick Filter */}
          <div className="flex items-center bg-zinc-950/80 p-1 rounded-2xl border border-zinc-800 text-xs">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                filterType === 'ALL'
                  ? 'bg-[#ED1C24] text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              All Orders ({orders.filter((o) => o.status !== 'CANCELLED').length})
            </button>
            <button
              onClick={() => setFilterType('DINE_IN')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                filterType === 'DINE_IN'
                  ? 'bg-[#ED1C24] text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Dine-in
            </button>
            <button
              onClick={() => setFilterType('TAKEAWAY')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                filterType === 'TAKEAWAY'
                  ? 'bg-[#ED1C24] text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Takeaway
            </button>
          </div>

          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className="p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-zinc-300 transition-colors cursor-pointer"
            title={audioEnabled ? 'Kitchen Order Chime Enabled' : 'Muted'}
          >
            {audioEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-zinc-500" />
            )}
          </button>
        </div>
      </header>

      {/* Main 4-Column Board with Local Horizontal Scroll for Tablets/Mobile */}
      <main className="flex-1 p-4 sm:p-6 overflow-x-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 min-w-[300px] xl:min-w-[1200px]">
          {/* 1. NEW ORDERS */}
          <div className="flex flex-col bg-zinc-900 rounded-3xl border border-zinc-800 shadow-xl overflow-hidden">
            <div className="p-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ED1C24] animate-pulse" />
                <h2 className="font-display font-extrabold text-base tracking-wide text-zinc-100 uppercase">
                  1. New Orders
                </h2>
              </div>
              <span className="bg-[#ED1C24] text-white font-condensed font-black px-2.5 py-0.5 rounded-lg text-xs">
                {newOrders.length}
              </span>
            </div>

            <div className="p-3.5 space-y-3.5 flex-1 overflow-y-auto max-h-[75vh]">
              {newOrders.length === 0 ? (
                <div className="py-12 text-center text-zinc-500 text-xs">
                  No new incoming orders right now
                </div>
              ) : (
                newOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-zinc-950/70 rounded-2xl border-2 border-red-500/40 p-4 shadow-md space-y-3"
                  >
                    {/* Card Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-display font-black text-2xl text-zinc-100">
                          #{order.orderNumber}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="bg-zinc-800 text-zinc-300 text-xs font-condensed font-bold px-2 py-0.5 rounded-md">
                            {order.source}
                          </span>
                          <span className="text-sm font-bold text-red-400">
                            {order.type === 'Dine-in'
                              ? `TABLE ${order.tableNumber}`
                              : 'TAKEAWAY COUNTER'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-lg">
                        <Clock className="w-3 h-3 text-zinc-500" />
                        <span>{order.createdAt}</span>
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="divide-y divide-zinc-800/70 py-1 text-sm">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="py-2 first:pt-0 last:pb-0">
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-bold text-zinc-200">
                              <span className="text-red-400 font-condensed text-base mr-1.5">
                                {item.quantity}×
                              </span>
                              {item.productName}
                            </span>
                          </div>
                          {(item.selectedCheese || item.selectedPatty || item.selectedSauce) && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {[item.selectedCheese, item.selectedPatty, item.selectedSauce]
                                .filter(Boolean)
                                .map((mod, mi) => (
                                   <span
                                    key={mi}
                                    className="text-[10px] bg-zinc-800 text-red-300 font-semibold px-2 py-0.5 rounded-md"
                                  >
                                    {mod}
                                  </span>
                                ))}
                            </div>
                          )}
                          {item.selectedAddons.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {item.selectedAddons.map((ad) => (
                                <span
                                  key={ad.id}
                                  className="text-[10px] bg-red-950/60 text-red-300 border border-red-900/40 font-semibold px-2 py-0.5 rounded-md"
                                >
                                  +{ad.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Big Action Button */}
                    <button
                      onClick={() => updateOrderStatus(order.id, 'PREPARING')}
                      className="w-full py-3 bg-[#ED1C24] hover:bg-red-600 active:scale-98 text-white font-condensed font-black text-sm tracking-wider uppercase rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-red-950/50"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>Start Preparing</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 2. PREPARING ORDERS */}
          <div className="flex flex-col bg-zinc-900 rounded-3xl border border-zinc-800 shadow-xl overflow-hidden">
            <div className="p-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                <h2 className="font-display font-extrabold text-base tracking-wide text-zinc-100 uppercase">
                  2. Preparing
                </h2>
              </div>
              <span className="bg-amber-500 text-zinc-950 font-condensed font-black px-2.5 py-0.5 rounded-lg text-xs">
                {preparingOrders.length}
              </span>
            </div>

            <div className="p-3.5 space-y-3.5 flex-1 overflow-y-auto max-h-[75vh]">
              {preparingOrders.length === 0 ? (
                <div className="py-12 text-center text-zinc-500 text-xs">
                  No orders currently in fryer / prep
                </div>
              ) : (
                preparingOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-zinc-950/70 rounded-2xl border border-amber-500/40 p-4 shadow-md space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-display font-black text-2xl text-zinc-100">
                          #{order.orderNumber}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="bg-zinc-800 text-zinc-300 text-xs font-condensed font-bold px-2 py-0.5 rounded-md">
                            {order.source}
                          </span>
                          <span className="text-sm font-bold text-amber-400">
                            {order.type === 'Dine-in'
                              ? `TABLE ${order.tableNumber}`
                              : 'TAKEAWAY COUNTER'}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs bg-amber-950/80 border border-amber-800 text-amber-300 font-bold px-2.5 py-1 rounded-lg">
                        Frying
                      </span>
                    </div>

                    {/* Items */}
                    <div className="divide-y divide-zinc-800/70 py-1 text-sm">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="py-1.5 first:pt-0 last:pb-0">
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-bold text-zinc-200">
                              <span className="text-amber-400 font-condensed text-base mr-1.5">
                                {item.quantity}×
                              </span>
                              {item.productName}
                            </span>
                          </div>
                          {(item.selectedCheese || item.selectedPatty || item.selectedSauce) && (
                            <div className="mt-0.5 flex flex-wrap gap-1">
                              {[item.selectedCheese, item.selectedPatty, item.selectedSauce]
                                .filter(Boolean)
                                .map((mod, mi) => (
                                  <span
                                    key={mi}
                                    className="text-[10px] bg-zinc-800 text-amber-200 px-2 py-0.5 rounded-md"
                                  >
                                    {mod}
                                  </span>
                                ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => updateOrderStatus(order.id, 'READY')}
                      className="w-full py-3 bg-amber-500 hover:bg-amber-400 active:scale-98 text-zinc-950 font-condensed font-black text-sm tracking-wider uppercase rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Mark Ready</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 3. READY ORDERS */}
          <div className="flex flex-col bg-zinc-900 rounded-3xl border border-zinc-800 shadow-xl overflow-hidden">
            <div className="p-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <h2 className="font-display font-extrabold text-base tracking-wide text-zinc-100 uppercase">
                  3. Ready to Serve
                </h2>
              </div>
              <span className="bg-emerald-500 text-zinc-950 font-condensed font-black px-2.5 py-0.5 rounded-lg text-xs">
                {readyOrders.length}
              </span>
            </div>

            <div className="p-3.5 space-y-3.5 flex-1 overflow-y-auto max-h-[75vh]">
              {readyOrders.length === 0 ? (
                <div className="py-12 text-center text-zinc-500 text-xs">
                  No orders waiting for pickup
                </div>
              ) : (
                readyOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-zinc-950/70 rounded-2xl border border-emerald-500/50 p-4 shadow-md space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-display font-black text-2xl text-zinc-100">
                          #{order.orderNumber}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-bold text-emerald-400">
                            {order.type === 'Dine-in'
                              ? `SERVE TO TABLE ${order.tableNumber}`
                              : 'COUNTER HANDOFF'}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs bg-emerald-950/80 border border-emerald-800 text-emerald-300 font-bold px-2.5 py-1 rounded-lg">
                        Hot & Packed
                      </span>
                    </div>

                    <div className="text-xs text-zinc-400">
                      <span>Total items: </span>
                      <strong className="text-zinc-200">
                        {order.items.reduce((s, i) => s + i.quantity, 0)} items
                      </strong>
                    </div>

                    {/* Complete Action */}
                    <button
                      onClick={() => updateOrderStatus(order.id, 'COMPLETED')}
                      className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 active:scale-98 text-zinc-950 font-condensed font-black text-sm tracking-wider uppercase rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Complete & Dispatch</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 4. RECENTLY COMPLETED ORDERS */}
          <div className="flex flex-col bg-zinc-900/70 rounded-3xl border border-zinc-800/80 shadow-xl overflow-hidden opacity-90">
            <div className="p-4 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between">
              <h2 className="font-display font-extrabold text-base tracking-wide text-zinc-400 uppercase">
                4. Completed
              </h2>
              <span className="bg-zinc-800 text-zinc-300 font-condensed font-bold px-2.5 py-0.5 rounded-lg text-xs">
                Recent {completedOrders.length}
              </span>
            </div>

            <div className="p-3.5 space-y-2.5 flex-1 overflow-y-auto max-h-[75vh]">
              {completedOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-3 bg-zinc-950/60 rounded-2xl border border-zinc-800/80 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-display font-bold text-sm text-zinc-300">
                      #{order.orderNumber}
                    </span>
                    <p className="text-[11px] text-zinc-500">
                      {order.type === 'Dine-in' ? `Table ${order.tableNumber}` : 'Takeaway'} •{' '}
                      {order.items.length} items
                    </p>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded-md">
                    Delivered
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
