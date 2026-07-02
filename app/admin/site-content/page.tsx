"use client";

import React from 'react';
import Link from 'next/link';
import { Layout, Image as ImageIcon, Star, Smartphone, Mail, MapPin, Settings } from 'lucide-react';

const sections = [
  { href: '/admin/hero', icon: ImageIcon, label: 'Hero Section', desc: 'Edit heading, paragraph, buttons, background image', color: 'from-emerald-50 to-teal-50', iconColor: 'text-emerald-600 bg-emerald-50' },
  { href: '/admin/features', icon: Star, label: 'Feature Bar', desc: 'Manage the 4 feature cards below the hero', color: 'from-amber-50 to-yellow-50', iconColor: 'text-amber-600 bg-amber-50' },
  { href: '/admin/app-banner', icon: Smartphone, label: 'App Banner', desc: 'Edit app download section content and links', color: 'from-blue-50 to-indigo-50', iconColor: 'text-blue-600 bg-blue-50' },
  { href: '/admin/newsletter', icon: Mail, label: 'Newsletter Section', desc: 'Edit heading, description and button text', color: 'from-purple-50 to-pink-50', iconColor: 'text-purple-600 bg-purple-50' },
  { href: '/admin/footer', icon: MapPin, label: 'Footer', desc: 'Edit links, contact info, social URLs, copyright', color: 'from-rose-50 to-red-50', iconColor: 'text-rose-600 bg-rose-50' },
  { href: '/admin/site-settings', icon: Settings, label: 'Site Settings', desc: 'Site name, logo text, global navigation links', color: 'from-slate-50 to-gray-50', iconColor: 'text-slate-600 bg-slate-50' },
];

export default function SiteContentHub() {
  return (
    <div className="flex flex-col gap-6 font-sans">
      <div className="bg-white border border-neutral-100 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-[#0F2C1F] rounded-xl flex items-center justify-center">
            <Layout className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-neutral-800">Site Content Manager</h2>
            <p className="text-xs text-neutral-400 font-semibold">Control every section of your website from here — no code changes needed</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map(s => (
          <Link key={s.href} href={s.href} className={`group bg-gradient-to-br ${s.color} border border-neutral-100 rounded-3xl p-6 flex flex-col gap-3 hover:shadow-md hover:border-neutral-200 transition-all duration-200`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.iconColor} shrink-0`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-neutral-800 text-sm group-hover:text-[#0F2C1F] transition-colors">{s.label}</p>
              <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">{s.desc}</p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-neutral-400 group-hover:text-[#0F2C1F] transition-colors mt-auto">
              Edit <svg className="w-3 h-3 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
