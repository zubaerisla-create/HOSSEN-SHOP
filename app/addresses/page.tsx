"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '../components/layout/Header';
import Footer from '../components/home/Footer';
import { useAuth, Address } from '../lib/AuthContext';

export default function AddressesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromCheckout = searchParams.get('from') === 'checkout';

  const { isLoggedIn, addresses, addAddress, deleteAddress, updateAddress, setDefaultAddress } = useAuth();
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  // Form Fields State
  const [label, setLabel] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  // Auth Redirect Guard
  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login?redirect=/addresses');
    }
  }, [isLoggedIn, router]);

  const handleOpenAdd = () => {
    setEditingAddressId(null);
    setLabel('');
    setStreet('');
    setCity('');
    setState('');
    setZip('');
    setIsDefault(addresses.length === 0);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (addr: Address) => {
    setEditingAddressId(addr.id);
    setLabel(addr.label);
    setStreet(addr.street);
    setCity(addr.city);
    setState(addr.state);
    setZip(addr.zip);
    setIsDefault(addr.isDefault);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label || !street || !city || !state || !zip) return;

    const addressData = {
      label,
      street,
      city,
      state,
      zip,
      isDefault
    };

    if (editingAddressId) {
      updateAddress(editingAddressId, addressData);
    } else {
      addAddress(addressData);
    }

    setIsModalOpen(false);
    
    // Auto redirect back if came from checkout
    if (fromCheckout) {
      router.push('/checkout');
    }
  };

  if (!isLoggedIn) {
    return <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center font-sans text-neutral-500">Checking authentication...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5]">
      <Header />

      <main className="flex-grow py-10 px-4 sm:px-8 lg:px-16 flex flex-col gap-6 max-w-7xl mx-auto w-full font-sans">
        
        {/* Top Navigation Row */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1 items-start">
            {fromCheckout && (
              <button 
                onClick={() => router.push('/checkout')}
                className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-700 transition-colors font-semibold mb-1 cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                Back to Checkout
              </button>
            )}
            <h1 className="font-serif text-3xl font-bold text-neutral-900 tracking-tight">
              My Addresses
            </h1>
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 bg-[#0F2C1F] hover:bg-[#091a12] text-white py-2.5 px-5 rounded-full font-bold text-sm shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Address
          </button>
        </div>

        {/* Address Cards List */}
        <div className="flex flex-col gap-4 max-w-4xl">
          {addresses.length === 0 ? (
            <div className="bg-white border border-neutral-100 rounded-3xl p-12 text-center text-neutral-400 flex flex-col items-center gap-4">
              <svg className="w-12 h-12 text-neutral-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              <span className="font-bold text-sm">No saved addresses found</span>
            </div>
          ) : (
            addresses.map((addr) => (
              <div 
                key={addr.id}
                className="bg-white border border-neutral-100 rounded-2xl p-5 flex items-center justify-between gap-6 shadow-sm hover:shadow-md transition-all text-left"
              >
                <div className="flex items-start gap-4">
                  {/* Pin Circle Icon */}
                  <div className="w-10 h-10 rounded-full bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-500 shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-sans font-bold text-sm text-neutral-800">{addr.label}</span>
                      {addr.isDefault ? (
                        <span className="text-[10px] bg-[#0F2C1F] text-white font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                          Default
                        </span>
                      ) : (
                        <button 
                          onClick={() => setDefaultAddress(addr.id)}
                          className="text-[10px] text-neutral-400 hover:text-neutral-600 font-bold hover:underline cursor-pointer"
                        >
                          Make Default
                        </button>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-neutral-500 font-sans leading-relaxed">
                      {addr.street}, {addr.city}, {addr.state} {addr.zip}
                    </p>
                  </div>
                </div>

                {/* Edit & Delete Action Triggers */}
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleOpenEdit(addr)}
                    className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50 rounded-lg transition-all cursor-pointer"
                    title="Edit Address"
                  >
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => deleteAddress(addr.id)}
                    className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                    title="Delete Address"
                  >
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </main>

      {/* MODAL POPUP: ADD/EDIT ADDRESS */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Overlay */}
          <div 
            onClick={() => setIsModalOpen(false)}
            className="absolute inset-0 bg-black/45 backdrop-blur-[1.5px]"
          />

          {/* Form Dialog Card */}
          <div className="relative z-10 w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-neutral-100 flex flex-col gap-6 animate-in fade-in zoom-in duration-200">
            
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-neutral-800">
                {editingAddressId ? 'Edit Address' : 'Add New Address'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Input fields form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left font-sans text-sm">
              
              {/* Label */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-neutral-600">
                  Label
                </label>
                <input
                  type="text"
                  required
                  placeholder="Home, Work, etc."
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-brand-green/45 focus:border-brand-green/45 transition-all bg-white"
                />
              </div>

              {/* Street Address */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-neutral-600">
                  Street Address
                </label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-brand-green/45 focus:border-brand-green/45 transition-all bg-white"
                />
              </div>

              {/* City & State (Two column grid) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-neutral-600">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-brand-green/45 focus:border-brand-green/45 transition-all bg-white"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-neutral-600">
                    State
                  </label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-brand-green/45 focus:border-brand-green/45 transition-all bg-white"
                  />
                </div>
              </div>

              {/* ZIP Code & Default Checkbox */}
              <div className="flex items-end justify-between gap-4">
                <div className="flex flex-col gap-1.5 w-1/2">
                  <label className="text-xs font-semibold text-neutral-600">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    required
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-brand-green/45 focus:border-brand-green/45 transition-all bg-white"
                  />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="checkbox"
                    id="set-as-default"
                    checked={isDefault}
                    onChange={(e) => setIsDefault(e.target.checked)}
                    className="w-4 h-4 text-brand-green border-neutral-300 focus:ring-brand-green accent-[#0F2C1F]"
                  />
                  <label htmlFor="set-as-default" className="text-xs font-semibold text-neutral-600 cursor-pointer select-none">
                    Set as default
                  </label>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="mt-2 w-full bg-[#0F2C1F] hover:bg-[#091a12] text-white py-3 px-6 rounded-xl font-bold tracking-wide shadow-md active:scale-95 transition-all cursor-pointer text-center"
              >
                {editingAddressId ? 'Update Address' : 'Save Address'}
              </button>

            </form>

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
