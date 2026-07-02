"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '../AdminContext';
import { api } from '../../lib/api';

export default function AddProductPage() {
  const router = useRouter();
  const { addProduct, categoriesList } = useAdmin();

  // Form states for Product
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodOriginalPrice, setProdOriginalPrice] = useState('');
  const [prodUnit, setProdUnit] = useState('');
  const [prodStock, setProdStock] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodOrganic, setProdOrganic] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Set default category name when categories list loads
  useEffect(() => {
    if (categoriesList.length > 0 && !prodCategory) {
      setProdCategory(categoriesList[0].name);
    }
  }, [categoriesList, prodCategory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodPrice || !prodUnit || !prodStock) return;

    const priceNum = parseFloat(prodPrice);
    const stockNum = parseInt(prodStock);
    const originalPriceNum = prodOriginalPrice ? parseFloat(prodOriginalPrice) : undefined;
    const discount = originalPriceNum && originalPriceNum > priceNum
      ? Math.round(((originalPriceNum - priceNum) / originalPriceNum) * 100)
      : undefined;

    addProduct({
      name: prodName,
      category: prodCategory || categoriesList[0]?.name || 'Fruits & Vegetables',
      price: priceNum,
      originalPrice: originalPriceNum,
      unit: prodUnit,
      stock: stockNum,
      image: prodImage || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&auto=format&fit=crop&q=80',
      description: prodDesc || undefined,
      organic: prodOrganic,
      rating: 4.5,
      ratingCount: 1,
      discount
    });

    router.push('/admin/products');
  };

  return (
    <div className="bg-white border border-neutral-100 rounded-3xl shadow-sm flex flex-col">

      {/* Header */}
      <div className="flex items-center gap-4 p-6 border-b border-neutral-100">
        <button
          onClick={() => router.push('/admin/products')}
          className="p-2 hover:bg-neutral-50 rounded-xl transition-colors border border-neutral-100 cursor-pointer text-neutral-500 hover:text-neutral-800"
        >
          <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <h2 className="font-serif text-xl font-bold text-neutral-800">
          New Product
        </h2>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6 text-sm font-sans">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Product Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-neutral-600">Name</label>
            <input
              type="text"
              required
              value={prodName}
              onChange={(e) => setProdName(e.target.value)}
              placeholder="Cheese 200g"
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-brand-green/45 transition-all"
            />
          </div>

          {/* Category Dropdown */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-neutral-600">Category</label>
            <select
              value={prodCategory}
              onChange={(e) => setProdCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-brand-green/45 transition-all bg-white"
            >
              {categoriesList.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-neutral-600">Price ($)</label>
            <input
              type="number"
              step="0.01"
              required
              value={prodPrice}
              onChange={(e) => setProdPrice(e.target.value)}
              placeholder="130.00"
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-brand-green/45 transition-all"
            />
          </div>

          {/* Original Price */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-neutral-600">Original Price ($) - Optional</label>
            <input
              type="number"
              step="0.01"
              value={prodOriginalPrice}
              onChange={(e) => setProdOriginalPrice(e.target.value)}
              placeholder="140.00"
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-brand-green/45 transition-all"
            />
          </div>

          {/* Unit */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-neutral-600">Unit</label>
            <input
              type="text"
              required
              value={prodUnit}
              onChange={(e) => setProdUnit(e.target.value)}
              placeholder="e.g., kg, piece, liter"
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-brand-green/45 transition-all"
            />
          </div>

          {/* Stock */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-neutral-600">Stock</label>
            <input
              type="number"
              required
              value={prodStock}
              onChange={(e) => setProdStock(e.target.value)}
              placeholder="79"
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-brand-green/45 transition-all"
            />
          </div>

        </div>

        {/* Product Image URL Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-neutral-600">
            {isUploading ? 'Uploading Product Image...' : 'Product Image URL'}
          </label>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="https://images.unsplash.com/photo-..."
              value={prodImage}
              onChange={(e) => setProdImage(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-brand-green/45 transition-all"
              disabled={isUploading}
            />
            <div className="flex items-center gap-2 border border-[#FF5C00] rounded-xl px-4 py-2.5 shrink-0 bg-white opacity-90 hover:opacity-100 transition-all">
              <input
                type="file"
                id="image-file"
                className="hidden"
                disabled={isUploading}
                onChange={async (e) => {
                  if (e.target.files?.[0]) {
                    setIsUploading(true);
                    try {
                      const res = await api.uploadImage(e.target.files[0]);
                      setProdImage(res.url);
                    } catch (err: any) {
                      alert(err.message || 'Image upload failed. Please make sure the backend is running.');
                    } finally {
                      setIsUploading(false);
                    }
                  }
                }}
              />
              <label htmlFor="image-file" className={`cursor-pointer font-bold text-xs text-[#FF5C00] uppercase select-none ${isUploading ? 'pointer-events-none opacity-50' : ''}`}>
                {isUploading ? 'Uploading...' : 'Choose File'}
              </label>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-neutral-600">Description</label>
          <textarea
            rows={4}
            value={prodDesc}
            onChange={(e) => setProdDesc(e.target.value)}
            placeholder="Describe your organic product details..."
            className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-brand-green/45 transition-all"
          />
        </div>

        {/* Organic Checkbox */}
        <div className="flex items-center gap-2 py-2">
          <input
            type="checkbox"
            id="prod-organic"
            checked={prodOrganic}
            onChange={(e) => setProdOrganic(e.target.checked)}
            className="w-4 h-4 text-brand-green border-neutral-300 focus:ring-brand-green accent-[#0F2C1F]"
          />
          <label htmlFor="prod-organic" className="text-xs font-bold text-neutral-600 cursor-pointer select-none">
            Organic
          </label>
        </div>

        {/* Save CTA */}
        <button
          type="submit"
          className="self-end bg-[#FF5C00] hover:bg-brand-orange-hover text-white py-3 px-8 rounded-xl font-bold tracking-wide shadow-md transition-all active:scale-95 cursor-pointer text-center"
        >
          Save Product
        </button>

      </form>
    </div>
  );
}
