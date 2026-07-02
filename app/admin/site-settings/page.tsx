"use client";

import React, { useState, useEffect } from 'react';
import { Settings, Plus, Trash2, RotateCcw, CheckCircle } from 'lucide-react';
import { useSiteContent, DEFAULT_SITE_SETTINGS, SiteSettings, FooterLink } from '../../lib/SiteContentContext';

const makeId = () => Math.random().toString(36).slice(2, 9);

export default function AdminSiteSettingsPage() {
  const { siteSettings, updateSiteSettings } = useSiteContent();
  const [form, setForm] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (siteSettings) {
      setForm(siteSettings);
    }
  }, [siteSettings]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3500); };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings(form);
    showToast('Site settings saved!');
  };

  const handleReset = () => {
    setForm(DEFAULT_SITE_SETTINGS);
    updateSiteSettings(DEFAULT_SITE_SETTINGS);
    showToast('Restored defaults!');
  };

  const addNavLink = () => setForm(f => ({ ...f, navLinks: [...f.navLinks, { id: makeId(), label: 'New Page', href: '#' }] }));
  const removeNavLink = (id: string) => setForm(f => ({ ...f, navLinks: f.navLinks.filter(l => l.id !== id) }));
  const updateNavLink = (id: string, key: keyof FooterLink, val: string) => {
    setForm(f => ({ ...f, navLinks: f.navLinks.map(l => l.id === id ? { ...l, [key]: val } : l) }));
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
              <Settings className="w-5 h-5 text-slate-600" /> Site Settings
            </h2>
            <p className="text-xs text-neutral-400 font-semibold mt-1">Global site name, logo text, and main navigation links</p>
          </div>
          <button onClick={handleReset} className="px-4 py-2.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-600 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer">
            <RotateCcw className="w-3.5 h-3.5 text-brand-orange" /> Reset
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-6 flex flex-col gap-6">
          {/* Brand Identity */}
          <div className="border border-neutral-100 rounded-2xl p-5 flex flex-col gap-4">
            <p className="text-xs font-bold text-neutral-600 uppercase tracking-wider">Brand Identity</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Site Name</label>
                <input
                  type="text"
                  value={form.siteName}
                  onChange={e => setForm(f => ({ ...f, siteName: e.target.value }))}
                  className="px-4 py-3 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#0F2C1F]/30"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Logo Text (navbar)</label>
                <input
                  type="text"
                  value={form.logoText}
                  onChange={e => setForm(f => ({ ...f, logoText: e.target.value }))}
                  className="px-4 py-3 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#0F2C1F]/30"
                />
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="border border-neutral-100 rounded-2xl p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-neutral-600 uppercase tracking-wider">Main Navigation Links</p>
              <button type="button" onClick={addNavLink} className="flex items-center gap-1 text-xs font-bold text-brand-orange hover:text-brand-orange-hover transition-colors cursor-pointer">
                <Plus className="w-3.5 h-3.5" /> Add Link
              </button>
            </div>

            {form.navLinks.length === 0 && (
              <p className="text-xs text-neutral-400 italic">No nav links yet — click &ldquo;Add Link&rdquo; to add one.</p>
            )}

            {form.navLinks.map((link, idx) => (
              <div key={link.id} className="flex items-center gap-2">
                <span className="text-xs text-neutral-400 font-bold w-5 shrink-0">{idx + 1}.</span>
                <input
                  type="text"
                  value={link.label}
                  onChange={e => updateNavLink(link.id, 'label', e.target.value)}
                  placeholder="Label (e.g. Products)"
                  className="flex-1 px-3 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#0F2C1F]/30"
                />
                <input
                  type="text"
                  value={link.href}
                  onChange={e => updateNavLink(link.id, 'href', e.target.value)}
                  placeholder="URL (e.g. /products)"
                  className="flex-1 px-3 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#0F2C1F]/30"
                />
                <button
                  type="button"
                  onClick={() => removeNavLink(link.id)}
                  className="p-2 hover:bg-red-50 rounded-xl text-neutral-400 hover:text-red-500 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <button type="submit" className="self-start px-8 py-3 bg-[#FF5C00] hover:bg-brand-orange-hover text-white rounded-xl font-bold tracking-wide transition-all shadow-md active:scale-95 cursor-pointer">
            Save Site Settings
          </button>
        </form>
      </div>
    </div>
  );
}
