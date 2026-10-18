import React from 'react';
import { Service } from '../types';
import { formatPrice } from '../utils/formatters';
import { X, Clock, Check, Plus, Tag } from 'lucide-react';

interface ServiceDetailModalProps {
  service: Service | null;
  isSelected: boolean;
  onToggle: (service: Service) => void;
  onClose: () => void;
  currency: string;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  isSelected,
  onToggle,
  onClose,
  currency,
}) => {
  if (!service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl z-10 animate-scaleUp">
        {/* Image header */}
        <div className="relative h-56 bg-neutral-900">
          <img
            src={service.imageUrl}
            alt={service.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/90 text-white rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[#F10B20] inline-block mb-1">
              {service.category}
            </span>
            <h3 className="text-xl font-display font-black leading-tight">
              {service.name}
            </h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
            <div>
              <span className="text-xs text-neutral-400 font-medium">Service Fee</span>
              <div className="text-2xl font-black font-display text-[#F10B20]">
                {formatPrice(service.price, currency)}
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600 bg-neutral-100 px-3 py-1.5 rounded-full">
              <Clock className="w-3.5 h-3.5 text-neutral-500" />
              <span>{service.durationMinutes} Minutes</span>
            </div>
          </div>

          <div className="py-4">
            <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
              Description & Craft
            </h4>
            <p className="text-sm text-neutral-600 leading-relaxed">
              {service.description}
            </p>
          </div>

          <div className="bg-neutral-50 rounded-2xl p-3.5 mb-6 text-xs text-neutral-500 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F10B20]" />
              <span>Includes premium consultation and styling product finish</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F10B20]" />
              <span>Sanitized professional tools for every client</span>
            </div>
          </div>

          {/* Action button */}
          <button
            onClick={() => {
              onToggle(service);
              onClose();
            }}
            className={`w-full py-4 rounded-xl font-bold text-sm font-display flex items-center justify-center gap-2 transition-all shadow-md ${
              isSelected
                ? 'bg-neutral-900 text-white hover:bg-neutral-800'
                : 'bg-[#F10B20] text-white hover:bg-[#d0091b] shadow-[#F10B20]/25'
            }`}
          >
            {isSelected ? (
              <>
                <Check className="w-4 h-4" />
                <span>Remove from Selected Services</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Add to Appointment</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
