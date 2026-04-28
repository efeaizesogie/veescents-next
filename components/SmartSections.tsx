'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, Star, TrendingUp, Wallet, Gift, Sparkles, Droplets, Package } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import ProductCard from './ProductCard';
import SkeletonProductCard from './SkeletonProductCard';

const EXCHANGE_RATE = 1;

const TABS = [
  { id: 'recommended', label: 'Recommended', icon: Sparkles },
  { id: 'top_rated',   label: 'Top Rated',   icon: Star },
  { id: 'best_selling',label: 'Best Selling', icon: TrendingUp },
  { id: 'under_20k',  label: 'Under ₦20k',  icon: Wallet },
  { id: 'under_10k',  label: 'Under ₦10k',  icon: Wallet },
  { id: 'under_5k',   label: 'Under ₦5k',   icon: Wallet },
  { id: 'perfume_oil', label: 'Perfume Oils', icon: Droplets },
  { id: 'combos',     label: 'Combos',       icon: Package },
  { id: 'gift_sets',  label: 'Gift Sets',    icon: Gift },
] as const;

type TabId = typeof TABS[number]['id'];

const TAGLINES: Record<TabId, string> = {
  recommended:  'Handpicked based on ratings & popularity',
  top_rated:    'Highest rated by our customers',
  best_selling: 'Flying off the shelves',
  under_20k:    'Luxury doesn\'t have to cost a fortune',
  under_10k:    'Premium scents under ₦10,000 — our promise',
  under_5k:     'Real luxury, real cheap — that\'s Veescents',
  perfume_oil:  'Long-lasting oils, rich & concentrated',
  combos:       'Curated sets for maximum value',
  gift_sets:    'Perfect presents for every occasion',
};

export default function SmartSections() {
  const { products, isLoading } = useStore();
  const [activeTab, setActiveTab] = useState<TabId>('recommended');

  const slices = useMemo((): Record<TabId, typeof products> => {
    const base = [...products];
    const byNgn = (p: typeof products[0]) => p.price * EXCHANGE_RATE;

    return {
      recommended:  [...base].sort((a, b) => (b.rating + (b.salesCount ?? 0) * 0.1) - (a.rating + (a.salesCount ?? 0) * 0.1)).slice(0, 8),
      top_rated:    [...base].sort((a, b) => b.rating - a.rating).slice(0, 8),
      best_selling: [...base].sort((a, b) => (b.salesCount ?? 0) - (a.salesCount ?? 0)).slice(0, 8),
      under_20k:    base.filter(p => byNgn(p) <= 20000).sort((a, b) => a.price - b.price).slice(0, 8),
      under_10k:    base.filter(p => byNgn(p) <= 10000).sort((a, b) => a.price - b.price).slice(0, 8),
      under_5k:     base.filter(p => byNgn(p) <= 5000).sort((a, b) => a.price - b.price).slice(0, 8),
      perfume_oil:  base.filter(p => p.cat === 'perfume_oil').slice(0, 8),
      combos:       base.filter(p => p.cat === 'combo').slice(0, 8),
      gift_sets:    base.filter(p => p.cat === 'gift_set' || p.category === 'unisex').slice(0, 8),
    };
  }, [products]);

  const visible = slices[activeTab] ?? [];

  return (
    <section className="py-20 bg-cream-50">
      <div className="container mx-auto px-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-accent-gold mb-2 block">Curated For You</span>
            <h2 className="font-serif text-4xl text-accent-dark">Smart Picks</h2>
            <p className="text-sm text-gray-400 mt-2 italic">{TAGLINES[activeTab]}</p>
          </div>
          <Link href="/store" className="hidden md:flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-accent-gold hover:text-accent-dark transition-colors">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        {/* Tabs — horizontally scrollable */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-10 scrollbar-hide -mx-1 px-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-widest whitespace-nowrap rounded-full transition-all flex-shrink-0 ${
                activeTab === id
                  ? 'bg-accent-dark text-white shadow-md'
                  : 'bg-white text-gray-500 border border-gray-200 hover:border-accent-gold hover:text-accent-gold'
              }`}
            >
              <Icon size={12} />
              {label}
            </button>
          ))}
        </div>

        {/* Budget badge for cheap tabs */}
        {(activeTab === 'under_5k' || activeTab === 'under_10k') && (
          <div className="mb-8 inline-flex items-center gap-2 bg-accent-gold/10 border border-accent-gold/30 px-4 py-2 rounded-full">
            <span className="text-accent-gold text-xs font-bold uppercase tracking-widest">
              💛 Veescents Promise — Luxury for Less
            </span>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonProductCard key={i} />)
            : visible.length > 0
              ? visible.slice(0, 4).map(p => (
                  <div key={p.id} className="animate-fade-in">
                    <ProductCard product={p} />
                  </div>
                ))
              : (
                <div className="col-span-full text-center py-16 text-gray-400">
                  <p className="font-serif text-xl mb-1">No products here yet</p>
                  <p className="text-sm">Add products with the matching category in the admin panel.</p>
                </div>
              )
          }
        </div>

        {/* Mobile view all */}
        <div className="mt-10 text-center md:hidden">
          <Link href="/store" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-accent-gold">
            View All <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
