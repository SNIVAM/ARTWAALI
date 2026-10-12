import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Download, QrCode as QrIcon, Check, Copy } from 'lucide-react';

interface QRCodeDisplayProps {
  upiId: string;
  accountHolderName: string;
  amount?: number;
  productName?: string;
  whatsappNumber?: string;
  customImageUrl?: string;
  size?: number;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  upiId,
  accountHolderName,
  amount,
  productName,
  whatsappNumber = '9873909050',
  customImageUrl,
  size = 220,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Construct standard UPI intent query
  const upiPayload = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(
    accountHolderName
  )}${amount ? `&am=${amount}` : ''}&cu=INR${
    productName ? `&tn=${encodeURIComponent(`ArtWaali-${productName.slice(0, 20)}`)}` : ''
  }`;

  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(upiPayload, {
      width: 400,
      margin: 2,
      color: {
        dark: '#08121e',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H', // High error correction so center logo doesn't disrupt scanning
    })
      .then((url) => {
        if (isMounted) {
          setQrDataUrl(url);
        }
      })
      .catch((err) => {
        console.error('Failed to generate QR code', err);
      });

    return () => {
      isMounted = false;
    };
  }, [upiPayload]);

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    const link = document.createElement('a');
    link.download = `ArtWaali-UPI-Payment-QR.png`;
    link.href = qrDataUrl || customImageUrl || '/payment-qr.png';
    link.click();
  };

  return (
    <div className="flex flex-col items-center">
      {/* Decorative Frame for the QR Card */}
      <div className="relative p-3 rounded-2xl bg-gradient-to-b from-[#1c140d] via-[#120d09] to-[#0a0705] border border-[#d97706]/40 shadow-[0_15px_40px_rgba(0,0,0,0.8),0_0_25px_rgba(217,119,6,0.15)]">
        {/* Subtle decorative coin accents matching user's QR theme */}
        <div className="absolute -top-1.5 -left-1.5 w-3 h-3 rounded-full bg-gradient-to-tr from-[#C9A84C] to-[#fde047] opacity-60 shadow-sm" />
        <div className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-[#d97706] to-[#f59e0b] opacity-60 shadow-sm" />

        {/* QR Canvas Container */}
        <div
          className="relative bg-white p-2.5 rounded-xl shadow-inner overflow-hidden flex items-center justify-center"
          style={{ width: `${size}px`, height: `${size}px` }}
        >
          {customImageUrl && !qrDataUrl ? (
            <img
              src={customImageUrl}
              alt="ArtWaali UPI QR Code"
              className="w-full h-full object-contain rounded-lg"
            />
          ) : qrDataUrl ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={qrDataUrl}
                alt="Scan to Pay via UPI"
                className="w-full h-full object-contain rounded-lg"
              />
              {/* Center Stylized Bird Emblem Badge matching user's BharatPe QR */}
              <div
                className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-[#1f150d] border-2 border-white shadow-md flex items-center justify-center pointer-events-none"
                title="Official Merchant QR"
              >
                <svg
                  viewBox="0 0 48 48"
                  className="w-6 h-6 text-[#f59e0b]"
                  fill="currentColor"
                >
                  {/* Stylized flying bird / wings logo */}
                  <path d="M12 28 C 16 26, 24 20, 34 14 C 28 20, 26 26, 22 30 C 26 28, 32 26, 38 23 C 30 30, 24 33, 17 34 C 15 32, 13 30, 12 28 Z" />
                  <path d="M18 20 C 22 17, 28 14, 34 11 C 29 16, 26 19, 23 23 Z" opacity="0.8" />
                </svg>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-zinc-400 gap-2">
              <QrIcon className="w-8 h-8 animate-pulse text-[#d97706]" />
              <span className="text-[10px] font-mono">Generating QR...</span>
            </div>
          )}
        </div>

        {/* Amount badge if specific to product */}
        {amount && (
          <div className="mt-2 text-center">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#C9A84C]">
              Scan to Pay Exactly
            </span>
            <div className="text-base font-serif font-bold text-[#7FFFD4]">
              ₹{amount.toLocaleString('en-IN')}
            </div>
          </div>
        )}
      </div>

      {/* Actions below QR */}
      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={handleCopyUPI}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#101c2b] hover:bg-[#1a2b40] border border-[#4DC8C8]/25 text-[#7FFFD4] text-[11px] font-mono transition-colors"
          title="Copy UPI ID"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Copied' : upiId}</span>
        </button>

        {qrDataUrl && (
          <button
            type="button"
            onClick={handleDownloadQR}
            className="flex items-center gap-1 p-1 rounded-lg bg-[#101c2b] hover:bg-[#1a2b40] border border-[#4DC8C8]/25 text-[#7a9ab8] hover:text-[#ddeaf8] text-[11px] transition-colors"
            title="Download QR Image"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <p className="mt-1.5 text-[10px] text-amber-300/80 font-mono tracking-tight text-center">
        Supported: GPay &middot; PhonePe &middot; Paytm &middot; BHIM &middot; Any UPI App
      </p>
    </div>
  );
};
