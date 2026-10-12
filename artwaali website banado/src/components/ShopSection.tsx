import React, { useState, useMemo } from 'react';
import { Product, CategoryFilter, PriceFilter, SortOption, BankDetails } from '../types';
import { Filter, ArrowUpDown, ShoppingBag, ShieldCheck, QrCode, MessageCircle, Camera } from 'lucide-react';

interface ShopSectionProps {
  products: Product[];
  onEnquire: (productName: string) => void;
  onBuyNow: (product: Product) => void;
  bankDetails: BankDetails;
}

const CATEGORIES: { id: CategoryFilter; label: string }[] = [
  { id: 'all', label: 'All Pieces' },
  { id: 'tray', label: 'Trays' },
  { id: 'coaster', label: 'Coasters' },
  { id: 'clock', label: 'Clocks' },
  { id: 'wall-art', label: 'Wall Art' },
  { id: 'decor', label: 'Décor' },
];

const PRICES: { id: PriceFilter; label: string }[] = [
  { id: 'all', label: 'All Prices' },
  { id: 'u2k', label: 'Under ₹2,000' },
  { id: 'm', label: '₹2,000 – ₹4,000' },
  { id: 'o4k', label: 'Above ₹4,000' },
];

const categoryDisplayMap: Record<string, string> = {
  tray: 'Tray',
  coaster: 'Coasters',
  clock: 'Clock',
  'wall-art': 'Wall Art',
  decor: 'Décor',
};

