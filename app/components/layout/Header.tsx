"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '../ui/Button';
import { useCart } from '../../lib/CartContext';
import { useAuth } from '../../lib/AuthContext';
import { 
  Zap, 
  Truck, 
  Tag, 
  Menu, 
  X, 
  Home, 
  ShoppingBag, 
  Percent, 
  ClipboardList, 
  MapPin, 
  ShieldAlert, 
  LogOut, 
  LogIn 
} from 'lucide-react';

export const Header: React.FC = () => {
  const router = useRouter();
  const { cartCount, setIsCartOpen } = useCart();
  const { user, isLoggedIn, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
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
        <div className="max-w-7xl mx-auto flex flex-col gap-3">
          
          {/* Main Top Row */}
          <div className="flex items-center justify-between gap-4 w-full">
            {/* Left Section: Logo & Nav Links */}
            <div className="flex items-center gap-6 md:gap-10 shrink-0">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-1.5 sm:gap-2 group">
                {/* Custom SVG Icon resembling the bicycle/leaf style */}
                <div className="text-brand-green group-hover:scale-105 transition-transform duration-200">
                  <svg className="w-7 h-7 sm:w-8 sm:h-8" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="14" cy="28" r="4" stroke="currentColor" strokeWidth="2.5" />
                    <circle cx="28" cy="28" r="4" stroke="currentColor" strokeWidth="2.5" />
                    <path d="M14 28h14M10 28l4-12h14l4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M22 16h6l-3-6h-5z" fill="currentColor" opacity="0.15" />
                    <path d="M22 16h6l-3-6h-5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M14 16l3-8h5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="font-serif text-lg sm:text-xl md:text-2xl font-bold text-brand-green tracking-tight whitespace-nowrap">
                  Hossen Shop
                </span>
              </Link>

              {/* Navigation Links (Desktop only) */}
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

            {/* Desktop Search Bar (md and above) */}
            <div className="hidden md:block flex-1 max-w-md mx-4">
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

            {/* Right Section: Cart & Profile (Desktop) / Hamburger (Mobile) */}
            <div className="flex items-center gap-2 sm:gap-4 relative shrink-0">
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

              {/* User Dropdown (Desktop only) */}
              <div className="hidden md:block">
                {isLoggedIn && user ? (
                  <div className="relative">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center gap-1 focus:outline-none cursor-pointer group"
                    >
                      {/* User Avatar Circle */}
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
                        <div
                          onClick={() => setIsDropdownOpen(false)}
                          className="fixed inset-0 z-10"
                        />
                        <div className="absolute right-0 mt-2.5 w-60 bg-white border border-neutral-100 rounded-2xl shadow-xl z-20 py-3 text-left font-sans animate-in fade-in slide-in-from-top-2 duration-150">
                          <div className="px-4 py-2 border-b border-neutral-100 pb-3 flex flex-col gap-0.5">
                            <span className="font-bold text-sm text-neutral-800 tracking-tight leading-none">
                              {user.name}
                            </span>
                            <span className="text-xs text-neutral-400 font-medium overflow-hidden text-ellipsis whitespace-nowrap">
                              {user.email}
                            </span>
                          </div>

                          <div className="py-1">
                            <Link
                              href="/orders"
                              onClick={() => setIsDropdownOpen(false)}
                              className="w-full px-4 py-2 text-sm text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 flex items-center gap-3 transition-colors cursor-pointer text-left font-semibold"
                            >
                              <ClipboardList className="w-4 h-4 text-neutral-400" />
                              My Orders
                            </Link>

                            <Link
                              href="/addresses"
                              onClick={() => setIsDropdownOpen(false)}
                              className="w-full px-4 py-2 text-sm text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 flex items-center gap-3 transition-colors cursor-pointer text-left font-semibold"
                            >
                              <MapPin className="w-4 h-4 text-neutral-400" />
                              Addresses
                            </Link>

                            <Link
                              href="/products"
                              onClick={() => setIsDropdownOpen(false)}
                              className="w-full px-4 py-2 text-sm text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 flex items-center gap-3 transition-colors cursor-pointer text-left font-semibold"
                            >
                              <ShoppingBag className="w-4 h-4 text-neutral-400" />
                              Products
                            </Link>

                            <Link
                              href="/deals"
                              onClick={() => setIsDropdownOpen(false)}
                              className="w-full px-4 py-2 text-sm text-[#FF5C00] hover:text-brand-orange-hover hover:bg-neutral-50 flex items-center gap-3 transition-colors cursor-pointer text-left font-semibold"
                            >
                              <Percent className="w-4 h-4 text-[#FF5C00]" />
                              Deals
                            </Link>

                            <Link
                              href="/admin"
                              onClick={() => setIsDropdownOpen(false)}
                              className="w-full px-4 py-2 text-sm text-[#FF5C00] hover:text-brand-orange-hover hover:bg-neutral-50 flex items-center gap-3 transition-colors cursor-pointer text-left font-semibold border-t border-neutral-100/60 mt-1 pt-2"
                            >
                              <ShieldAlert className="w-4 h-4 text-[#FF5C00]" />
                              Admin Panel
                            </Link>

                            <button
                              onClick={() => { setIsDropdownOpen(false); logout(); }}
                              className="w-full px-4 py-2 text-sm text-[#EF4444] hover:bg-[#FEF2F2] flex items-center gap-3 transition-colors cursor-pointer text-left font-semibold border-t border-neutral-100/60 mt-1 pt-2"
                            >
                              <LogOut className="w-4 h-4 text-[#EF4444]" />
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

              {/* Hamburger Menu Toggle (Mobile only) */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="block md:hidden p-2 text-[#333] hover:text-brand-green hover:scale-105 transition-all duration-200 cursor-pointer"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar (visible below md) */}
          <div className="block md:hidden w-full px-0.5">
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
                className="w-full pl-11 pr-4 py-2.5 text-sm rounded-full bg-[#FCF7ED] border border-[#F3EAD8] text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-brand-orange/40 focus:border-brand-orange/40 focus:bg-white transition-all duration-200"
              />
            </div>
          </div>

        </div>
      </header>

      {/* Mobile Drawer Overlay & Drawer */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/45 backdrop-blur-[1.5px] z-50 transition-opacity duration-300 animate-in fade-in"
          />
          {/* Drawer Panel */}
          <div className="fixed top-0 right-0 h-full w-72 bg-[#FAF8F5] shadow-2xl z-50 p-6 flex flex-col gap-6 animate-in slide-in-from-right duration-300">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <span className="font-serif text-lg font-bold text-brand-green">Menu</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Info in Drawer (if logged in) */}
            {isLoggedIn && user ? (
              <div className="flex items-center gap-3 py-2 px-1 bg-white border border-neutral-100 rounded-2xl p-3 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-[#0F2C1F] text-white flex items-center justify-center font-bold text-base select-none shrink-0">
                  {user.name ? user.name.slice(0, 1).toUpperCase() : 'U'}
                </div>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="font-bold text-sm text-neutral-800 tracking-tight truncate">
                    {user.name}
                  </span>
                  <span className="text-xs text-neutral-400 font-medium truncate">
                    {user.email}
                  </span>
                </div>
              </div>
            ) : null}

            {/* Menu Links */}
            <div className="flex flex-col gap-1 font-sans text-sm">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3.5 py-3 px-4 rounded-xl text-neutral-600 hover:text-brand-green hover:bg-white border border-transparent hover:border-neutral-100 font-bold transition-all"
              >
                <Home className="w-4 h-4 text-neutral-400" />
                Home
              </Link>
              
              <Link
                href="/products"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3.5 py-3 px-4 rounded-xl text-neutral-600 hover:text-brand-green hover:bg-white border border-transparent hover:border-neutral-100 font-bold transition-all"
              >
                <ShoppingBag className="w-4 h-4 text-neutral-400" />
                Products
              </Link>

              <Link
                href="/deals"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3.5 py-3 px-4 rounded-xl text-brand-orange hover:text-brand-orange-hover hover:bg-white border border-transparent hover:border-neutral-100 font-bold transition-all"
              >
                <Percent className="w-4 h-4 text-brand-orange shrink-0" />
                Deals
              </Link>

              {/* Logged-in Links */}
              {isLoggedIn && user ? (
                <>
                  <div className="h-[1px] bg-neutral-100 my-2" />
                  
                  <Link
                    href="/orders"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3.5 py-3 px-4 rounded-xl text-neutral-600 hover:text-neutral-900 hover:bg-white border border-transparent hover:border-neutral-100 font-bold transition-all"
                  >
                    <ClipboardList className="w-4 h-4 text-neutral-400" />
                    My Orders
                  </Link>

                  <Link
                    href="/addresses"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3.5 py-3 px-4 rounded-xl text-neutral-600 hover:text-neutral-900 hover:bg-white border border-transparent hover:border-neutral-100 font-bold transition-all"
                  >
                    <MapPin className="w-4 h-4 text-neutral-400" />
                    Addresses
                  </Link>

                  <Link
                    href="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3.5 py-3 px-4 rounded-xl text-[#FF5C00] hover:text-brand-orange-hover hover:bg-white border border-transparent hover:border-neutral-100 font-bold transition-all"
                  >
                    <ShieldAlert className="w-4 h-4 text-[#FF5C00]" />
                    Admin Panel
                  </Link>

                  <div className="h-[1px] bg-neutral-100 my-2" />

                  <button
                    onClick={() => { setIsMobileMenuOpen(false); logout(); }}
                    className="w-full flex items-center gap-3.5 py-3 px-4 rounded-xl text-[#EF4444] hover:bg-[#FEF2F2] font-bold transition-all text-left cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-[#EF4444]" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <div className="h-[1px] bg-neutral-100 my-2" />
                  
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3.5 py-3 px-4 rounded-xl text-brand-green hover:bg-white border border-transparent hover:border-neutral-100 font-bold transition-all"
                  >
                    <LogIn className="w-4 h-4 text-brand-green" />
                    Sign In
                  </Link>
                </>
              )}
            </div>

          </div>
        </>
      )}
    </div>
  );
};

export default Header;
