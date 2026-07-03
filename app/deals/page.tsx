"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/home/Footer';
import ProductCard from '../components/ui/ProductCard';
import { products as defaultProducts } from '../lib/mockData';
import { Zap } from 'lucide-react';

import { api } from '../lib/api';

export default function DealsPage() {
  const [productsList, setProductsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const data = await api.getProducts();
        if (data && data.length > 0) {
          setProductsList(data);
        } else {
          setProductsList(defaultProducts);
        }
      } catch (err) {
        console.error('Failed to fetch deals from API:', err);
        setProductsList(defaultProducts);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDeals();
  }, []);

  const dealProducts = useMemo(() => {
    if (isLoading) return [];
    
    // Filter products that are designated as flash deals
    const flashDeals = productsList.filter(p => p.isFlashDeal);
    if (flashDeals.length > 0) return flashDeals;

    // Fallback: filter products that have a discount
    const discounted = productsList.filter(p => p.discount && p.discount > 0);
    if (discounted.length > 0) return discounted;

    // Fallback to initial mock names
    const fallback = ['Wheat Flour 5kg','Barley 1kg','Brown Rice 1kg','Apple 1 kg','Paneer 200g','Eggs 12 pcs','Coca-Cola 1.5L','Orange 1 kg'];
    return fallback.map(n => productsList.find(p => p.name === n)).filter(Boolean);
  }, [productsList, isLoading]);

  return (
    <div className="flex flex-col min-h-screen bg-site-bg">
      <Header />
      <main className="flex-grow">

        {/* Hero Banner */}
        <section className="bg-gradient-to-br from-[#FF5C00] via-[#FF7A00] to-[#FF9A00] text-white py-14 px-4 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-8 w-24 h-24 rounded-full bg-white/30 blur-2xl" />
            <div className="absolute bottom-4 right-12 w-36 h-36 rounded-full bg-white/20 blur-3xl" />
          </div>
          <div className="max-w-3xl mx-auto flex flex-col items-center relative z-10">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-4 border border-white/30">
              <Zap className="w-3 h-3 fill-white" /> Limited Time Offers
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4">
              Flash Deals
            </h1>
            <p className="font-sans text-sm sm:text-base text-white/90 max-w-xl leading-relaxed">
              Unbeatable prices on your favorite products — updated by our team daily. Don&apos;t miss out!
            </p>
            <div className="flex items-center gap-3 mt-6 text-xs text-white/80 font-semibold">
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse inline-block" /> Live Now</span>
              <span className="text-white/40">•</span>
              <span>{dealProducts.length} deals active</span>
            </div>
          </div>
        </section>

        {/* Product Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-12">
          <div className="flex items-center justify-between mb-8 border-b border-neutral-100 pb-5">
            <div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-neutral-900 flex items-center gap-2">
                <Zap className="w-6 h-6 text-brand-orange fill-brand-orange" /> Flash Deals
              </h2>
              <p className="text-sm text-neutral-500 font-sans mt-1">
                {dealProducts.length} handpicked products at limited-time prices
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <span className="text-brand-green font-medium font-serif text-lg animate-pulse">Loading Deals…</span>
            </div>
          ) : dealProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
              {dealProducts.map((product: any) => (
                <ProductCard key={product.id} product={product} showFlashBadge />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-neutral-100 rounded-3xl p-12 text-center shadow-sm">
              <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center text-brand-orange mx-auto mb-4">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-lg font-bold text-neutral-800 mb-1">No Flash Deals active</h3>
              <p className="text-sm text-neutral-500 font-sans max-w-xs mx-auto">
                Check back soon or visit the admin panel to activate Flash Deals.
              </p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
