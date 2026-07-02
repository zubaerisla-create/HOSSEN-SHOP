"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { categories as defaultCategories } from '../../lib/mockData';

export const CategoriesSection: React.FC = () => {
  const [categoriesList, setCategoriesList] = useState(defaultCategories);

  useEffect(() => {
    const saved = localStorage.getItem('hossen_shop_admin_categories');
    if (saved) {
      try {
        setCategoriesList(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  return (
    <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-12 md:py-16">
      
      {/* Header */}
      <div className="mb-8">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-neutral-900 mb-1">
          Browse Categories
        </h2>
        <p className="text-sm text-neutral-500 font-sans">
          Find exactly what you need using
        </p>
      </div>

      {/* Horizontal Scrollable Categories List */}
      <div className="flex items-center gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory">
        {categoriesList.map((category) => (
          <Link
            key={category.id}
            href={`/products?category=${encodeURIComponent(category.name)}`}
            className="flex-none w-28 sm:w-32 snap-start flex flex-col items-center text-center group cursor-pointer"
          >
            {/* Image container with warm soft background */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#FCF6ED] border border-[#F3EAD8]/50 flex items-center justify-center p-3 mb-3 group-hover:scale-[1.03] group-hover:bg-[#FCEFD8] group-hover:border-[#E8D4B4] transition-all duration-300">
              <img
                src={category.image}
                alt={category.name}
                className="max-h-full max-w-full object-cover rounded-xl filter multiply mix-blend-multiply"
                loading="lazy"
              />
            </div>
            {/* Category Name */}
            <span className="font-sans text-xs sm:text-sm font-semibold text-neutral-800 group-hover:text-brand-green transition-colors duration-200 line-clamp-2 max-w-full px-1">
              {category.name}
            </span>
          </Link>
        ))}
      </div>

    </section>
  );
};
export default CategoriesSection;
