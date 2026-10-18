export type ServiceCategory = 'Haircuts' | 'Beard' | 'Extras' | 'Combos';

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number; // in NGN by default
  category: ServiceCategory;
  durationMinutes: number;
  imageUrl: string;
  isActive: boolean;
}

export type BookingStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

export interface ServiceSnapshot {
  id: string;
  name: string;
  price: number;
  durationMinutes: number;
}

export interface Booking {
  id: string; // e.g., MBS-10492
  customerName: string;
  customerPhone: string;
  customerWhatsApp: string;
  customerEmail?: string;
  notes?: string;
  services: ServiceSnapshot[];
  totalAmount: number;
  currency: string; // "NGN" or "USD"
  date: string; // YYYY-MM-DD
  time: string; // e.g. "10:00 AM"
  barberName: string;
  status: BookingStatus;
  createdAt: string; // ISO
  userId?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  avatarUrl?: string;
  password?: string;
  role?: 'customer' | 'admin';
}

export interface SalonSettings {
  salonName: string;
  tagline: string;
  contactPhone: string;
  whatsappPhone: string;
  address: string;
  openingTime: string; // "08:00"
  closingTime: string; // "20:00"
  slotIntervalMinutes: number; // 60
  currency: 'NGN' | 'USD';
  currencyRateUSDToNGN: number; // e.g. 1500
  barbers: string[];
}

export type AppScreen =
  | 'splash'
  | 'onboarding'
  | 'home'
  | 'services'
  | 'booking'
  | 'my-bookings'
  | 'profile'
  | 'settings'
  | 'admin';
