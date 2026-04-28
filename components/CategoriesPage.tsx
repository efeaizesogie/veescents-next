'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Search, X } from 'lucide-react';
import SectionTitle from './SectionTitle';
import { useStore } from '@/context/StoreContext';
import ProductCard from './ProductCard';
import RecommendedPerfumes from './RecommendedPerfumes';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
}

const PAGE_SIZE = 12;
const FALLBACK = 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1000&auto=format&fit=crop';

export default function CategoriesPage() {
  const { products, isLoading, trackSearch } = useStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('best_selling');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch('/api/admin/categories', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .finally(() => setLoadingCats(false));
  }, []);

  const categoryTabs = useMemo(() => ([
    { _id: 'all', name: 'All', slug: 'all', description: 'All categories', image: '' },
    ...categories,
  ]), [categories]);

  const filtered = useMemo(() => {
    let list = activeCategory === 'all'
      ? [...products]
      : products.filter((p) => p.category === activeCategory);

    if (search) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
    }

    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    else if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
    else if (sort === 'newest') list.sort((a, b) => (a.isNewProduct === b.isNewProduct ? 0 : a.isNewProduct ? -1 : 1));
    else list.sort((a, b) => (b.salesCount ?? 0) - (a.salesCount ?? 0));

    return list;
  }, [products, activeCategory, search, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const currentCategory = categoryTabs.find((c) => c.slug === activeCategory);

  return (
    <div className="page-shell bg-cream-50 min-h-screen">
      <div className="container mx-auto px-6">
        <SectionTitle title="Categories" subtitle="Browse by category with quick discovery tools." />

        {loadingCats ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-28 rounded-sm bg-white animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
            {categoryTabs.map((cat) => {
              const active = activeCategory === cat.slug;
              return (
                <button
                  key={cat._id}
                  onClick={() => { setActiveCategory(cat.slug); setPage(1); }}
                  className={`relative h-28 overflow-hidden rounded-sm border text-left ${active ? 'border-accent-gold' : 'border-gray-100'} group`}
                >
                  {cat.image ? (
                    <Image src={cat.image} alt={cat.name} fill className="object-cover" sizes="240px" />
                  ) : (
                    <Image src={FALLBACK} alt={cat.name} fill className="object-cover" sizes="240px" unoptimized />
                  )}
                  <div className={`absolute inset-0 ${active ? 'bg-black/35' : 'bg-black/50 group-hover:bg-black/40'} transition-colors`} />
                  <div className="absolute inset-0 p-3 flex flex-col justify-end">
                    <p className="text-white text-sm font-semibold">{cat.name}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        <div className="bg-white p-4 rounded-sm shadow-sm mb-8 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div>
            <h2 className="font-serif text-2xl text-accent-dark">{currentCategory?.name || 'All'}</h2>
            <p className="text-sm text-gray-600">{currentCategory?.description || 'Browse perfumes in this category.'}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="relative">
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                  trackSearch(e.target.value);
                }}
                placeholder="Search perfumes..."
                className="pl-9 pr-8 py-2 border border-gray-200 rounded-sm text-sm w-full sm:w-64 focus:outline-none focus:border-accent-dark"
              />
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                  <X size={13} />
                </button>
              )}
            </div>
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
              className="px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-accent-dark"
            >
              <option value="best_selling">Best Selling</option>
              <option value="newest">New Arrivals</option>
              <option value="rating">Top Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => <div key={i} className="bg-white rounded-sm aspect-square animate-pulse" />)}
          </div>
        ) : visible.length === 0 ? (
          <div className="text-center py-20 text-gray-400 bg-white rounded-sm border border-gray-100">
            <p className="font-serif text-2xl mb-2">No perfumes found</p>
            <p className="text-sm">Try another category or clear your search.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {visible.map((product) => (
                <div key={product.id} className="animate-fade-in">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-between">
              <p className="text-xs text-gray-500">{filtered.length} products • Page {safePage} of {totalPages}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={safePage <= 1}
                  className="px-3 py-2 text-xs font-bold uppercase tracking-widest border border-gray-300 rounded-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Prev
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage >= totalPages}
                  className="px-3 py-2 text-xs font-bold uppercase tracking-widest border border-gray-300 rounded-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}

        <RecommendedPerfumes searchTerm={search} category={activeCategory} excludeIds={visible.map((p) => p.id)} />
      </div>
    </div>
  );
}
