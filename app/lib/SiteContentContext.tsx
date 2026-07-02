"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// ─── TYPES ────────────────────────────────────────────────────────────────────

export interface HeroContent {
  badgeText: string;
  headingLine1: string;
  headingHighlight: string;
  headingLine2: string;
  paragraph: string;
  btn1Label: string;
  btn1Href: string;
  btn2Label: string;
  btn2Href: string;
  bgImageUrl: string;
}

export interface FeatureItem {
  id: string;
  iconName: 'delivery' | 'organic' | 'delivery-time' | 'secure-pay';
  title: string;
  subtitle: string;
}

export interface AppBannerContent {
  heading: string;
  paragraph: string;
  appStoreBtnLabel: string;
  appStoreLink: string;
  googlePlayBtnLabel: string;
  googlePlayLink: string;
  illustrationImageUrl: string; // optional override; empty = use SVG
}

export interface NewsletterContent {
  heading: string;
  description: string;
  buttonText: string;
  inputPlaceholder: string;
}

export interface FooterLink {
  id: string;
  label: string;
  href: string;
}

export interface FooterContent {
  brandName: string;
  brandTagline: string;
  facebookUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  quickLinks: FooterLink[];
  customerServiceLinks: FooterLink[];
  address: string;
  phone: string;
  email: string;
  copyrightText: string;
  privacyPolicyLink: string;
  termsLink: string;
}

export interface SiteSettings {
  siteName: string;
  logoText: string;
  navLinks: FooterLink[];
}

// ─── DEFAULTS ─────────────────────────────────────────────────────────────────

export const DEFAULT_HERO: HeroContent = {
  badgeText: 'Farm-Fresh & Organic',
  headingLine1: 'Nourish your home',
  headingHighlight: "Earth's finest",
  headingLine2: 'with',
  paragraph: 'Fresh, organic groceries delivered from local farms to your doorstep. Quality you can taste, convenience you deserve.',
  btn1Label: 'Shop Now',
  btn1Href: '/products',
  btn2Label: 'Browse Categories',
  btn2Href: '/#categories',
  bgImageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&auto=format&fit=crop&q=80',
};

export const DEFAULT_FEATURES: FeatureItem[] = [
  { id: '1', iconName: 'delivery', title: 'Free Delivery', subtitle: 'Orders over $20' },
  { id: '2', iconName: 'organic', title: '100% Organic', subtitle: 'Certified products' },
  { id: '3', iconName: 'delivery-time', title: 'Same Day', subtitle: 'Express delivery' },
  { id: '4', iconName: 'secure-pay', title: 'Secure Pay', subtitle: 'Safe checkout' },
];

export const DEFAULT_APP_BANNER: AppBannerContent = {
  heading: 'Get fresh groceries in minutes',
  paragraph: 'Download the Hossen Shop app for exclusive deals, real-time tracking, and the freshest selection delivered right to your door.',
  appStoreBtnLabel: 'App Store',
  appStoreLink: '#',
  googlePlayBtnLabel: 'Google Play',
  googlePlayLink: '#',
  illustrationImageUrl: '',
};

export const DEFAULT_NEWSLETTER: NewsletterContent = {
  heading: 'Subscribe to our Newsletter',
  description: 'Get weekly updates on fresh produce, seasonal offers, and exclusive discounts right to your inbox.',
  buttonText: 'Subscribe',
  inputPlaceholder: 'Enter your email address',
};

const makeId = () => Math.random().toString(36).slice(2, 9);

export const DEFAULT_FOOTER: FooterContent = {
  brandName: 'Hossen Shop',
  brandTagline: "Bringing fresh, organic groceries straight from local farms to your doorstep. Nourish your home with Earth's finest.",
  facebookUrl: '#',
  twitterUrl: '#',
  instagramUrl: '#',
  quickLinks: [
    { id: makeId(), label: 'All Products', href: '/products' },
    { id: makeId(), label: 'Flash Deals', href: '/deals' },
    { id: makeId(), label: 'Track Order', href: '#' },
    { id: makeId(), label: 'Delivery Partner', href: '#' },
  ],
  customerServiceLinks: [
    { id: makeId(), label: 'My Account', href: '#' },
    { id: makeId(), label: 'Order History', href: '#' },
    { id: makeId(), label: 'Addresses', href: '#' },
    { id: makeId(), label: 'Help Center', href: '#' },
  ],
  address: '123 Green Valley Rd, Portland',
  phone: '+1 (111) 123-4567',
  email: 'hello@example.com',
  copyrightText: '© 2026 Hossen Shop. All rights reserved.',
  privacyPolicyLink: '#',
  termsLink: '#',
};

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteName: 'Hossen Shop',
  logoText: 'Hossen Shop',
  navLinks: [
    { id: makeId(), label: 'Home', href: '/' },
    { id: makeId(), label: 'Products', href: '/products' },
    { id: makeId(), label: 'Deals', href: '/deals' },
  ],
};

