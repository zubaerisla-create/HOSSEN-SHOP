"use client";

import React, { useState, useEffect } from 'react';
import { Smartphone, RotateCcw, CheckCircle } from 'lucide-react';
import { useSiteContent, DEFAULT_APP_BANNER, AppBannerContent } from '../../lib/SiteContentContext';

export default function AdminAppBannerPage() {
  const { appBanner, updateAppBanner } = useSiteContent();
  const [form, setForm] = useState<AppBannerContent>(DEFAULT_APP_BANNER);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (appBanner) {
      setForm(appBanner);
    }
  }, [appBanner]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3500); };
  const set = (key: keyof AppBannerContent, val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateAppBanner(form);
    showToast('App Banner saved!');
  };

  const handleReset = () => {
    setForm(DEFAULT_APP_BANNER);
    updateAppBanner(DEFAULT_APP_BANNER);
    showToast('Restored defaults!');
  };

  return (
    <div className="flex flex-col gap-6 font-sans">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F2C1F] text-white px-5 py-3 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-400" />{toast}
        </div>
      )}
      <div className="bg-white border border-neutral-100 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex justify-between items-start pb-5 border-b border-neutral-100">
          <div>
            <h2 className="font-serif text-2xl font-bold text-neutral-800 flex items-center gap-2"><Smartphone className="w-5 h-5 text-blue-500" /> App Banner</h2>
            <p className="text-xs text-neutral-400 font-semibold mt-1">Edit the app download section on the homepage</p>
          </div>
          <button onClick={handleReset} className="px-4 py-2.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-600 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer">
            <RotateCcw className="w-3.5 h-3.5 text-brand-orange" /> Reset
          </button>
        </div>
        <form onSubmit={handleSave} className="mt-6 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Heading</label>
            <input type="text" value={form.heading} onChange={e => set('heading', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-[#0F2C1F]/30 text-sm" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Paragraph</label>
            <textarea rows={3} value={form.paragraph} onChange={e => set('paragraph', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-[#0F2C1F]/30 text-sm resize-none" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="border border-neutral-100 rounded-2xl p-4 flex flex-col gap-3">
              <p className="text-xs font-bold text-neutral-600 uppercase tracking-wider">App Store</p>
              <input type="text" placeholder="Button label" value={form.appStoreBtnLabel} onChange={e => set('appStoreBtnLabel', e.target.value)} className="px-3 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#0F2C1F]/30" />
              <input type="text" placeholder="App Store URL" value={form.appStoreLink} onChange={e => set('appStoreLink', e.target.value)} className="px-3 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#0F2C1F]/30" />
            </div>
            <div className="border border-neutral-100 rounded-2xl p-4 flex flex-col gap-3">
              <p className="text-xs font-bold text-neutral-600 uppercase tracking-wider">Google Play</p>
              <input type="text" placeholder="Button label" value={form.googlePlayBtnLabel} onChange={e => set('googlePlayBtnLabel', e.target.value)} className="px-3 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#0F2C1F]/30" />
              <input type="text" placeholder="Google Play URL" value={form.googlePlayLink} onChange={e => set('googlePlayLink', e.target.value)} className="px-3 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#0F2C1F]/30" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Illustration Image URL <span className="normal-case font-normal text-neutral-300">(optional — blank = default SVG)</span></label>
            <input type="text" placeholder="https://…" value={form.illustrationImageUrl} onChange={e => set('illustrationImageUrl', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-[#0F2C1F]/30 text-sm" />
          </div>
          <button type="submit" className="self-start mt-2 px-8 py-3 bg-[#FF5C00] hover:bg-brand-orange-hover text-white rounded-xl font-bold tracking-wide transition-all shadow-md active:scale-95 cursor-pointer">Save App Banner</button>
        </form>
      </div>
    </div>
  );
}
