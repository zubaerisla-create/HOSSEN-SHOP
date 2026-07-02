"use client";

import React, { useState, useEffect } from 'react';
import { ImageIcon, RotateCcw, CheckCircle } from 'lucide-react';
import { useSiteContent, DEFAULT_HERO, HeroContent } from '../../lib/SiteContentContext';

export default function AdminHeroPage() {
  const { hero, updateHero } = useSiteContent();
  const [form, setForm] = useState<HeroContent>(DEFAULT_HERO);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (hero) {
      setForm(hero);
    }
  }, [hero]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3500); };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateHero(form);
    showToast('Hero section saved!');
  };

  const handleReset = () => {
    setForm(DEFAULT_HERO);
    updateHero(DEFAULT_HERO);
    showToast('Restored defaults!');
  };

  const set = (key: keyof HeroContent, val: string) => setForm(f => ({ ...f, [key]: val }));

  const Field = ({ label, id, value, onChange, placeholder = '', textarea = false }: { label: string; id: keyof HeroContent; value: string; onChange: (v: string) => void; placeholder?: string; textarea?: boolean }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">{label}</label>
      {textarea ? (
        <textarea rows={3} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-[#0F2C1F]/30 transition-all text-neutral-800 font-medium resize-none text-sm" />
      ) : (
        <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-[#0F2C1F]/30 transition-all text-neutral-800 font-medium text-sm" />
      )}
    </div>
  );

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
              <ImageIcon className="w-5 h-5 text-brand-orange" /> Hero Section
            </h2>
            <p className="text-xs text-neutral-400 font-semibold mt-1">Edit the main hero banner on the homepage</p>
          </div>
          <button onClick={handleReset} className="px-4 py-2.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-600 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer">
            <RotateCcw className="w-3.5 h-3.5 text-brand-orange" /> Reset
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-6 flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Badge Text" id="badgeText" value={form.badgeText} onChange={v => set('badgeText', v)} placeholder="Farm-Fresh & Organic" />
            <Field label="Background Image URL" id="bgImageUrl" value={form.bgImageUrl} onChange={v => set('bgImageUrl', v)} placeholder="https://…" />
            <Field label="Heading Line 1" id="headingLine1" value={form.headingLine1} onChange={v => set('headingLine1', v)} placeholder="Nourish your home" />
            <Field label="Heading Line 2 (prefix before highlight)" id="headingLine2" value={form.headingLine2} onChange={v => set('headingLine2', v)} placeholder="with" />
            <Field label="Heading Highlighted Word(s)" id="headingHighlight" value={form.headingHighlight} onChange={v => set('headingHighlight', v)} placeholder="Earth's finest" />
          </div>
          <Field label="Paragraph Text" id="paragraph" value={form.paragraph} onChange={v => set('paragraph', v)} textarea placeholder="Fresh, organic groceries…" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="border border-neutral-100 rounded-2xl p-4 flex flex-col gap-3">
              <p className="text-xs font-bold text-neutral-600 uppercase tracking-wider">Primary Button</p>
              <Field label="Label" id="btn1Label" value={form.btn1Label} onChange={v => set('btn1Label', v)} placeholder="Shop Now" />
              <Field label="URL" id="btn1Href" value={form.btn1Href} onChange={v => set('btn1Href', v)} placeholder="/products" />
            </div>
            <div className="border border-neutral-100 rounded-2xl p-4 flex flex-col gap-3">
              <p className="text-xs font-bold text-neutral-600 uppercase tracking-wider">Secondary Button</p>
              <Field label="Label" id="btn2Label" value={form.btn2Label} onChange={v => set('btn2Label', v)} placeholder="Browse Categories" />
              <Field label="URL" id="btn2Href" value={form.btn2Href} onChange={v => set('btn2Href', v)} placeholder="/#categories" />
            </div>
          </div>

          {/* Preview */}
          {form.bgImageUrl && (
            <div className="rounded-2xl overflow-hidden border border-neutral-100 mt-2">
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-4 pt-3 pb-1">Background Preview</p>
              <img src={form.bgImageUrl} alt="preview" className="w-full h-40 object-cover object-center" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>
          )}

          <button type="submit" className="self-start mt-2 px-8 py-3 bg-[#FF5C00] hover:bg-brand-orange-hover text-white rounded-xl font-bold tracking-wide transition-all shadow-md active:scale-95 cursor-pointer">
            Save Hero Section
          </button>
        </form>
      </div>
    </div>
  );
}
