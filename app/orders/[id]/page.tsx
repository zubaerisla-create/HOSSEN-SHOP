"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '../../components/layout/Header';
import Footer from '../../components/home/Footer';
import { useAuth } from '../../lib/AuthContext';
import { api } from '../../lib/api';

interface PlacedOrder {
  orderId: string;
  date: string;
  time: string;
  items: Array<{
    id: string | number;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
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
  status?: 'Placed' | 'Confirmed' | 'Assigned' | 'Out for Delivery' | 'Delivered';
  deliveryPartner?: string;
}

export default function OrderDetailsPage() {
  const router = useRouter();
  const { id } = useParams();
  const { isLoggedIn } = useAuth();
  const [order, setOrder] = useState<PlacedOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderDateStr, setOrderDateStr] = useState('July 2, 2026');
  const [orderTimeStr, setOrderTimeStr] = useState('12:29 PM');
  const [partnerInfo, setPartnerInfo] = useState<{ name: string; vehicle: string; phone: string } | null>(null);

  // Load partner details if assigned
  useEffect(() => {
    if (order && order.deliveryPartner) {
      const savedPartners = localStorage.getItem('hossen_shop_admin_partners');
      if (savedPartners) {
        try {
          const partners = JSON.parse(savedPartners);
          const matched = partners.find((p: any) => p.name.toLowerCase() === order.deliveryPartner?.toLowerCase());
          if (matched) {
            setPartnerInfo({
              name: matched.name,
              vehicle: matched.vehicle,
              phone: matched.phone
            });
            return;
          }
        } catch (e) {
          console.error(e);
        }
      }
      // Fallback
      setPartnerInfo({
        name: order.deliveryPartner,
        vehicle: "Bike",
        phone: "+880 1712-345678"
      });
    } else {
      setPartnerInfo(null);
    }
  }, [order]);

