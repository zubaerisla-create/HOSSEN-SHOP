"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/layout/Header';
import Footer from '../components/home/Footer';
import { useAuth } from '../lib/AuthContext';

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface PlacedOrder {
  orderId: string;
  date: string;
  time: string;
  items: OrderItem[];
  address: {
    label: string;
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  subtotal: number;
  tax: number;
  total: number;
  status?: string; // Placed, Confirmed, Out for Delivery, Delivered
}

export default function MyOrdersPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [orders, setOrders] = useState<PlacedOrder[]>([]);
  const [activeTab, setActiveTab] = useState<'All' | 'Placed' | 'Out for Delivery' | 'Delivered'>('All');

  useEffect(() => {
    // Load orders from localStorage
    const savedOrdersStr = localStorage.getItem('hossen_shop_placed_orders');
    if (savedOrdersStr) {
      try {
        const loadedOrders: PlacedOrder[] = JSON.parse(savedOrdersStr);
        setOrders(loadedOrders);
      } catch (e) {
        console.error("Error parsing orders:", e);
      }
    }
  }, []);

  if (!isLoggedIn) {
    return <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center font-sans text-neutral-500">Checking authentication...</div>;
  }

  // Filter orders based on active tab
  const filteredOrders = orders.filter(order => {
    const status = order.status || 'Placed';
    if (activeTab === 'All') return true;
    return status.toLowerCase() === activeTab.toLowerCase();
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5]">
      <Header />

      <main className="flex-grow py-10 px-4 sm:px-8 lg:px-16 flex flex-col gap-6 max-w-7xl mx-auto w-full font-sans text-left">
        
        {/* Title */}
        <h1 className="font-serif text-3xl font-bold text-neutral-900 tracking-tight">
          My Orders
        </h1>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'All', label: 'All Orders' },
            { id: 'Placed', label: 'Placed' },
            { id: 'Out for Delivery', label: 'Out for Delivery' },
            { id: 'Delivered', label: 'Delivered' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-5 rounded-full font-bold text-xs sm:text-sm tracking-wide transition-all border shrink-0 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#0F2C1F] text-white border-[#0F2C1F] shadow-sm'
                  : 'bg-white text-neutral-500 border-neutral-200/50 hover:text-neutral-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders Cards List */}
        <div className="flex flex-col gap-4 w-full">
          {filteredOrders.length === 0 ? (
            <div className="bg-white border border-neutral-100 rounded-3xl p-12 text-center text-neutral-400 flex flex-col items-center gap-4">
              <svg className="w-12 h-12 text-neutral-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
              <span className="font-bold text-sm">No orders found matching this status</span>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.orderId}
                onClick={() => router.push(`/orders/${order.orderId}`)}
                className="bg-white border border-neutral-100/80 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col gap-4 relative group"
              >
                {/* Card Top Row */}
                <div className="flex justify-between items-start gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="font-sans font-bold text-sm sm:text-base text-neutral-800">
                      Order #{order.orderId}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-neutral-400 font-semibold">
                      {/* Calendar Icon */}
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                      </svg>
                      {order.date}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Dynamic Status pill */}
                    <span className={`font-bold text-xs px-3 py-1 rounded-full border ${
                      order.status === 'Placed' ? 'bg-blue-50 text-blue-500 border-blue-100/40' :
                      order.status === 'Confirmed' ? 'bg-orange-50 text-orange-500 border-orange-100/40' :
                      order.status === 'Assigned' ? 'bg-indigo-50 text-indigo-500 border-indigo-100/40' :
                      order.status === 'Out for Delivery' ? 'bg-purple-50 text-purple-600 border-purple-100/40' :
                      'bg-green-50 text-green-600 border-green-100/40'
                    }`}>
                      {order.status || 'Placed'}
                    </span>
                    {/* Right Chevron */}
                    <svg className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 transition-colors" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                </div>

                {/* Thumbnails Row */}
                <div className="flex items-center gap-3 overflow-x-auto py-1">
                  {order.items.map((item, idx) => (
                    <div 
                      key={`${item.id}-${idx}`}
                      className="w-14 h-14 rounded-xl bg-[#FAF8F5] border border-neutral-100 flex items-center justify-center p-2 shrink-0 overflow-hidden"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-contain mix-blend-multiply"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23bbb'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4'/%3E%3C/svg%3E";
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* Card Bottom Row */}
                <div className="flex justify-between items-center text-sm font-bold border-t border-neutral-50 pt-3">
                  <span className="text-neutral-400 font-bold">
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                  </span>
                  <span className="text-neutral-800 text-base">
                    ${order.total.toFixed(2)}
                  </span>
                </div>

              </div>
            ))
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
}
