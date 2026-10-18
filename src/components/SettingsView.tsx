import React, { useState } from 'react';
import { SalonSettings, AppScreen } from '../types';
import { storage } from '../services/storage';
import {
  RotateCcw,
  Bell,
  Coins,
  Compass,
  Info,
  ShieldAlert,
  Trash2,
  Check,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface SettingsViewProps {
  settings: SalonSettings;
  onUpdateSettings: (newSettings: Partial<SalonSettings>) => void;
  onReplayOnboarding: () => void;
  onResetAllData: () => void;
  onNavigate: (screen: AppScreen) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onReplayOnboarding,
  onResetAllData,
  onNavigate,
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [notificationsSMS, setNotificationsSMS] = useState(true);
  const [notificationsWA, setNotificationsWA] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleCurrencyChange = (curr: 'NGN' | 'USD') => {
    onUpdateSettings({ currency: curr });
    showToast(`Currency changed to ${curr === 'NGN' ? '₦ Nigerian Naira' : '$ US Dollars'}`);
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 pb-28 select-none">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-6">
        <div className="mb-6">
          <h2 className="text-2xl font-display font-black text-neutral-900 tracking-tight">
            Settings & Preferences
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manage your display settings, notifications, and application data.
          </p>
        </div>

        {toastMsg && (
          <div className="mb-4 p-3 bg-neutral-900 text-white text-xs font-bold rounded-xl flex items-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{toastMsg}</span>
          </div>
        )}

        <div className="space-y-4">
          {/* Currency Preference */}
          <div className="bg-white rounded-3xl p-5 border border-neutral-200/80 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-xl bg-red-50 text-[#F10B20] flex items-center justify-center">
                <Coins className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-neutral-900">Currency Display</h3>
                <p className="text-xs text-neutral-400">Choose your preferred pricing currency</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3">
              <button
                onClick={() => handleCurrencyChange('NGN')}
                className={`p-3 rounded-xl text-xs font-bold flex items-center justify-between border transition-all ${
                  settings.currency === 'NGN'
                    ? 'bg-red-50/60 border-[#F10B20] text-[#F10B20]'
                    : 'bg-neutral-50 border-neutral-200 text-neutral-700'
                }`}
              >
                <span>₦ Naira (NGN)</span>
                {settings.currency === 'NGN' && <Check className="w-4 h-4" />}
              </button>
              <button
                onClick={() => handleCurrencyChange('USD')}
                className={`p-3 rounded-xl text-xs font-bold flex items-center justify-between border transition-all ${
                  settings.currency === 'USD'
                    ? 'bg-red-50/60 border-[#F10B20] text-[#F10B20]'
                    : 'bg-neutral-50 border-neutral-200 text-neutral-700'
                }`}
              >
                <span>$ Dollar (USD)</span>
                {settings.currency === 'USD' && <Check className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Local Notification Toggles */}
          <div className="bg-white rounded-3xl p-5 border border-neutral-200/80 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-xl bg-red-50 text-[#F10B20] flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-neutral-900">Notifications</h3>
                <p className="text-xs text-neutral-400">Manage appointment reminder alerts</p>
              </div>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-center justify-between py-1">
                <span className="font-medium text-neutral-700">WhatsApp Booking Alerts</span>
                <input
                  type="checkbox"
                  checked={notificationsWA}
                  onChange={(e) => setNotificationsWA(e.target.checked)}
                  className="w-4 h-4 text-[#F10B20] rounded accent-[#F10B20]"
                />
              </div>
              <div className="flex items-center justify-between py-1 border-t border-neutral-100">
                <span className="font-medium text-neutral-700">SMS Reminders</span>
                <input
                  type="checkbox"
                  checked={notificationsSMS}
                  onChange={(e) => setNotificationsSMS(e.target.checked)}
                  className="w-4 h-4 text-[#F10B20] rounded accent-[#F10B20]"
                />
              </div>
            </div>
          </div>

          {/* Onboarding Walkthrough */}
          <div className="bg-white rounded-3xl p-5 border border-neutral-200/80 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-neutral-100 text-neutral-700 flex items-center justify-center">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-neutral-900">App Tour / Onboarding</h3>
                <p className="text-xs text-neutral-400">Replay the visual introduction slides</p>
              </div>
            </div>
            <button
              onClick={onReplayOnboarding}
              className="px-3.5 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-xs font-bold text-neutral-800 transition-colors"
            >
              Replay
            </button>
          </div>

          {/* About Salon */}
          <div className="bg-white rounded-3xl p-5 border border-neutral-200/80 shadow-sm space-y-2">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-xl bg-neutral-100 text-neutral-700 flex items-center justify-center">
                <Info className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-neutral-900">About Mikkys Barbing Salon</h3>
                <p className="text-xs text-neutral-400">Lekki's Premier Grooming Destination</p>
              </div>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed pt-2">
              Mikkys Barbing Salon delivers world-class grooming with skilled barbers, sharp precision fades, hot towel treatments, and an upscale VIP atmosphere.
            </p>
            <div className="text-[11px] text-neutral-500 pt-1">
              📍 Plot 14, Admiralty Way, Lekki Phase 1, Lagos <br />
              ⏰ Daily: 8:00 AM – 8:00 PM <br />
              📞 Tel & WhatsApp: {settings.whatsappPhone || '2349038418469'}
            </div>
          </div>

          {/* Local Prototype Privacy Notice */}
          <div className="bg-amber-50 rounded-3xl p-5 border border-amber-200/60 text-xs text-amber-900 space-y-1">
            <div className="flex items-center gap-2 font-bold text-amber-950">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Local Storage Prototype Notice</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-800">
              This application functions entirely within your browser using localStorage. No sensitive data is transmitted to an external database. Bookings and credentials persist on this device.
            </p>
          </div>

          {/* Reset Demo Data */}
          <div className="bg-white rounded-3xl p-5 border border-red-200 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-red-50 text-[#F10B20] flex items-center justify-center">
                <RotateCcw className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#F10B20]">Reset Demo Data</h3>
                <p className="text-xs text-neutral-400">Restore factory sample services and bookings</p>
              </div>
            </div>
            <button
              onClick={() => setShowResetConfirm(true)}
              className="px-3.5 py-1.5 rounded-xl border border-red-200 text-[#F10B20] hover:bg-red-50 text-xs font-bold transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog for Reset */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl z-10 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-[#F10B20] flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-display font-black text-lg text-neutral-900">
              Reset Application Data?
            </h3>
            <p className="text-xs text-neutral-500">
              This will reset services, demo bookings, and restore initial factory prototype states. Are you sure you want to proceed?
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowResetConfirm(false);
                  onResetAllData();
                }}
                className="flex-1 py-3 bg-[#F10B20] hover:bg-[#d0091b] text-white font-bold rounded-xl text-xs shadow-md shadow-[#F10B20]/25"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
