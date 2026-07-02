"use client";

import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Trash2, RotateCcw, CheckCircle } from 'lucide-react';
import { useSiteContent, DEFAULT_FOOTER, FooterContent, FooterLink } from '../../lib/SiteContentContext';

const makeId = () => Math.random().toString(36).slice(2, 9);

export default function AdminFooterPage() {
  const { footer, updateFooter } = useSiteContent();
  const [form, setForm] = useState<FooterContent>(DEFAULT_FOOTER);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (footer) {
      setForm(footer);
    }
  }, [footer]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3500); };
  const set = (key: keyof FooterContent, val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateFooter(form);
    showToast('Footer saved!');
  };

  const handleReset = () => {
    setForm(DEFAULT_FOOTER);
    updateFooter(DEFAULT_FOOTER);
    showToast('Restored defaults!');
  };

  const addLink = (col: 'quickLinks' | 'customerServiceLinks') => {
    setForm(f => ({ ...f, [col]: [...f[col], { id: makeId(), label: 'New Link', href: '#' }] }));
  };

  const removeLink = (col: 'quickLinks' | 'customerServiceLinks', id: string) => {
    setForm(f => ({ ...f, [col]: f[col].filter(l => l.id !== id) }));
  };

  const updateLink = (col: 'quickLinks' | 'customerServiceLinks', id: string, key: keyof FooterLink, val: string) => {
    setForm(f => ({ ...f, [col]: f[col].map(l => l.id === id ? { ...l, [key]: val } : l) }));
  };

  const LinkEditor = ({ col, title }: { col: 'quickLinks' | 'customerServiceLinks'; title: string }) => (
    <div className="border border-neutral-100 rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-neutral-600 uppercase tracking-wider">{title}</p>
        <button type="button" onClick={() => addLink(col)} className="flex items-center gap-1 text-xs font-bold text-brand-orange hover:text-brand-orange-hover transition-colors cursor-pointer">
          <Plus className="w-3.5 h-3.5" /> Add Link
        </button>
      </div>
      {form[col].map(link => (
        <div key={link.id} className="flex items-center gap-2">
          <input type="text" value={link.label} onChange={e => updateLink(col, link.id, 'label', e.target.value)} placeholder="Label"
            className="flex-1 px-3 py-2 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#0F2C1F]/30" />
          <input type="text" value={link.href} onChange={e => updateLink(col, link.id, 'href', e.target.value)} placeholder="/path"
            className="flex-1 px-3 py-2 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#0F2C1F]/30" />
          <button type="button" onClick={() => removeLink(col, link.id)} className="p-2 hover:bg-red-50 rounded-xl text-neutral-400 hover:text-red-500 transition-colors cursor-pointer">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
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
            <h2 className="font-serif text-2xl font-bold text-neutral-800 flex items-center gap-2"><MapPin className="w-5 h-5 text-rose-500" /> Footer</h2>
            <p className="text-xs text-neutral-400 font-semibold mt-1">Edit all footer content: brand, links, contact, social, copyright</p>
          </div>
          <button onClick={handleReset} className="px-4 py-2.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-600 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer">
            <RotateCcw className="w-3.5 h-3.5 text-brand-orange" /> Reset
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-6 flex flex-col gap-6">
          {/* Brand */}
          <div className="border border-neutral-100 rounded-2xl p-4 flex flex-col gap-3">
            <p className="text-xs font-bold text-neutral-600 uppercase tracking-wider">Brand</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Brand Name</label>
                <input type="text" value={form.brandName} onChange={e => set('brandName', e.target.value)} className="px-3 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#0F2C1F]/30" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Tagline</label>
              <textarea rows={2} value={form.brandTagline} onChange={e => set('brandTagline', e.target.value)} className="px-3 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#0F2C1F]/30 resize-none" />
            </div>
          </div>

          {/* Social */}
          <div className="border border-neutral-100 rounded-2xl p-4 flex flex-col gap-3">
            <p className="text-xs font-bold text-neutral-600 uppercase tracking-wider">Social Links</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(['facebookUrl', 'twitterUrl', 'instagramUrl'] as const).map(key => (
                <div key={key} className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{key.replace('Url', '')}</label>
                  <input type="text" value={form[key]} onChange={e => set(key, e.target.value)} placeholder="https://…"
                    className="px-3 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#0F2C1F]/30" />
                </div>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          <LinkEditor col="quickLinks" title="Quick Links" />
          <LinkEditor col="customerServiceLinks" title="Customer Service Links" />

          {/* Contact */}
          <div className="border border-neutral-100 rounded-2xl p-4 flex flex-col gap-3">
            <p className="text-xs font-bold text-neutral-600 uppercase tracking-wider">Contact Info</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(['address', 'phone', 'email'] as const).map(key => (
                <div key={key} className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{key}</label>
                  <input type="text" value={form[key]} onChange={e => set(key, e.target.value)}
                    className="px-3 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#0F2C1F]/30" />
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border border-neutral-100 rounded-2xl p-4 flex flex-col gap-3">
            <p className="text-xs font-bold text-neutral-600 uppercase tracking-wider">Bottom Bar</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {([
                { key: 'copyrightText', label: 'Copyright Text' },
                { key: 'privacyPolicyLink', label: 'Privacy Policy URL' },
                { key: 'termsLink', label: 'Terms of Service URL' },
              ] as { key: keyof FooterContent; label: string }[]).map(({ key, label }) => (
                <div key={key as string} className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{label}</label>
                  <input type="text" value={form[key] as string} onChange={e => set(key, e.target.value)}
                    className="px-3 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#0F2C1F]/30" />
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="self-start px-8 py-3 bg-[#FF5C00] hover:bg-brand-orange-hover text-white rounded-xl font-bold tracking-wide transition-all shadow-md active:scale-95 cursor-pointer">Save Footer</button>
        </form>
      </div>
    </div>
  );
}
