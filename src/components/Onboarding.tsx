import React, { useState } from 'react';
import { IMAGES, storage } from '../services/storage';
import { ArrowRight, ChevronRight } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const SLIDES = [
  {
    image: IMAGES.barberStyling,
    titleNormal: 'Professional Barbers. ',
    titleAccent: 'Sharp Styles.',
    description:
      'Get the best grooming experience with skilled barbers and top-notch services.',
  },
  {
    image: IMAGES.tools,
    titleNormal: 'Quality Service. ',
    titleAccent: 'Every Time.',
    description:
      "From fresh fades to clean shaves, we've got you covered with premium care and hygiene.",
  },
  {
    image: IMAGES.interior,
    titleNormal: 'Your Style. ',
    titleAccent: 'Our Priority.',
    description:
      'Book your appointment, choose your service and get ready to look your best with zero wait time.',
  },
];

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      storage.setOnboardingCompleted(true);
      onComplete();
    }
  };

  const handleSkip = () => {
    storage.setOnboardingCompleted(true);
    onComplete();
  };

  const slide = SLIDES[currentSlide];

  return (
    <div className="relative min-h-screen bg-[#080808] text-white flex flex-col justify-between overflow-hidden select-none">
      {/* Top Header bar with Skip button */}
      <div className="relative z-20 flex items-center justify-between p-6 pt-8">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#F10B20]" />
          <span className="text-xs font-bold tracking-widest text-neutral-400 uppercase">
            Step 0{currentSlide + 1} / 0{SLIDES.length}
          </span>
        </div>
        <button
          onClick={handleSkip}
          className="text-xs font-semibold text-neutral-400 hover:text-white px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Main Image Area */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-2">
        <div className="relative w-full max-w-sm h-80 sm:h-96 rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-neutral-900">
          <img
            key={currentSlide}
            src={slide.image}
            alt="Mikkys Barbing Salon"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-all duration-700 animate-fadeIn"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
        </div>
      </div>

      {/* Content & Action Area */}
      <div className="relative z-20 p-6 pb-10 max-w-md mx-auto w-full">
        {/* Slide Copy */}
        <div className="text-left mb-8 min-h-[110px]">
          <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-white leading-tight">
            {slide.titleNormal}
            <span className="text-[#F10B20] block">{slide.titleAccent}</span>
          </h2>
          <p className="mt-3 text-sm text-neutral-400 leading-relaxed font-normal">
            {slide.description}
          </p>
        </div>

        {/* Pagination Dots */}
        <div className="flex items-center gap-2 mb-8">
          {SLIDES.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentSlide
                  ? 'w-7 bg-[#F10B20]'
                  : 'w-2 bg-neutral-700'
              }`}
            />
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={handleNext}
          className="w-full py-4 px-6 bg-[#F10B20] hover:bg-[#d0091b] active:scale-[0.98] transition-all text-white font-bold rounded-2xl shadow-xl shadow-[#F10B20]/30 flex items-center justify-center gap-2 text-base font-display"
        >
          <span>{currentSlide === SLIDES.length - 1 ? 'Get Started' : 'Next'}</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
