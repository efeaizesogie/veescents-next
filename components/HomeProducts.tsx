'use client';

import React, { useState, useRef } from 'react';
import { useStore } from '@/context/StoreContext';
import ProductCard from './ProductCard';
import SectionTitle from './SectionTitle';
import SkeletonProductCard from './SkeletonProductCard';
import ProductBrowser from './ProductBrowser';

export default function HomeProducts() {
  const { newCollection, galleryProducts, isLoading } = useStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const initialProducts = newCollection.filter(p => p.isNew || p.isNewProduct);
  const visibleProducts = isExpanded ? newCollection : initialProducts;

  const handleToggleExpand = () => {
    if (isExpanded) sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <section id="new-collection" className="py-20 container mx-auto px-6 scroll-mt-20" ref={sectionRef}>
        <SectionTitle title="New Collection" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
          {isLoading
            ? Array.from({ length: 4 }).map((_, idx) => <SkeletonProductCard key={idx} />)
            : visibleProducts.map(product => (
                <div key={product.id} className="animate-fade-in">
                  <ProductCard product={product} />
                </div>
              ))}
        </div>
        {!isLoading && newCollection.length > initialProducts.length && (
          <div className="flex justify-center">
            <button
              onClick={handleToggleExpand}
              className="group flex flex-col items-center gap-1 text-sm font-bold uppercase tracking-widest text-accent-dark hover:text-accent-gold transition-colors"
            >
              {isExpanded ? 'View Less' : 'View More'}
              <span className={`h-px bg-current transition-all duration-300 ${isExpanded ? 'w-full' : 'w-0 group-hover:w-full'}`} />
            </button>
          </div>
        )}
      </section>

      <section id="store" className="py-24 container mx-auto px-6 scroll-mt-20">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl text-accent-dark">Our Store</h2>
        </div>
        <ProductBrowser products={galleryProducts} />
      </section>
    </>
  );
}
