import React from 'react';
import { useApp } from '../context/AppContext';
import { BrandLogo } from './BrandLogo';
import {
  CheckCircle2,
  Clock,
  ChefHat,
  Bell,
  FileText,
  ArrowLeft,
  ShoppingBag,
  ExternalLink,
  Store,
} from 'lucide-react';

export const OrderTrackingView: React.FC = () => {
  const { currentOrder, orders, setActiveView, setSelectedOrderForInvoice, activeTableNumber } =
    useApp();

  // Find latest order if none specifically selected
  const order = currentOrder || orders[0];

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-xl">
          <div className="w-16 h-16 bg-zinc-950 border border-zinc-800 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8" />
          </div>
          <h2 className="font-display font-bold text-2xl text-zinc-100 mb-2">No Active Order</h2>
          <p className="text-xs text-zinc-400 mb-6">
            You have not placed an order yet in this session.
          </p>
          <button
            onClick={() => setActiveView('CUSTOMER')}
            className="px-6 py-2.5 bg-[#ED1C24] hover:bg-red-600 text-white font-condensed font-black text-sm tracking-wider uppercase rounded-xl transition-all shadow-md shadow-red-950/40 cursor-pointer"
          >
            Return to Menu
          </button>
        </div>
      </div>
    );
  }

  // Determine active step index:
  // 0: Placed & Confirmed
  // 1: Preparing
  // 2: Ready
  // 3: Completed
  let activeStep = 0;
  if (order.status === 'NEW') activeStep = 0;
  if (order.status === 'PREPARING') activeStep = 1;
  if (order.status === 'READY') activeStep = 2;
  if (order.status === 'COMPLETED') activeStep = 3;

  const steps = [
    {
      id: 'PLACED',
      title: 'Order Placed & Paid',
      desc: 'Received by restaurant • UPI Verified',
      time: order.statusTimestamps.placed || 'Just now',
    },
    {
      id: 'PREPARING',
      title: 'Preparing in Kitchen',
      desc: 'Chef is frying your chicken & assembling fresh',
      time: order.statusTimestamps.preparing || 'Estimated 10 mins',
    },
    {
      id: 'READY',
      title: 'Order Ready',
      desc:
        order.type === 'Dine-in'
          ? `Being served to Table ${order.tableNumber || activeTableNumber}`
          : 'Ready for counter collection',
      time: order.statusTimestamps.ready || 'Pending',
    },
    {
      id: 'COMPLETED',
      title: 'Order Completed',
      desc: 'Delivered & enjoyed! Digital bill generated',
      time: order.statusTimestamps.completed || 'Pending',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Back button */}
      <button
        onClick={() => setActiveView('CUSTOMER')}
        className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-red-400 mb-6 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Customer Menu</span>
      </button>

      {/* Main Tracking Card */}
      <div className="bg-zinc-900 rounded-3xl border border-zinc-800 shadow-xl overflow-hidden">
        {/* Header with FRYGUY Brand & Order Status */}
        <div className="p-6 bg-zinc-900/90 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <BrandLogo size="md" variant="compact" />
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="font-display font-black text-2xl sm:text-3xl text-zinc-100">
                  ORDER #{order.orderNumber}
                </h1>
                <span
                  className={`px-3 py-1 text-xs font-condensed font-extrabold uppercase rounded-lg border ${
                    order.status === 'READY'
                      ? 'bg-emerald-950/80 border-emerald-700 text-emerald-400 animate-pulse'
                      : order.status === 'PREPARING'
                      ? 'bg-amber-950/80 border-amber-700 text-amber-400'
                      : order.status === 'COMPLETED'
                      ? 'bg-zinc-800 border-zinc-700 text-zinc-300'
                      : 'bg-red-600/20 border-red-500/40 text-red-400'
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                {order.type === 'Dine-in' ? `Dine-in • Table ${order.tableNumber || activeTableNumber}` : 'Takeaway • Counter Pickup'}{' '}
                • Placed {order.createdAt}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedOrderForInvoice(order);
                setActiveView('INVOICE');
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs font-bold text-zinc-200 transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4 text-red-400" />
              <span>Digital Invoice</span>
            </button>
          </div>
        </div>

        {/* Live Kitchen Notice Banner */}
        <div className="px-6 py-3 bg-zinc-950/60 border-b border-zinc-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5 text-zinc-300 font-medium">
            <ChefHat className="w-4 h-4 text-[#ED1C24]" />
            <span>
              {order.status === 'NEW' && 'Order sent directly to Kitchen Display. Waiting for kitchen queue.'}
              {order.status === 'PREPARING' && 'Kitchen is actively preparing your items fresh to order.'}
              {order.status === 'READY' && 'HOT & CRISPY! Your order is ready for pickup or table service.'}
              {order.status === 'COMPLETED' && 'Order has been fulfilled. Thank you for dining with FRYGUY!'}
            </span>
          </div>

          <button
            onClick={() => setActiveView('KITCHEN')}
            className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1.5 cursor-pointer ml-3 shrink-0"
          >
            <span>Kitchen Board</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4-Step Visual Timeline */}
        <div className="p-6 sm:p-8">
          <div className="relative">
            {/* Connecting Vertical Track */}
            <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-zinc-800" />

            <div className="space-y-6">
              {steps.map((step, idx) => {
                const isCompleted = idx <= activeStep;
                const isCurrent = idx === activeStep;

                return (
                  <div key={step.id} className="relative flex items-start gap-4">
                    {/* Step Icon Indicator */}
                    <div
                      className={`relative z-10 w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs transition-all ${
                        isCompleted
                          ? 'bg-emerald-500 text-zinc-950 shadow-md'
                          : isCurrent
                          ? 'bg-[#ED1C24] text-white ring-4 ring-red-500/20 shadow-md'
                          : 'bg-zinc-950 border-2 border-zinc-800 text-zinc-500'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                      ) : (
                        <span className="font-condensed font-bold text-sm">{idx + 1}</span>
                      )}
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-center justify-between gap-2">
                        <h4
                          className={`font-display font-bold text-base ${
                            isCurrent
                              ? 'text-red-400'
                              : isCompleted
                              ? 'text-zinc-100'
                              : 'text-zinc-500'
                          }`}
                        >
                          {step.title}
                        </h4>
                        <span className="text-xs text-zinc-400 font-medium">{step.time}</span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Items Breakdown */}
        <div className="p-6 bg-zinc-950/50 border-t border-zinc-800">
          <h3 className="font-display font-bold text-sm text-zinc-100 mb-3 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#ED1C24]" />
            <span>Items in this Order ({order.items.length})</span>
          </h3>

          <div className="space-y-2.5">
            {order.items.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-xs p-3 bg-zinc-900 rounded-2xl border border-zinc-800"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-condensed font-extrabold text-white bg-[#ED1C24] px-2 py-0.5 rounded-md">
                    {item.quantity}×
                  </span>
                  <div>
                    <span className="font-bold text-zinc-200">{item.productName}</span>
                    {(item.selectedCheese || item.selectedPatty || item.selectedSauce) && (
                      <p className="text-[11px] text-zinc-400">
                        {[item.selectedCheese, item.selectedPatty, item.selectedSauce]
                          .filter(Boolean)
                          .join(', ')}
                      </p>
                    )}
                    {item.selectedAddons.length > 0 && (
                      <p className="text-[10px] text-red-300">
                        +{item.selectedAddons.map((a) => a.name).join(', ')}
                      </p>
                    )}
                  </div>
                </div>

                <span className="font-condensed font-bold text-sm text-red-400">
                  ₹{item.itemTotal}
                </span>
              </div>
            ))}
          </div>

          {/* Payment Summary Footer */}
          <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
            <div className="text-zinc-400">
              <span>Payment Mode: </span>
              <strong className="text-zinc-200">{order.paymentMethod}</strong>
              <span className="ml-2 font-mono text-[11px] bg-zinc-900 border border-zinc-800 text-zinc-300 px-2 py-0.5 rounded-md">
                {order.transactionId}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-zinc-400">Total Paid:</span>
              <span className="font-condensed font-extrabold text-xl text-[#ED1C24]">
                ₹{order.totalAmount}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
