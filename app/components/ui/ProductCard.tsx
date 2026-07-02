"use client";

import React from 'react';
import Link from 'next/link';
import { Product } from '../../lib/types';
import { useCart } from '../../lib/CartContext';

interface ProductCardProps {
  product: Product;
  showFlashBadge?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, showFlashBadge }) => {
  const { id, name, rating, ratingCount, price, unit, originalPrice, discount, image } = product;
  const { addToCart } = useCart();

  return (
    <div className="group relative bg-white rounded-2xl p-4 flex flex-col justify-between border border-neutral-100 hover:shadow-md hover:border-neutral-200 transition-all duration-300">
      
      {/* Clickable Image & Name */}
      <Link href={`/products/${id}`} className="block focus:outline-none mb-1">
        {/* Product Image Container */}
        <div className="aspect-square w-full relative mb-3 flex items-center justify-center overflow-hidden rounded-xl bg-neutral-50 p-4">
          {/* Flash Deal Badge or Discount Badge */}
          {showFlashBadge ? (
            <span className="absolute top-2.5 left-2.5 z-10 bg-gradient-to-r from-[#FF5C00] to-[#FF8C00] text-white text-[10px] font-bold px-2.5 py-1 rounded-lg tracking-wider flex items-center gap-1 shadow-sm shadow-orange-200">
              ⚡ Flash Deal
            </span>
          ) : discount ? (
            <span className="absolute top-2.5 left-2.5 z-10 bg-[#FF5C00] text-white text-[10px] font-bold px-2 py-0.5 rounded-md tracking-wider">
              {discount}% OFF
            </span>
          ) : null}
          <img
            src={image}
            alt={name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>

        {/* Name */}
        <h3 className="font-sans font-semibold text-neutral-800 text-sm md:text-base line-clamp-1 mb-1 group-hover:text-brand-green transition-colors duration-150">
          {name}
        </h3>
      </Link>

      {/* Info Section */}
      <div className="flex flex-col flex-grow justify-end">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <svg
            className="w-3.5 h-3.5 fill-[#FFB800] text-[#FFB800]"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-xs font-bold text-neutral-800">{rating}</span>
          <span className="text-xs text-neutral-400">({ratingCount})</span>
        </div>

        {/* Price & Add to Cart Section */}
        <div className="flex items-end justify-between mt-auto pt-1">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="text-base md:text-lg font-bold text-neutral-900">${price.toFixed(1)}</span>
              <span className="text-xs text-neutral-400">/{unit}</span>
            </div>
            {originalPrice && (
              <span className="text-xs text-neutral-400 line-through">${originalPrice.toFixed(1)}</span>
            )}
          </div>

          {/* Add Button */}
          <button
            onClick={() => addToCart(product, 1)}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-orange text-white hover:bg-brand-orange-hover hover:scale-105 transition-all duration-200 active:scale-95 shadow-sm shadow-brand-orange/20 cursor-pointer"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
export default ProductCard;
