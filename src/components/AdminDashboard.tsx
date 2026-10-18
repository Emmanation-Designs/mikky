import React, { useState } from 'react';
import { Booking, Service, SalonSettings, ServiceCategory } from '../types';
import { formatPrice, formatDate } from '../utils/formatters';
import { storage, IMAGES } from '../services/storage';
import {
  Calendar,
  Clock,
  User,
  Phone,
  MessageCircle,
  Scissors,
  CheckCircle2,
  Clock3,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Settings,
  ArrowLeft,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Check,
  X,
  ExternalLink,
} from 'lucide-react';

interface AdminDashboardProps {
  bookings: Booking[];
  services: Service[];
  settings: SalonSettings;
  onRefresh: () => void;
  onExitAdmin: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  bookings,
  services,
  settings,
  onRefresh,
  onExitAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'services' | 'salon-settings'>('overview');

  // Bookings search & filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | Booking['status']>('All');
  const [dateFilter, setDateFilter] = useState('');

  // Service management modal
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Salon settings form state
  const [salonName, setSalonName] = useState(settings.salonName);
  const [contactPhone, setContactPhone] = useState(settings.contactPhone);
  const [whatsappPhone, setWhatsappPhone] = useState(settings.whatsappPhone);
  const [openingTime, setOpeningTime] = useState(settings.openingTime);
  const [closingTime, setClosingTime] = useState(settings.closingTime);
  const [newBarberInput, setNewBarberInput] = useState('');
  const [barbersList, setBarbersList] = useState<string[]>(settings.barbers);
  const [settingsSavedToast, setSettingsSavedToast] = useState(false);

  // Action toast feedback
  const [adminToast, setAdminToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setAdminToast(msg);
    setTimeout(() => setAdminToast(null), 3000);
  };

  // KPIs
  const totalBookingsCount = bookings.length;
  const pendingCount = bookings.filter((b) => b.status === 'Pending').length;
  const confirmedCount = bookings.filter((b) => b.status === 'Confirmed').length;
  const completedCount = bookings.filter((b) => b.status === 'Completed').length;
  const cancelledCount = bookings.filter((b) => b.status === 'Cancelled').length;
  const totalValue = bookings
    .filter((b) => b.status !== 'Cancelled')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  // Filtered bookings
  const filteredBookings = bookings.filter((b) => {
    if (statusFilter !== 'All' && b.status !== statusFilter) return false;
    if (dateFilter && b.date !== dateFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = b.customerName.toLowerCase().includes(q);
      const matchId = b.id.toLowerCase().includes(q);
      const matchPhone = b.customerPhone.includes(q);
      const matchWA = b.customerWhatsApp.includes(q);
      const matchBarber = b.barberName.toLowerCase().includes(q);
      return matchName || matchId || matchPhone || matchWA || matchBarber;
    }
    return true;
  });

  // Handlers for Booking Status Updates
  const handleUpdateStatus = (bookingId: string, newStatus: Booking['status']) => {
    const success = storage.updateBookingStatus(bookingId, newStatus);
    if (success) {
      showToast(`Booking ${bookingId} status updated to ${newStatus}`);
      onRefresh();
    }
  };

  // Handlers for Service Management
  const handleOpenAddService = () => {
    setEditingService({
      name: '',
      description: '',
      price: 5000,
      category: 'Haircuts',
      durationMinutes: 45,
      imageUrl: IMAGES.heroFade,
      isActive: true,
    });
    setShowServiceModal(true);
  };

  const handleOpenEditService = (service: Service) => {
    setEditingService({ ...service });
    setShowServiceModal(true);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService || !editingService.name?.trim() || !editingService.price) return;

    storage.saveService({
      id: editingService.id,
      name: editingService.name.trim(),
      description: editingService.description || '',
      price: Number(editingService.price),
      category: (editingService.category as ServiceCategory) || 'Haircuts',
      durationMinutes: Number(editingService.durationMinutes) || 45,
      imageUrl: editingService.imageUrl || IMAGES.heroFade,
      isActive: editingService.isActive !== false,
    });

