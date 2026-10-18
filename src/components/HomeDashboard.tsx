import React from 'react';
import { Service, Booking, UserProfile, AppScreen } from '../types';
import { formatPrice, formatDate } from '../utils/formatters';
import { IMAGES, storage } from '../services/storage';
import {
  Calendar,
  Scissors,
  BookmarkCheck,
  User,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Clock,
  MapPin,
  Instagram,
  Facebook,
  Phone,
  MessageCircle,
} from 'lucide-react';

interface HomeDashboardProps {
  user: UserProfile | null;
  services: Service[];
  bookings: Booking[];
  currency: string;
  onNavigate: (screen: AppScreen) => void;
  onSelectService: (service: Service) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  user,
  services,
  bookings,
  currency,
  onNavigate,
  onSelectService,
}) => {
  // Find next upcoming booking for user
  const upcomingBooking = bookings.find(
    (b) => b.status === 'Confirmed' || b.status === 'Pending'
  );

  // Popular services
  const popularServices = services.filter((s) => s.isActive).slice(0, 4);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = user?.name ? user.name.split(' ')[0] : 'Gentleman';

  return (
    <div className="min-h-screen bg-neutral-50 pb-24 md:pb-12 text-neutral-900 select-none">
      {/* Dark Hero Section matching the showcase header */}
      <div className="bg-[#080808] text-white pt-6 pb-8 px-4 sm:px-6 rounded-b-[2.5rem] shadow-xl">
        <div className="max-w-4xl mx-auto">
          {/* Greeting */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs sm:text-sm text-neutral-400 font-medium">
                {getGreeting()},
              </p>
              <h1 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-white flex items-center gap-2">
                <span>{firstName}</span>
                <span className="text-xl">👋</span>
              </h1>
            </div>
            {user?.avatarUrl && (
              <div
                onClick={() => onNavigate('profile')}
                className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#F10B20] cursor-pointer hover:scale-105 transition-transform"
              >
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Red Promotional Banner (matching showcase) */}
          <div className="relative overflow-hidden rounded-3xl bg-[#F10B20] text-white p-6 sm:p-8 shadow-2xl shadow-[#F10B20]/30">
            <div className="relative z-10 max-w-[62%] sm:max-w-md">
              <span className="inline-block px-2.5 py-1 bg-black/25 text-white/90 text-[10px] font-black uppercase tracking-wider rounded-lg mb-2">
                Special Offer
              </span>
              <h2 className="text-xl sm:text-3xl font-display font-black tracking-tight leading-tight">
                Fresh Cuts, <br />
                Better Vibes
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-white/85 leading-snug">
                Book now and keep your style on point with Lekki's finest master barbers.
              </p>
              <button
                onClick={() => onNavigate('booking')}
                className="mt-4 px-5 py-2.5 bg-black hover:bg-neutral-900 active:scale-95 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg transition-all flex items-center gap-2"
              >
                <span>Book Appointment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Haircut image cutout positioned on the right */}
            <div className="absolute -bottom-2 -right-4 w-40 sm:w-56 h-44 sm:h-56 pointer-events-none">
              <img
                src={IMAGES.heroFade}
                alt="Haircut showcase"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-tl-full shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#F10B20] via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-3">
        {/* Upcoming Booking Alert Card if exists */}
        {upcomingBooking && (
          <div
            onClick={() => onNavigate('my-bookings')}
            className="mb-6 p-4 bg-white border border-neutral-200/80 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-[#F10B20] flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-neutral-900">
                    Next Appointment
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      upcomingBooking.status === 'Confirmed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {upcomingBooking.status}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {upcomingBooking.services.map((s) => s.name).join(', ')} •{' '}
                  {formatDate(upcomingBooking.date)} at {upcomingBooking.time}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-neutral-400" />
          </div>
        )}

        {/* 4 Quick Action Cards (Book Appointment, Our Services, My Bookings, Profile) */}
        <div className="grid grid-cols-4 gap-2.5 sm:gap-4 my-6">
          <button
            onClick={() => onNavigate('booking')}
            className="flex flex-col items-center justify-center p-3 sm:p-4 bg-white hover:bg-neutral-50 active:scale-95 border border-neutral-200/70 rounded-2xl shadow-sm transition-all text-center group"
          >
            <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-neutral-100 group-hover:bg-[#F10B20] group-hover:text-white transition-colors flex items-center justify-center text-neutral-800 mb-2">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-[11px] sm:text-xs font-bold text-neutral-800 line-clamp-1">
              Book Appt
            </span>
          </button>

          <button
            onClick={() => onNavigate('services')}
            className="flex flex-col items-center justify-center p-3 sm:p-4 bg-white hover:bg-neutral-50 active:scale-95 border border-neutral-200/70 rounded-2xl shadow-sm transition-all text-center group"
          >
            <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-neutral-100 group-hover:bg-[#F10B20] group-hover:text-white transition-colors flex items-center justify-center text-neutral-800 mb-2">
              <Scissors className="w-5 h-5" />
            </div>
            <span className="text-[11px] sm:text-xs font-bold text-neutral-800 line-clamp-1">
              Our Services
            </span>
          </button>

          <button
            onClick={() => onNavigate('my-bookings')}
            className="flex flex-col items-center justify-center p-3 sm:p-4 bg-white hover:bg-neutral-50 active:scale-95 border border-neutral-200/70 rounded-2xl shadow-sm transition-all text-center group"
          >
            <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-neutral-100 group-hover:bg-[#F10B20] group-hover:text-white transition-colors flex items-center justify-center text-neutral-800 mb-2">
              <BookmarkCheck className="w-5 h-5" />
            </div>
            <span className="text-[11px] sm:text-xs font-bold text-neutral-800 line-clamp-1">
              My Bookings
            </span>
          </button>

          <button
            onClick={() => onNavigate('profile')}
            className="flex flex-col items-center justify-center p-3 sm:p-4 bg-white hover:bg-neutral-50 active:scale-95 border border-neutral-200/70 rounded-2xl shadow-sm transition-all text-center group"
          >
            <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-neutral-100 group-hover:bg-[#F10B20] group-hover:text-white transition-colors flex items-center justify-center text-neutral-800 mb-2">
              <User className="w-5 h-5" />
            </div>
            <span className="text-[11px] sm:text-xs font-bold text-neutral-800 line-clamp-1">
              Profile
            </span>
          </button>
        </div>

        {/* Popular Services Section */}
        <div className="my-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-display font-black text-neutral-900 tracking-tight">
              Popular Services
            </h2>
            <button
              onClick={() => onNavigate('services')}
              className="text-xs font-bold text-[#F10B20] hover:underline flex items-center gap-1"
            >
              <span>See all</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Horizontal scroll or grid of popular service cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {popularServices.map((service) => (
              <div
                key={service.id}
                onClick={() => onSelectService(service)}
                className="bg-white border border-neutral-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="relative aspect-square overflow-hidden bg-neutral-100">
                  <img
                    src={service.imageUrl}
                    alt={service.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded-lg text-[10px] font-bold text-white">
                    {service.durationMinutes}m
                  </div>
                </div>

                <div className="p-3">
                  <h3 className="font-bold text-xs sm:text-sm text-neutral-900 truncate">
                    {service.name}
                  </h3>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#F10B20]">
                      {formatPrice(service.price, currency)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectService(service);
                      }}
                      className="text-[10px] font-bold px-2 py-1 bg-neutral-100 group-hover:bg-[#F10B20] group-hover:text-white rounded-lg transition-colors"
                    >
                      Book
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dark Lifestyle Showcase Banner (matching showcase image bottom card) */}
        <div className="relative my-8 rounded-3xl overflow-hidden bg-[#080808] text-white p-6 sm:p-8 shadow-2xl border border-neutral-800">
          <div className="absolute inset-0 opacity-40">
            <img
              src={IMAGES.interior}
              alt="Mikkys Barbershop interior"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />

          <div className="relative z-10 text-center max-w-md mx-auto">
            {/* Scissor icon */}
            <div className="w-10 h-10 mx-auto rounded-full bg-[#F10B20]/20 flex items-center justify-center text-[#F10B20] mb-3 border border-[#F10B20]/40">
              <Scissors className="w-5 h-5" />
            </div>

            <h3 className="text-xl sm:text-2xl font-display font-black tracking-tight">
              More Than a Cut.{' '}
              <span className="text-[#F10B20] block">It's a Lifestyle.</span>
            </h3>

            <p className="mt-2 text-xs text-neutral-400">
              Plot 14, Admiralty Way, Lekki Phase 1, Lagos. <br />
              Open daily 8:00 AM – 8:00 PM
            </p>

            {/* Social media icons matching showcase */}
            <div className="mt-5 flex items-center justify-center gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-800/80 hover:bg-[#F10B20] transition-colors flex items-center justify-center text-white"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-800/80 hover:bg-[#F10B20] transition-colors flex items-center justify-center text-white"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={storage.generateWhatsAppUrl(
                  storage.getSalonWhatsAppNumber(),
                  'Hello Mikkys Barbing Salon, I would like to inquire about appointments.'
                )}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-800/80 hover:bg-[#F10B20] transition-colors flex items-center justify-center text-white"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
