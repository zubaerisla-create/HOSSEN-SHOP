"use client";

import React, { useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../components/layout/Header';
import Footer from '../components/home/Footer';
import { ProductCard } from '../components/ui/ProductCard';
import { products } from '../lib/mockData';

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const filteredProducts = useMemo(() => {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    return products.filter((p) => 
      p.name.toLowerCase().includes(lowerQuery)
    );
  }, [query]);

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5]">
      <Header />

      <main className="flex-grow py-10 px-4 sm:px-8 lg:px-16 flex flex-col gap-6 max-w-7xl mx-auto w-full font-sans text-left">
        
        {/* Breadcrumbs matching mockup layout */}
        <div className="flex items-center gap-2 text-xs text-neutral-400 font-bold font-sans tracking-wide self-start mb-1">
          <Link href="/" className="hover:text-neutral-700 flex items-center gap-1">
            <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
          </Link>
          <span>/</span>
          <span className="text-neutral-800">Search Results</span>
        </div>

        {/* Search Query Details */}
        <div className="flex flex-col gap-1">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
            Results for &quot;{query}&quot;
          </h1>
          <p className="text-xs text-neutral-400 font-semibold">
            {filteredProducts.length} items found
          </p>
        </div>

        {/* Results Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white border border-neutral-100 rounded-3xl p-16 text-center text-neutral-400 flex flex-col items-center gap-4 max-w-lg mx-auto w-full my-8">
            <svg className="w-12 h-12 text-neutral-300 animate-pulse" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <div className="flex flex-col gap-1">
              <span className="font-bold text-sm text-neutral-700">No results found</span>
              <span className="text-xs text-neutral-400">Try checking spelling or searching for another grocery item</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-2">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
        <div className="text-brand-green font-medium font-serif text-lg animate-pulse">Loading Search Results...</div>
      </div>
    }>
      <SearchResultsContent />
    </Suspense>
  );
}
