import { Service, Booking, UserProfile, SalonSettings, ServiceSnapshot } from '../types';
import { formatPrice, formatDate } from '../utils/formatters';

const STORAGE_KEYS = {
  SERVICES: 'mikkys_app_v1_services',
  USERS: 'mikkys_app_v1_users',
  SESSION: 'mikkys_app_v1_session',
  BOOKINGS: 'mikkys_app_v1_bookings',
  SETTINGS: 'mikkys_app_v1_settings',
  ONBOARDING: 'mikkys_app_v1_onboarding',
  ADMIN_SESSION: 'mikkys_app_v1_admin_session',
} as const;

// Generated and high quality local images
const IMAGES = {
  heroFade: '/src/assets/images/hero_fade_cut_1792245250277.jpg',
  barberStyling: '/src/assets/images/barber_crafting_haircut_1792245250760.jpg',
  tools: '/src/assets/images/barber_tools_mat_1792245251059.jpg',
  interior: '/src/assets/images/luxury_barber_interior_1792245252981.jpg',
  beard: '/src/assets/images/beard_trim_grooming_1792245252719.jpg',
};

export { IMAGES };

const DEFAULT_SERVICES: Service[] = [
  {
    id: 'srv-1',
    name: 'Classic Fade',
    description: 'Clean, flawless skin fade with seamless graduation for a sharp finish.',
    price: 5000,
    category: 'Haircuts',
    durationMinutes: 45,
    imageUrl: IMAGES.heroFade,
    isActive: true,
  },
  {
    id: 'srv-2',
    name: 'Taper Fade',
    description: 'Smooth, natural taper around neckline and temples for an elegant silhouette.',
    price: 4000,
    category: 'Haircuts',
    durationMinutes: 40,
    imageUrl: IMAGES.barberStyling,
    isActive: true,
  },
  {
    id: 'srv-3',
    name: 'Low Fade',
    description: 'Subtle and sharp fade starting right above ears, perfect for any occasion.',
    price: 4000,
    category: 'Haircuts',
    durationMinutes: 40,
    imageUrl: IMAGES.heroFade,
    isActive: true,
  },
  {
    id: 'srv-4',
    name: 'High Fade',
    description: 'Bold, high-contrast taper fade crafted for a standout modern masculine look.',
    price: 5000,
    category: 'Haircuts',
    durationMinutes: 45,
    imageUrl: IMAGES.barberStyling,
    isActive: true,
  },
  {
    id: 'srv-5',
    name: 'Line Up',
    description: 'Crisp razor edge line-up and hairline sharpening with hot towel finish.',
    price: 2000,
    category: 'Haircuts',
    durationMinutes: 20,
    imageUrl: IMAGES.heroFade,
    isActive: true,
  },
  {
    id: 'srv-6',
    name: 'Beard Trim',
    description: 'Precision beard sculpting, symmetry line-up, organic oil & conditioning.',
    price: 3000,
    category: 'Beard',
    durationMinutes: 30,
    imageUrl: IMAGES.beard,
    isActive: true,
  },
  {
    id: 'srv-7',
    name: 'Hair Wash & Scalp Massage',
    description: 'Deep refreshing clarifying cleanse, botanical shampoo & relaxing massage.',
    price: 2000,
    category: 'Extras',
    durationMinutes: 20,
    imageUrl: IMAGES.tools,
    isActive: true,
  },
  {
    id: 'srv-8',
    name: 'Haircut & Beard Combo',
    description: 'Full signature transformation: premium fade, beard sculpting, wash and hot towel.',
    price: 7000,
    category: 'Combos',
    durationMinutes: 65,
    imageUrl: IMAGES.beard,
    isActive: true,
  },
];

export const SALON_WHATSAPP_NUMBER = '2349038418469';

