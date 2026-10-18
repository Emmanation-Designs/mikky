import React, { useState, useMemo } from 'react';
import { Service, Booking, UserProfile, SalonSettings } from '../types';
import { formatPrice, formatDate } from '../utils/formatters';
import { storage, IMAGES, buildBookingWhatsAppMessage, SALON_WHATSAPP_NUMBER } from '../services/storage';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  MessageCircle,
  Mail,
  FileText,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Scissors,
  AlertCircle,
  Trash2,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';

interface BookingFlowProps {
  initialSelectedServices: Service[];
  availableServices: Service[];
  user: UserProfile | null;
  settings: SalonSettings;
  currency: string;
  onBookingComplete: (booking: Booking) => void;
  onCancel: () => void;
  onViewBooking: (bookingId: string) => void;
}

export const BookingFlow: React.FC<BookingFlowProps> = ({
  initialSelectedServices,
  availableServices,
  user,
  settings,
  currency,
  onBookingComplete,
  onCancel,
  onViewBooking,
}) => {
  // Stepper state: 1 (Services), 2 (Date & Time), 3 (Details), 4 (Summary), 5 (Confirmed)
  const [currentStep, setCurrentStep] = useState<number>(
    initialSelectedServices.length > 0 ? 2 : 1
  );

  const [selectedServices, setSelectedServices] = useState<Service[]>(
    initialSelectedServices.length > 0 ? initialSelectedServices : availableServices.slice(0, 1)
  );

  // Date picker state: defaults to tomorrow or today
  const today = new Date();
  const [calendarMonth, setCalendarMonth] = useState<number>(today.getMonth());
  const [calendarYear, setCalendarYear] = useState<number>(today.getFullYear());

  const tomorrowStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
      d.getDate()
    ).padStart(2, '0')}`;
  }, []);

  const [selectedDate, setSelectedDate] = useState<string>(tomorrowStr);
  const [selectedTime, setSelectedTime] = useState<string>('10:00 AM');
  const [selectedBarber, setSelectedBarber] = useState<string>('Any Available');

  // Customer contact state prefilled from session
  const [customerName, setCustomerName] = useState<string>(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState<string>(user?.phone || '');
  const [customerWhatsApp, setCustomerWhatsApp] = useState<string>(
    user?.whatsapp || user?.phone || ''
  );
  const [customerEmail, setCustomerEmail] = useState<string>(user?.email || '');
  const [notes, setNotes] = useState<string>('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [copiedMessage, setCopiedMessage] = useState<boolean>(false);

  // Available time slots (8:00 AM to 7:00 PM)
  const TIME_SLOTS = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '01:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
    '06:00 PM',
  ];

  // Calendar calculations
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(calendarYear, calendarMonth, 1).getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear((y) => y - 1);
    } else {
      setCalendarMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear((y) => y + 1);
    } else {
      setCalendarMonth((m) => m + 1);
    }
  };

  const handleDateClick = (dayNumber: number) => {
    const formatted = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(
      dayNumber
    ).padStart(2, '0')}`;
    setSelectedDate(formatted);
    setErrorMsg(null);
  };

  const isDateInPast = (dayNumber: number) => {
    const target = new Date(calendarYear, calendarMonth, dayNumber);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return target < now;
  };

  const isSlotBooked = (time: string) => {
    if (!selectedDate) return false;
    return !storage.checkSlotAvailability(selectedDate, time, selectedBarber);
  };

  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.durationMinutes, 0);

  // Handlers
  const handleProceedFromStep1 = () => {
    if (selectedServices.length === 0) {
      setErrorMsg('Please select at least one service to continue.');
      return;
    }
    setErrorMsg(null);
    setCurrentStep(2);
  };

  const handleProceedFromStep2 = () => {
    if (!selectedDate || !selectedTime) {
      setErrorMsg('Please choose both an appointment date and time slot.');
      return;
    }
    if (isSlotBooked(selectedTime)) {
      setErrorMsg('This time slot is already booked. Please choose an available time.');
      return;
    }
    setErrorMsg(null);
    setCurrentStep(3);
  };

  const handleProceedFromStep3 = () => {
    if (!customerName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!customerPhone.trim()) {
      setErrorMsg('Please enter your phone number.');
      return;
    }
    if (!customerWhatsApp.trim()) {
      setErrorMsg('Please enter your WhatsApp number for booking updates.');
      return;
    }
    setErrorMsg(null);
    setCurrentStep(4);
  };

  const handleConfirmBooking = () => {
    setErrorMsg(null);

    const result = storage.createBooking({
      customerName,
      customerPhone,
      customerWhatsApp,
      customerEmail,
      notes,
      selectedServices,
      date: selectedDate,
      time: selectedTime,
      barberName: selectedBarber,
    });

    if (result.success && result.booking) {
      setConfirmedBooking(result.booking);
      setCurrentStep(5);
      onBookingComplete(result.booking);
    } else {
      setErrorMsg(result.error || 'Failed to complete booking. Please try again.');
    }
  };

  const toggleServiceInFlow = (svc: Service) => {
    if (selectedServices.some((s) => s.id === svc.id)) {
      if (selectedServices.length > 1) {
        setSelectedServices(selectedServices.filter((s) => s.id !== svc.id));
      }
    } else {
      setSelectedServices([...selectedServices, svc]);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 pb-20 select-none">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        {/* Step Indicator Header (matching showcase stepper) */}
        {currentStep < 5 && (
          <div className="mb-8">
            <div className="flex items-center justify-between max-w-md mx-auto relative">
              {/* Connecting line */}
              <div className="absolute top-4 left-6 right-6 h-0.5 bg-neutral-200 -z-0" />
              <div
                className="absolute top-4 left-6 h-0.5 bg-[#F10B20] transition-all duration-300 -z-0"
                style={{
                  width: `${((currentStep - 1) / 3) * 100}%`,
                  maxWidth: 'calc(100% - 3rem)',
                }}
              />

              {[
                { step: 1, label: 'Service' },
                { step: 2, label: 'Date & Time' },
                { step: 3, label: 'Details' },
                { step: 4, label: 'Confirm' },
              ].map((item) => {
                const isActive = currentStep === item.step;
                const isPassed = currentStep > item.step;

                return (
                  <div
                    key={item.step}
                    className="flex flex-col items-center relative z-10 cursor-pointer"
                    onClick={() => {
                      if (item.step < currentStep) setCurrentStep(item.step);
                    }}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-sm ${
                        isActive
                          ? 'bg-[#F10B20] text-white ring-4 ring-red-100'
                          : isPassed
                          ? 'bg-neutral-900 text-white'
                          : 'bg-white border-2 border-neutral-300 text-neutral-400'
                      }`}
                    >
                      {item.step}
                    </div>
                    <span
                      className={`text-[11px] font-bold mt-1.5 whitespace-nowrap ${
                        isActive ? 'text-[#F10B20]' : 'text-neutral-500'
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Error notification */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-[#F10B20] text-xs font-bold rounded-2xl flex items-center gap-2.5 animate-fadeIn">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: SELECT SERVICES */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-display font-black text-neutral-900">
                Choose Your Services
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Select one or more cuts and grooming enhancements.
              </p>
            </div>

            <div className="space-y-3">
              {availableServices.filter((s) => s.isActive).map((service) => {
                const isSelected = selectedServices.some((s) => s.id === service.id);
                return (
                  <div
                    key={service.id}
                    onClick={() => toggleServiceInFlow(service)}
                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-red-50/50 border-[#F10B20] ring-1 ring-[#F10B20]'
                        : 'bg-white border-neutral-200/80 hover:border-neutral-300'
                    }`}
                  >
                    <img
                      src={service.imageUrl}
                      alt={service.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-xl object-cover bg-neutral-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm text-neutral-900">{service.name}</h3>
                      <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">
                        {service.description}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="font-extrabold text-sm text-[#F10B20]">
                          {formatPrice(service.price, currency)}
                        </span>
                        <span className="text-[11px] text-neutral-400">
                          {service.durationMinutes} mins
                        </span>
                      </div>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-[#F10B20] text-white'
                          : 'border-2 border-neutral-300'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-4 h-4 fill-white text-[#F10B20]" />}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-6">
              <button
                onClick={handleProceedFromStep1}
                className="w-full py-4 bg-[#F10B20] hover:bg-[#d0091b] active:scale-[0.98] text-white font-bold rounded-2xl shadow-xl shadow-[#F10B20]/25 transition-all flex items-center justify-center gap-2 font-display"
              >
                <span>Continue to Date & Time</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SELECT DATE AND TIME (Matching showcase screen) */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-neutral-200/80 shadow-sm">
              <h3 className="text-base font-display font-black text-neutral-900 mb-4 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-[#F10B20]" />
                <span>Select Date</span>
              </h3>

              {/* Month Header */}
              <div className="flex items-center justify-between mb-4 px-2">
                <span className="font-display font-black text-sm sm:text-base text-neutral-900">
                  {monthNames[calendarMonth]} {calendarYear}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handlePrevMonth}
                    className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-600 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNextMonth}
                    className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-600 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Days of week header */}
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                  <span key={d} className="text-[11px] font-bold text-neutral-400 py-1">
                    {d}
                  </span>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1.5 text-center">
                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-9" />
                ))}

                {Array.from({ length: daysInMonth }).map((_, idx) => {
                  const dayNum = idx + 1;
                  const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(
                    dayNum
                  ).padStart(2, '0')}`;
                  const isSelected = selectedDate === dateStr;
                  const isPast = isDateInPast(dayNum);

                  return (
                    <button
                      key={dayNum}
                      disabled={isPast}
                      onClick={() => handleDateClick(dayNum)}
                      className={`h-9 w-9 mx-auto rounded-full text-xs font-bold transition-all flex items-center justify-center ${
                        isSelected
                          ? 'bg-[#F10B20] text-white shadow-md shadow-[#F10B20]/30 scale-105'
                          : isPast
                          ? 'text-neutral-300 cursor-not-allowed'
                          : 'text-neutral-800 hover:bg-neutral-100 active:scale-95'
                      }`}
                    >
                      {dayNum}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slot Selection (matching showcase) */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-neutral-200/80 shadow-sm">
              <h3 className="text-base font-display font-black text-neutral-900 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#F10B20]" />
                <span>Select Time</span>
              </h3>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                {TIME_SLOTS.map((time) => {
                  const isSelected = selectedTime === time;
                  const booked = isSlotBooked(time);

                  return (
                    <button
                      key={time}
                      disabled={booked}
                      onClick={() => {
                        setSelectedTime(time);
                        setErrorMsg(null);
                      }}
                      className={`py-3 px-2 rounded-xl text-xs font-bold transition-all text-center relative ${
                        isSelected
                          ? 'bg-[#F10B20] text-white shadow-lg shadow-[#F10B20]/30'
                          : booked
                          ? 'bg-neutral-100 text-neutral-300 cursor-not-allowed line-through'
                          : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100 border border-neutral-200/60'
                      }`}
                    >
                      {time}
                      {booked && (
                        <span className="block text-[8px] no-underline font-medium text-neutral-400 mt-0.5">
                          Booked
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Barber Selection */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-neutral-200/80 shadow-sm">
              <h3 className="text-base font-display font-black text-neutral-900 mb-3 flex items-center gap-2">
                <Scissors className="w-4 h-4 text-[#F10B20]" />
                <span>Preferred Stylist</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {settings.barbers.map((barber) => (
                  <button
                    key={barber}
                    onClick={() => setSelectedBarber(barber)}
                    className={`p-3 rounded-xl text-xs font-bold text-left transition-all border ${
                      selectedBarber === barber
                        ? 'bg-red-50/60 border-[#F10B20] text-[#F10B20]'
                        : 'bg-neutral-50 border-neutral-200/80 text-neutral-700 hover:border-neutral-300'
                    }`}
                  >
                    {barber}
                  </button>
                ))}
              </div>
            </div>

            {/* Continue CTA */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setCurrentStep(1)}
                className="w-1/3 py-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold rounded-2xl text-sm transition-all"
              >
                Back
              </button>
              <button
                onClick={handleProceedFromStep2}
                className="w-2/3 py-4 bg-[#F10B20] hover:bg-[#d0091b] active:scale-[0.98] text-white font-bold rounded-2xl shadow-xl shadow-[#F10B20]/25 transition-all flex items-center justify-center gap-2 font-display text-sm"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CUSTOMER DETAILS */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-neutral-200/80 shadow-sm space-y-4">
              <div>
                <h3 className="text-lg font-display font-black text-neutral-900">
                  Customer Information
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  The salon will use your WhatsApp number to verify and prepare for your cut.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F10B20]"
                  />
                  <User className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                  Phone Number *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g. 08031234567"
                    className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F10B20]"
                  />
                  <Phone className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                  WhatsApp Number *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={customerWhatsApp}
                    onChange={(e) => setCustomerWhatsApp(e.target.value)}
                    placeholder="e.g. 08031234567 (for quick appointment chat)"
                    className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F10B20]"
                  />
                  <MessageCircle className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                  Email Address (Optional)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="e.g. john@example.com"
                    className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F10B20]"
                  />
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                  Haircut Notes & Style Preferences
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Mid fade, preserve natural wave on top, sharp line up."
                  className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F10B20]"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setCurrentStep(2)}
                className="w-1/3 py-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold rounded-2xl text-sm"
              >
                Back
              </button>
              <button
                onClick={handleProceedFromStep3}
                className="w-2/3 py-4 bg-[#F10B20] hover:bg-[#d0091b] active:scale-[0.98] text-white font-bold rounded-2xl shadow-xl shadow-[#F10B20]/25 transition-all flex items-center justify-center gap-2 font-display text-sm"
              >
                <span>Review Summary</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: BOOKING SUMMARY (matching showcase "Booking Summary") */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="text-center mb-2">
              <h2 className="text-2xl font-display font-black text-neutral-900">
                Booking Summary
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Please review your appointment details before confirming.
              </p>
            </div>

            {/* Service card */}
            <div className="bg-white rounded-3xl p-5 border border-neutral-200/80 shadow-sm">
              <div className="space-y-3">
                {selectedServices.map((svc) => (
                  <div key={svc.id} className="flex items-center gap-3.5 pb-3 border-b border-neutral-100 last:border-0 last:pb-0">
                    <img
                      src={svc.imageUrl}
                      alt={svc.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-xl object-cover bg-neutral-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-neutral-900">{svc.name}</h4>
                      <p className="text-xs text-neutral-500 line-clamp-1">{svc.description}</p>
                      <span className="font-extrabold text-xs text-[#F10B20]">
                        {formatPrice(svc.price, currency)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Appointment specifics */}
            <div className="bg-white rounded-3xl p-5 border border-neutral-200/80 shadow-sm space-y-3.5 text-xs">
              <div className="flex items-center justify-between py-1">
                <span className="text-neutral-500 font-semibold flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-neutral-400" />
                  Date
                </span>
                <span className="font-bold text-neutral-900 text-sm">
                  {formatDate(selectedDate)}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-t border-neutral-100">
                <span className="text-neutral-500 font-semibold flex items-center gap-2">
                  <Clock className="w-4 h-4 text-neutral-400" />
                  Time
                </span>
                <span className="font-bold text-neutral-900 text-sm">{selectedTime}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-t border-neutral-100">
                <span className="text-neutral-500 font-semibold flex items-center gap-2">
                  <User className="w-4 h-4 text-neutral-400" />
                  Barber
                </span>
                <span className="font-bold text-neutral-900">{selectedBarber}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-t border-neutral-100">
                <span className="text-neutral-500 font-semibold flex items-center gap-2">
                  <Phone className="w-4 h-4 text-neutral-400" />
                  Client
                </span>
                <span className="font-bold text-neutral-900">
                  {customerName} ({customerPhone})
                </span>
              </div>

              {notes && (
                <div className="pt-2 border-t border-neutral-100">
                  <span className="text-neutral-500 font-semibold block mb-1">Client Notes:</span>
                  <p className="text-neutral-700 italic bg-neutral-50 p-2.5 rounded-xl">
                    "{notes}"
                  </p>
                </div>
              )}

              {/* Total Amount */}
              <div className="flex items-center justify-between pt-3 border-t-2 border-neutral-100">
                <span className="font-display font-black text-sm text-neutral-900">Total</span>
                <span className="font-display font-black text-xl text-[#F10B20]">
                  {formatPrice(totalPrice, currency)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleConfirmBooking}
                className="w-full py-4 bg-[#F10B20] hover:bg-[#d0091b] active:scale-[0.98] text-white font-bold rounded-2xl shadow-xl shadow-[#F10B20]/30 transition-all font-display text-base"
              >
                Confirm Booking
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="w-full py-3.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold rounded-2xl text-sm transition-all"
              >
                Edit Details
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: BOOKING CONFIRMED (matching showcase confirmation screen) */}
        {currentStep === 5 && confirmedBooking && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-2xl text-center max-w-md mx-auto space-y-6 animate-scaleUp">
            {/* Green Checkmark Badge */}
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-display font-black text-neutral-900 tracking-tight">
                Booking Confirmed!
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-2 leading-relaxed">
                Your appointment has been successfully booked in local storage. We'll see you soon!
              </p>
            </div>

            {/* Confirmation Summary Card */}
            <div className="bg-neutral-50 rounded-2xl p-4 text-left border border-neutral-200/60 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-200/60">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  Booking ID
                </span>
                <span className="font-mono font-bold text-xs bg-white px-2.5 py-1 rounded-lg border border-neutral-200 text-[#F10B20]">
                  {confirmedBooking.id}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={selectedServices[0]?.imageUrl || IMAGES.heroFade}
                  alt="Service"
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-neutral-900 truncate">
                    {confirmedBooking.services.map((s) => s.name).join(', ')}
                  </h4>
                  <p className="text-xs text-neutral-500">
                    {formatDate(confirmedBooking.date)} • {confirmedBooking.time}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-200/60 flex items-center justify-between text-xs font-bold">
                <span className="text-neutral-500">Total:</span>
                <span className="text-sm text-[#F10B20] font-black">
                  {formatPrice(confirmedBooking.totalAmount, currency)}
                </span>
              </div>
            </div>

            {/* Prominent Send Order to WhatsApp section */}
            {(() => {
              const salonPhone = settings?.whatsappPhone || SALON_WHATSAPP_NUMBER;
              const prefilledMessage = buildBookingWhatsAppMessage(confirmedBooking, currency);
              const whatsappUrl = storage.generateWhatsAppUrl(salonPhone, prefilledMessage);

              const handleCopy = () => {
                if (navigator?.clipboard) {
                  navigator.clipboard.writeText(prefilledMessage);
                }
                setCopiedMessage(true);
                setTimeout(() => setCopiedMessage(false), 2500);
              };

              return (
                <div className="bg-emerald-50 border-2 border-emerald-500/40 rounded-2xl p-4 text-left space-y-3.5 shadow-md">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-md">
                      <MessageCircle className="w-5 h-5 fill-white" />
                    </div>
                    <div>
                      <h3 className="font-display font-black text-sm text-neutral-900">
                        Send Order to WhatsApp
                      </h3>
                      <p className="text-xs text-neutral-600 mt-0.5 leading-snug">
                        Tap the green button below to send your complete order details directly to the salon on WhatsApp (<span className="font-bold text-neutral-900">{salonPhone}</span>)!
                      </p>
                    </div>
                  </div>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-4 px-4 bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.98] text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2.5 text-sm transition-all"
                  >
                    <MessageCircle className="w-5 h-5 fill-white" />
                    <span>Send Order to WhatsApp</span>
                    <ExternalLink className="w-4 h-4 opacity-80" />
                  </a>

                  {/* Prefilled message preview and copy text option */}
                  <div className="pt-2 border-t border-emerald-200">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                        Prefilled Message Ready
                      </span>
                      <button
                        type="button"
                        onClick={handleCopy}
                        className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-900 bg-white/80 hover:bg-white px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors"
                      >
                        {copiedMessage ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Copied to Clipboard!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Message</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="bg-white border border-emerald-200/80 rounded-xl p-3 text-[11px] font-mono text-neutral-700 whitespace-pre-wrap max-h-36 overflow-y-auto leading-relaxed shadow-inner">
                      {prefilledMessage}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Buttons */}
            <div className="space-y-2.5 pt-1">
              <button
                onClick={() => onViewBooking(confirmedBooking.id)}
                className="w-full py-3.5 bg-neutral-900 hover:bg-black active:scale-[0.98] text-white font-bold rounded-2xl text-xs font-display transition-all"
              >
                View in My Bookings
              </button>
              <button
                onClick={onCancel}
                className="w-full py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold rounded-2xl text-xs transition-all"
              >
                Back to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
