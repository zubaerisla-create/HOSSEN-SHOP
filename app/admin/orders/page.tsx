"use client";

import React, { useState } from 'react';
import { useAdmin } from '../AdminContext';

export default function AdminOrdersPage() {
  const { ordersList, partnersList, updateOrderStatus, assignPartner } = useAdmin();
  
  // Selection Rider Modal state
  const [isSelectRiderModalOpen, setIsSelectRiderModalOpen] = useState(false);
  const [riderModalOrderId, setRiderModalOrderId] = useState<string | null>(null);

  const handleStatusChange = (orderId: string, newStatus: string) => {
    if (newStatus === 'Assigned') {
      setRiderModalOrderId(orderId);
      setIsSelectRiderModalOpen(true);
    } else {
      updateOrderStatus(orderId, newStatus as any);
    }
  };

  const handlePartnerClick = (orderId: string) => {
    setRiderModalOrderId(orderId);
    setIsSelectRiderModalOpen(true);
  };

  const handleRiderSelected = (partnerName: string) => {
    if (riderModalOrderId) {
      assignPartner(riderModalOrderId, partnerName);
    }
    setIsSelectRiderModalOpen(false);
    setRiderModalOrderId(null);
  };

  return (
    <div className="bg-white border border-neutral-100 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-6 font-sans">
      <h2 className="font-serif text-2xl font-bold text-neutral-800">Orders</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="border-b border-neutral-100 text-[11px] font-bold text-neutral-400 tracking-wider uppercase">
              <th className="pb-4 pr-4 font-bold">ORDER DETAILS</th>
              <th className="pb-4 px-4 font-bold">CUSTOMER</th>
              <th className="pb-4 px-4 font-bold">TOTAL</th>
              <th className="pb-4 px-4 font-bold">DELIVERY PARTNER</th>
              <th className="pb-4 pl-4 font-bold">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {ordersList.length === 0 && (
              <tr>
                <td colSpan={5} className="py-16 text-center text-neutral-400 font-medium text-sm">
                  <div className="flex flex-col items-center gap-3">
                    <svg className="w-10 h-10 text-neutral-200" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                    </svg>
                    <span>No orders yet. Once customers place orders, they'll appear here.</span>
                  </div>
                </td>
              </tr>
            )}
            {ordersList.map((order) => {
              // Status Badge Styles
              let statusClasses = '';
              if (order.status === 'Placed') {
                statusClasses = 'bg-[#EFF6FF] text-[#2563EB] border-[#DBEAFE]';
              } else if (order.status === 'Assigned') {
                statusClasses = 'bg-[#EEF2FC] text-[#4F46E5] border-[#E0E4FC]';
              } else if (order.status === 'Confirmed') {
                statusClasses = 'bg-[#FFF7ED] text-[#EA580C] border-[#FFEDD5]';
              } else if (order.status === 'Out for Delivery') {
                statusClasses = 'bg-[#FAF5FF] text-[#9333EA] border-[#F3E8FF]';
              } else if (order.status === 'Cancelled') {
                statusClasses = 'bg-[#FFF1F2] text-[#E11D48] border-[#FFE4E6]';
              } else {
                // Delivered
                statusClasses = 'bg-[#F0FDF4] text-[#16A34A] border-[#DCFCE7]';
              }

              return (
                <tr key={order.orderId} className="border-b border-neutral-50/70 hover:bg-neutral-50/10 transition-all">
                  
                  {/* ORDER DETAILS */}
                  <td className="py-5 pr-4 flex flex-col gap-0.5 justify-center">
                    <span className="font-bold text-neutral-900 text-sm">#{order.orderId.slice(0, 8).toUpperCase()}</span>
                    <span className="text-[11px] text-neutral-400 font-semibold">{order.date}, {order.time}</span>
                    <span className="text-[11px] text-neutral-500 font-semibold">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                  </td>

                  {/* CUSTOMER */}
                  <td className="py-5 px-4">
                    <div className="flex flex-col justify-center">
                      <span className="font-bold text-neutral-800 text-sm leading-tight">{order.customerName}</span>
                      <span className="text-xs text-neutral-400 font-semibold mt-0.5">{order.customerEmail}</span>
                    </div>
                  </td>

                  {/* TOTAL */}
                  <td className="py-5 px-4 font-bold text-neutral-800 text-sm">
                    ${order.total.toFixed(2)}
                  </td>

                  {/* DELIVERY PARTNER */}
                  <td className="py-5 px-4 relative">
                    <button
                      onClick={() => handlePartnerClick(order.orderId)}
                      className={`px-4 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer shadow-sm ${
                        order.deliveryPartner 
                          ? 'bg-[#EEF2FC] text-[#4F46E5] border-[#DCDDFD] hover:bg-[#E2E4FC]'
                          : 'bg-neutral-50 text-neutral-400 border-neutral-200 hover:bg-neutral-100'
                      }`}
                    >
                      <svg className="w-3.5 h-3.5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124l-.847-9.967a2.25 2.25 0 00-2.208-2.059L16.5 4.5h-3m4.5 14.25v-3h-3.75" />
                      </svg>
                      {order.deliveryPartner ? order.deliveryPartner : 'Assign'}
                    </button>
                  </td>

                  {/* STATUS */}
                  <td className="py-5 pl-4">
                    <div className="relative inline-block w-36">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                        className={`w-full appearance-none font-bold text-xs pl-4 pr-10 py-2 rounded-xl border focus:outline-none cursor-pointer transition-all ${statusClasses}`}
                      >
                        <option value="Placed">Placed</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Assigned">Assigned</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      {/* Chevron Down Arrow Icon inside select badge */}
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-current">
                        <svg className="w-3.5 h-3.5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </div>
                    </div>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MODAL: SELECT RIDER / PARTNER */}
      {isSelectRiderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            onClick={() => { setIsSelectRiderModalOpen(false); setRiderModalOrderId(null); }}
            className="absolute inset-0 bg-black/45 backdrop-blur-[1.5px]"
          />

          {/* Dialog content */}
          <div className="relative z-10 w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-neutral-100 flex flex-col gap-5">
            <div className="flex justify-between items-center border-b border-neutral-50 pb-3">
              <h3 className="font-serif text-lg font-bold text-neutral-800">Select Delivery Rider</h3>
              <button
                onClick={() => { setIsSelectRiderModalOpen(false); setRiderModalOrderId(null); }}
                className="p-1 hover:bg-neutral-50 rounded-lg text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
              {partnersList.filter(p => p.active).map((partner) => (
                <button
                  key={partner.id}
                  onClick={() => handleRiderSelected(partner.name)}
                  className="w-full flex items-center justify-between p-3.5 hover:bg-[#EEF0FC] rounded-2xl border border-neutral-100 hover:border-[#DCDDFD] transition-all text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#0F2C1F] group-hover:bg-[#4F46E5] text-white flex items-center justify-center font-bold text-sm transition-colors">
                      {partner.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-neutral-800 group-hover:text-[#4F46E5] text-sm transition-colors">{partner.name}</span>
                      <span className="text-[11px] text-neutral-400 font-semibold">{partner.vehicle}</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#FF5C00]">{partner.phone}</span>
                </button>
              ))}
              {partnersList.filter(p => p.active).length === 0 && (
                <div className="text-center py-4 text-xs font-bold text-neutral-400">
                  No active delivery riders available. Add one in the Delivery Partners tab!
                </div>
              )}
            </div>

            {riderModalOrderId && ordersList.find(o => o.orderId === riderModalOrderId)?.deliveryPartner && (
              <button
                onClick={() => handleRiderSelected('')}
                className="w-full py-3 bg-red-50 hover:bg-red-100/70 text-red-500 rounded-2xl font-bold text-xs transition-colors cursor-pointer text-center"
              >
                Remove Rider Assignment
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
