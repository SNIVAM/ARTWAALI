import { BankDetails } from '../types';

export const INITIAL_BANK_DETAILS: BankDetails = {
  accountHolderName: 'ArtWaali Atelier (Priya Sharma)',
  bankName: 'HDFC Bank Ltd.',
  accountNumber: '50200084729104',
  ifscCode: 'HDFC0001234',
  branch: 'Sector 62, Noida, Uttar Pradesh - 201309',
  accountType: 'Current',
  upiId: 'priyanshobra@oksbi',
  whatsappNumber: '9873909050',
  qrCodeImageUrl: '/payment-qr.png',
  paymentInstructions:
    'Scan the official UPI QR code with GPay, PhonePe, Paytm, or BHIM. After making payment, please send the payment screenshot to WhatsApp +91 9873909050 along with your order ID.',
};

export function getStoredBankDetails(): BankDetails {
  try {
    const saved = localStorage.getItem('artwaali_bank_details');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Upgrade from older defaults if necessary
      const effectiveUpi =
        !parsed.upiId || parsed.upiId === 'artwaali@okhdfcbank' || parsed.upiId === '9873909050@bharatpe'
          ? 'priyanshobra@oksbi'
          : parsed.upiId;

      return {
        ...INITIAL_BANK_DETAILS,
        ...parsed,
        upiId: effectiveUpi,
        whatsappNumber: parsed.whatsappNumber || '9873909050',
        qrCodeImageUrl: parsed.qrCodeImageUrl || '/payment-qr.png',
      };
    }
  } catch (e) {
    console.error('Error reading bank details from storage', e);
  }
  return INITIAL_BANK_DETAILS;
}

export function saveStoredBankDetails(details: BankDetails): void {
  try {
    localStorage.setItem('artwaali_bank_details', JSON.stringify(details));
  } catch (e) {
    console.error('Error saving bank details to storage', e);
  }
}
