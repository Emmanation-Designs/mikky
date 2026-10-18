import React from 'react';
import { MikkysLogo } from './MikkysLogo';
import { AppScreen } from '../types';
import {
  Home,
  Calendar,
  Scissors,
  BookmarkCheck,
  User,
  Settings,
  ShieldCheck,
  LogOut,
  X,
  ChevronRight,
} from 'lucide-react';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  onLogout: () => void;
  isAdmin: boolean;
  onOpenAdmin: () => void;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
  isOpen,
  onClose,
  currentScreen,
  onNavigate,
  onLogout,
  isAdmin,
  onOpenAdmin,
}) => {
  if (!isOpen) return null;

  const navItems: { label: string; screen: AppScreen; icon: React.ReactNode }[] = [
    { label: 'Home', screen: 'home', icon: <Home className="w-5 h-5" /> },
    { label: 'Book Appointment', screen: 'booking', icon: <Calendar className="w-5 h-5" /> },
    { label: 'Our Services', screen: 'services', icon: <Scissors className="w-5 h-5" /> },
    { label: 'My Bookings', screen: 'my-bookings', icon: <BookmarkCheck className="w-5 h-5" /> },
    { label: 'Profile', screen: 'profile', icon: <User className="w-5 h-5" /> },
    { label: 'Settings', screen: 'settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="relative w-72 sm:w-80 max-w-[85vw] bg-[#080808] border-r border-neutral-800 text-white flex flex-col justify-between p-6 z-10 animate-slideRight">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
            <MikkysLogo size="md" variant="dark" />
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800/60 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 space-y-1.5">
            {navItems.map((item) => {
              const isActive = currentScreen === item.screen;
              return (
                <button
                  key={item.screen}
                  onClick={() => {
                    onNavigate(item.screen);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-[#F10B20] text-white shadow-lg shadow-[#F10B20]/25'
                      : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 opacity-80" />}
                </button>
              );
            })}

            {/* Admin Dashboard Entry Point */}
            <div className="pt-3">
              <button
                onClick={() => {
                  onOpenAdmin();
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold border transition-all ${
                  currentScreen === 'admin'
                    ? 'bg-neutral-800 border-[#F10B20] text-white'
                    : 'bg-neutral-900/60 border-neutral-800 text-neutral-300 hover:border-neutral-700 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <ShieldCheck className="w-5 h-5 text-[#F10B20]" />
                  <span>Salon Admin Portal</span>
                </div>
                <span className="text-[10px] bg-[#F10B20]/20 text-[#F10B20] font-bold px-1.5 py-0.5 rounded">
                  DEMO
                </span>
              </button>
            </div>
          </nav>
        </div>

        {/* Footer / Log out */}
        <div className="pt-6 border-t border-neutral-800">
          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-[#F10B20] hover:bg-[#F10B20]/10 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </button>
          <div className="mt-3 px-4 text-[11px] text-neutral-500">
            Mikkys Barbing Salon • v1.0
          </div>
        </div>
      </div>
    </div>
  );
};
