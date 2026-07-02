"use client";

import React from 'react';
import Link from 'next/link';
import { useSiteContent } from '../../lib/SiteContentContext';
import type { FeatureItem } from '../../lib/SiteContentContext';

/* ─── Minimal icon set ─────────────────────────────────────── */
const FeatureIcon = ({ name }: { name: FeatureItem['iconName'] }) => {
  const cls = "w-[18px] h-[18px] text-brand-green";
  switch (name) {
    case 'delivery': return (
      <svg className={cls} fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124l-.847-9.967a2.25 2.25 0 00-2.208-2.059L16.5 4.5h-3m4.5 14.25v-3h-3.75m3.75 3h-3.75M9 14.25H3v-2.25c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.129.504 1.09 1.124l-.225 2.25z" />
      </svg>
    );
    case 'organic': return (
      <svg className={cls} fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M12 8.25v5.25m0 0a3 3 0 106 0v-.375m-6 .375a3 3 0 11-6 0v-.375m6 .375v3.75m0 0H8.25m3.75 0h3.75" />
      </svg>
    );
    case 'delivery-time': return (
      <svg className={cls} fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
    case 'secure-pay': return (
      <svg className={cls} fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    );
    default: return null;
  }
};

/* ─── Avatar stack data ────────────────────────────────────── */
const avatars = [
  { bg: '#F59E0B', initials: 'SA' },
  { bg: '#F43F5E', initials: 'MR' },
  { bg: '#38BDF8', initials: 'JD' },
];

const featureAnimDelay = ['0.5s', '0.62s', '0.74s', '0.86s'];

/* ─── Component ────────────────────────────────────────────── */
export const HeroSection: React.FC = () => {
  const { hero, features } = useSiteContent();

  return (
    <section className="relative w-full pt-0 pb-16 lg:pb-24">

      {/* ══ Hero card — split layout ══════════════════════════ */}
      <div
        className="hero-content relative w-full overflow-hidden flex flex-col md:flex-row"
        style={{ minHeight: 'clamp(460px, 58vw, 620px)' }}
      >

        {/* ── Left panel — content ───────────────────────── */}
        <div className="relative z-10 bg-[#003F2C] flex flex-col justify-center gap-6 sm:gap-7 px-8 sm:px-16 md:px-20 lg:px-28 py-14 sm:py-16 md:w-[52%] shrink-0">

          {/* Certification badge — clean pill */}
          <div
            className="inline-flex items-center self-start gap-2 px-3.5 py-1.5 rounded-full text-[#BCDFB0] text-[11px] font-semibold tracking-[0.08em] uppercase"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6EE7A0', display: 'inline-block', flexShrink: 0 }} />
            {hero.badgeText}
          </div>

          {/* Heading */}
          <h1
            className="font-serif font-bold text-white leading-[1.09] tracking-tight"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}
          >
            {hero.headingLine1}
            <br className="hidden sm:block" />
            {hero.headingLine2}{' '}
            <span style={{ color: '#FFB35A' }}>{hero.headingHighlight}</span>
          </h1>

          {/* Body copy */}
          <p
            className="text-white/55 font-sans leading-relaxed"
            style={{ fontSize: 'clamp(13px, 1.5vw, 15px)', maxWidth: '38ch' }}
          >
            {hero.paragraph}
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Link href={hero.btn1Href}>
              <button className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FF8A00] hover:bg-[#E57C00] text-white text-sm font-semibold tracking-wide transition-colors duration-200 active:scale-[0.97] cursor-pointer shadow-md shadow-[rgba(255,138,0,0.25)]">
                {hero.btn1Label}
                <svg
                  className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                  fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </Link>
            <Link href={hero.btn2Href}>
              <button
                className="inline-flex items-center px-6 py-3 rounded-xl text-white/70 hover:text-white text-sm font-semibold tracking-wide transition-all duration-200 active:scale-[0.97] cursor-pointer"
                style={{ border: '1px solid rgba(255,255,255,0.15)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                {hero.btn2Label}
              </button>
            </Link>
          </div>

          {/* Social proof — avatar stack + rating */}
          <div className="flex items-center gap-3 pt-1">
            {/* Overlapping avatars */}
            <div className="flex" style={{ gap: '-8px' }}>
              {avatars.map((a, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center rounded-full text-white font-bold ring-2 ring-[#003F2C]"
                  style={{
                    width: 30, height: 30, fontSize: 10,
                    background: a.bg,
                    marginLeft: i === 0 ? 0 : -8,
                  }}
                >
                  {a.initials}
                </div>
              ))}
            </div>
            <div>
              {/* Stars */}
              <div className="flex items-center gap-0.5 mb-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-2.5 h-2.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-white/40 leading-none" style={{ fontSize: 10 }}>
                Trusted by <span className="text-white/65 font-semibold">50K+</span> families
              </p>
            </div>
          </div>
        </div>

        {/* ── Right panel — editorial photograph ─────────── */}
        <div className="relative flex-1 min-h-[220px] md:min-h-0">
          <img
            src={hero.bgImageUrl}
            alt="Fresh organic produce"
            className="hero-image w-full h-full object-cover object-center"
            loading="eager"
          />
          {/* Seamless feather on left edge only */}
          <div
            className="absolute inset-y-0 left-0 w-20 pointer-events-none"
            style={{ background: 'linear-gradient(to right, #003F2C, transparent)' }}
          />
          {/* Mobile top feather */}
          <div
            className="absolute inset-x-0 top-0 h-14 pointer-events-none md:hidden"
            style={{ background: 'linear-gradient(to bottom, #003F2C, transparent)' }}
          />
        </div>
      </div>

      {/* ══ Feature bar ═══════════════════════════════════════ */}
      <div className="relative mt-8 md:mt-12 lg:mt-0 px-4 sm:px-8 lg:px-16 lg:absolute lg:inset-x-0 lg:bottom-0 lg:translate-y-1/2 z-30 w-full">
        <div className="feature-bar bg-white border border-neutral-100 rounded-2xl shadow-lg shadow-black/[0.05] p-5 sm:p-6 lg:py-5 max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-0 lg:divide-x lg:divide-neutral-100">
          {features.map((f, i) => (
            <div
              key={f.id}
              className="flex items-center gap-4 lg:px-8"
              style={{ animation: `hero-rise 0.6s cubic-bezier(0.22,1,0.36,1) ${featureAnimDelay[i]} both` }}
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#E8F5EE] shrink-0 shadow-sm shadow-emerald-800/[0.04]">
                <FeatureIcon name={f.iconName} />
              </div>
              <div className="text-left">
                <p className="text-neutral-800 font-bold leading-tight text-[14px]">{f.title}</p>
                <p className="text-neutral-400 leading-tight mt-1 text-[11px] font-medium">{f.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
