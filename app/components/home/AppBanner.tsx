"use client";

import React from 'react';
import Button from '../ui/Button';
import { useSiteContent } from '../../lib/SiteContentContext';

export const AppBanner: React.FC = () => {
  const { appBanner } = useSiteContent();

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <div className="relative bg-brand-green rounded-3xl overflow-hidden px-6 py-12 sm:p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10">

        {/* Left: Content */}
        <div className="flex-1 text-white max-w-xl flex flex-col items-start gap-4 md:gap-6 z-10">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            {appBanner.heading}
          </h2>
          <p className="font-sans text-sm sm:text-base text-white/80 leading-relaxed max-w-md">
            {appBanner.paragraph}
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-2">
            <a href={appBanner.appStoreLink} target="_blank" rel="noopener noreferrer">
              <Button variant="white" className="flex items-center gap-2.5 px-6 py-3 cursor-pointer">
                <svg className="w-5 h-5 text-brand-green fill-current" viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.2.67-2.92 1.49-.62.71-1.16 1.85-1.01 2.96 1.12.09 2.27-.58 2.94-1.39z" /></svg>
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-sans">Download on the</span>
                  <span className="text-sm font-bold font-sans">{appBanner.appStoreBtnLabel}</span>
                </div>
              </Button>
            </a>
            <a href={appBanner.googlePlayLink} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="flex items-center gap-2.5 px-6 py-3 cursor-pointer">
                <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24"><path d="M5 3.25c-.28 0-.5.22-.5.5v16.5c0 .28.22.5.5.5.16 0 .3-.07.4-.19l9.36-9.36L5.4 3.44c-.1-.12-.24-.19-.4-.19zm1.09 1.16L13.88 12 6.09 19.59V4.41zm8.88 6.94l2.56-2.56c.2-.2.2-.51 0-.71l-2.56-2.56-1.06 1.06 2.03 2.03-2.03 2.03 1.06 1.06zm1.18-.75l3.85-2.2c.59-.34.59-1.18 0-1.52l-3.85-2.2-1.03 1.03 2.97 1.69-2.97 1.69 1.03 1.03z" /></svg>
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[10px] text-white/60 uppercase tracking-wider font-sans">Get it on</span>
                  <span className="text-sm font-bold font-sans">{appBanner.googlePlayBtnLabel}</span>
                </div>
              </Button>
            </a>
          </div>
        </div>

        {/* Right: Image or SVG illustration */}
        <div className="flex-1 w-full max-w-md h-[240px] sm:h-[300px] relative overflow-hidden flex items-end justify-center md:justify-end">
          {appBanner.illustrationImageUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={appBanner.illustrationImageUrl} alt="App banner illustration" className="w-full h-full object-contain" />
          ) : (
            <>
              <div className="absolute bottom-6 left-0 right-0 h-[1.5px] bg-white/20" />
              <svg className="w-full h-full" viewBox="0 0 500 250" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="10" y1="210" x2="490" y2="210" stroke="white" strokeWidth="2" strokeOpacity="0.2" />
                <path d="M470 210c0-10 5-15 10-15s10 5 10 15M475 210c0-6 4-10 8-10s8 4 8 10" stroke="white" strokeWidth="1.5" strokeOpacity="0.3" strokeLinecap="round" />
                <g id="truck">
                  <path d="M40 180h355v-45c0-5.5-4.5-10-10-10H280V95c0-8.3-6.7-15-15-15H170c-8.3 0-15 6.7-15 15v40H50c-5.5 0-10 4.5-10 10v35z" fill="#E6E8EA" />
                  <path d="M155 125h80v-35c0-3-2-5-5-5h-45c-15 0-25 10-30 20v20z" fill="#D1D5DB" />
                  <path d="M180 120h50v-25h-35c-5 0-10 5-15 10v15z" fill="#ECEFF1" />
                  <path d="M280 125h110v45H280v-45z" fill="#CFD8DC" />
                  <rect x="290" y="105" width="30" height="20" rx="3" fill="#FBC02D" /><line x1="290" y1="115" x2="320" y2="115" stroke="#F57F17" strokeWidth="1.5" />
                  <rect x="325" y="95" width="40" height="30" rx="3" fill="#FBC02D" /><line x1="325" y1="110" x2="365" y2="110" stroke="#F57F17" strokeWidth="2" />
                  <rect x="370" y="100" width="25" height="25" rx="3" fill="#FBC02D" /><line x1="370" y1="112.5" x2="395" y2="112.5" stroke="#F57F17" strokeWidth="1.5" />
                  <circle cx="100" cy="190" r="24" fill="#374151" /><circle cx="100" cy="190" r="16" fill="#F3F4F6" stroke="#9CA3AF" strokeWidth="2" /><circle cx="100" cy="190" r="6" fill="#9CA3AF" />
                  <circle cx="330" cy="190" r="24" fill="#374151" /><circle cx="330" cy="190" r="16" fill="#F3F4F6" stroke="#9CA3AF" strokeWidth="2" /><circle cx="330" cy="190" r="6" fill="#9CA3AF" />
                </g>
                <g id="courier">
                  <rect x="235" y="165" width="6" height="40" rx="2" fill="#1F2937" /><rect x="247" y="165" width="6" height="40" rx="2" fill="#1F2937" />
                  <rect x="230" y="115" width="28" height="55" rx="10" fill="#374151" />
                  <circle cx="244" cy="95" r="10" fill="#FFA726" />
                  <path d="M234 95c0-6 4-10 10-10s10 4 10 10v-3h-20v3z" fill="#1F2937" />
                  <rect x="232" y="125" width="40" height="28" rx="4" fill="#FBC02D" /><line x1="232" y1="139" x2="272" y2="139" stroke="#F57F17" strokeWidth="2" />
                </g>
              </svg>
            </>
          )}
        </div>
      </div>
    </section>
  );
};
export default AppBanner;