const DEFAULT_SETTINGS: SalonSettings = {
  salonName: 'Mikkys Barbing Salon',
  tagline: 'Look Good. Feel Better.',
  contactPhone: '09038418469',
  whatsappPhone: '2349038418469',
  address: 'Plot 14, Admiralty Way, Lekki Phase 1, Lagos',
  openingTime: '08:00',
  closingTime: '20:00',
  slotIntervalMinutes: 60,
  currency: 'NGN',
  currencyRateUSDToNGN: 1500,
  barbers: ['Any Available', 'Mikky (Master Barber)', 'David (Fade Specialist)', 'Sam (Beard & Lineup)'],
};

const DEFAULT_USER: UserProfile = {
  id: 'usr-demo-1',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '08031234567',
  whatsapp: '08031234567',
  avatarUrl: IMAGES.heroFade,
  role: 'customer',
};

const DEFAULT_BOOKINGS: Booking[] = [
  {
    id: 'MBS-84210',
    customerName: 'John Doe',
    customerPhone: '08031234567',
    customerWhatsApp: '08031234567',
    customerEmail: 'john@example.com',
    notes: 'Please keep the top textured and fade to razor on the sides.',
    services: [
      { id: 'srv-1', name: 'Classic Fade', price: 5000, durationMinutes: 45 }
    ],
    totalAmount: 5000,
    currency: 'NGN',
    date: '2026-10-25',
    time: '10:00 AM',
    barberName: 'Mikky (Master Barber)',
    status: 'Confirmed',
    createdAt: new Date().toISOString(),
    userId: 'usr-demo-1',
  },
  {
    id: 'MBS-71932',
    customerName: 'John Doe',
    customerPhone: '08031234567',
    customerWhatsApp: '08031234567',
    customerEmail: 'john@example.com',
    notes: 'Sharp line-up and beard conditioning',
    services: [
      { id: 'srv-6', name: 'Beard Trim', price: 3000, durationMinutes: 30 }
    ],
    totalAmount: 3000,
    currency: 'NGN',
    date: '2026-10-28',
    time: '11:30 AM',
    barberName: 'David (Fade Specialist)',
    status: 'Confirmed',
    createdAt: new Date().toISOString(),
    userId: 'usr-demo-1',
  },
  {
    id: 'MBS-60211',
    customerName: 'Chidi Okafor',
    customerPhone: '08029988776',
    customerWhatsApp: '08029988776',
    customerEmail: 'chidi@example.com',
    notes: 'Pre-wedding photoshoot cut',
    services: [
      { id: 'srv-8', name: 'Haircut & Beard Combo', price: 7000, durationMinutes: 65 }
    ],
    totalAmount: 7000,
    currency: 'NGN',
    date: '2026-10-20',
    time: '02:00 PM',
    barberName: 'Mikky (Master Barber)',
    status: 'Pending',
    createdAt: new Date().toISOString(),
    userId: 'usr-demo-2',
  },
  {
    id: 'MBS-51209',
    customerName: 'John Doe',
    customerPhone: '08031234567',
    customerWhatsApp: '08031234567',
    services: [
      { id: 'srv-7', name: 'Hair Wash & Scalp Massage', price: 2000, durationMinutes: 20 }
    ],
    totalAmount: 2000,
    currency: 'NGN',
    date: '2026-09-15',
    time: '03:00 PM',
    barberName: 'Sam (Beard & Lineup)',
    status: 'Completed',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    userId: 'usr-demo-1',
  }
];

class StorageService {
  constructor() {
    this.initDefaults();
  }

  private safeGet<T>(key: string, fallback: T): T {
    try {
      const item = localStorage.getItem(key);
      if (!item) return fallback;
      return JSON.parse(item) as T;
    } catch (e) {
      console.warn(`Failed reading key ${key} from localStorage:`, e);
      return fallback;
    }
  }

