import React, { useState, useMemo } from 'react';
import {
  X,
  Lock,
  ShoppingBag,
  FileText,
  Edit3,
  Shield,
  Download,
  Fingerprint,
  CheckCircle2,
  Key,
  RefreshCw,
  Clock,
  Sparkles,
  Database,
  EyeOff,
  Landmark,
  Building2,
  Check,
  Copy,
  CreditCard,
  Search,
  Filter,
  Truck,
  Package,
  AlertCircle,
  ExternalLink,
  MessageSquare,
  RotateCcw,
  Send,
  Share2,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Calendar,
  TrendingUp,
  BarChart3,
} from 'lucide-react';
import { Product, OrderEnquiry, BossSecurityConfig, SiteContent, BankDetails, OrderStatus } from '../types';
import { INITIAL_ORDERS } from '../data/orders';
import { MonthlyRevenueChart } from './MonthlyRevenueChart';
import {
  generateSalt,
  hashPin,
  registerBiometricCredential,
  saveSecurityConfig,
} from '../utils/security';

export const ORDER_STATUSES: OrderStatus[] = [
  'Pending',
  'Payment Received',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
];

export const STATUS_CONFIG: Record<
  OrderStatus,
  {
    label: string;
    icon: string;
    badgeClass: string;
    selectClass: string;
    dotClass: string;
    description: string;
  }
> = {
  Pending: {
    label: 'Pending',
    icon: '⏳',
    badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    selectClass: 'bg-amber-950/40 text-amber-300 border-amber-500/40',
    dotClass: 'bg-amber-400',
    description: 'Awaiting payment confirmation or order review',
  },
  'Payment Received': {
    label: 'Payment Received',
    icon: '💳',
    badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    selectClass: 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40',
    dotClass: 'bg-emerald-400',
    description: 'Payment verified via bank transfer / UPI UTR',
  },
  Processing: {
    label: 'Processing',
    icon: '🎨',
    badgeClass: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
    selectClass: 'bg-sky-950/40 text-sky-300 border-sky-500/40',
    dotClass: 'bg-sky-400',
    description: 'In studio resin pour, curing, or custom crafting',
  },
  Shipped: {
    label: 'Shipped',
    icon: '📦',
    badgeClass: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    selectClass: 'bg-indigo-950/40 text-indigo-300 border-indigo-500/40',
    dotClass: 'bg-indigo-400',
    description: 'Handed over to courier with tracking reference',
  },
  Delivered: {
    label: 'Delivered',
    icon: '🎉',
    badgeClass: 'bg-teal-500/15 text-[#7FFFD4] border-[#7FFFD4]/30',
    selectClass: 'bg-teal-950/40 text-[#7FFFD4] border-[#7FFFD4]/40',
    dotClass: 'bg-[#7FFFD4]',
    description: 'Safely delivered to customer',
  },
  Cancelled: {
    label: 'Cancelled',
    icon: '❌',
    badgeClass: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    selectClass: 'bg-rose-950/40 text-rose-300 border-rose-500/40',
    dotClass: 'bg-rose-400',
    description: 'Order cancelled or refunded',
  },
};

export const getEffectiveStatus = (order: OrderEnquiry): OrderStatus => {
  if (order.status) return order.status;
  if (order.paymentStatus === 'Payment Verified') return 'Payment Received';
  if (order.paymentStatus === 'Dispatched') return 'Shipped';
  if (order.paymentStatus === 'Delivered') return 'Delivered';
  return 'Pending';
};

interface BossPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
  orders: OrderEnquiry[];
  onClearOrders: () => void;
  onUpdateOrders: (orders: OrderEnquiry[]) => void;
  siteContent: SiteContent;
  onUpdateSiteContent: (content: SiteContent) => void;
  isEditMode: boolean;
  onToggleEditMode: () => void;
  securityConfig: BossSecurityConfig;
  onUpdateSecurityConfig: (cfg: BossSecurityConfig) => void;
  bankDetails: BankDetails;
  onUpdateBankDetails: (details: BankDetails) => void;
}

