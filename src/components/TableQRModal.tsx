import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BrandLogo } from './BrandLogo';
import { QrCode, X, Check, Printer, Download, Eye, ExternalLink } from 'lucide-react';

interface TableQRModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TableQRModal: React.FC<TableQRModalProps> = ({ isOpen, onClose }) => {
  const { tables, activeTableNumber, setActiveTableNumber, setActiveView } = useApp();
  const [selectedPreviewTable, setSelectedPreviewTable] = useState(activeTableNumber);

  if (!isOpen) return null;

  const currentTbl = tables.find((t) => t.number === selectedPreviewTable) || tables[11];

  const handleSelectTable = (tblNum: string) => {
    setActiveTableNumber(tblNum);
    setSelectedPreviewTable(tblNum);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-zinc-900 border border-zinc-800 text-zinc-100 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="p-4 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-[#ED1C24] text-white rounded-lg shadow-sm">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-zinc-100">
                Table QR Codes & Identity
              </h2>
              <p className="text-[11px] text-zinc-400">
                Select a table to simulate sitting at, or preview the printable QR tent card
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

        {/* Content: Split between Grid and Card Preview */}
        <div className="p-4 sm:p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Table Selection Grid */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
              Select Active Dining Table (1–20)
            </h3>

            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {tables.map((tbl) => {
                const isActive = tbl.number === activeTableNumber;
                const isOccupied = tbl.status === 'OCCUPIED';

                return (
                  <button
                    key={tbl.id}
                    onClick={() => handleSelectTable(tbl.number)}
                    className={`p-2.5 rounded-xl border text-center flex flex-col items-center justify-center transition-all cursor-pointer ${
                      isActive
                        ? 'border-2 border-red-500 bg-red-600/20 shadow-sm'
                        : isOccupied
                        ? 'border-amber-800/80 bg-amber-950/40'
                        : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
                    }`}
                  >
                    <span
                      className={`font-condensed font-black text-base ${
                        isActive ? 'text-red-400' : 'text-zinc-100'
                      }`}
                    >
                      {tbl.number}
                    </span>
                    <span
                      className={`text-[9px] font-bold uppercase tracking-tight mt-0.5 ${
                        isActive
                          ? 'text-red-400'
                          : isOccupied
                          ? 'text-amber-400'
                          : 'text-zinc-500'
                      }`}
                    >
                      {isActive ? 'Current' : tbl.status}
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="text-[11px] text-zinc-400 mt-3">
              Active table orders persist into the Kitchen Display and Owner Dashboard automatically.
            </p>
          </div>

          {/* Right: Printable Table Tent Card Mockup */}
          <div className="flex flex-col items-center justify-center p-5 bg-zinc-950 border border-zinc-800 rounded-3xl text-center space-y-4">
            <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 shadow-md max-w-xs w-full space-y-3">
              <div className="flex justify-center">
                <BrandLogo size="sm" />
              </div>

              <div className="py-2 bg-[#ED1C24] text-white rounded-xl shadow-md">
                <span className="text-[10px] font-condensed tracking-widest uppercase font-bold text-white/90 block">
                  DINE-IN ORDERING
                </span>
                <span className="font-display font-black text-2xl tracking-tight">
                  TABLE {currentTbl.number}
                </span>
              </div>

              {/* Dynamic SVG QR Code Simulation */}
              <div className="p-3 bg-white border-2 border-zinc-800 rounded-xl inline-block mx-auto">
                <svg
                  className="w-32 h-32"
                  viewBox="0 0 100 100"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Outer corner squares */}
                  <rect x="5" y="5" width="30" height="30" rx="3" fill="#18181b" />
                  <rect x="11" y="11" width="18" height="18" rx="2" fill="white" />
                  <rect x="15" y="15" width="10" height="10" rx="1" fill="#ED1C24" />

                  <rect x="65" y="5" width="30" height="30" rx="3" fill="#18181b" />
                  <rect x="71" y="11" width="18" height="18" rx="2" fill="white" />
                  <rect x="75" y="15" width="10" height="10" rx="1" fill="#ED1C24" />

                  <rect x="5" y="65" width="30" height="30" rx="3" fill="#18181b" />
                  <rect x="11" y="71" width="18" height="18" rx="2" fill="white" />
                  <rect x="15" y="75" width="10" height="10" rx="1" fill="#ED1C24" />

                  {/* Matrix dots */}
                  <rect x="42" y="10" width="6" height="12" rx="1" fill="#18181b" />
                  <rect x="52" y="10" width="6" height="6" rx="1" fill="#18181b" />
                  <rect x="42" y="26" width="12" height="6" rx="1" fill="#18181b" />
                  <rect x="10" y="42" width="6" height="12" rx="1" fill="#18181b" />
                  <rect x="22" y="42" width="12" height="6" rx="1" fill="#18181b" />
                  <rect x="40" y="40" width="20" height="20" rx="2" fill="#ED1C24" />
                  <rect x="68" y="42" width="10" height="6" rx="1" fill="#18181b" />
                  <rect x="82" y="42" width="8" height="12" rx="1" fill="#18181b" />
                  <rect x="42" y="68" width="6" height="22" rx="1" fill="#18181b" />
                  <rect x="54" y="75" width="12" height="6" rx="1" fill="#18181b" />
                  <rect x="72" y="68" width="8" height="10" rx="1" fill="#18181b" />
                  <rect x="84" y="80" width="6" height="10" rx="1" fill="#18181b" />
                </svg>
              </div>

              <div className="text-[11px] text-zinc-400 space-y-0.5">
                <strong className="block text-zinc-100">Scan with Camera to Order</strong>
                <p>No app download required • Instant UPI billing</p>
              </div>
            </div>

            <button
              onClick={() => {
                setActiveTableNumber(currentTbl.number);
                setActiveView('CUSTOMER');
                onClose();
              }}
              className="w-full py-3 bg-[#ED1C24] hover:bg-red-600 text-white font-condensed font-black text-xs tracking-wider uppercase rounded-xl transition-all shadow-md shadow-red-950/40 cursor-pointer"
            >
              Order for Table {currentTbl.number} Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
