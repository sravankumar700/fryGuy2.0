import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { CategoryType, MenuItem } from '../types';
import { ProductCard } from './ProductCard';
import { BrandLogo } from './BrandLogo';
import {
  Search,
  ArrowDown,
  Tag,
  UtensilsCrossed,
  X,
  Sparkles,
  ShoppingBag,
  Leaf,
  Drumstick,
  Flame,
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight,
  Clock,
  QrCode,
} from 'lucide-react';

interface CustomerMenuProps {
  onSelectProduct: (item: MenuItem) => void;
  onOpenTableModal: () => void;
  onOpenOffersModal: () => void;
}

type DietaryFilter = 'ALL' | 'VEG' | 'NON_VEG';

export const CustomerMenu: React.FC<CustomerMenuProps> = ({
  onSelectProduct,
  onOpenTableModal,
  onOpenOffersModal,
}) => {
  const { menuItems, activeTableNumber, cart, cartTotal, setIsCartOpen, addToCart } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');
  const [dietaryFilter, setDietaryFilter] = useState<DietaryFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [groupByDiet, setGroupByDiet] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const categories: CategoryType[] = [
    'All',
    'Burgers',
    'Fried Chicken',
    'Fries',
    'Combos',
    'Beverages',
    'Milkshakes',
    'Desserts',
    'Chocolates',
  ];

  // Filtered menu items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchDiet =
        dietaryFilter === 'ALL'
          ? true
          : dietaryFilter === 'VEG'
          ? item.isVegetarian
          : !item.isVegetarian;

      return matchCategory && matchSearch && matchDiet;
    });
  }, [menuItems, selectedCategory, searchQuery, dietaryFilter]);

  // Veg and Non-veg grouped subsets
  const vegItems = useMemo(() => filteredItems.filter((i) => i.isVegetarian), [filteredItems]);
  const nonVegItems = useMemo(() => filteredItems.filter((i) => !i.isVegetarian), [filteredItems]);

  const vegCount = menuItems.filter((i) => i.isVegetarian).length;
  const nonVegCount = menuItems.filter((i) => !i.isVegetarian).length;

  const showToast = (name: string) => {
    setToastMessage(`✓ Added "${name}" to your cart!`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleQuickAddOrCustomize = (item: MenuItem) => {
    if (item.customizable) {
      onSelectProduct(item);
    } else {
      addToCart({
        productId: item.id,
        productName: item.name,
        basePrice: item.price,
        quantity: 1,
        selectedAddons: [],
      });
      showToast(item.name);
    }
  };

  const handleScrollToMenu = () => {
    const el = document.getElementById('menu-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-8 sm:space-y-12 pb-24">
      {/* 1. TOP LIVE TICKER */}
      <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border-b border-zinc-800/80 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] text-zinc-400 font-condensed tracking-wider uppercase">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-zinc-200 font-bold">Live Kitchen Serving:</span>
            <span>Table {activeTableNumber} (Dine-in Order)</span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-zinc-400 font-medium">
            <span>🔥 100% Freshly Fried to Order</span>
            <span>•</span>
            <span>🌱 Pure Veg & Crispy Meat Stations</span>
            <span>•</span>
            <span>📄 Instant WhatsApp / SMS Invoices</span>
          </div>
        </div>
      </div>

      {/* 2. HERO SHOWCASE (Fresh Contemporary QSR Design) */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl bg-zinc-900/90 border border-zinc-800 overflow-hidden shadow-2xl p-6 sm:p-10 lg:p-12">
          {/* Ambient Lighting Accents */}
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              {/* Badge cluster */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ED1C24]/10 border border-[#ED1C24]/30 text-[#ED1C24] text-xs font-condensed font-black tracking-wider uppercase">
                  <Flame className="w-3.5 h-3.5" />
                  <span>The Crunch House</span>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800/90 border border-zinc-700 text-zinc-300 text-xs font-semibold">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>7-Min Fast Kitchen</span>
                </div>
                <button
                  onClick={onOpenTableModal}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5 text-red-500" />
                  <span>Table {activeTableNumber}</span>
                  <span className="text-zinc-500 text-[10px]">(Change)</span>
                </button>
              </div>

              {/* High-Impact Headline */}
              <div className="space-y-2">
                <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-[0.95] text-zinc-100 uppercase">
                  UNAPOLOGETICALLY
                  <br />
                  <span className="text-[#ED1C24]">CRISPY.</span>
                  <br />
                  PURE FLAVOR.
                </h1>
                <p className="text-sm sm:text-base text-zinc-300 max-w-xl leading-relaxed font-normal pt-1">
                  Hand-breaded fresh fillets, gourmet brioche stacks, sizzling tenders, and chilled craft shakes. Scan table QR, customize toppings in seconds, and track live kitchen prep.
                </p>
              </div>

              {/* Fast Dietary Switchers in Hero */}
              <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded-2xl flex flex-wrap items-center gap-2">
                <span className="text-xs font-condensed font-bold uppercase tracking-wider text-zinc-400 pl-2">
                  Select Diet:
                </span>
                <button
                  onClick={() => {
                    setDietaryFilter('ALL');
                    handleScrollToMenu();
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    dietaryFilter === 'ALL'
                      ? 'bg-zinc-100 text-zinc-950 shadow-sm'
                      : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  All Menu ({menuItems.length})
                </button>
                <button
                  onClick={() => {
                    setDietaryFilter('VEG');
                    handleScrollToMenu();
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    dietaryFilter === 'VEG'
                      ? 'bg-emerald-950/90 border-emerald-500 text-emerald-300 shadow-sm'
                      : 'bg-zinc-900 border-zinc-800 text-emerald-400/90 hover:bg-zinc-800'
                  }`}
                >
                  <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Pure Veg ({vegCount})</span>
                </button>
                <button
                  onClick={() => {
                    setDietaryFilter('NON_VEG');
                    handleScrollToMenu();
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    dietaryFilter === 'NON_VEG'
                      ? 'bg-red-950/90 border-red-500 text-red-300 shadow-sm'
                      : 'bg-zinc-900 border-zinc-800 text-red-400 hover:bg-zinc-800'
                  }`}
                >
                  <Drumstick className="w-3.5 h-3.5 text-red-400" />
                  <span>Crispy Non-Veg ({nonVegCount})</span>
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={handleScrollToMenu}
                  id="hero-order-now-btn"
                  className="px-6 py-3.5 bg-[#ED1C24] hover:bg-red-600 text-white font-condensed font-black text-base tracking-wider uppercase rounded-2xl transition-all shadow-lg shadow-red-950/50 active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <span>Order Now</span>
                  <ArrowDown className="w-4 h-4" />
                </button>

                <button
                  onClick={onOpenOffersModal}
                  className="px-5 py-3.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 font-condensed font-bold text-sm tracking-wider uppercase rounded-2xl transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Tag className="w-4 h-4 text-red-500" />
                  <span>4 Active Coupons</span>
                </button>

                {totalCartItems > 0 && (
                  <button
                    onClick={() => setIsCartOpen(true)}
                    className="px-5 py-3.5 bg-zinc-100 hover:bg-white text-zinc-950 font-condensed font-black text-sm tracking-wider uppercase rounded-2xl transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#ED1C24]" />
                    <span>View Cart ({totalCartItems})</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right Visual Column: Featured Culinary Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border-2 border-zinc-800 bg-zinc-950 shadow-2xl group">
                <img
                  src="/assets/hero-food.jpg"
                  alt="Signature Fry Guy Feast"
                  className="w-full aspect-[4/3] object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent p-6 flex flex-col justify-end">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-condensed font-black text-[11px] uppercase tracking-widest text-white bg-[#ED1C24] px-2.5 py-0.5 rounded-md shadow-sm">
                      CHEF'S SIGNATURE
                    </span>
                    <span className="bg-zinc-900/90 text-zinc-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-zinc-700">
                      ★ 4.9 Rated
                    </span>
                  </div>
                  <h3 className="font-display font-black text-2xl sm:text-3xl text-zinc-100">
                    Double Crunch & Fries Combo
                  </h3>
                  <p className="text-xs text-zinc-300 line-clamp-1 mt-1">
                    Molten cheddar glaze, toasted brioche & peri-peri dusted fries
                  </p>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-800/80">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xs text-zinc-400 uppercase font-bold">Combo</span>
                      <span className="font-condensed font-black text-2xl text-white">₹349</span>
                    </div>

                    <button
                      onClick={handleScrollToMenu}
                      className="px-4 py-2 bg-white hover:bg-zinc-100 text-zinc-950 font-condensed font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      Explore Details →
                    </button>
                  </div>
                </div>
              </div>

              {/* Floating perk chip */}
              <div className="absolute -bottom-4 -left-4 bg-zinc-900 border border-zinc-700/80 rounded-2xl p-3 shadow-xl hidden sm:flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <span className="text-xs font-bold text-zinc-100 block">Dine-in Table {activeTableNumber}</span>
                  <span className="text-[11px] text-zinc-400">Tickets sent directly to KDS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MENU SECTION */}
      <section id="menu-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-28">
        {/* Section Header & Controls */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-800 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-red-500" />
                <span className="text-xs font-condensed font-bold uppercase tracking-wider text-red-400">
                  Kitchen Menu Catalog
                </span>
              </div>
              <h2 className="font-display font-black text-2xl sm:text-4xl text-zinc-100 tracking-tight">
                SELECT YOUR MEAL
              </h2>
            </div>

            {/* View Mode & Categorization Toggle */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setGroupByDiet(!groupByDiet)}
                className={`text-xs font-condensed font-bold uppercase tracking-wider px-3.5 py-2 rounded-xl border transition-all cursor-pointer flex items-center gap-2 ${
                  groupByDiet
                    ? 'bg-zinc-800 border-zinc-600 text-zinc-100'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{groupByDiet ? 'Grouped: Veg / Non-Veg' : 'Standard Grid'}</span>
              </button>
            </div>
          </div>

          {/* Primary Dietary Category Bar (All / Pure Veg / Non-Veg) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => setDietaryFilter('ALL')}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                dietaryFilter === 'ALL'
                  ? 'bg-zinc-800 border-zinc-600 shadow-md ring-1 ring-zinc-500'
                  : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700 text-zinc-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-zinc-800 text-zinc-200">
                  <UtensilsCrossed className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-condensed font-black text-base text-zinc-100">ALL ITEMS</div>
                  <div className="text-[11px] text-zinc-400">Complete restaurant selection</div>
                </div>
              </div>
              <span className="font-condensed font-black text-lg text-zinc-300">
                {menuItems.length}
              </span>
            </button>

            <button
              onClick={() => setDietaryFilter('VEG')}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                dietaryFilter === 'VEG'
                  ? 'bg-emerald-950/60 border-emerald-500 shadow-md ring-1 ring-emerald-500/50'
                  : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700 text-zinc-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                  <Leaf className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-condensed font-black text-base text-emerald-400">
                    🟢 100% PURE VEG
                  </div>
                  <div className="text-[11px] text-zinc-400">Paneer, corn, cheese & fries</div>
                </div>
              </div>
              <span className="font-condensed font-black text-lg text-emerald-400">{vegCount}</span>
            </button>

            <button
              onClick={() => setDietaryFilter('NON_VEG')}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                dietaryFilter === 'NON_VEG'
                  ? 'bg-red-950/60 border-red-500 shadow-md ring-1 ring-red-500/50'
                  : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700 text-zinc-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-red-950 text-red-400 border border-red-500/30">
                  <Drumstick className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-condensed font-black text-base text-red-400">
                    🔴 CRISPY NON-VEG
                  </div>
                  <div className="text-[11px] text-zinc-400">Hand-breaded chicken & meat</div>
                </div>
              </div>
              <span className="font-condensed font-black text-lg text-red-400">{nonVegCount}</span>
            </button>
          </div>

          {/* Search bar & Category chips */}
          <div className="flex flex-col md:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-zinc-500" />
              <input
                type="text"
                placeholder="Search burgers, wings, fries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 text-xs bg-zinc-900 text-zinc-100 border border-zinc-800 rounded-2xl focus:outline-hidden focus:border-red-500 shadow-xs placeholder:text-zinc-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-100 p-0.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Categories horizontal scroll */}
            <div className="w-full flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                const catCount =
                  cat === 'All'
                    ? filteredItems.length
                    : filteredItems.filter((i) => i.category === cat).length;

                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer font-condensed tracking-wide flex items-center gap-2 ${
                      isSelected
                        ? 'bg-[#ED1C24] text-white shadow-md shadow-red-950/40'
                        : 'bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-800'
                    }`}
                  >
                    <span>{cat}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-sans font-bold ${
                        isSelected ? 'bg-white text-[#ED1C24]' : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {catCount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 4. PRODUCT DISPLAY */}
        {filteredItems.length === 0 ? (
          <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-12 text-center shadow-lg">
            <UtensilsCrossed className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
            <h3 className="font-display font-bold text-lg text-zinc-200">
              No items found matching your filters
            </h3>
            <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
              Try switching dietary modes, resetting search, or selecting "All Menu".
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                setDietaryFilter('ALL');
              }}
              className="mt-4 px-5 py-2.5 bg-[#ED1C24] hover:bg-red-600 text-white text-xs font-condensed font-extrabold uppercase tracking-wider rounded-xl cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : groupByDiet && dietaryFilter === 'ALL' ? (
          /* Split Veg & Non-Veg Grouped Layout */
          <div className="space-y-12">
            {/* Pure Veg Section */}
            {vegItems.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-emerald-950/40 border border-emerald-500/30 px-5 py-3 rounded-2xl">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-pulse" />
                    <h3 className="font-display font-black text-xl text-emerald-400">
                      PURE VEGETARIAN SPECIALTIES
                    </h3>
                    <span className="text-xs text-emerald-300/80 font-bold">
                      ({vegItems.length} items)
                    </span>
                  </div>
                  <span className="text-[11px] font-condensed uppercase tracking-wider text-emerald-300 bg-emerald-900/60 px-2.5 py-0.5 rounded-full">
                    100% Veg Certified
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {vegItems.map((item) => (
                    <ProductCard
                      key={item.id}
                      item={item}
                      onSelect={() => handleQuickAddOrCustomize(item)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Non-Veg Section */}
            {nonVegItems.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-red-950/40 border border-red-500/30 px-5 py-3 rounded-2xl">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3.5 h-3.5 rounded-full bg-red-500" />
                    <h3 className="font-display font-black text-xl text-red-400">
                      CRISPY NON-VEGETARIAN FEASTS
                    </h3>
                    <span className="text-xs text-red-300/80 font-bold">
                      ({nonVegItems.length} items)
                    </span>
                  </div>
                  <span className="text-[11px] font-condensed uppercase tracking-wider text-red-300 bg-red-900/60 px-2.5 py-0.5 rounded-full">
                    Hand-Breaded Chicken & Meat
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {nonVegItems.map((item) => (
                    <ProductCard
                      key={item.id}
                      item={item}
                      onSelect={() => handleQuickAddOrCustomize(item)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Direct Filtered Grid Layout */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <ProductCard
                key={item.id}
                item={item}
                onSelect={() => handleQuickAddOrCustomize(item)}
              />
            ))}
          </div>
        )}
      </section>

      {/* 5. FLOATING BOTTOM CART BAR (Appears whenever cart has items) */}
      {totalCartItems > 0 && (
        <div className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:right-6 z-40 max-w-lg mx-auto sm:mx-0">
          <div className="bg-zinc-950/95 backdrop-blur-md border border-zinc-700 text-white p-3 sm:p-4 rounded-2xl shadow-2xl shadow-black/80 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#ED1C24] text-white flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-zinc-100">
                    {totalCartItems} {totalCartItems === 1 ? 'Item' : 'Items'}
                  </span>
                  <span className="text-zinc-500">•</span>
                  <span className="text-xs font-extrabold text-[#ED1C24]">₹{cartTotal}</span>
                </div>
                <span className="text-[11px] text-zinc-400">Station: Table {activeTableNumber}</span>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              id="floating-cart-view-btn"
              className="px-4 py-2.5 bg-[#ED1C24] hover:bg-red-600 text-white font-condensed font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <span>View Cart</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 6. TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-zinc-900 border border-zinc-700 text-zinc-100 px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setIsCartOpen(true)}
            className="ml-2 text-xs text-[#ED1C24] font-bold hover:underline cursor-pointer"
          >
            View Cart →
          </button>
        </div>
      )}

      {/* 7. FOOTER */}
      <footer className="bg-zinc-950 text-zinc-400 pt-12 pb-8 border-t border-zinc-900 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center">
                <BrandLogo size="md" variant="full" />
              </div>
              <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
                Next-generation digital restaurant operating system for FRYGUY. Seamless QR table ordering, kitchen ticket synchronization, and paperless invoices.
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                <span className="text-emerald-400">✓ 100% Pure Veg Verified Station</span>
                <span>•</span>
                <span className="text-red-400">✓ Freshly Battered Non-Veg Station</span>
                <span>•</span>
                <span>✓ Contactless GST Invoicing</span>
              </div>
            </div>

            <div>
              <h4 className="font-condensed font-bold text-sm tracking-wider uppercase text-zinc-200 mb-3">
                Station Status
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Active: Table {activeTableNumber} (Dine-in)
                <br />
                Kitchen queue status: Online & Ready
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-900 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-600">
            <span>© 2026 FRYGUY. All rights reserved.</span>
            <span className="font-condensed font-bold text-zinc-400">
              fryguy2.o • Next-Gen Culinary Architecture
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
