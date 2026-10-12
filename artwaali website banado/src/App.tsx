import React, { useState, useEffect, useCallback } from 'react';
import { Product, OrderEnquiry, BossSecurityConfig, SiteContent, BankDetails } from './types';
import { INITIAL_PRODUCTS } from './data/products';
import { GallerySection } from './components/GallerySection';
import { INITIAL_ORDERS } from './data/orders';
import { getSecurityConfig, saveSecurityConfig } from './utils/security';
import { getStoredBankDetails, saveStoredBankDetails } from './data/bankDetails';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { ShopSection } from './components/ShopSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { BossAuthModal } from './components/BossAuthModal';
import { BossPanel } from './components/BossPanel';
import { PurchaseModal } from './components/PurchaseModal';
import { Unlock, Lock, Settings } from 'lucide-react';

const INITIAL_CONTENT: SiteContent = {
  heroTag: 'Handcrafted in India \u00b7 Est. 2021',
  heroHeading: 'Where Light\nBecomes Art',
  heroHighlight: 'Art',
  heroSub: 'Each piece is poured with patience, intention, and love \u2014 one-of-a-kind resin artworks for your home and heart.',
  aboutHeading: 'Born from passion,\npoured with care',
  aboutHighlight: 'passion',
  aboutP1: 'ArtWaali was born in 2021 in Noida, Uttar Pradesh, when founder Priya Sharma began experimenting with epoxy resin in her home studio. What started as a weekend hobby quickly became a calling.',
  aboutP2: 'Every piece is handcrafted in small batches using premium non-toxic resins, hand-picked pigments, and natural inclusions like pressed flowers, gold leaf, and semi-precious stones. No two pieces are ever alike.',
};

