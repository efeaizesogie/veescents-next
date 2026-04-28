'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { Product } from '@/types';
import ProductCard from './ProductCard';

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'women', label: 'Women' },
  { id: 'men', label: 'Men' },
  { id: 'unisex', label: 'Unisex' },
];

export default function ProductBrowser({ products }: { products: Product[] }) {
  const searchParams = useSearchParams();
  const [visibleCount, setVisibleCount] = useState(8);
  const [sortOption, setSortOption] = useState('newest');
  const [activeCategory, setActiveCategory] = useState('all');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const cat = searchParams.get('cat');
    if (cat && CATEGORIES.some(c => c.id === cat)) setActiveCategory(cat);
  }, [searchParams]);

  const handleCategoryChange = (catId: string) => {
    if (catId === activeCategory) return;
    setIsAnimating(true);
    setActiveCategory(catId);
    setVisibleCount(8);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const processedProducts = useMemo(() => {
    let result = activeCategory !== 'all' ? products.filter(p => p.category === activeCategory) : [...products];
    if (sortOption === 'price-asc') result.sort((a, b) => a.price - b.price);
    else if (sortOption === 'price-desc') result.sort((a, b) => b.price - a.price);
    else if (sortOption === 'rating') result.sort((a, b) => b.rating - a.rating);
    else result.sort((a, b) => b.id - a.id);
    return result;
  }, [products, sortOption, activeCategory]);

  const currentProducts = processedProducts.slice(0, visibleCount);
  const hasMore = visibleCount < processedProducts.length;

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-gray-200 pb-4">
        <div className="flex flex-wrap gap-6 text-sm uppercase tracking-wider font-medium text-gray-400 mb-4 md:mb-0">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`transition-all duration-300 pb-1 border-b-2 ${activeCategory === cat.id ? 'text-accent-dark border-accent-dark' : 'border-transparent hover:text-accent-dark hover:border-gray-200'}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 font-medium">Sort by:</span>
          <div className="relative">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="appearance-none bg-transparent pl-3 pr-8 py-1 text-sm font-bold text-accent-dark border border-gray-200 rounded-sm focus:outline-none focus:border-accent-dark cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
          </div>
        </div>
      </div>

      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16 min-h-[500px] transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
        {currentProducts.length > 0 ? (
          currentProducts.map(product => (
            <div key={product.id} className="animate-fade-in">
              <ProductCard product={product} />
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-gray-400">
            <p>No products found in this category.</p>
            <button onClick={() => handleCategoryChange('all')} className="mt-4 text-accent-gold underline hover:text-accent-dark">
              View all products
            </button>
          </div>
        )}
      </div>

      {hasMore && !isAnimating && (
        <div className="flex justify-center mt-16">
          <button
            onClick={() => setVisibleCount(prev => prev + 4)}
            className="px-10 py-3 border border-gray-300 text-xs font-bold uppercase tracking-widest hover:bg-accent-dark hover:text-white hover:border-accent-dark transition-all duration-300"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
