"use client";

import React from 'react';
import Link from 'next/link';
import { useAdmin } from '../AdminContext';

export default function AdminProductsList() {
  const { productsList, deleteProduct } = useAdmin();

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct(id);
    }
  };

  return (
    <div className="bg-white border border-neutral-100 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-6">

      <div className="flex justify-between items-center">
        <h2 className="font-serif text-2xl font-bold text-neutral-800">Products</h2>
        <Link
          href="/admin/add-product"
          className="bg-[#0F2C1F] hover:bg-[#091a12] text-white py-2 px-5 rounded-full font-bold text-xs sm:text-sm tracking-wide transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
        >
          <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Product
        </Link>
      </div>

      {/* List Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm font-sans text-left border-collapse">
          <thead>
            <tr className="border-b border-neutral-100 text-xs font-bold text-neutral-400 tracking-wider uppercase">
              <th className="pb-3 pr-4 font-bold">Product</th>
              <th className="pb-3 px-4 font-bold">Price</th>
              <th className="pb-3 px-4 font-bold">Stock</th>
              <th className="pb-3 pl-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {productsList.map((product) => (
              <tr key={product.id} className="border-b border-neutral-50/50 hover:bg-neutral-50/10 transition-all">
                <td className="py-4 pr-4 flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#FAF8F5] border border-neutral-100 rounded-xl p-1.5 overflow-hidden shrink-0 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain mix-blend-multiply"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23bbb'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4'/%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-neutral-800 leading-tight">{product.name}</span>
                    <span className="text-[11px] text-neutral-400 font-semibold">{product.category}</span>
                  </div>
                </td>
                <td className="py-4 px-4 font-extrabold text-neutral-800">${product.price.toFixed(2)}</td>
                <td className="py-4 px-4">
                  {product.stock === 0 ? (
                    <span className="bg-red-50 text-red-500 font-bold text-[10px] sm:text-xs px-2.5 py-1 rounded-full border border-red-100/50">
                      Out of stock
                    </span>
                  ) : (
                    <span className="bg-green-50 text-green-600 font-bold text-[10px] sm:text-xs px-2.5 py-1 rounded-full border border-green-100/50">
                      {product.stock} in stock
                    </span>
                  )}
                </td>
                <td className="py-4 pl-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/edit-product/${product.id}`}
                      className="p-1.5 hover:bg-neutral-50 rounded-lg text-neutral-500 hover:text-neutral-800 border border-neutral-200/60 cursor-pointer transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                      </svg>
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-1.5 hover:bg-red-50 rounded-lg text-neutral-400 hover:text-red-500 border border-neutral-200/60 cursor-pointer transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
