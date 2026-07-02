"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '../ui/Button';
import { useCart } from '../../lib/CartContext';
import { useAuth } from '../../lib/AuthContext';
import { Zap, Truck, Tag } from 'lucide-react';

export const Header: React.FC = () => {
  const router = useRouter();
  const { cartCount, setIsCartOpen } = useCart();
  const { user, isLoggedIn, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const [scrolled, setScrolled] = React.useState(false);
  const [promoText, setPromoText] = React.useState('Flash Deals: Up to 40% OFF Select Fresh Organic Produce!');
  const [freeDeliveryText, setFreeDeliveryText] = React.useState('Free delivery on orders over $20!');
  const [discountCodeText, setDiscountCodeText] = React.useState('Special Discount Code: HOSSEN10');
  const [linkText, setLinkText] = React.useState('Shop Now');
  const [linkUrl, setLinkUrl] = React.useState('/deals');
  const lastScrollY = React.useRef(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
      const delta = currentScrollY - lastScrollY.current;

      if (currentScrollY <= 60) {
        // Always show at the top of the page
        setScrolled(false);
      } else if (Math.abs(delta) > 10) {
        // Threshold check to prevent layout shift bounce loop
        if (delta > 0) {
          // Scrolling DOWN: Hide
          setScrolled(true);
        } else {
          // Scrolling UP: Show
          setScrolled(false);
        }
      }

      lastScrollY.current = Math.max(0, currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Load flash line settings
    const savedLine = localStorage.getItem('hossen_shop_flash_line_settings');
    if (savedLine) {
      try {
        const parsed = JSON.parse(savedLine);
        if (parsed.promoText) setPromoText(parsed.promoText);
        if (parsed.freeDeliveryText) setFreeDeliveryText(parsed.freeDeliveryText);
        if (parsed.discountCodeText) setDiscountCodeText(parsed.discountCodeText);
        if (parsed.linkText) setLinkText(parsed.linkText);
        if (parsed.linkUrl) setLinkUrl(parsed.linkUrl);
      } catch (e) {
        console.error(e);
      }
    } else {
      // Fallback: Check if there's any saved promo title from flash promo settings
      const savedPromo = localStorage.getItem('hossen_shop_flash_promo_settings');
      if (savedPromo) {
        try {
          const parsed = JSON.parse(savedPromo);
          if (parsed.title) {
            setPromoText(parsed.title);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="sticky top-0 z-50 flex flex-col w-full transition-transform duration-300 ease-in-out will-change-transform"
      style={{ transform: scrolled ? 'translateY(-40px)' : 'translateY(0)' }}
    >

      {/* Premium Flash Deals Announcement Bar */}
      <div
        className="bg-brand-orange text-white px-4 font-sans text-xs md:text-sm font-semibold flex items-center shadow-inner h-10"
      >
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-6 overflow-hidden">

          {/* Infinite Marquee Loop */}
          <div className="flex-1 overflow-hidden relative flex items-center">
            <div className="animate-marquee-left flex items-center gap-16 select-none text-white tracking-wide whitespace-nowrap">
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-300 fill-amber-300 shrink-0" /> {promoText} <Zap className="w-4 h-4 text-amber-300 fill-amber-300 shrink-0" />
              </span>
              <span className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-300 shrink-0" /> {freeDeliveryText} <Truck className="w-4 h-4 text-amber-300 shrink-0" />
              </span>
              <span className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-amber-300 fill-amber-300 shrink-0" /> {discountCodeText} <Tag className="w-4 h-4 text-amber-300 fill-amber-300 shrink-0" />
              </span>
              {/* Duplicate for seamless looping */}
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-300 fill-amber-300 shrink-0" /> {promoText} <Zap className="w-4 h-4 text-amber-300 fill-amber-300 shrink-0" />
              </span>
              <span className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-300 shrink-0" /> {freeDeliveryText} <Truck className="w-4 h-4 text-amber-300 shrink-0" />
              </span>
              <span className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-amber-300 fill-amber-300 shrink-0" /> {discountCodeText} <Tag className="w-4 h-4 text-amber-300 fill-amber-300 shrink-0" />
              </span>
            </div>
          </div>

          {/* Fixed Action Button */}
          <Link
            href={linkUrl}
            className="bg-white text-brand-orange hover:bg-neutral-50 px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold transition-all shadow-md flex items-center gap-1 group active:scale-95 shrink-0 z-10"
          >
            {linkText}
            <svg className="w-3 h-3 stroke-[2.5] transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>

      <header className="bg-[#FAF8F5]/90 backdrop-blur-md border-b border-neutral-100 py-3 px-4 sm:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

          {/* Left Section: Logo & Nav Links */}
          <div className="flex items-center gap-6 md:gap-10">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              {/* Custom SVG Icon resembling the bicycle/leaf style */}
              <div className="text-brand-green group-hover:scale-105 transition-transform duration-200">
                <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="14" cy="28" r="4" stroke="currentColor" strokeWidth="2.5" />
                  <circle cx="28" cy="28" r="4" stroke="currentColor" strokeWidth="2.5" />
                  <path d="M14 28h14M10 28l4-12h14l4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M22 16h6l-3-6h-5z" fill="currentColor" opacity="0.15" />
                  <path d="M22 16h6l-3-6h-5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M14 16l3-8h5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="font-serif text-xl md:text-2xl font-bold text-brand-green tracking-tight">
                Hossen Shop
              </span>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8 font-sans">
              <Link href="/" className="text-[#555] hover:text-brand-green font-medium text-sm transition-colors duration-150">
                Home
              </Link>
              <Link href="/products" className="text-[#555] hover:text-brand-green font-medium text-sm transition-colors duration-150">
                Products
              </Link>
              <Link href="/deals" className="text-brand-orange hover:text-brand-orange-hover font-semibold text-sm transition-colors duration-150">
                Deals
              </Link>
            </nav>
          </div>

          {/* Center/Right Section: Search Bar */}
          <div className="flex-1 max-w-md mx-2 md:mx-4">
            <div className="relative flex items-center">
              <div className="absolute left-4 text-neutral-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search for groceries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="w-full pl-11 pr-4 py-2 text-sm rounded-full bg-[#FCF7ED] border border-[#F3EAD8] text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-brand-orange/40 focus:border-brand-orange/40 focus:bg-white transition-all duration-200"
              />
            </div>
          </div>

          {/* Far Right Section: Cart & Sign In */}
          <div className="flex items-center gap-4 relative">
            {/* Cart Icon with Badge */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-[#333] hover:text-brand-green hover:scale-105 transition-all duration-200 cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="absolute top-0.5 right-0.5 bg-brand-orange text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </button>

            {isLoggedIn && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-1 focus:outline-none cursor-pointer group"
                >
                  {/* User Avatar Circle: Green background with initial letter */}
                  <div className="w-8 h-8 rounded-full bg-[#0F2C1F] text-white flex items-center justify-center font-bold text-sm select-none shadow-sm group-hover:scale-105 transition-transform duration-200">
                    {user.name ? user.name.slice(0, 1).toUpperCase() : 'U'}
                  </div>
                  {/* Chevron Down */}
                  <svg className="w-3 h-3 text-neutral-500 group-hover:text-neutral-700 transition-colors" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>

                {/* User Menu Dropdown */}
                {isDropdownOpen && (
                  <>
                    {/* Invisible backdrop to close dropdown on click outside */}
                    <div
                      onClick={() => setIsDropdownOpen(false)}
                      className="fixed inset-0 z-10"
                    />
                    <div className="absolute right-0 mt-2.5 w-60 bg-white border border-neutral-100 rounded-2xl shadow-xl z-20 py-3 text-left font-sans animate-in fade-in slide-in-from-top-2 duration-150">

                      {/* Header info */}
                      <div className="px-4 py-2 border-b border-neutral-100 pb-3 flex flex-col gap-0.5">
                        <span className="font-bold text-sm text-neutral-800 tracking-tight leading-none">
                          {user.name}
                        </span>
                        <span className="text-xs text-neutral-400 font-medium overflow-hidden text-ellipsis whitespace-nowrap">
                          {user.email}
                        </span>
                      </div>

                      {/* Menu links */}
                      <div className="py-1">

                        {/* My Orders */}
                        <Link
                          href="/orders"
                          onClick={() => setIsDropdownOpen(false)}
                          className="w-full px-4 py-2 text-sm text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 flex items-center gap-3 transition-colors cursor-pointer text-left font-semibold"
                        >
                          <svg className="w-4 h-4 text-neutral-400 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                          </svg>
                          My Orders
                        </Link>

                        {/* Addresses */}
                        <Link
                          href="/addresses"
                          onClick={() => setIsDropdownOpen(false)}
                          className="w-full px-4 py-2 text-sm text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 flex items-center gap-3 transition-colors cursor-pointer text-left font-semibold"
                        >
                          <svg className="w-4 h-4 text-neutral-400 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                          </svg>
                          Addresses
                        </Link>

                        {/* Products */}
                        <Link
                          href="/products"
                          onClick={() => setIsDropdownOpen(false)}
                          className="w-full px-4 py-2 text-sm text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 flex items-center gap-3 transition-colors cursor-pointer text-left font-semibold"
                        >
                          <svg className="w-4 h-4 text-neutral-400 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                          </svg>
                          Products
                        </Link>

                        {/* Deals */}
                        <Link
                          href="/deals"
                          onClick={() => setIsDropdownOpen(false)}
                          className="w-full px-4 py-2 text-sm text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 flex items-center gap-3 transition-colors cursor-pointer text-left font-semibold"
                        >
                          <svg className="w-4 h-4 text-neutral-400 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                          </svg>
                          Deals
                        </Link>

                        {/* Admin Panel */}
                        <Link
                          href="/admin"
                          onClick={() => setIsDropdownOpen(false)}
                          className="w-full px-4 py-2 text-sm text-[#FF5C00] hover:text-brand-orange-hover hover:bg-neutral-50 flex items-center gap-3 transition-colors cursor-pointer text-left font-semibold border-t border-neutral-100/60 mt-1 pt-2"
                        >
                          <svg className="w-4 h-4 text-[#FF5C00] stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                          </svg>
                          Admin Panel
                        </Link>

                        {/* Logout */}
                        <button
                          onClick={() => { setIsDropdownOpen(false); logout(); }}
                          className="w-full px-4 py-2 text-sm text-[#EF4444] hover:bg-[#FEF2F2] flex items-center gap-3 transition-colors cursor-pointer text-left font-semibold border-t border-neutral-100/60 mt-1 pt-2"
                        >
                          <svg className="w-4 h-4 text-[#EF4444] stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                          </svg>
                          Logout
                        </button>

                      </div>

                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link href="/login">
                <Button variant="green" className="flex items-center gap-2 py-2.5 px-5 cursor-pointer">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  <span className="text-sm font-semibold tracking-wide">Sign In</span>
                </Button>
              </Link>
            )}
          </div>

        </div>
      </header>
    </div>
  );
};
export default Header;
