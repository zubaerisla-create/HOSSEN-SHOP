"use client";

import Link from 'next/link';
import { useSiteContent } from '../../lib/SiteContentContext';

export default function Footer() {
  const { footer } = useSiteContent();

  return (
    <footer className="bg-[#0F2C1F] text-white py-12 px-4 sm:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#0F2C1F] text-xl">🚲</div>
            <span className="text-2xl font-semibold tracking-tight">{footer.brandName}</span>
          </div>
          <p className="text-sm text-gray-300 max-w-xs">{footer.brandTagline}</p>
          <div className="flex gap-4 pt-2">
            <a href={footer.facebookUrl} className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
              <span className="text-sm font-bold">f</span>
            </a>
            <a href={footer.twitterUrl} className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
              <span className="text-sm font-bold">𝕏</span>
            </a>
            <a href={footer.instagramUrl} className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
              <span className="text-base">📷</span>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="uppercase text-xs tracking-widest text-gray-400 mb-6">QUICK LINKS</h3>
          <ul className="space-y-3 text-sm">
            {footer.quickLinks.map(link => (
              <li key={link.id}>
                <Link href={link.href} className="hover:text-emerald-400 transition-colors">{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="uppercase text-xs tracking-widest text-gray-400 mb-6">CUSTOMER SERVICE</h3>
          <ul className="space-y-3 text-sm">
            {footer.customerServiceLinks.map(link => (
              <li key={link.id}>
                <Link href={link.href} className="hover:text-emerald-400 transition-colors">{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="uppercase text-xs tracking-widest text-gray-400 mb-6">CONTACT US</h3>
          <div className="space-y-4 text-sm">
            <div className="flex gap-3"><span className="text-emerald-400">📍</span><span>{footer.address}</span></div>
            <div className="flex gap-3"><span className="text-emerald-400">📞</span><span>{footer.phone}</span></div>
            <div className="flex gap-3">
              <span className="text-emerald-400">✉️</span>
              <a href={`mailto:${footer.email}`} className="hover:text-emerald-400 transition-colors">{footer.email}</a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
        <div>{footer.copyrightText}</div>
        <div className="flex gap-6">
          <Link href={footer.privacyPolicyLink} className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href={footer.termsLink} className="hover:text-white transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}