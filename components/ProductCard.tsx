'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { Product } from '@/types';
import { useStore } from '@/context/StoreContext';

const EXCHANGE_RATE = 1600;

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const router = useRouter();
  const isWishlisted = isInWishlist(product.id);

  return (
    <div className="group flex flex-col items-center relative cursor-pointer" onClick={() => router.push(`/product/${product.id}`)}>
      <button
        onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
        className="absolute top-2 right-2 z-20 p-2 rounded-full bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white text-accent-gold shadow-sm transform translate-y-2 group-hover:translate-y-0"
        aria-label="Toggle Wishlist"
      >
        <Heart size={18} className={`transition-colors duration-300 ${isWishlisted ? 'fill-accent-gold text-accent-gold' : 'text-gray-400 hover:text-accent-gold'}`} />
      </button>

      <div className="relative w-full aspect-[4/5] bg-gray-100 mb-6 overflow-hidden rounded-sm">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      <div className="flex gap-0.5 mb-3">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`text-xs ${i < product.rating ? 'text-accent-gold' : 'text-gray-300'}`}>★</span>
        ))}
      </div>

      <h3 className="font-serif text-lg text-accent-dark mb-1 group-hover:text-accent-gold transition-colors text-center">{product.name}</h3>
      <p className="text-gray-500 text-xs uppercase tracking-wide mb-2">{product.brand}</p>

      <div className="flex flex-col items-center gap-2">
        <span className="text-accent-gold font-medium">₦{(product.price * EXCHANGE_RATE).toLocaleString()}</span>
        <button
          onClick={(e) => { e.stopPropagation(); addToCart(product); }}
          className="text-xs font-bold uppercase border-b border-transparent hover:border-accent-dark text-gray-400 hover:text-accent-dark transition-all pb-0.5 active:scale-95"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
