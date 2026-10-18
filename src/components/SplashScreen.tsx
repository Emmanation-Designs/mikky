import React from 'react';
import { MikkysLogo } from './MikkysLogo';
import { IMAGES } from '../services/storage';
import { ArrowRight, Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onStart: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onStart }) => {
  return (
    <div className="relative min-h-screen bg-[#080808] text-white flex flex-col justify-between p-6 overflow-hidden select-none">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#F10B20]/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Branding */}
      <div className="relative z-10 pt-8 flex flex-col items-center">
        <MikkysLogo size="xl" variant="dark" />
      </div>

      {/* Hero Showcase Centerpiece */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-6">
        <div className="relative w-64 h-72 sm:w-72 sm:h-80 rounded-3xl overflow-hidden shadow-2xl shadow-black/80 border border-white/10 group">
          <img
            src={IMAGES.heroFade}
            alt="Mikkys Signature Haircut"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

          {/* Bottom tag on image */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-semibold text-white/90">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#F10B20]" />
              Master Precision
            </span>
            <span className="text-white/60">Lekki Phase 1</span>
          </div>
        </div>

        {/* Catchy headline */}
        <div className="mt-8 text-center max-w-xs">
          <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-white">
            Look Good. <br />
            <span className="text-[#F10B20]">Feel Better.</span>
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-neutral-400 font-medium tracking-wide">
            Premium cuts <span className="text-[#F10B20] mx-1">•</span> Fresh styles <span className="text-[#F10B20] mx-1">•</span> Always
          </p>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="relative z-10 pb-8 flex flex-col items-center max-w-sm mx-auto w-full">
        <button
          onClick={onStart}
          className="w-full py-4 px-6 bg-[#F10B20] hover:bg-[#d0091b] active:scale-[0.98] transition-all text-white font-bold rounded-2xl shadow-xl shadow-[#F10B20]/25 flex items-center justify-center gap-3 text-base font-display"
        >
          <span>Get Started</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <p className="mt-4 text-[11px] text-neutral-500 font-medium">
          Mikkys Barbing Salon • VIP Grooming Experience
        </p>
      </div>
    </div>
  );
};
