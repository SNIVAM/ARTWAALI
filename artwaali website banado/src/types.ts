export interface Product {
  id: number;
  name: string;
  category: 'tray' | 'coaster' | 'clock' | 'wall-art' | 'decor';
  price: number;
  age: number;
  desc: string;
  art: string;
  image?: string;
}

export type CategoryFilter = 'all' | 'tray' | 'coaster' | 'clock' | 'wall-art' | 'decor';
export type PriceFilter = 'all' | 'u2k' | 'm' | 'o4k';
export type SortOption = 'new' | 'asc' | 'desc';

export interface BankDetails {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branch: string;
  accountType: 'Current' | 'Savings';
  upiId: string;
  whatsappNumber: string;
  qrCodeImageUrl?: string;
  paymentInstructions?: string;
}

export type OrderStatus =
  | 'Pending'
  | 'Payment Received'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export interface OrderEnquiry {
  id: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  type: string;
  message?: string;
  productName?: string;
  amount?: number;
  status?: OrderStatus;
  statusNote?: string;
  updatedAt?: string;
  paymentStatus?: 'Payment Pending' | 'Payment Verified' | 'Dispatched' | 'Delivered';
  paymentMethod?: string;
  transactionRef?: string;
  deliveryAddress?: string;
}

export interface BossSecurityConfig {
  pinSalt: string;
  pinHash: string;
  biometricsEnabled: boolean;
  biometricCredentialId?: string;
  autoLockMinutes: number;
  failedAttempts: number;
  lockoutUntil: number | null;
}

export interface SiteContent {
  heroTag: string;
  heroHeading: string;
  heroHighlight: string;
  heroSub: string;
  aboutHeading: string;
  aboutHighlight: string;
  aboutP1: string;
  aboutP2: string;
}
