"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSiteContent } from '../../lib/SiteContentContext';

export default function FlashPromoModal() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const { flashPromo, isLoaded } = useSiteContent();

  useEffect(() => {
    setMounted(true);
    
    const isShown = localStorage.getItem('hossen_shop_flash_promo_shown');
    if (!isShown) {
      // Delay slightly for premium page transition experience
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsClosing(true);
    // Wait for fade-out animation before removing from DOM
    setTimeout(() => {
      localStorage.setItem('hossen_shop_flash_promo_shown', 'true');
      setIsOpen(false);
      setIsClosing(false);
    }, 300);
  };

  const handleShopNow = () => {
    handleDismiss();
    router.push('/deals');
  };

  if (!mounted || !isOpen || !isLoaded || !flashPromo) return null;

  const { title, badge, description, image, buttonText } = flashPromo;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
      isClosing ? 'opacity-0' : 'opacity-100'
    }`}>
      {/* Premium Backdrop Overlay */}
      <div 
        onClick={handleDismiss}
        className={`absolute inset-0 bg-neutral-900/65 backdrop-blur-[3px] transition-opacity duration-300 ${
          isClosing ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* Pop-up Box Container */}
      <div className={`relative z-10 w-full max-w-lg bg-white rounded-[32px] overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] border border-neutral-100/50 flex flex-col transition-all duration-300 transform ${
        isClosing ? 'scale-95 translate-y-4' : 'scale-100 translate-y-0 animate-[popup-bounce_0.4s_ease-out]'
      }`}>
        
        {/* Floating Dismiss Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/45 hover:bg-black/60 text-white flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Dismiss Promo"
        >
          <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Premium Graphic Banner Cover */}
        <div className="relative w-full aspect-[4/3] bg-neutral-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt="Flash Deals Banner"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/images/flash_deal_promo.png";
            }}
          />
          
          {/* Gradient Overlay for subtle text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/40 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Text Details & Action CTA Block */}
        <div className="p-6 sm:p-8 flex flex-col items-center text-center gap-5 bg-gradient-to-b from-white to-neutral-50/50">
          <div className="flex flex-col gap-1.5">
            {badge && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/50 text-[#FF5C00] font-sans font-bold text-[10px] tracking-widest uppercase self-center mb-1 select-none animate-pulse">
                {badge}
              </div>
            )}
            <h3 className="font-serif text-xl sm:text-2xl font-black text-neutral-800 tracking-tight leading-tight">
              {title}
            </h3>
            <p className="font-sans text-xs sm:text-sm text-neutral-500 max-w-sm leading-relaxed">
              {description}
            </p>
          </div>

          {/* Action CTA Button */}
          <button
            onClick={handleShopNow}
            className="w-full py-4 bg-[#FF5C00] hover:bg-brand-orange-hover text-white rounded-2xl font-bold text-sm tracking-wide shadow-md transition-all active:scale-[0.98] cursor-pointer text-center flex items-center justify-center gap-2 group"
          >
            {buttonText}
            <svg className="w-4 h-4 stroke-[2.5] transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>

      </div>
    </div>
  );
}
