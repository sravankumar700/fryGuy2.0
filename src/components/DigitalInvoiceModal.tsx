import React from 'react';
import { useApp } from '../context/AppContext';
import { BrandLogo } from './BrandLogo';
import {
  FileText,
  Printer,
  Download,
  CheckCircle2,
  X,
  ArrowLeft,
  Share2,
} from 'lucide-react';

interface DigitalInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DigitalInvoiceModal: React.FC<DigitalInvoiceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { selectedOrderForInvoice, currentOrder, orders, setActiveView } = useApp();

  const order = selectedOrderForInvoice || currentOrder || orders[0];

  if (!isOpen) return null;
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-zinc-100"
      >
        {/* Top Control Bar */}
        <div className="p-4 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-[#ED1C24] text-white rounded-lg shadow-sm">
              <FileText className="w-4 h-4" />
            </div>
            <h2 className="font-display font-bold text-base text-zinc-100">
              Digital Restaurant Invoice
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white rounded-xl text-xs font-condensed font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer border border-zinc-700"
              title="Download PDF"
            >
              <Download className="w-3.5 h-3.5 text-red-500" />
              <span>PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div id="printable-invoice" className="p-6 sm:p-8 overflow-y-auto space-y-6 text-zinc-200">
          {/* Header */}
          <div className="text-center pb-6 border-b border-zinc-800 space-y-2">
            <div className="flex justify-center">
              <BrandLogo size="lg" />
            </div>
            <p className="text-xs text-zinc-400 max-w-xs mx-auto">
              Paperless Digital Receipt
              <br />
              Dine-in QR Ordering & Counter System
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-950/80 border border-emerald-800 rounded-full text-xs font-bold text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>PAID & VERIFIED</span>
            </div>
          </div>

          {/* Meta Details */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-zinc-400 block">Invoice No:</span>
              <strong className="font-mono text-sm text-zinc-100">
                INV-{order.orderNumber}
              </strong>
            </div>
            <div className="text-right">
              <span className="text-zinc-400 block">Date / Time:</span>
              <strong className="text-zinc-100">{order.createdAt}</strong>
            </div>

            <div>
              <span className="text-zinc-400 block">Order Type:</span>
              <strong className="text-zinc-100">
                {order.type === 'Dine-in'
                  ? `Dine-In • Table ${order.tableNumber}`
                  : 'Takeaway • Counter'}
              </strong>
            </div>
            <div className="text-right">
              <span className="text-zinc-400 block">Customer:</span>
              <strong className="text-zinc-100">+91 {order.customerMobile}</strong>
            </div>
          </div>

          {/* Items Table */}
          <div className="border-t border-zinc-800 pt-4">
            <div className="flex justify-between text-[11px] font-bold text-zinc-400 uppercase tracking-wider pb-2 border-b border-zinc-800">
              <span>Item & Description</span>
              <span>Total</span>
            </div>

            <div className="divide-y divide-zinc-800/60 py-2 space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="pt-2 first:pt-0 flex items-start justify-between text-xs">
                  <div className="pr-4">
                    <span className="font-bold text-zinc-100">
                      {item.quantity} × {item.productName}
                    </span>
                    {(item.selectedCheese || item.selectedPatty || item.selectedSauce) && (
                      <p className="text-[11px] text-zinc-400">
                        {[item.selectedCheese, item.selectedPatty, item.selectedSauce]
                          .filter(Boolean)
                          .join(', ')}
                      </p>
                    )}
                    {item.selectedAddons.length > 0 && (
                      <p className="text-[10px] text-red-400">
                        +{item.selectedAddons.map((a) => a.name).join(', ')}
                      </p>
                    )}
                  </div>

                  <span className="font-condensed font-extrabold text-sm text-red-400">
                    ₹{item.itemTotal}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="border-t border-zinc-800 pt-4 space-y-1.5 text-xs">
            <div className="flex justify-between text-zinc-400">
              <span>Subtotal</span>
              <span className="font-semibold text-zinc-200">₹{order.subtotal}</span>
            </div>

            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Coupon Discount ({order.couponCode || 'APPLIED'})</span>
                <span className="font-semibold">-₹{order.discountAmount}</span>
              </div>
            )}

            <div className="flex justify-between text-zinc-400">
              <span>Restaurant CGST + SGST (5%)</span>
              <span className="font-semibold text-zinc-200">₹{order.gstAmount}</span>
            </div>

            <div className="flex justify-between text-base font-black text-zinc-100 pt-2 border-t border-zinc-800">
              <span>Total Amount Paid</span>
              <span className="font-condensed font-extrabold text-xl text-[#ED1C24]">
                ₹{order.totalAmount}
              </span>
            </div>

            <div className="pt-2 text-[11px] text-zinc-400">
              Payment Verified via <strong className="text-zinc-200">{order.paymentMethod}</strong> (Txn:{' '}
              <span className="font-mono text-zinc-300">{order.transactionId}</span>)
            </div>
          </div>

          {/* Footer Note */}
          <div className="pt-4 border-t border-zinc-800 text-center text-xs text-zinc-400">
            <p className="font-bold text-zinc-200">Thank you for visiting FRYGUY!</p>
            <p className="text-[11px] mt-0.5">
              100% Digital Billing • Save Paper, Keep the Crunch
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-zinc-950/80 border-t border-zinc-800 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="py-3 px-5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 hover:text-white font-condensed font-bold text-xs tracking-wider uppercase rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 py-3 px-4 bg-[#ED1C24] hover:bg-red-600 text-white font-condensed font-black text-sm tracking-wider uppercase rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-red-950/40 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download / Print PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