  useEffect(() => {
    const fetchOrderData = async () => {
      setLoading(true);
      try {
        const orderIdStr = Array.isArray(id) ? id[0] : id;
        if (!orderIdStr) {
          setOrder(null);
          setLoading(false);
          return;
        }

        const data = await api.getOrderById(orderIdStr);
        if (data) {
          const orderDate = new Date(data.createdAt);
          const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
          const formattedDate = `${months[orderDate.getMonth()]} ${orderDate.getDate()}, ${orderDate.getFullYear()}`;
          
          let hours = orderDate.getHours();
          const minutes = orderDate.getMinutes().toString().padStart(2, '0');
          const ampm = hours >= 12 ? 'PM' : 'AM';
          hours = hours % 12;
          hours = hours ? hours : 12;
          const formattedTime = `${hours}:${minutes} ${ampm}`;

          setOrderDateStr(formattedDate);
          setOrderTimeStr(formattedTime);

          // Get address from localStorage fallback
          let orderAddr = {
            label: "Home",
            street: "123 Main St",
            city: "Dhaka",
            state: "Dhaka",
            zip: "1212"
          };
          
          const savedAddressesStr = localStorage.getItem('hossen_shop_addresses');
          if (savedAddressesStr) {
            try {
              const list = JSON.parse(savedAddressesStr);
              const found = list.find((a: any) => a.isDefault) || list[0];
              if (found) {
                orderAddr = {
                  label: found.label,
                  street: found.street,
                  city: found.city,
                  state: found.state,
                  zip: found.zip
                };
              }
            } catch {}
          }

          const mappedItems = (data.items || []).map((it: any) => ({
            id: it.id,
            name: it.product?.name || 'Unknown Item',
            price: it.price || 0.0,
            quantity: it.quantity || 1,
            image: it.product?.image || '/images/default_product.png'
          }));

          const subtotal = mappedItems.reduce((acc: number, it: any) => acc + (it.price * it.quantity), 0);
          const tax = subtotal * 0.08;

          setOrder({
            orderId: data.id,
            date: formattedDate,
            time: formattedTime,
            items: mappedItems,
            address: orderAddr,
            subtotal,
            tax,
            total: data.totalAmount || (subtotal + tax),
            status: data.status,
            deliveryPartner: data.deliveryPartner || undefined
          });
        } else {
          setOrder(null);
        }
      } catch (err) {
        console.error('Failed to fetch order from API:', err);
        // Fallback to localStorage
        const savedOrdersStr = localStorage.getItem('hossen_shop_placed_orders');
        if (savedOrdersStr) {
          try {
            const savedOrders: PlacedOrder[] = JSON.parse(savedOrdersStr);
            const matched = savedOrders.find(o => o.orderId === id);
            if (matched) {
              setOrder(matched);
              setLoading(false);
              return;
            }
          } catch (e) {
            console.error("Error reading placed orders:", e);
          }
        }
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [id]);

  const isStepCompleted = (stepName: string) => {
    const status = order?.status || 'Placed';
    const statusOrder = ['Placed', 'Confirmed', 'Assigned', 'Packed', 'Out for Delivery', 'Delivered'];
    
    const currentIdx = statusOrder.indexOf(status);
    const stepIdx = statusOrder.indexOf(stepName);
    
    if (stepName === 'Packed' && (status === 'Out for Delivery' || status === 'Delivered')) {
      return true;
    }

    return currentIdx >= stepIdx;
  };

  if (!isLoggedIn) {
    return <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center font-sans text-neutral-500">Checking authentication...</div>;
  }

  if (loading) {
    return <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center font-sans text-neutral-500">Loading order...</div>;
  }

  if (order === null) {
    return (
      <div className="flex flex-col min-h-screen bg-[#FAF8F5]">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center gap-4 text-center px-4">
          <svg className="w-14 h-14 text-neutral-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
          </svg>
          <p className="font-bold text-neutral-700 text-lg">Order not found</p>
          <p className="text-sm text-neutral-400">This order does not exist or may have been removed.</p>
          <button
            onClick={() => router.push('/orders')}
            className="mt-2 px-6 py-2.5 bg-[#0F2C1F] text-white text-sm font-bold rounded-full hover:bg-[#1a4a33] transition-colors cursor-pointer"
          >
            Back to My Orders
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5]">
      <Header />

      <main className="flex-grow py-10 px-4 sm:px-8 lg:px-16 flex flex-col gap-6 max-w-7xl mx-auto w-full font-sans text-left">
        
        {/* Back Link */}
        <button 
          onClick={() => router.push('/')}
          className="flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-700 transition-colors font-semibold self-start cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to Orders
        </button>

        {/* Title Bar */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
              Order #{order.orderId}
            </h1>
            <p className="text-xs text-neutral-400 font-semibold">
              Placed on {orderDateStr}
            </p>
          </div>
          <span className={`font-bold text-xs sm:text-sm px-4 py-1.5 rounded-full shadow-sm border ${
            order.status === 'Placed' ? 'bg-blue-50 text-blue-500 border-blue-100/50' :
            order.status === 'Confirmed' ? 'bg-orange-50 text-orange-500 border-orange-100/50' :
            order.status === 'Assigned' ? 'bg-indigo-50 text-indigo-500 border-indigo-100/50' :
            order.status === 'Out for Delivery' ? 'bg-purple-50 text-purple-600 border-purple-100/50' :
            'bg-green-50 text-green-600 border-green-100/50'
          }`}>
            {order.status || 'Placed'}
          </span>
        </div>

        {/* Two Column Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Left Side: Map & Tracker (Takes 2/3 space) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Map Frame Card Mockup */}
            <div className="bg-white rounded-3xl border border-neutral-100 overflow-hidden shadow-sm aspect-[21/9] sm:aspect-[21/8] relative select-none">
              {/* Stylized Vector Street Map Illustration using pure SVG / CSS */}
              <div className="absolute inset-0 bg-[#E8ECE9] overflow-hidden">
                <svg className="w-full h-full opacity-65" viewBox="0 0 800 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Water Body (Canal/River) */}
                  <path d="M 0,220 C 180,240 320,180 500,200 C 650,215 720,250 800,230 L 800,300 L 0,300 Z" fill="#C3D2E2" />
                  
                  {/* Green Park Areas */}
                  <rect x="50" y="30" width="120" height="90" rx="10" fill="#D3E0D6" />
                  <rect x="620" y="40" width="140" height="110" rx="10" fill="#D3E0D6" />
                  
                  {/* Street Roads Grid */}
                  <line x1="0" y1="80" x2="800" y2="80" stroke="#FFF" strokeWidth="8" />
                  <line x1="0" y1="170" x2="800" y2="170" stroke="#FFF" strokeWidth="12" />
                  <line x1="0" y1="260" x2="800" y2="260" stroke="#FFF" strokeWidth="8" />
                  
                  <line x1="120" y1="0" x2="120" y2="300" stroke="#FFF" strokeWidth="10" />
                  <line x1="380" y1="0" x2="380" y2="300" stroke="#FFF" strokeWidth="14" strokeDasharray="3 3" />
                  <line x1="560" y1="0" x2="560" y2="300" stroke="#FFF" strokeWidth="8" />
                  
                  {/* Secondary Streets */}
                  <line x1="280" y1="80" x2="380" y2="170" stroke="#FFF" strokeWidth="6" />
                  <line x1="380" y1="170" x2="480" y2="260" stroke="#FFF" strokeWidth="6" />
                </svg>

                {/* Styled Marker Pin */}
                <div className="absolute top-1/2 left-[47%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center select-none">
                  {/* Pulser rings */}
                  <div className="w-10 h-10 rounded-full bg-brand-orange/30 animate-ping absolute -top-1" />
                  <div className="w-12 h-12 rounded-full bg-brand-green/20 animate-pulse absolute -top-2" />
                  
                  {/* Pin SVG */}
                  <svg className="w-8 h-8 text-[#FF5C00] relative drop-shadow-md" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              {/* Map Attribution UI overlay */}
              <div className="absolute bottom-1 right-2 bg-white/75 backdrop-blur-sm px-1.5 py-0.5 text-[8px] text-neutral-500 rounded font-mono font-medium">
                Leaflet | Map mockup
              </div>
            </div>

            {/* Delivery Progress Card */}
            <div className="bg-white rounded-3xl border border-neutral-100 p-6 sm:p-8 shadow-sm flex flex-col gap-6">
              <h2 className="font-serif text-lg font-bold text-neutral-800">
                Delivery Progress
              </h2>

              {/* Stepper Timeline */}
              <div className="relative pl-12 flex flex-col gap-8">
                {/* Stepper Vertical connector Line */}
                <div className="absolute left-[20px] top-6 bottom-6 w-[2px] bg-neutral-100" />

                {/* Step 1: Placed */}
                <div className={`relative flex flex-col items-start gap-1 transition-all ${isStepCompleted('Placed') ? 'opacity-100' : 'opacity-55'}`}>
                  <div className={`absolute -left-[44px] w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all ${
                    isStepCompleted('Placed') ? 'bg-[#0F2C1F] text-white' : 'bg-white border-2 border-neutral-200 text-neutral-400'
                  }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="font-sans font-bold text-sm text-neutral-800">Placed</span>
                  <span className="text-[10px] text-neutral-400 font-semibold">
                    {orderDateStr.substring(0, 5)}, {orderTimeStr}
                  </span>
                </div>

                {/* Step 2: Confirmed */}
                <div className={`relative flex flex-col items-start gap-1 transition-all ${isStepCompleted('Confirmed') ? 'opacity-100' : 'opacity-55'}`}>
                  <div className={`absolute -left-[44px] w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-all ${
                    isStepCompleted('Confirmed') ? 'bg-[#0F2C1F] text-white shadow-md' : 'bg-white border-2 border-neutral-200 text-neutral-400'
                  }`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <span className="font-sans font-bold text-sm text-neutral-800">Confirmed</span>
                </div>

                {/* Step 3: Assigned */}
                <div className={`relative flex flex-col items-start gap-1 transition-all ${isStepCompleted('Assigned') ? 'opacity-100' : 'opacity-55'}`}>
                  <div className={`absolute -left-[44px] w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-all ${
                    isStepCompleted('Assigned') ? 'bg-[#0F2C1F] text-white shadow-md' : 'bg-white border-2 border-neutral-200 text-neutral-400'
                  }`}>
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.129-1.125v-3.197m0 0a9.01 9.01 0 00-1.129-1.688L16.2 7.875a1.125 1.125 0 00-.84-.375H9.75M19.5 14.25a2.25 2.25 0 00-2.25-2.25h-10.5A2.25 2.25 0 004.5 14.25m15 0h-15" />
                    </svg>
                  </div>
                  <span className="font-sans font-bold text-sm text-neutral-800">Assigned</span>
                </div>

                {/* Step 4: Packed */}
                <div className={`relative flex flex-col items-start gap-1 transition-all ${isStepCompleted('Packed') ? 'opacity-100' : 'opacity-55'}`}>
                  <div className={`absolute -left-[44px] w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-all ${
                    isStepCompleted('Packed') ? 'bg-[#0F2C1F] text-white shadow-md' : 'bg-white border-2 border-neutral-200 text-neutral-400'
                  }`}>
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                    </svg>
                  </div>
                  <span className="font-sans font-bold text-sm text-neutral-800">Packed</span>
                </div>

                {/* Step 5: Out for Delivery */}
                <div className={`relative flex flex-col items-start gap-1 transition-all ${isStepCompleted('Out for Delivery') ? 'opacity-100' : 'opacity-55'}`}>
                  <div className={`absolute -left-[44px] w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-all ${
                    isStepCompleted('Out for Delivery') ? 'bg-[#0F2C1F] text-white shadow-md' : 'bg-white border-2 border-neutral-200 text-neutral-400'
                  }`}>
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.129-1.125v-3.197m0 0a9.01 9.01 0 00-1.129-1.688L16.2 7.875a1.125 1.125 0 00-.84-.375H9.75M19.5 14.25a2.25 2.25 0 00-2.25-2.25h-10.5A2.25 2.25 0 004.5 14.25m15 0h-15" />
                    </svg>
                  </div>
                  <span className="font-sans font-bold text-sm text-neutral-800">Out for Delivery</span>
                </div>

                {/* Step 6: Delivered */}
                <div className={`relative flex flex-col items-start gap-1 transition-all ${isStepCompleted('Delivered') ? 'opacity-100' : 'opacity-55'}`}>
                  <div className={`absolute -left-[44px] w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-all ${
                    isStepCompleted('Delivered') ? 'bg-[#0F2C1F] text-white shadow-md' : 'bg-white border-2 border-neutral-200 text-neutral-400'
                  }`}>
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <span className="font-sans font-bold text-sm text-neutral-800">Delivered</span>
                </div>

              </div>

            </div>

          </div>

          {/* Right Side: Address & Order Summary (Takes 1/3 space) */}
          <div className="flex flex-col gap-6">
            
            {/* Delivery Rider Card */}
            {partnerInfo && (
              <div className="bg-white rounded-3xl border border-neutral-100 p-6 shadow-sm flex flex-col gap-4">
                <div className="flex items-center gap-2 text-neutral-800">
                  {/* Rider / Scooter Icon */}
                  <svg className="w-5 h-5 text-neutral-400 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.129-1.125v-3.197" />
                  </svg>
                  <h3 className="text-sm font-bold tracking-wide">Assigned Delivery Rider</h3>
                </div>
                <div className="flex items-center gap-3 border-t border-neutral-50 pt-3">
                  <div className="w-10 h-10 rounded-full bg-[#0F2C1F] text-white flex items-center justify-center font-bold text-base select-none shrink-0">
                    {partnerInfo.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col text-sm text-neutral-500 font-medium text-left">
                    <span className="font-bold text-neutral-800">{partnerInfo.name}</span>
                    <span className="text-[11px] text-neutral-400 font-semibold">{partnerInfo.vehicle}</span>
                  </div>
                  <a 
                    href={`tel:${partnerInfo.phone}`}
                    className="ml-auto p-2 bg-[#F0FDF4] hover:bg-[#DCFCE7] border border-[#DCFCE7] text-emerald-600 rounded-xl transition-all cursor-pointer"
                    title="Call Rider"
                  >
                    <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.502-5.18-3.856-6.681-6.681l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                  </a>
                </div>
              </div>
            )}

            {/* Delivery Address Card */}
            <div className="bg-white rounded-3xl border border-neutral-100 p-6 shadow-sm flex flex-col gap-3">
              <div className="flex items-center gap-2 text-neutral-800">
                <svg className="w-4.5 h-4.5 text-neutral-400 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <h3 className="text-sm font-bold tracking-wide">Delivery Address</h3>
              </div>
              <div className="flex flex-col text-sm text-neutral-500 font-medium">
                <span className="font-bold text-neutral-800 mb-0.5">{order.address.label}</span>
                <span>{order.address.street}</span>
                <span>{order.address.city}, {order.address.state} {order.address.zip}</span>
              </div>
            </div>

            {/* Items Ordered List Card */}
            <div className="bg-white rounded-3xl border border-neutral-100 p-6 shadow-sm flex flex-col gap-5">
              <h3 className="text-sm font-bold text-neutral-800 tracking-wide border-b border-neutral-50 pb-2">
                Items ({order.items.reduce((sum, item) => sum + item.quantity, 0)})
              </h3>

              <div className="flex flex-col gap-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 text-left">
                    <div className="flex items-center gap-3">
                      {/* Image Frame */}
                      <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] border border-neutral-100 flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-contain mix-blend-multiply"
                          onError={(e) => {
                            // Fallback to stock/mock product icon if image doesn't load
                            (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23bbb'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4'/%3E%3C/svg%3E";
                          }}
                        />
                      </div>
                      
                      <div className="flex flex-col">
                        <span className="font-sans font-bold text-xs sm:text-sm text-neutral-800 line-clamp-1">{item.name}</span>
                        <span className="text-[11px] text-neutral-400 font-bold">x{item.quantity}</span>
                      </div>
                    </div>

                    <span className="font-sans font-bold text-xs sm:text-sm text-neutral-800 shrink-0">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Subtotal, Delivery, Tax and Grand Total */}
              <div className="border-t border-neutral-50 pt-4 flex flex-col gap-2.5 text-xs sm:text-sm text-neutral-500 font-medium">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-neutral-800">${Number(order.subtotal || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span className="font-bold text-emerald-600">Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span className="font-bold text-neutral-800">${Number(order.tax || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-neutral-100 pt-3 text-sm sm:text-base font-extrabold text-neutral-900">
                  <span>Total</span>
                  <span className="text-[#0F2C1F]">${Number(order.total || 0).toFixed(2)}</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
