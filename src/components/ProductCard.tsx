import React from 'react';
import { MenuItem } from '../types';
import { Plus, SlidersHorizontal } from 'lucide-react';

interface ProductCardProps {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ item, onSelect }) => {
  return (
    <article
      id={`product-card-${item.id}`}
      className={`group bg-zinc-900 rounded-3xl border border-zinc-800 p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:border-zinc-700 hover:shadow-2xl hover:shadow-black/60 ${
        !item.isAvailable ? 'opacity-50 grayscale-[50%]' : ''
      }`}
    >
      {/* Food Image Container with 4:3 Aspect Ratio */}
      <div className="relative w-full aspect-[4/3] bg-zinc-950 rounded-2xl overflow-hidden mb-4">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transform transition-transform duration-500 group-hover:scale-105"
        />

        {/* Dietary Tag & Best Seller Badge */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider backdrop-blur-md border shadow-sm ${
              item.isVegetarian
                ? 'bg-emerald-950/90 border-emerald-500/80 text-emerald-300'
                : 'bg-zinc-950/90 border-red-500/80 text-red-300'
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                item.isVegetarian ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'
              }`}
            />
            <span className="font-condensed font-black uppercase">
              {item.isVegetarian ? 'Pure Veg' : 'Non-Veg'}
            </span>
          </div>

          {item.isBestSeller && (
            <span className="bg-[#ED1C24] text-white text-[10px] font-condensed font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-md">
              Bestseller
            </span>
          )}
        </div>

        {/* Customizable tag */}
        {item.customizable && item.isAvailable && (
          <div className="absolute bottom-3 right-3 bg-zinc-950/90 backdrop-blur-md text-zinc-200 text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-zinc-700/80 flex items-center gap-1.5 shadow-sm">
            <SlidersHorizontal className="w-3 h-3 text-red-500" />
            <span>Customizable</span>
          </div>
        )}

        {/* Sold Out Overlay */}
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-zinc-950/80 flex items-center justify-center">
            <span className="bg-zinc-900 text-zinc-300 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-xl border border-zinc-800">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-display font-bold text-lg sm:text-xl text-zinc-100 leading-snug group-hover:text-red-400 transition-colors">
              {item.name}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 line-clamp-2 leading-relaxed mb-4">
            {item.description}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
              Price
            </span>
            <span className="font-condensed font-extrabold text-xl sm:text-2xl text-zinc-100">
              ₹{item.price}
            </span>
          </div>

          <button
            id={`btn-add-${item.id}`}
            disabled={!item.isAvailable}
            onClick={() => onSelect(item)}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-150 active:scale-95 cursor-pointer font-condensed ${
              item.isAvailable
                ? 'bg-[#ED1C24] hover:bg-red-600 text-white shadow-md shadow-red-950/40'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-800'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </article>
  );
};
