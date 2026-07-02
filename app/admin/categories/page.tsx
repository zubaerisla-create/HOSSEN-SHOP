"use client";

import React, { useState } from 'react';
import { useAdmin } from '../AdminContext';
import { Image as ImageIcon, Link as LinkIcon, Upload, Trash2, X, AlertTriangle } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  image: string;
}

export default function AdminCategoriesPage() {
  const { categoriesList, addCategory, deleteCategory } = useAdmin();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  
  // Image selection modes
  const [imageMode, setImageMode] = useState<'upload' | 'url' | 'presets'>('upload');
  const [newCatImage, setNewCatImage] = useState('');
  
  // Delete confirmation state
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  // Unsplash preset food/beverage collection placeholders for ease of admin addition
  const presetImages = [
    'https://images.unsplash.com/photo-1610397613090-a0206a3fcc40?w=120&auto=format&fit=crop&q=80', // fruits/veg
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=120&auto=format&fit=crop&q=80', // care
    'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=120&auto=format&fit=crop&q=80', // pantry
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=120&auto=format&fit=crop&q=80', // bakery
    'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=120&auto=format&fit=crop&q=80', // beverages
    'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=120&auto=format&fit=crop&q=80', // meat
    'https://images.unsplash.com/photo-1599490659213-e2b9527ec087?w=120&auto=format&fit=crop&q=80', // snacks
    'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=120&auto=format&fit=crop&q=80', // frozen
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCatImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    // Use selected preset or first preset as fallback
    const finalImage = newCatImage || presetImages[0];

    addCategory({
      name: newCatName.trim(),
      image: finalImage
    });

    setNewCatName('');
    setNewCatImage('');
    setIsAddModalOpen(false);
    setImageMode('upload');
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete.id);
      setCategoryToDelete(null);
    }
  };

  return (
    <div className="bg-white border border-neutral-100 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-6 font-sans text-left">
      
      {/* Header section with Action Button */}
      <div className="flex justify-between items-center pb-4 border-b border-neutral-50">
        <div className="flex flex-col gap-0.5">
          <h2 className="font-serif text-2xl font-bold text-neutral-800">Categories</h2>
          <p className="text-xs text-neutral-400 font-semibold">Manage product categorization</p>
        </div>
        <button
          onClick={() => {
            setNewCatImage('');
            setImageMode('upload');
            setIsAddModalOpen(true);
          }}
          className="px-5 py-2.5 bg-[#0F2C1F] hover:bg-[#1c4734] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
        >
          <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Category
        </button>
      </div>

      {/* Grid List of Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {categoriesList.map((category) => (
          <div 
            key={category.id} 
            className="border border-neutral-100 rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-all group relative"
          >
            {/* Image Thumbnail Frame */}
            <div className="w-16 h-16 rounded-xl bg-[#FCF6ED] border border-[#F3EAD8]/40 flex items-center justify-center p-2.5 shrink-0 overflow-hidden">
              <img
                src={category.image}
                alt={category.name}
                className="max-h-full max-w-full object-contain filter multiply mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Content Details */}
            <div className="flex flex-col gap-1.5 flex-grow min-w-0">
              <span className="font-bold text-sm text-neutral-800 line-clamp-1">{category.name}</span>
              <button
                onClick={() => setCategoryToDelete(category)}
                className="text-[10px] font-bold text-red-500 hover:text-red-700 transition-colors flex items-center gap-1 cursor-pointer self-start"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          </div>
        ))}

        {categoriesList.length === 0 && (
          <div className="col-span-full py-16 text-center text-neutral-400 font-bold text-sm flex flex-col items-center gap-3">
            <svg className="w-12 h-12 text-neutral-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
            No categories available. Click Add Category to get started!
          </div>
        )}
      </div>

      {/* MODAL: ADD CATEGORY */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          {/* Form Modal Box */}
          <form 
            onSubmit={handleCreateCategory}
            className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-neutral-100 flex flex-col gap-5"
          >
            <div className="flex justify-between items-center border-b border-neutral-50 pb-3">
              <h3 className="font-serif text-lg font-bold text-neutral-800">Add New Category</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 hover:bg-neutral-50 rounded-lg text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Input Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Category Name</label>
              <input
                type="text"
                required
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="e.g. Fruits & Vegetables"
                className="w-full px-4 py-3 rounded-2xl border border-neutral-100 focus:outline-none focus:border-[#0F2C1F] text-sm text-neutral-800 font-medium bg-neutral-50/30"
              />
            </div>

            {/* Image Selection Tabs */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Image Source</label>
              
              <div className="flex bg-neutral-50 rounded-xl p-1 text-xs font-bold text-neutral-500">
                <button
                  type="button"
                  onClick={() => { setImageMode('upload'); setNewCatImage(''); }}
                  className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    imageMode === 'upload' ? 'bg-white text-[#0F2C1F] shadow-sm' : 'hover:text-neutral-850'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" /> Upload File
                </button>
                <button
                  type="button"
                  onClick={() => { setImageMode('url'); setNewCatImage(''); }}
                  className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    imageMode === 'url' ? 'bg-white text-[#0F2C1F] shadow-sm' : 'hover:text-neutral-850'
                  }`}
                >
                  <LinkIcon className="w-3.5 h-3.5" /> Image Link
                </button>
                <button
                  type="button"
                  onClick={() => { setImageMode('presets'); setNewCatImage(presetImages[0]); }}
                  className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    imageMode === 'presets' ? 'bg-white text-[#0F2C1F] shadow-sm' : 'hover:text-neutral-850'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" /> Presets
                </button>
              </div>

              {/* Dynamic Inputs based on mode */}
              <div className="mt-1">
                {imageMode === 'upload' && (
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-200 rounded-2xl p-4 bg-neutral-50/50 hover:bg-neutral-50 transition-all relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="w-8 h-8 text-neutral-300 mb-2" />
                    <span className="text-xs font-bold text-neutral-600">Click to upload file</span>
                    <span className="text-[10px] text-neutral-400 mt-1">PNG, JPG or SVG</span>
                  </div>
                )}

                {imageMode === 'url' && (
                  <input
                    type="url"
                    value={newCatImage}
                    onChange={(e) => setNewCatImage(e.target.value)}
                    placeholder="Enter absolute image URL (e.g. https://...)"
                    className="w-full px-4 py-3 rounded-2xl border border-neutral-100 focus:outline-none focus:border-[#0F2C1F] text-sm text-neutral-800 font-medium bg-neutral-50/30"
                  />
                )}

                {imageMode === 'presets' && (
                  <div className="grid grid-cols-4 gap-2.5">
                    {presetImages.map((imgUrl, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setNewCatImage(imgUrl)}
                        className={`w-full aspect-square rounded-2xl bg-[#FCF6ED] border overflow-hidden p-1 flex items-center justify-center transition-all ${
                          newCatImage === imgUrl ? 'border-[#0F2C1F] ring-2 ring-[#0F2C1F]/15' : 'border-neutral-100 hover:border-neutral-300'
                        }`}
                      >
                        <img src={imgUrl} alt="preset" className="max-h-full max-w-full object-contain mix-blend-multiply" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Image Preview */}
              {newCatImage && (
                <div className="mt-3 flex items-center gap-3 border border-neutral-100 rounded-2xl p-2.5 bg-neutral-50/20">
                  <div className="w-12 h-12 bg-white rounded-xl border border-neutral-200/60 overflow-hidden flex items-center justify-center p-1.5 shrink-0">
                    <img src={newCatImage} alt="Preview" className="max-h-full max-w-full object-contain mix-blend-multiply" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide">Selected Thumbnail</span>
                    <span className="text-xs text-neutral-600 truncate max-w-[200px]">{newCatImage.startsWith('data:') ? 'Custom Uploaded File' : newCatImage}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Save Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-1/2 py-3 bg-neutral-50 hover:bg-neutral-100 text-neutral-500 rounded-2xl font-bold text-xs transition-colors cursor-pointer text-center"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-1/2 py-3 bg-[#0F2C1F] hover:bg-[#1c4734] text-white rounded-2xl font-bold text-xs transition-colors cursor-pointer text-center shadow-sm"
              >
                Create
              </button>
            </div>

          </form>
        </div>
      )}

      {/* CONFIRMATION DIALOG MODAL FOR DELETE */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[1px]">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-neutral-100 flex flex-col gap-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-neutral-800">Delete Category?</h3>
            </div>
            
            <p className="text-xs text-neutral-500 leading-relaxed font-medium">
              Are you sure you want to delete the category <span className="font-bold text-neutral-800">"{categoryToDelete.name}"</span>? Any product currently in this category might need to be reassigned.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCategoryToDelete(null)}
                className="w-1/2 py-3 bg-neutral-50 hover:bg-neutral-100 text-neutral-500 rounded-2xl font-bold text-xs transition-colors cursor-pointer text-center"
              >
                No, Keep It
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="w-1/2 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold text-xs transition-colors cursor-pointer text-center shadow-sm"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
