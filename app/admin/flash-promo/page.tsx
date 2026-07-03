"use client";

import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { useSiteContent } from '../../lib/SiteContentContext';

interface PromoSettings {
  title: string;
  badge: string;
  description: string;
  image: string;
  buttonText: string;
}

export default function AdminFlashPromoPage() {
  const { flashPromo, updateFlashPromo } = useSiteContent();

  const [title, setTitle] = useState('Fresh Harvest Flash Deals!');
  const [badge, setBadge] = useState('⚡ Limited Time Only');
  const [description, setDescription] = useState('Unlock exclusive discounts up to 40% OFF on fresh organic produce. Hand-picked and delivered direct to your door!');
  const [image, setImage] = useState('/images/flash_deal_promo.png');
  const [buttonText, setButtonText] = useState('Shop Deals Now');
  
  const [toastMessage, setToastMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMode, setUploadMode] = useState<'upload' | 'url'>('upload');

  useEffect(() => {
    if (flashPromo) {
      setTitle(flashPromo.title || '');
      setBadge(flashPromo.badge || '');
      setDescription(flashPromo.description || '');
      setImage(flashPromo.image || '');
      setButtonText(flashPromo.buttonText || '');
    }
  }, [flashPromo]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const res = await api.uploadImage(file);
        setImage(res.url);
        showToast('Image uploaded successfully!');
      } catch (err: any) {
        console.error(err);
        showToast(err.message || 'Image upload failed.');
      } finally {
        setIsUploading(false);
      }
    }
  };

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
      updateFlashPromo(settings);
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

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Promo Image</label>
            
            <div className="flex bg-neutral-100 rounded-xl p-1 text-xs font-bold text-neutral-500">
              <button
                type="button"
                onClick={() => setUploadMode('upload')}
                className={`flex-grow py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  uploadMode === 'upload' ? 'bg-white text-[#0F2C1F] shadow-sm' : 'hover:text-neutral-800'
                }`}
              >
                <svg className="w-3.5 h-3.5 text-brand-green" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                Upload File
              </button>
              <button
                type="button"
                onClick={() => setUploadMode('url')}
                className={`flex-grow py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  uploadMode === 'url' ? 'bg-white text-[#0F2C1F] shadow-sm' : 'hover:text-neutral-800'
                }`}
              >
                <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                </svg>
                Image URL
              </button>
            </div>

            <div className="mt-1">
              {uploadMode === 'upload' && (
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-200 rounded-2xl p-6 bg-neutral-50/50 hover:bg-neutral-50 transition-all relative">
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isUploading}
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <svg className="w-8 h-8 text-neutral-300 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  <span className="text-xs font-bold text-neutral-600">
                    {isUploading ? 'Uploading image...' : 'Click to select and upload file from PC'}
                  </span>
                  <span className="text-[10px] text-neutral-400 mt-1">PNG, JPG, WEBP, or SVG</span>
                </div>
              )}

              {uploadMode === 'url' && (
                <input
                  type="text"
                  required
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="/images/flash_deal_promo.png"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-[#0F2C1F]/45 transition-all text-neutral-800 font-medium"
                />
              )}
            </div>
            <p className="text-[10px] text-neutral-400 font-semibold mt-0.5">Use a custom graphic or default `/images/flash_deal_promo.png`.</p>
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
