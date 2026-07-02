"use client";

import React from 'react';
import { useSiteContent } from '../../lib/SiteContentContext';

export const Newsletter: React.FC = () => {
  const { newsletter } = useSiteContent();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-12 md:py-16">
      <div className="bg-white rounded-3xl border border-neutral-100 p-8 sm:p-12 md:p-16 flex flex-col items-center text-center w-full shadow-sm">
        
        <div className="w-12 h-12 rounded-xl bg-white border border-neutral-100 shadow-sm flex items-center justify-center text-brand-green">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 mt-6 mb-2">
          {newsletter.heading}
        </h2>
        <p className="font-sans text-sm text-neutral-500 max-w-lg mb-8 leading-relaxed">
          {newsletter.description}
        </p>

        <form className="w-full max-w-md flex flex-col sm:flex-row gap-3 items-stretch justify-center" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder={newsletter.inputPlaceholder}
            required
            className="flex-1 px-4 py-3 rounded-xl border border-neutral-200 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-green/10 focus:border-brand-green/60 transition-all duration-200 bg-neutral-50/50 focus:bg-white"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-brand-green hover:bg-brand-green-hover text-white text-sm font-semibold shadow-sm transition-all duration-200 active:scale-[0.98] whitespace-nowrap cursor-pointer"
          >
            {newsletter.buttonText}
          </button>
        </form>
      </div>
    </section>
  );
};
export default Newsletter;
