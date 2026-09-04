import React, { useState } from 'react';
import { MenuItem, Addon } from '../types';
import { useApp } from '../context/AppContext';
import { X, Plus, Minus, Check, SlidersHorizontal } from 'lucide-react';

interface CustomizationModalProps {
  item?: MenuItem | null;
  product?: MenuItem | null;
  addonsList?: Addon[];
  isOpen?: boolean;
  onClose: () => void;
  onAddToCart?: (
    item: MenuItem,
    quantity: number,
    cheese?: string,
    patty?: string,
    sauce?: string,
    selectedAddons?: Addon[],
  ) => void;
}

export const CustomizationModal: React.FC<CustomizationModalProps> = ({
  item,
  product,
  addonsList,
  isOpen = true,
  onClose,
  onAddToCart,
}) => {
  const { addons: contextAddons, addToCart, setIsCartOpen } = useApp();

  const activeItem = item || product;
  if (!isOpen || !activeItem) return null;

  const resolvedAddons = addonsList || contextAddons || [];
  const isBurger = activeItem.category === 'Burgers';

  const [quantity, setQuantity] = useState<number>(1);
  const [cheese, setCheese] = useState<string>('Regular');
  const [patty, setPatty] = useState<string>('Regular');
  const [sauce, setSauce] = useState<string>('Signature');
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);

  // Calculate dynamic total
  let unitPrice = activeItem.price;
  if (cheese === 'Extra (+₹20)') unitPrice += 20;
  if (patty === 'Extra (+₹50)') unitPrice += 50;
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const totalModalPrice = (unitPrice + addonsTotal) * quantity;

  const toggleAddon = (addon: Addon) => {
    setSelectedAddons((prev) =>
      prev.some((a) => a.id === addon.id)
        ? prev.filter((a) => a.id !== addon.id)
        : [...prev, addon],
    );
  };

  const handleConfirm = () => {
    if (onAddToCart) {
      onAddToCart(
        activeItem,
        quantity,
        isBurger ? cheese : undefined,
        isBurger ? patty : undefined,
        isBurger ? sauce : undefined,
        selectedAddons,
      );
    } else {
      addToCart({
        productId: activeItem.id,
        productName: activeItem.name,
        basePrice: activeItem.price,
        quantity,
        selectedCheese: isBurger ? cheese : undefined,
        selectedPatty: isBurger ? patty : undefined,
        selectedSauce: isBurger ? sauce : undefined,
        selectedAddons: selectedAddons || [],
      });
    }
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-zinc-900 border border-zinc-800 text-zinc-100 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header with Image */}
        <div className="relative h-44 sm:h-48 bg-zinc-950">
          <img
            src={activeItem.image}
            alt={activeItem.name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 bg-zinc-950/80 hover:bg-zinc-900 text-zinc-300 hover:text-zinc-100 border border-zinc-700/60 rounded-full transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent p-4 text-zinc-100">
            <span className="text-[11px] font-condensed uppercase tracking-wider font-black text-red-400">
              {activeItem.category}
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-bold">{activeItem.name}</h2>
            <p className="text-xs text-zinc-300 line-clamp-1">{activeItem.description}</p>
          </div>
        </div>

        {/* Scrollable Customization Options */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 divide-y divide-zinc-800/60">
          {/* Burger Customizations */}
          {isBurger && (
            <div className="space-y-4 pt-1">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
                <SlidersHorizontal className="w-3.5 h-3.5 text-red-500" />
                <span>Customize Your Burger</span>
              </div>

              {/* Cheese Option */}
              <div>
                <label className="block text-xs font-semibold text-zinc-200 mb-2">
                  Cheese Selection
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'Regular', label: 'Regular Cheese', price: '+₹0' },
                    { id: 'Extra (+₹20)', label: 'Extra Double Cheese', price: '+₹20' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setCheese(opt.id)}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition-colors cursor-pointer ${
                        cheese === opt.id
                          ? 'border-red-600 bg-red-600/15 text-white font-bold'
                          : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700 text-zinc-300'
                      }`}
                    >
                      <span>{opt.label}</span>
                      <span className="font-condensed font-bold">{opt.price}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Patty Option */}
              <div>
                <label className="block text-xs font-semibold text-zinc-200 mb-2">
                  Patty Multiplier
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'Regular', label: 'Single Patty', price: '+₹0' },
                    { id: 'Extra (+₹50)', label: 'Double Stack Patty', price: '+₹50' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPatty(opt.id)}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition-colors cursor-pointer ${
                        patty === opt.id
                          ? 'border-red-600 bg-red-600/15 text-white font-bold'
                          : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700 text-zinc-300'
                      }`}
                    >
                      <span>{opt.label}</span>
                      <span className="font-condensed font-bold">{opt.price}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sauce Option */}
              <div>
                <label className="block text-xs font-semibold text-zinc-200 mb-2">
                  Signature Sauce Glaze
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Signature', 'Spicy', 'Smoky'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSauce(s)}
                      className={`p-2 rounded-xl border text-center text-xs transition-colors cursor-pointer ${
                        sauce === s
                          ? 'border-red-600 bg-red-600/15 text-white font-bold'
                          : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700 text-zinc-300'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Add-ons Checklist */}
          <div className="pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
              Add-ons & Upgrades
            </h3>
            <div className="space-y-2">
              {resolvedAddons
                .filter((a) => a.isAvailable)
                .map((addon) => {
                  const isChecked = selectedAddons.some((a) => a.id === addon.id);
                  return (
                    <button
                      key={addon.id}
                      type="button"
                      onClick={() => toggleAddon(addon)}
                      className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-colors cursor-pointer text-xs ${
                        isChecked
                          ? 'border-red-600 bg-red-600/15'
                          : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                            isChecked
                              ? 'bg-[#ED1C24] border-[#ED1C24] text-white'
                              : 'border-zinc-700 bg-zinc-900'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="font-semibold text-zinc-200">{addon.name}</span>
                      </div>
                      <span className="font-condensed font-extrabold text-sm text-red-400">
                        +₹{addon.price}
                      </span>
                    </button>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Modal Footer with Quantity and Add Button */}
        <div className="p-4 sm:p-5 bg-zinc-950/80 border-t border-zinc-800 flex items-center justify-between gap-4">
          {/* Quantity Controls */}
          <div className="flex items-center border border-zinc-800 bg-zinc-900 rounded-xl p-1">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="p-1.5 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg disabled:opacity-30 cursor-pointer transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="font-condensed font-bold text-base px-3 min-w-[28px] text-center text-zinc-100">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-1.5 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={handleConfirm}
            className="flex-1 py-3 px-4 bg-[#ED1C24] hover:bg-red-600 text-white font-condensed font-black text-base tracking-wide uppercase rounded-xl flex items-center justify-between transition-all shadow-md shadow-red-950/50 cursor-pointer"
          >
            <span>ADD TO CART</span>
            <span>₹{totalModalPrice}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