export const ShopSection: React.FC<ShopSectionProps> = ({
  products,
  onEnquire,
  onBuyNow,
  bankDetails,
}) => {
  const [selectedCat, setSelectedCat] = useState<CategoryFilter>('all');
  const [selectedPrice, setSelectedPrice] = useState<PriceFilter>('all');
  const [selectedSort, setSelectedSort] = useState<SortOption>('new');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [showBankDetailsInfo, setShowBankDetailsInfo] = useState(false);

  const filteredProducts = useMemo(() => {
    let list = products.filter((p) => {
      const matchCat = selectedCat === 'all' || p.category === selectedCat;
      let matchPrice = true;
      if (selectedPrice === 'u2k') matchPrice = p.price < 2000;
      else if (selectedPrice === 'm') matchPrice = p.price >= 2000 && p.price <= 4000;
      else if (selectedPrice === 'o4k') matchPrice = p.price > 4000;
      return matchCat && matchPrice;
    });

    if (selectedSort === 'asc') list.sort((a, b) => a.price - b.price);
    else if (selectedSort === 'desc') list.sort((a, b) => b.price - a.price);
    else list.sort((a, b) => b.age - a.age);

    return list;
  }, [products, selectedCat, selectedPrice, selectedSort]);

  return (
    <section id="shop" className="py-20 px-6 sm:px-12 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <span className="text-[10px] font-medium tracking-[0.24em] uppercase text-[#C9A84C] block mb-2">
            The Collection
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-light text-[#ddeaf8]">
            Explore <em className="italic text-[#7FFFD4]">Handcrafted</em> Pieces
          </h2>
        </div>

        {/* UPI Details Quick Info Pill */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowBankDetailsInfo(!showBankDetailsInfo)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#101c2b] border border-[#4DC8C8]/30 hover:border-[#7FFFD4]/60 text-xs text-[#7FFFD4] transition-all"
          >
            <QrCode className="w-3.5 h-3.5 text-[#C9A84C]" />
            <span>Store UPI &amp; WhatsApp Details</span>
            <span className="text-[10px] text-[#7a9ab8]">{showBankDetailsInfo ? '▲' : '▼'}</span>
          </button>
        </div>
      </div>

      {/* Collapsible Verified UPI Information Drawer */}
      {showBankDetailsInfo && (
        <div className="mb-8 p-5 rounded-2xl bg-[#101c2b]/95 border border-[#C9A84C]/30 animate-fadeIn">
          <div className="flex items-center justify-between gap-4 mb-3 pb-2 border-b border-[#C9A84C]/15">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C9A84C]" />
              <span className="text-xs font-mono uppercase tracking-wider text-[#C9A84C] font-semibold">
                Verified Store UPI for Direct Artwork Purchases
              </span>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono">Instant &bull; Zero Gateway Surcharge</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-2.5 rounded-lg bg-[#08121e] border border-[#4DC8C8]/15">
              <span className="text-[9px] uppercase font-mono text-[#7a9ab8] block">Verified Payee</span>
              <span className="text-xs font-medium text-[#ddeaf8]">{bankDetails.accountHolderName}</span>
            </div>

            <div className="p-2.5 rounded-lg bg-[#08121e] border border-[#7FFFD4]/30">
              <span className="text-[9px] uppercase font-mono text-[#7a9ab8] block">Official UPI ID</span>
              <span className="text-xs font-mono font-semibold text-[#7FFFD4]">{bankDetails.upiId}</span>
            </div>

            <div className="p-2.5 rounded-lg bg-[#08121e] border border-[#25D366]/30">
              <span className="text-[9px] uppercase font-mono text-[#7a9ab8] block">WhatsApp Order Desk</span>
              <span className="text-xs font-mono font-semibold text-[#25D366]">+{bankDetails.whatsappNumber || '91 9873909050'}</span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-[#C9A84C]/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-[#ddeaf8]">
              <Camera className="w-4 h-4 text-[#25D366] shrink-0" />
              <span className="text-[11px]">
                📸 After UPI transfer, send payment screenshot to WhatsApp:{' '}
                <strong className="text-[#25D366] font-mono">+{bankDetails.whatsappNumber || '91 9873909050'}</strong>
              </span>
            </div>
            <a
              href={`https://wa.me/91${bankDetails.whatsappNumber || '9873909050'}?text=${encodeURIComponent('Hi ArtWaali! I want to verify an artwork payment.')}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/30 text-[#25D366] font-mono text-[11px] transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp: {bankDetails.whatsappNumber || '9873909050'}</span>
            </a>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="flex flex-col lg:flex-row gap-10 items-start">
        {/* Mobile Filter Toggle */}
        <div className="w-full lg:hidden">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="w-full flex items-center justify-between p-3.5 rounded-lg bg-[#101c2b] border border-[#4DC8C8]/25 text-xs uppercase tracking-wider text-[#ddeaf8]"
          >
            <span className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#7FFFD4]" />
              Filter &amp; Sort Collection
            </span>
            <span className="text-[#7FFFD4] text-xs font-mono">{mobileFilterOpen ? '▲ Close' : '▼ View'}</span>
          </button>
        </div>

        {/* Sidebar Filters */}
        <aside
          className={`w-full lg:w-56 shrink-0 lg:sticky lg:top-24 space-y-6 ${
            mobileFilterOpen ? 'block' : 'hidden lg:block'
          }`}
        >
          {/* Category Filter */}
          <div>
            <span className="text-[9px] font-semibold tracking-[0.22em] uppercase text-[#C9A84C] block mb-3 font-mono">
              Category
            </span>
            <div className="flex flex-wrap lg:flex-col gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCat(cat.id)}
                  className={`text-left px-3 py-1.5 rounded text-xs transition-all ${
                    selectedCat === cat.id
                      ? 'text-[#7FFFD4] bg-[#4DC8C8]/15 border border-[#4DC8C8]/40 font-medium'
                      : 'text-[#7a9ab8] hover:text-[#ddeaf8] hover:bg-[#101c2b]/60'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <hr className="border-[#4DC8C8]/15" />

          {/* Price Range Filter */}
          <div>
            <span className="text-[9px] font-semibold tracking-[0.22em] uppercase text-[#C9A84C] block mb-3 font-mono">
              Price Range
            </span>
            <div className="flex flex-wrap lg:flex-col gap-1.5">
              {PRICES.map((pr) => (
                <button
                  key={pr.id}
                  onClick={() => setSelectedPrice(pr.id)}
                  className={`text-left px-3 py-1.5 rounded text-xs transition-all ${
                    selectedPrice === pr.id
                      ? 'text-[#7FFFD4] bg-[#4DC8C8]/15 border border-[#4DC8C8]/40 font-medium'
                      : 'text-[#7a9ab8] hover:text-[#ddeaf8] hover:bg-[#101c2b]/60'
                  }`}
                >
                  {pr.label}
                </button>
              ))}
            </div>
          </div>

          <hr className="border-[#4DC8C8]/15" />

          {/* Sort By Dropdown */}
          <div>
            <label
              htmlFor="sort-select"
              className="text-[9px] font-semibold tracking-[0.22em] uppercase text-[#C9A84C] block mb-2 font-mono flex items-center gap-1.5"
            >
              <ArrowUpDown className="w-3 h-3" />
              Sort By
            </label>
            <select
              id="sort-select"
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value as SortOption)}
              className="w-full bg-[#101c2b] border border-[#4DC8C8]/25 text-xs text-[#ddeaf8] p-2.5 rounded focus:outline-none focus:border-[#7FFFD4]"
            >
              <option value="new">Newest Additions</option>
              <option value="asc">Price: Low to High</option>
              <option value="desc">Price: High to Low</option>
            </select>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1 w-full">
          <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#4DC8C8]/15 text-xs text-[#7a9ab8]">
            <span>
              Showing <strong className="text-[#7FFFD4]">{filteredProducts.length}</strong> piece
              {filteredProducts.length !== 1 ? 's' : ''}
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-[#4DC8C8]/20 rounded-2xl">
              <p className="font-serif italic text-lg text-[#7a9ab8]">
                No artworks match your selected filters.
              </p>
              <button
                onClick={() => {
                  setSelectedCat('all');
                  setSelectedPrice('all');
                }}
                className="mt-3 text-xs text-[#7FFFD4] underline hover:opacity-80"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className="group relative bg-[#101c2b]/85 border border-[#4DC8C8]/20 rounded-xl overflow-hidden backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_45px_rgba(0,0,0,0.4),0_0_20px_rgba(77,200,200,0.15)] hover:border-[#4DC8C8]/50"
                >
                  {/* Artwork Container */}
                  {p.image ? (
                    <div className="w-full aspect-[5/4] overflow-hidden bg-[#08121e]">
                      <img
                        src={p.image}
                        alt={p.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div
                      className="w-full aspect-[5/4] overflow-hidden bg-[#08121e]"
                      dangerouslySetInnerHTML={{ __html: p.art }}
                    />
                  )}

                  {/* Info */}
                  <div className="p-5">
                    <span className="text-[9px] font-semibold tracking-[0.2em] uppercase text-[#C9A84C] block mb-1">
                      {categoryDisplayMap[p.category] || p.category}
                    </span>
                    <h3 className="font-serif text-xl font-normal text-[#ddeaf8] mb-2 leading-snug group-hover:text-[#7FFFD4] transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-xs text-[#7a9ab8] leading-relaxed mb-4 line-clamp-2">
                      {p.desc}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-[#4DC8C8]/15 gap-2">
                      <div className="font-serif text-xl sm:text-2xl font-medium text-[#7FFFD4]">
                        ₹{p.price.toLocaleString('en-IN')}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onEnquire(p.name)}
                          className="px-2.5 py-1.5 rounded border border-[#4DC8C8]/25 hover:border-[#7FFFD4]/50 text-[10px] uppercase tracking-wider text-[#7a9ab8] hover:text-[#ddeaf8] hover:bg-[#4DC8C8]/10 transition-all font-medium"
                        >
                          Enquire
                        </button>
                        <button
                          onClick={() => onBuyNow(p)}
                          className="px-3 py-1.5 rounded bg-gradient-to-r from-[#4DC8C8] to-[#7FFFD4] text-[#08121e] text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold hover:opacity-95 transition-all shadow-[0_2px_10px_rgba(77,200,200,0.25)] flex items-center gap-1"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>Buy Now</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
