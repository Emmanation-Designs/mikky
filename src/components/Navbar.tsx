import React from 'react';
import { MikkysLogo } from './MikkysLogo';
import { AppScreen } from '../types';
import {
  Home,
  BookmarkCheck,
  User,
  Bell,
  Menu,
  ArrowLeft,
  ShieldCheck,
  Calendar,
} from 'lucide-react';

interface NavbarProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  onOpenDrawer: () => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount?: number;
  customerName?: string;
}

export const TopBar: React.FC<NavbarProps & { canGoBack?: boolean; onBack?: () => void; title?: string }> = ({
  currentScreen,
  onNavigate,
  onOpenDrawer,
  onOpenNotifications,
  unreadNotificationsCount = 2,
  canGoBack = false,
  onBack,
  title,
}) => {
  const isDarkTop = currentScreen === 'home' || currentScreen === 'admin';

  return (
    <header
      className={`sticky top-0 z-30 transition-colors ${
        isDarkTop ? 'bg-[#080808] text-white border-b border-neutral-900' : 'bg-white text-neutral-900 border-b border-neutral-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left: Back button or Hamburger + Logo */}
        <div className="flex items-center gap-3">
          {canGoBack ? (
            <button
              onClick={onBack}
              className={`p-2 rounded-xl transition-colors ${
                isDarkTop ? 'hover:bg-neutral-800 text-neutral-300' : 'hover:bg-neutral-100 text-neutral-700'
              }`}
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={onOpenDrawer}
              className={`p-2 rounded-xl transition-colors ${
                isDarkTop ? 'hover:bg-neutral-800 text-neutral-300' : 'hover:bg-neutral-100 text-neutral-700'
              }`}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {title ? (
            <h1 className="text-base sm:text-lg font-display font-bold truncate max-w-[200px] sm:max-w-none">
              {title}
            </h1>
          ) : (
            <div
              className="cursor-pointer"
              onClick={() => onNavigate('home')}
            >
              <MikkysLogo
                size="sm"
                variant={isDarkTop ? 'dark' : 'light'}
                showSubtitle={false}
              />
            </div>
          )}
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
          <button
            onClick={() => onNavigate('home')}
            className={`transition-colors ${
              currentScreen === 'home' ? 'text-[#F10B20]' : isDarkTop ? 'text-neutral-300 hover:text-white' : 'text-neutral-600 hover:text-black'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate('services')}
            className={`transition-colors ${
              currentScreen === 'services' ? 'text-[#F10B20]' : isDarkTop ? 'text-neutral-300 hover:text-white' : 'text-neutral-600 hover:text-black'
            }`}
          >
            Our Services
          </button>
          <button
            onClick={() => onNavigate('booking')}
            className={`transition-colors ${
              currentScreen === 'booking' ? 'text-[#F10B20]' : isDarkTop ? 'text-neutral-300 hover:text-white' : 'text-neutral-600 hover:text-black'
            }`}
          >
            Book Appointment
          </button>
          <button
            onClick={() => onNavigate('my-bookings')}
            className={`transition-colors ${
              currentScreen === 'my-bookings' ? 'text-[#F10B20]' : isDarkTop ? 'text-neutral-300 hover:text-white' : 'text-neutral-600 hover:text-black'
            }`}
          >
            My Bookings
          </button>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Quick Admin Switch on Desktop/Mobile */}
          <button
            onClick={() => onNavigate(currentScreen === 'admin' ? 'home' : 'admin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              currentScreen === 'admin'
                ? 'bg-[#F10B20] text-white'
                : isDarkTop
                ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
            title="Toggle Admin Dashboard"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#F10B20]" />
            <span className="hidden sm:inline">Admin</span>
          </button>

          {/* Notification Bell */}
          <button
            onClick={onOpenNotifications}
            className={`relative p-2 rounded-xl transition-colors ${
              isDarkTop ? 'hover:bg-neutral-800 text-neutral-300' : 'hover:bg-neutral-100 text-neutral-700'
            }`}
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F10B20] rounded-full ring-2 ring-black" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export const BottomTabBar: React.FC<{
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
}> = ({ currentScreen, onNavigate }) => {
  const tabs = [
    { label: 'Home', screen: 'home' as AppScreen, icon: Home },
    { label: 'Bookings', screen: 'my-bookings' as AppScreen, icon: BookmarkCheck },
    { label: 'Profile', screen: 'profile' as AppScreen, icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#080808]/95 backdrop-blur-md border-t border-neutral-200 dark:border-neutral-800">
      <div className="grid grid-cols-3 items-center h-16 max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = currentScreen === tab.screen;
          const Icon = tab.icon;

          return (
            <button
              key={tab.screen}
              onClick={() => onNavigate(tab.screen)}
              className={`flex flex-col items-center justify-center h-full transition-colors ${
                isActive ? 'text-[#F10B20]' : 'text-neutral-400 hover:text-neutral-600'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className={`text-[11px] font-medium mt-1 ${isActive ? 'font-bold' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
