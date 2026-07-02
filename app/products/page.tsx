"use client";

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Header from '../components/layout/Header';
import Footer from '../components/home/Footer';
import ProductCard from '../components/ui/ProductCard';
import { Product, Category } from '../lib/types';
import { products, categories } from '../lib/mockData';
import { api } from '../lib/api';

interface DisplayProduct extends Product {
  category: string;
  createdAt?: string;
}

interface BackendProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number | null;
  unit: string;
  image: string;
  category?: {
    id: string;
    name: string;
  } | null;
  rating?: number | null;
  ratingCount?: number | null;
  discount?: number | null;
  createdAt?: string;
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') || 'All';
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [productsList, setProductsList] = useState<DisplayProduct[]>([]);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [prods, cats] = await Promise.all([
          api.getProducts(),
          api.getCategories(),
        ]);
        
        if (prods && prods.length > 0) {
          setProductsList(prods.map((p: BackendProduct) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            originalPrice: p.originalPrice || undefined,
            unit: p.unit,
            image: p.image,
            category: p.category?.name || 'Fruits & Vegetables',
            rating: p.rating || 4.5,
            ratingCount: p.ratingCount || 12,
            discount: p.discount || undefined,
            createdAt: p.createdAt
          })));
        } else {
          setProductsList(products as DisplayProduct[]);
        }

        if (cats && cats.length > 0) {
          setCategoriesList(cats);
        } else {
          setCategoriesList(categories);
        }
      } catch (err) {
        console.error('Failed to load products/categories from backend:', err);
        // Fallback
        const savedProds = localStorage.getItem('hossen_shop_admin_products');
        if (savedProds) {
          try {
            setProductsList(JSON.parse(savedProds));
          } catch (e) {
            setProductsList(products as DisplayProduct[]);
          }
        } else {
          setProductsList(products as DisplayProduct[]);
        }

        const savedCats = localStorage.getItem('hossen_shop_admin_categories');
        if (savedCats) {
          try {
            setCategoriesList(JSON.parse(savedCats));
          } catch (e) {
            setCategoriesList(categories);
          }
        } else {
          setCategoriesList(categories);
        }
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');

  // Extended categories list including "All Categories"
  const allCategories = useMemo(() => {
    return [{ id: 'all', name: 'All Categories' }, ...categoriesList];
  }, [categoriesList]);

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...productsList];

    // Category Filter
    if (selectedCategory !== 'All' && selectedCategory !== 'all') {
      result = result.filter(
        (product) => {
          // If the product has a category field matching selectedCategory, return true
          if (product.category && product.category.toLowerCase() === selectedCategory.toLowerCase()) {
            return true;
          }
          
          // Otherwise fall back to name matching for mockup compatibility
          const nameLower = product.name.toLowerCase();
          
          if (selectedCategory === 'Fruits & Vegetables') {
            return nameLower.includes('carrot') || nameLower.includes('banana') || nameLower.includes('onion') || nameLower.includes('grapes') || nameLower.includes('strawberry') || nameLower.includes('apple');
          }
          if (selectedCategory === 'Personal Care') {
            return nameLower.includes('paper') || nameLower.includes('toilet');
          }
          if (selectedCategory === 'Pantry Staples') {
            return nameLower.includes('rice') || nameLower.includes('honey');
          }
          if (selectedCategory === 'Bakery') {
            return nameLower.includes('bread') || nameLower.includes('barley');
          }
          if (selectedCategory === 'Beverages') {
            return nameLower.includes('fanta') || nameLower.includes('sprite') || nameLower.includes('juice') || nameLower.includes('7 up');
          }
          if (selectedCategory === 'Meat & Seafood') {
            return nameLower.includes('salmon');
          }
          if (selectedCategory === 'Snacks') {
            return nameLower.includes('soup') || nameLower.includes('noodles') || nameLower.includes('knorr') || nameLower.includes('maggi');
          }
          if (selectedCategory === 'Dairy & Eggs') {
            return nameLower.includes('cheese') || nameLower.includes('milk') || nameLower.includes('eggs') || nameLower.includes('paneer') || nameLower.includes('yogurt') || nameLower.includes('amul');
          }
          // Default fallbacks
          return true;
        }
      );
    }

    // Price Filter
    if (minPrice !== '') {
      const min = parseFloat(minPrice);
      if (!isNaN(min)) {
        result = result.filter((p) => p.price >= min);
      }
    }
    if (maxPrice !== '') {
      const max = parseFloat(maxPrice);
      if (!isNaN(max)) {
        result = result.filter((p) => p.price <= max);
      }
    }

    // Sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else {
      // 'newest' / default order by createdAt, fallback to numeric/UUID comparison
      result.sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        const aNum = parseInt(a.id);
        const bNum = parseInt(b.id);
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return bNum - aNum;
        }
        return String(b.id || '').localeCompare(String(a.id || ''));
      });
    }

    return result;
  }, [productsList, selectedCategory, minPrice, maxPrice, sortBy]);

  return (
    <div className="flex flex-col min-h-screen bg-site-bg">
      {/* Global Header */}
      <Header />

      {/* Main Page Layout */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-8 lg:px-16 py-6">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs md:text-sm text-neutral-500 mb-6 font-sans">
          <Link href="/" className="hover:text-brand-green flex items-center gap-1.5 transition-colors">
            {/* Home Icon */}
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            Home
          </Link>
          <span className="text-neutral-300">/</span>
          <span className="text-brand-green font-medium">All Products</span>
        </div>

        {/* Sidebar + Product List Wrapper */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Left Sidebar: Filters */}
          <aside className="w-full md:w-64 shrink-0 bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm md:sticky md:top-24 md:max-h-[calc(100vh-120px)] md:overflow-y-auto">
            {/* Categories Section */}
            <div className="mb-8">
              <h3 className="text-sm font-bold text-neutral-800 uppercase tracking-wider mb-4 font-sans">
                Categories
              </h3>
              <div className="flex flex-col gap-1">
                {allCategories.map((cat) => {
                  const isAll = cat.id === 'all';
                  const catName = isAll ? 'All' : cat.name;
                  const isActive = selectedCategory === catName;

                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(catName)}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-sans transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-brand-green text-white font-semibold shadow-sm'
                          : 'text-neutral-600 hover:bg-neutral-50 hover:text-brand-green'
                      }`}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Divider */}
            <div className="h-[1px] bg-neutral-100 my-6" />

            {/* Price Range Section */}
            <div>
              <h3 className="text-sm font-bold text-neutral-800 uppercase tracking-wider mb-4 font-sans">
                Price Range
              </h3>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-200 bg-neutral-50/50 text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-brand-green/30 focus:border-brand-green/30 focus:bg-white transition-all"
                />
                <span className="text-neutral-400 font-sans">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-200 bg-neutral-50/50 text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-brand-green/30 focus:border-brand-green/30 focus:bg-white transition-all"
                />
              </div>
              
              {/* Clear filters shortcut helper */}
              {(minPrice !== '' || maxPrice !== '' || selectedCategory !== 'All') && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('All');
                    setMinPrice('');
                    setMaxPrice('');
                  }}
                  className="mt-4 text-xs font-semibold text-brand-orange hover:text-brand-orange-hover hover:underline transition-all cursor-pointer font-sans"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </aside>

          {/* Right Panel: Header + Product Grid */}
          <div className="flex-1 w-full">
            {/* Grid Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-neutral-900 mb-1">
                  All Products
                </h2>
                <p className="text-sm text-neutral-500 font-sans">
                  {filteredProducts.length} products found
                </p>
              </div>

              {/* Sort Selector Dropdown */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-xs text-neutral-400 font-sans uppercase tracking-wider">Sort by:</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-neutral-200 rounded-xl py-2 pl-4 pr-10 text-sm text-neutral-800 font-sans font-medium focus:outline-none focus:ring-1 focus:ring-brand-green/20 focus:border-brand-green/50 cursor-pointer shadow-sm"
                  >
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-neutral-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-neutral-100 rounded-3xl p-12 text-center shadow-sm">
                <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center text-neutral-300 mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                  </svg>
                </div>
                <h3 className="font-serif text-lg font-bold text-neutral-800 mb-1">No products found</h3>
                <p className="text-sm text-neutral-500 font-sans max-w-xs mx-auto">
                  We couldn&apos;t find any items matching your selected filters. Try broadening your criteria.
                </p>
              </div>
            )}
          </div>

        </div>

      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-site-bg">
        <div className="text-brand-green font-medium font-serif text-lg animate-pulse">Loading Products...</div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
