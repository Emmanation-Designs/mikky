import React, { useState, useEffect, useCallback } from 'react';
import {
  AppScreen,
  Service,
  Booking,
  UserProfile,
  SalonSettings,
} from './types';
import { storage } from './services/storage';
import { SplashScreen } from './components/SplashScreen';
import { Onboarding } from './components/Onboarding';
import { AuthModal } from './components/AuthModal';
import { TopBar, BottomTabBar } from './components/Navbar';
import { SideDrawer } from './components/SideDrawer';
import { NotificationSheet } from './components/NotificationSheet';
import { HomeDashboard } from './components/HomeDashboard';
import { ServicesCatalogue } from './components/ServicesCatalogue';
import { ServiceDetailModal } from './components/ServiceDetailModal';
import { BookingFlow } from './components/BookingFlow';
import { MyBookings } from './components/MyBookings';
import { ProfileView } from './components/ProfileView';
import { SettingsView } from './components/SettingsView';
import { AdminDashboard } from './components/AdminDashboard';
import { Smartphone, Monitor } from 'lucide-react';

export default function App() {
  // Navigation & Screen state
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('home');
  const [hasCheckedInitialRoute, setHasCheckedInitialRoute] = useState(false);

  // App Data states synced with storage
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<SalonSettings>(storage.getSalonSettings());

  // Interactive UI modals
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeServiceDetail, setActiveServiceDetail] = useState<Service | null>(null);

  // Booking Flow temporary selection state
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);

  // Desktop view mode toggle (Phone frame vs responsive full-width)
  const [isMobileFrameMode, setIsMobileFrameMode] = useState<boolean>(false);

  // Load and refresh state from localStorage
  const refreshAppData = useCallback(() => {
    setServices(storage.getServices());
    setBookings(storage.getBookings());
    setUser(storage.getSession());
    setSettings(storage.getSalonSettings());
  }, []);

  // Initial load
  useEffect(() => {
    storage.initDefaults();
    refreshAppData();

    const onboardingDone = storage.isOnboardingCompleted();
    if (!onboardingDone) {
      setCurrentScreen('splash');
    } else {
      setCurrentScreen('home');
    }
    setHasCheckedInitialRoute(true);

    const handleStorageChange = () => {
      refreshAppData();
    };

    window.addEventListener('mikkys_storage_updated', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('mikkys_storage_updated', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [refreshAppData]);

  // Handlers for Navigation
  const navigateTo = (screen: AppScreen) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectServiceFromHome = (service: Service) => {
    setSelectedServiceIds([service.id]);
    navigateTo('booking');
  };

  const handleToggleService = (service: Service) => {
    if (selectedServiceIds.includes(service.id)) {
      setSelectedServiceIds(selectedServiceIds.filter((id) => id !== service.id));
    } else {
      setSelectedServiceIds([...selectedServiceIds, service.id]);
    }
  };

  const handleLogout = () => {
    storage.setSession(null);
    setUser(null);
    setShowAuthModal(true);
  };

  const handleResetAllData = () => {
    storage.resetAllData();
    refreshAppData();
    setSelectedServiceIds([]);
    navigateTo('home');
  };

  if (!hasCheckedInitialRoute) {
    return <div className="min-h-screen bg-[#080808]" />;
  }

  // Standalone Full-screen flow: Splash
  if (currentScreen === 'splash') {
    return (
      <SplashScreen
        onStart={() => {
          const onboardingDone = storage.isOnboardingCompleted();
          if (onboardingDone) {
            navigateTo('home');
          } else {
            navigateTo('onboarding');
          }
        }}
      />
    );
  }

  // Standalone Full-screen flow: Onboarding
  if (currentScreen === 'onboarding') {
    return (
      <Onboarding
        onComplete={() => {
          navigateTo('home');
        }}
      />
    );
  }

  // Active services list for booking
  const selectedServicesObjects = services.filter((s) => selectedServiceIds.includes(s.id));

  // Determine screen title for top bar
  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'services':
        return 'Our Services';
      case 'booking':
        return 'Book Appointment';
      case 'my-bookings':
        return 'My Bookings';
      case 'profile':
        return 'My Profile';
      case 'settings':
        return 'Settings';
      default:
        return undefined;
    }
  };

  const canGoBack = currentScreen !== 'home' && currentScreen !== 'admin';

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col items-center">
      {/* Desktop Helper Bar: Quick Admin Access & View Mode Toggle */}
      <div className="hidden lg:flex w-full bg-[#111111] border-b border-neutral-800 text-xs px-6 py-2 items-center justify-between z-50">
        <div className="flex items-center gap-3">
          <span className="font-extrabold text-[#F10B20] uppercase tracking-wider">
            Mikkys Barbing Salon
          </span>
          <span className="text-neutral-500">•</span>
          <span className="text-neutral-400">
            Local Prototype (Browser localStorage Persistence)
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMobileFrameMode(!isMobileFrameMode)}
            className="flex items-center gap-1.5 px-3 py-1 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-neutral-300 font-medium transition-colors"
          >
            {isMobileFrameMode ? (
              <>
                <Monitor className="w-3.5 h-3.5" />
                <span>Responsive Full Width</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile Device Frame</span>
              </>
            )}
          </button>

          <button
            onClick={() => navigateTo(currentScreen === 'admin' ? 'home' : 'admin')}
            className={`px-3 py-1 rounded-lg font-bold transition-colors ${
              currentScreen === 'admin'
                ? 'bg-[#F10B20] text-white'
                : 'bg-neutral-800 text-[#F10B20] hover:bg-neutral-700'
            }`}
          >
            {currentScreen === 'admin' ? 'Exit Admin Dashboard' : 'Salon Admin Console'}
          </button>
        </div>
      </div>

      {/* Main Container: Adapts to either mobile device frame or responsive layout */}
      <div
        className={`w-full min-h-screen transition-all ${
          isMobileFrameMode
            ? 'max-w-[430px] my-6 rounded-[3rem] shadow-[0_0_60px_rgba(0,0,0,0.9)] border-[10px] border-neutral-800 overflow-hidden ring-1 ring-white/10'
            : 'max-w-7xl'
        }`}
      >
        {/* Top Navbar (except inside Admin console which has its own top bar) */}
        {currentScreen !== 'admin' && (
          <TopBar
            currentScreen={currentScreen}
            onNavigate={navigateTo}
            onOpenDrawer={() => setIsDrawerOpen(true)}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
            canGoBack={canGoBack}
            onBack={() => navigateTo('home')}
            title={getScreenTitle()}
            customerName={user?.name}
          />
        )}

        {/* Screen Content Routing */}
        <main className="w-full">
          {currentScreen === 'home' && (
            <HomeDashboard
              user={user}
              services={services}
              bookings={bookings}
              currency={settings.currency}
              onNavigate={navigateTo}
              onSelectService={handleSelectServiceFromHome}
            />
          )}

          {currentScreen === 'services' && (
            <ServicesCatalogue
              services={services}
              selectedServiceIds={selectedServiceIds}
              onToggleService={handleToggleService}
              onProceedToBooking={() => navigateTo('booking')}
              onViewServiceDetails={(svc) => setActiveServiceDetail(svc)}
              currency={settings.currency}
            />
          )}

          {currentScreen === 'booking' && (
            <BookingFlow
              initialSelectedServices={selectedServicesObjects}
              availableServices={services}
              user={user}
              settings={settings}
              currency={settings.currency}
              onBookingComplete={(newBooking) => {
                refreshAppData();
                setSelectedServiceIds([]);
              }}
              onCancel={() => navigateTo('home')}
              onViewBooking={(id) => {
                navigateTo('my-bookings');
              }}
            />
          )}

          {currentScreen === 'my-bookings' && (
            <MyBookings
              bookings={bookings}
              currency={settings.currency}
              user={user}
              onNavigate={navigateTo}
              onRefresh={refreshAppData}
            />
          )}

          {currentScreen === 'profile' && (
            <ProfileView
              user={user}
              onNavigate={navigateTo}
              onLogout={handleLogout}
              onProfileUpdated={(updated) => {
                setUser(updated);
                refreshAppData();
              }}
            />
          )}

          {currentScreen === 'settings' && (
            <SettingsView
              settings={settings}
              onUpdateSettings={(newSettings) => {
                const updated = storage.updateSalonSettings(newSettings);
                setSettings(updated);
              }}
              onReplayOnboarding={() => navigateTo('onboarding')}
              onResetAllData={handleResetAllData}
              onNavigate={navigateTo}
            />
          )}

          {currentScreen === 'admin' && (
            <AdminDashboard
              bookings={bookings}
              services={services}
              settings={settings}
              onRefresh={refreshAppData}
              onExitAdmin={() => navigateTo('home')}
            />
          )}
        </main>

        {/* Mobile Bottom Navigation Bar (active on mobile, hidden in admin) */}
        {currentScreen !== 'admin' && (
          <BottomTabBar
            currentScreen={currentScreen}
            onNavigate={navigateTo}
          />
        )}
      </div>

      {/* Side Navigation Drawer */}
      <SideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        currentScreen={currentScreen}
        onNavigate={navigateTo}
        onLogout={handleLogout}
        isAdmin={false}
        onOpenAdmin={() => navigateTo('admin')}
      />

      {/* Notification Sheet */}
      <NotificationSheet
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onNavigate={navigateTo}
      />

      {/* Service Detail Modal */}
      <ServiceDetailModal
        service={activeServiceDetail}
        isSelected={
          activeServiceDetail
            ? selectedServiceIds.includes(activeServiceDetail.id)
            : false
        }
        onToggle={handleToggleService}
        onClose={() => setActiveServiceDetail(null)}
        currency={settings.currency}
      />

      {/* Local Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50">
          <AuthModal
            onSuccess={(loggedInUser) => {
              setUser(loggedInUser);
              setShowAuthModal(false);
              refreshAppData();
            }}
            onCancel={() => setShowAuthModal(false)}
          />
        </div>
      )}
    </div>
  );
}
