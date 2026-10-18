import React, { useState } from 'react';
import { Booking, UserProfile, AppScreen } from '../types';
import { formatPrice, formatDate } from '../utils/formatters';
import { IMAGES, storage } from '../services/storage';
import {
  Calendar,
  Clock,
  User,
  ChevronRight,
  X,
  AlertTriangle,
  CheckCircle,
  MessageCircle,
  Scissors,
  Plus,
} from 'lucide-react';

interface MyBookingsProps {
  bookings: Booking[];
  currency: string;
  user: UserProfile | null;
  onNavigate: (screen: AppScreen) => void;
  onRefresh: () => void;
}

export const MyBookings: React.FC<MyBookingsProps> = ({
  bookings,
  currency,
  user,
  onNavigate,
  onRefresh,
}) => {
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
  const [cancelFeedback, setCancelFeedback] = useState<string | null>(null);

  // Filter bookings for user
  const userBookings = bookings.filter((b) => {
    if (!user) return true;
    return b.userId === user.id || b.customerPhone === user.phone || b.customerEmail === user.email;
  });

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const upcoming = userBookings.filter((b) => {
    if (b.status === 'Cancelled' || b.status === 'Completed') return false;
    const bookingDate = new Date(b.date);
    return bookingDate >= now;
  });

  const past = userBookings.filter((b) => {
    if (b.status === 'Cancelled' || b.status === 'Completed') return true;
    const bookingDate = new Date(b.date);
    return bookingDate < now;
  });

  const activeList = tab === 'upcoming' ? upcoming : past;

  const handleCancelBooking = () => {
    if (!selectedBooking) return;
    const success = storage.cancelBooking(selectedBooking.id);
    if (success) {
      setCancelFeedback('Appointment successfully cancelled.');
      setShowCancelModal(false);
      onRefresh();
      // Update selected booking status
      setSelectedBooking({ ...selectedBooking, status: 'Cancelled' });
    }
  };

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'Confirmed':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
            Confirmed
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">
            Pending
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
            Completed
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-600">
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 pb-28 select-none">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-4">
        {/* Tab Toggle (Upcoming vs Past) matching showcase */}
        <div className="flex bg-neutral-200/80 p-1 rounded-2xl mb-6">
          <button
            onClick={() => setTab('upcoming')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              tab === 'upcoming'
                ? 'bg-[#F10B20] text-white shadow-md shadow-[#F10B20]/25'
                : 'text-neutral-600 hover:text-black'
            }`}
          >
            Upcoming ({upcoming.length})
          </button>
          <button
            onClick={() => setTab('past')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              tab === 'past'
                ? 'bg-[#F10B20] text-white shadow-md shadow-[#F10B20]/25'
                : 'text-neutral-600 hover:text-black'
            }`}
          >
            Past & History ({past.length})
          </button>
        </div>

        {cancelFeedback && (
          <div className="mb-4 p-3 bg-neutral-900 text-white text-xs font-medium rounded-xl flex items-center justify-between">
            <span>{cancelFeedback}</span>
            <button onClick={() => setCancelFeedback(null)}>
              <X className="w-4 h-4 text-neutral-400" />
            </button>
          </div>
        )}

        {/* List of Bookings */}
        {activeList.length === 0 ? (
          <div className="text-center py-16 px-6 bg-white rounded-3xl border border-neutral-200/80">
            <Calendar className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
            <h3 className="font-display font-black text-neutral-800 text-base">
              No {tab} bookings
            </h3>
            <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
              {tab === 'upcoming'
                ? 'You do not have any active upcoming appointments scheduled.'
                : 'No past booking records found.'}
            </p>
            {tab === 'upcoming' && (
              <button
                onClick={() => onNavigate('booking')}
                className="mt-5 px-5 py-2.5 bg-[#F10B20] hover:bg-[#d0091b] text-white text-xs font-bold rounded-xl shadow-md transition-all inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Book Appointment Now</span>
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {activeList.map((booking) => {
              const primaryService = booking.services[0];
              return (
                <div
                  key={booking.id}
                  onClick={() => setSelectedBooking(booking)}
                  className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-sm hover:border-neutral-300 hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={IMAGES.heroFade}
                      alt="Service cut"
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-xl object-cover bg-neutral-100 shrink-0"
                    />

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-neutral-900 truncate">
                          {booking.services.map((s) => s.name).join(' + ')}
                        </h4>
                      </div>

                      <p className="text-xs text-neutral-500 mt-0.5 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        <span>
                          {formatDate(booking.date)} • {booking.time}
                        </span>
                      </p>

                      <div className="mt-2 flex items-center gap-2">
                        {getStatusBadge(booking.status)}
                        <span className="text-xs font-bold text-[#F10B20]">
                          {formatPrice(booking.totalAmount, currency)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-neutral-400 shrink-0 ml-2" />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedBooking(null)}
          />

          <div className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl z-10 animate-scaleUp p-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Appointment Details
                </span>
                <h3 className="text-base font-display font-black text-neutral-900">
                  Ref: {selectedBooking.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-neutral-500 font-semibold">Status</span>
                <div>{getStatusBadge(selectedBooking.status)}</div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-neutral-500 font-semibold">Date & Time</span>
                <span className="font-bold text-neutral-900">
                  {formatDate(selectedBooking.date)} at {selectedBooking.time}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-neutral-500 font-semibold">Stylist</span>
                <span className="font-bold text-neutral-900">
                  {selectedBooking.barberName}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-neutral-500 font-semibold">Client Name</span>
                <span className="font-bold text-neutral-900">
                  {selectedBooking.customerName}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-neutral-500 font-semibold">Phone</span>
                <span className="font-bold text-neutral-900">
                  {selectedBooking.customerPhone}
                </span>
              </div>

              {selectedBooking.notes && (
                <div className="pt-2 border-t border-neutral-100">
                  <span className="text-neutral-500 font-semibold block mb-1">
                    Client Instructions:
                  </span>
                  <p className="p-2.5 bg-neutral-50 rounded-xl text-neutral-700 italic">
                    "{selectedBooking.notes}"
                  </p>
                </div>
              )}

              {/* Services Snapshot Table */}
              <div className="pt-3 border-t border-neutral-100">
                <span className="text-neutral-500 font-bold block mb-2">Booked Services:</span>
                <div className="space-y-1.5 bg-neutral-50 p-3 rounded-xl">
                  {selectedBooking.services.map((s, idx) => (
                    <div key={idx} className="flex justify-between font-medium">
                      <span>{s.name}</span>
                      <span className="font-bold text-neutral-900">
                        {formatPrice(s.price, currency)}
                      </span>
                    </div>
                  ))}
                  <div className="pt-2 mt-1 border-t border-neutral-200 flex justify-between font-black text-sm">
                    <span>Total Amount</span>
                    <span className="text-[#F10B20]">
                      {formatPrice(selectedBooking.totalAmount, currency)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2.5 pt-2">
              {/* WhatsApp send order details */}
              <a
                href={storage.generateWhatsAppUrl(
                  storage.getSalonWhatsAppNumber(),
                  storage.buildBookingWhatsAppMessage(selectedBooking, currency)
                )}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.98] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Send Order to WhatsApp ({storage.getSalonWhatsAppNumber()})</span>
              </a>

              {/* Cancel Button if eligible */}
              {(selectedBooking.status === 'Pending' || selectedBooking.status === 'Confirmed') && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="w-full py-2.5 border border-red-200 text-[#F10B20] hover:bg-red-50 font-bold rounded-xl text-xs transition-colors"
                >
                  Cancel This Appointment
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      {showCancelModal && selectedBooking && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl z-10 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-[#F10B20] flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-display font-black text-lg text-neutral-900">
              Cancel Appointment?
            </h3>
            <p className="text-xs text-neutral-500">
              Are you sure you want to cancel your appointment ({selectedBooking.id}) for{' '}
              {formatDate(selectedBooking.date)} at {selectedBooking.time}?
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold rounded-xl text-xs"
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancelBooking}
                className="flex-1 py-3 bg-[#F10B20] hover:bg-[#d0091b] text-white font-bold rounded-xl text-xs"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
