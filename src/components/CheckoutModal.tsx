import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PaymentMethod, Order } from '../types';
import {
  X,
  QrCode,
  Smartphone,
  CreditCard,
  Banknote,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Clock,
  FileText,
  ChevronRight,
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderSuccess,
}) => {
  const {
    activeTableNumber,
    cartTotal,
    cartSubtotal,
    discountAmount,
    gstAmount,
    appliedCoupon,
    placeCustomerOrder,
    simulatePaymentFailure,
    setSimulatePaymentFailure,
    setActiveView,
    setSelectedOrderForInvoice,
  } = useApp();

  const [mobile, setMobile] = useState('9876543210');
  const [name, setName] = useState('Rahul Sharma');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [mobileError, setMobileError] = useState<string | null>(null);

  // States: 'FORM' | 'PROCESSING' | 'FAILED' | 'CONFIRMED'
  const [paymentState, setPaymentState] = useState<'FORM' | 'PROCESSING' | 'FAILED' | 'CONFIRMED'>('FORM');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const handlePay = async () => {
    // Basic mobile validation
    const cleanedMobile = mobile.replace(/\D/g, '');
    if (cleanedMobile.length < 10) {
      setMobileError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setMobileError(null);
    setPaymentState('PROCESSING');

    // Simulate payment gateway delay (1.4s)
    setTimeout(async () => {
      if (simulatePaymentFailure) {
        setPaymentState('FAILED');
      } else {
        try {
          const order = await placeCustomerOrder(cleanedMobile, paymentMethod, name);
          setConfirmedOrder(order);
          setPaymentState('CONFIRMED');
          onOrderSuccess(order);
        } catch {
          setPaymentState('FAILED');
        }
      }
    }, 1400);
  };

  const handleRetry = () => {
    // Disable failure toggle for the retry so it succeeds smoothly
    setSimulatePaymentFailure(false);
    setPaymentState('FORM');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-800 text-zinc-100 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 bg-zinc-900/90 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-condensed font-extrabold uppercase tracking-wider text-[#ED1C24]">
              FRYGUY Table Ordering
            </span>
            <h2 className="font-display font-bold text-lg text-zinc-100">
              {paymentState === 'CONFIRMED' ? 'Order Confirmed' : 'Checkout & Payment'}
            </h2>
          </div>
          {paymentState !== 'PROCESSING' && (
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {paymentState === 'FORM' && (
            <>
              {/* Order Context Banner */}
              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-[#ED1C24] text-white flex items-center justify-center font-bold font-condensed text-xs shadow-sm">
                    {activeTableNumber}
                  </div>
                  <div>
                    <span className="font-bold text-zinc-100">Dine-In Table {activeTableNumber}</span>
                    <p className="text-[11px] text-zinc-400">Live order sent to Kitchen upon payment</p>
                  </div>
                </div>
                <span className="font-condensed font-extrabold text-base text-[#ED1C24]">
                  ₹{cartTotal}
                </span>
              </div>

              {/* Customer Contact Details */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-200">
                  Customer Contact (For Live Order Tracking)
                </label>

                <div>
                  <div className="flex items-center border border-zinc-800 rounded-xl overflow-hidden focus-within:border-red-500 bg-zinc-950">
                    <span className="px-3 py-2 bg-zinc-900 text-xs text-zinc-400 border-r border-zinc-800 font-semibold">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={mobile}
                      maxLength={10}
                      onChange={(e) => {
                        setMobile(e.target.value);
                        setMobileError(null);
                      }}
                      placeholder="Enter 10-digit mobile number"
                      className="flex-1 px-3 py-2 text-xs text-zinc-100 focus:outline-hidden font-medium bg-transparent"
                    />
                  </div>
                  {mobileError && (
                    <p className="text-[11px] text-red-400 mt-1 font-medium">{mobileError}</p>
                  )}
                  <p className="text-[10px] text-zinc-500 mt-1">
                    Order confirmation & live updates sent via simulated WhatsApp & SMS.
                  </p>
                </div>

                <div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Guest Name (Optional)"
                    className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-xl focus:outline-hidden focus:border-red-500 placeholder:text-zinc-500 transition-colors"
                  />
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-200">
                  Select Payment Method
                </label>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'UPI'
                        ? 'border-red-500 bg-red-600/15 text-red-400 font-bold shadow-xs'
                        : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700 text-zinc-300'
                    }`}
                  >
                    <Smartphone className="w-5 h-5" />
                    <span className="text-xs">UPI (QR / App)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Card')}
                    className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'Card'
                        ? 'border-red-500 bg-red-600/15 text-red-400 font-bold shadow-xs'
                        : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700 text-zinc-300'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span className="text-xs">Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Cash')}
                    className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'Cash'
                        ? 'border-red-500 bg-red-600/15 text-red-400 font-bold shadow-xs'
                        : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700 text-zinc-300'
                    }`}
                  >
                    <Banknote className="w-5 h-5" />
                    <span className="text-xs">Counter Cash</span>
                  </button>
                </div>

                {/* UPI Simulation Details */}
                {paymentMethod === 'UPI' && (
                  <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2 mt-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-zinc-300">UPI ID: fryguy@okaxis</span>
                      <span className="text-[10px] bg-emerald-950 border border-emerald-800 text-emerald-400 font-bold px-2 py-0.5 rounded-lg">
                        Instant Auto-Verify
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-3 py-1">
                      <span className="text-[11px] font-bold text-zinc-400">GPay</span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-[11px] font-bold text-zinc-400">PhonePe</span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-[11px] font-bold text-zinc-400">Paytm</span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-[11px] font-bold text-zinc-400">Any UPI App</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Demo Failure Toggle for Presentation */}
              <div className="pt-2">
                <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <span className="font-bold text-zinc-200">Demo Failure Switch</span>
                      <p className="text-[10px] text-zinc-400">
                        Test Section 26 payment failure & recovery workflow
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={simulatePaymentFailure}
                    onChange={(e) => setSimulatePaymentFailure(e.target.checked)}
                    className="w-4 h-4 accent-red-600 cursor-pointer"
                  />
                </div>
              </div>

              {/* Bill Breakdown */}
              <div className="border-t border-zinc-800 pt-3 space-y-1.5 text-xs text-zinc-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-zinc-200 font-semibold">₹{cartSubtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-medium">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Simulated GST (5%)</span>
                  <span className="text-zinc-200 font-semibold">₹{gstAmount}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-zinc-100 pt-2 border-t border-zinc-800">
                  <span>Total Amount</span>
                  <span className="font-condensed font-extrabold text-lg text-[#ED1C24]">
                    ₹{cartTotal}
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Processing State */}
          {paymentState === 'PROCESSING' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-12 h-12 border-4 border-red-600/20 border-t-[#ED1C24] rounded-full animate-spin" />
              <div>
                <h3 className="font-display font-bold text-lg text-zinc-100">
                  Processing payment...
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Connecting to demo gateway for ₹{cartTotal} via {paymentMethod}
                </p>
              </div>
            </div>
          )}

          {/* Payment Failed State (Section 26) */}
          {paymentState === 'FAILED' && (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-14 h-14 bg-red-950/80 border border-red-800 text-red-400 rounded-2xl flex items-center justify-center">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-display font-bold text-xl text-red-400">
                  Payment Failed
                </h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-xs">
                  Your payment could not be completed. (Demo failure simulation triggered)
                </p>
              </div>

              <div className="w-full pt-4">
                <button
                  onClick={handleRetry}
                  className="w-full py-3 px-4 bg-[#ED1C24] hover:bg-red-600 text-white font-condensed font-black text-sm tracking-wider uppercase rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-red-950/50 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Try Again</span>
                </button>
              </div>
            </div>
          )}

          {/* Order Confirmed State (Section 27) */}
          {paymentState === 'CONFIRMED' && confirmedOrder && (
            <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-950/80 border border-emerald-800 text-emerald-400 rounded-2xl flex items-center justify-center shadow-md">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="text-xs font-condensed font-bold uppercase tracking-widest text-emerald-400">
                  ✓ Payment Successful • {confirmedOrder.transactionId}
                </span>
                <h3 className="font-display font-black text-2xl text-zinc-100 mt-0.5">
                  ORDER #{confirmedOrder.orderNumber}
                </h3>
                <p className="text-sm font-bold text-red-400 mt-0.5">
                  Table {confirmedOrder.tableNumber}
                </p>
              </div>

              <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl w-full text-xs space-y-2 text-left">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Order Confirmed & Received in Kitchen</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-400">
                  <Clock className="w-4 h-4 text-red-400" />
                  <span>Estimated preparation: 10–15 minutes</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-400">
                  <Smartphone className="w-4 h-4 text-red-400" />
                  <span>Notifications dispatched to +91 {confirmedOrder.customerMobile}</span>
                </div>
              </div>

              {/* Action Buttons: Track Order & View Digital Invoice */}
              <div className="w-full space-y-2.5 pt-2">
                <button
                  onClick={() => {
                    onClose();
                    setActiveView('ORDER_TRACKING');
                  }}
                  className="w-full py-3.5 px-4 bg-[#ED1C24] hover:bg-red-600 text-white font-condensed font-black text-base tracking-wider uppercase rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-950/50 cursor-pointer"
                >
                  <Clock className="w-4 h-4" />
                  <span>Track Order Status</span>
                  <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                </button>

                <button
                  onClick={() => {
                    setSelectedOrderForInvoice(confirmedOrder);
                    setActiveView('INVOICE');
                    onClose();
                  }}
                  className="w-full py-3 px-4 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-condensed font-bold text-xs tracking-wider uppercase rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-red-400" />
                  <span>View Digital Invoice</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer (When in FORM state) */}
        {paymentState === 'FORM' && (
          <div className="p-4 sm:p-5 bg-zinc-950/80 border-t border-zinc-800">
            <button
              onClick={handlePay}
              className="w-full py-3.5 px-4 bg-[#ED1C24] hover:bg-red-600 text-white font-condensed font-black text-base tracking-wider uppercase rounded-2xl flex items-center justify-between transition-all shadow-lg shadow-red-950/50 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" />
                <span>Pay ₹{cartTotal}</span>
              </div>
              <span className="text-xs font-sans font-bold text-white/90">
                Verify & Send to Kitchen →
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