export default function App() {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('artwaali_products');
      if (saved) {
        const parsed: Product[] = JSON.parse(saved);
        // Show newly added default products to returning visitors too
        const known = new Set(parsed.map((p) => p.id));
        return [...parsed, ...INITIAL_PRODUCTS.filter((p) => !known.has(p.id))];
      }
    } catch (e) {}
    return INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<OrderEnquiry[]>(() => {
    try {
      const saved = localStorage.getItem('artwaali_orders');
      if (saved) {
        const parsed: OrderEnquiry[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(o => ({
            ...o,
            status: o.status || (
              o.paymentStatus === 'Payment Verified' ? 'Payment Received' :
              o.paymentStatus === 'Dispatched' ? 'Shipped' :
              o.paymentStatus === 'Delivered' ? 'Delivered' : 'Pending'
            ),
          }));
        }
      }
    } catch (e) {}
    return INITIAL_ORDERS;
  });

  const [siteContent, setSiteContent] = useState<SiteContent>(() => {
    try {
      const saved = localStorage.getItem('artwaali_content');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_CONTENT;
  });

  const [securityConfig, setSecurityConfig] = useState<BossSecurityConfig>(getSecurityConfig);
  const [bankDetails, setBankDetails] = useState<BankDetails>(getStoredBankDetails);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isBossPanelOpen, setIsBossPanelOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  // Direct checkout purchase modal state
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState<boolean>(false);
  const [selectedProductForPurchase, setSelectedProductForPurchase] = useState<Product | null>(null);

  // Prefill state for enquiry form
  const [prefillMsg, setPrefillMsg] = useState<string>('');
  const [prefillType, setPrefillType] = useState<string>('');

  // Persist products when edited
  const handleUpdateProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    try {
      localStorage.setItem('artwaali_products', JSON.stringify(newProducts));
    } catch (e) {}
  };

  // Update bank details from Boss Mode
  const handleUpdateBankDetails = (newDetails: BankDetails) => {
    setBankDetails(newDetails);
    saveStoredBankDetails(newDetails);
  };

  // Add order enquiry / direct purchase
  const handleAddOrder = (order: OrderEnquiry) => {
    setOrders(prev => {
      const updated = [order, ...prev];
      try {
        localStorage.setItem('artwaali_orders', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleUpdateOrders = (newOrders: OrderEnquiry[]) => {
    setOrders(newOrders);
    try {
      localStorage.setItem('artwaali_orders', JSON.stringify(newOrders));
    } catch (e) {}
  };

  const handleClearOrders = () => {
    setOrders([]);
    try {
      localStorage.removeItem('artwaali_orders');
    } catch (e) {}
  };

  // Handle Buy Now click on a product card
  const handleBuyNow = (product: Product) => {
    setSelectedProductForPurchase(product);
    setIsPurchaseModalOpen(true);
  };

  // Handle successful purchase submission from modal
  const handleConfirmPurchase = (order: OrderEnquiry) => {
    handleAddOrder(order);
  };

  // Persist content updates
  const handleUpdateContent = (newContent: SiteContent) => {
    setSiteContent(newContent);
    try {
      localStorage.setItem('artwaali_content', JSON.stringify(newContent));
    } catch (e) {}
  };

  // Handle product enquire button click
  const handleEnquire = (productName: string) => {
    setPrefillType('Purchase a Listed Item');
    setPrefillMsg(
      `Hi! I'm interested in the "${productName}". Could you please share availability and more details?`
    );
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Secret Master Trigger (Keyboard shortcut: Ctrl+Shift+B or Cmd+Shift+B)
  const handleSecretTrigger = useCallback(() => {
    if (isAuthenticated) {
      setIsBossPanelOpen(true);
    } else {
      setIsAuthModalOpen(true);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'B' || e.key === 'b')) {
        e.preventDefault();
        handleSecretTrigger();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSecretTrigger]);

  // Inactivity Auto-Lock for owner session
  useEffect(() => {
    if (!isAuthenticated) return;

    let timeoutId: NodeJS.Timeout;
    const resetTimer = () => {
      clearTimeout(timeoutId);
      const minutes = securityConfig.autoLockMinutes || 10;
      timeoutId = setTimeout(() => {
        setIsAuthenticated(false);
        setIsBossPanelOpen(false);
        setIsEditMode(false);
      }, minutes * 60 * 1000);
    };

    resetTimer();
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach(evt => window.addEventListener(evt, resetTimer));

    return () => {
      clearTimeout(timeoutId);
      events.forEach(evt => window.removeEventListener(evt, resetTimer));
    };
  }, [isAuthenticated, securityConfig.autoLockMinutes]);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
    setIsBossPanelOpen(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsBossPanelOpen(false);
    setIsEditMode(false);
  };

  return (
    <div className={`min-h-screen bg-[#08121e] text-[#ddeaf8] ${isEditMode ? 'ring-2 ring-amber-500/50' : ''}`}>
      {/* Visual In-Place Edit Mode Banner */}
      {isEditMode && (
        <div
          id="edit-mode-banner"
          className="fixed top-[68px] left-0 right-0 z-30 bg-amber-500 text-black px-4 py-2 text-center text-xs font-semibold flex items-center justify-center gap-3 shadow-lg"
        >
          <span>Live In-Place Edit Mode Active — Click headings or story text on the page to rewrite them</span>
          <button
            onClick={() => setIsEditMode(false)}
            className="px-2.5 py-0.5 rounded bg-black/20 hover:bg-black/30 text-black border border-black/30 font-bold"
          >
            Exit Edit Mode
          </button>
        </div>
      )}

      {/* Navigation */}
      <Navigation
        isAuthenticated={isAuthenticated}
        onOpenBossPanel={() => setIsBossPanelOpen(true)}
        onLogoutBoss={handleLogout}
        onSecretTrigger={handleSecretTrigger}
      />

      {/* Hero Section */}
      <Hero
        content={siteContent}
        isEditMode={isEditMode}
        onUpdateContent={handleUpdateContent}
      />

      {/* Handcrafted Collection Shop Section */}
      <ShopSection
        products={products}
        onEnquire={handleEnquire}
        onBuyNow={handleBuyNow}
        bankDetails={bankDetails}
      />

      {/* Gallery: photos & reels */}
      <GallerySection />

      {/* About The Atelier Section */}
      <AboutSection
        content={siteContent}
        isEditMode={isEditMode}
        onUpdateContent={handleUpdateContent}
      />

      {/* Contact & Custom Commissions Section */}
      <ContactSection
        onAddOrder={handleAddOrder}
        prefillMessage={prefillMsg}
        prefillType={prefillType}
      />

      {/* Footer */}
      <Footer
        onSecretTrigger={handleSecretTrigger}
        isAuthenticated={isAuthenticated}
        onOpenBossPanel={() => setIsBossPanelOpen(true)}
      />

      {/* ONLY VISIBLE TO AUTHENTICATED OWNER: Floating Quick Access Bar */}
      {isAuthenticated && (
        <aside
          id="authenticated-owner-bar"
          aria-label="Owner Quick Bar"
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 p-2 rounded-2xl bg-[#101c2b]/95 border border-[#7FFFD4]/40 shadow-[0_10px_35px_rgba(0,0,0,0.5),0_0_20px_rgba(127,255,212,0.2)] backdrop-blur-xl animate-fadeIn"
        >
          <button
            onClick={() => setIsBossPanelOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#4DC8C8]/20 hover:bg-[#4DC8C8]/30 border border-[#7FFFD4]/30 text-[#7FFFD4] text-xs font-mono font-semibold transition-all hover:scale-[1.02]"
            title="Open Boss Mode Control Center"
          >
            <Unlock className="w-4 h-4 text-[#7FFFD4]" />
            <span>Boss Mode</span>
            <span className="w-2 h-2 rounded-full bg-[#7FFFD4] animate-ping" />
          </button>

          <button
            onClick={handleLogout}
            className="p-2 rounded-xl text-[#7a9ab8] hover:text-red-400 hover:bg-red-950/30 border border-transparent hover:border-red-500/30 transition-all"
            title="Lock & Hide Boss Mode Immediately"
          >
            <Lock className="w-4 h-4" />
          </button>
        </aside>
      )}

      {/* Master Authentication Challenge Modal */}
      <BossAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        securityConfig={securityConfig}
        onUpdateSecurityConfig={(cfg) => {
          setSecurityConfig(cfg);
          saveSecurityConfig(cfg);
        }}
      />

      {/* Boss Mode Privileged Control Center */}
      <BossPanel
        isOpen={isBossPanelOpen}
        onClose={() => setIsBossPanelOpen(false)}
        onLogout={handleLogout}
        products={products}
        onUpdateProducts={handleUpdateProducts}
        orders={orders}
        onClearOrders={handleClearOrders}
        onUpdateOrders={handleUpdateOrders}
        siteContent={siteContent}
        onUpdateSiteContent={handleUpdateContent}
        isEditMode={isEditMode}
        onToggleEditMode={() => setIsEditMode(!isEditMode)}
        securityConfig={securityConfig}
        onUpdateSecurityConfig={(cfg) => {
          setSecurityConfig(cfg);
          saveSecurityConfig(cfg);
        }}
        bankDetails={bankDetails}
        onUpdateBankDetails={handleUpdateBankDetails}
      />

      {/* Direct Purchase & Bank Transfer Checkout Modal */}
      <PurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        product={selectedProductForPurchase}
        bankDetails={bankDetails}
        onConfirmOrder={handleConfirmPurchase}
      />
    </div>
  );
}
