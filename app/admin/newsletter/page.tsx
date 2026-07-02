"use client";

import React, { useState, useEffect } from 'react';
import { Mail, RotateCcw, CheckCircle } from 'lucide-react';
import { DEFAULT_NEWSLETTER, NewsletterContent } from '../../lib/SiteContentContext';

export default function AdminNewsletterPage() {
  const [form, setForm] = useState<NewsletterContent>(DEFAULT_NEWSLETTER);
  const [toast, setToast] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem('hossen_cms_newsletter');
      if (raw) setForm({ ...DEFAULT_NEWSLETTER, ...JSON.parse(raw) });
    } catch { /* ignore */ }
  }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3500); };
  const set = (key: keyof NewsletterContent, val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('hossen_cms_newsletter', JSON.stringify(form));
    showToast('Newsletter section saved!');
  };

  const handleReset = () => {
    setForm(DEFAULT_NEWSLETTER);
    localStorage.setItem('hossen_cms_newsletter', JSON.stringify(DEFAULT_NEWSLETTER));
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
            <h2 className="font-serif text-2xl font-bold text-neutral-800 flex items-center gap-2"><Mail className="w-5 h-5 text-purple-500" /> Newsletter Section</h2>
            <p className="text-xs text-neutral-400 font-semibold mt-1">Edit the newsletter subscription section on the homepage</p>
          </div>
          <button onClick={handleReset} className="px-4 py-2.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-600 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer">
            <RotateCcw className="w-3.5 h-3.5 text-brand-orange" /> Reset
          </button>
        </div>
        <form onSubmit={handleSave} className="mt-6 flex flex-col gap-5">
          {([
            { key: 'heading', label: 'Heading' },
            { key: 'description', label: 'Description' },
            { key: 'buttonText', label: 'Subscribe Button Text' },
            { key: 'inputPlaceholder', label: 'Email Input Placeholder' },
          ] as { key: keyof NewsletterContent; label: string }[]).map(({ key, label }) => (
            <div key={key} className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">{label}</label>
              <input type="text" value={form[key]} onChange={e => set(key, e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-[#0F2C1F]/30 text-sm" />
            </div>
          ))}

          {/* Live Preview */}
          <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-6 flex flex-col items-center text-center gap-3 mt-2">
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest self-start">Preview</p>
            <h3 className="font-serif text-xl font-bold text-neutral-800">{form.heading}</h3>
            <p className="text-sm text-neutral-500 max-w-sm">{form.description}</p>
            <div className="flex gap-2 w-full max-w-sm">
              <div className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-200 bg-white text-sm text-neutral-400">{form.inputPlaceholder}</div>
              <div className="px-4 py-2.5 rounded-xl bg-brand-green text-white text-sm font-semibold">{form.buttonText}</div>
            </div>
          </div>

          <button type="submit" className="self-start mt-2 px-8 py-3 bg-[#FF5C00] hover:bg-brand-orange-hover text-white rounded-xl font-bold tracking-wide transition-all shadow-md active:scale-95 cursor-pointer">Save Newsletter</button>
        </form>
      </div>
    </div>
  );
}
