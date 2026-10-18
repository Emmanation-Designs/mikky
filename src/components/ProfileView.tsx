import React, { useState } from 'react';
import { UserProfile, AppScreen } from '../types';
import { storage } from '../services/storage';
import {
  BookmarkCheck,
  User,
  CreditCard,
  HelpCircle,
  Settings as SettingsIcon,
  LogOut,
  ChevronRight,
  Edit2,
  Check,
  X,
  Phone,
  Mail,
  ShieldCheck,
} from 'lucide-react';

interface ProfileViewProps {
  user: UserProfile | null;
  onNavigate: (screen: AppScreen) => void;
  onLogout: () => void;
  onProfileUpdated: (updated: UserProfile) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  onNavigate,
  onLogout,
  onProfileUpdated,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || 'John Doe');
  const [email, setEmail] = useState(user?.email || 'john@example.com');
  const [phone, setPhone] = useState(user?.phone || '08031234567');
  const [whatsapp, setWhatsapp] = useState(user?.whatsapp || '08031234567');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = storage.updateProfile({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      whatsapp: whatsapp.trim(),
    });
    if (updated) {
      onProfileUpdated(updated);
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        setIsEditing(false);
      }, 1200);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 pb-28 select-none">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-6">
        {/* Profile Header Card (matching showcase) */}
        <div className="bg-white rounded-3xl p-6 border border-neutral-200/80 shadow-sm flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#F10B20] bg-neutral-100">
                <img
                  src={user?.avatarUrl || '/src/assets/images/hero_fade_cut_1792245250277.jpg'}
                  alt={user?.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#F10B20] rounded-full border-2 border-white flex items-center justify-center text-white">
                <span className="text-[9px] font-black">M</span>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-display font-black text-neutral-900">
                {user?.name || 'John Doe'}
              </h2>
              <p className="text-xs text-neutral-500">{user?.email || 'john@example.com'}</p>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                {user?.phone || '08031234567'} • VIP Member
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="p-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
            title="Edit Profile"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>

        {/* Action List items (matching showcase) */}
        <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-sm overflow-hidden divide-y divide-neutral-100 mb-6">
          <button
            onClick={() => onNavigate('my-bookings')}
            className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors"
          >
            <div className="flex items-center gap-3.5 text-neutral-800">
              <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-700">
                <BookmarkCheck className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-bold">My Bookings</span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          </button>

          <button
            onClick={() => setIsEditing(true)}
            className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors"
          >
            <div className="flex items-center gap-3.5 text-neutral-800">
              <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-700">
                <User className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-bold">Edit Profile Details</span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          </button>

          <button
            onClick={() => {
              alert('Payment Info: In this local prototype, payments are handled in-salon via Cash, POS or Direct Transfer.');
            }}
            className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors"
          >
            <div className="flex items-center gap-3.5 text-neutral-800">
              <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-700">
                <CreditCard className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-bold">Payment Methods (In-Salon)</span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          </button>

          <button
            onClick={() => {
              window.open(
                storage.generateWhatsAppUrl(
                  storage.getSalonWhatsAppNumber(),
                  'Hello Mikkys Barbing Salon support, I need assistance with my booking.'
                ),
                '_blank'
              );
            }}
            className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors"
          >
            <div className="flex items-center gap-3.5 text-neutral-800">
              <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-700">
                <HelpCircle className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-bold">Help & Support (WhatsApp)</span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          </button>

          <button
            onClick={() => onNavigate('settings')}
            className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors"
          >
            <div className="flex items-center gap-3.5 text-neutral-800">
              <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-700">
                <SettingsIcon className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-bold">Settings & Preferences</span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          </button>

          <button
            onClick={() => onNavigate('admin')}
            className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors"
          >
            <div className="flex items-center gap-3.5 text-neutral-800">
              <div className="w-9 h-9 rounded-xl bg-neutral-900 text-[#F10B20] flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="text-xs sm:text-sm font-bold block">Salon Administrator Mode</span>
                <span className="text-[10px] text-neutral-400">Manage bookings, pricing & services</span>
              </div>
            </div>
            <span className="text-[10px] bg-red-100 text-[#F10B20] font-bold px-2 py-0.5 rounded-full">
              Switch
            </span>
          </button>
        </div>

        {/* Log Out Button matching showcase red text */}
        <button
          onClick={onLogout}
          className="w-full p-4 bg-white hover:bg-red-50 border border-neutral-200/80 rounded-2xl flex items-center gap-3 text-[#F10B20] font-bold text-xs sm:text-sm transition-colors shadow-sm"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>

      {/* Edit Profile Modal Dialog */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsEditing(false)}
          />

          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl z-10 animate-scaleUp">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <h3 className="text-lg font-display font-black text-neutral-900">
                Edit Profile
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {savedSuccess ? (
              <div className="py-12 text-center text-emerald-600 space-y-2">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <p className="font-bold text-sm">Profile updated successfully!</p>
              </div>
            ) : (
              <form onSubmit={handleSaveProfile} className="space-y-4 pt-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F10B20]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F10B20]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F10B20]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    required
                    className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F10B20]"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold rounded-xl text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-[#F10B20] hover:bg-[#d0091b] text-white font-bold rounded-xl text-xs shadow-md shadow-[#F10B20]/25"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
