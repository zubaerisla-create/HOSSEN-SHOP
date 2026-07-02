"use client";

import React, { useState, useEffect } from 'react';
import { Zap, Truck, Tag } from 'lucide-react';

interface FlashLineSettings {
  promoText: string;
  freeDeliveryText: string;
  discountCodeText: string;
  linkText: string;
  linkUrl: string;
}

const DEFAULT_SETTINGS: FlashLineSettings = {
  promoText: 'Flash Deals: Up to 40% OFF Select Fresh Organic Produce!',
  freeDeliveryText: 'Free delivery on orders over $20!',
  discountCodeText: 'Special Discount Code: HOSSEN10',
  linkText: 'Shop Now',
  linkUrl: '/deals'
};

export default function AdminFlashLinePage() {
  const [promoText, setPromoText] = useState(DEFAULT_SETTINGS.promoText);
  const [freeDeliveryText, setFreeDeliveryText] = useState(DEFAULT_SETTINGS.freeDeliveryText);
  const [discountCodeText, setDiscountCodeText] = useState(DEFAULT_SETTINGS.discountCodeText);
  const [linkText, setLinkText] = useState(DEFAULT_SETTINGS.linkText);
  const [linkUrl, setLinkUrl] = useState(DEFAULT_SETTINGS.linkUrl);
  
  const [toastMessage, setToastMessage] = useState('');

  // Load saved settings on mount
  useEffect(() => {
    const saved = localStorage.getItem('hossen_shop_flash_line_settings');
    if (saved) {
      try {
        const parsed: FlashLineSettings = JSON.parse(saved);
        setPromoText(parsed.promoText || DEFAULT_SETTINGS.promoText);
        setFreeDeliveryText(parsed.freeDeliveryText || DEFAULT_SETTINGS.freeDeliveryText);
        setDiscountCodeText(parsed.discountCodeText || DEFAULT_SETTINGS.discountCodeText);
        setLinkText(parsed.linkText || DEFAULT_SETTINGS.linkText);
        setLinkUrl(parsed.linkUrl || DEFAULT_SETTINGS.linkUrl);
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const settings: FlashLineSettings = {
      promoText,
      freeDeliveryText,
      discountCodeText,
      linkText,
      linkUrl
    };
    localStorage.setItem('hossen_shop_flash_line_settings', JSON.stringify(settings));
    showToast('Flash Line settings saved successfully!');
  };

  const handleRestoreDefaults = () => {
    setPromoText(DEFAULT_SETTINGS.promoText);
    setFreeDeliveryText(DEFAULT_SETTINGS.freeDeliveryText);
    setDiscountCodeText(DEFAULT_SETTINGS.discountCodeText);
    setLinkText(DEFAULT_SETTINGS.linkText);
    setLinkUrl(DEFAULT_SETTINGS.linkUrl);
    
    const settings: FlashLineSettings = DEFAULT_SETTINGS;
    localStorage.setItem('hossen_shop_flash_line_settings', JSON.stringify(settings));
    showToast('Restored default settings!');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  return (
    <div className="bg-white border border-neutral-100 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-8 font-sans text-left relative overflow-hidden">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F2C1F] text-white px-5 py-3 rounded-2xl shadow-xl border border-[#0F2C1F]/20 text-xs font-bold animate-[popup-bounce_0.35s_ease-out] flex items-center gap-2">
          <svg className="w-4 h-4 text-green-400 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {toastMessage}
        </div>
      )}

      {/* Header section with Action Button */}
      <div className="flex justify-between items-start pb-5 border-b border-neutral-100">
        <div className="flex flex-col gap-0.5">
          <h2 className="font-serif text-2xl font-bold text-neutral-800">Navbar Flash Line Manager</h2>
          <p className="text-xs text-neutral-400 font-semibold">Manage the sliding announcement bar content and link shown above the navbar</p>
        </div>
        <button
          onClick={handleRestoreDefaults}
          className="px-4 py-2.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-600 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm animate-fade-in"
        >
          <svg className="w-4 h-4 text-[#FF5C00]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Restore Defaults
        </button>
      </div>

      {/* Two Column Layout: Editor (left) vs Preview (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Editor Form */}
        <form onSubmit={handleSave} className="flex flex-col gap-5 text-sm">
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-[#FF5C00] fill-[#FF5C00]" /> Promo Text (Slide 1)
            </label>
            <input
              type="text"
              required
              value={promoText}
              onChange={(e) => setPromoText(e.target.value)}
              placeholder="e.g. Flash Deals: Up to 40% OFF Select Fresh Organic Produce!"
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-[#0F2C1F]/45 transition-all text-neutral-800 font-medium"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-[#FF5C00]" /> Delivery Text (Slide 2)
            </label>
            <input
              type="text"
              required
              value={freeDeliveryText}
              onChange={(e) => setFreeDeliveryText(e.target.value)}
              placeholder="e.g. Free delivery on orders over $20!"
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-[#0F2C1F]/45 transition-all text-neutral-800 font-medium"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-[#FF5C00] fill-[#FF5C00]" /> Discount Code Text (Slide 3)
            </label>
            <input
              type="text"
              required
              value={discountCodeText}
              onChange={(e) => setDiscountCodeText(e.target.value)}
              placeholder="e.g. Special Discount Code: HOSSEN10"
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-[#0F2C1F]/45 transition-all text-neutral-800 font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Button CTA Text</label>
              <input
                type="text"
                required
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="e.g. Shop Now"
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-[#0F2C1F]/45 transition-all text-neutral-800 font-medium"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Button Link Destination</label>
              <input
                type="text"
                required
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="e.g. /deals"
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-[#0F2C1F]/45 transition-all text-neutral-800 font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            className="self-start mt-2 px-8 py-3 bg-[#FF5C00] hover:bg-brand-orange-hover text-white rounded-xl font-bold tracking-wide transition-all shadow-md active:scale-95 cursor-pointer text-center"
          >
            Save Settings
          </button>

        </form>

        {/* Live Preview Panel */}
        <div className="flex flex-col gap-3">
          <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider text-left">Live Marquee Preview</label>
          <div className="w-full bg-neutral-50 border border-neutral-100 rounded-3xl p-6 sm:p-8 flex flex-col justify-center items-center gap-4 min-h-[220px]">
            
            {/* The Actual Marquee Preview */}
            <div className="w-full bg-[#FF5C00] text-white py-3 px-4 font-sans text-xs md:text-sm font-semibold flex items-center transition-all duration-300 ease-in-out overflow-hidden shadow-inner rounded-2xl relative">
              <div className="w-full flex items-center justify-between gap-4">
                
                {/* Scroll Wrapper */}
                <div className="flex-1 overflow-hidden relative flex items-center h-5">
                  <div className="animate-marquee-left flex items-center gap-16 select-none text-white tracking-wide whitespace-nowrap">
                    <span className="flex items-center gap-2 shrink-0">
                      <Zap className="w-4 h-4 text-amber-300 fill-amber-300 shrink-0" /> {promoText} <Zap className="w-4 h-4 text-amber-300 fill-amber-300 shrink-0" />
                    </span>
                    <span className="flex items-center gap-2 shrink-0">
                      <Truck className="w-4 h-4 text-amber-300 shrink-0" /> {freeDeliveryText} <Truck className="w-4 h-4 text-amber-300 shrink-0" />
                    </span>
                    <span className="flex items-center gap-2 shrink-0">
                      <Tag className="w-4 h-4 text-amber-300 fill-amber-300 shrink-0" /> {discountCodeText} <Tag className="w-4 h-4 text-amber-300 fill-amber-300 shrink-0" />
                    </span>
                    
                    {/* Seamless Loop Duplicates */}
                    <span className="flex items-center gap-2 shrink-0">
                      <Zap className="w-4 h-4 text-amber-300 fill-amber-300 shrink-0" /> {promoText} <Zap className="w-4 h-4 text-amber-300 fill-amber-300 shrink-0" />
                    </span>
                    <span className="flex items-center gap-2 shrink-0">
                      <Truck className="w-4 h-4 text-amber-300 shrink-0" /> {freeDeliveryText} <Truck className="w-4 h-4 text-amber-300 shrink-0" />
                    </span>
                    <span className="flex items-center gap-2 shrink-0">
                      <Tag className="w-4 h-4 text-amber-300 fill-amber-300 shrink-0" /> {discountCodeText} <Tag className="w-4 h-4 text-amber-300 fill-amber-300 shrink-0" />
                    </span>
                  </div>
                </div>

                {/* Button CTA Link */}
                <div className="bg-white text-[#FF5C00] px-3.5 py-1 rounded-full text-[10px] md:text-xs font-bold transition-all shadow-md flex items-center gap-1 shrink-0 select-none cursor-pointer">
                  {linkText}
                  <svg className="w-3 h-3 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>

              </div>
            </div>

            <span className="text-[10px] text-neutral-400 font-semibold italic">
              Note: This marquee preview mimics the top bar. Destination URL will point to &quot;{linkUrl}&quot;
            </span>

          </div>
        </div>

      </div>

    </div>
  );
}
