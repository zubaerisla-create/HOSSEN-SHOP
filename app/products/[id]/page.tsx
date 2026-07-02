"use client";

import React, { useState, useMemo, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '../../components/layout/Header';
import Footer from '../../components/home/Footer';
import ProductCard from '../../components/ui/ProductCard';
import { products } from '../../lib/mockData';
import { api } from '../../lib/api';
import { useCart } from '../../lib/CartContext';
import { useEffect } from 'react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const { addToCart } = useCart();

  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await api.getProductById(id);
        if (data) {
          setProduct({
            id: data.id,
            name: data.name,
            price: data.price,
            originalPrice: data.originalPrice || undefined,
            unit: data.unit,
            image: data.image,
            category: data.category?.name || 'Fruits & Vegetables',
            rating: data.rating || 4.5,
            ratingCount: data.ratingCount || 12,
            discount: data.discount || undefined,
          });
        } else {
          // Fallback
          const mockItem = products.find((p) => p.id === id);
          setProduct(mockItem || null);
        }
      } catch (err) {
        console.error('Failed to fetch product detail from API:', err);
        // Fallback
        const mockItem = products.find((p) => p.id === id);
        setProduct(mockItem || null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Quantity Counter State
  const [quantity, setQuantity] = useState<number>(1);

  // Helpful reviews counter state
  const [helpfulCounts, setHelpfulCounts] = useState<{ [key: string]: number }>({
    'review-1': 14,
    'review-2': 5,
  });
  const [clickedHelpful, setClickedHelpful] = useState<{ [key: string]: boolean }>({});

  const handleHelpful = (reviewId: string) => {
    if (clickedHelpful[reviewId]) return;
    setHelpfulCounts((prev) => ({
      ...prev,
      [reviewId]: prev[reviewId] + 1,
    }));
    setClickedHelpful((prev) => ({
      ...prev,
      [reviewId]: true,
    }));
  };

  // Helper to resolve category for breadcrumbs and related products
  const categoryName = useMemo(() => {
    if (!product) return 'General';
    const nameLower = product.name.toLowerCase();
    if (nameLower.includes('carrot') || nameLower.includes('banana') || nameLower.includes('onion') || nameLower.includes('grapes') || nameLower.includes('strawberry') || nameLower.includes('apple')) {
      return 'Fruits & Vegetables';
    }
    if (nameLower.includes('paper') || nameLower.includes('toilet')) {
      return 'Personal Care';
    }
    if (nameLower.includes('rice') || nameLower.includes('honey')) {
      return 'Pantry Staples';
    }
    if (nameLower.includes('bread') || nameLower.includes('barley')) {
      return 'Bakery';
    }
    if (nameLower.includes('fanta') || nameLower.includes('sprite') || nameLower.includes('juice') || nameLower.includes('7 up') || nameLower.includes('coca-cola')) {
      return 'Beverages';
    }
    if (nameLower.includes('salmon')) {
      return 'Meat & Seafood';
    }
    if (nameLower.includes('soup') || nameLower.includes('noodles') || nameLower.includes('knorr') || nameLower.includes('maggi')) {
      return 'Snacks';
    }
    if (nameLower.includes('cheese') || nameLower.includes('milk') || nameLower.includes('eggs') || nameLower.includes('paneer') || nameLower.includes('yogurt') || nameLower.includes('amul')) {
      return 'Dairy & Eggs';
    }
    return 'General';
  }, [product]);

  // Related products: items in the same category, excluding current product
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    
    return products
      .filter((p) => {
        if (p.id === product.id) return false;
        
        // Match category logic
        const nameLower = p.name.toLowerCase();
        if (categoryName === 'Fruits & Vegetables') {
          return nameLower.includes('carrot') || nameLower.includes('banana') || nameLower.includes('onion') || nameLower.includes('grapes') || nameLower.includes('strawberry') || nameLower.includes('apple');
        }
        if (categoryName === 'Personal Care') {
          return nameLower.includes('paper') || nameLower.includes('toilet');
        }
        if (categoryName === 'Pantry Staples') {
          return nameLower.includes('rice') || nameLower.includes('honey');
        }
        if (categoryName === 'Bakery') {
          return nameLower.includes('bread') || nameLower.includes('barley');
        }
        if (categoryName === 'Beverages') {
          return nameLower.includes('fanta') || nameLower.includes('sprite') || nameLower.includes('juice') || nameLower.includes('7 up') || nameLower.includes('coca-cola');
        }
        if (categoryName === 'Meat & Seafood') {
          return nameLower.includes('salmon');
        }
        if (categoryName === 'Snacks') {
          return nameLower.includes('soup') || nameLower.includes('noodles') || nameLower.includes('knorr') || nameLower.includes('maggi');
        }
        if (categoryName === 'Dairy & Eggs') {
          return nameLower.includes('cheese') || nameLower.includes('milk') || nameLower.includes('eggs') || nameLower.includes('paneer') || nameLower.includes('yogurt') || nameLower.includes('amul');
        }
        return false;
      })
      .slice(0, 3); // Show top 3 related items
  }, [product, categoryName]);

  // Product descriptions map (to match the mockup)
  const productDescription = useMemo(() => {
    if (!product) return '';
    const descMap: { [key: string]: string } = {
      'Sprite 1.5L': 'Chilled and refreshing. Perfect for celebrations',
      'Fanta 1.5L': 'Sweet and vibrant orange soda, bursting with natural fruit flavors.',
      '7 Up 1.5L': 'Crisp, clean, lemon-lime taste, highly refreshing drink.',
      'Coca-Cola 1.5L': 'Original taste classic sparkling soft drink.',
      'Carrot 500g': 'Sweet, crispy orange carrots, direct from local organic farms.',
      'Barley 1kg': 'High-quality pearled barley grains, ideal for healthy soups and porridge.',
      'Brown Rice 1kg': 'Whole grain brown rice, packed with natural nutrients and fibers.',
      'Paneer 200g': 'Soft and fresh cottage cheese block, rich in protein and dairy goodness.',
      'Eggs 12 pcs': 'Farm-fresh organic white eggs, high quality and nutrient-dense.',
      'Amul Milk 1L': 'Pure, pasteurized cream milk, rich in taste and calcium.',
      'Wheat Flour 5kg': 'Finely milled whole wheat flour, perfect for soft rotis and baking.',
      'Orange 1 kg': 'Sweet and juicy citrus oranges, loaded with Vitamin C.'
    };
    return descMap[product.name] || 'Fresh, organic produce of premium quality, sourced directly from local growers.';
  }, [product]);

  // Mock stock counts for visuals
  const stockCount = useMemo(() => {
    if (!product) return 0;
    const codes = product.name.charCodeAt(0) + product.name.charCodeAt(product.name.length - 1);
    return (codes % 60) + 40; // Generate realistic stable stock count 40-100
  }, [product]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-site-bg">
        <Header />
        <main className="flex-grow flex items-center justify-center py-20">
          <div className="text-brand-green font-medium font-serif text-lg animate-pulse">Loading Product Details...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen bg-site-bg">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center py-20 px-4">
          <div className="text-center bg-white border border-neutral-100 p-8 rounded-3xl max-w-sm shadow-sm">
            <h2 className="font-serif text-2xl font-bold text-neutral-800 mb-2">Product Not Found</h2>
            <p className="text-sm text-neutral-500 font-sans mb-6">
              The item you are trying to view does not exist or has been removed from our catalog.
            </p>
            <button
              onClick={() => router.push('/products')}
              className="px-6 py-2.5 rounded-xl bg-brand-green hover:bg-brand-green-hover text-white text-sm font-semibold transition-all duration-200"
            >
              Back to Products
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-site-bg">
      {/* Global Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-8 lg:px-16 py-6">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs md:text-sm text-neutral-500 mb-4 font-sans">
          <Link href="/" className="hover:text-brand-green flex items-center gap-1.5 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            Home
          </Link>
          <span className="text-neutral-300">/</span>
          <Link href="/products" className="hover:text-brand-green transition-colors">Products</Link>
          <span className="text-neutral-300">/</span>
          <Link href={`/products?category=${encodeURIComponent(categoryName)}`} className="hover:text-brand-green transition-colors">
            {categoryName}
          </Link>
          <span className="text-neutral-300">/</span>
          <span className="text-brand-green font-medium">{product.name}</span>
        </div>

        {/* Back Link */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800 transition-colors mb-6 font-sans font-semibold cursor-pointer"
        >
          <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back
        </button>

        {/* Product Details Presentation Card */}
        <div className="bg-white border border-neutral-100 rounded-3xl p-6 sm:p-8 md:p-12 shadow-sm mb-12 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          
          {/* Left Side: Product Image Display */}
          <div className="aspect-square relative w-full max-w-md mx-auto bg-neutral-50 rounded-2xl p-6 flex items-center justify-center border border-neutral-100 overflow-hidden">
            {product.discount && (
              <span className="absolute top-4 left-4 z-10 bg-[#FF5C00] text-white text-xs font-bold px-2.5 py-1 rounded-md tracking-wider">
                {product.discount}% OFF
              </span>
            )}
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Right Side: Product Details Content */}
          <div className="flex flex-col items-start gap-4">
            
            {/* Category Tag */}
            <span className="text-xs uppercase tracking-wider text-neutral-400 font-sans font-semibold">
              {categoryName}
            </span>

            {/* Product Title */}
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 leading-tight">
              {product.name}
            </h1>

            {/* Star Rating and reviews count link */}
            <div className="flex items-center gap-1.5 text-sm">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="w-4 h-4 fill-[#FFB800] text-[#FFB800]"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="font-bold text-neutral-800 font-sans">{product.rating}</span>
              <a href="#reviews" className="text-neutral-400 font-sans hover:text-brand-green hover:underline">
                ({product.ratingCount} reviews)
              </a>
            </div>

            {/* Price block */}
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-neutral-900">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-lg text-neutral-400 line-through">${product.originalPrice.toFixed(2)}</span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-neutral-500 font-sans leading-relaxed mt-1">
              {productDescription}
            </p>

            {/* Stock indicator */}
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-emerald-600 font-sans font-medium mt-1">
              <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              In Stock ({stockCount} available)
            </div>

            {/* Quantity Selector and Add to Cart Section */}
            <div className="flex items-center gap-4 mt-4 w-full sm:w-auto">
              
              {/* Quantity Incrementor */}
              <div className="flex items-center bg-neutral-50 border border-neutral-200 rounded-xl py-2 px-3 font-sans font-bold text-neutral-800">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 text-center text-lg hover:text-brand-green transition-colors cursor-pointer select-none"
                >
                  −
                </button>
                <span className="w-8 text-center text-sm">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 text-center text-lg hover:text-brand-green transition-colors cursor-pointer select-none"
                >
                  +
                </button>
              </div>

              {/* Add to Cart button */}
              <button
                onClick={() => addToCart(product, quantity)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-sm sm:text-base font-bold py-3 px-8 rounded-xl shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
                Add to Cart
              </button>

            </div>

          </div>

        </div>

        {/* Customer Reviews Section */}
        <section id="reviews" className="mb-12">
          <h2 className="font-serif text-2xl font-bold text-neutral-900 mb-6">
            Customer Reviews
          </h2>
          
          <div className="bg-white border border-neutral-100 rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm flex flex-col md:flex-row gap-8 items-start mb-8">
            
            {/* Average Rating Score Block */}
            <div className="flex flex-col items-center justify-center text-center w-full md:w-48 py-4 border-r-0 md:border-r border-neutral-100 shrink-0">
              <span className="text-5xl font-extrabold text-neutral-900 font-sans mb-1">4.5</span>
              <div className="flex items-center mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="w-4 h-4 fill-[#FFB800] text-[#FFB800]"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-neutral-400 font-sans">
                {product.ratingCount} reviews
              </span>
            </div>

            {/* Rating distribution breakdown histogram */}
            <div className="flex-1 w-full flex flex-col gap-2 font-sans text-xs sm:text-sm text-neutral-500">
              {/* 5★ */}
              <div className="flex items-center gap-3">
                <span className="w-6 text-right font-medium">5 ★</span>
                <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-orange w-1/2 rounded-full" />
                </div>
                <span className="w-4 text-left">3</span>
              </div>

              {/* 4★ */}
              <div className="flex items-center gap-3">
                <span className="w-6 text-right font-medium">4 ★</span>
                <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-orange w-1/2 rounded-full" />
                </div>
                <span className="w-4 text-left">3</span>
              </div>

              {/* 3★ */}
              <div className="flex items-center gap-3">
                <span className="w-6 text-right font-medium">3 ★</span>
                <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div className="h-full bg-neutral-100 w-0 rounded-full" />
                </div>
                <span className="w-4 text-left">0</span>
              </div>

              {/* 2★ */}
              <div className="flex items-center gap-3">
                <span className="w-6 text-right font-medium">2 ★</span>
                <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div className="h-full bg-neutral-100 w-0 rounded-full" />
                </div>
                <span className="w-4 text-left">0</span>
              </div>

              {/* 1★ */}
              <div className="flex items-center gap-3">
                <span className="w-6 text-right font-medium">1 ★</span>
                <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div className="h-full bg-neutral-100 w-0 rounded-full" />
                </div>
                <span className="w-4 text-left">0</span>
              </div>
            </div>

          </div>

          {/* Individual Reviews List */}
          <div className="flex flex-col gap-6">
            
            {/* Review 1 */}
            <div className="bg-white border border-neutral-100 rounded-2xl p-6 shadow-sm flex flex-col gap-3 font-sans">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-neutral-100 text-neutral-600 font-bold flex items-center justify-center text-sm">
                    RM
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-800 text-sm">Rahul M.</h4>
                    <span className="text-[10px] text-neutral-400">29 Jun 2026</span>
                  </div>
                </div>
                {/* 4 Stars */}
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4].map((star) => (
                    <svg key={star} className="w-3.5 h-3.5 fill-[#FFB800] text-[#FFB800]" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <svg className="w-3.5 h-3.5 fill-neutral-200 text-neutral-200" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
              <p className="text-sm text-neutral-600 leading-relaxed">
                This has become a staple in my kitchen now. Highly recommended for everyone!
              </p>
              <button
                onClick={() => handleHelpful('review-1')}
                className={`flex items-center gap-1.5 text-xs w-fit ${
                  clickedHelpful['review-1'] ? 'text-brand-green font-semibold' : 'text-neutral-400 hover:text-neutral-600'
                } transition-colors cursor-pointer`}
              >
                <svg className="w-3.5 h-3.5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h-2.25M5.904 18.75c.083.205.173.405.27.601M4.5 18.75h-.75a2.25 2.25 0 01-2.25-2.25V12a2.25 2.25 0 012.25-2.25h.75m0 9v-9" />
                </svg>
                Helpful ({helpfulCounts['review-1']})
              </button>
            </div>

            {/* Review 2 */}
            <div className="bg-white border border-neutral-100 rounded-2xl p-6 shadow-sm flex flex-col gap-3 font-sans">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-neutral-100 text-neutral-600 font-bold flex items-center justify-center text-sm">
                    KP
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-800 text-sm">Karan P.</h4>
                    <span className="text-[10px] text-neutral-400">15 May 2026</span>
                  </div>
                </div>
                {/* 4 Stars */}
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4].map((star) => (
                    <svg key={star} className="w-3.5 h-3.5 fill-[#FFB800] text-[#FFB800]" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <svg className="w-3.5 h-3.5 fill-neutral-200 text-neutral-200" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Quality is decent but I expected it to be a bit fresher. Still a solid buy overall.
              </p>
              <button
                onClick={() => handleHelpful('review-2')}
                className={`flex items-center gap-1.5 text-xs w-fit ${
                  clickedHelpful['review-2'] ? 'text-brand-green font-semibold' : 'text-neutral-400 hover:text-neutral-600'
                } transition-colors cursor-pointer`}
              >
                <svg className="w-3.5 h-3.5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h-2.25M5.904 18.75c.083.205.173.405.27.601M4.5 18.75h-.75a2.25 2.25 0 01-2.25-2.25V12a2.25 2.25 0 012.25-2.25h.75m0 9v-9" />
                </svg>
                Helpful ({helpfulCounts['review-2']})
              </button>
            </div>

          </div>
        </section>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="border-t border-neutral-100 pt-10">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="font-serif text-2xl font-bold text-neutral-900 mb-1">
                  Related Products
                </h2>
                <p className="text-sm text-neutral-500 font-sans">
                  More from {categoryName.toLowerCase()}
                </p>
              </div>

              {/* View All links back to that category */}
              <Link
                href={`/products?category=${encodeURIComponent(categoryName)}`}
                className="flex items-center gap-1 text-sm font-semibold text-brand-orange hover:text-brand-orange-hover hover:underline transition-colors duration-150"
              >
                View All
                <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
