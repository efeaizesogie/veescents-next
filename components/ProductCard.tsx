'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { Product } from '@/types';
import { useStore } from '@/context/StoreContext';

const EXCHANGE_RATE = 1;

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, isInWishlist, trackProductView } = useStore();
  const router = useRouter();
  const isWishlisted = isInWishlist(product.id);

  return (
    <div className="group flex flex-col items-center relative cursor-pointer" onClick={() => { trackProductView(product.id); router.push(`/product/${product.id}`); }}>
      <button
        onClick={(e) => { e.stopPropagation(); trackProductView(product.id); toggleWishlist(product); }}
        className="absolute top-2 right-2 z-20 p-1.5 rounded-full bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white text-accent-gold shadow-sm transform translate-y-2 group-hover:translate-y-0"
        aria-label="Toggle Wishlist"
      >
        <Heart size={15} className={`transition-colors duration-300 ${isWishlisted ? 'fill-accent-gold text-accent-gold' : 'text-gray-400 hover:text-accent-gold'}`} />
      </button>

      <div className="relative w-full aspect-square bg-white mb-3 overflow-hidden rounded-sm border border-gray-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain object-center transform group-hover:scale-105 transition-transform duration-700 ease-out p-2"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      <div className="flex gap-0.5 mb-1">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`text-[10px] ${i < product.rating ? 'text-accent-gold' : 'text-gray-300'}`}>★</span>
        ))}
      </div>

      <h3 className="text-xs sm:text-sm font-medium text-accent-dark mb-0.5 group-hover:text-accent-gold transition-colors text-center line-clamp-2 leading-snug px-1">{product.name}</h3>
      <p className="text-gray-400 text-[10px] uppercase tracking-wide mb-1.5">{product.brand}</p>

      <div className="flex flex-col items-center gap-1.5">
        <span className="text-accent-gold font-semibold text-sm">₦{(product.price * EXCHANGE_RATE).toLocaleString()}</span>
        <button
          onClick={(e) => { e.stopPropagation(); trackProductView(product.id); addToCart(product); }}
          className="text-[10px] font-bold uppercase border-b border-transparent hover:border-accent-dark text-gray-400 hover:text-accent-dark transition-all pb-0.5 active:scale-95"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