  private safeSet<T>(key: string, value: T): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      // Dispatch custom event to sync within the same page
      window.dispatchEvent(new Event('mikkys_storage_updated'));
      return true;
    } catch (e) {
      console.error(`Failed writing key ${key} to localStorage:`, e);
      return false;
    }
  }

  public initDefaults(): void {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(STORAGE_KEYS.SERVICES)) {
      this.safeSet(STORAGE_KEYS.SERVICES, DEFAULT_SERVICES);
    }
    const currentSettings = this.safeGet<SalonSettings | null>(STORAGE_KEYS.SETTINGS, null);
    if (!currentSettings) {
      this.safeSet(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    } else if (
      !currentSettings.whatsappPhone ||
      currentSettings.whatsappPhone === '08123456789' ||
      currentSettings.whatsappPhone === '09038418469'
    ) {
      currentSettings.whatsappPhone = SALON_WHATSAPP_NUMBER;
      currentSettings.contactPhone = '09038418469';
      this.safeSet(STORAGE_KEYS.SETTINGS, currentSettings);
    }
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      this.safeSet(STORAGE_KEYS.USERS, [DEFAULT_USER]);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SESSION)) {
      this.safeSet(STORAGE_KEYS.SESSION, DEFAULT_USER);
    }
    if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
      this.safeSet(STORAGE_KEYS.BOOKINGS, DEFAULT_BOOKINGS);
    }
  }

  // --- SERVICES ---
  public getServices(): Service[] {
    return this.safeGet<Service[]>(STORAGE_KEYS.SERVICES, DEFAULT_SERVICES);
  }

  public getActiveServices(): Service[] {
    return this.getServices().filter((s) => s.isActive);
  }

  public saveService(serviceData: Partial<Service> & { name: string; price: number }): Service {
    const services = this.getServices();
    if (serviceData.id) {
      const index = services.findIndex((s) => s.id === serviceData.id);
      if (index !== -1) {
        services[index] = { ...services[index], ...serviceData } as Service;
        this.safeSet(STORAGE_KEYS.SERVICES, services);
        return services[index];
      }
    }

    const newService: Service = {
      id: `srv-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: serviceData.name,
      description: serviceData.description || 'Professional styling service.',
      price: serviceData.price,
      category: serviceData.category || 'Haircuts',
      durationMinutes: serviceData.durationMinutes || 45,
      imageUrl: serviceData.imageUrl || IMAGES.heroFade,
      isActive: serviceData.isActive !== false,
    };

    services.push(newService);
    this.safeSet(STORAGE_KEYS.SERVICES, services);
    return newService;
  }

  public toggleServiceStatus(id: string): void {
    const services = this.getServices();
    const service = services.find((s) => s.id === id);
    if (service) {
      service.isActive = !service.isActive;
      this.safeSet(STORAGE_KEYS.SERVICES, services);
    }
  }

  public deleteService(id: string): boolean {
    const services = this.getServices();
    const updated = services.filter((s) => s.id !== id);
    return this.safeSet(STORAGE_KEYS.SERVICES, updated);
  }

  // --- BOOKINGS ---
  public getBookings(): Booking[] {
    return this.safeGet<Booking[]>(STORAGE_KEYS.BOOKINGS, []);
  }

  public getUserBookings(userId?: string): Booking[] {
    const all = this.getBookings();
    if (!userId) {
      const session = this.getSession();
      userId = session?.id;
    }
    if (!userId) return all;
    return all.filter((b) => b.userId === userId || (!b.userId && b.customerEmail === this.getSession()?.email));
  }

  public checkSlotAvailability(date: string, time: string, barberName?: string): boolean {
    const bookings = this.getBookings();
    // A slot is taken if there's an existing non-cancelled booking on the same date and time
    // If barberName is specified and not "Any Available", check barber-specific overlap
    return !bookings.some((b) => {
      if (b.status === 'Cancelled') return false;
      if (b.date !== date || b.time !== time) return false;
      if (barberName && barberName !== 'Any Available' && b.barberName && b.barberName !== 'Any Available') {
        return b.barberName === barberName;
      }
      return true; // occupied
    });
  }

  public createBooking(params: {
    customerName: string;
    customerPhone: string;
    customerWhatsApp: string;
    customerEmail?: string;
    notes?: string;
    selectedServices: Service[];
    date: string;
    time: string;
    barberName: string;
  }): { success: boolean; booking?: Booking; error?: string } {
    if (!params.selectedServices || params.selectedServices.length === 0) {
      return { success: false, error: 'Please select at least one service.' };
    }

    if (!params.date || !params.time) {
      return { success: false, error: 'Please choose an appointment date and time.' };
    }

    if (!params.customerName.trim() || !params.customerPhone.trim() || !params.customerWhatsApp.trim()) {
      return { success: false, error: 'Please fill in required contact information.' };
    }

    // Check availability
    const isAvailable = this.checkSlotAvailability(params.date, params.time, params.barberName);
    if (!isAvailable) {
      return {
        success: false,
        error: 'This time slot is already booked. Please choose another time or barber.',
      };
    }

    // Capture snapshot of services
    const snapshots: ServiceSnapshot[] = params.selectedServices.map((s) => ({
      id: s.id,
      name: s.name,
      price: s.price,
      durationMinutes: s.durationMinutes,
    }));

    const totalAmount = snapshots.reduce((sum, s) => sum + s.price, 0);
    const session = this.getSession();
    const settings = this.getSalonSettings();

    const bookingId = `MBS-${Math.floor(10000 + Math.random() * 90000)}`;

    const newBooking: Booking = {
      id: bookingId,
      customerName: params.customerName.trim(),
      customerPhone: params.customerPhone.trim(),
      customerWhatsApp: params.customerWhatsApp.trim(),
      customerEmail: params.customerEmail?.trim() || session?.email,
      notes: params.notes?.trim(),
      services: snapshots,
      totalAmount,
      currency: settings.currency,
      date: params.date,
      time: params.time,
      barberName: params.barberName || 'Any Available',
      status: 'Pending',
      createdAt: new Date().toISOString(),
      userId: session?.id,
    };

    const bookings = this.getBookings();
    bookings.unshift(newBooking);
    this.safeSet(STORAGE_KEYS.BOOKINGS, bookings);

    return { success: true, booking: newBooking };
  }

  public updateBookingStatus(bookingId: string, status: Booking['status']): boolean {
    const bookings = this.getBookings();
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return false;
    booking.status = status;
    return this.safeSet(STORAGE_KEYS.BOOKINGS, bookings);
  }

  public cancelBooking(bookingId: string): boolean {
    return this.updateBookingStatus(bookingId, 'Cancelled');
  }

  // --- USERS & AUTH ---
  public getUsers(): UserProfile[] {
    return this.safeGet<UserProfile[]>(STORAGE_KEYS.USERS, [DEFAULT_USER]);
  }

  public getSession(): UserProfile | null {
    return this.safeGet<UserProfile | null>(STORAGE_KEYS.SESSION, null);
  }

  public setSession(user: UserProfile | null): void {
    if (user) {
      this.safeSet(STORAGE_KEYS.SESSION, user);
    } else {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
      window.dispatchEvent(new Event('mikkys_storage_updated'));
    }
  }

  public registerUser(name: string, email: string, phone: string, password?: string): UserProfile {
    const users = this.getUsers();
    const existing = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() || u.phone === phone
    );

    if (existing) {
      this.setSession(existing);
      return existing;
    }

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      whatsapp: phone.trim(),
      avatarUrl: IMAGES.heroFade,
      password,
      role: 'customer',
    };

    users.push(newUser);
    this.safeSet(STORAGE_KEYS.USERS, users);
    this.setSession(newUser);
    return newUser;
  }

  public loginUser(identifier: string, _password?: string): { success: boolean; user?: UserProfile; error?: string } {
    const users = this.getUsers();
    const match = users.find(
      (u) =>
        u.email.toLowerCase() === identifier.trim().toLowerCase() ||
        u.phone.trim() === identifier.trim()
    );

    if (match) {
      this.setSession(match);
      return { success: true, user: match };
    }

    // Auto-register demo user if not found for friction-free prototype
    const registered = this.registerUser(
      identifier.includes('@') ? identifier.split('@')[0] : 'Valued Client',
      identifier.includes('@') ? identifier : `${identifier}@demo.com`,
      identifier.includes('@') ? '08000000000' : identifier,
      _password
    );
    return { success: true, user: registered };
  }

  public updateProfile(updated: Partial<UserProfile>): UserProfile | null {
    const session = this.getSession();
    if (!session) return null;

    const merged = { ...session, ...updated };
    this.setSession(merged);

    // Also update in registered users array
    const users = this.getUsers();
    const idx = users.findIndex((u) => u.id === session.id);
    if (idx !== -1) {
      users[idx] = merged;
      this.safeSet(STORAGE_KEYS.USERS, users);
    }
    return merged;
  }

  // --- SALON SETTINGS ---
  public getSalonSettings(): SalonSettings {
    return this.safeGet<SalonSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  }

  public updateSalonSettings(settings: Partial<SalonSettings>): SalonSettings {
    const current = this.getSalonSettings();
    const updated = { ...current, ...settings };
    this.safeSet(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  }

  // --- ONBOARDING ---
  public isOnboardingCompleted(): boolean {
    return this.safeGet<boolean>(STORAGE_KEYS.ONBOARDING, false);
  }

  public setOnboardingCompleted(completed: boolean): void {
    this.safeSet(STORAGE_KEYS.ONBOARDING, completed);
  }

  // --- ADMIN SESSION ---
  public isAdminLoggedIn(): boolean {
    return this.safeGet<boolean>(STORAGE_KEYS.ADMIN_SESSION, false);
  }

  public setAdminLoggedIn(status: boolean): void {
    this.safeSet(STORAGE_KEYS.ADMIN_SESSION, status);
  }

  // --- RESET ALL DATA ---
  public resetAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.SERVICES);
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.ONBOARDING);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
    this.initDefaults();
    window.dispatchEvent(new Event('mikkys_storage_updated'));
  }

  // --- WHATSAPP HELPER ---
  /**
   * Generates a normalized wa.me link.
   * In Nigeria, local numbers start with '0', e.g. 09038418469.
   * Converted to 2349038418469.
   * If already international (e.g. 234... or +1...), cleans symbols.
   */
  public generateWhatsAppUrl(phoneNumber: string, message?: string): string {
    if (!phoneNumber) return '#';
    let clean = phoneNumber.replace(/[^0-9]/g, '');

    // If starts with 0 and 11 digits (Nigerian standard), replace 0 with 234
    if (clean.startsWith('0') && clean.length === 11) {
      clean = '234' + clean.slice(1);
    } else if (clean.length === 10 && !clean.startsWith('234')) {
      clean = '234' + clean;
    }

    let url = `https://wa.me/${clean}`;
    if (message) {
      url += `?text=${encodeURIComponent(message)}`;
    }
    return url;
  }

  public getSalonWhatsAppNumber(): string {
    return this.getSalonSettings()?.whatsappPhone || SALON_WHATSAPP_NUMBER;
  }

  public buildBookingWhatsAppMessage(booking: Booking, currency: string = 'NGN'): string {
    return buildBookingWhatsAppMessage(booking, currency);
  }
}

export function buildBookingWhatsAppMessage(booking: Booking, currency: string = 'NGN'): string {
  const serviceLines = booking.services
    .map((s, idx) => `  ${idx + 1}. ${s.name} (${formatPrice(s.price, currency)})`)
    .join('\n');

  return `✂️ *NEW BOOKING ORDER — MIKKYS BARBING SALON*
----------------------------------------
*Booking ID:* ${booking.id}
*Customer Name:* ${booking.customerName}
*Phone:* ${booking.customerPhone}
*WhatsApp:* ${booking.customerWhatsApp}
${booking.customerEmail ? `*Email:* ${booking.customerEmail}\n` : ''}
📅 *Date:* ${formatDate(booking.date)}
⏰ *Time:* ${booking.time}
💈 *Stylist:* ${booking.barberName}

💇‍♂️ *Selected Services:*
${serviceLines}

💰 *Total Amount:* ${formatPrice(booking.totalAmount, currency)}
${booking.notes ? `\n📝 *Client Notes:* "${booking.notes}"` : ''}
----------------------------------------
Hello Mikky! I have just booked and confirmed this appointment on your salon app. Please reserve my slot and let me know if you need any additional info!`;
}

export const storage = new StorageService();
