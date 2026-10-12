import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  QrCode,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  ExternalLink,
  MessageCircle,
  Truck,
  Camera,
  Phone,
  CheckCircle2
} from 'lucide-react';
import { Product, BankDetails, OrderEnquiry } from '../types';
import { QRCodeDisplay } from './QRCodeDisplay';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  bankDetails: BankDetails;
  onConfirmOrder: (order: OrderEnquiry) => void;
}

export const PurchaseModal: React.FC<PurchaseModalProps> = ({
  isOpen,
  onClose,
  product,
  bankDetails,
  onConfirmOrder,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [step, setStep] = useState<'checkout' | 'success'>('checkout');

  // Customer Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [paymentMethod] = useState<'UPI Payment'>('UPI Payment');
  const [transactionRef, setTransactionRef] = useState('');
  const [notes, setNotes] = useState('');
  const [completedOrder, setCompletedOrder] = useState<OrderEnquiry | null>(null);

  if (!isOpen || !product) return null;

  const whatsappNum = bankDetails.whatsappNumber || '9873909050';

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleClose = () => {
    setStep('checkout');
    setName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setCity('');
    setPincode('');
    setTransactionRef('');
    setNotes('');
    setCompletedOrder(null);
    onClose();
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim() || !transactionRef.trim()) return;

    const orderId = 'AW-' + Math.floor(100000 + Math.random() * 900000);
    const fullShipping = `${address.trim()}, ${city.trim()} - ${pincode.trim()}`;

    const newOrder: OrderEnquiry = {
      id: orderId,
      time: new Date().toLocaleString('en-IN', {
        dateStyle: 'short',
        timeStyle: 'short',
      }),
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      type: 'Direct Purchase',
      productName: product.name,
      amount: product.price,
      status: 'Pending',
      updatedAt: new Date().toLocaleString('en-IN', {
        dateStyle: 'short',
        timeStyle: 'short',
      }),
      paymentStatus: 'Payment Pending',
      paymentMethod,
      transactionRef: transactionRef.trim(),
      deliveryAddress: fullShipping,
      message: notes.trim() || `Direct purchase for ${product.name} (₹${product.price}). UTR: ${transactionRef.trim()}`,
    };

    onConfirmOrder(newOrder);
    setCompletedOrder(newOrder);
    setStep('success');
  };

  // UPI deep-link URL (works on mobile browsers for GPay, PhonePe, Paytm)
  const upiIntentUrl = `upi://pay?pa=${encodeURIComponent(
    bankDetails.upiId
  )}&pn=${encodeURIComponent(
    bankDetails.accountHolderName
  )}&am=${product.price}&cu=INR&tn=${encodeURIComponent(
    `ArtWaali - ${product.name}`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#0d1825] border border-[#4DC8C8]/30 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(77,200,200,0.15)] overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#4DC8C8]/15 bg-[#101c2b]/90">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#4DC8C8]/15 border border-[#4DC8C8]/30 flex items-center justify-center text-[#7FFFD4]">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-lg text-[#ddeaf8] font-normal">
                {step === 'checkout' ? 'Order with Instant UPI / QR Payment' : 'Order Placed Successfully'}
              </h2>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#C9A84C]">
                Official ArtWaali Studio &middot; Verified UPI
              </span>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-[#7a9ab8] hover:text-[#ddeaf8] hover:bg-[#4DC8C8]/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {step === 'checkout' ? (
          <div className="p-6 space-y-6 max-h-[82vh] overflow-y-auto">
            {/* Product Summary Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#101c2b] border border-[#4DC8C8]/20">
              <div className="flex items-center gap-4">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 rounded-lg shrink-0 border border-[#4DC8C8]/30 bg-[#08121e] object-cover"
                  />
                ) : (
                  <div
                    className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-[#4DC8C8]/30 bg-[#08121e]"
                    dangerouslySetInnerHTML={{ __html: product.art }}
                  />
                )}
                <div>
                  <span className="text-[9px] font-semibold tracking-widest uppercase text-[#C9A84C] block">
                    Selected Artwork
                  </span>
                  <h3 className="font-serif text-lg text-[#ddeaf8] leading-tight font-medium">
                    {product.name}
                  </h3>
                  <span className="text-xs text-[#7a9ab8]">{product.desc}</span>
                </div>
              </div>
              <div className="sm:text-right w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#4DC8C8]/10">
                <span className="text-[10px] uppercase font-mono text-[#7a9ab8] block">Total Amount</span>
                <span className="font-serif text-2xl font-semibold text-[#7FFFD4]">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-[#4DC8C8] block">Free Pan-India Delivery</span>
              </div>
            </div>

            {/* Official Beneficiary UPI & QR Card */}
            <div className="p-5 rounded-xl border border-[#C9A84C]/35 bg-[#C9A84C]/[0.03] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#C9A84C]/20 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#C9A84C]" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#C9A84C] font-mono">
                    ArtWaali Atelier Official UPI Payment Desk
                  </span>
                </div>
                <span className="text-[10px] text-[#7FFFD4] bg-[#08121e] px-2.5 py-1 rounded border border-[#4DC8C8]/25 font-mono">
                  Instant &middot; Google Pay / PhonePe / Paytm / BHIM
                </span>
              </div>

              {/* QR CODE SCANNER & UPI PRESENTATION */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-6 py-2">
                {/* QR Code Presentation Component */}
                <div className="shrink-0">
                  <QRCodeDisplay
                    upiId={bankDetails.upiId}
                    accountHolderName={bankDetails.accountHolderName}
                    amount={product.price}
                    productName={product.name}
                    whatsappNumber={whatsappNum}
                    customImageUrl={bankDetails.qrCodeImageUrl || '/payment-qr.png'}
                    size={200}
                  />
                </div>

                {/* QR instructions & WhatsApp screenshot callout */}
                <div className="space-y-3.5 text-xs text-[#ddeaf8]">
                  <div className="p-3.5 rounded-xl bg-[#08121e] border border-[#4DC8C8]/25 space-y-2">
                    <div className="flex items-center gap-2 text-[#7FFFD4] font-mono text-[11px] font-semibold">
                      <span>1. Scan with any UPI app</span>
                    </div>
                    <p className="text-[#7a9ab8] text-[11px] leading-relaxed">
                      Open <strong className="text-[#ddeaf8]">Google Pay, PhonePe, Paytm, BHIM, or any Banking app</strong> and scan the code above to pay ₹{product.price}.
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[10px] text-[#7a9ab8] uppercase font-mono">UPI ID:</span>
                      <code className="px-2 py-0.5 rounded bg-[#101c2b] text-[#7FFFD4] font-mono text-xs border border-[#4DC8C8]/20">
                        {bankDetails.upiId}
                      </code>
                      <button
                        type="button"
                        onClick={() => handleCopy(bankDetails.upiId, 'upi_id')}
                        className="p-1 text-[#7a9ab8] hover:text-[#7FFFD4]"
                        title="Copy UPI ID"
                      >
                        {copiedField === 'upi_id' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Prominent WhatsApp Screenshot Notice */}
                  <div className="p-3.5 rounded-xl bg-[#25D366]/10 border border-[#25D366]/35 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Camera className="w-4 h-4 text-[#25D366]" />
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#25D366] font-mono">
                        2. Send Payment Screenshot
                      </span>
                    </div>
                    <p className="text-[11px] text-[#ddeaf8]/95 leading-relaxed">
                      After completing payment, please take a screenshot and send it to our WhatsApp number:{' '}
                      <strong className="text-[#25D366] font-mono underline decoration-emerald-500/50">
                        {whatsappNum}
                      </strong>
                    </p>
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => handleCopy(whatsappNum, 'wa_num')}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] text-[11px] font-mono transition-colors"
                      >
                        {copiedField === 'wa_num' ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-300" />
                            <span>Copied WhatsApp No.</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy WhatsApp: {whatsappNum}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {bankDetails.paymentInstructions && (
                <p className="text-[11px] text-[#7a9ab8] leading-relaxed italic pt-1 border-t border-[#4DC8C8]/10">
                  &bull; {bankDetails.paymentInstructions}
                </p>
              )}
            </div>

            {/* Customer Delivery & Verification Form */}
            <form onSubmit={handleSubmitOrder} className="space-y-4">
              <div className="flex items-center gap-2 pb-1 border-b border-[#4DC8C8]/15">
                <Truck className="w-4 h-4 text-[#7FFFD4]" />
                <h4 className="font-serif text-sm text-[#ddeaf8]">
                  Delivery Address &amp; Payment Confirmation
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-[#7a9ab8] mb-1">
                    Your Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aditi Roy"
                    className="w-full p-2.5 rounded-lg bg-[#08121e] border border-[#4DC8C8]/25 text-xs text-[#ddeaf8] focus:outline-none focus:border-[#7FFFD4]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-[#7a9ab8] mb-1">
                    Mobile / WhatsApp (for delivery updates) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full p-2.5 rounded-lg bg-[#08121e] border border-[#4DC8C8]/25 text-xs text-[#ddeaf8] focus:outline-none focus:border-[#7FFFD4]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-[#7a9ab8] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="aditi@example.com"
                    className="w-full p-2.5 rounded-lg bg-[#08121e] border border-[#4DC8C8]/25 text-xs text-[#ddeaf8] focus:outline-none focus:border-[#7FFFD4]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-[#7a9ab8] mb-1">
                    Payment Method
                  </label>
                  <div className="w-full p-2.5 rounded-lg bg-[#08121e] border border-[#4DC8C8]/25 text-xs text-[#7FFFD4] font-medium flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <QrCode className="w-3.5 h-3.5 text-[#7FFFD4]" />
                      <span>UPI (GPay / PhonePe / Paytm / BHIM)</span>
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono font-semibold">Zero Fee &bull; Instant</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-[#7a9ab8] mb-1">
                  Complete Shipping Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Flat/House No., Building, Street Name, Area"
                  className="w-full p-2.5 rounded-lg bg-[#08121e] border border-[#4DC8C8]/25 text-xs text-[#ddeaf8] focus:outline-none focus:border-[#7FFFD4]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-[#7a9ab8] mb-1">
                    City &amp; State <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Bengaluru, Karnataka"
                    className="w-full p-2.5 rounded-lg bg-[#08121e] border border-[#4DC8C8]/25 text-xs text-[#ddeaf8] focus:outline-none focus:border-[#7FFFD4]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-[#7a9ab8] mb-1">
                    Postal PIN Code <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="e.g. 560001"
                    className="w-full p-2.5 rounded-lg bg-[#08121e] border border-[#4DC8C8]/25 text-xs text-[#ddeaf8] focus:outline-none focus:border-[#7FFFD4]"
                  />
                </div>
              </div>

              {/* UTR / Transaction Reference Number */}
              <div className="p-3.5 rounded-xl border border-[#7FFFD4]/30 bg-[#7FFFD4]/5">
                <label className="block text-xs font-mono font-medium text-[#7FFFD4] mb-1">
                  UPI Transaction ID / UTR Reference Number <span className="text-red-400">*</span>
                </label>
                <p className="text-[11px] text-[#7a9ab8] mb-2 leading-tight">
                  Enter the 12-digit UPI reference / transaction ID from your Google Pay, PhonePe, or Paytm receipt after paying ₹{product.price}.
                </p>
                <input
                  type="text"
                  required
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  placeholder="e.g. 425619842103 (12-digit UPI Ref)"
                  className="w-full p-2.5 rounded-lg bg-[#08121e] border border-[#7FFFD4]/40 font-mono text-xs text-[#7FFFD4] placeholder:text-[#7a9ab8]/40 focus:outline-none focus:border-[#7FFFD4]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-[#7a9ab8] mb-1">
                  Special Notes / Gift Wrapping Request (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Please add a handwritten gift note for Mom"
                  className="w-full p-2.5 rounded-lg bg-[#08121e] border border-[#4DC8C8]/25 text-xs text-[#ddeaf8] focus:outline-none focus:border-[#7FFFD4]"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-[#4DC8C8]/30 text-[#7a9ab8] hover:text-[#ddeaf8] text-xs font-medium transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  id="confirm-purchase-transfer-btn"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 rounded-lg bg-gradient-to-r from-[#4DC8C8] to-[#7FFFD4] text-[#08121e] font-semibold text-xs uppercase tracking-wider hover:opacity-95 transition-all shadow-[0_2px_15px_rgba(77,200,200,0.3)] cursor-pointer"
                >
                  <span>Submit Order &amp; Transfer Proof</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* POST-PAYMENT SUCCESS SCREEN WITH PROMINENT WHATSAPP SCREENSHOT MESSAGE */
          <div className="p-6 sm:p-8 text-center space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="w-16 h-16 rounded-full bg-[#7FFFD4]/15 border border-[#7FFFD4]/40 flex items-center justify-center text-[#7FFFD4] mx-auto animate-bounce">
              <Sparkles className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-[#C9A84C]">
                Order Reference: {completedOrder?.id}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#ddeaf8]">
                Thank You for Supporting Handcrafted Art!
              </h3>
              <p className="text-xs text-[#7a9ab8] max-w-md mx-auto">
                We have registered your order for{' '}
                <strong className="text-[#7FFFD4]">{product.name}</strong>.
              </p>
            </div>

            {/* MANDATORY / PROMINENT WHATSAPP PAYMENT SCREENSHOT CALLOUT BOX */}
            <div className="max-w-lg mx-auto p-5 rounded-2xl bg-gradient-to-b from-[#25D366]/20 via-[#102418] to-[#0a170f] border-2 border-[#25D366] shadow-[0_10px_35px_rgba(37,211,102,0.25)] text-left space-y-3 relative overflow-hidden">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-[#08121e] shrink-0 shadow-lg">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-emerald-400 block">
                    Important Step to Confirm Dispatch
                  </span>
                  <h4 className="font-serif text-base sm:text-lg font-semibold text-white">
                    Send Payment Screenshot to WhatsApp
                  </h4>
                </div>
              </div>

              <p className="text-xs text-[#e2fbe8] leading-relaxed">
                Please send the screenshot of your payment receipt to our official WhatsApp number:{' '}
                <strong className="text-[#7FFFD4] font-mono text-sm tracking-wider">
                  +91 {whatsappNum}
                </strong>
                . Our studio team will match your UTR (<strong>{completedOrder?.transactionRef}</strong>) and confirm packaging within moments!
              </p>

              {/* Direct WhatsApp Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
                <a
                  href={`https://wa.me/91${whatsappNum}?text=${encodeURIComponent(
                    `Hi ArtWaali! I have transferred ₹${product.price} for "${product.name}".\n\n` +
                    `• Order ID: ${completedOrder?.id}\n` +
                    `• UTR / UPI Ref: ${completedOrder?.transactionRef}\n` +
                    `• Customer Name: ${completedOrder?.name}\n\n` +
                    `Attaching my payment screenshot here!`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-[#08121e] font-bold text-xs uppercase tracking-wider shadow-lg transition-all hover:scale-[1.02]"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Send Screenshot on WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={() => handleCopy(whatsappNum, 'copy_wa_final')}
                  className="w-full sm:w-auto px-4 py-3 rounded-xl bg-[#08121e] border border-[#25D366]/40 hover:border-[#25D366] text-[#7FFFD4] text-xs font-mono flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copiedField === 'copy_wa_final' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied: {whatsappNum}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy {whatsappNum}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Order Details Receipt Box */}
            <div className="max-w-md mx-auto p-4 rounded-xl bg-[#101c2b] border border-[#4DC8C8]/20 text-left space-y-2.5 text-xs">
              <div className="flex justify-between border-b border-[#4DC8C8]/15 pb-2">
                <span className="text-[#7a9ab8]">Order Reference:</span>
                <span className="font-mono font-semibold text-[#7FFFD4]">{completedOrder?.id}</span>
              </div>
              <div className="flex justify-between border-b border-[#4DC8C8]/15 pb-2">
                <span className="text-[#7a9ab8]">Item:</span>
                <span className="text-[#ddeaf8] font-medium">{product.name}</span>
              </div>
              <div className="flex justify-between border-b border-[#4DC8C8]/15 pb-2">
                <span className="text-[#7a9ab8]">Total Amount:</span>
                <span className="font-semibold text-[#7FFFD4]">₹{product.price.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between border-b border-[#4DC8C8]/15 pb-2">
                <span className="text-[#7a9ab8]">Submitted UTR / Ref:</span>
                <span className="font-mono text-[#ddeaf8]">{completedOrder?.transactionRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7a9ab8]">Shipping To:</span>
                <span className="text-[#ddeaf8] text-right truncate max-w-[200px]">{completedOrder?.deliveryAddress}</span>
              </div>
            </div>

            {/* Done Button */}
            <div className="pt-2">
              <button
                onClick={handleClose}
                className="px-8 py-2.5 rounded-xl border border-[#4DC8C8]/30 hover:bg-[#4DC8C8]/10 text-xs font-medium text-[#ddeaf8] transition-colors"
              >
                Close &amp; Back to Gallery
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