    setShowServiceModal(false);
    setEditingService(null);
    showToast('Service saved successfully.');
    onRefresh();
  };

  const handleDeleteService = (id: string) => {
    storage.deleteService(id);
    setDeleteConfirmId(null);
    showToast('Service deleted. Note: Historical bookings preserve their saved service snapshot.');
    onRefresh();
  };

  const handleToggleServiceActive = (id: string) => {
    storage.toggleServiceStatus(id);
    onRefresh();
  };

  // Handlers for Salon Settings
  const handleSaveSalonSettings = (e: React.FormEvent) => {
    e.preventDefault();
    storage.updateSalonSettings({
      salonName: salonName.trim(),
      contactPhone: contactPhone.trim(),
      whatsappPhone: whatsappPhone.trim(),
      openingTime,
      closingTime,
      barbers: barbersList,
    });
    setSettingsSavedToast(true);
    setTimeout(() => setSettingsSavedToast(false), 2500);
    onRefresh();
  };

  const handleAddBarber = () => {
    if (newBarberInput.trim() && !barbersList.includes(newBarberInput.trim())) {
      setBarbersList([...barbersList, newBarberInput.trim()]);
      setNewBarberInput('');
    }
  };

  const handleRemoveBarber = (barberToRemove: string) => {
    if (barbersList.length <= 1) return;
    setBarbersList(barbersList.filter((b) => b !== barberToRemove));
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white pb-24 select-none">
      {/* Top Admin Navigation Header */}
      <div className="bg-[#080808] border-b border-neutral-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onExitAdmin}
              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white transition-colors flex items-center gap-2 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Customer App</span>
            </button>
            <div className="hidden sm:block">
              <span className="text-xs bg-[#F10B20] text-white font-black px-2 py-0.5 rounded uppercase tracking-wider">
                Admin Console
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400 hidden sm:inline">
              Mikkys Barbing Salon (Local Mode)
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex overflow-x-auto no-scrollbar gap-2 pb-2">
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: TrendingUp },
            { id: 'bookings', label: `Manage Bookings (${bookings.length})`, icon: Calendar },
            { id: 'services', label: `Services Catalogue (${services.length})`, icon: Scissors },
            { id: 'salon-settings', label: 'Salon Configuration', icon: Settings },
          ].map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as typeof activeTab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#F10B20] text-white shadow-md shadow-[#F10B20]/30'
                    : 'bg-neutral-800/70 text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Toast Feedback */}
      {adminToast && (
        <div className="fixed top-20 right-4 z-50 p-4 bg-white text-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{adminToast}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* ================= TAB 1: OVERVIEW ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              <div className="bg-neutral-800/80 border border-neutral-700/60 p-4 rounded-2xl">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  Total Bookings
                </span>
                <div className="text-2xl font-black font-display text-white mt-1">
                  {totalBookingsCount}
                </div>
              </div>

              <div className="bg-neutral-800/80 border border-amber-900/40 p-4 rounded-2xl">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                  Pending
                </span>
                <div className="text-2xl font-black font-display text-amber-300 mt-1">
                  {pendingCount}
                </div>
              </div>

              <div className="bg-neutral-800/80 border border-emerald-900/40 p-4 rounded-2xl">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                  Confirmed
                </span>
                <div className="text-2xl font-black font-display text-emerald-300 mt-1">
                  {confirmedCount}
                </div>
              </div>

              <div className="bg-neutral-800/80 border border-blue-900/40 p-4 rounded-2xl">
                <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
                  Completed
                </span>
                <div className="text-2xl font-black font-display text-blue-300 mt-1">
                  {completedCount}
                </div>
              </div>

              <div className="bg-neutral-800/80 border border-red-900/40 p-4 rounded-2xl">
                <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider">
                  Cancelled
                </span>
                <div className="text-2xl font-black font-display text-red-300 mt-1">
                  {cancelledCount}
                </div>
              </div>

              <div className="bg-neutral-800/80 border border-neutral-700/60 p-4 rounded-2xl col-span-2 sm:col-span-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                    Total Booking Value
                  </span>
                </div>
                <div className="text-xl sm:text-2xl font-black font-display text-[#F10B20] mt-1">
                  {formatPrice(totalValue, settings.currency)}
                </div>
                <span className="text-[9px] text-neutral-400 block mt-0.5">
                  *Booking total, not verified payment
                </span>
              </div>
            </div>

            {/* Quick Action Strip */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-neutral-800/50 p-4 rounded-2xl border border-neutral-800">
              <div>
                <h3 className="font-display font-black text-base">Quick Salon Operations</h3>
                <p className="text-xs text-neutral-400">
                  Manage live appointment requests or configure services.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('bookings')}
                  className="px-4 py-2 bg-[#F10B20] hover:bg-[#d0091b] rounded-xl text-xs font-bold transition-colors"
                >
                  View Bookings List
                </button>
                <button
                  onClick={handleOpenAddService}
                  className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Service</span>
                </button>
              </div>
            </div>

            {/* Recent Bookings Preview */}
            <div className="bg-neutral-800/40 rounded-3xl p-5 border border-neutral-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-black text-base text-white">
                  Recent Appointments ({bookings.slice(0, 5).length})
                </h3>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className="text-xs font-bold text-[#F10B20] hover:underline"
                >
                  See All Bookings
                </button>
              </div>

              {bookings.length === 0 ? (
                <p className="text-xs text-neutral-500 py-6 text-center">No bookings recorded yet.</p>
              ) : (
                <div className="space-y-2.5">
                  {bookings.slice(0, 5).map((b) => (
                    <div
                      key={b.id}
                      className="p-3.5 bg-neutral-800/70 border border-neutral-700/50 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-neutral-400">{b.id}</span>
                        <div>
                          <div className="font-bold text-white text-sm">{b.customerName}</div>
                          <div className="text-neutral-400 text-[11px]">
                            {b.services.map((s) => s.name).join(', ')} • {formatDate(b.date)} at {b.time}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-bold text-white">
                          {formatPrice(b.totalAmount, settings.currency)}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            b.status === 'Confirmed'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : b.status === 'Pending'
                              ? 'bg-amber-500/20 text-amber-400'
                              : b.status === 'Completed'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {b.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 2: BOOKING MANAGEMENT ================= */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            {/* Search and Filters */}
            <div className="bg-neutral-800/80 p-4 rounded-2xl border border-neutral-700/60 flex flex-wrap gap-3 items-center justify-between">
              <div className="relative flex-1 min-w-[240px]">
                <input
                  type="text"
                  placeholder="Search by customer name, ref ID, phone or WhatsApp..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-900 border border-neutral-700 rounded-xl text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-[#F10B20]"
                />
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {(['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      statusFilter === st
                        ? 'bg-[#F10B20] text-white'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Date Filter */}
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-neutral-300"
              />
              {dateFilter && (
                <button
                  onClick={() => setDateFilter('')}
                  className="text-xs text-neutral-400 hover:text-white underline"
                >
                  Clear date
                </button>
              )}
            </div>

            {/* Bookings Table / Card list */}
            {filteredBookings.length === 0 ? (
              <div className="p-12 text-center bg-neutral-800/30 rounded-3xl border border-neutral-800">
                <Calendar className="w-10 h-10 text-neutral-600 mx-auto mb-2" />
                <h4 className="font-bold text-neutral-400 text-sm">No bookings matching filter</h4>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredBookings.map((b) => {
                  const whatsappUrl = storage.generateWhatsAppUrl(
                    b.customerWhatsApp,
                    `Hello ${b.customerName}, this is Mikkys Barbing Salon regarding your appointment ${b.id} on ${b.date} at ${b.time}.`
                  );

                  return (
                    <div
                      key={b.id}
                      className="bg-neutral-800/70 border border-neutral-700/60 rounded-2xl p-4 sm:p-5 transition-all space-y-3"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs bg-neutral-900 px-2 py-1 rounded text-[#F10B20]">
                            {b.id}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              b.status === 'Confirmed'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : b.status === 'Pending'
                                ? 'bg-amber-500/20 text-amber-400'
                                : b.status === 'Completed'
                                ? 'bg-blue-500/20 text-blue-400'
                                : 'bg-red-500/20 text-red-400'
                            }`}
                          >
                            {b.status}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-black text-white">
                            {formatPrice(b.totalAmount, settings.currency)}
                          </span>
                        </div>
                      </div>

                      {/* Client Info Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-neutral-900/60 p-3 rounded-xl">
                        <div>
                          <span className="text-neutral-500 block text-[10px] uppercase font-bold">
                            Customer
                          </span>
                          <span className="font-bold text-white text-sm">{b.customerName}</span>
                          <div className="text-neutral-400 mt-0.5">Tel: {b.customerPhone}</div>
                        </div>

                        <div>
                          <span className="text-neutral-500 block text-[10px] uppercase font-bold">
                            Appointment
                          </span>
                          <span className="font-bold text-white">
                            {formatDate(b.date)} at {b.time}
                          </span>
                          <div className="text-neutral-400 mt-0.5">Stylist: {b.barberName}</div>
                        </div>

                        <div>
                          <span className="text-neutral-500 block text-[10px] uppercase font-bold">
                            Services Snapshot
                          </span>
                          <div className="text-neutral-300 font-medium line-clamp-2">
                            {b.services.map((s) => s.name).join(', ')}
                          </div>
                        </div>
                      </div>

                      {b.notes && (
                        <div className="text-xs text-neutral-400 bg-neutral-900/30 p-2.5 rounded-lg italic">
                          "{b.notes}"
                        </div>
                      )}

                      {/* Admin Controls */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-700/50">
                        {/* WhatsApp Direct Chat */}
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Chat on WhatsApp ({b.customerWhatsApp})</span>
                          <ExternalLink className="w-3 h-3 opacity-70" />
                        </a>

                        {/* Status Change Buttons */}
                        <div className="flex items-center gap-1.5">
                          {b.status === 'Pending' && (
                            <button
                              onClick={() => handleUpdateStatus(b.id, 'Confirmed')}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors"
                            >
                              Confirm
                            </button>
                          )}

                          {b.status === 'Confirmed' && (
                            <button
                              onClick={() => handleUpdateStatus(b.id, 'Completed')}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors"
                            >
                              Mark Completed
                            </button>
                          )}

                          {b.status !== 'Cancelled' && (
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to cancel booking ${b.id}?`)) {
                                  handleUpdateStatus(b.id, 'Cancelled');
                                }
                              }}
                              className="px-3 py-1.5 bg-neutral-700 hover:bg-red-900 text-neutral-300 hover:text-white rounded-lg text-xs font-bold transition-colors"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 3: SERVICES MANAGEMENT ================= */}
        {activeTab === 'services' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-black text-lg text-white">
                  Services Catalogue ({services.length})
                </h3>
                <p className="text-xs text-neutral-400">
                  Update service offerings, prices, and categories. Changes are saved locally and preserve existing booking snapshots.
                </p>
              </div>
              <button
                onClick={handleOpenAddService}
                className="px-4 py-2 bg-[#F10B20] hover:bg-[#d0091b] rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Service</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((svc) => (
                <div
                  key={svc.id}
                  className={`bg-neutral-800/80 border rounded-2xl overflow-hidden p-4 flex flex-col justify-between ${
                    svc.isActive ? 'border-neutral-700/70' : 'border-neutral-800 opacity-60'
                  }`}
                >
                  <div className="flex gap-3">
                    <img
                      src={svc.imageUrl}
                      alt={svc.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-xl object-cover bg-neutral-900 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-[#F10B20]">
                          {svc.category}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            svc.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-neutral-700 text-neutral-400'
                          }`}
                        >
                          {svc.isActive ? 'Active' : 'Disabled'}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-white truncate">{svc.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-black text-sm text-[#F10B20]">
                          {formatPrice(svc.price, settings.currency)}
                        </span>
                        <span className="text-[10px] text-neutral-400">
                          {svc.durationMinutes} mins
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-400 mt-2 line-clamp-2">
                    {svc.description}
                  </p>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-neutral-700/50">
                    <button
                      onClick={() => handleToggleServiceActive(svc.id)}
                      className="text-xs text-neutral-400 hover:text-white"
                    >
                      {svc.isActive ? 'Disable' : 'Enable'}
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditService(svc)}
                        className="p-1.5 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-white transition-colors"
                        title="Edit Service"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(svc.id)}
                        className="p-1.5 bg-neutral-700 hover:bg-red-800 rounded-lg text-white transition-colors"
                        title="Delete Service"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 4: SALON CONFIGURATION ================= */}
        {activeTab === 'salon-settings' && (
          <div className="max-w-2xl bg-neutral-800/80 border border-neutral-700/60 rounded-3xl p-6 space-y-6">
            <div>
              <h3 className="font-display font-black text-lg text-white">Salon Configuration</h3>
              <p className="text-xs text-neutral-400">
                Update salon contact numbers, appointment hours, and demo master barbers.
              </p>
            </div>

            {settingsSavedToast && (
              <div className="p-3 bg-emerald-900/60 border border-emerald-500/50 text-emerald-200 text-xs font-bold rounded-xl flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Salon settings saved successfully!</span>
              </div>
            )}

            <form onSubmit={handleSaveSalonSettings} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Salon Brand Name
                </label>
                <input
                  type="text"
                  value={salonName}
                  onChange={(e) => setSalonName(e.target.value)}
                  className="w-full p-3 bg-neutral-900 border border-neutral-700 rounded-xl text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    Contact Phone Number
                  </label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full p-3 bg-neutral-900 border border-neutral-700 rounded-xl text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    Official WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={whatsappPhone}
                    onChange={(e) => setWhatsappPhone(e.target.value)}
                    className="w-full p-3 bg-neutral-900 border border-neutral-700 rounded-xl text-sm text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    Opening Time
                  </label>
                  <input
                    type="time"
                    value={openingTime}
                    onChange={(e) => setOpeningTime(e.target.value)}
                    className="w-full p-3 bg-neutral-900 border border-neutral-700 rounded-xl text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    Closing Time
                  </label>
                  <input
                    type="time"
                    value={closingTime}
                    onChange={(e) => setClosingTime(e.target.value)}
                    className="w-full p-3 bg-neutral-900 border border-neutral-700 rounded-xl text-sm text-white"
                  />
                </div>
              </div>

              {/* Barbers list */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                  Demo Stylists & Barbers
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="e.g. Master Emeka (Textured Cuts)"
                    value={newBarberInput}
                    onChange={(e) => setNewBarberInput(e.target.value)}
                    className="flex-1 p-2.5 bg-neutral-900 border border-neutral-700 rounded-xl text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddBarber}
                    className="px-4 py-2.5 bg-[#F10B20] hover:bg-[#d0091b] rounded-xl text-xs font-bold text-white"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {barbersList.map((barber) => (
                    <span
                      key={barber}
                      className="px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded-xl text-xs flex items-center gap-2"
                    >
                      <span>{barber}</span>
                      {barber !== 'Any Available' && (
                        <button
                          type="button"
                          onClick={() => handleRemoveBarber(barber)}
                          className="text-neutral-400 hover:text-red-400"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-700">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#F10B20] hover:bg-[#d0091b] text-white font-bold rounded-xl text-xs shadow-lg shadow-[#F10B20]/25 transition-all"
                >
                  Save Salon Settings
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Service Add/Edit Modal */}
      {showServiceModal && editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowServiceModal(false)}
          />

          <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-700 rounded-3xl p-6 shadow-2xl z-10 text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="font-display font-black text-base text-white">
                {editingService.id ? 'Edit Service' : 'Add New Service'}
              </h3>
              <button
                onClick={() => setShowServiceModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-neutral-400 font-bold mb-1 uppercase">
                  Service Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingService.name || ''}
                  onChange={(e) =>
                    setEditingService({ ...editingService, name: e.target.value })
                  }
                  placeholder="e.g. Sharp Skin Fade"
                  className="w-full p-2.5 bg-neutral-800 border border-neutral-700 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-bold mb-1 uppercase">
                    Category
                  </label>
                  <select
                    value={editingService.category || 'Haircuts'}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        category: e.target.value as ServiceCategory,
                      })
                    }
                    className="w-full p-2.5 bg-neutral-800 border border-neutral-700 rounded-xl text-white"
                  >
                    <option value="Haircuts">Haircuts</option>
                    <option value="Beard">Beard</option>
                    <option value="Extras">Extras</option>
                    <option value="Combos">Combos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-400 font-bold mb-1 uppercase">
                    Price ({settings.currency}) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={editingService.price || 0}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        price: Number(e.target.value),
                      })
                    }
                    className="w-full p-2.5 bg-neutral-800 border border-neutral-700 rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-bold mb-1 uppercase">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min={5}
                    value={editingService.durationMinutes || 40}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        durationMinutes: Number(e.target.value),
                      })
                    }
                    className="w-full p-2.5 bg-neutral-800 border border-neutral-700 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 font-bold mb-1 uppercase">
                    Image Preset
                  </label>
                  <select
                    value={editingService.imageUrl || IMAGES.heroFade}
                    onChange={(e) =>
                      setEditingService({ ...editingService, imageUrl: e.target.value })
                    }
                    className="w-full p-2.5 bg-neutral-800 border border-neutral-700 rounded-xl text-white"
                  >
                    <option value={IMAGES.heroFade}>Sharp Fade Cut</option>
                    <option value={IMAGES.barberStyling}>Barber Clipper Styling</option>
                    <option value={IMAGES.beard}>Beard Sculpt</option>
                    <option value={IMAGES.tools}>Tools & Wash</option>
                    <option value={IMAGES.interior}>Salon Interior</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 font-bold mb-1 uppercase">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editingService.description || ''}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      description: e.target.value,
                    })
                  }
                  className="w-full p-2.5 bg-neutral-800 border border-neutral-700 rounded-xl text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="activeCheck"
                  checked={editingService.isActive !== false}
                  onChange={(e) =>
                    setEditingService({ ...editingService, isActive: e.target.checked })
                  }
                  className="accent-[#F10B20]"
                />
                <label htmlFor="activeCheck" className="text-neutral-300 font-medium">
                  Active (available for customer bookings)
                </label>
              </div>

              <div className="flex gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowServiceModal(false)}
                  className="flex-1 py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#F10B20] hover:bg-[#d0091b] text-white font-bold rounded-xl"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Service Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="relative w-full max-w-sm bg-neutral-900 border border-neutral-700 rounded-3xl p-6 shadow-2xl z-10 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-900/40 text-[#F10B20] flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="font-display font-black text-lg text-white">Delete Service?</h3>
            <p className="text-xs text-neutral-400">
              Are you sure? Note that existing bookings will continue to display this service with its recorded historical name and price snapshot.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-3 bg-neutral-800 text-neutral-300 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteService(deleteConfirmId)}
                className="flex-1 py-3 bg-[#F10B20] hover:bg-[#d0091b] text-white font-bold rounded-xl text-xs"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
