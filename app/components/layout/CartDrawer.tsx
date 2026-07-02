"use client";

import React, { useEffect, useRef } from 'react';
import { useCart } from '../../lib/CartContext';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/AuthContext';

export default function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    cartCount,
    cartTotal,
  } = useCart();

  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close drawer on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCartOpen(false);
      }
    };
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCartOpen, setIsCartOpen]);

  // Click outside to close
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
      setIsCartOpen(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Dark Overlay Background */}
      <div
        onClick={handleOverlayClick}
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
      />

      {/* Drawer Container Panel */}
      <div
        ref={drawerRef}
        className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            {/* Cart Icon */}
            <div className="text-neutral-700">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-neutral-800 font-sans">Your Cart</h2>
            <span className="bg-neutral-100 text-neutral-600 text-xs font-bold px-2 py-0.5 rounded-full font-sans">
              {cartCount} {cartCount === 1 ? 'item' : 'items'}
            </span>
          </div>
          {/* Close Trigger */}
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 -mr-2 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
          >
            <svg
              className="w-5 h-5 stroke-[2.5]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Items List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cartItems.length > 0 ? (
            <div className="flex flex-col gap-3">
              {cartItems.map((item) => {
                const totalItemPrice = item.product.price * item.quantity;
                return (
                  <div
                    key={item.product.id}
                    className="bg-neutral-50/50 border border-neutral-100/50 rounded-2xl p-4 flex items-center justify-between gap-4"
                  >
                    {/* Left: Thumbnail Image */}
                    <div className="w-16 h-16 shrink-0 bg-white rounded-xl border border-neutral-100/70 p-2 flex items-center justify-center">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    {/* Middle: Details & Counter */}
                    <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                      <div>
                        <h4 className="font-semibold text-neutral-800 text-sm truncate font-sans">
                          {item.product.name}
                        </h4>
                        <p className="text-xs text-neutral-400 font-sans">
                          ${item.product.price.toFixed(2)} / {item.product.unit}
                        </p>
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center border border-neutral-200 rounded-lg w-fit bg-white px-2 py-0.5 text-neutral-700 font-sans font-bold">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-5 text-center text-sm hover:text-brand-green transition-colors cursor-pointer select-none"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-xs">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-5 text-center text-sm hover:text-brand-green transition-colors cursor-pointer select-none"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Right: Subtotal Price & Delete Button */}
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-bold text-neutral-800 text-sm font-sans">
                        ${totalItemPrice.toFixed(2)}
                      </span>
                      {/* Trash Can Button */}
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-1.5 text-neutral-400 hover:text-brand-orange transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                          />
                        </svg>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-20">
              <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center text-neutral-300 mb-4">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"
                  />
                </svg>
              </div>
              <h3 className="font-serif text-base font-bold text-neutral-800 mb-1">Your cart is empty</h3>
              <p className="text-xs text-neutral-400 font-sans max-w-xs px-4 leading-relaxed">
                Browse our fresh local categories and add products to get started on your order.
              </p>
            </div>
          )}
        </div>

        {/* Footer Billing Details */}
        <div className="border-t border-neutral-100 p-6 flex flex-col gap-4 bg-white shrink-0 shadow-inner">
          <div className="flex flex-col gap-2 font-sans text-sm">
            <div className="flex justify-between text-neutral-500">
              <span>Subtotal</span>
              <span className="font-semibold text-neutral-700">${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-neutral-500">
              <span>Delivery</span>
              <span className="font-semibold text-emerald-600">Free</span>
            </div>
          </div>

          <div className="h-[1px] bg-neutral-100 my-1" />

          <div className="flex justify-between items-baseline font-sans">
            <span className="text-base font-bold text-neutral-800">Total</span>
            <span className="text-xl font-extrabold text-neutral-900">${cartTotal.toFixed(2)}</span>
          </div>

          {/* Checkout CTA */}
          <button
            onClick={() => {
              setIsCartOpen(false);
              if (isLoggedIn) {
                router.push('/checkout');
              } else {
                router.push('/login?redirect=/checkout');
              }
            }}
            disabled={cartItems.length === 0}
            className="w-full bg-brand-orange hover:bg-brand-orange-hover disabled:bg-neutral-200 disabled:cursor-not-allowed text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer text-sm sm:text-base"
          >
            Proceed to Checkout
            <svg
              className="w-4 h-4 stroke-[2.5]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>

      </div>
    </div>
  );
}
