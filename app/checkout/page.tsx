"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/AuthContext';
import { useCart } from '../lib/CartContext';
import Header from '../components/layout/Header';
import Footer from '../components/home/Footer';

interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  isDefault: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { isLoggedIn, user, addresses } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();

  // Auth protection guard
  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login?redirect=/checkout');
    }
  }, [isLoggedIn, router]);

  // Page Sub-states
  const [step, setStep] = useState<'address' | 'payment' | 'review'>('address');
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod'>('cod');
  
  // Success view state
  const [isOrdered, setIsOrdered] = useState<boolean>(false);

  // Set default selected address id once addresses are loaded
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
      setSelectedAddressId(defaultAddr.id);
    }
  }, [addresses, selectedAddressId]);

  // Dynamic calculations
  const tax = cartTotal * 0.08;
  const orderTotal = cartTotal + tax;

  const handlePlaceOrder = () => {
    const selectedAddress = addresses.find(addr => addr.id === selectedAddressId) || addresses.find(addr => addr.isDefault) || addresses[0];
    
    // Generate a unique order ID matching format like #E03449D2
    const randomId = "E" + Math.floor(100000 + Math.random() * 900000).toString(16).toUpperCase();
    
    const orderData = {
      orderId: randomId,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      items: cartItems.map(item => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image
      })),
      address: selectedAddress ? {
        label: selectedAddress.label,
        street: selectedAddress.street,
        city: selectedAddress.city,
        state: selectedAddress.state,
        zip: selectedAddress.zip
      } : {
        label: "dfsrd",
        street: "rtgsfd",
        city: "gfs",
        state: "gfs",
        zip: "453"
      },
      subtotal: cartTotal,
      tax: tax,
      total: orderTotal
    };

    // Load existing orders, append, and save
    const existingOrdersStr = localStorage.getItem('hossen_shop_placed_orders');
    let existingOrders = [];
    if (existingOrdersStr) {
      try {
        existingOrders = JSON.parse(existingOrdersStr);
      } catch (e) {
        console.error("Error reading placed orders:", e);
      }
    }
    existingOrders.unshift(orderData);
    localStorage.setItem('hossen_shop_placed_orders', JSON.stringify(existingOrders));

    // Clear cart and redirect to order tracking page
    clearCart();
    router.push(`/orders/${randomId}`);
  };

  const selectedAddress = addresses.find(addr => addr.id === selectedAddressId) || addresses.find(addr => addr.isDefault);

  if (!isLoggedIn) {
    return <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center font-sans text-neutral-500">Checking authentication...</div>;
  }

  if (isOrdered) {
    return (
      <div className="flex flex-col min-h-screen bg-[#FAF8F5]">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="bg-white rounded-3xl p-8 sm:p-12 max-w-md shadow-lg border border-neutral-100 flex flex-col items-center gap-6">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 animate-bounce">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="font-serif text-3xl font-bold text-neutral-800">Order Placed!</h1>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Thank you for shopping with Hossen Shop. Your organic groceries are on their way! Redirecting to home...
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5]">
      <Header />
      <main className="flex-grow py-10 px-4 sm:px-8 lg:px-16 flex flex-col gap-8 max-w-7xl mx-auto w-full font-sans">
      
      {/* Top Back Link */}
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-700 transition-colors font-semibold self-start cursor-pointer"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back
      </button>

      {/* Page Title */}
      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight">
        Checkout
      </h1>

      {/* Tabs Sub-Navigation Header */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 shrink-0">
        
        {/* Address Tab */}
        <button
          onClick={() => setStep('address')}
          className={`flex items-center gap-2 py-2 px-5 rounded-full font-bold text-xs sm:text-sm tracking-wide transition-all border ${
            step === 'address'
              ? 'bg-[#0F2C1F] text-white border-[#0F2C1F] shadow-sm'
              : 'bg-white text-neutral-500 border-neutral-200/60 hover:text-neutral-700'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          Address
          <span className="opacity-60 font-medium"> &gt;</span>
        </button>

        {/* Payment Tab */}
        <button
          onClick={() => {
            if (addresses.length > 0) {
              setStep('payment');
            }
          }}
          disabled={addresses.length === 0}
          className={`flex items-center gap-2 py-2 px-5 rounded-full font-bold text-xs sm:text-sm tracking-wide transition-all border disabled:opacity-50 disabled:cursor-not-allowed ${
            step === 'payment'
              ? 'bg-[#0F2C1F] text-white border-[#0F2C1F] shadow-sm'
              : 'bg-white text-neutral-500 border-neutral-200/60 hover:text-neutral-700'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75-3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
          </svg>
          Payment
          <span className="opacity-60 font-medium"> &gt;</span>
        </button>

        {/* Review Tab */}
        <button
          onClick={() => {
            if (addresses.length > 0) {
              setStep('review');
            }
          }}
          disabled={addresses.length === 0}
          className={`flex items-center gap-2 py-2 px-5 rounded-full font-bold text-xs sm:text-sm tracking-wide transition-all border disabled:opacity-50 disabled:cursor-not-allowed ${
            step === 'review'
              ? 'bg-[#0F2C1F] text-white border-[#0F2C1F] shadow-sm'
              : 'bg-white text-neutral-500 border-neutral-200/60 hover:text-neutral-700'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Review
        </button>

      </div>

      {/* Main Split Layout */}
      <div className="flex flex-col lg:flex-row items-start gap-8">
        
        {/* Left Side: Dynamic Forms */}
        <div className="w-full lg:w-2/3 bg-white rounded-3xl p-6 sm:p-8 border border-neutral-100 shadow-sm flex flex-col gap-6">
          
          {/* STEP 1: ADDRESS */}
          {step === 'address' && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2.5">
                <div className="text-neutral-700">
                  <svg className="w-5 h-5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
                <h2 className="font-serif text-xl font-bold text-neutral-800">
                  Delivery Address
                </h2>
              </div>

              {/* Saved Addresses list */}
              {addresses.length > 0 ? (
                <div className="flex flex-col gap-4">
                  <h3 className="text-xs font-bold text-neutral-400 tracking-wide uppercase">Saved Addresses</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <div 
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`p-4 rounded-xl border-2 text-left cursor-pointer transition-all ${
                          selectedAddressId === addr.id
                            ? 'border-[#0F2C1F] bg-neutral-50/40'
                            : 'border-neutral-200/70 hover:border-neutral-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-sans font-bold text-sm text-neutral-800">{addr.label}</span>
                          {addr.isDefault && (
                            <span className="text-[9px] bg-brand-orange/10 text-brand-orange font-bold px-1.5 py-0.5 rounded">
                              DEFAULT
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-500 font-sans leading-relaxed">
                          {addr.street}<br />
                          {addr.city}, {addr.state} {addr.zip}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Add New Address Trigger Button */}
              <button
                onClick={() => router.push('/addresses?from=checkout')}
                className="w-full py-4 rounded-xl border border-dashed border-neutral-300 hover:border-neutral-400 text-neutral-500 font-bold text-sm transition-all hover:bg-neutral-50/50 cursor-pointer text-center"
              >
                Add New Address +
              </button>

              {/* Action Trigger Button */}
              <button
                onClick={() => setStep('payment')}
                disabled={addresses.length === 0}
                className={`py-3.5 px-6 rounded-xl font-bold text-white shadow-sm flex items-center justify-center gap-1.5 transition-all self-start ${
                  addresses.length > 0 
                    ? 'bg-[#0F2C1F] hover:bg-[#091a12] active:scale-95 cursor-pointer'
                    : 'bg-[#8C9A90] cursor-not-allowed'
                }`}
              >
                Continue to Payment
                <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          )}

          {/* STEP 2: PAYMENT */}
          {step === 'payment' && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2.5">
                <div className="text-neutral-700">
                  <svg className="w-5 h-5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75-3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                  </svg>
                </div>
                <h2 className="font-serif text-xl font-bold text-neutral-800">
                  Payment Method
                </h2>
              </div>

              {/* Methods options list */}
              <div className="flex flex-col gap-3.5">
                
                {/* Credit/Debit Card Option */}
                <div 
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-xl border flex items-center justify-between gap-4 cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'border-[#0F2C1F] bg-neutral-50/40 shadow-sm'
                      : 'border-neutral-200/70 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex flex-col gap-1 text-left font-sans">
                    <span className="font-bold text-sm text-neutral-800">Credit / Debit Card</span>
                    <span className="text-xs text-neutral-400 font-medium">Pay securely with your card</span>
                  </div>
                  <div className="relative flex items-center justify-center">
                    <input 
                      type="radio" 
                      checked={paymentMethod === 'card'} 
                      onChange={() => setPaymentMethod('card')}
                      className="w-4 h-4 text-brand-green border-neutral-300 focus:ring-brand-green accent-[#0F2C1F]"
                    />
                  </div>
                </div>

                {/* Cash on Delivery Option */}
                <div 
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-xl border flex items-center justify-between gap-4 cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-[#0F2C1F] bg-neutral-50/40 shadow-sm'
                      : 'border-neutral-200/70 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex flex-col gap-1 text-left font-sans">
                    <span className="font-bold text-sm text-neutral-800">Cash on Delivery</span>
                    <span className="text-xs text-neutral-400 font-medium">Pay when you receive</span>
                  </div>
                  <div className="relative flex items-center justify-center">
                    <input 
                      type="radio" 
                      checked={paymentMethod === 'cod'} 
                      onChange={() => setPaymentMethod('cod')}
                      className="w-4 h-4 text-brand-green border-neutral-300 focus:ring-brand-green accent-[#0F2C1F]"
                    />
                  </div>
                </div>

              </div>

              {/* Action Trigger Button */}
              <button
                onClick={() => setStep('review')}
                className="py-3.5 px-6 rounded-xl bg-[#0F2C1F] hover:bg-[#091a12] active:scale-95 text-white font-bold shadow-sm flex items-center justify-center gap-1.5 transition-all self-start cursor-pointer"
              >
                Review Order
                <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          )}

          {/* STEP 3: REVIEW */}
          {step === 'review' && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2.5">
                <div className="text-neutral-700">
                  <svg className="w-5 h-5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="font-serif text-xl font-bold text-neutral-800">
                  Review Your Order
                </h2>
              </div>

              {/* Selected address review sub-card */}
              {selectedAddress && (
                <div className="bg-neutral-50/50 border border-neutral-100 rounded-2xl p-5 text-left font-sans flex flex-col gap-2">
                  <span className="font-bold text-xs text-neutral-400 tracking-wider uppercase flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 014.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5h.008v.008h-.008V10.5zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0h.008v.008h-.008V10.5zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                    Delivery Address
                  </span>
                  <span className="font-bold text-neutral-800 text-sm">{selectedAddress.label} — {selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state}</span>
                </div>
              )}

              {/* Cart line items listings */}
              <div className="flex flex-col gap-3">
                {cartItems.map((item) => (
                  <div 
                    key={item.product.id}
                    className="flex items-center justify-between gap-4 py-3 border-b border-neutral-100 last:border-0"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 bg-neutral-50 rounded-xl p-1.5 flex items-center justify-center shrink-0 border border-neutral-100/60">
                        <img 
                          src={item.product.image} 
                          alt={item.product.name} 
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div className="flex flex-col text-left font-sans">
                        <span className="font-bold text-neutral-800 text-sm">{item.product.name}</span>
                        <span className="text-xs text-neutral-400">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-sans font-bold text-sm text-neutral-800">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Dynamic CTA Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                className="w-full bg-brand-orange hover:bg-brand-orange-hover text-white py-3.5 px-6 rounded-xl font-bold tracking-wide shadow-md active:scale-95 transition-all cursor-pointer text-center"
              >
                Place Order — ${orderTotal.toFixed(2)}
              </button>

            </div>
          )}

        </div>

        {/* Right Side: Order Summary Sidebar Card */}
        <div className="w-full lg:w-1/3 bg-white rounded-3xl p-6 sm:p-8 border border-neutral-100 shadow-sm flex flex-col gap-5 text-left">
          
          <h2 className="font-serif text-lg font-bold text-neutral-800">
            Order Summary
          </h2>

          <div className="flex flex-col gap-3 font-sans text-sm">
            <div className="flex justify-between text-neutral-400">
              <span>Subtotal ({cartItems.reduce((acc, it) => acc + it.quantity, 0)} items)</span>
              <span className="font-semibold text-neutral-700">${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Delivery</span>
              <span className="font-semibold text-emerald-600">Free</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Tax</span>
              <span className="font-semibold text-neutral-700">${tax.toFixed(2)}</span>
            </div>
          </div>

          <div className="h-[1px] bg-neutral-100 my-1" />

          <div className="flex justify-between items-baseline font-sans">
            <span className="text-base font-bold text-neutral-800">Total</span>
            <span className="text-xl font-extrabold text-neutral-900">${orderTotal.toFixed(2)}</span>
          </div>

        </div>

      </div>

    </main>
    <Footer />
  </div>
);
}
