import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BrandLogo } from './BrandLogo';
import { ShoppingCart, QrCode, Clock, Tag, Menu, X, ChevronRight } from 'lucide-react';

interface HeaderProps {
  onOpenCart: () => void;
  onOpenTableModal: () => void;
  onOpenOffersModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCart,
  onOpenTableModal,
  onOpenOffersModal,
}) => {
  const { activeTableNumber, cart, cartTotal, currentOrder, setActiveView, setIsCartOpen } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleOpenCart = () => {
    setIsCartOpen(true);
    if (onOpenCart) onOpenCart();
  };

  const handleOrderNow = () => {
    if (cart.length > 0) {
      setIsCartOpen(true);
    } else {
      setActiveView('CUSTOMER');
      const el = document.getElementById('menu-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-[41px] z-40 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Logo & Table Indicator */}
        <div className="flex items-center gap-3 sm:gap-6">
          <button
            onClick={() => setActiveView('CUSTOMER')}
            className="flex items-center text-left focus:outline-hidden cursor-pointer"
          >
            <BrandLogo size="md" />
          </button>

          {/* Table Pill */}
          <button
            onClick={onOpenTableModal}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-900/90 border border-zinc-800 hover:border-red-600/50 rounded-full text-xs font-medium text-zinc-200 transition-all group cursor-pointer"
            title="Sitting at Table"
          >
            <QrCode className="w-3.5 h-3.5 text-red-500" />
            <span className="font-semibold">Table {activeTableNumber}</span>
            <span className="text-zinc-500 text-[11px] group-hover:text-red-400 hidden md:inline">
              (Change)
            </span>
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#menu-section"
            className="text-sm font-semibold text-zinc-300 hover:text-white transition-colors"
          >
            Menu
          </a>
          <button
            onClick={onOpenOffersModal}
            className="text-sm font-semibold text-zinc-300 hover:text-white transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Tag className="w-3.5 h-3.5 text-red-500" />
            <span>Offers</span>
            <span className="px-2 py-0.5 bg-red-500/15 border border-red-500/30 text-red-400 font-bold text-[10px] rounded-full">
              4 Active
            </span>
          </button>
          {currentOrder && (
            <button
              onClick={() => setActiveView('ORDER_TRACKING')}
              className="text-sm font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Track Order #{currentOrder.orderNumber}</span>
            </button>
          )}
        </nav>

        {/* Actions: Cart CTA */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleOrderNow}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-200 text-xs font-bold tracking-wider rounded-xl transition-colors uppercase font-condensed cursor-pointer"
          >
            {cart.length > 0 ? 'Checkout Now' : 'Order Now'}
          </button>

          <button
            onClick={handleOpenCart}
            id="header-cart-btn"
            className="relative flex items-center gap-2 px-4 py-2 bg-[#ED1C24] hover:bg-red-600 text-white rounded-xl font-semibold text-sm transition-all active:scale-95 shadow-md shadow-red-950/40 cursor-pointer"
            aria-label="View Cart"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Cart</span>
            {totalItemsCount > 0 ? (
              <span className="flex items-center gap-1.5 text-xs font-bold pl-1.5 border-l border-red-400/50">
                <span className="bg-white text-[#ED1C24] px-1.5 py-0.2 rounded-full text-[11px] font-extrabold">
                  {totalItemsCount}
                </span>
                <span>• ₹{cartTotal}</span>
              </span>
            ) : (
              <span className="text-xs text-red-200 hidden sm:inline">(0)</span>
            )}
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-xl cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-zinc-900 border-t border-zinc-800 px-4 py-3 space-y-2 shadow-2xl">
          <a
            href="#menu-section"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between p-2.5 text-sm font-semibold text-zinc-200 hover:bg-zinc-800 rounded-xl"
          >
            <span>Explore Menu</span>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </a>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenOffersModal();
            }}
            className="w-full flex items-center justify-between p-2.5 text-sm font-semibold text-zinc-200 hover:bg-zinc-800 rounded-xl cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-red-500" />
              <span>Coupons & Offers</span>
            </span>
            <span className="px-2 py-0.5 bg-red-500/15 border border-red-500/30 text-red-400 font-bold text-xs rounded-full">
              4 Active
            </span>
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenTableModal();
            }}
            className="w-full flex items-center justify-between p-2.5 text-sm font-semibold text-zinc-200 hover:bg-zinc-800 rounded-xl cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <QrCode className="w-4 h-4 text-red-500" />
              <span>Sitting at Table {activeTableNumber}</span>
            </span>
            <span className="text-xs text-zinc-400">Change</span>
          </button>
          {currentOrder && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setActiveView('ORDER_TRACKING');
              }}
              className="w-full flex items-center justify-between p-2.5 text-sm font-semibold text-emerald-300 bg-emerald-950/50 border border-emerald-800/60 rounded-xl cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Track Order #{currentOrder.orderNumber}</span>
              </span>
              <span className="px-2 py-0.5 bg-emerald-600 text-white font-bold text-xs rounded-full">
                {currentOrder.status}
              </span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
