'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { X, Search } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import ProductCard from './ProductCard';

export default function SearchOverlay({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { products } = useStore();

  const allProducts = useMemo(() => {
    const unique = new Map();
    products.forEach(p => unique.set(p.id, p));
    return Array.from(unique.values());
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase();
    return allProducts.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.brand.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term)
    );
  }, [searchTerm, allProducts]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = 'unset';
      setSearchTerm('');
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-white/95 backdrop-blur-xl animate-fade-in flex flex-col">
      <div className="container mx-auto px-6 py-6 border-b border-gray-100 bg-white/50">
        <div className="relative flex items-center">
          <Search className="absolute left-0 text-gray-400 w-6 h-6" />
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-transparent text-2xl md:text-4xl font-serif text-accent-dark placeholder-gray-300 focus:outline-none pl-12 pr-12 py-4"
            placeholder="Type to search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={onClose} className="absolute right-0 p-2 hover:bg-gray-100 rounded-full transition-colors group">
            <X className="w-8 h-8 text-gray-400 group-hover:text-accent-gold" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-6 py-12">
          {searchTerm ? (
            filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {filteredProducts.map(product => (
                  <div key={product.id} onClick={onClose} className="animate-fade-in">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <p className="text-xl">No matches found for &quot;{searchTerm}&quot;</p>
                <p className="text-sm mt-2">Try searching for a different perfume, brand, or category.</p>
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center py-32 opacity-30 pointer-events-none select-none">
              <Search size={48} className="mb-4 text-gray-400" />
              <p className="font-serif text-2xl text-gray-500">Search Veescents</p>
              <p className="text-sm text-gray-400 mt-2">Find your signature scent</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
