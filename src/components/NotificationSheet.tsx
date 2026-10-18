import React from 'react';
import { X, Bell, Calendar, Sparkles, Check, ChevronRight } from 'lucide-react';
import { AppScreen } from '../types';

interface NotificationSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: AppScreen) => void;
}

export const NotificationSheet: React.FC<NotificationSheetProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 'notif-1',
      title: 'Appointment Reminder',
      message: 'Your Classic Fade appointment with Mikky is scheduled for this Saturday at 10:00 AM.',
      time: '1 hour ago',
      unread: true,
      actionScreen: 'my-bookings' as AppScreen,
      icon: <Calendar className="w-4 h-4 text-[#F10B20]" />,
    },
    {
      id: 'notif-2',
      title: 'Weekend Special Combo',
      message: 'Get a full Fade Cut + Beard Sculpt combo with complimentary scalp massage this weekend.',
      time: 'Yesterday',
      unread: false,
      actionScreen: 'services' as AppScreen,
      icon: <Sparkles className="w-4 h-4 text-amber-500" />,
    },
    {
      id: 'notif-3',
      title: 'Welcome to Mikkys!',
      message: 'Experience the ultimate luxury grooming salon in Lekki Phase 1.',
      time: '3 days ago',
      unread: false,
      actionScreen: 'home' as AppScreen,
      icon: <Bell className="w-4 h-4 text-blue-500" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Sheet panel */}
      <div className="relative w-full max-w-sm bg-white dark:bg-[#0f0f0f] text-neutral-900 dark:text-white flex flex-col justify-between shadow-2xl z-10 animate-slideLeft">
        {/* Header */}
        <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#F10B20]" />
            <h2 className="font-display font-bold text-base">Notifications</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notification list */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                onNavigate(n.actionScreen);
                onClose();
              }}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                n.unread
                  ? 'bg-red-50/50 border-red-200 dark:bg-[#F10B20]/10 dark:border-[#F10B20]/20'
                  : 'bg-neutral-50 border-neutral-200 dark:bg-neutral-900/60 dark:border-neutral-800'
              } hover:border-[#F10B20]`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-white dark:bg-neutral-800 shadow-sm shrink-0">
                  {n.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white truncate">
                      {n.title}
                    </h3>
                    <span className="text-[10px] text-neutral-400 shrink-0 ml-2">
                      {n.time}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1 leading-relaxed">
                    {n.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 text-center">
          <p className="text-xs text-neutral-400">All notifications up to date</p>
        </div>
      </div>
    </div>
  );
};
