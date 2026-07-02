"use client";

import React, { useState, useEffect } from 'react';
import { Star, ChevronUp, ChevronDown, RotateCcw, CheckCircle } from 'lucide-react';
import { useSiteContent, DEFAULT_FEATURES, FeatureItem } from '../../lib/SiteContentContext';

const ICON_OPTIONS: { value: FeatureItem['iconName']; label: string }[] = [
  { value: 'delivery', label: '🚚 Delivery' },
  { value: 'organic', label: '🌿 Organic' },
  { value: 'delivery-time', label: '⏱ Delivery Time' },
  { value: 'secure-pay', label: '🔒 Secure Pay' },
];

export default function AdminFeaturesPage() {
  const { features: contextFeatures, updateFeatures } = useSiteContent();
  const [features, setFeatures] = useState<FeatureItem[]>(DEFAULT_FEATURES);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (contextFeatures && contextFeatures.length > 0) {
      setFeatures(contextFeatures);
    }
  }, [contextFeatures]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3500); };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateFeatures(features);
    showToast('Feature bar saved!');
  };

  const handleReset = () => {
    // Reset to defaults but keep IDs
    const resetFeatures = features.map((f, idx) => ({
      ...f,
      title: DEFAULT_FEATURES[idx]?.title || f.title,
      subtitle: DEFAULT_FEATURES[idx]?.subtitle || f.subtitle,
      iconName: DEFAULT_FEATURES[idx]?.iconName || f.iconName,
    }));
    setFeatures(resetFeatures);
    updateFeatures(resetFeatures);
    showToast('Restored defaults!');
  };

  const update = (idx: number, key: keyof FeatureItem, val: string) => {
    setFeatures(f => f.map((item, i) => i === idx ? { ...item, [key]: val } : item));
  };

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    setFeatures(f => { const n = [...f]; [n[idx - 1], n[idx]] = [n[idx], n[idx - 1]]; return n; });
  };

  const moveDown = (idx: number) => {
    if (idx === features.length - 1) return;
    setFeatures(f => { const n = [...f]; [n[idx], n[idx + 1]] = [n[idx + 1], n[idx]]; return n; });
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
            <h2 className="font-serif text-2xl font-bold text-neutral-800 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" /> Feature Bar
            </h2>
            <p className="text-xs text-neutral-400 font-semibold mt-1">4 feature cards shown beneath the hero banner</p>
          </div>
          <button onClick={handleReset} className="px-4 py-2.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-600 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer">
            <RotateCcw className="w-3.5 h-3.5 text-brand-orange" /> Reset
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-6 flex flex-col gap-4">
          {features.map((f, idx) => (
            <div key={f.id} className="border border-neutral-100 rounded-2xl p-4 flex items-start gap-4 bg-neutral-50/30">
              <div className="flex flex-col gap-1">
                <button type="button" onClick={() => moveUp(idx)} disabled={idx === 0} className="p-1 hover:bg-neutral-100 rounded-lg transition disabled:opacity-30 cursor-pointer"><ChevronUp className="w-4 h-4" /></button>
                <button type="button" onClick={() => moveDown(idx)} disabled={idx === features.length - 1} className="p-1 hover:bg-neutral-100 rounded-lg transition disabled:opacity-30 cursor-pointer"><ChevronDown className="w-4 h-4" /></button>
              </div>
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Icon</label>
                  <select value={f.iconName} onChange={e => update(idx, 'iconName', e.target.value)}
                    className="px-3 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-[#0F2C1F]/30 text-sm bg-white">
                    {ICON_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Title</label>
                  <input type="text" value={f.title} onChange={e => update(idx, 'title', e.target.value)}
                    className="px-3 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-[#0F2C1F]/30 text-sm" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Subtitle</label>
                  <input type="text" value={f.subtitle} onChange={e => update(idx, 'subtitle', e.target.value)}
                    className="px-3 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-[#0F2C1F]/30 text-sm" />
                </div>
              </div>
            </div>
          ))}

          <button type="submit" className="self-start mt-2 px-8 py-3 bg-[#FF5C00] hover:bg-brand-orange-hover text-white rounded-xl font-bold tracking-wide transition-all shadow-md active:scale-95 cursor-pointer">
            Save Feature Bar
          </button>
        </form>
      </div>
    </div>
  );
}
