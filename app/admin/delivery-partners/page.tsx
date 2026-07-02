"use client";

import React, { useState } from 'react';
import { useAdmin } from '../AdminContext';

export default function AdminPartnersPage() {
  const { partnersList, addPartner, togglePartner } = useAdmin();

  // Form states for Partner Addition Modal
  const [isAddPartnerOpen, setIsAddPartnerOpen] = useState(false);
  const [partnerName, setPartnerName] = useState('');
  const [partnerVehicle, setPartnerVehicle] = useState('Bike');
  const [partnerEmail, setPartnerEmail] = useState('');
  const [partnerPhone, setPartnerPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerName || !partnerEmail || !partnerPhone) return;

    addPartner({
      name: partnerName,
      vehicle: partnerVehicle,
      email: partnerEmail,
      phone: partnerPhone
    });

    // Reset
    setPartnerName('');
    setPartnerEmail('');
    setPartnerPhone('');
    setIsAddPartnerOpen(false);
  };

  return (
    <div className="flex flex-col gap-6">
      
      <div className="flex justify-between items-center">
        <h2 className="font-serif text-2xl font-bold text-neutral-800">Delivery Partners</h2>
        <button
          onClick={() => setIsAddPartnerOpen(true)}
          className="bg-[#0F2C1F] hover:bg-[#091a12] text-white py-2 px-5 rounded-full font-bold text-xs sm:text-sm tracking-wide transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
        >
          <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Partner
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {partnersList.map((partner) => (
          <div 
            key={partner.id}
            className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm flex flex-col gap-4 relative"
          >
            {/* Top row */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#0F2C1F] text-white flex items-center justify-center font-bold text-lg select-none">
                {partner.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-neutral-800 text-base">{partner.name}</span>
                <span className="text-xs text-neutral-400 font-semibold">{partner.vehicle}</span>
              </div>
              
              {/* Status Badge */}
              <span className={`ml-auto font-bold text-[10px] px-2.5 py-0.5 rounded-full border ${
                partner.active
                  ? 'bg-green-50 text-green-600 border-green-100'
                  : 'bg-red-50 text-red-500 border-red-100'
              }`}>
                {partner.active ? 'Active' : 'Inactive'}
              </span>
            </div>

            {/* Info details */}
            <div className="flex flex-col gap-2 border-t border-neutral-50 pt-3 text-xs text-neutral-500 font-semibold">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                {partner.email}
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.502-5.18-3.856-6.681-6.681l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                {partner.phone}
              </div>
            </div>

            {/* Toggle Button */}
            <button
              onClick={() => togglePartner(partner.id)}
              className={`mt-2 py-2.5 rounded-xl font-bold text-xs transition-all active:scale-95 cursor-pointer text-center ${
                partner.active
                  ? 'bg-red-50 hover:bg-red-100/70 text-red-500'
                  : 'bg-green-50 hover:bg-green-100/70 text-green-600'
              }`}
            >
              {partner.active ? 'Deactivate' : 'Activate'}
            </button>

          </div>
        ))}
      </div>

      {/* MODAL: ADD PARTNER */}
      {isAddPartnerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            onClick={() => setIsAddPartnerOpen(false)}
            className="absolute inset-0 bg-black/45 backdrop-blur-[1.5px]"
          />

          {/* Form dialog */}
          <div className="relative z-10 w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-neutral-100 flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h3 className="font-serif text-lg font-bold text-neutral-800">Add Delivery Partner</h3>
              <button
                onClick={() => setIsAddPartnerOpen(false)}
                className="p-1 hover:bg-neutral-50 rounded-lg text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs sm:text-sm font-sans text-left">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-neutral-600">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Avinash"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-brand-green/45 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-neutral-600">Vehicle Type</label>
                <select
                  value={partnerVehicle}
                  onChange={(e) => setPartnerVehicle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-brand-green/45 transition-all bg-white"
                >
                  <option value="Bike">Bike</option>
                  <option value="Car">Car</option>
                  <option value="Cycle">Cycle</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-neutral-600">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="partner@hossenshop.com"
                  value={partnerEmail}
                  onChange={(e) => setPartnerEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-brand-green/45 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-neutral-600">Phone Number</label>
                <input
                  type="text"
                  required
                  placeholder="01XXXXXXXXX"
                  value={partnerPhone}
                  onChange={(e) => setPartnerPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-brand-green/45 transition-all"
                />
              </div>

              <button
                type="submit"
                className="mt-2 w-full bg-[#0F2C1F] hover:bg-[#091a12] text-white py-3 px-6 rounded-xl font-bold tracking-wide shadow-md transition-all active:scale-95 cursor-pointer text-center"
              >
                Save Partner
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