export const BossPanel: React.FC<BossPanelProps> = ({
  isOpen,
  onClose,
  onLogout,
  products,
  onUpdateProducts,
  orders,
  onClearOrders,
  onUpdateOrders,
  siteContent,
  onUpdateSiteContent,
  isEditMode,
  onToggleEditMode,
  securityConfig,
  onUpdateSecurityConfig,
  bankDetails,
  onUpdateBankDetails,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'orders' | 'products' | 'bank' | 'content' | 'security'>('overview');
  const [productDrafts, setProductDrafts] = useState<Product[]>(products);
  const [bankDraft, setBankDraft] = useState<BankDetails>(bankDetails);
  const [bankSavedNotice, setBankSavedNotice] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinChangeStatus, setPinChangeStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [biometricStatus, setBiometricStatus] = useState<string | null>(null);
  const [isRegisteringBiometrics, setIsRegisteringBiometrics] = useState(false);
  const [appliedNotice, setAppliedNotice] = useState(false);

  // Status tracking state
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | OrderStatus>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<OrderEnquiry | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState('');
  const [statusUpdateToast, setStatusUpdateToast] = useState<{ id: string; status: OrderStatus } | null>(null);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Sync drafts when props change externally
  React.useEffect(() => {
    setProductDrafts(products);
  }, [products]);

  React.useEffect(() => {
    setBankDraft(bankDetails);
  }, [bankDetails]);

  if (!isOpen) return null;

  // Stats calculations
  const totalEnquiries = orders.length;
  const avgPrice = products.length
    ? Math.round(products.reduce((acc, p) => acc + p.price, 0) / products.length)
    : 0;
  const estPipelineValue = totalEnquiries * avgPrice;

  const handlePriceChange = (id: number, price: number) => {
    setProductDrafts(prev =>
      prev.map(p => (p.id === id ? { ...p, price: isNaN(price) ? 0 : price } : p))
    );
  };

  const handleDescChange = (id: number, desc: string) => {
    setProductDrafts(prev => prev.map(p => (p.id === id ? { ...p, desc } : p)));
  };

  const handleApplyProductEdits = () => {
    onUpdateProducts(productDrafts);
    setAppliedNotice(true);
    setTimeout(() => setAppliedNotice(false), 3000);
  };

  const handleChangePin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinChangeStatus(null);

    if (newPin.length < 4) {
      setPinChangeStatus({ type: 'error', message: 'Master PIN must be at least 4 digits or characters.' });
      return;
    }
    if (newPin !== confirmPin) {
      setPinChangeStatus({ type: 'error', message: 'PIN confirmation does not match.' });
      return;
    }

    try {
      const newSalt = generateSalt();
      const newHash = await hashPin(newPin, newSalt);

      const updatedConfig: BossSecurityConfig = {
        ...securityConfig,
        pinSalt: newSalt,
        pinHash: newHash,
        failedAttempts: 0,
        lockoutUntil: null,
      };

      saveSecurityConfig(updatedConfig);
      onUpdateSecurityConfig(updatedConfig);

      setNewPin('');
      setConfirmPin('');
      setPinChangeStatus({
        type: 'success',
        message: 'Master PIN updated successfully! Encrypted with new cryptographic salt & SHA-256 hash.',
      });
    } catch (err) {
      console.error(err);
      setPinChangeStatus({ type: 'error', message: 'Failed to update PIN.' });
    }
  };

  const handleEnrollBiometrics = async () => {
    setIsRegisteringBiometrics(true);
    setBiometricStatus(null);

    const res = await registerBiometricCredential();
    if (res.success && res.credentialId) {
      const updatedConfig: BossSecurityConfig = {
        ...securityConfig,
        biometricsEnabled: true,
        biometricCredentialId: res.credentialId,
      };
      saveSecurityConfig(updatedConfig);
      onUpdateSecurityConfig(updatedConfig);
      setBiometricStatus('Biometric passkey registered successfully on this device! You can now unlock with Touch ID / Face ID.');
    } else {
      setBiometricStatus(res.error || 'Biometric enrollment failed. Please verify browser permissions.');
    }
    setIsRegisteringBiometrics(false);
  };

  // Status counts computation
  const statusCounts = useMemo(() => {
    const counts: Record<OrderStatus | 'all', number> = {
      all: orders.length,
      Pending: 0,
      'Payment Received': 0,
      Processing: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0,
    };
    orders.forEach(o => {
      const st = getEffectiveStatus(o);
      if (counts[st] !== undefined) {
        counts[st] = (counts[st] || 0) + 1;
      }
    });
    return counts;
  }, [orders]);

  // Filtered orders based on status and search query
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const effectiveStatus = getEffectiveStatus(o);
      const matchesStatus = orderStatusFilter === 'all' || effectiveStatus === orderStatusFilter;
      if (!matchesStatus) return false;

      if (!orderSearchQuery.trim()) return true;
      const q = orderSearchQuery.toLowerCase();
      const matchId = (o.id || '').toLowerCase().includes(q);
      const matchName = (o.name || '').toLowerCase().includes(q);
      const matchEmail = (o.email || '').toLowerCase().includes(q);
      const matchPhone = (o.phone || '').toLowerCase().includes(q);
      const matchProduct = (o.productName || '').toLowerCase().includes(q);
      const matchUtr = (o.transactionRef || '').toLowerCase().includes(q);
      const matchNotes = (o.statusNote || '').toLowerCase().includes(q);
      const matchMsg = (o.message || '').toLowerCase().includes(q);
      return matchId || matchName || matchEmail || matchPhone || matchProduct || matchUtr || matchNotes || matchMsg;
    });
  }, [orders, orderStatusFilter, orderSearchQuery]);

  // Owner status update handler
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus, customNote?: string) => {
    const updatedTime = new Date().toLocaleString('en-IN', {
      dateStyle: 'short',
      timeStyle: 'short',
    });

    let legacyPaymentStatus: OrderEnquiry['paymentStatus'] = 'Payment Pending';
    if (newStatus === 'Payment Received') legacyPaymentStatus = 'Payment Verified';
    else if (newStatus === 'Shipped') legacyPaymentStatus = 'Dispatched';
    else if (newStatus === 'Delivered') legacyPaymentStatus = 'Delivered';

    const updated = orders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: newStatus,
          paymentStatus: legacyPaymentStatus,
          updatedAt: updatedTime,
          ...(customNote !== undefined ? { statusNote: customNote } : {}),
        };
      }
      return o;
    });

    onUpdateOrders(updated);

    if (selectedOrderDetails && selectedOrderDetails.id === orderId) {
      setSelectedOrderDetails(prev =>
        prev
          ? {
              ...prev,
              status: newStatus,
              paymentStatus: legacyPaymentStatus,
              updatedAt: updatedTime,
              ...(customNote !== undefined ? { statusNote: customNote } : {}),
            }
          : null
      );
    }

    setStatusUpdateToast({ id: orderId, status: newStatus });
    setTimeout(() => setStatusUpdateToast(null), 3500);
  };

  const handleSaveOrderNote = (orderId: string) => {
    const updatedTime = new Date().toLocaleString('en-IN', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
    const updated = orders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          statusNote: noteDraft.trim(),
          updatedAt: updatedTime,
        };
      }
      return o;
    });
    onUpdateOrders(updated);
    if (selectedOrderDetails && selectedOrderDetails.id === orderId) {
      setSelectedOrderDetails(prev =>
        prev ? { ...prev, statusNote: noteDraft.trim(), updatedAt: updatedTime } : null
      );
    }
    setEditingNoteId(null);
    setNoteDraft('');
  };

  const handleLoadDemoOrders = () => {
    onUpdateOrders(INITIAL_ORDERS);
  };

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleSaveBankDetails = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateBankDetails(bankDraft);
    setBankSavedNotice(true);
    setTimeout(() => setBankSavedNotice(false), 3500);
  };

  const handleExportCSV = (ordersToExport: OrderEnquiry[] = orders, exportLabel = 'order-history') => {
    if (ordersToExport.length === 0) {
      setDownloadNotice('No orders found to download.');
      setTimeout(() => setDownloadNotice(null), 3500);
      return;
    }

    const headers = [
      'Order ID',
      'Order Date/Time',
      'Current Status',
      'Last Updated',
      'Status Notes',
      'Customer Name',
      'Email',
      'Phone',
      'Type',
      'Product',
      'Amount (INR)',
      'Payment Method',
      'Transaction Ref (UTR)',
      'Shipping Address',
      'Customer Message',
    ];
    const rows = ordersToExport.map(o => {
      const st = getEffectiveStatus(o);
      return [
        `"${o.id || ''}"`,
        `"${o.time || ''}"`,
        `"${st}"`,
        `"${o.updatedAt || o.time || ''}"`,
        `"${(o.statusNote || '').replace(/"/g, '""')}"`,
        `"${(o.name || '').replace(/"/g, '""')}"`,
        `"${(o.email || '').replace(/"/g, '""')}"`,
        `"${(o.phone || '').replace(/"/g, '""')}"`,
        `"${(o.type || '').replace(/"/g, '""')}"`,
        `"${(o.productName || '').replace(/"/g, '""')}"`,
        `"${o.amount || ''}"`,
        `"${(o.paymentMethod || '').replace(/"/g, '""')}"`,
        `"${(o.transactionRef || '').replace(/"/g, '""')}"`,
        `"${(o.deliveryAddress || '').replace(/"/g, '""')}"`,
        `"${(o.message || '').replace(/"/g, '""')}"`,
      ];
    });

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `artwaali-${exportLabel}-${timestamp}.csv`;
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadNotice(`Downloaded ${ordersToExport.length} order record${ordersToExport.length === 1 ? '' : 's'} as CSV for record keeping`);
    setTimeout(() => setDownloadNotice(null), 4500);
  };

  return (
    <div
      id="boss-panel-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#04090f]/85 backdrop-blur-md"
    >
      <div
        id="boss-control-center"
        className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-[#101c2b] border border-[#4DC8C8]/30 rounded-2xl shadow-2xl overflow-hidden text-[#ddeaf8]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#4DC8C8]/20 bg-[#08121e]/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#4DC8C8]/15 border border-[#4DC8C8]/30 flex items-center justify-center text-[#7FFFD4]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#7FFFD4]">
                  Boss Mode Control Center
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#7FFFD4]/10 text-[#7FFFD4] border border-[#7FFFD4]/30">
                  <CheckCircle2 className="w-3 h-3" />
                  AUTHENTICATED
                </span>
              </div>
              <p className="text-xs text-[#7a9ab8]">
                Owner Vault &middot; Full Boutique Controls &middot; Zero Plaintext Exposure
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="boss-lock-btn"
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/30 bg-red-950/20 hover:bg-red-950/40 text-red-300 text-xs font-medium transition-colors"
              title="Lock and hide Boss Mode immediately"
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span>Lock &amp; Hide</span>
            </button>
            <button
              id="boss-close-btn"
              onClick={onClose}
              className="p-1.5 text-[#7a9ab8] hover:text-[#7FFFD4] rounded-lg transition-colors"
              title="Close panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 sm:gap-2 px-6 pt-2 border-b border-[#4DC8C8]/20 bg-[#08121e]/40 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: Shield },
            { id: 'analytics', label: 'Revenue Analytics', icon: TrendingUp },
            { id: 'orders', label: `Orders & Enquiries (${orders.length})`, icon: FileText },
            { id: 'products', label: 'Products & Live Pricing', icon: ShoppingBag },
            { id: 'bank', label: 'Store Bank & Payments', icon: Landmark },
            { id: 'content', label: 'In-Place Text Editor', icon: Edit3 },
            { id: 'security', label: 'Security & Biometrics', icon: Fingerprint },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-[#7FFFD4] text-[#7FFFD4] bg-[#4DC8C8]/10 rounded-t-lg'
                    : 'border-transparent text-[#7a9ab8] hover:text-[#ddeaf8] hover:border-[#4DC8C8]/30'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* 1. OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-gradient-to-r from-[#4DC8C8]/10 via-[#7FFFD4]/5 to-transparent border border-[#4DC8C8]/25 text-xs text-[#7a9ab8] leading-relaxed">
                <span className="font-semibold text-[#7FFFD4]">Authenticated Boutique Dashboard: </span>
                This panel gives you complete real-time management of customer enquiries, live pricing, and visual text. Your session is cryptographically guarded with zero plaintext secrets.
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-[#08121e]/80 border border-[#4DC8C8]/20">
                  <div className="text-xs uppercase tracking-wider text-[#7a9ab8] font-mono mb-1">
                    Enquiries Logged
                  </div>
                  <div className="font-serif text-3xl font-medium text-[#C9A84C]">{totalEnquiries}</div>
                  <div className="text-[11px] text-[#7a9ab8] mt-1">Direct from contact form</div>
                </div>

                <div className="p-4 rounded-xl bg-[#08121e]/80 border border-[#4DC8C8]/20">
                  <div className="text-xs uppercase tracking-wider text-[#7a9ab8] font-mono mb-1">
                    Est. Pipeline Value
                  </div>
                  <div className="font-serif text-3xl font-medium text-[#7FFFD4]">
                    ₹{estPipelineValue.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-[#7a9ab8] mt-1">Based on active catalogue</div>
                </div>

                <div className="p-4 rounded-xl bg-[#08121e]/80 border border-[#4DC8C8]/20">
                  <div className="text-xs uppercase tracking-wider text-[#7a9ab8] font-mono mb-1">
                    Active Artworks
                  </div>
                  <div className="font-serif text-3xl font-medium text-[#C9A84C]">{products.length}</div>
                  <div className="text-[11px] text-[#7a9ab8] mt-1">In current storefront</div>
                </div>

                <div className="p-4 rounded-xl bg-[#08121e]/80 border border-[#4DC8C8]/20">
                  <div className="text-xs uppercase tracking-wider text-[#7a9ab8] font-mono mb-1">
                    Average Price
                  </div>
                  <div className="font-serif text-3xl font-medium text-[#7FFFD4]">
                    ₹{avgPrice.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-[#7a9ab8] mt-1">Across all categories</div>
                </div>
              </div>

              {/* Monthly Revenue Visualization (recharts) */}
              <MonthlyRevenueChart orders={orders} />

              {/* Order Status Pipeline Summary Widget */}
              <div className="p-4 rounded-xl bg-[#08121e]/80 border border-[#4DC8C8]/20 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#7FFFD4]" />
                    <h4 className="text-xs uppercase font-mono tracking-wider text-[#ddeaf8] font-semibold">
                      Order &amp; Inquiry Status Pipeline
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleExportCSV(orders, 'order-history')}
                      disabled={orders.length === 0}
                      title="Download complete order history as CSV for record keeping"
                      className="text-xs text-[#7FFFD4] bg-[#4DC8C8]/15 hover:bg-[#4DC8C8]/25 border border-[#4DC8C8]/30 px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-medium transition-colors disabled:opacity-40"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download Orders (CSV)</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs text-[#7FFFD4] hover:underline flex items-center gap-1 font-mono"
                    >
                      <span>Manage Orders ({orders.length})</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                  {ORDER_STATUSES.map(st => {
                    const cfg = STATUS_CONFIG[st];
                    const count = statusCounts[st] || 0;
                    return (
                      <button
                        key={st}
                        onClick={() => {
                          setOrderStatusFilter(st);
                          setActiveTab('orders');
                        }}
                        className={`p-3 rounded-lg border text-left transition-all hover:scale-[1.02] flex flex-col justify-between cursor-pointer ${
                          count > 0
                            ? `${cfg.badgeClass} hover:border-[#7FFFD4]/50`
                            : 'border-[#4DC8C8]/10 bg-[#08121e]/40 text-[#7a9ab8]/60 opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-base">{cfg.icon}</span>
                          <span className="font-mono text-sm font-bold text-[#ddeaf8]">{count}</span>
                        </div>
                        <div className="mt-2">
                          <div className="text-xs font-medium text-[#ddeaf8] leading-tight">{cfg.label}</div>
                          <div className="text-[10px] text-[#7a9ab8] mt-0.5 line-clamp-1">{cfg.description}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#08121e]/50 border border-[#4DC8C8]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-[#ddeaf8]">Strict Stealth Trigger Status</h4>
                  <p className="text-xs text-[#7a9ab8] mt-0.5">
                    Boss Mode trigger is hidden from casual visitors. Activate anytime via secret shortcut <kbd className="px-1.5 py-0.5 bg-[#101c2b] border border-[#4DC8C8]/30 rounded text-[#7FFFD4] font-mono text-[11px]">Ctrl+Shift+B</kbd>.
                  </p>
                </div>
                <button
                  onClick={onLogout}
                  className="px-4 py-2 rounded-lg bg-[#4DC8C8]/20 hover:bg-[#4DC8C8]/30 border border-[#7FFFD4]/30 text-xs font-semibold text-[#7FFFD4] transition-colors"
                >
                  Lock Vault &amp; Hide
                </button>
              </div>
            </div>
          )}

          {/* DEDICATED REVENUE ANALYTICS TAB */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Primary Monthly Revenue Visualization Component */}
              <MonthlyRevenueChart orders={orders} />

              {/* Breakdown Grid: Sales by Artwork & Payment Methods */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Product Sales Breakdown */}
                <div className="p-5 rounded-2xl bg-[#08121e]/80 border border-[#4DC8C8]/20 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#4DC8C8]/15 pb-3">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-[#7FFFD4]" />
                      <h4 className="text-sm font-semibold text-[#ddeaf8]">
                        Sales by Artwork / Item
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono text-[#7a9ab8]">
                      Revenue Contribution
                    </span>
                  </div>

                  {(() => {
                    const productMap = new Map<string, { count: number; total: number }>();
                    orders.forEach(o => {
                      if (o.productName && o.amount) {
                        const cur = productMap.get(o.productName) || { count: 0, total: 0 };
                        cur.count += 1;
                        cur.total += o.amount;
                        productMap.set(o.productName, cur);
                      }
                    });

                    const entries = Array.from(productMap.entries()).sort((a, b) => b[1].total - a[1].total);
                    const grandTotal = entries.reduce((acc, curr) => acc + curr[1].total, 0) || 1;

                    if (entries.length === 0) {
                      return (
                        <p className="text-xs text-[#7a9ab8] italic py-4 text-center">
                          No product sales recorded yet.
                        </p>
                      );
                    }

                    return (
                      <div className="space-y-3">
                        {entries.map(([name, stat]) => {
                          const pct = Math.round((stat.total / grandTotal) * 100);
                          return (
                            <div key={name} className="space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-[#ddeaf8] font-medium truncate max-w-[65%]">
                                  {name}
                                </span>
                                <div className="text-right">
                                  <span className="font-serif font-semibold text-[#7FFFD4]">
                                    ₹{stat.total.toLocaleString('en-IN')}
                                  </span>
                                  <span className="text-[10px] text-[#7a9ab8] ml-1.5 font-mono">
                                    ({stat.count} sold &middot; {pct}%)
                                  </span>
                                </div>
                              </div>
                              <div className="w-full bg-[#101c2b] h-1.5 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-[#4DC8C8] to-[#7FFFD4] rounded-full transition-all duration-500"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>

                {/* Payment Methods & Quick Actions */}
                <div className="p-5 rounded-2xl bg-[#08121e]/80 border border-[#4DC8C8]/20 space-y-4 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-[#4DC8C8]/15 pb-3">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-[#C9A84C]" />
                        <h4 className="text-sm font-semibold text-[#ddeaf8]">
                          Settlement &amp; Payment Methods
                        </h4>
                      </div>
                      <span className="text-[10px] font-mono text-[#7a9ab8]">
                        Channel Distribution
                      </span>
                    </div>

                    {(() => {
                      const methodMap = new Map<string, { count: number; total: number }>();
                      orders.forEach(o => {
                        const m = o.paymentMethod || (o.transactionRef ? 'UPI Direct' : 'Inquiry / Unspecified');
                        const amt = o.amount || 0;
                        const cur = methodMap.get(m) || { count: 0, total: 0 };
                        cur.count += 1;
                        cur.total += amt;
                        methodMap.set(m, cur);
                      });

                      const entries = Array.from(methodMap.entries()).sort((a, b) => b[1].total - a[1].total);

                      return (
                        <div className="grid grid-cols-2 gap-2.5">
                          {entries.map(([method, stat]) => (
                            <div key={method} className="p-3 rounded-xl bg-[#101c2b]/90 border border-[#4DC8C8]/15">
                              <div className="text-[11px] font-medium text-[#ddeaf8] truncate">
                                {method}
                              </div>
                              <div className="font-serif text-base font-semibold text-[#7FFFD4] mt-0.5">
                                ₹{stat.total.toLocaleString('en-IN')}
                              </div>
                              <div className="text-[10px] text-[#7a9ab8] font-mono">
                                {stat.count} transaction{stat.count === 1 ? '' : 's'}
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Quick Export & Management Footer */}
                  <div className="pt-3 border-t border-[#4DC8C8]/15 flex items-center justify-between gap-3 flex-wrap">
                    <div className="text-xs text-[#7a9ab8]">
                      Need an offline ledger for bookkeeping or GST filing?
                    </div>
                    <button
                      onClick={() => handleExportCSV(orders, 'sales-ledger')}
                      disabled={orders.length === 0}
                      className="px-3.5 py-1.5 rounded-lg bg-[#4DC8C8]/20 hover:bg-[#4DC8C8]/30 border border-[#7FFFD4]/30 text-xs font-semibold text-[#7FFFD4] flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export Sales Ledger (CSV)</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. ORDERS & ENQUIRIES TAB WITH FULL STATUS TRACKING */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {/* Header with Title and Global Actions */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-[#ddeaf8]">
                      Orders &amp; Status Tracking
                    </h4>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#4DC8C8]/15 text-[#7FFFD4] border border-[#4DC8C8]/30">
                      {filteredOrders.length} of {orders.length}
                    </span>
                  </div>
                  <p className="text-xs text-[#7a9ab8]">
                    Real-time boutique fulfillment: update order status, track UPI payments, and add dispatch notes.
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {statusUpdateToast && (
                    <span className="text-xs text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded-lg flex items-center gap-1.5 animate-fadeIn">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Order #{statusUpdateToast.id} set to {statusUpdateToast.status}</span>
                    </span>
                  )}
                  {downloadNotice && (
                    <span className="text-xs text-[#7FFFD4] bg-[#4DC8C8]/15 border border-[#7FFFD4]/30 px-2.5 py-1 rounded-lg flex items-center gap-1.5 animate-fadeIn">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#7FFFD4]" />
                      <span>{downloadNotice}</span>
                    </span>
                  )}
                  {orders.length === 0 && (
                    <button
                      onClick={handleLoadDemoOrders}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#4DC8C8]/20 hover:bg-[#4DC8C8]/30 border border-[#7FFFD4]/30 text-xs font-medium text-[#7FFFD4] transition-colors"
                      title="Load sample boutique orders to explore status tracking"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Load Sample Orders</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleExportCSV(orders, 'complete-orders')}
                    disabled={orders.length === 0}
                    title="Download current order history as a CSV file for record keeping"
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#4DC8C8]/20 hover:bg-[#4DC8C8]/30 border border-[#7FFFD4]/40 text-xs font-semibold text-[#7FFFD4] disabled:opacity-40 transition-colors shadow-sm cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Orders</span>
                    <span className="text-[10px] font-mono px-1 rounded bg-[#08121e]/80 text-[#7FFFD4]/80 border border-[#7FFFD4]/30">CSV</span>
                  </button>
                  {orders.length > 0 && (
                    <button
                      onClick={onClearOrders}
                      className="px-3 py-1.5 rounded-lg border border-red-500/30 hover:bg-red-950/30 text-xs text-red-300 transition-colors"
                    >
                      Clear Log
                    </button>
                  )}
                </div>
              </div>

              {/* Status Filter Pills & Search Bar */}
              <div className="space-y-2.5 p-3 rounded-xl bg-[#08121e]/80 border border-[#4DC8C8]/20">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  {/* Status Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                    <button
                      onClick={() => setOrderStatusFilter('all')}
                      className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap ${
                        orderStatusFilter === 'all'
                          ? 'bg-[#7FFFD4]/20 border-[#7FFFD4] text-[#7FFFD4]'
                          : 'border-transparent text-[#7a9ab8] hover:text-[#ddeaf8] hover:bg-[#101c2b]'
                      }`}
                    >
                      All ({statusCounts.all})
                    </button>
                    {ORDER_STATUSES.map(st => {
                      const cfg = STATUS_CONFIG[st];
                      const isSelected = orderStatusFilter === st;
                      const count = statusCounts[st] || 0;
                      return (
                        <button
                          key={st}
                          onClick={() => setOrderStatusFilter(st)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap ${
                            isSelected
                              ? `${cfg.badgeClass} ring-1 ring-[#7FFFD4]/40 font-semibold`
                              : count > 0
                              ? 'border-[#4DC8C8]/20 text-[#ddeaf8] hover:bg-[#101c2b]'
                              : 'border-transparent text-[#7a9ab8]/60 hover:text-[#7a9ab8]'
                          }`}
                        >
                          <span>{cfg.icon}</span>
                          <span>{cfg.label}</span>
                          <span className="font-mono text-[11px] opacity-80">({count})</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Search Input */}
                  <div className="relative min-w-[220px]">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#7a9ab8]" />
                    <input
                      type="text"
                      value={orderSearchQuery}
                      onChange={(e) => setOrderSearchQuery(e.target.value)}
                      placeholder="Search orders, UTR, customer..."
                      className="w-full pl-8 pr-7 py-1.5 bg-[#101c2b] border border-[#4DC8C8]/30 rounded-lg text-xs text-[#ddeaf8] placeholder-[#7a9ab8]/60 focus:outline-none focus:border-[#7FFFD4]"
                    />
                    {orderSearchQuery && (
                      <button
                        onClick={() => setOrderSearchQuery('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[#7a9ab8] hover:text-[#ddeaf8]"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {filteredOrders.length > 0 && filteredOrders.length < orders.length && (
                    <button
                      onClick={() => handleExportCSV(filteredOrders, `filtered-${orderStatusFilter}`)}
                      className="text-[11px] font-mono text-[#7FFFD4] bg-[#4DC8C8]/10 hover:bg-[#4DC8C8]/20 border border-[#7FFFD4]/30 px-2.5 py-1.5 rounded-lg flex items-center gap-1 shrink-0 transition-colors"
                      title="Download currently filtered orders to CSV"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download Filtered ({filteredOrders.length})</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Table or Empty State */}
              {orders.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-[#4DC8C8]/20 rounded-xl bg-[#08121e]/40 space-y-3">
                  <FileText className="w-10 h-10 text-[#7a9ab8]/40 mx-auto" />
                  <div>
                    <p className="text-sm font-serif italic text-[#7a9ab8]">
                      No orders or enquiries logged yet in this session.
                    </p>
                    <p className="text-xs text-[#7a9ab8]/60 mt-1">
                      Direct purchases and bespoke enquiries with bank UTR and address details appear here.
                    </p>
                  </div>
                  <button
                    onClick={handleLoadDemoOrders}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#4DC8C8]/20 hover:bg-[#4DC8C8]/30 border border-[#7FFFD4]/30 text-xs font-medium text-[#7FFFD4] transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Load 5 Sample Boutique Orders</span>
                  </button>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-[#4DC8C8]/20 rounded-xl bg-[#08121e]/40 space-y-2">
                  <Filter className="w-8 h-8 text-[#7a9ab8]/40 mx-auto" />
                  <p className="text-xs text-[#7a9ab8]">
                    No orders match filter <strong className="text-[#ddeaf8]">&ldquo;{orderStatusFilter}&rdquo;</strong>
                    {orderSearchQuery && <> and query <strong className="text-[#ddeaf8]">&ldquo;{orderSearchQuery}&rdquo;</strong></>}.
                  </p>
                  <button
                    onClick={() => {
                      setOrderStatusFilter('all');
                      setOrderSearchQuery('');
                    }}
                    className="text-xs text-[#7FFFD4] hover:underline"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto border border-[#4DC8C8]/20 rounded-xl bg-[#08121e]/60">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#4DC8C8]/20 bg-[#08121e]/80 text-[#7a9ab8] uppercase font-mono text-[10px]">
                        <th className="p-3">Order / Time</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3">Item / Amount</th>
                        <th className="p-3">Payment &amp; UTR</th>
                        <th className="p-3">Shipping / Message</th>
                        <th className="p-3 min-w-[190px]">Status (Interactive)</th>
                        <th className="p-3 min-w-[160px]">Tracking &amp; Notes</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#4DC8C8]/10 font-sans">
                      {filteredOrders.map((o) => {
                        const effectiveStatus = getEffectiveStatus(o);
                        const statusCfg = STATUS_CONFIG[effectiveStatus] || STATUS_CONFIG.Pending;

                        return (
                          <tr key={o.id} className="hover:bg-[#4DC8C8]/5 transition-colors">
                            {/* Time & ID */}
                            <td className="p-3 whitespace-nowrap">
                              <span className="font-mono text-[#7FFFD4] block font-semibold text-[11px]">
                                {o.id}
                              </span>
                              <span className="text-[#7a9ab8] text-[10px] block font-mono">
                                {o.time}
                              </span>
                              <span className="mt-1 inline-block text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#101c2b] text-[#C9A84C] border border-[#C9A84C]/30">
                                {o.type}
                              </span>
                            </td>

                            {/* Customer */}
                            <td className="p-3">
                              <div className="font-medium text-[#ddeaf8]">{o.name}</div>
                              <div className="text-[11px] text-[#7FFFD4] truncate max-w-[160px]">
                                <a href={`mailto:${o.email}`} className="hover:underline flex items-center gap-1">
                                  <Mail className="w-3 h-3 inline text-[#7a9ab8]" />
                                  <span>{o.email}</span>
                                </a>
                              </div>
                              <div className="text-[11px] text-[#7a9ab8] font-mono">
                                {o.phone && o.phone !== '—' ? (
                                  <a href={`tel:${o.phone}`} className="hover:text-[#ddeaf8] flex items-center gap-1">
                                    <Phone className="w-3 h-3 inline text-[#7a9ab8]" />
                                    <span>{o.phone}</span>
                                  </a>
                                ) : (
                                  '—'
                                )}
                              </div>
                            </td>

                            {/* Item / Amount */}
                            <td className="p-3">
                              {o.productName ? (
                                <div>
                                  <span className="font-medium text-[#ddeaf8] block">{o.productName}</span>
                                  <span className="font-serif font-semibold text-[#7FFFD4] text-xs">
                                    ₹{o.amount?.toLocaleString('en-IN')}
                                  </span>
                                </div>
                              ) : (
                                <div>
                                  <span className="font-medium text-[#ddeaf8] block">{o.type}</span>
                                  <span className="text-[11px] text-[#7a9ab8] italic">Bespoke / Custom</span>
                                </div>
                              )}
                            </td>

                            {/* Payment & UTR */}
                            <td className="p-3">
                              {o.transactionRef ? (
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] uppercase font-mono text-[#7a9ab8]">UTR:</span>
                                    <span className="font-mono font-semibold text-[#7FFFD4] text-xs">
                                      {o.transactionRef}
                                    </span>
                                    <button
                                      onClick={() => handleCopyText(o.transactionRef!, `utr-${o.id}`)}
                                      className="text-[#7a9ab8] hover:text-[#7FFFD4] transition-colors"
                                      title="Copy UTR Reference"
                                    >
                                      {copiedKey === `utr-${o.id}` ? (
                                        <Check className="w-3 h-3 text-emerald-400" />
                                      ) : (
                                        <Copy className="w-3 h-3" />
                                      )}
                                    </button>
                                  </div>
                                  <span className="text-[10px] text-[#7a9ab8] block">
                                    {o.paymentMethod || 'UPI / Bank Transfer'}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-[#7a9ab8] italic text-[11px]">Direct Inquiry</span>
                              )}
                            </td>

                            {/* Shipping Address / Customer Message */}
                            <td className="p-3 max-w-xs">
                              {o.deliveryAddress ? (
                                <div className="space-y-1">
                                  <div
                                    className="text-[#ddeaf8] text-[11px] leading-tight line-clamp-2"
                                    title={o.deliveryAddress}
                                  >
                                    <MapPin className="w-3 h-3 inline text-[#C9A84C] mr-1 shrink-0" />
                                    {o.deliveryAddress}
                                  </div>
                                  {o.message && (
                                    <div className="text-[10px] text-[#7a9ab8] italic line-clamp-1" title={o.message}>
                                      &ldquo;{o.message}&rdquo;
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="text-[#ddeaf8]/80 text-[11px] line-clamp-2" title={o.message}>
                                  {o.message}
                                </div>
                              )}
                            </td>

                            {/* Status (Interactive Update for Owner) */}
                            <td className="p-3 whitespace-nowrap">
                              <div className="space-y-1.5">
                                <div className="relative">
                                  <select
                                    value={effectiveStatus}
                                    onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as OrderStatus)}
                                    className={`w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg border focus:outline-none transition-colors cursor-pointer appearance-none pr-7 ${statusCfg.selectClass}`}
                                  >
                                    <option value="Pending" className="bg-[#101c2b] text-amber-300">
                                      ⏳ Pending
                                    </option>
                                    <option value="Payment Received" className="bg-[#101c2b] text-emerald-300">
                                      💳 Payment Received
                                    </option>
                                    <option value="Processing" className="bg-[#101c2b] text-sky-300">
                                      🎨 Processing
                                    </option>
                                    <option value="Shipped" className="bg-[#101c2b] text-indigo-300">
                                      📦 Shipped
                                    </option>
                                    <option value="Delivered" className="bg-[#101c2b] text-[#7FFFD4]">
                                      🎉 Delivered
                                    </option>
                                    <option value="Cancelled" className="bg-[#101c2b] text-rose-300">
                                      ❌ Cancelled
                                    </option>
                                  </select>
                                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#7a9ab8]">
                                    <ChevronRight className="w-3.5 h-3.5 rotate-90" />
                                  </div>
                                </div>
                                <div className="flex items-center justify-between text-[10px] font-mono text-[#7a9ab8]">
                                  <span>{statusCfg.icon} {statusCfg.label}</span>
                                  {o.updatedAt && (
                                    <span title={`Status updated: ${o.updatedAt}`}>
                                      Updated {o.updatedAt.split(',')[0]}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Tracking & Notes */}
                            <td className="p-3 max-w-[200px]">
                              {editingNoteId === o.id ? (
                                <div className="space-y-1">
                                  <input
                                    type="text"
                                    value={noteDraft}
                                    onChange={(e) => setNoteDraft(e.target.value)}
                                    placeholder="AWB, Courier, or note..."
                                    className="w-full p-1 text-[11px] bg-[#101c2b] border border-[#7FFFD4]/50 rounded text-[#ddeaf8] focus:outline-none"
                                    autoFocus
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') handleSaveOrderNote(o.id);
                                      if (e.key === 'Escape') setEditingNoteId(null);
                                    }}
                                  />
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => handleSaveOrderNote(o.id)}
                                      className="px-2 py-0.5 rounded bg-[#4DC8C8]/20 hover:bg-[#4DC8C8]/30 text-[#7FFFD4] text-[10px] font-medium"
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={() => setEditingNoteId(null)}
                                      className="px-1.5 py-0.5 text-[#7a9ab8] text-[10px] hover:text-[#ddeaf8]"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : o.statusNote ? (
                                <div
                                  onClick={() => {
                                    setEditingNoteId(o.id);
                                    setNoteDraft(o.statusNote || '');
                                  }}
                                  className="group cursor-pointer p-1.5 rounded bg-[#101c2b]/70 border border-[#4DC8C8]/15 hover:border-[#4DC8C8]/40 transition-colors"
                                  title="Click to edit tracking or internal status note"
                                >
                                  <div className="text-[11px] text-[#ddeaf8] line-clamp-2 leading-tight">
                                    {o.statusNote}
                                  </div>
                                  <div className="text-[9px] text-[#7a9ab8] group-hover:text-[#7FFFD4] mt-0.5 flex items-center gap-1 font-mono">
                                    <Edit3 className="w-2.5 h-2.5" />
                                    <span>Edit note</span>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  onClick={() => {
                                    setEditingNoteId(o.id);
                                    setNoteDraft('');
                                  }}
                                  className="text-[11px] text-[#7a9ab8] hover:text-[#7FFFD4] flex items-center gap-1 font-mono border border-dashed border-[#4DC8C8]/20 px-2 py-1 rounded hover:border-[#4DC8C8]/40 transition-colors"
                                >
                                  <span>+ Add Tracking Note</span>
                                </button>
                              )}
                            </td>

                            {/* Actions Column */}
                            <td className="p-3 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setSelectedOrderDetails(o)}
                                  className="px-2.5 py-1 rounded bg-[#4DC8C8]/15 hover:bg-[#4DC8C8]/25 border border-[#4DC8C8]/30 text-[#7FFFD4] text-[11px] font-medium transition-colors"
                                  title="View full order details and audit trail"
                                >
                                  Details
                                </button>

                                {o.phone && o.phone !== '—' && (
                                  <a
                                    href={`https://wa.me/${o.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                      `Hi ${o.name}, this is ArtWaali regarding your order #${o.id} (${o.productName || 'Custom Artwork'}). The current status is now *${effectiveStatus}*. ${o.statusNote ? `Note: ${o.statusNote}` : ''}`
                                    )}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-1 rounded bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/30 text-[#25D366] transition-colors"
                                    title="Send WhatsApp update to customer"
                                  >
                                    <MessageSquare className="w-3.5 h-3.5" />
                                  </a>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* 3. PRODUCTS & LIVE PRICING TAB */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-[#7a9ab8]">
                  Adjust item prices (in ₹ INR) or update product descriptions. Changes update live across the storefront.
                </p>
                <div className="flex items-center gap-2">
                  {appliedNotice && (
                    <span className="text-xs text-[#7FFFD4] flex items-center gap-1 animate-pulse">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Applied Live!
                    </span>
                  )}
                  <button
                    id="apply-product-edits-btn"
                    onClick={handleApplyProductEdits}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#4DC8C8] to-[#7FFFD4] text-[#052422] font-semibold text-xs uppercase tracking-wider hover:opacity-95 transition-all shadow-[0_2px_15px_rgba(77,200,200,0.25)]"
                  >
                    Apply Changes Live
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto border border-[#4DC8C8]/20 rounded-xl bg-[#08121e]/60">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#4DC8C8]/20 bg-[#08121e]/80 text-[#7a9ab8] uppercase font-mono text-[10px]">
                      <th className="p-3 w-16">Preview</th>
                      <th className="p-3 w-48">Product Name</th>
                      <th className="p-3 w-36">Price (₹ INR)</th>
                      <th className="p-3">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#4DC8C8]/10">
                    {productDrafts.map((p) => (
                      <tr key={p.id} className="hover:bg-[#4DC8C8]/5 transition-colors">
                        <td className="p-3">
                          {p.image ? (
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-12 h-9 rounded border border-[#4DC8C8]/30 object-cover"
                            />
                          ) : (
                            <div
                              className="w-12 h-9 rounded border border-[#4DC8C8]/30 overflow-hidden"
                              dangerouslySetInnerHTML={{ __html: p.art }}
                            />
                          )}
                        </td>
                        <td className="p-3 font-serif text-sm font-medium text-[#ddeaf8]">
                          {p.name}
                          <span className="block text-[10px] font-mono text-[#C9A84C] uppercase">
                            {p.category}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="relative flex items-center">
                            <span className="absolute left-2.5 text-xs text-[#7a9ab8] font-mono">₹</span>
                            <input
                              type="number"
                              value={p.price}
                              onChange={(e) => handlePriceChange(p.id, parseFloat(e.target.value))}
                              className="w-full pl-6 pr-2.5 py-1.5 bg-[#08121e] border border-[#4DC8C8]/30 rounded-lg text-xs font-mono text-[#7FFFD4] focus:outline-none focus:border-[#7FFFD4]"
                            />
                          </div>
                        </td>
                        <td className="p-3">
                          <textarea
                            rows={2}
                            value={p.desc}
                            onChange={(e) => handleDescChange(p.id, e.target.value)}
                            className="w-full p-2 bg-[#08121e] border border-[#4DC8C8]/30 rounded-lg text-xs text-[#ddeaf8] focus:outline-none focus:border-[#7FFFD4]"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. STORE RECEIVING BANK & PAYMENTS TAB */}
          {activeTab === 'bank' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-gradient-to-r from-[#4DC8C8]/10 via-[#7FFFD4]/5 to-transparent border border-[#4DC8C8]/25 text-xs text-[#7a9ab8] leading-relaxed">
                <span className="font-semibold text-[#7FFFD4]">Direct Payment Destination: </span>
                Enter the official bank account and UPI ID where customer funds must be received when art pieces are purchased. Updates take effect immediately in the customer checkout modal and shop drawer.
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Form */}
                <div className="lg:col-span-7 bg-[#08121e]/70 border border-[#4DC8C8]/20 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#4DC8C8]/15 pb-3">
                    <div className="flex items-center gap-2">
                      <Landmark className="w-4 h-4 text-[#7FFFD4]" />
                      <h4 className="text-sm font-semibold text-[#ddeaf8]">
                        Receiving Bank Account Configuration
                      </h4>
                    </div>
                    {bankSavedNotice && (
                      <span className="text-xs text-[#7FFFD4] flex items-center gap-1 animate-pulse font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Saved &amp; Published Live!
                      </span>
                    )}
                  </div>

                  <form onSubmit={handleSaveBankDetails} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-[11px] font-mono text-[#7a9ab8] uppercase mb-1">
                          Account Holder Name
                        </label>
                        <input
                          type="text"
                          required
                          value={bankDraft.accountHolderName}
                          onChange={(e) =>
                            setBankDraft((prev) => ({ ...prev, accountHolderName: e.target.value }))
                          }
                          placeholder="e.g. ArtWaali Atelier"
                          className="w-full p-2.5 bg-[#101c2b] border border-[#4DC8C8]/30 rounded-lg text-xs font-medium text-[#ddeaf8] focus:outline-none focus:border-[#7FFFD4]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-[#7a9ab8] uppercase mb-1">
                          Bank Name
                        </label>
                        <input
                          type="text"
                          required
                          value={bankDraft.bankName}
                          onChange={(e) =>
                            setBankDraft((prev) => ({ ...prev, bankName: e.target.value }))
                          }
                          placeholder="e.g. HDFC Bank Ltd"
                          className="w-full p-2.5 bg-[#101c2b] border border-[#4DC8C8]/30 rounded-lg text-xs font-medium text-[#ddeaf8] focus:outline-none focus:border-[#7FFFD4]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-[#7a9ab8] uppercase mb-1">
                          Account Number
                        </label>
                        <input
                          type="text"
                          required
                          value={bankDraft.accountNumber}
                          onChange={(e) =>
                            setBankDraft((prev) => ({ ...prev, accountNumber: e.target.value }))
                          }
                          placeholder="e.g. 50200084930129"
                          className="w-full p-2.5 bg-[#101c2b] border border-[#4DC8C8]/30 rounded-lg text-xs font-mono text-[#7FFFD4] focus:outline-none focus:border-[#7FFFD4]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-[#7a9ab8] uppercase mb-1">
                          IFSC Code
                        </label>
                        <input
                          type="text"
                          required
                          value={bankDraft.ifscCode}
                          onChange={(e) =>
                            setBankDraft((prev) => ({ ...prev, ifscCode: e.target.value.toUpperCase() }))
                          }
                          placeholder="e.g. HDFC0001234"
                          className="w-full p-2.5 bg-[#101c2b] border border-[#4DC8C8]/30 rounded-lg text-xs font-mono text-[#7FFFD4] focus:outline-none focus:border-[#7FFFD4]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-[#7a9ab8] uppercase mb-1">
                          Branch &amp; City
                        </label>
                        <input
                          type="text"
                          required
                          value={bankDraft.branch}
                          onChange={(e) =>
                            setBankDraft((prev) => ({ ...prev, branch: e.target.value }))
                          }
                          placeholder="e.g. Indiranagar Branch, Bengaluru"
                          className="w-full p-2.5 bg-[#101c2b] border border-[#4DC8C8]/30 rounded-lg text-xs text-[#ddeaf8] focus:outline-none focus:border-[#7FFFD4]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-[#7a9ab8] uppercase mb-1">
                          Account Type
                        </label>
                        <select
                          value={bankDraft.accountType}
                          onChange={(e) =>
                            setBankDraft((prev) => ({ ...prev, accountType: e.target.value as any }))
                          }
                          className="w-full p-2.5 bg-[#101c2b] border border-[#4DC8C8]/30 rounded-lg text-xs text-[#ddeaf8] focus:outline-none focus:border-[#7FFFD4]"
                        >
                          <option value="Current">Current Account</option>
                          <option value="Savings">Savings Account</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-mono text-[#7a9ab8] uppercase mb-1">
                          UPI ID (Google Pay, PhonePe, Paytm, BHIM)
                        </label>
                        <input
                          type="text"
                          required
                          value={bankDraft.upiId}
                          onChange={(e) =>
                            setBankDraft((prev) => ({ ...prev, upiId: e.target.value }))
                          }
                          placeholder="e.g. priyanshobra@oksbi"
                          className="w-full p-2.5 bg-[#101c2b] border border-[#4DC8C8]/30 rounded-lg text-xs font-mono text-[#7FFFD4] focus:outline-none focus:border-[#7FFFD4]"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-mono text-[#25D366] uppercase mb-1 font-semibold">
                          WhatsApp Number for Payment Screenshots
                        </label>
                        <input
                          type="text"
                          value={bankDraft.whatsappNumber || ''}
                          onChange={(e) =>
                            setBankDraft((prev) => ({ ...prev, whatsappNumber: e.target.value }))
                          }
                          placeholder="e.g. 9873909050"
                          className="w-full p-2.5 bg-[#101c2b] border border-[#25D366]/40 rounded-lg text-xs font-mono text-[#25D366] focus:outline-none focus:border-[#25D366]"
                        />
                        <span className="text-[10px] text-[#7a9ab8] mt-1 block">
                          Customers are directed to send their payment screenshot to this WhatsApp number upon completing checkout.
                        </span>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-mono text-[#7a9ab8] uppercase mb-1">
                          Customer Payment Instructions / Note
                        </label>
                        <textarea
                          rows={2}
                          value={bankDraft.instructions || ''}
                          onChange={(e) =>
                            setBankDraft((prev) => ({ ...prev, instructions: e.target.value }))
                          }
                          placeholder="Instructions displayed to customer after payment..."
                          className="w-full p-2.5 bg-[#101c2b] border border-[#4DC8C8]/30 rounded-lg text-xs text-[#ddeaf8] focus:outline-none focus:border-[#7FFFD4]"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <p className="text-[11px] text-[#7a9ab8]">
                        Changes take effect immediately across customer checkout.
                      </p>
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#4DC8C8] to-[#7FFFD4] text-[#08121e] font-semibold text-xs uppercase tracking-wider hover:opacity-95 transition-all shadow-[0_2px_15px_rgba(77,200,200,0.25)] flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>Save &amp; Publish Bank Details</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* Live Preview */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="text-[11px] font-mono uppercase text-[#7a9ab8] tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
                    <span>Customer Checkout Live Preview</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#08121e] border border-[#4DC8C8]/30 shadow-xl space-y-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#4DC8C8]/5 rounded-full blur-2xl pointer-events-none" />

                    <div className="flex items-center justify-between border-b border-[#4DC8C8]/15 pb-3">
                      <div>
                        <span className="text-[9px] font-mono tracking-widest uppercase text-[#C9A84C] block">
                          Atelier Treasury
                        </span>
                        <h4 className="font-serif text-base text-[#ddeaf8] font-normal">
                          {bankDraft.bankName || 'Your Bank Name'}
                        </h4>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#4DC8C8]/15 text-[#7FFFD4] border border-[#4DC8C8]/30 uppercase">
                        {bankDraft.accountType}
                      </span>
                    </div>

                    <div className="space-y-2.5 text-xs">
                      <div>
                        <span className="text-[10px] text-[#7a9ab8] uppercase font-mono block">Beneficiary</span>
                        <span className="font-medium text-[#ddeaf8]">{bankDraft.accountHolderName || '—'}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-[10px] text-[#7a9ab8] uppercase font-mono block">Account Number</span>
                          <span className="font-mono text-[#7FFFD4] tracking-wider">{bankDraft.accountNumber || '—'}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#7a9ab8] uppercase font-mono block">IFSC Code</span>
                          <span className="font-mono text-[#7FFFD4]">{bankDraft.ifscCode || '—'}</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] text-[#7a9ab8] uppercase font-mono block">UPI ID</span>
                        <div className="flex items-center gap-1.5 p-2 rounded-lg bg-[#101c2b] border border-[#4DC8C8]/20 font-mono text-[#7FFFD4] text-[11px]">
                          <span>{bankDraft.upiId || '—'}</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] text-[#25D366] uppercase font-mono block font-semibold">
                          WhatsApp Verification Desk
                        </span>
                        <div className="flex items-center gap-1.5 p-2 rounded-lg bg-[#25D366]/10 border border-[#25D366]/30 font-mono text-[#25D366] text-[11px]">
                          <span>+{bankDraft.whatsappNumber || '91 9873909050'}</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] text-[#7a9ab8] uppercase font-mono block">Branch</span>
                        <span className="text-[11px] text-[#7a9ab8]">{bankDraft.branch || '—'}</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-[#25D366]/10 border border-[#25D366]/20 text-[10px] text-[#ddeaf8] leading-relaxed">
                      📸 Customers will see: <em>&ldquo;After payment, please send screenshot of your receipt to WhatsApp {bankDraft.whatsappNumber || '9873909050'}&rdquo;</em>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. IN-PLACE CONTENT EDITOR */}
          {activeTab === 'content' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#08121e]/60 border border-[#4DC8C8]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-[#7FFFD4]">Visual In-Place Live Edit Mode</h4>
                  <p className="text-xs text-[#7a9ab8] mt-1">
                    When turned ON, hero headlines, subheadings, and story paragraphs on the website become directly editable by clicking on them.
                  </p>
                </div>
                <button
                  id="toggle-edit-mode-btn"
                  onClick={onToggleEditMode}
                  className={`px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                    isEditMode
                      ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                      : 'bg-[#4DC8C8]/20 border border-[#7FFFD4]/40 text-[#7FFFD4] hover:bg-[#4DC8C8]/30'
                  }`}
                >
                  {isEditMode ? 'Turn OFF In-Place Edit Mode' : 'Turn ON In-Place Edit Mode'}
                </button>
              </div>

              {/* Quick Text Fields */}
              <div className="space-y-4 pt-2">
                <h4 className="text-xs uppercase tracking-wider font-mono text-[#C9A84C]">
                  Direct Text Configuration
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-[#7a9ab8] mb-1 uppercase text-[10px] font-mono">
                      Hero Tagline
                    </label>
                    <input
                      type="text"
                      value={siteContent.heroTag}
                      onChange={(e) => onUpdateSiteContent({ ...siteContent, heroTag: e.target.value })}
                      className="w-full p-2.5 bg-[#08121e] border border-[#4DC8C8]/30 rounded-lg text-[#ddeaf8] focus:outline-none focus:border-[#7FFFD4]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#7a9ab8] mb-1 uppercase text-[10px] font-mono">
                      Hero Headline
                    </label>
                    <input
                      type="text"
                      value={siteContent.heroHeading}
                      onChange={(e) => onUpdateSiteContent({ ...siteContent, heroHeading: e.target.value })}
                      className="w-full p-2.5 bg-[#08121e] border border-[#4DC8C8]/30 rounded-lg text-[#ddeaf8] focus:outline-none focus:border-[#7FFFD4]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#7a9ab8] mb-1 uppercase text-[10px] font-mono">
                    Hero Subtitle
                  </label>
                  <textarea
                    rows={2}
                    value={siteContent.heroSub}
                    onChange={(e) => onUpdateSiteContent({ ...siteContent, heroSub: e.target.value })}
                    className="w-full p-2.5 bg-[#08121e] border border-[#4DC8C8]/30 rounded-lg text-[#ddeaf8] focus:outline-none focus:border-[#7FFFD4]"
                  />
                </div>

                <div>
                  <label className="block text-[#7a9ab8] mb-1 uppercase text-[10px] font-mono">
                    Our Story Paragraph 1
                  </label>
                  <textarea
                    rows={3}
                    value={siteContent.aboutP1}
                    onChange={(e) => onUpdateSiteContent({ ...siteContent, aboutP1: e.target.value })}
                    className="w-full p-2.5 bg-[#08121e] border border-[#4DC8C8]/30 rounded-lg text-[#ddeaf8] focus:outline-none focus:border-[#7FFFD4]"
                  />
                </div>

                <div>
                  <label className="block text-[#7a9ab8] mb-1 uppercase text-[10px] font-mono">
                    Our Story Paragraph 2
                  </label>
                  <textarea
                    rows={3}
                    value={siteContent.aboutP2}
                    onChange={(e) => onUpdateSiteContent({ ...siteContent, aboutP2: e.target.value })}
                    className="w-full p-2.5 bg-[#08121e] border border-[#4DC8C8]/30 rounded-lg text-[#ddeaf8] focus:outline-none focus:border-[#7FFFD4]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 5. SECURITY & BIOMETRICS TAB */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              {/* Strict Security Architecture Banner */}
              <div className="p-4 rounded-xl bg-[#08121e]/80 border border-[#7FFFD4]/30 space-y-2">
                <div className="flex items-center gap-2 text-[#7FFFD4]">
                  <Shield className="w-5 h-5 text-[#7FFFD4]" />
                  <h4 className="font-medium text-sm">Hardened Master Vault Architecture</h4>
                </div>
                <p className="text-xs text-[#7a9ab8] leading-relaxed">
                  Boss Mode has been made strictly private. In accordance with your request:
                </p>
                <ul className="text-xs text-[#ddeaf8]/90 space-y-1.5 list-disc list-inside">
                  <li>
                    <strong className="text-[#7FFFD4]">Zero Plaintext Passwords:</strong> The password cannot be viewed by inspecting code, DevTools, or files. Only a cryptographic salted SHA-256 hash is retained.
                  </li>
                  <li>
                    <strong className="text-[#7FFFD4]">Stealth &amp; Hidden Option:</strong> Casual visitors see no lock icon or indication of Boss Mode. Only you can reveal it using biometrics or the secret master shortcut (<kbd className="px-1 py-0.5 bg-[#101c2b] border border-[#4DC8C8]/30 rounded text-[#7FFFD4] font-mono text-[10px]">Ctrl+Shift+B</kbd>).
                  </li>
                  <li>
                    <strong className="text-[#7FFFD4]">Brute-Force Lockout Defense:</strong> 3 failed attempts activate an exponential progressive cooldown to block automated guessing.
                  </li>
                </ul>
              </div>

              {/* Biometrics Setup */}
              <div className="p-5 rounded-xl bg-[#08121e]/60 border border-[#4DC8C8]/20 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Fingerprint className="w-5 h-5 text-[#7FFFD4]" />
                    <div>
                      <h4 className="text-sm font-semibold text-[#ddeaf8]">Biometric Passkey Authentication</h4>
                      <p className="text-xs text-[#7a9ab8]">
                        Register this device's Touch ID, Face ID, or Windows Hello for 1-touch owner access.
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-[11px] font-mono px-2.5 py-1 rounded-full border ${
                      securityConfig.biometricsEnabled
                        ? 'bg-[#7FFFD4]/15 border-[#7FFFD4]/40 text-[#7FFFD4]'
                        : 'bg-yellow-950/20 border-yellow-500/30 text-yellow-300'
                    }`}
                  >
                    {securityConfig.biometricsEnabled ? 'ENROLLED' : 'NOT ENROLLED'}
                  </span>
                </div>

                {biometricStatus && (
                  <div className="p-3 bg-[#4DC8C8]/10 border border-[#4DC8C8]/30 rounded-lg text-xs text-[#7FFFD4]">
                    {biometricStatus}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleEnrollBiometrics}
                  disabled={isRegisteringBiometrics}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#4DC8C8]/20 hover:bg-[#4DC8C8]/30 border border-[#7FFFD4]/30 text-xs font-semibold text-[#7FFFD4] transition-all disabled:opacity-50"
                >
                  <Fingerprint className="w-4 h-4" />
                  <span>
                    {isRegisteringBiometrics
                      ? 'Registering Device Authenticator...'
                      : securityConfig.biometricsEnabled
                      ? 'Re-Register / Update Biometrics'
                      : 'Enroll Touch ID / Face ID / Windows Hello'}
                  </span>
                </button>
              </div>

              {/* Change Secret Master PIN */}
              <div className="p-5 rounded-xl bg-[#08121e]/60 border border-[#4DC8C8]/20 space-y-4">
                <div className="flex items-center gap-2.5">
                  <Key className="w-5 h-5 text-[#C9A84C]" />
                  <div>
                    <h4 className="text-sm font-semibold text-[#ddeaf8]">Update Secret Master PIN</h4>
                    <p className="text-xs text-[#7a9ab8]">
                      Enter a new Master PIN. A new cryptographic salt will be generated and only the SHA-256 hash will be stored.
                    </p>
                  </div>
                </div>

                {pinChangeStatus && (
                  <div
                    className={`p-3 rounded-lg text-xs border ${
                      pinChangeStatus.type === 'success'
                        ? 'bg-[#4DC8C8]/10 border-[#4DC8C8]/30 text-[#7FFFD4]'
                        : 'bg-red-950/30 border-red-500/30 text-red-300'
                    }`}
                  >
                    {pinChangeStatus.message}
                  </div>
                )}

                <form onSubmit={handleChangePin} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-[#7a9ab8] uppercase mb-1">
                      New Secret PIN
                    </label>
                    <input
                      type="password"
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                      placeholder="At least 4 characters"
                      className="w-full p-2.5 bg-[#08121e] border border-[#4DC8C8]/30 rounded-lg text-xs font-mono text-[#7FFFD4] focus:outline-none focus:border-[#7FFFD4]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-[#7a9ab8] uppercase mb-1">
                      Confirm New PIN
                    </label>
                    <input
                      type="password"
                      value={confirmPin}
                      onChange={(e) => setConfirmPin(e.target.value)}
                      placeholder="Re-enter to confirm"
                      className="w-full p-2.5 bg-[#08121e] border border-[#4DC8C8]/30 rounded-lg text-xs font-mono text-[#7FFFD4] focus:outline-none focus:border-[#7FFFD4]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      disabled={!newPin || !confirmPin}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#4DC8C8]/30 to-[#7FFFD4]/30 border border-[#7FFFD4]/40 hover:from-[#4DC8C8]/40 hover:to-[#7FFFD4]/40 text-[#7FFFD4] text-xs font-semibold uppercase tracking-wider transition-all disabled:opacity-40"
                    >
                      Update Master PIN (Salt &amp; Hash)
                    </button>
                  </div>
                </form>
              </div>

              {/* Immediate Lockout & Hide Option */}
              <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-red-300">Lock Session &amp; Disappear</h4>
                  <p className="text-xs text-red-300/70 mt-0.5">
                    Immediately terminates your authenticated session, wipes memory, and makes Boss Mode completely invisible.
                  </p>
                </div>
                <button
                  onClick={onLogout}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition-colors shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                >
                  Lock &amp; Disappear Now
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Details & Audit Trail Modal */}
        {selectedOrderDetails && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl bg-[#0c1622] border border-[#4DC8C8]/40 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#4DC8C8]/20 bg-[#08121e]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#4DC8C8]/15 border border-[#4DC8C8]/30 flex items-center justify-center text-[#7FFFD4]">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-lg text-[#ddeaf8] font-medium">
                        Order #{selectedOrderDetails.id}
                      </h3>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${STATUS_CONFIG[getEffectiveStatus(selectedOrderDetails)].badgeClass}`}>
                        {STATUS_CONFIG[getEffectiveStatus(selectedOrderDetails)].icon} {STATUS_CONFIG[getEffectiveStatus(selectedOrderDetails)].label}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#7a9ab8]">
                      Logged: {selectedOrderDetails.time} &middot; Type: {selectedOrderDetails.type}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedOrderDetails(null)}
                  className="p-1.5 text-[#7a9ab8] hover:text-[#7FFFD4] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 overflow-y-auto space-y-5 text-xs">
                {/* 1. Status Update Control Box */}
                <div className="p-4 rounded-xl bg-[#101c2b] border border-[#4DC8C8]/25 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono uppercase tracking-wider text-[11px] text-[#C9A84C] font-semibold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      Status Lifecycle Management
                    </span>
                    {selectedOrderDetails.updatedAt && (
                      <span className="text-[10px] text-[#7a9ab8] font-mono">
                        Last Updated: {selectedOrderDetails.updatedAt}
                      </span>
                    )}
                  </div>

                  <p className="text-[#7a9ab8] text-[11px]">
                    Click any status below to immediately update the order lifecycle state:
                  </p>

                  {/* Status Switcher Buttons */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {ORDER_STATUSES.map(st => {
                      const cfg = STATUS_CONFIG[st];
                      const isCurrent = getEffectiveStatus(selectedOrderDetails) === st;
                      return (
                        <button
                          key={st}
                          onClick={() => handleUpdateOrderStatus(selectedOrderDetails.id, st)}
                          className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                            isCurrent
                              ? `${cfg.badgeClass} ring-2 ring-[#7FFFD4]/60 shadow-lg font-bold`
                              : 'border-[#4DC8C8]/15 bg-[#08121e]/60 text-[#ddeaf8] hover:border-[#4DC8C8]/40 hover:bg-[#08121e]'
                          }`}
                        >
                          <span className="flex items-center gap-1.5 text-xs">
                            <span>{cfg.icon}</span>
                            <span>{cfg.label}</span>
                          </span>
                          {isCurrent && <CheckCircle2 className="w-3.5 h-3.5 text-[#7FFFD4]" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Tracking Note Editor */}
                  <div className="pt-2 border-t border-[#4DC8C8]/15 space-y-1.5">
                    <label className="block text-[10px] font-mono uppercase text-[#7a9ab8]">
                      Courier AWB, Dispatch Details, or Internal Note
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        defaultValue={selectedOrderDetails.statusNote || ''}
                        id={`modal-note-input-${selectedOrderDetails.id}`}
                        placeholder="e.g. BlueDart AWB #8492019481, or Resin 2nd coat curing"
                        className="flex-1 px-3 py-1.5 bg-[#08121e] border border-[#4DC8C8]/30 rounded-lg text-xs text-[#ddeaf8] focus:outline-none focus:border-[#7FFFD4]"
                      />
                      <button
                        onClick={() => {
                          const el = document.getElementById(`modal-note-input-${selectedOrderDetails.id}`) as HTMLInputElement;
                          if (el) {
                            handleUpdateOrderStatus(
                              selectedOrderDetails.id,
                              getEffectiveStatus(selectedOrderDetails),
                              el.value.trim()
                            );
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#4DC8C8]/25 hover:bg-[#4DC8C8]/35 border border-[#7FFFD4]/40 text-[#7FFFD4] font-medium text-xs whitespace-nowrap transition-colors"
                      >
                        Save Note
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. Customer & Delivery Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Customer Card */}
                  <div className="p-3.5 rounded-xl bg-[#101c2b] border border-[#4DC8C8]/20 space-y-2">
                    <span className="text-[10px] font-mono uppercase text-[#C9A84C] block font-semibold">
                      Customer Profile
                    </span>
                    <div className="text-sm font-medium text-[#ddeaf8]">{selectedOrderDetails.name}</div>
                    <div className="space-y-1 text-xs">
                      <div>
                        <span className="text-[#7a9ab8]">Email: </span>
                        <a href={`mailto:${selectedOrderDetails.email}`} className="text-[#7FFFD4] hover:underline font-mono">
                          {selectedOrderDetails.email}
                        </a>
                      </div>
                      <div>
                        <span className="text-[#7a9ab8]">Phone: </span>
                        <a href={`tel:${selectedOrderDetails.phone}`} className="text-[#ddeaf8] hover:text-[#7FFFD4] font-mono">
                          {selectedOrderDetails.phone || '—'}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Payment Card */}
                  <div className="p-3.5 rounded-xl bg-[#101c2b] border border-[#4DC8C8]/20 space-y-2">
                    <span className="text-[10px] font-mono uppercase text-[#C9A84C] block font-semibold">
                      Payment &amp; Financials
                    </span>
                    {selectedOrderDetails.amount ? (
                      <div className="text-sm font-serif font-medium text-[#7FFFD4]">
                        ₹{selectedOrderDetails.amount.toLocaleString('en-IN')}
                      </div>
                    ) : (
                      <div className="text-sm text-[#7a9ab8] italic">Bespoke Quote Pending</div>
                    )}
                    <div className="space-y-1 text-xs">
                      <div>
                        <span className="text-[#7a9ab8]">Method: </span>
                        <span className="text-[#ddeaf8]">{selectedOrderDetails.paymentMethod || 'Direct Inquiry'}</span>
                      </div>
                      {selectedOrderDetails.transactionRef && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-[#7a9ab8]">UTR: </span>
                          <span className="font-mono text-[#7FFFD4] font-semibold">
                            {selectedOrderDetails.transactionRef}
                          </span>
                          <button
                            onClick={() => handleCopyText(selectedOrderDetails.transactionRef!, 'modal-utr')}
                            className="text-[#7a9ab8] hover:text-[#7FFFD4]"
                          >
                            {copiedKey === 'modal-utr' ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 3. Delivery Address */}
                {selectedOrderDetails.deliveryAddress && (
                  <div className="p-3.5 rounded-xl bg-[#101c2b] border border-[#4DC8C8]/20 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase text-[#C9A84C] font-semibold flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        Shipping Destination
                      </span>
                      <button
                        onClick={() => handleCopyText(selectedOrderDetails.deliveryAddress!, 'modal-address')}
                        className="text-[10px] font-mono text-[#7FFFD4] hover:underline flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedKey === 'modal-address' ? 'Copied!' : 'Copy Address'}</span>
                      </button>
                    </div>
                    <div className="text-xs text-[#ddeaf8] leading-relaxed">
                      {selectedOrderDetails.deliveryAddress}
                    </div>
                  </div>
                )}

                {/* Customer Message / Notes */}
                {selectedOrderDetails.message && (
                  <div className="p-3.5 rounded-xl bg-[#101c2b] border border-[#4DC8C8]/20 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-[#7a9ab8]">
                      Customer Message / Instructions
                    </span>
                    <div className="text-xs text-[#ddeaf8]/90 italic">
                      &ldquo;{selectedOrderDetails.message}&rdquo;
                    </div>
                  </div>
                )}

                {/* WhatsApp Direct Notification */}
                {selectedOrderDetails.phone && selectedOrderDetails.phone !== '—' && (
                  <div className="p-3.5 rounded-xl bg-[#25D366]/10 border border-[#25D366]/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="text-xs font-semibold text-[#25D366] flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Send WhatsApp Status Notification</span>
                      </div>
                      <p className="text-[11px] text-[#7a9ab8]">
                        Send customer an instant WhatsApp text with their order ID, updated status, and tracking notes.
                      </p>
                    </div>
                    <a
                      href={`https://wa.me/${selectedOrderDetails.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `Hi ${selectedOrderDetails.name}! ArtWaali boutique update for your order #${selectedOrderDetails.id} (${selectedOrderDetails.productName || 'Custom Artwork'}): Current status is now *${getEffectiveStatus(selectedOrderDetails)}*.\n${selectedOrderDetails.statusNote ? `Tracking / Notes: ${selectedOrderDetails.statusNote}\n` : ''}Thank you for supporting handcrafted resin art!`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-[#08121e] font-semibold text-xs transition-colors flex items-center gap-1.5 shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Notify Customer</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-[#4DC8C8]/20 bg-[#08121e] flex justify-end">
                <button
                  onClick={() => setSelectedOrderDetails(null)}
                  className="px-4 py-2 rounded-lg bg-[#4DC8C8]/20 hover:bg-[#4DC8C8]/30 border border-[#7FFFD4]/30 text-xs font-semibold text-[#7FFFD4] transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
