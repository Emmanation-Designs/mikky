import React, { useState } from 'react';
import { Service, ServiceCategory, AppScreen } from '../types';
import { formatPrice } from '../utils/formatters';
import {
  Search,
  Check,
  Plus,
  ArrowRight,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react';

interface ServicesCatalogueProps {
  services: Service[];
  selectedServiceIds: string[];
  onToggleService: (service: Service) => void;
  onProceedToBooking: () => void;
  onViewServiceDetails: (service: Service) => void;
  currency: string;
}

const CATEGORIES: (ServiceCategory | 'All')[] = [
  'All',
  'Haircuts',
  'Beard',
  'Extras',
  'Combos',
];

export const ServicesCatalogue: React.FC<ServicesCatalogueProps> = ({
  services,
  selectedServiceIds,
  onToggleService,
  onProceedToBooking,
  onViewServiceDetails,
  currency,
}) => {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory | 'All'>('Haircuts');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = services
    .filter((s) => s.isActive)
    .filter((s) => {
      if (activeCategory === 'All') return true;
      return s.category === activeCategory;
    })
    .filter((s) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
      );
    });

  const selectedServices = services.filter((s) => selectedServiceIds.includes(s.id));
  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="min-h-screen bg-white text-neutral-900 pb-28 select-none">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4">
        {/* Search bar */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search haircut, beard, wash, combo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-neutral-100/80 border border-neutral-200/80 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F10B20] placeholder:text-neutral-400"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>

        {/* Category Pills / Segmented Buttons (matching showcase) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 mb-6">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-[#F10B20] text-white shadow-md shadow-[#F10B20]/25'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-black'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Service List */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-16 bg-neutral-50 rounded-3xl border border-neutral-200/60 p-6">
            <Sparkles className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
            <h3 className="font-bold text-neutral-700 text-sm">No services found</h3>
            <p className="text-xs text-neutral-400 mt-1">Try another category or search term.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredServices.map((service) => {
              const isSelected = selectedServiceIds.includes(service.id);
              return (
                <div
                  key={service.id}
                  onClick={() => onToggleService(service)}
                  className={`flex items-center gap-4 p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-red-50/40 border-[#F10B20] ring-1 ring-[#F10B20]'
                      : 'bg-white border-neutral-200/80 hover:border-neutral-300 hover:bg-neutral-50/50'
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-neutral-100 shrink-0">
                    <img
                      src={service.imageUrl}
                      alt={service.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm sm:text-base text-neutral-900 truncate">
                        {service.name}
                      </h3>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewServiceDetails(service);
                        }}
                        className="text-neutral-400 hover:text-neutral-600 p-1"
                        title="View details"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-extrabold text-sm text-[#F10B20]">
                        {formatPrice(service.price, currency)}
                      </span>
                      <span className="text-[11px] text-neutral-400 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {service.durationMinutes} mins
                      </span>
                    </div>

                    <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
                      {service.description}
                    </p>
                  </div>

                  {/* Selection Button / Checkmark */}
                  <div className="shrink-0 pl-1">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-[#F10B20] text-white shadow-md shadow-[#F10B20]/30'
                          : 'border-2 border-neutral-300 text-transparent hover:border-neutral-400'
                      }`}
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Bottom Bar when services are selected */}
      {selectedServices.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#080808]/95 backdrop-blur-md border-t border-neutral-200 dark:border-neutral-800 p-4 shadow-2xl">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            <div>
              <span className="text-xs text-neutral-500 font-semibold block">
                {selectedServices.length} {selectedServices.length === 1 ? 'service' : 'services'} selected
              </span>
              <span className="text-lg font-black font-display text-neutral-900 dark:text-white">
                Total: <span className="text-[#F10B20]">{formatPrice(totalPrice, currency)}</span>
              </span>
            </div>

            <button
              onClick={onProceedToBooking}
              className="py-3 px-6 bg-[#F10B20] hover:bg-[#d0091b] active:scale-95 text-white font-bold rounded-xl shadow-lg shadow-[#F10B20]/25 transition-all flex items-center gap-2 text-sm font-display"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
