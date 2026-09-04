import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Plus, Minus, Trash2, Tag, ArrowRight, AlertCircle, CheckCircle2, ShoppingBag } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onProceedToCheckout,
}) => {
  const {
    cart,
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
    activeTableNumber,
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleApplyCoupon = (codeToApply?: string) => {
    const code = codeToApply || couponInput;
    if (!code.trim()) return;

    setCouponError(null);
    setCouponSuccess(null);

    const res = applyCoupon(code);
    if (res.success) {
      setCouponSuccess(res.message);
      setCouponInput('');
    } else {
      setCouponError(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-xs transition-opacity duration-200 cursor-pointer"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-zinc-900 border-l border-zinc-800 text-zinc-100 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/90">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-[#ED1C24] text-white rounded-lg shadow-sm">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h2 className="font-display font-bold text-lg text-zinc-100">Your Cart</h2>
              <span className="text-xs bg-[#ED1C24] text-white font-black px-2 py-0.5 rounded-lg shadow-xs">
                Table {activeTableNumber}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cart Content */}
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-center mb-4 text-red-500">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-display font-bold text-lg text-zinc-100 mb-1">
                Your cart is empty
              </h3>
              <p className="text-xs text-zinc-400 max-w-xs mb-6">
                Freshly fried crunch awaits! Add your favorite burger, tenders, or combo to start ordering.
              </p>
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-[#ED1C24] hover:bg-red-600 text-white font-condensed font-black text-sm tracking-wider uppercase rounded-xl transition-all shadow-md shadow-red-950/40 cursor-pointer"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 divide-y divide-zinc-800/60">
              {/* Item List */}
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="p-3 bg-zinc-950/70 rounded-2xl border border-zinc-800 flex gap-3"
                  >
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-16 h-16 object-cover rounded-xl shrink-0 border border-zinc-800"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-display font-bold text-sm text-zinc-100 truncate">
                          {item.productName}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-zinc-500 hover:text-red-400 transition-colors p-0.5 cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Customization Badges */}
                      {(item.selectedCheese || item.selectedPatty || item.selectedSauce) && (
                        <p className="text-[11px] text-zinc-400 mt-0.5">
                          {[item.selectedCheese, item.selectedPatty, item.selectedSauce]
                            .filter(Boolean)
                            .join(' • ')}
                        </p>
                      )}

                      {/* Selected Addons */}
                      {item.selectedAddons.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.selectedAddons.map((ad) => (
                            <span
                              key={ad.id}
                              className="text-[10px] bg-zinc-900 border border-zinc-800 text-red-300 px-2 py-0.5 rounded-md font-medium"
                            >
                              +{ad.name}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Quantity & Subtotal */}
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-800/60">
                        <div className="flex items-center border border-zinc-800 bg-zinc-950 rounded-lg">
                          <button
                            onClick={() => updateCartItemQty(item.cartItemId, item.quantity - 1)}
                            className="px-2 py-0.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 cursor-pointer transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-condensed font-bold text-xs px-2 min-w-[20px] text-center text-zinc-200">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartItemQty(item.cartItemId, item.quantity + 1)}
                            className="px-2 py-0.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 cursor-pointer transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-condensed font-extrabold text-sm text-red-400">
                          ₹{item.itemTotal}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Section */}
              <div className="pt-4">
                <label className="block text-xs font-bold text-zinc-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-red-500" />
                  <span>Apply Restaurant Coupon</span>
                </label>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-950/80 border border-emerald-800/50 rounded-xl text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <div>
                        <span className="font-bold text-emerald-400">{appliedCoupon.code}</span>
                        <p className="text-[11px] text-zinc-400">Saved ₹{discountAmount}</p>
                      </div>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs font-semibold text-red-400 hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter coupon code (e.g. FRY50)"
                        value={couponInput}
                        onChange={(e) => {
                          setCouponInput(e.target.value.toUpperCase());
                          setCouponError(null);
                        }}
                        className="flex-1 px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-hidden focus:border-red-500 uppercase font-semibold transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => handleApplyCoupon()}
                        className="px-4 py-2 bg-[#ED1C24] hover:bg-red-600 text-white text-xs font-black font-condensed tracking-wider uppercase rounded-xl transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>

                    {/* Quick Demo Coupon Chips */}
                    <div className="flex flex-wrap gap-1.5">
                      {['FRY50', '10OFF', 'WELCOME100'].map((chip) => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => handleApplyCoupon(chip)}
                          className="px-2.5 py-1 bg-zinc-950 border border-zinc-800 hover:border-red-500 text-[10px] font-bold text-zinc-300 rounded-lg transition-colors cursor-pointer"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>

                    {couponError && (
                      <div className="flex items-center gap-1.5 text-xs text-red-400 mt-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{couponError}</span>
                      </div>
                    )}

                    {couponSuccess && (
                      <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-1">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>{couponSuccess}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Bill Details */}
              <div className="pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Item Subtotal</span>
                  <span className="font-condensed font-semibold text-sm text-zinc-200">
                    ₹{cartSubtotal}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-medium">
                    <span>Coupon Discount ({appliedCoupon?.code})</span>
                    <span className="font-condensed font-bold text-sm">
                      -₹{discountAmount}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-zinc-400">
                  <span>Restaurant GST (5% simulated)</span>
                  <span className="font-condensed font-semibold text-sm text-zinc-200">
                    ₹{gstAmount}
                  </span>
                </div>

                <div className="flex justify-between text-base font-bold text-zinc-100 pt-2 border-t border-zinc-800">
                  <span>To Pay</span>
                  <span className="font-condensed font-extrabold text-xl text-[#ED1C24]">
                    ₹{cartTotal}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Footer CTA */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 bg-zinc-950/80 border-t border-zinc-800">
              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 px-4 bg-[#ED1C24] hover:bg-red-600 text-white font-condensed font-black text-base tracking-wider uppercase rounded-2xl flex items-center justify-between transition-all shadow-lg shadow-red-950/50 cursor-pointer"
              >
                <span>Proceed to Payment</span>
                <div className="flex items-center gap-2">
                  <span>₹{cartTotal}</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
