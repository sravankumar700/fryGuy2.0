import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BrandLogo } from './BrandLogo';
import {
  MessageSquare,
  Smartphone,
  CheckCheck,
  Send,
  X,
  Clock,
  ShieldCheck,
} from 'lucide-react';

interface WhatsAppSMSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhatsAppSMSModal: React.FC<WhatsAppSMSModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { notifications, currentOrder } = useApp();
  const [activeChannel, setActiveChannel] = useState<'ALL' | 'WHATSAPP' | 'SMS'>('ALL');

  if (!isOpen) return null;

  const filteredNotifs = notifications.filter(
    (n) => activeChannel === 'ALL' || n.channel === activeChannel,
  );

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-zinc-900 border border-zinc-800 text-zinc-100 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-4 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-emerald-500 text-zinc-950 rounded-lg">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-zinc-100">
                Simulated Customer Notification Feed
              </h2>
              <p className="text-[11px] text-zinc-400">
                Live simulated WhatsApp & SMS alerts dispatched for order updates
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

        {/* Channel Filter Pills */}
        <div className="px-4 py-2.5 bg-zinc-950 border-b border-zinc-800 flex items-center gap-2 text-xs">
          <span className="font-bold text-zinc-400">Channel:</span>
          {(['ALL', 'WHATSAPP', 'SMS'] as const).map((ch) => (
            <button
              key={ch}
              onClick={() => setActiveChannel(ch)}
              className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                activeChannel === ch
                  ? ch === 'WHATSAPP'
                    ? 'bg-emerald-500 text-zinc-950 shadow-xs'
                    : ch === 'SMS'
                    ? 'bg-sky-400 text-zinc-950 shadow-xs'
                    : 'bg-[#ED1C24] text-white shadow-xs'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {ch}
            </button>
          ))}
        </div>

        {/* Message Thread List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3.5 flex-1 bg-zinc-950">
          {filteredNotifs.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 text-xs">
              No notifications triggered yet. Place an order or advance kitchen status!
            </div>
          ) : (
            filteredNotifs.map((item) => {
              const isWhatsApp = item.channel === 'WHATSAPP';
              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border shadow-xs space-y-2 text-xs ${
                    isWhatsApp
                      ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-100'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] pb-1.5 border-b border-white/10">
                    <div className="flex items-center gap-1.5 font-bold">
                      {isWhatsApp ? (
                        <span className="text-emerald-400 flex items-center gap-1 font-condensed tracking-wider">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WHATSAPP VERIFIED BUSINESS</span>
                        </span>
                      ) : (
                        <span className="text-sky-400 flex items-center gap-1 font-condensed tracking-wider">
                          <Smartphone className="w-3.5 h-3.5" />
                          <span>SMS GATEWAY</span>
                        </span>
                      )}
                      <span className="text-zinc-600">•</span>
                      <span className="text-zinc-400">+91 {item.recipientMobile}</span>
                    </div>

                    <div className="flex items-center gap-1 text-zinc-400">
                      <span>{item.timestamp}</span>
                      {isWhatsApp && <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                  </div>

                  <p className="font-medium leading-relaxed">{item.message}</p>

                  <div className="pt-1 text-[10px] text-zinc-400 flex justify-between items-center">
                    <span>Order #{item.orderNumber}</span>
                    <span className="font-mono bg-zinc-800/80 px-2 py-0.5 rounded-md text-zinc-300">
                      Status: {item.status}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-zinc-900 border-t border-zinc-800 text-center text-[11px] text-zinc-400">
          Notice: Realistic client demonstration simulation. No real SMS/WhatsApp charges incurred.
        </div>
      </div>
    </div>
  );
};
