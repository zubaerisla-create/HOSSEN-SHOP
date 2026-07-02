"use client";

import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';

interface PromoSettings {
  title: string;
  badge: string;
  description: string;
  image: string;
  buttonText: string;
}

export default function AdminFlashPromoPage() {
  const [title, setTitle] = useState('Fresh Harvest Flash Deals!');
  const [badge, setBadge] = useState('⚡ Limited Time Only');
  const [description, setDescription] = useState('Unlock exclusive discounts up to 40% OFF on fresh organic produce. Hand-picked and delivered direct to your door!');
  const [image, setImage] = useState('/images/flash_deal_promo.png');
  const [buttonText, setButtonText] = useState('Shop Deals Now');
  
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const fetchPromo = async () => {
      try {
        const data = await api.getCmsSetting<PromoSettings>('flashPromo');
        if (data) {
          setTitle(data.title || '');
          setBadge(data.badge || '');
          setDescription(data.description || '');
          setImage(data.image || '');
          setButtonText(data.buttonText || '');
        }
      } catch (err) {
        console.error('Failed to load flash promo settings from CMS API:', err);
      }
    };
    fetchPromo();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const settings: PromoSettings = {
      title,
      badge,
      description,
      image,
      buttonText
    };
    try {
      await api.updateCmsSetting<PromoSettings>('flashPromo', settings);
      showToast('Promo settings saved successfully!');
    } catch (err) {
      console.error('Failed to save flash promo settings to CMS API:', err);
      showToast('Failed to save settings to backend.');
    }
  };

  const handleResetTrigger = () => {
    localStorage.removeItem('hossen_shop_flash_promo_shown');
    showToast('Reset success! The popup will now show on your next homepage visit.');
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
          <h2 className="font-serif text-2xl font-bold text-neutral-800">Flash Promo Manager</h2>
          <p className="text-xs text-neutral-400 font-semibold">Manage the first-visit promo popup modal copy and image banner</p>
        </div>
        <button
          onClick={handleResetTrigger}
          className="px-4 py-2.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-600 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <svg className="w-4 h-4 text-brand-orange" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Reset First-Visit Trigger
        </button>
      </div>

      {/* Two Column Layout: Editor (left) vs Preview (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Editor Form */}
        <form onSubmit={handleSave} className="flex flex-col gap-5 text-sm">
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Badge Text</label>
            <input
              type="text"
              required
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="e.g. ⚡ Limited Time Only"
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-[#0F2C1F]/45 transition-all text-neutral-800 font-medium"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Promo Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Fresh Harvest Flash Deals!"
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-[#0F2C1F]/45 transition-all text-neutral-800 font-medium"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Promo Description</label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter promo details..."
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-[#0F2C1F]/45 transition-all text-neutral-800 font-medium leading-relaxed"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Promo Image URL</label>
            <input
              type="text"
              required
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="/images/flash_deal_promo.png"
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-[#0F2C1F]/45 transition-all text-neutral-800 font-medium"
            />
            <p className="text-[10px] text-neutral-400 font-semibold mt-0.5">Use `/images/flash_deal_promo.png` for default custom graphic.</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Button CTA Text</label>
            <input
              type="text"
              required
              value={buttonText}
              onChange={(e) => setButtonText(e.target.value)}
              placeholder="e.g. Shop Deals Now"
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-[#0F2C1F]/45 transition-all text-neutral-800 font-medium"
            />
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
          <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider text-left">Live Popup Preview</label>
          <div className="w-full bg-neutral-50 border border-neutral-100 rounded-3xl p-6 sm:p-8 flex items-center justify-center min-h-[460px]">
            
            {/* Pop-up Box Preview */}
            <div className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-xl border border-neutral-100/80 flex flex-col">
              {/* Graphic Banner Cover */}
              <div className="relative w-full aspect-[4/3] bg-neutral-100 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  alt="Flash Deals Banner"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80";
                  }}
                />
              </div>

              {/* Text Details & Action CTA Block */}
              <div className="p-5 flex flex-col items-center text-center gap-4">
                <div className="flex flex-col gap-1">
                  {badge && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200/50 text-[#FF5C00] font-sans font-bold text-[9px] tracking-widest uppercase self-center mb-1 select-none">
                      {badge}
                    </div>
                  )}
                  <h3 className="font-serif text-lg font-black text-neutral-800 tracking-tight leading-tight">
                    {title}
                  </h3>
                  <p className="font-sans text-xs text-neutral-500 max-w-xs leading-relaxed">
                    {description}
                  </p>
                </div>

                {/* Action CTA Button */}
                <button
                  type="button"
                  className="w-full py-3 bg-[#FF5C00] text-white rounded-xl font-bold text-xs tracking-wide shadow-sm"
                >
                  {buttonText}
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
