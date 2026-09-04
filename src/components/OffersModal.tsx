import React from 'react';
import { useApp } from '../context/AppContext';
import { Tag, X, Check, Copy } from 'lucide-react';

interface OffersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCoupon: (code: string) => void;
}

export const OffersModal: React.FC<OffersModalProps> = ({
  isOpen,
  onClose,
  onApplyCoupon,
}) => {
  const { coupons, appliedCoupon } = useApp();

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-zinc-900 border border-zinc-800 text-zinc-100 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="p-4 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-[#ED1C24] text-white rounded-lg shadow-sm">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-zinc-100">
                Available Coupons & Offers
              </h2>
              <p className="text-[11px] text-zinc-400">
                Tap to apply directly to your current order
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Coupons List */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
          {coupons
            .filter((c) => c.isActive)
            .map((coupon) => {
              const isApplied = appliedCoupon?.code === coupon.code;
              return (
                <div
                  key={coupon.code}
                  className={`p-4 rounded-2xl border flex items-start justify-between gap-3 transition-colors ${
                    isApplied
                      ? 'border-emerald-800 bg-emerald-950/70'
                      : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
                  }`}
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs bg-zinc-900 border border-zinc-800 text-red-400 px-2.5 py-0.5 rounded-lg">
                        {coupon.code}
                      </span>
                      {isApplied && (
                        <span className="text-[10px] bg-emerald-500 text-zinc-950 font-black px-1.5 py-0.2 rounded-md">
                          Applied
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-zinc-200 pt-1">
                      {coupon.description}
                    </p>
                    <p className="text-[11px] text-zinc-400">
                      Minimum order: ₹{coupon.minOrder} • Valid till {coupon.expiry}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      onApplyCoupon(coupon.code);
                      onClose();
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-condensed font-black uppercase tracking-wider transition-all cursor-pointer shrink-0 shadow-xs ${
                      isApplied
                        ? 'bg-emerald-500 text-zinc-950'
                        : 'bg-[#ED1C24] hover:bg-red-600 text-white shadow-md shadow-red-950/40'
                    }`}
                  >
                    {isApplied ? 'Active' : 'Apply'}
                  </button>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
