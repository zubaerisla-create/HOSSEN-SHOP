"use client";

import React, { useState, useEffect } from 'react';
import ProductCard from '../ui/ProductCard';
import { products as defaultProducts } from '../../lib/mockData';
import { api } from '../../lib/api';
import { Product } from '../../lib/types';

export const PopularProducts: React.FC = () => {
  const [productList, setProductList] = useState<Product[]>([]);

  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        const data = await api.getProducts();
        if (data && data.length > 0) {
          // Slice top 10 products
          setProductList(data.slice(0, 10));
        } else {
          setProductList(defaultProducts.slice(0, 10));
        }
      } catch (err) {
        console.error('Failed to fetch popular products:', err);
        setProductList(defaultProducts.slice(0, 10));
      }
    };
    fetchPopularProducts();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-8 md:py-12">
      
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-neutral-900 mb-1">
            Popular Products
          </h2>
          <p className="text-sm text-neutral-500 font-sans">
            Top-rated products this season
          </p>
        </div>
        
        {/* View All Link */}
        <a
          href="/products"
          className="flex items-center gap-1 text-sm font-semibold text-brand-orange hover:text-brand-orange-hover hover:underline transition-all duration-200"
        >
          View All
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </a>
      </div>

      {/* Responsive Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
        {productList.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

    </section>
  );
};
export default PopularProducts;
