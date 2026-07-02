import React from 'react';
import Header from './components/layout/Header';
import HeroSection from './components/home/HeroSection';
import CategoriesSection from './components/home/CategoriesSection';
import PopularProducts from './components/home/PopularProducts';
import AppBanner from './components/home/AppBanner';
import Newsletter from './components/home/Newsletter';
import Footer from './components/home/Footer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-site-bg">
      {/* Header Layout */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-grow">
        <h1 className="sr-only">Hossen Shop Grocery Store - Fresh and Organic Groceries Delivered</h1>

        {/* Hero Section */}
        <HeroSection />

        {/* Browse Categories Section */}
        <CategoriesSection />

        {/* Popular Products Grid Section */}
        <PopularProducts />

        {/* Download App Banner Section */}
        <AppBanner />

        {/* Newsletter Subscription Section */}
        <Newsletter />


      </main>

      {/* Simple Footer */}
      <footer className="">
        <Footer />
      </footer>
    </div>
  );
}
