"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Zap, Search, Package, CheckCircle, XCircle, Tag } from 'lucide-react';
import { useAdmin } from '../AdminContext';

interface AdminProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  unit: string;
  stock: number;
  image: string;
  discount?: number;
  isFlashDeal?: boolean;
  flashLabel?: string;
  flashDiscount?: number;
}

export default function AdminFlashDealsPage() {
  const { productsList, updateProduct } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'active' | 'all'>('active');
  const [toastMsg, setToastMsg] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [editDiscount, setEditDiscount] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const toggleFlashDeal = async (id: string, enable: boolean) => {
    const p = productsList.find(x => x.id === id);
    if (!p) return;
    const updated = { 
      ...p, 
      isFlashDeal: enable,
      flashLabel: enable ? p.flashLabel : undefined,
      flashDiscount: enable ? p.flashDiscount : undefined
    };
    await updateProduct(updated);
    showToast(enable ? '⚡ Added to Flash Deals!' : 'Removed from Flash Deals');
  };

  const startEdit = (p: AdminProduct) => {
    setEditingId(p.id);
    setEditLabel(p.flashLabel || '');
    setEditDiscount(p.flashDiscount?.toString() || p.discount?.toString() || '');
  };

  const saveEdit = async (id: string) => {
    const p = productsList.find(x => x.id === id);
    if (!p) return;
    const updated = {
      ...p,
      flashLabel: editLabel.trim() || undefined,
      flashDiscount: editDiscount ? parseFloat(editDiscount) : undefined
    };
    await updateProduct(updated);
    setEditingId(null);
    showToast('Flash Deal settings saved!');
  };

  const cancelEdit = () => { setEditingId(null); };

  const filtered = useMemo(() => {
    let list = activeTab === 'active' ? productsList.filter(p => p.isFlashDeal) : productsList;
    if (searchQuery.trim()) {
      list = list.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category?.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return list;
  }, [productsList, activeTab, searchQuery]);

  const activeCount = productsList.filter(p => p.isFlashDeal).length;

  return (
    <div className="flex flex-col gap-6 font-sans">

      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F2C1F] text-white px-5 py-3 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 animate-[popup-bounce_0.35s_ease-out]">
          <CheckCircle className="w-4 h-4 text-green-400" />
          {toastMsg}
        </div>
      )}

      {/* Header */}
      <div className="bg-white border border-neutral-100 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-bold text-neutral-800 flex items-center gap-2">
              <Zap className="w-6 h-6 text-brand-orange fill-brand-orange" />
              Flash Deals Manager
            </h2>
            <p className="text-xs text-neutral-400 font-semibold mt-1">
              Control which products appear on the Flash Deals page with custom labels and discounts
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="bg-orange-50 border border-orange-100 rounded-2xl px-4 py-2.5 flex items-center gap-2">
              <Zap className="w-4 h-4 text-brand-orange fill-brand-orange" />
              <div>
                <p className="text-lg font-bold text-brand-orange leading-none">{activeCount}</p>
                <p className="text-[10px] text-neutral-500 font-semibold">Active Deals</p>
              </div>
            </div>
            <div className="bg-neutral-50 border border-neutral-100 rounded-2xl px-4 py-2.5 flex items-center gap-2">
              <Package className="w-4 h-4 text-neutral-400" />
              <div>
                <p className="text-lg font-bold text-neutral-700 leading-none">{productsList.length}</p>
                <p className="text-[10px] text-neutral-500 font-semibold">Total Products</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white border border-neutral-100 rounded-3xl p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">

        {/* Tabs */}
        <div className="flex bg-neutral-100 rounded-xl p-1 gap-1">
          {(['active', 'all'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-white shadow text-neutral-800'
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              {tab === 'active' ? `⚡ Active Deals (${activeCount})` : `All Products (${productsList.length})`}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search products…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#0F2C1F]/30 transition-all"
          />
        </div>
      </div>

      {/* Products List */}
      <div className="bg-white border border-neutral-100 rounded-3xl shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center">
              <Zap className="w-7 h-7 text-brand-orange" />
            </div>
            <p className="font-serif text-base font-bold text-neutral-700">
              {activeTab === 'active' ? 'No active Flash Deals' : 'No products found'}
            </p>
            <p className="text-xs text-neutral-400 text-center max-w-xs">
              {activeTab === 'active'
                ? 'Switch to "All Products" and toggle products to make them Flash Deals.'
                : 'Try a different search term.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-50">
            {filtered.map(product => (
              <div key={product.id} className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 transition-colors ${product.isFlashDeal ? 'bg-orange-50/30' : 'hover:bg-neutral-50/50'}`}>

                {/* Product Info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-14 h-14 bg-[#FAF8F5] border border-neutral-100 rounded-xl p-1.5 overflow-hidden shrink-0 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-neutral-800 text-sm truncate">{product.name}</p>
                      {product.isFlashDeal && (
                        <span className="inline-flex items-center gap-0.5 bg-gradient-to-r from-[#FF5C00] to-[#FF8C00] text-white text-[9px] font-bold px-2 py-0.5 rounded-md tracking-wider shrink-0">
                          <Zap className="w-2.5 h-2.5 fill-white" /> FLASH
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-400 font-semibold">{product.category}</p>
                    <p className="text-sm font-extrabold text-neutral-700 mt-0.5">${product.price.toFixed(2)}</p>
                  </div>
                </div>

                {/* Inline Edit for flash label / discount */}
                {editingId === product.id ? (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-1">
                    <div className="flex flex-col gap-1 flex-1">
                      <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1">
                        <Tag className="w-3 h-3" /> Custom Label
                      </label>
                      <input
                        type="text"
                        value={editLabel}
                        onChange={e => setEditLabel(e.target.value)}
                        placeholder="e.g. Hot Deal, Best Pick…"
                        className="px-3 py-2 rounded-xl border border-neutral-200 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-brand-orange/40 transition-all w-full"
                      />
                    </div>
                    <div className="flex flex-col gap-1 w-28">
                      <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Discount %</label>
                      <input
                        type="number"
                        value={editDiscount}
                        onChange={e => setEditDiscount(e.target.value)}
                        placeholder="e.g. 20"
                        min={0} max={100}
                        className="px-3 py-2 rounded-xl border border-neutral-200 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-brand-orange/40 transition-all"
                      />
                    </div>
                    <div className="flex gap-2 shrink-0 mt-3 sm:mt-4">
                      <button onClick={() => saveEdit(product.id)} className="px-4 py-2 bg-[#0F2C1F] text-white rounded-xl text-xs font-bold hover:bg-[#0a1f15] transition-all cursor-pointer active:scale-95">Save</button>
                      <button onClick={cancelEdit} className="px-3 py-2 bg-neutral-100 text-neutral-600 rounded-xl text-xs font-bold hover:bg-neutral-200 transition-all cursor-pointer">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 shrink-0">
                    {product.isFlashDeal && (
                      <button
                        onClick={() => startEdit(product)}
                        className="px-3 py-2 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-600 hover:bg-neutral-50 hover:text-neutral-800 transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Tag className="w-3 h-3" /> Edit Label
                      </button>
                    )}

                    {product.isFlashDeal ? (
                      <button
                        onClick={() => toggleFlashDeal(product.id, false)}
                        className="px-4 py-2 bg-red-50 border border-red-100 text-red-500 hover:bg-red-100 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Remove
                      </button>
                    ) : (
                      <button
                        onClick={() => toggleFlashDeal(product.id, true)}
                        className="px-4 py-2 bg-orange-50 border border-orange-100 text-brand-orange hover:bg-orange-100 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                      >
                        <Zap className="w-3.5 h-3.5 fill-brand-orange" /> Add Deal
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
