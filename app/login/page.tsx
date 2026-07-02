"use client";

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../lib/AuthContext';

function LoginContent() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';

  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('zubaerislam@gmail.com');
  const [password, setPassword] = useState<string>('123456');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(isSignUp ? (name || 'Zubaer Islam') : 'Zubaer Islam', email);
    router.push(redirectPath);
  };

  return (
    <main className="min-h-screen w-full flex bg-[#FAF8F5]">
      
      {/* Left Side: Branded Vegetative Visuals (Hidden on small viewports) */}
      <div 
        className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center items-center justify-center p-12 overflow-hidden"
        style={{ backgroundImage: `url('/images/checkout_bg.png')` }}
      >
        {/* Deep Greenish-Black Color Multiply Overlay */}
        <div className="absolute inset-0 bg-[#0F2C1F]/80 mix-blend-multiply" />
        
        {/* Content */}
        <div className="relative z-10 max-w-lg text-center flex flex-col items-center gap-4 text-white">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold leading-tight">
            Welcome back to Hossen Shop
          </h1>
          <p className="text-base sm:text-lg opacity-85 font-sans leading-relaxed">
            Fresh groceries and organic produce, delivered to your doorstep.
          </p>
        </div>
      </div>

      {/* Right Side: Authentication Panel */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 py-12 sm:px-12 md:px-20 relative">
        
        {/* Back Link to Shop */}
        <Link 
          href="/" 
          className="absolute top-6 left-6 flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-700 transition-colors font-sans font-semibold"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to Shop
        </Link>

        {/* Auth Content Card */}
        <div className="w-full max-w-sm flex flex-col items-center gap-8">
          
          {/* Logo & Name */}
          <div className="flex items-center gap-2.5">
            <div className="text-brand-green">
              <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="14" cy="28" r="4" stroke="currentColor" strokeWidth="2.5" />
                <circle cx="28" cy="28" r="4" stroke="currentColor" strokeWidth="2.5" />
                <path d="M14 28h14M10 28l4-12h14l4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M22 16h6l-3-6h-5z" fill="currentColor" opacity="0.15" />
                <path d="M22 16h6l-3-6h-5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14 16l3-8h5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="font-serif text-xl sm:text-2xl font-bold text-brand-green tracking-tight">
              Hossen Shop
            </span>
          </div>

          {/* Form Header */}
          <div className="text-center flex flex-col gap-1.5">
            <h2 className="font-serif text-2xl font-bold text-neutral-800 tracking-tight">
              {isSignUp ? 'Sign up for an account' : 'Sign in to your account'}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 font-sans">
              {isSignUp ? (
                <>
                  Already have an account?{' '}
                  <button 
                    onClick={() => setIsSignUp(false)}
                    className="text-brand-orange hover:text-brand-orange-hover font-semibold transition-colors cursor-pointer"
                  >
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?{' '}
                  <button 
                    onClick={() => setIsSignUp(true)}
                    className="text-brand-orange hover:text-brand-orange-hover font-semibold transition-colors cursor-pointer"
                  >
                    Create one
                  </button>
                </>
              )}
            </p>
          </div>

          {/* Auth Input Fields Form */}
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 font-sans text-sm">
            
            {/* Dynamic Name field for Sign Up */}
            {isSignUp && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-neutral-600">
                  Name
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-neutral-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-brand-green/45 focus:border-brand-green/45 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Email Address */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-neutral-600">
                Email Address
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-neutral-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-[#E8F0FE]/50 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-brand-green/45 focus:border-brand-green/45 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-neutral-600">
                Password
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-neutral-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-[#E8F0FE]/50 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-brand-green/45 focus:border-brand-green/45 transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="mt-2 w-full bg-[#0F2C1F] hover:bg-[#091a12] text-white py-3 px-6 rounded-xl font-bold tracking-wide shadow-md active:scale-95 transition-all cursor-pointer text-center"
            >
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </button>

          </form>

        </div>

      </div>

    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full flex items-center justify-center bg-[#FAF8F5]">
        <div className="text-brand-green font-medium font-serif text-lg animate-pulse">Loading Login...</div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