// ─── CONTEXT ──────────────────────────────────────────────────────────────────

interface SiteContentContextType {
  hero: HeroContent;
  features: FeatureItem[];
  appBanner: AppBannerContent;
  newsletter: NewsletterContent;
  footer: FooterContent;
  siteSettings: SiteSettings;
  updateHero: (data: HeroContent) => void;
  updateFeatures: (data: FeatureItem[]) => void;
  updateAppBanner: (data: AppBannerContent) => void;
  updateNewsletter: (data: NewsletterContent) => void;
  updateFooter: (data: FooterContent) => void;
  updateSiteSettings: (data: SiteSettings) => void;
  isLoaded: boolean;
}

const SiteContentContext = createContext<SiteContentContextType | undefined>(undefined);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return { ...fallback, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return fallback;
}

export const SiteContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hero, setHero] = useState<HeroContent>(DEFAULT_HERO);
  const [features, setFeatures] = useState<FeatureItem[]>(DEFAULT_FEATURES);
  const [appBanner, setAppBanner] = useState<AppBannerContent>(DEFAULT_APP_BANNER);
  const [newsletter, setNewsletter] = useState<NewsletterContent>(DEFAULT_NEWSLETTER);
  const [footer, setFooter] = useState<FooterContent>(DEFAULT_FOOTER);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);

  useEffect(() => {
    setHero(loadFromStorage('hossen_cms_hero', DEFAULT_HERO));
    const rawFeatures = localStorage.getItem('hossen_cms_features');
    if (rawFeatures) { try { setFeatures(JSON.parse(rawFeatures)); } catch { /* ignore */ } }
    setAppBanner(loadFromStorage('hossen_cms_appbanner', DEFAULT_APP_BANNER));
    setNewsletter(loadFromStorage('hossen_cms_newsletter', DEFAULT_NEWSLETTER));
    const rawFooter = localStorage.getItem('hossen_cms_footer');
    if (rawFooter) { try { setFooter(JSON.parse(rawFooter)); } catch { /* ignore */ } }
    setIsLoaded(true);
  }, []);

  const updateHero = useCallback((data: HeroContent) => {
    setHero(data);
    localStorage.setItem('hossen_cms_hero', JSON.stringify(data));
  }, []);

  const updateFeatures = useCallback((data: FeatureItem[]) => {
    setFeatures(data);
    localStorage.setItem('hossen_cms_features', JSON.stringify(data));
  }, []);

  const updateAppBanner = useCallback((data: AppBannerContent) => {
    setAppBanner(data);
    localStorage.setItem('hossen_cms_appbanner', JSON.stringify(data));
  }, []);

  const updateNewsletter = useCallback((data: NewsletterContent) => {
    setNewsletter(data);
    localStorage.setItem('hossen_cms_newsletter', JSON.stringify(data));
  }, []);

  const updateFooter = useCallback((data: FooterContent) => {
    setFooter(data);
    localStorage.setItem('hossen_cms_footer', JSON.stringify(data));
  }, []);

  const updateSiteSettings = useCallback((data: SiteSettings) => {
    setSiteSettings(data);
    localStorage.setItem('hossen_cms_site', JSON.stringify(data));
  }, []);

  return (
    <SiteContentContext.Provider value={{
      hero, features, appBanner, newsletter, footer, siteSettings,
      updateHero, updateFeatures, updateAppBanner, updateNewsletter, updateFooter, updateSiteSettings,
      isLoaded,
    }}>
      {children}
    </SiteContentContext.Provider>
  );
};

export const useSiteContent = () => {
  const ctx = useContext(SiteContentContext);
  if (!ctx) throw new Error('useSiteContent must be used within SiteContentProvider');
  return ctx;
};
