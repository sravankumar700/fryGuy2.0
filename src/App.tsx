import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { DemoBar } from './components/DemoBar';
import { Header } from './components/Header';
import { CustomerMenu } from './components/CustomerMenu';
import { OrderTrackingView } from './components/OrderTrackingView';
import { KitchenDisplay } from './components/KitchenDisplay';
import { CounterPOS } from './components/CounterPOS';
import { OwnerDashboard } from './components/OwnerDashboard';
import { CustomizationModal } from './components/CustomizationModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { TableQRModal } from './components/TableQRModal';
import { OffersModal } from './components/OffersModal';
import { WhatsAppSMSModal } from './components/WhatsAppSMSModal';
import { DigitalInvoiceModal } from './components/DigitalInvoiceModal';
import { MenuItem } from './types';

const AppContent: React.FC = () => {
  const {
    activeView,
    setActiveView,
    isCartOpen,
    setIsCartOpen,
    isCheckoutOpen,
    setIsCheckoutOpen,
    applyCoupon,
  } = useApp();

  // Modal states
  const [selectedProductForCustomization, setSelectedProductForCustomization] =
    useState<MenuItem | null>(null);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isOffersModalOpen, setIsOffersModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col selection:bg-red-500/20 selection:text-red-400">
      {/* 1. DEMO BAR (Always visible at very top for instant switching) */}
      <DemoBar
        onOpenNotifications={() => setIsNotificationsModalOpen(true)}
        onOpenTables={() => setIsTableModalOpen(true)}
        onOpenInvoice={() => setIsInvoiceModalOpen(true)}
      />

      {/* 2. MAIN HEADER (Visible for Customer, Tracking, Invoice) */}
      {(activeView === 'CUSTOMER' || activeView === 'ORDER_TRACKING' || (activeView as string) === 'TRACKING' || activeView === 'INVOICE') && (
        <Header
          onOpenCart={() => setIsCartOpen(true)}
          onOpenTableModal={() => setIsTableModalOpen(true)}
          onOpenOffersModal={() => setIsOffersModalOpen(true)}
          onOpenNotificationsModal={() => setIsNotificationsModalOpen(true)}
        />
      )}

      {/* 3. ACTIVE VIEW ROUTING */}
      <div className="flex-1">
        {activeView === 'CUSTOMER' && (
          <CustomerMenu
            onSelectProduct={(product) => setSelectedProductForCustomization(product)}
            onOpenTableModal={() => setIsTableModalOpen(true)}
            onOpenOffersModal={() => setIsOffersModalOpen(true)}
          />
        )}

        {(activeView === 'ORDER_TRACKING' || (activeView as string) === 'TRACKING') && <OrderTrackingView />}

        {activeView === 'KITCHEN' && <KitchenDisplay />}

        {activeView === 'POS' && <CounterPOS />}

        {activeView === 'ADMIN' && <OwnerDashboard />}

        {activeView === 'INVOICE' && (
          <div className="py-8">
            <DigitalInvoiceModal
              isOpen={true}
              onClose={() => setActiveView('CUSTOMER')}
            />
          </div>
        )}
      </div>

      {/* 4. MODALS & DRAWERS */}
      {/* Customization Drawer / Modal */}
      {selectedProductForCustomization && (
        <CustomizationModal
          product={selectedProductForCustomization}
          isOpen={true}
          onClose={() => setSelectedProductForCustomization(null)}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout & UPI / Cash / Card Payment Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      {/* Table & QR Selection Modal */}
      <TableQRModal
        isOpen={isTableModalOpen}
        onClose={() => setIsTableModalOpen(false)}
      />

      {/* Coupons & Offers Modal */}
      <OffersModal
        isOpen={isOffersModalOpen}
        onClose={() => setIsOffersModalOpen(false)}
        onApplyCoupon={(code) => applyCoupon(code)}
      />

      {/* WhatsApp & SMS Notification Feed Modal */}
      <WhatsAppSMSModal
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
      />

      {/* Standalone Digital Invoice Modal */}
      <DigitalInvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
