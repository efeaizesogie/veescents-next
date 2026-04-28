'use client';

import { useStore } from '@/context/StoreContext';
import ProductCard from './ProductCard';
import SkeletonProductCard from './SkeletonProductCard';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Recommendations() {
  const { recommended, isLoading } = useStore();
  const visible = recommended.slice(0, 4);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-accent-gold mb-2 block">Curated For You</span>
            <h2 className="font-serif text-4xl text-accent-dark">Recommendations</h2>
          </div>
          <Link href="/store" className="hidden md:flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-accent-gold hover:text-accent-gold-dark transition-colors">
            Explore All <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonProductCard key={i} />)
            : visible.map(p => (
                <div key={p.id} className="animate-fade-in">
                  <ProductCard product={p} />
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
